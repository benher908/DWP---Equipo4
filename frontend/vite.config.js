import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],

  // allow proxy target to be overridden with an env var (only used by dev server)
  server: {
    proxy: {
      '/api': {
        // when running locally we proxy to localhost; inside Docker we want
        // to reach the backend service by its container name
        target: process.env.VITE_PROXY_TARGET || 'http://localhost:3010',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}))
