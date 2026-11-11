<?php
/**
 * Pases de Wallet (Apple .pkpass y Google Wallet).
 *
 * GET /api/wallet/{founder_id}?platform=apple
 * GET /api/wallet/{founder_id}?platform=google
 *
 * Los pases requieren credenciales del emisor que no pueden generarse desde
 * codigo: Apple exige un certificado de firma (.p12) emitido por Apple
 * Developer, y Google una cuenta de servicio con la Wallet API habilitada.
 *
 * Este endpoint SIEMPRE genera el pase completo con los datos reales. Si las
 * credenciales estan configuradas, lo firma y lo entrega. Si no, responde
 * 501 con el detalle exacto de lo que falta para completarlo.
 *
 * Configuracion (public/api/config.local.php o fuera del webroot):
 *
 *   'wallet' => [
 *       'apple' => [
 *           'pass_type_id' => 'pass.com.xlerion.mike',   // Pass Type ID
 *           'team_id'      => 'ABCDE12345',               // Apple Developer Team ID
 *           'cert_path'    => '/ruta/certificado.p12',
 *           'cert_pass'    => 'clave-del-p12',
 *           'pass_type'    => 'storeCard',                // o 'generic'
 *       ],
 *       'google' => [
 *           'service_account_path' => '/ruta/service-account.json',
 *           'issuer_id'            => '111111111111',
 *       ],
 *   ],
 */

declare(strict_types=1);

mb_internal_encoding('UTF-8');

const WALLET_FONDERS = [
    'miguel' => [
        'slug'      => 'mike',
        'name'      => 'Miguel E. Rodriguez Martinez',
        'display'   => 'Miguel E. Rodríguez',
        'role'      => 'Founder & Lead Technical Architect',
        'phone'     => '+57 313 226 3265',
        'email'     => 'miguelxlerion@gmail.com',
        'linkedin'  => 'https://www.linkedin.com/in/mikerodriguez84',
        'web'       => 'https://xlerion.com.co',
        'nit'       => '81720164',
        'location'  => 'Bogotá, Colombia',
    ],
    'juliette' => [
        'slug'      => 'juliette',
        'name'      => 'Juliette González',
        'display'   => 'Juliette González',
        'role'      => 'Co-Founder & Business Strategy',
        'phone'     => '+57 300 000 0000',
        'email'     => 'juliette@xlerion.com.co',
        'linkedin'  => 'https://www.linkedin.com/in/juliette-gt/',
        'web'       => 'https://xlerion.com.co',
        'nit'       => '',
        'location'  => 'Chía, Cundinamarca, Colombia',
    ],
];

const WALLET_THEME = [
    'backgroundColor' => 'rgb(15, 15, 26)',
    'foregroundColor' => 'rgb(242, 244, 248)',
    'labelColor'      => 'rgb(0, 233, 250)',
];

function load_wallet_config(): array
{
    $candidates = [];
    $fromEnv = getenv('XLERION_CARDS_CONFIG');
    if (is_string($fromEnv) && $fromEnv !== '') {
        $candidates[] = $fromEnv;
    }
    $candidates[] = __DIR__ . '/config.local.php';
    $candidates[] = dirname(__DIR__) . '/config.local.php';
    $candidates[] = dirname(dirname(__DIR__)) . '/config.local.php';

    foreach ($candidates as $path) {
        if (is_file($path) && is_readable($path)) {
            $loaded = include $path;
            if (is_array($loaded) && isset($loaded['wallet']) && is_array($loaded['wallet'])) {
                return $loaded['wallet'];
            }
        }
    }
    return [];
}

function json_response(array $payload, int $status): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function base64url(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

/* ================================================================== *
 *  APPLE .pkpass
 * ================================================================== */

/** Cuerpo del pase Apple segun la spec de PassKit. */
function apple_pass_json(array $f, array $apple, string $baseUrl): array
{
    $passType = ($apple['pass_type'] ?? 'storeCard') === 'generic' ? 'generic' : 'storeCard';

    $primary = [
        ['key' => 'role', 'label' => 'CARGO', 'value' => $f['role']],
    ];
    $secondary = [
        ['key' => 'phone', 'label' => 'TELÉFONO', 'value' => $f['phone']],
        ['key' => 'email', 'label' => 'EMAIL', 'value' => $f['email']],
    ];
    $back = [
        ['key' => 'linkedin', 'label' => 'LINKEDIN', 'value' => $f['linkedin']],
        ['key' => 'web', 'label' => 'WEB', 'value' => $f['web']],
        ['key' => 'location', 'label' => 'UBICACIÓN', 'value' => $f['location']],
    ];
    if ($f['nit'] !== '') {
        $back[] = ['key' => 'nit', 'label' => 'NIT EMPRESA', 'value' => $f['nit']];
    }

    $header = [
        ['key' => 'name', 'label' => 'NOMBRE', 'value' => $f['display']],
    ];

    $pass = [
        'formatVersion'      => 1,
        'passTypeIdentifier' => (string) ($apple['pass_type_id'] ?? ('pass.com.xlerion.' . $f['slug'])),
        'serialNumber'       => 'xlerion-' . $f['slug'] . '-1',
        'teamIdentifier'     => (string) ($apple['team_id'] ?? ''),
        'organizationName'   => 'Xlerion',
        'description'        => 'Tarjeta digital de ' . $f['display'],
        'logoText'           => 'XLERION',
        'foregroundColor'    => WALLET_THEME['foregroundColor'],
        'backgroundColor'    => WALLET_THEME['backgroundColor'],
        'labelColor'         => WALLET_THEME['labelColor'],
        'barcode'            => [
            'format'          => 'PKBarcodeFormatQR',
            'message'         => $baseUrl . '/' . $f['slug'],
            'messageEncoding' => 'iso-8859-1',
            'altText'         => $baseUrl . '/' . $f['slug'],
        ],
        'associatedStoreIdentifiers' => [],
    ];

    if ($passType === 'storeCard') {
        $pass['storeCard'] = [
            'headerFields'   => $header,
            'primaryFields'  => $primary,
            'secondaryFields' => $secondary,
            'auxiliaryFields' => [],
            'backFields'     => $back,
        ];
    } else {
        $pass['generic'] = [
            'primaryFields'   => array_merge($header, $primary),
            'secondaryFields' => $secondary,
            'auxiliaryFields' => [],
            'backFields'      => $back,
        ];
    }

    return $pass;
}

/**
 * Firma el manifiesto SHA-1 con el certificado de Apple y empaqueta el .pkpass.
 */
function build_pkpass(array $f, array $apple, string $baseUrl): array
{
    $certPath = (string) ($apple['cert_path'] ?? '');
    $certPass = (string) ($apple['cert_pass'] ?? '');
    $keyPath  = (string) ($apple['key_path'] ?? '');

    if ($certPath === '' || !is_file($certPath)) {
        return ['ok' => false, 'missing' => 'apple.cert_path (certificado .p12 de Apple Developer)'];
    }
    if (!class_exists('ZipArchive')) {
        return ['ok' => false, 'missing' => 'extension ZipArchive de PHP'];
    }

    $pass = apple_pass_json($f, $apple, $baseUrl);

    // Imagenes obligatorias en el bundle. Si el hosting no puede generarlos,
    // el pase no es valido; por eso se avisa en lugar de servir un .pkpass roto.
    $logoPath = __DIR__ . '/../cards/icons/wallet-logo.png';
    $stripPath = __DIR__ . '/../cards/icons/wallet-strip.png';
    $thumbPath = __DIR__ . '/../cards/icons/wallet-thumb.png';
    foreach ([$logoPath, $stripPath, $thumbPath] as $p) {
        if (!is_file($p)) {
            return ['ok' => false, 'missing' => 'imagenes del pase (' . basename($p) . ') en public/cards/icons/'];
        }
    }

    $files = [];
    $files['pass.json'] = json_encode($pass, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    $files['icon.png'] = file_get_contents($logoPath);
    $files['logo.png'] = file_get_contents($logoPath);
    $files['strip.png'] = file_get_contents($stripPath);
    $files['thumbnail.png'] = file_get_contents($thumbPath);

    // manifest.json: hash SHA-1 de cada recurso (Apple exige SHA-1)
    $manifest = [];
    foreach ($files as $name => $contents) {
        $manifest[$name] = sha1($contents);
    }
    $files['manifest.json'] = json_encode($manifest, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    // Firma del manifiesto con el certificado (SHA-1 con RSA, como exige PassKit)
    $signed = '';
    if (!openssl_pkcs7_sign(
        $files['manifest.json'],
        $signed,
        $certPath,
        $certPass,
        ['sha1' => true]
    )) {
        return ['ok' => false, 'missing' => 'no se pudo firmar con el certificado (revisa cert_path y cert_pass)'];
    }
    $files['signature'] = $signed;

    // Empaquetado .pkpass (zip sin compresiion, orden fijo: Apple es estricto)
    $tmp = tempnam(sys_get_temp_dir(), 'pkpass');
    $zip = new ZipArchive();
    if ($zip->open($tmp, ZipArchive::OVERWRITE) !== true) {
        return ['ok' => false, 'missing' => 'no se pudo crear el archivo .pkpass'];
    }
    foreach (['pass.json', 'manifest.json', 'signature', 'icon.png', 'logo.png', 'strip.png', 'thumbnail.png'] as $name) {
        $zip->addFromString($name, $files[$name]);
        $zip->setCompressionName($name, ZipArchive::CM_STORE);
    }
    $zip->close();

    $binary = file_get_contents($tmp);
    @unlink($tmp);
    return ['ok' => true, 'binary' => $binary, 'filename' => 'xlerion-' . $f['slug'] . '.pkpass'];
}

/* ================================================================== *
 *  GOOGLE WALLET
 * ================================================================== */

/** Objeto GenericPass de Google Wallet con los datos reales. */
function google_pass_objects(array $f, array $google, string $baseUrl): array
{
    $issuerId = (string) ($google['issuer_id'] ?? '');
    $classId  = 'class_' . $f['slug'];
    $objectId = 'xlerion_' . $f['slug'];

    $class = [
        'id'           => $issuerId . '.' . $classId,
        'issuerName'   => 'Xlerion',
        'reviewStatus' => 'UNDER_REVIEW',
        'eventId'      => $classId,
        'eventName'    => 'Xlerion Card',
        'issuerCountry' => 'CO',
        'reviewerEmail' => (string) ($google['reviewer_email'] ?? ''),
        'translations' => [
            'es' => ['issuerName' => 'Xlerion', 'eventName' => 'Xlerion Card'],
        ],
    ];

    $object = [
        'id'         => $issuerId . '.' . $objectId,
        'classId'    => $classId,
        'state'      => 'ACTIVE',
        'issuerName' => 'Xlerion',
        'issuerLogo' => [
            'sourceUri' => ['uri' => $baseUrl . '/LogoX.svg'],
            'contentDescription' => ['localized' => ['es' => ['description' => 'Logo Xlerion']]],
        ],
        'textModulesData' => [
            [
                'header' => ['type' => 'TEXT', 'text' => 'XLERION'],
                'body'   => ['type' => 'TEXT', 'text' => $f['display']],
            ],
            [
                'header' => ['type' => 'TEXT', 'text' => 'CARGO'],
                'body'   => ['type' => 'TEXT', 'text' => $f['role']],
            ],
            [
                'header' => ['type' => 'TEXT', 'text' => 'CONTACTO'],
                'body'   => ['type' => 'TEXT', 'text' => $f['phone'] . ' · ' . $f['email']],
            ],
        ],
        'barcode' => [
            'type'  => 'QR_CODE',
            'value' => $baseUrl . '/' . $f['slug'],
        ],
        'links' => [
            ['uri' => $baseUrl . '/' . $f['slug'], 'description' => 'Ver tarjeta'],
        ],
        'validTimeInterval' => [
            'start' => ['date' => gmdate('Y-m-d') . 'T00:00:00Z'],
        ],
        'heroImage' => [
            'sourceUri' => ['uri' => $baseUrl . '/LogoX.png'],
            'contentDescription' => ['localized' => ['es' => ['description' => 'Xlerion']]],
        ],
        'textSections' => [
            [
                'header' => 'CONTACTO',
                'data' => [
                    ['label' => 'Teléfono', 'value' => $f['phone']],
                    ['label' => 'Email', 'value' => $f['email']],
                    ['label' => 'Ubicación', 'value' => $f['location']],
                    ['label' => 'LinkedIn', 'value' => $f['linkedin']],
                    ['label' => 'Web', 'value' => $f['web']],
                ],
            ],
        ],
    ];

    if ($f['nit'] !== '') {
        $object['textSections'][0]['data'][] = ['label' => 'NIT Empresa', 'value' => $f['nit']];
    }

    return ['class' => $class, 'object' => $object];
}

/** Firma el JWT RS256 con la clave privada de la cuenta de servicio. */
function google_jwt(array $f, array $google, string $baseUrl): array
{
    $saPath = (string) ($google['service_account_path'] ?? '');
    if ($saPath === '' || !is_file($saPath)) {
        return ['ok' => false, 'missing' => 'google.service_account_path (cuenta de servicio con la Wallet API habilitada)'];
    }
    $sa = json_decode((string) file_get_contents($saPath), true);
    if (!is_array($sa) || empty($sa['client_email']) || empty($sa['private_key'])) {
        return ['ok' => false, 'missing' => 'el JSON de la cuenta de servicio no tiene client_email/private_key'];
    }

    $objects = google_pass_objects($f, $google, $baseUrl);

    $header  = ['alg' => 'RS256', 'typ' => 'JWT'];
    $payload = [
        'iss'   => $sa['client_email'],
        'aud'   => 'https://walletobjects.googleapis.com',
        'scope' => 'https://www.googleapis.com/auth/wallet.objects',
        'iat'   => time(),
        'exp'   => time() + 3600,
        'typ'   => 'savetowallet',
        'payload' => [
            'genericClasses'   => [$objects['class']],
            'genericObjects'   => [$objects['object']],
        ],
    ];

    $signingInput = base64url((string) json_encode($header))
        . '.' . base64url((string) json_encode($payload));

    $signature = '';
    if (!openssl_sign($signingInput, $signature, (string) $sa['private_key'], OPENSSL_ALGO_SHA256)) {
        return ['ok' => false, 'missing' => 'no se pudo firmar el JWT con la clave de la cuenta de servicio'];
    }

    $jwt = $signingInput . '.' . base64url($signature);

    // URL de "Agregar a Google Wallet" (flujo oficial con el JWT)
    $url = 'https://pay.google.com/gp/v/save/' . base64url((string) json_encode([
        'genericObjects' => [$objects['object']],
        'genericClasses' => [$objects['class']],
    ]));

    return ['ok' => true, 'jwt' => $jwt, 'url' => $url];
}

/* ================================================================== */

$founderId = isset($_GET['founder']) ? strtolower(trim((string) $_GET['founder'])) : '';
if ($founderId === '' && isset($_SERVER['PATH_INFO'])) {
    $founderId = strtolower(trim((string) $_SERVER['PATH_INFO'], '/'));
}
if (!isset(WALLET_FONDERS[$founderId])) {
    json_response(['ok' => false, 'error' => 'founder_id invalido'], 400);
}

$platform = strtolower((string) ($_GET['platform'] ?? 'apple'));
if ($platform !== 'apple' && $platform !== 'google') {
    json_response(['ok' => false, 'error' => 'platform debe ser apple o google'], 400);
}

$config = load_wallet_config();
$baseUrl = 'https://xlerion.com.co';
$settings = $config[$platform] ?? [];
$founder = WALLET_FONDERS[$founderId];

if ($platform === 'apple') {
    $result = build_pkpass($founder, $settings, $baseUrl);
    if (!$result['ok']) {
        json_response([
            'ok'       => false,
            'error'    => 'wallet no disponible todavia',
            'missing'  => $result['missing'],
            'howto'    => [
                '1. Crear el Pass Type ID en Apple Developer (tipo storeCard o generic).',
                '2. Descargar el certificado de firma (.p12) del WWDR.',
                '3. Configurar wallet.apple.cert_path, wallet.apple.cert_pass y wallet.apple.team_id en config.local.php.',
                '4. Subir las imagenes del pase a public/cards/icons/ (wallet-logo, wallet-strip, wallet-thumb).',
            ],
            'preview'  => apple_pass_json($founder, $settings, $baseUrl),
        ], 501);
    }
    http_response_code(200);
    header('Content-Type: application/vnd.apple.pkpass');
    header('Content-Disposition: attachment; filename="' . $result['filename'] . '"');
    header('Content-Length: ' . strlen($result['binary']));
    header('Cache-Control: no-store');
    echo $result['binary'];
    exit;
}

$result = google_jwt($founder, $settings, $baseUrl);
if (!$result['ok']) {
    json_response([
        'ok'      => false,
        'error'   => 'wallet no disponible todavia',
        'missing' => $result['missing'],
        'howto'   => [
            '1. Crear un proyecto en Google Cloud y habilitar la Wallet API.',
            '2. Crear una cuenta de servicio con permiso sobre el Wallet API.',
            '3. Configurar wallet.google.service_account_path y wallet.google.issuer_id en config.local.php.',
        ],
        'preview' => google_pass_objects($founder, $settings, $baseUrl),
    ], 501);
}

json_response([
    'ok'  => true,
    'jwt' => $result['jwt'],
    'url' => $result['url'],
], 200);
