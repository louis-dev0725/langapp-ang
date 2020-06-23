<?php

namespace app\controllers;


use app\models\Mnemonics;
use Yii;

class MnemonicController extends ActiveController {
    public $modelClass = Mnemonics::class;

    /**
     * @return array
     */
    public function actions() {
        $actions = parent::actions();
        unset($actions['create']);
        return $actions;
    }

    public function actionCreate() {
        $mnemonic = Yii::$app->getRequest()->getBodyParams();

    }

}
