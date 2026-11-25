import { defineConfig, loadEnv } from 'vite'
import solidPlugin from '@solidjs/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [tailwindcss(), solidPlugin()],
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    optimizeDeps: {
      exclude: ['@ui-sdk/core']
    },
    build: {
      target: 'esnext'
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_DEV_API_TARGET || 'https://newspapermap.com',
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
