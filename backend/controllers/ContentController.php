<?php

namespace app\controllers;

use app\behaviors\PaidOnlyBehavior;
use app\components\Helpers;
use app\models\Category;
use app\models\Content;
use app\models\ContentSearch;
use yii\base\InvalidConfigException;
use yii\base\Model;
use yii\data\ActiveDataFilter;
use yii\data\ActiveDataProvider;
use yii\data\Pagination;
use yii\db\Expression;
use yii\helpers\ArrayHelper;
use yii\helpers\Json;
use yii\validators\NumberValidator;
use Yii;

class ContentController extends ActiveController
{
    public $modelClass = Content::class;

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $behaviors['access']['rules'] = [
            [
                'allow' => true,
                'actions' => ['index', 'view'],
                'roles' => ['@'],
            ],
            [
                'allow' => true,
                'actions' => ['create', 'update', 'delete'],
                'roles' => ['admin'],
            ],
        ];

        $behaviors['paid'] = PaidOnlyBehavior::class;

        return $behaviors;
    }

    /**
     * @return array
     */
    public function actions(): array
    {
        $actions = parent::actions();
        unset($actions['index'], $actions['create'], $actions['view'], $actions['update'], $actions['delete']);

        return $actions;
    }

    /**
     * @return ActiveDataProvider|Model
     * @throws InvalidConfigException
     */
    public function actionIndex()
    {
        $requestParams = Yii::$app->getRequest()->getBodyParams();
        if (empty($requestParams)) {
            $requestParams = Yii::$app->getRequest()->getQueryParams();
        }


        $randomSeed = ArrayHelper::getValue($requestParams, 'randomSeed', false);
        if ($randomSeed !== false) {
            $validator = new NumberValidator(['min' => 0, 'max' => 1]);
            if ($validator->validate($randomSeed, $error)) {
                Yii::$app->db->createCommand('SELECT SETSEED(:number)', [':number' => $randomSeed])->execute();
            }
        }

        $query = Content::find()->alias('t');
        // Custom filter by channelId here.
        if (isset($requestParams['filter']['youtubeChannelId'])) {
            $query->andWhere([
                '@>',
                'dataJson',
                Json::encode([
                    'youtubeVideo' => [
                        'channel' => [
                            'id' => (string) $requestParams['filter']['youtubeChannelId'],
                        ],
                    ],
                ]),
            ]);
            unset($requestParams['filter']['youtubeChannelId']);
        }

        $dataFilter = new ActiveDataFilter([
            'searchModel' => ContentSearch::class,
            'attributeMap' => [
                'isStudied' => '{{content_attribute}}.[[isStudied]]',
                'isHidden' => '{{content_attribute}}.[[isHidden]]',
                'categoryId' => '{{content_category}}.[[category_id]]',
            ],
        ]);

        $filter = null;
        if ($dataFilter->load($requestParams)) {
            $filter = $dataFilter->build();
            if ($filter === false) {
                return $dataFilter;
            }
        }

        if (!empty($filter)) {
            $query->andWhere($filter);
        }

        $alreadyJoined = [];
        /** @var ContentSearch $searchModel */
        $searchModel = $dataFilter->searchModel;
        if (isset($searchModel->categoryId)) {
            $query->joinWith('categories');
            $alreadyJoined['categories'] = null;
        }

        if (isset($searchModel->isStudied) || isset($searchModel->isHidden)) {
            $query->joinWith('contentAttribute');
            $alreadyJoined['categories'] = null;
        }

        if (isset($requestParams['expand']) && is_string($requestParams['expand'])) {
            $expand = preg_split('/\s*,\s*/', $requestParams['expand'], -1, PREG_SPLIT_NO_EMPTY);
        } else {
            $expand = [];
        }

        foreach ($expand as $relationName) {
            if (!isset($alreadyJoined[$relationName])) {
                $query->with($relationName);
            }
        }

        if (!Helpers::isAdmin()) {
            // Force filter by status
            $query->andWhere(['t.status' => 1]);
            $query->andWhere(['t.deleted' => 0]);
        }

        $query->select([/*'cleanText',*/ 't.id', 't.dataJson', 't.deleted', 't.format', 't.length', 't.level', 't.rank', 't.sourceLink', 't.status', 't.tagsJson', /*'text',*/ 't.title', 't.type']);
        //$query->orderBy(new Expression('RANDOM()'));

        // - if no filter below set, then load random content
        $requestSort = ArrayHelper::getValue($requestParams, ['sort'], '');
        $requestFilter = ArrayHelper::getValue($requestParams, ['filter'], []);
        if (!isset($requestFilter['categoryId'])
            && !isset($requestFilter['level'])
            && !isset($requestFilter['youtubeChannelId'])
            && !isset($requestFilter['length'])
            && !isset($requestFilter['type'])
            && substr($requestSort, -6) === 'random') {

            $pagination = new Pagination();
            $offset = $pagination->getOffset();
            $limit = $pagination->getLimit();

            $loadOffset = floor(($offset + $limit) * 2.5 ) + 1000;
            $subQuery = '(
                WITH params AS (
                   SELECT 1 AS min_id,
                   (SELECT (reltuples / relpages * (pg_relation_size(oid) / 8192))::bigint AS ct 
                   FROM pg_class WHERE oid = \'content\'::regclass) + 1000 AS id_span
                )
                SELECT *
                FROM  (
                   SELECT p.min_id + trunc(random() * p.id_span)::integer AS id
                   FROM params p, generate_series(1, :loadOffset) g
                   GROUP BY 1
                ) r JOIN "content" USING (id)
            )';

            $query->from(['t' => new Expression($subQuery)]);
            $query->addParams([':loadOffset' => $loadOffset]);
        }

        $dataProvider = new ActiveDataProvider([
            'query' => $query,
            'pagination' => [
                'params' => $requestParams,
            ],
            'sort' => [
                'params' => $requestParams,
                'defaultOrder' => ['rank' => SORT_ASC],
            ],
        ]);
        $dataProvider->sort->attributes['random'] = [
            'asc' => new Expression('RANDOM()'),
            'desc' => new Expression('RANDOM()'),
        ];


        return $dataProvider;
    }

    /**
     * @return array
     * @throws InvalidConfigException
     */
    public function actionCreate()
    {
        $content = new Content();
        $content->load(Yii::$app->getRequest()->getBodyParams(), '');
        if ($content->validate()) {
            $content->save();

            if (!empty($content->category)) {
                $categories = Category::find()->where(['id' => $content->category])->all();

                foreach ($categories as $category) {
                    $content->link('categories', $category);
                }
            }

            return ['done' => true];
        } else {
            return ['done' => false];
        }
    }

    /**
     * @param $id
     *
     * @return array|\yii\db\ActiveRecord|null
     */
    public function actionView($id)
    {
        return Content::find()->with('categories')->where(['id' => $id])->one();
    }

    /**
     * @param $id
     *
     * @return array
     * @throws InvalidConfigException
     */
    public function actionUpdate($id)
    {
        $content = Content::find()->with('categories')->where(['id' => $id])->one();
        $old_category = [];
        foreach ($content->categories as $category) {
            $old_category[] = $category->id;
        }
        $content->load(Yii::$app->getRequest()->getBodyParams(), '');
        if ($content->validate()) {
            $content->save();

            if (!empty($content->category)) {
                $new_category = $content->category;
                $cat_del = array_diff($old_category, $new_category);
                $cat_add = array_diff($new_category, $old_category);

                $categories_del = Category::find()->where(['id' => $cat_del])->all();
                foreach ($categories_del as $category) {
                    $content->unlink('categories', $category, true);
                }

                $categories_add = Category::find()->where(['id' => $cat_add])->all();
                foreach ($categories_add as $category) {
                    $content->link('categories', $category);
                }
            }

            return ['done' => true];
        } else {
            return ['done' => false];
        }
    }

    /**
     * @param $id
     *
     * @return array
     */
    public function actionDelete($id)
    {
        $content = Content::find()->where(['id' => $id])->one();
        $content['deleted'] = 1;

        if ($content->save()) {
            return ['done' => true];
        } else {
            return ['done' => false];
        }
    }
}
