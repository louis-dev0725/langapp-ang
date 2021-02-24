<?php

namespace app\controllers;

use app\components\Helpers;
use app\models\Category;
use app\models\Content;
use app\models\ContentSearch;
use app\models\Transaction;
use Yii;
use yii\data\ActiveDataFilter;
use yii\data\ActiveDataProvider;
use yii\rest\IndexAction;
use yii\web\ForbiddenHttpException;
use yii\web\NotFoundHttpException;

class ContentController extends ActiveController
{
    public $modelClass = Content::class;

    /**
     * @return array
     */
    public function actions()
    {
        $actions = parent::actions();

        $actions['index']['dataFilter'] = [
            'class' => ActiveDataFilter::class,
            'searchModel' => ContentSearch::class,
        ];
        $actions['index']['prepareDataProvider'] = [$this, 'prepareDataProvider'];

        unset($actions['create'], $actions['view'], $actions['update'], $actions['delete']);
        return $actions;
    }

    /**
     * @param IndexAction $action
     * @param mixed $filter
     * @return object|ActiveDataProvider
     * @throws \yii\base\InvalidConfigException
     * @throws ForbiddenHttpException
     */
    public function prepareDataProvider($action, $filter)
    {
        $requestParams = Yii::$app->getRequest()->getBodyParams();
        if (empty($requestParams)) {
            $requestParams = Yii::$app->getRequest()->getQueryParams();
        }

        $query = Content::find();
        if (!empty($filter)) {
            $query->andWhere($filter);
        }

        if (!Helpers::isAdmin()) {
            // Force filter by status
            $query->andWhere(['content.status' => 1]);
            $query->andWhere(['content.deleted' => 0]);
        }

//        if (isset($requestParams['expand']) && is_string($requestParams['expand'])) {
//            $expand = preg_split('/\s*,\s*/', $requestParams['expand'], -1, PREG_SPLIT_NO_EMPTY);
//        }
//        else {
//            $expand = [];
//        }
//        if (in_array('user', $expand)) {
//            $query->with('user');
//        }

        return Yii::createObject([
            'class' => ActiveDataProvider::class,
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
     * @throws \yii\base\InvalidConfigException
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

    public function actionImage($id) {
        return Content::find()->with('categories')->where(['id' => $id])->one();
    }

    /**
     * @param $id
     *
     * @return array
     * @throws \yii\base\InvalidConfigException
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
