<?php

namespace app\controllers;


use app\models\Category;
use yii\data\ActiveDataProvider;
use yii\web\NotFoundHttpException;

class CategoryController extends ActiveController {
    public $modelClass = Category::class;

    public function actions() {
        $actions = parent::actions();
        unset($actions['index']);
        return $actions;
    }

    /**
     * @return ActiveDataProvider
     * @throws NotFoundHttpException
     */
    public function actionIndex() {
		$dataProvider = new ActiveDataProvider([
            'query' => Category::find(),
            'pagination' => false,
        ]);

        if ($dataProvider->getTotalCount() == 0) {
            throw new NotFoundHttpException('Category not found');
        }

        return $dataProvider;
    }

}
