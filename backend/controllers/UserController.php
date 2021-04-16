<?php


namespace app\controllers;


use app\models\User;
use Yii;
use yii\web\NotFoundHttpException;

class UserController extends \app\base\controllers\UserController
{
    public function actionMe()
    {
        $userId = Yii::$app->user->id;
        $model = User::find()->where(['id' => $userId])->one();
        if ($model == null) {
            throw new NotFoundHttpException('User not found');
        }

        $model->scenario = User::SCENARIO_PROFILE;

        return $model;
    }
}
