import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Fallback to 3000 (your Express port); override in .env.local
  const apiTarget = env.VITE_API_BASE_URL || 'http://10.71.108.95:3000'

  return {
    plugins: [
      react(),
      basicSsl(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        devOptions: { enabled: true },
        manifest: {
          name: 'DataBowl',
          short_name: 'DataBowl',
          description: 'Nutrition insights from meal photos',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          icons: [
            { src: '/icons/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icons/maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.pathname.startsWith('/api/'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                cacheableResponse: { statuses: [0, 200] }
              }
            }
          ]
        }
      })
    ],
    server: {
      port: 3000,
      strictPort: true,
       https: false, 
       host: '0.0.0.0',

      proxy: {
        // Forward all /api requests to your backend during development
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          // If your backend routes don't have the /api prefix, uncomment:
          // rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    },
    // Now correctly inside return: Proxy for preview server on 4173
    preview: {
      port: 4173,
      strictPort: true,
      https: false,  // Add HTTPS here too for preview mode
      host: '0.0.0.0',   // Expose preview to network
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          // Mirror any rewrite from server if needed
        }
      }
    }
  }
})
