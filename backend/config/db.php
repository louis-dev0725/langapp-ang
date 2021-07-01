<?php

$db = [
    'class' => 'yii\db\Connection',
    'dsn' => 'pgsql:host=' . (isset($_SERVER['POSTGRES_HOST']) ? $_SERVER['POSTGRES_HOST'] : 'db') . ';port=5432;dbname=' . (isset($_SERVER['POSTGRES_DB']) ? $_SERVER['POSTGRES_DB'] : 'postgres'),
    'username' => isset($_SERVER['POSTGRES_USER']) ? $_SERVER['POSTGRES_USER'] : 'postgres',
    'password' => isset($_SERVER['POSTGRES_PASSWORD']) ? $_SERVER['POSTGRES_PASSWORD'] : 'postgres',
    'charset' => 'utf8',

    // Schema cache options (for production environment)
    'enableSchemaCache' => true,
    'schemaCacheDuration' => 60,
    'schemaCache' => 'cache',
];

if (file_exists(__DIR__ . '/db-local.php')) {
    include __DIR__ . '/db-local.php';
}

return $db;
