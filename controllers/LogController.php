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
        Yii::info('Тест', 'log_extension');
    }

}
