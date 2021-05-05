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

        $behaviors['contentNegotiator']['languages'] = ['ru-RU', 'en-US'];

        // add CORS filter (for development)
        if (YII_ENV_DEV || Yii::$app->params['enableDevCors']) {
            $withCorsFilter = [
                [
                    'class' => Cors::class,
                ]
            ];
        } else {
            $withCorsFilter = [];
        }

        $behaviors['authenticator'] = [
            'class' => HttpBearerAuth::class,
            'except' => ['options'],
        ];

        // Add CORS before everything
        return ArrayHelper::merge($withCorsFilter, $behaviors);
    }
}
