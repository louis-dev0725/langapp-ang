<?php


namespace app\controllers;


use yii\filters\auth\HttpBearerAuth;
use yii\filters\Cors;

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

        // remove authentication filter before CORS filter
        // https://www.yiiframework.com/doc/guide/2.0/en/rest-controllers#cors
        unset($behaviors['authenticator']);

        // add CORS filter (for development)
        if (YII_ENV_DEV) {
            $behaviors['corsFilter'] = [
                'class' => Cors::class,
            ];
        }

        $behaviors['authenticator'] = [
            'class' => HttpBearerAuth::class,
            'except' => ['options'],
        ];

        return $behaviors;
    }
}
