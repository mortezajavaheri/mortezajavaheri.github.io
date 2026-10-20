
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Open Graph needs absolute URLs. `%SITE_URL%` in index.html becomes VITE_SITE_URL
 * (no trailing slash); a canonical link is added only when it's configured.
 */
function siteUrl(url: string): Plugin {
  const base = url.replace(/\/$/, '')
  return {
    name: 'site-url',
    transformIndexHtml(html) {
      const out = html.replaceAll('%SITE_URL%', base)
      return base
        ? out.replace(
            '</head>',
            `  <link rel="canonical" href="${base}/" />\n  </head>`,
          )
        : out
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    base: '/', // NEW: personal GitHub Pages site lives at the root

    plugins: [
      react(),
      tailwindcss(),
      siteUrl(env.VITE_SITE_URL ?? ''),
    ],

    define: {
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __APP_VERSION__: JSON.stringify(
        process.env.npm_package_version ?? '1.0.0',
      ),
    },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    build: {
      target: 'es2022',
      // The lazy-loaded Three.js chunk is large by nature; it never blocks first paint.
      chunkSizeWarningLimit: 1000,
    },
  }
})
