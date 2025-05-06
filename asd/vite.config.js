import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // let the dev server handle SPA fallback
    historyApiFallback: true,
  },
  proxy: {
    // Dev‑server will forward /api & /uploads to the Node backend on 4000
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '/api'),
    },
  },
  build: {
    // default is 500 KB — now bumped to 2048 KB (2 MB)
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // all third-party deps go into a single "vendor" chunk
            return 'vendor'
          }
          // you can add more splitting logic here if needed
        }
      }
    }
  }
})