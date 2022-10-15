<?php

namespace app\controllers;

use app\models\SettingPlugin;
use Yii;

class PluginController extends ActiveController
{
    public $modelClass = SettingPlugin::class;

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        $behaviors['access']['rules'] = [
            [
                'allow' => true,
                'actions' => ['view', 'update'],
                'roles' => ['@'],
            ],
        ];

        return $behaviors;
    }

    /**
     * @return array
     */
    public function actions()
    {
        $actions = parent::actions();
        unset($actions['view'], $actions['update']);

        return $actions;
    }

    /**
     * @param $id
     *
     * @return array|\yii\db\ActiveRecord|null
     */
    public function actionView($id)
    {
        return SettingPlugin::find()->joinWith('user.homeLanguage')->where(['user_id' => $id])->asArray()->one();
    }

    /**
     * @param $id
     *
     * @return array
     * @throws \yii\base\InvalidConfigException
     */
    public function actionUpdate($id)
    {
        $updateSetting = SettingPlugin::find()->where(['user_id' => $id])->one();

        if ($updateSetting != '') {
            $updateSetting->load(Yii::$app->getRequest()->getBodyParams(), '');
            if ($updateSetting->validate()) {
                $updateSetting->save();

                return ['done' => true];
            } else {
                return ['done' => false];
            }
        } else {
            $newSetting = new SettingPlugin();
            $newSetting->load(Yii::$app->getRequest()->getBodyParams(), '');
            if ($newSetting->validate()) {
                $newSetting->save();

                return ['done' => true];
            } else {
                return ['done' => false];
            }
        }
    }
}
