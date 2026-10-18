<?php
header('Content-Type: application/json');

$manuales = [
    [
        'id' => 1,
        'titulo' => 'Manual de Módulo X',
        'descripcion' => 'Configura y mantén el módulo X de forma segura.',
        'enlace' => '/documentacion/manuales/modulo-x.pdf'
    ],
    [
        'id' => 2,
        'titulo' => 'Manual de Módulo Y',
        'descripcion' => 'Guía completa para el módulo Y.',
        'enlace' => '/documentacion/manuales/modulo-y.pdf'
    ]
];

echo json_encode($manuales, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
