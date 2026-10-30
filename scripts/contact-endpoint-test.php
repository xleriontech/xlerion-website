<?php
/**
 * Prueba del endpoint public/api/contact.php.
 *
 * Carga las definiciones reales del archivo (todo lo anterior a su punto de
 * ejecución) para ejercitarlas sin levantar un servidor.
 *
 *   php scripts/contact-endpoint-test.php
 */

declare(strict_types=1);
mb_internal_encoding('UTF-8');

$src = file_get_contents(__DIR__ . '/../public/api/contact.php');
$cut = strpos($src, '$config = load_config();');
if ($cut === false) {
    fwrite(STDERR, "No se hallo el punto de ejecucion en contact.php\n");
    exit(1);
}
eval(preg_replace('/^\s*<\?php\s*/', '', substr($src, 0, $cut), 1));

$fail = 0;
function check(string $label, bool $ok): void
{
    global $fail;
    if (!$ok) {
        $fail++;
    }
    echo ($ok ? 'PASS  ' : 'FALLA ') . $label . "\n";
}

// --- Inyeccion de headers: el subject viaja como cabecera en mail()
$subject = single_line('Nueva solicitud PoC: T-1 - ACME' . "\r\n" . 'Bcc: spam@evil.com');
check('subject sin CRLF', strpos($subject, "\r") === false && strpos($subject, "\n") === false);

// --- Escapado HTML de todo campo de origen usuario
$html = build_email_html([
    'name'    => '<script>alert(1)</script>',
    'company' => 'A & "B" <C>',
    'email'   => 'x@y.com',
    'role'    => '',
    'sector'  => '<img src=x onerror=alert(2)>',
    'interest'=> '',
    'message' => "linea1\nlinea2 <b>negrita</b>",
], 'T-2');
check('sin <script> crudo', strpos($html, '<script>') === false);
check('sin <img> inyectado', strpos($html, '<img') === false);
check('sin <b> crudo', strpos($html, '<b>') === false);
check('contenido escapado, no borrado', strpos($html, '&lt;script&gt;') !== false && strpos($html, '&amp;') !== false);
check('saltos de linea conservados como <br>', strpos($html, 'linea1<br') !== false);
check('campo vacio -> No especificado', strpos($html, 'Cargo:</strong> No especificado') !== false);
check('campo opcional vacio omitido', strpos($html, 'Interés:') === false);

// --- Validacion de correo (incluye CRLF para reply_to)
check('rechaza email con CRLF', valid_email("a@b.com\r\nBcc: x@y.com") === false);
check('rechaza email vacio', valid_email('') === false);
check('rechaza email sin arroba', valid_email('no-es-email') === false);
check('rechaza email >254 chars', valid_email(str_repeat('a', 250) . '@x.com') === false);
check('acepta email valido', valid_email('miguel@xlerion.com.co') === true);

// --- clean_text
check('elimina caracteres de control', clean_text("ho\x00la\x1bworld", 100) === 'holaworld');
check('recorta a maxLen', strlen(clean_text(str_repeat('a', 9000), MAX_TEXT_LEN)) === MAX_TEXT_LEN);
check('valores no-string -> cadena vacia', clean_text(null, 10) === '' && clean_text(['x'], 10) === '');
check('UTF-8 intacto', clean_text('Comprensión Minería', 100) === 'Comprensión Minería');

echo "\n" . ($fail === 0 ? "Todas las pruebas pasaron\n" : "{$fail} prueba(s) fallida(s)\n");
exit($fail === 0 ? 0 : 1);
