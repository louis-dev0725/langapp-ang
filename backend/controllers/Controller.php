<?php


namespace app\controllers;

use Yii;
use yii\filters\auth\HttpBearerAuth;
use yii\filters\ContentNegotiator;
use yii\filters\Cors;
use yii\filters\VerbFilter;
use yii\rest\Serializer;
use yii\web\Response;

class Controller extends \yii\rest\Controller
{
    public function init()
    {
        parent::init();

        $this->serializer = [
            'class' => Serializer::class,
            'collectionEnvelope' => 'items',
        ];
    }

    public function behaviors()
    {
        $behaviors = [
            'cors' => [
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
            'contentNegotiator' => [
                'class' => ContentNegotiator::class,
                'formats' => [
                    'application/json' => Response::FORMAT_JSON,
                ],
                'languages' => ['ru', 'en'],
            ],
            'verbFilter' => [
                'class' => VerbFilter::class,
                'actions' => $this->verbs(),
            ],
            'authenticator' => [
                'class' => HttpBearerAuth::class,
                'except' => ['options'],
            ],
            /*'rateLimiter' => [
                'class' => RateLimiter::class,
            ],*/
        ];

        return $behaviors;
    }
}