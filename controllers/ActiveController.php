<?php


namespace app\controllers;


use yii\filters\auth\HttpBearerAuth;
use yii\filters\Cors;
use yii\helpers\ArrayHelper;

class ActiveController extends \yii\rest\ActiveController {
    public $serializer = [
        'class' => \yii\rest\Serializer::class,
        'collectionEnvelope' => 'items',
    ];

    public function behaviors() {
        $behaviors = parent::behaviors();

        if (isset($behaviors['contentNegotiator']['formats']['application/xml'])) {
            unset($behaviors['contentNegotiator']['formats']['application/xml']);
        }

        $behaviors['contentNegotiator']['languages'] = ['ru-RU', 'en-US'];

        if (YII_ENV_DEV) {
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
