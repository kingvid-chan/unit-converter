import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/projects/unit-converter/',
  plugins: [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          /(src|href)="(\/[^"]+)"/g,
          '$1="$2?v=0.0.1"'
        )
      }
    }
  ],
  server: {
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
  preview: {
    headers: {
      'Cache-Control': 'no-cache',
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
