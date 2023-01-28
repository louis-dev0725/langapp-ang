<?php

$params = require __DIR__ . '/params.php';
$db = require __DIR__ . '/db.php';
$isApiRequest = strpos($_SERVER['REQUEST_URI'], '/api') !== false;

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
            'enableCookieValidation' => false,
            'enableCsrfValidation' => false,
            'enableCsrfCookie' => false,
        ],
        'cache' => [
            'class' => 'yii\redis\Cache',
            'redis' => [
                'hostname' => isset($_SERVER['REDIS_HOST']) ? $_SERVER['REDIS_HOST'] : 'redis',
                'port' => isset($_SERVER['REDIS_PORT']) ? $_SERVER['REDIS_PORT'] : 6379,
                'database' => 0,
            ]
        ],
        'user' => [
            'identityClass' => 'app\models\User',
            //'enableAutoLogin' => true,
            'enableSession' => false,
            'on afterLogin' => ['app\models\User', 'afterLogin'],
            'loginUrl' => null,
        ],
        'errorHandler' => [
            'errorAction' => $isApiRequest ? null : 'site/error',
        ],
        'response' => [
            'class' => \yii\web\Response::class,
            'format' => $isApiRequest ? \yii\web\Response::FORMAT_JSON : \yii\web\Response::FORMAT_HTML,
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
                    'levels' => ['error', 'warning', 'info'],
                ],
                [
                    'class' => 'yii\log\FileTarget',
                    'exportInterval' => 1,
                    'categories' => ['log_extension'],
                    'logFile' => '@runtime/logs/extension.log',
                    'logVars' => [],
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
                        'plugin', 'dictionary', 'mnemonic', 'log', 'content-report', 'content-attribute', 'drill'],
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
                [
                    'class' => 'yii\rest\UrlRule',
                    'controller' => 'activity',
                    'prefix' => 'api',
                    'patterns' => [
                        'POST' => 'create',
                        'GET,HEAD' => 'view',
                    ],
                ],
                '/robots.txt' => 'site/robots-txt',
                'api/pay/start' => 'pay/start',
                'api/pay/result' => 'pay/result',
                '<lang:ru|en|>' => 'site/index',
            ],
        ],
        'authManager' => [
            'class' => 'yii\rbac\PhpManager',
        ],
        'jwt' => [
            'class' => 'sizeg\jwt\Jwt',
            'key' => file_exists(__DIR__ . '/jwt-key-local.txt') ? file_get_contents(__DIR__ . '/jwt-key-local.txt') : file_get_contents(__DIR__ . '/jwt-key.txt'),
        ],
        'i18n' => [
            'translations' => [
                'app*' => [
                    'class' => 'yii\i18n\GettextMessageSource',
                    'basePath' => '@app/messages',
                ],
            ],
        ],
        'assetManager' => [
            'baseUrl' => '@web/yii-assets',
            'basePath' => '@webroot/yii-assets',
        ],
    ],
    'params' => $params,
];

if (YII_ENV_DEV) {
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
    include __DIR__ . '/web-local.php';
}

return $config;
