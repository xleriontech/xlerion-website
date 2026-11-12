import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import fs from 'node:fs'
import path from 'node:path'

// `publicDir: false` evita que Vite publique los dotfiles de public/ (.env.local,
// .env.example) en dist/. Esta capa replica el acceso a public/ solo en dev.
const DEV_MIME = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.json': 'application/json', '.txt': 'text/plain',
  '.css': 'text/css', '.js': 'text/javascript', '.html': 'text/html',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2',
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-redemthor-static',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/redemthor' || req.url === '/redemthor/') {
            req.url = '/redemthor/index.html';
          }
          if (req.url === '/el-ropero' || req.url === '/el-ropero/') {
            req.url = '/el-ropero/index.html';
          }
          next();
        });
      }
    },
    {
      name: 'serve-public-in-dev',
      configureServer(server) {
        const publicRoot = path.resolve(server.config.root, 'public')
        server.middlewares.use((req, res, next) => {
          // Alias de las tarjetas digitales: en produccion los resuelve el
          // .htaccess (RewriteRule ^mike/?$ cards/tarjeta-miguel.html).
          // Aqui se replica para que dev y prod se comporten igual.
          const cardAlias = {
            '/mike': 'cards/tarjeta-miguel.html',
            '/juliette': 'cards/tarjeta-juliette.html',
          }
          const alias = cardAlias[req.url.split('?')[0].replace(/\/+$/, '')]
          const relative = alias || req.url.split('?')[0].replace(/^\/+/, '')

          const publicFile = path.join(publicRoot, relative)
          if (!publicFile.startsWith(publicRoot + path.sep)) return next()
          if (path.basename(publicFile).startsWith('.')) return next()

          // Un directorio con index.html se sirve como el Apache DirectoryIndex
          // (p.ej. /cards/ -> public/cards/index.html).
          if (fs.existsSync(publicFile) && fs.statSync(publicFile).isDirectory()) {
            const indexFile = path.join(publicFile, 'index.html')
            if (!fs.existsSync(indexFile)) return next()
            res.setHeader('Content-Type', DEV_MIME['.html'])
            fs.createReadStream(indexFile).pipe(res)
            return
          }

          if (!fs.existsSync(publicFile) || !fs.statSync(publicFile).isFile()) return next()
          res.setHeader('Content-Type', DEV_MIME[path.extname(publicFile).toLowerCase()] ?? 'application/octet-stream')
          fs.createReadStream(publicFile).pipe(res)
        });
      }
    },
    {
      name: 'serve-cards-tracking-in-dev',
      configureServer(server) {
        // En produccion el tracking lo hace public/api/scan.php (Apache + PHP).
        // En dev este middleware replica el circuito completo para poder
        // probar el QR, el contador y la redireccion sin subir nada.
        const devLog = path.resolve(server.config.root, 'public', 'api', 'logs', 'scans.dev.jsonl')
        const slugs = { miguel: 'mike', juliette: 'juliette' }

        server.middlewares.use((req, res, next) => {
          const match = /^\/api\/scan\/([a-z0-9_-]+)\/?$/.exec(req.url.split('?')[0])
          if (!match) return next()

          const founder = match[1]
          if (!slugs[founder]) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({ ok: false, error: 'founder_id invalido' }))
            return
          }

          const ua = req.headers['user-agent'] || ''
          const device = /bot|crawler|spider/i.test(ua)
            ? 'bot'
            : /ipad|tablet/i.test(ua)
              ? 'tablet'
              : /mobile|iphone|android/i.test(ua)
                ? 'mobile'
                : 'desktop'

          const record = {
            founder_id: founder,
            timestamp: new Date().toISOString(),
            ip_address: '127.0.0.1',
            ip_hash: 'dev',
            user_agent: ua.slice(0, 400),
            referer: (req.headers.referer || '').slice(0, 500),
            device_type: device,
            source: 'dev',
          }

          try {
            fs.mkdirSync(path.dirname(devLog), { recursive: true })
            fs.appendFileSync(devLog, JSON.stringify(record) + '\n')
          } catch {
            /* el log de dev es opcional */
          }

          const stats = req.url.includes('stats=1')
          if (stats) {
            let total = 0
            try {
              const raw = fs.readFileSync(devLog, 'utf8')
              total = raw
                .split('\n')
                .filter(Boolean)
                .map((l) => JSON.parse(l))
                .filter((r) => r.founder_id === founder).length
            } catch {
              /* sin log todavia */
            }
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(
              JSON.stringify({
                ok: true,
                stats: { founder, total, unique: total, by_device: {}, by_source: {}, by_day: {} },
              })
            )
            return
          }

          res.statusCode = 302
          res.setHeader('Location', '/' + slugs[founder])
          res.end()
        })
      }
    },
    // Copiar assets al root de dist/ preservando estructura de directorios
    viteStaticCopy({
      targets: [
        { src: 'public/images/*', dest: 'images' },
        { src: 'public/videos/*', dest: 'videos' },
      ]
    })
  ],
  // Deshabilitar copia automática de public/
  publicDir: false,
  server: {
    watch: {
      // docs/site-example/ contiene maquetas estaticas que no necesitan HMR.
      // Ademas el IDE (Qoder) deja marcadores bloqueados ahi y el watcher
      // revienta con EBUSY, tumbando el servidor de desarrollo.
      // Los .zip de despliegue tampoco: se generan en la raiz y bloquean.
      ignored: [
        '**/docs/site-example/**',
        '**/dist/**',
        '**/.git/**',
        '**/*.zip',
      ],
    },
  },
  build: {
    // Optimizaciones para producción
    target: 'es2020',
    minify: 'esbuild',  // Usar esbuild en lugar de terser (más rápido y sin dependencias)
    // Configuración de chunks
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'three-vendor': ['three'],
          'ui-vendor': ['lucide-react'],
        },
        // Nombre de archivos con hash para cache busting
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|gif|svg|webp|ico/.test(ext)) {
            return `images/[name].[hash][extname]`;
          } else if (/woff|woff2|ttf|otf|eot/.test(ext)) {
            return `fonts/[name].[hash][extname]`;
          } else if (ext === 'css') {
            return `css/[name].[hash][extname]`;
          }
          return `[name].[hash][extname]`;
        },
      },
    },
    // Límites de tamaño
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    // Ubicación del build
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    // Source maps solo en desarrollo
    sourcemap: false,
  },
  server: {
    host: 'localhost',
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  }
})