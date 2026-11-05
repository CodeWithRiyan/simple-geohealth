import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * The app is served from a sub-path on GitHub Pages
 * (https://<user>.github.io/<repo>/). Dev, preview and tests use the same
 * base so what you see locally is what gets deployed. The deploy workflow
 * sets BASE_PATH from the repository name.
 */
export const BASE_PATH = process.env.BASE_PATH ?? '/simple-geohealth/'

/**
 * Multi-page build: every page is a real HTML file, so each URL can be opened
 * directly and reloaded without any server-side fallback (GitHub Pages serves
 * `<dir>/index.html` for `<dir>/`). Add a page here and in `src/pages.ts`.
 */
export const PAGES = {
    index: 'index.html',
} as const

// https://vite.dev/config/
export default defineConfig({
    base: BASE_PATH,
    // No SPA fallback: an unknown URL is a 404 in dev and preview, exactly
    // like on the static host, instead of silently showing the home page.
    appType: 'mpa',
    plugins: [react()],
    server: {
        port: 3000,
    },
    build: {
        // maplibre-gl is a single ~1 MB library (its own chunk below); the
        // default 500 kB warning would fire on every build for nothing.
        chunkSizeWarningLimit: 1100,
        rolldownOptions: {
            input: PAGES,
            output: {
                // Keep the big third-party libraries in their own cacheable
                // chunks instead of one large bundle.
                codeSplitting: {
                    groups: [
                        {
                            name: 'maplibre',
                            test: /node_modules[\\/]maplibre-gl[\\/]/,
                        },
                        {
                            name: 'mui',
                            test: /node_modules[\\/]@mui[\\/]/,
                        },
                    ],
                },
            },
        },
    },
})
