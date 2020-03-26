<?php

namespace app\controllers;


use app\models\Category;
use app\models\Content;
use Yii;
use yii\data\ActiveDataProvider;
use yii\web\NotFoundHttpException;

class ContentController extends ActiveController {
    public $modelClass = Content::class;

    public function actions() {
        $actions = parent::actions();
        unset($actions['index'], $actions['create']);
        return $actions;
    }

    /**
     * @return ActiveDataProvider
     * @throws NotFoundHttpException
     */
    public function actionIndex() {
        $filter = Yii::$app->request->queryParams;

        $query = Content::find();

        if (array_key_exists('title', $filter) && $filter['title'] != 'undefined' && $filter['title'] != '') {
            $query->andWhere(['like', 'title', urldecode($filter['title'])]);
        }

        if (array_key_exists('type', $filter) && $filter['type'] != 'undefined' && $filter['type'] != '') {
            $query->andWhere(['type_content' => (int)$filter['type']]);
        }

        if (array_key_exists('complication', $filter) && $filter['complication'] != 'undefined' &&
            $filter['complication'] != '') {
            $query->andWhere(['level_JLPT' => $filter['complication']]);
        }

        if (array_key_exists('volume', $filter) && $filter['volume'] != 'undefined' && $filter['volume'] != '') {
            $arrV = explode(',', $filter['volume']);
            if ($arrV[1] != 'unlimited') {
                $query->andWhere(['between', 'count_symbol', (int)$arrV[0], (int)$arrV[1]]);
            } else {
                $query->andWhere(['>=', 'count_symbol', (int)$arrV[0]]);
            }
        }

        $dataProvider = new ActiveDataProvider([
            'query' => $query
        ]);


        if ($dataProvider->getTotalCount() == 0) {
            throw new NotFoundHttpException('Materials not found');
        }

        return $dataProvider;
    }

    public function actionCreate() {
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

}
