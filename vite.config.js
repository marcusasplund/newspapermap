import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import suidPlugin from '@suid/vite-plugin'

export default defineConfig({
  plugins: [suidPlugin(), solidPlugin()],
  build: {
    target: 'esnext'
  },
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_DEV_API_TARGET || 'http://localhost',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
