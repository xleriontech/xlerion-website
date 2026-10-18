<?php
// Configuración segura del backend - NO SUBIR A GIT
// Este archivo contiene credenciales sensibles

return [
    'smtp' => [
        'host' => 'mail.xlerion.com',
        'port' => 465,
        'username' => 'support@xlerion.com',
        'password' => 'Ultimate81720164!1984',
        'from_email' => 'support@xlerion.com',
        'from_name' => 'Total Darkness - Soporte'
    ],
    'environment' => [
        'development' => [
            'base_url' => 'http://localhost:5173',
            'api_url' => 'http://localhost:8080'
        ],
        'production' => [
            'base_url' => 'https://xlerion.com',
            'api_url' => 'https://xlerion.com'
        ]
    ]
];
