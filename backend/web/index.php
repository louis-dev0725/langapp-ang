<?php

if (file_exists(__DIR__ . '/index-local.php')) {
    include __DIR__ . '/index-local.php';
}

// you can use env IS_DEV or index-local.php to change it
if (isset($_SERVER['IS_DEV']) && $_SERVER['IS_DEV'] == '1') {
    defined('YII_DEBUG') or define('YII_DEBUG', true);
    defined('YII_ENV') or define('YII_ENV', 'dev');
}

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../vendor/yiisoft/yii2/Yii.php';

$config = require __DIR__ . '/../config/web.php';

(new yii\web\Application($config))->run();
