// PATH: frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@':           path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages':      path.resolve(__dirname, './src/pages'),
      '@hooks':      path.resolve(__dirname, './src/hooks'),
      '@services':   path.resolve(__dirname, './src/services'),
      '@utils':      path.resolve(__dirname, './src/utils'),
      '@contexts':   path.resolve(__dirname, './src/contexts'),
      '@styles':     path.resolve(__dirname, './src/styles'),
      '@lib':        path.resolve(__dirname, './src/lib'),   // ← NEW
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': { target: 'http://localhost:5001', changeOrigin: true }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['recharts'],
          forms:  ['react-hook-form'],
        }
      }
    }
  }
});