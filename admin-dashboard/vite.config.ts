import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Your correct TanStack Router plugin syntax
    tanstackRouter(),
  ],
  // Add the server proxy configuration
  server: {
    proxy: {
      // Any request from your app starting with /api will be forwarded
      '/api': {
        target: 'https://the-dojo.pagoda.africa',
        changeOrigin: true,
      },
    },
  },
})