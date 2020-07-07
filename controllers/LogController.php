<?php

namespace app\controllers;


use app\models\SettingPlugin;
use Yii;

class LogController extends ActiveController {
    public $modelClass = SettingPlugin::class;

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
