<?php

namespace app\controllers;

use app\components\Helpers;
use app\models\Category;
use app\models\Content;
use app\models\ContentSearch;
use Yii;
use yii\base\InvalidConfigException;
use yii\base\Model;
use yii\data\ActiveDataFilter;
use yii\data\ActiveDataProvider;
use yii\helpers\Json;

class ContentController extends ActiveController
{
    public $modelClass = Content::class;

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

        $query = Content::find();

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
            $query->andWhere(['content.status' => 1]);
            $query->andWhere(['content.deleted' => 0]);
        }

        return new ActiveDataProvider([
            'query' => $query,
            'pagination' => [
                'params' => $requestParams,
            ],
            'sort' => [
                'params' => $requestParams,
                'defaultOrder' => ['rank' => SORT_ASC],
            ],
        ]);
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

    public function actionImage($id)
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
