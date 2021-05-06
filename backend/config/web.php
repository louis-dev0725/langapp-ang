<?php

$params = require __DIR__ . '/params.php';
$db = require __DIR__ . '/db.php';

$config = [
    'id' => 'basic',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'sourceLanguage' => 'en-US',
    'language' => 'en-US',
    'timeZone' => 'UTC',
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm' => '@vendor/npm-asset',
    ],
    'components' => [
        'request' => [
            // !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
            'cookieValidationKey' => 'fjZ9Tct4c3LvC_4JeeVzPigVO6D5cbOm',
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ],
            'enableCsrfValidation' => false,
            'enableCsrfCookie' => false,
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'user' => [
            'identityClass' => 'app\models\User',
            //'enableAutoLogin' => true,
            'enableSession' => false,
            'on afterLogin' => ['app\models\User', 'afterLogin'],
            'loginUrl' => null,
        ],
        'errorHandler' => [
            //'errorAction' => 'site/error',
            'errorAction' => null,
        ],
        'response' => [
            'class' => \yii\web\Response::class,
            'format' => \yii\web\Response::FORMAT_JSON,
        ],
        'mailer' => [
            'class' => 'yii\swiftmailer\Mailer',
            'useFileTransport' => true,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'flushInterval' => 1,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning', 'info']
                ],
                [
                    'class' => 'yii\log\FileTarget',
                    'exportInterval' => 1,
                    'categories' => ['log_extension'],
                    'logFile' => '@runtime/logs/extension.log',
                    'logVars' => []
                ],
            ],
        ],
        'db' => $db,
        'urlManager' => [
            'enablePrettyUrl' => true,
            'enableStrictParsing' => true,
            'showScriptName' => false,
            'rules' => [
                [
                    'class' => 'yii\rest\UrlRule',
                    'controller' => ['user', 'transaction', 'category', 'content', 'language', 'translate',
                        'plugin', 'dictionary', 'mnemonic', 'log'],
                    'prefix' => 'api',
                    'patterns' => [
                        'PUT,PATCH {id}' => 'update',
                        'DELETE {id}' => 'delete',
                        'GET,HEAD {id}' => 'view',
                        'POST' => 'create',
                        'GET,HEAD' => 'index',
                        '{id}' => 'options',
                        '' => 'options',
                        'OPTIONS <id:\d+>/<action:[\w-]+>' => 'options',
                        'OPTIONS <action:[\w-]+>' => 'options',
                        '<id:\d+>/<action:[\w-]+>' => '<action>',
                        '<action:[\w-]+>' => '<action>',
                    ],
                ],
                'api/pay/start' => 'pay/start',
                'api/pay/result' => 'pay/result',
            ],
        ],
        'authManager' => [
            'class' => 'yii\rbac\PhpManager',
        ],
        'jwt' => [
            'class' => 'sizeg\jwt\Jwt',
            'key' => '*F)J@NcRfUjXn2r5u8x/A?D(G+KaPdSgVkYp3s6v9y$B&E)H@McQeThWmZq4t7w!z%C*F-JaNdRgUjXn2r5u8x/A?D(G+KbPeShVmYp3s6v9y$B&E)H@McQfTjWnZr4t',
        ],
    ],
    'params' => $params,
];



if (YII_ENV_DEV) {
    $config['components']['assetManager']['baseUrl'] = '@web/yii-assets';
    $config['components']['assetManager']['basePath'] = '@webroot/yii-assets';

    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
        'allowedIPs' => ['127.0.0.1', '::1', '172.*', '10.*'],
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        'allowedIPs' => ['127.0.0.1', '::1', '172.*', '10.*'],
    ];
}

if (file_exists(__DIR__ . '/web-local.php')) {
    include(__DIR__ . '/web-local.php');
}

return $config;
