<?php

namespace app\controllers;


use app\models\Category;
use app\models\Content;
use Yii;
use yii\data\ActiveDataProvider;
use yii\web\NotFoundHttpException;

class ContentController extends ActiveController {
    public $modelClass = Content::class;

    /**
     * @return array
     */
    public function actions() {
        $actions = parent::actions();
        unset($actions['index'], $actions['create'], $actions['view'], $actions['update'], $actions['delete']);
        return $actions;
    }

    /**
     * @return ActiveDataProvider
     * @throws NotFoundHttpException
     */
    public function actionIndex() {
        $filter = Yii::$app->request->queryParams;

        $query = Content::find()->andWhere(['deleted' => 0]);

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
            'query' => $query,
            'sort' => [
                'defaultOrder' => [
                    'id' => SORT_DESC
                ],
            ]
        ]);


        if ($dataProvider->getTotalCount() == 0) {
            throw new NotFoundHttpException('Materials not found');
        }

        return $dataProvider;
    }

    /**
     * @return array
     * @throws \yii\base\InvalidConfigException
     */
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

    /**
     * @param $id
     *
     * @return array|\yii\db\ActiveRecord|null
     */
    public function actionView($id) {
        return Content::find()->with('categories')->where(['id' => $id])->asArray()->one();
    }

    /**
     * @param $id
     *
     * @return array
     * @throws \yii\base\InvalidConfigException
     */
    public function actionUpdate($id) {
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
    public function actionDelete($id) {
        $content = Content::find()->where(['id' => $id])->one();
        $content['deleted'] = 1;

        if ($content->save()) {
            return ['done' => true];
        } else {
            return ['done' => false];
        }
    }
}
