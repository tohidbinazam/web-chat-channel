import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api/v1': {
        target: 'http://localhost:5000',
        secure: false,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 500 * 1024, // 500kb
  },
});
