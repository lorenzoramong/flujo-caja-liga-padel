import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // La ruta relativa permite publicar el mismo proyecto en cualquier repositorio de GitHub Pages.
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'logo-lpa.png',
        'favicon-64.png',
        'apple-touch-icon.png'
      ],
      manifest: {
        name: 'Flujo de Caja - Liga de Padel del Atlántico',
        short_name: 'Flujo LPA',
        description: 'Control personal de ingresos, egresos y balance de la Liga de Padel del Atlántico.',
        theme_color: '#042D4E',
        background_color: '#FFFFFF',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})
