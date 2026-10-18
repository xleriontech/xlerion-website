<?php
header('Content-Type: application/json');

$diagramas = [
    [
        'id' => 1,
        'nombre' => 'Flujo de Autenticación',
        'descripcion' => 'Diagrama del proceso de login y autorización.',
        'imagen' => '/documentacion/diagramas-flujos/auth-flow.png',
        'fecha_actualizacion' => '2026-01-15'
    ],
    [
        'id' => 2,
        'nombre' => 'Arquitectura General',
        'descripcion' => 'Vista general de los componentes del sistema.',
        'imagen' => '/documentacion/diagramas-flujos/arquitectura.png',
        'fecha_actualizacion' => '2026-01-10'
    ]
];

echo json_encode($diagramas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
