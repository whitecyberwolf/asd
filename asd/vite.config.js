import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // let the dev server handle SPA fallback
    historyApiFallback: true,
  },
})
  