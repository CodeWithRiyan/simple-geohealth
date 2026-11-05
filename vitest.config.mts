import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.mjs'

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            setupFiles: ['./src/setupTests.ts'],
            include: ['src/**/*.{test,spec}.{ts,tsx}', 'scripts/**/*.test.ts'],
            // Playwright specs live in e2e/ and are run by `pnpm e2e`.
            exclude: ['e2e/**', 'node_modules/**'],
            testTimeout: 10_000,
            hookTimeout: 10_000,
            // Enabled with `pnpm test --coverage`.
            coverage: {
                provider: 'v8',
                include: ['src/**/*.{ts,tsx}'],
                exclude: [
                    'src/**/*.{test,spec}.{ts,tsx}',
                    'src/test/**',
                    'src/setupTests.ts',
                    'src/vite-env.d.ts',
                    'src/index.tsx', // browser entry point; exercised by e2e
                    'src/**/index.{ts,tsx}', // re-export barrels
                    'src/i18n/types.ts',
                ],
                reporter: ['text', 'html', 'lcov', 'json-summary'],
                reportsDirectory: './coverage',
                // The same gate as the simple-geolocation reference.
                thresholds: {
                    statements: 95,
                    branches: 85,
                    functions: 95,
                    lines: 95,
                },
            },
        },
    })
)
