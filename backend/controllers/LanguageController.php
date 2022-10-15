<?php

namespace app\controllers;

use app\models\Languages;
use yii\data\ActiveDataProvider;
use yii\web\NotFoundHttpException;

class LanguageController extends ActiveController
{
    public $modelClass = Languages::class;

    public function behaviors()
    {
        $behaviors = parent::behaviors();
        $availableToEveryone = ['options', 'all'];

        $behaviors['authenticator']['optional'] = $availableToEveryone;
        $behaviors['access']['rules'] = [
            [
                'allow' => true,
                'actions' => $availableToEveryone,
            ],
        ];

        return $behaviors;
    }

    /**
     * @return ActiveDataProvider
     * @throws NotFoundHttpException
     */
    public function actionAll()
    {
        $dataProvider = new ActiveDataProvider([
            'query' => Languages::find(),
            'pagination' => false,
        ]);

        if ($dataProvider->getTotalCount() == 0) {
            throw new NotFoundHttpException('Language not found');
        }

        return $dataProvider;
    }
}
