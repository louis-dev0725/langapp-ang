<?php
$db = [
    'class' => 'yii\db\Connection',
    'dsn' => 'pgsql:host=localhost;port=5432;dbname=__database__',
    'username' => '__user__',
    'password' => '__password__',
    'charset' => 'utf8',

    // Schema cache options (for production environment)
    //'enableSchemaCache' => true,
    //'schemaCacheDuration' => 60,
    //'schemaCache' => 'cache',
];

if (file_exists(__DIR__ . '/db-local.php')) {
    include(__DIR__ . '/db-local.php');
}

return $db;
