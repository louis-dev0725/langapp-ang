<?php

$params = [
    'adminEmail' => 'support@service-template.lb7.ru',
    'noreplyEmail' => 'support@service-template.lb7.ru',
    'rememberMe' => 3600 * 24 * 365 * 5,
    'user.passwordResetTokenExpire' => 3600,
    'fromName' => 'Service Template lb7.ru',
];

if (file_exists(__DIR__ . '/params-local.php')) {
    include(__DIR__ . '/params-local.php');
}

return $params;
