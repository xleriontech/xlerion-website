# Asistente Xlerion (RAG) — despliegue en cPanel

Arquitectura híbrida: el sitio sirve un widget estático y un proxy PHP ligero;
la generación vive en un proveedor externo y la recuperación vectorial, cuando
se necesita, en un gateway propio. El hosting compartido no ejecuta inferencia
ni bases vectoriales (swap al 99,35 %, límites CloudLinux, sin Docker,
Imunify360 bloquea `exec`).

```
widget-xlerion.js → POST /api/chat → chat-proxy.php → gateway externo → LLM
                                         │
                                         └─ MariaDB (hashes de auditoría)
```

## Archivos

| Archivo | Destino en el servidor |
|---|---|
| `public/js/widget-xlerion.js` | `public_html/js/widget-xlerion.js` (lo copia el build) |
| `public/api/chat-proxy.php` | `public_html/api/chat-proxy.php` (lo copia el build) |
| `docs/rag/chat-schema.sql` | phpMyAdmin de la base del chat |
| `docs/rag/ai.php.example` | `/home/USUARIO/xlerion-secrets/ai.php` (fuera de `public_html`) |
| `docs/rag/system-prompt.txt` | `/home/USUARIO/xlerion-secrets/ai.php.prompt` |
| `scripts/chat-retention.php` | `/home/USUARIO/scripts/chat-retention.php` |

El widget se inyecta desde `index.html` y **siempre se monta**. Consulta
`GET /api/chat?health=1`: si responde `{"enabled":true}` habilita el chat;
si la config está incompleta, `enabled` es `false` o el proxy falla, muestra
el protocolo de respaldo (contacto directo, FAQ y aviso de privacidad).

## Proveedores

`provider` acepta dos valores:

- **`groq`** — llamada directa a `https://api.groq.com/openai/v1/chat/completions`.
  No hay retrieval vectorial: el system prompt lleva la base de conocimiento
  resumida y el modelo responde con ella. Sirve para arrancar sin infraestructura
  adicional. Usa `groq_model` con un modelo disponible en tu cuenta (por
  ejemplo `openai/gpt-oss-120b`); consúltalos en `GET /openai/v1/models`.
- **`gateway`** — servicio externo propio con base vectorial y re-ranking. Es la
  única vía para RAG real sobre todo el contenido del sitio.

## Contrato del gateway

`POST` con `Authorization: Bearer <token>`:

```json
{ "messages": [ { "role": "system", "content": "..." },
                { "role": "user", "content": "..." } ] }
```

Respuesta:

```json
{ "answer": "...", "confidence": 0.93,
  "sources": [ { "title": "Soluciones", "url": "https://xlerion.com.co/" } ],
  "refused": false }
```

El gateway debe recuperar solo de fuentes oficiales (sitio, documento MinTIC
del 19/08/2025, casos de éxito) y devolver `confidence` real. El proxy rechaza
cualquier respuesta con `confidence < 0.75` y sustituye por la negativa
canónica. Las fuentes solo se aceptan si el host es `xlerion.com.co` o
`mintic.gov.co`.

## Despliegue

1. **Base de datos:** cPanel → *MySQL Databases* → crear base y usuario con
   permisos solo sobre esa base. Ejecutar `chat-schema.sql` en phpMyAdmin.
2. **Secretos:** copiar `ai.php.example` a
   `/home/USUARIO/xlerion-secrets/ai.php`, rellenar valores, `chmod 600`.
   Copiar `system-prompt.txt` al mismo directorio como `ai.php.prompt`.
3. **Proveedor:** con `provider => 'groq'` basta la clave de Groq en
   `ai.php`; con `provider => 'gateway'` hay que desplegar el Worker/Function
   con la base vectorial y usar un token propio y rotable.
4. **Build y subida:** `npm run build` y subir `dist/` completo. Comprobar que
   existen `dist/js/widget-xlerion.js` y `dist/api/chat-proxy.php`.
5. **PHP:** MultiPHP Manager con PHP 8.2+ y extensiones `curl`, `pdo_mysql`,
   `openssl`, `mbstring`.
6. **Activación:** poner `enabled => true` en `ai.php`. Sin este paso el widget
   aparece, pero en modo de respaldo (sin IA).
7. **Retención:** cPanel → *Cron Jobs*, diario 03:00:
   `php /home/USUARIO/scripts/chat-retention.php /home/USUARIO/xlerion-secrets/ai.php`
8. **Imunify360:** el proxy no usa `exec`, `eval` ni payloads base64. Mantener
   cuerpos < 8 KB y cURL con TLS verificado. Si el WAF bloquea `/api/chat`,
   pedir a soporte una excepción para esa ruta; no desactivar el WAF.

## Prueba

```bash
curl -s "https://xlerion.com.co/api/chat?health=1"
# {"enabled":true}

curl -s https://xlerion.com.co/api/chat \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://xlerion.com.co' \
  -d '{"question":"¿Qué es un gemelo digital?","consent":true,"consent_version":"2026-11"}'
```

Esperado: JSON con `answer`, `sources` y `confidence`, y una fila nueva en
`chat_audit` (solo hashes).

## Cumplimiento

- **Ley 1581 de 2012 / Decreto 1377 de 2013:** aviso antes de la primera
  consulta, versión de consentimiento validada en el proxy, logs con hash y
  retención de 90 días.
- **MinTIC 2025:** lenguaje factual únicamente; el proxy reemplaza la respuesta
  si detecta términos prohibidos (segunda línea de defensa tras el prompt).
- **Trazabilidad:** `chat_audit` guarda confianza, número de fuentes, negativa,
  latencia y versión de consentimiento, sin texto ni IP.
