import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      'firebase/app': 'firebase/app/dist/index.esm.js',
      'firebase/firestore': 'firebase/firestore/dist/index.esm.js',
    },
  },
});