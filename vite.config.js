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
          const publicFile = path.join(publicRoot, req.url.split('?')[0].replace(/^\/+/, ''))
          if (!publicFile.startsWith(publicRoot + path.sep)) return next()
          if (path.basename(publicFile).startsWith('.')) return next()
          if (!fs.existsSync(publicFile) || !fs.statSync(publicFile).isFile()) return next()
          res.setHeader('Content-Type', DEV_MIME[path.extname(publicFile).toLowerCase()] ?? 'application/octet-stream')
          fs.createReadStream(publicFile).pipe(res)
        });
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