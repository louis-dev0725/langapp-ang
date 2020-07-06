<?php

namespace app\controllers;


use Yii;

class LogController extends ActiveController {

    /**
     * @return array
     */
    public function actions() {
        $actions = parent::actions();
        unset($actions['create']);
        return $actions;
    }

    public function actionCreate() {
        $log = Yii::$app->getRequest()->getBodyParams();

        Yii::info($log, 'log_extension');
    }

}
