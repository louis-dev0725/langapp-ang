<?php

namespace app\controllers;


use app\models\SettingPlugin;
use Yii;
use yii\filters\AccessControl;

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

	public function behaviors() {
        $behaviors['access'] = [
            'class' => AccessControl::class,
            'except' => ['options'],
            'rules' => [
                [
                    'allow' => true,
                    'roles' => ['?', '@'],
                ]
            ],
        ];

        return $behaviors;
    }

    public function actionCreate() {
        $log = Yii::$app->getRequest()->getBodyParams();

        Yii::info($log, 'log_extension');
    }

}
