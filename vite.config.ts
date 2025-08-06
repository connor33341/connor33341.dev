import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
//import laravel from 'laravel-vite-plugin';
//import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    esbuild: {
        jsx: 'automatic',
    },
    server: {
        host: 'localhost',
        port: 5173,
        strictPort: false,
        hmr: {
            port: 5174
        }
    },
    build: {
        rollupOptions: {
            input: 'src/index.tsx'
        }
    },
    /*resolve: {
        alias: {
            'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },*/
    assetsInclude: ['**/*.md'],
});