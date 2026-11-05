import { defineConfig, devices } from '@playwright/test'
import { BASE_PATH } from './vite.config.mjs'

/**
 * `pnpm e2e` builds the site and tests the production bundle (preview),
 * exactly what gets deployed. With E2E_BASE_URL set (e.g. the live GitHub
 * Pages URL) it runs the same specs against that site instead: the smoke test.
 */
const PORT = 4173
const live = process.env.E2E_BASE_URL
const baseURL = live ?? `http://localhost:${PORT}${BASE_PATH}`

export default defineConfig({
    testDir: './e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI
        ? [['github'], ['html', { open: 'never' }]]
        : 'list',
    use: {
        baseURL,
        // The app picks its language from the browser; pin it so specs are
        // deterministic (language checks override this where it matters).
        locale: 'id-ID',
        trace: 'on-first-retry',
        launchOptions: {
            // MapLibre needs WebGL. Headless Chromium has no GPU, so force the
            // software (SwiftShader) renderer on every machine, CI included.
            args: [
                '--use-angle=swiftshader',
                '--enable-unsafe-swiftshader',
                '--ignore-gpu-blocklist',
            ],
        },
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: live
        ? undefined
        : {
              command: `pnpm build && pnpm preview --port ${PORT} --strictPort`,
              url: baseURL,
              reuseExistingServer: false,
              timeout: 120_000,
          },
})
