<?php

$params = [
    'adminEmail' => 'support@localhost',
    'noreplyEmail' => 'support@localhost',
    'siteName' => 'LangApp',
    'fromName' => 'LangApp',
    'hostName' => 'localhost:8080',
    'baseUrl' => 'https://localhost:8080',
    'square' => [
        'env' => 'sandbox',
        'sandbox' => [
            'applicationId' => 'sandbox-sq0idb-1hwdCIUEVLJIdMOtcBwPzA',
            'accessToken' => 'EAAAEJAsAvmex3OV2BPvh_2_KeaVo9Zr0_yjUnDcJLtkrkqFZNS-NDtizhCJFxhy',
            'locationId' => 'LY033JNJZ5BMP',
        ],
        'production' => [
            'applicationId' => '',
            'accessToken' => '',
            'locationId' => '',
        ],
    ],
];

if (file_exists(__DIR__ . '/params-local.php')) {
    include(__DIR__ . '/params-local.php');
}

return $params;
