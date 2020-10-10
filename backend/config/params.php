<?php

$params = [
    'adminEmail' => 'support@localhost',
    'noreplyEmail' => 'support@localhost',
    'siteName' => 'LangApp',
    'fromName' => 'LangApp',
    'hostName' => 'localhost:8080',
    'baseUrl' => 'https://localhost:8080',
];

if (file_exists(__DIR__ . '/params-local.php')) {
    include(__DIR__ . '/params-local.php');
}

return $params;
