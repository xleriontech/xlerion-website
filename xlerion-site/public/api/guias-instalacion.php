<?php
header('Content-Type: application/json');

$guias = [
    [
        'id' => 1,
        'titulo' => 'Instalación en Windows',
        'plataformas' => ['Windows 10', 'Windows 11'],
        'pasos' => [
            'Descargar el instalador desde el portal oficial.',
            'Ejecutar el instalador como administrador.',
            'Seguir las instrucciones en pantalla.'
        ],
        'enlace' => '/documentacion/guias-instalacion/windows.pdf'
    ],
    [
        'id' => 2,
        'titulo' => 'Instalación en Linux',
        'plataformas' => ['Ubuntu', 'Debian'],
        'pasos' => [
            'Descargar el paquete .deb.',
            'Instalar con sudo dpkg -i paquete.deb.',
            'Verificar la instalación con el comando correspondiente.'
        ],
        'enlace' => '/documentacion/guias-instalacion/linux.pdf'
    ]
];

echo json_encode($guias, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
