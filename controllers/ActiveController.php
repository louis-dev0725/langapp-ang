<?php


namespace app\controllers;


use yii\filters\auth\HttpBearerAuth;

class ActiveController extends \yii\rest\ActiveController
{
    public $serializer = [
        'class' => \yii\rest\Serializer::class,
        'collectionEnvelope' => 'items',
    ];

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        if (isset($behaviors['contentNegotiator']['formats']['application/xml'])) {
            unset($behaviors['contentNegotiator']['formats']['application/xml']);
        }

        $behaviors['contentNegotiator']['languages'] = ['ru-RU', 'en-US'];

        $behaviors['authenticator'] = [
            'class' => HttpBearerAuth::class,
        ];

        return $behaviors;
    }
}
