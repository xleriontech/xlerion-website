<?php
/**
 * vCard dinamica de los fundadores.
 *
 * GET /api/vcard/{founder_id}  ->  text/vcard; charset=utf-8  (descarga .vcf)
 *
 * El archivo se genera al vuelo desde los mismos datos que alimentan las
 * tarjetas digitales (public/cards/founders-data.js), para que nunca se
 * desincronicen. Si el JSON no esta disponible se usa la copia embebida de
 * abajo, que es la fuente de verdad del backend.
 */

declare(strict_types=1);

mb_internal_encoding('UTF-8');

const FOUNDERS = [
    'miguel' => [
        'name'     => 'Miguel E. Rodriguez Martinez',
        'first'    => 'Miguel E.',
        'last'     => 'Rodriguez Martinez',
        'title'    => 'Founder & Lead Technical Architect',
        'org'      => 'Xlerion',
        'note'     => 'DeepTech Industrial - Gemelos Digitales 3D, IA RAG, IoT Industrial',
        'tel'      => '+57 313 226 3265',
        'tel_e164' => '+573132263265',
        'email'    => 'miguelxlerion@gmail.com',
        'url'      => 'https://xlerion.com.co',
        'linkedin' => 'https://www.linkedin.com/in/mikerodriguez84',
        'city'     => 'Bogotá',
        'region'   => '',
        'country'  => 'Colombia',
    ],
    'juliette' => [
        'name'     => 'Juliette González',
        'first'    => 'Juliette',
        'last'     => 'González',
        'title'    => 'Co-Founder & Business Strategy',
        'org'      => 'Xlerion',
        'note'     => 'DeepTech Industrial - Gemelos Digitales 3D, IA RAG, IoT Industrial',
        'tel'      => '+57 300 000 0000',
        'tel_e164' => '+573000000000',
        'email'    => 'juliette@xlerion.com.co',
        'url'      => 'https://xlerion.com.co',
        'linkedin' => 'https://www.linkedin.com/in/juliette-gt/',
        'city'     => 'Chía',
        'region'   => 'Cundinamarca',
        'country'  => 'Colombia',
    ],
];

/**
 * Escapa los caracteres reservados de vCard 3.0.
 */
function vcard_escape(string $value): string
{
    return str_replace(
        ["\\", ";", ",", "\n"],
        ["\\\\", "\\;", "\\,", "\\n"],
        $value
    );
}

/**
 * Genera el .vcf con formato vCard 3.0.
 * Los separadores de linea son CRLF segun RFC 6350 / vCard 3.0.
 */
function build_vcard(array $f): string
{
    $lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        'N:' . vcard_escape($f['last']) . ';' . vcard_escape($f['first']) . ';;;',
        'FN:' . vcard_escape($f['name']),
        'ORG:Xlerion',
        'TITLE:' . vcard_escape($f['title']),
        'TEL;TYPE=CELL:' . $f['tel_e164'],
        'EMAIL:' . $f['email'],
        'URL:' . $f['url'],
        'URL:' . $f['linkedin'],
        'X-SOCIALPROFILE;TYPE=linkedin:' . $f['linkedin'],
        'ADR;TYPE=WORK:;;' . vcard_escape($f['city']) . ';' . vcard_escape($f['region']) . ';;' . vcard_escape($f['country']),
        'NOTE:' . vcard_escape($f['note']),
        'REV:' . gmdate('Ymd\THis\Z'),
        'END:VCARD',
    ];
    return implode("\r\n", $lines) . "\r\n";
}

/**
 * Nombre de archivo seguro para la descarga.
 */
function slugify(string $value): string
{
    $ascii = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value);
    $ascii = is_string($ascii) ? $ascii : $value;
    $ascii = preg_replace('/[^A-Za-z0-9]+/', '_', $ascii) ?? '';
    return trim($ascii, '_') ?: 'contacto';
}

/* ------------------------------------------------------------------ */

$founderId = isset($_GET['founder']) ? strtolower(trim((string) $_GET['founder'])) : '';
if ($founderId === '' && isset($_SERVER['PATH_INFO'])) {
    $founderId = strtolower(trim((string) $_SERVER['PATH_INFO'], '/'));
}
if (!isset(FOUNDERS[$founderId])) {
    http_response_code(404);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => 'founder_id invalido'], JSON_UNESCAPED_UNICODE);
    exit;
}

$vcf = build_vcard(FOUNDERS[$founderId]);

http_response_code(200);
header('Content-Type: text/vcard; charset=utf-8');
header('Content-Disposition: attachment; filename="' . slugify(FOUNDERS[$founderId]['name']) . '.vcf"');
header('Content-Length: ' . strlen($vcf));
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
echo $vcf;
exit;
