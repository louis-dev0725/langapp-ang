<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;

class SiteController extends Controller
{

    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ]
        ];
    }

    function actionIndex($lang = '')
    {
        $availableLanguages = ['ru', 'en'];
        if (in_array($lang, $availableLanguages)) {
            Yii::$app->language = $lang;
            // TODO: save to cookies to use in Angular frontend
        }
        $this->layout = false;
        return $this->render('index');
    }

    function actionError()
    {
        return $this->render('error');
    }
}