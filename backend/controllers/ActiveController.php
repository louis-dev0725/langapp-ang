<?php

namespace app\controllers;

use Yii;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\Cors;
use yii\helpers\ArrayHelper;
use yii\rest\Serializer;

class ActiveController extends \yii\rest\ActiveController
{
    public $serializer = [
        'class' => Serializer::class,
        'collectionEnvelope' => 'items',
    ];

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        if (isset($behaviors['contentNegotiator']['formats']['application/xml'])) {
            unset($behaviors['contentNegotiator']['formats']['application/xml']);
        }

        $behaviors['contentNegotiator']['languages'] = ['ru', 'en'];

        // add CORS filter: any (*) for development, localhost for prod
        $withCorsFilter = [
            [
                'class' => Cors::class,
                'cors' => [
                    'Origin' => (YII_ENV_DEV || Yii::$app->params['enableDevCors']) ? ['*'] : ['http://localhost', 'https://localhost'],
                    'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
                    'Access-Control-Request-Headers' => ['*'],
                    'Access-Control-Allow-Credentials' => null,
                    'Access-Control-Max-Age' => 86400,
                    'Access-Control-Expose-Headers' => [],
                ],
            ],
        ];

        $behaviors['authenticator'] = [
            'class' => HttpBearerAuth::class,
            'except' => ['options'],
        ];

        // Add CORS before everything
        return ArrayHelper::merge($withCorsFilter, $behaviors);
    }
}
