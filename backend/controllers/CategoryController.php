<?php

namespace app\controllers;

use app\models\Category;
use yii\data\ActiveDataProvider;
use yii\web\NotFoundHttpException;

class CategoryController extends ActiveController
{
    public $modelClass = Category::class;

    public function actions()
    {
        $actions = parent::actions();
        unset($actions['index']);
        return $actions;
    }

    /**
     * @return ActiveDataProvider
     */
    public function actionIndex()
    {
        return new ActiveDataProvider([
            'query' => Category::find(),
            'pagination' => false,
        ]);
    }

    /**
     * @return ActiveDataProvider
     */
    public function actionAll()
    {
        return new ActiveDataProvider([
            'query' => Category::find()->with('parentCategory'),
            'sort' => [
                'defaultOrder' => [
                    'id' => SORT_DESC
                ],
            ]
        ]);
    }
}
