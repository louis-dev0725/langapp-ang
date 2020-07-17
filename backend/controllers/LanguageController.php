<?php

namespace app\controllers;


use app\models\Languages;
use yii\data\ActiveDataProvider;
use yii\web\NotFoundHttpException;

class LanguageController extends ActiveController {

    public $modelClass = Languages::class;

    /**
     * @return ActiveDataProvider
     * @throws NotFoundHttpException
     */
    public function actionAll() {
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
