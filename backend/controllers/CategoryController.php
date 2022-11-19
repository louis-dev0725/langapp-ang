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

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $availableToEveryone = ['options', 'index', 'view'];

        $behaviors['authenticator']['optional'] = $availableToEveryone;
        $behaviors['access']['rules'] = [
            [
                'allow' => true,
                'actions' => $availableToEveryone,
                //'roles' => ['?'],
            ],
            [
                'allow' => true,
                'actions' => ['create', 'update', 'delete'],
                'roles' => ['admin'],
            ],
        ];

        return $behaviors;
    }

    /**
     * @return ActiveDataProvider
     */
    public function actionIndex()
    {
        return new ActiveDataProvider([
            'query' => Category::find()->with('parentCategory'),
            'sort' => [
                'defaultOrder' => [
                    'id' => SORT_ASC,
                ],
            ],
            'pagination' => false,
        ]);
    }
}
