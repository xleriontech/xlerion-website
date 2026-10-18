import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.js',
            ],
            refresh: true,
        }),
    ],
    server: {
        port: 3000,
        hmr: {
            host: 'localhost',
            port: 5174,
        },
        middlewareMode: false,
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'alpine': ['alpinejs'],
                    'axios': ['axios'],
                },
            },
        },
    },
    preview: {
        port: 5175,
    }
});
