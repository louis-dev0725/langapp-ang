<?php

$params = require __DIR__ . '/params.php';
$db = require __DIR__ . '/db.php';

$config = [
    'id' => 'basic-console',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'sourceLanguage' => 'en-US',
    'language' => 'en-US',
    'timeZone' => 'UTC',
    'controllerNamespace' => 'app\commands',
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm' => '@vendor/npm-asset',
        '@tests' => '@app/tests',
    ],
    'components' => [
        'cache' => [
            'class' => 'yii\redis\Cache',
            'redis' => [
                'hostname' => isset($_SERVER['REDIS_HOST']) ? $_SERVER['REDIS_HOST'] : 'redis',
                'port' => isset($_SERVER['REDIS_PORT']) ? $_SERVER['REDIS_PORT'] : 6379,
                'database' => 0,
            ]
        ],
        'log' => [
            'flushInterval' => 1,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'logFile' => '@runtime/logs/console.log',
                    'levels' => ['error', 'warning', 'info'],
                ],
                [
                    'class' => 'codemix\streamlog\Target',
                    'url' => 'php://stdout',
                    'levels' => ['info'],
                    'logVars' => [],
                    'except' => ['yii\db\*'],
                ],
                [
                    'class' => 'codemix\streamlog\Target',
                    'url' => 'php://stderr',
                    'levels' => ['error', 'warning'],
                    'logVars' => [],
                ],
            ],
        ],
        'db' => $db,
        'authManager' => [
            'class' => 'yii\rbac\PhpManager',
        ],
    ],
    'controllerMap' => [
        'migration' => [
            'class' => 'bizley\migration\controllers\MigrationController',
        ],
        'migrate-data' => [
            'class' => 'yii\console\controllers\MigrateController',
            'migrationPath' => '@app/migrations/data',
            'migrationTable' => '{{%migration_data}}',
        ],
        'message' => [
            'class' => 'app\controllers\MessageController',
        ],
    ],
    'params' => $params,
    /*
    'controllerMap' => [
        'fixture' => [ // Fixture generation command line.
            'class' => 'yii\faker\FixtureController',
        ],
    ],
    */
];

if (YII_ENV_DEV) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
    ];
}

return $config;
