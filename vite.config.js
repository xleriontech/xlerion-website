import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

import { cloudflare } from "@cloudflare/vite-plugin";

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
    cloudflare(),
    // Copiar SOLO lo necesario del public/ - excluir sub-proyectos
    viteStaticCopy({
      targets: [
        { src: 'public/images', dest: '' },
        { src: 'public/videos', dest: '' },
        { src: 'public/manifest.json', dest: '' },
        { src: 'public/service-worker.js', dest: '' },
        { src: 'public/robots.txt', dest: '' },
        { src: 'public/favicon.ico', dest: '' },
        { src: 'public/favicon.png', dest: '' },
        { src: 'public/LogoX.png', dest: '' },
        { src: 'public/LogoX.svg', dest: '' },
        { src: 'public/logo-1200x1200.png', dest: '' },
        { src: 'public/logo-512.png', dest: '' },
        { src: 'public/humans.txt', dest: '' },
        { src: 'public/sitemap.xml', dest: '' },
        { src: 'public/sitemapindex.xml', dest: '' },
        { src: 'public/.htaccess', dest: '' },
      ]
    }),
    cloudflare()
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