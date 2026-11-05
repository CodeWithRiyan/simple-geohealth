// Adds jest-dom matchers (toBeInTheDocument, toHaveTextContent, ...) to Vitest's expect.
import '@testing-library/jest-dom/vitest'
import { cleanup, configure } from '@testing-library/react'
import { afterEach } from 'vitest'

// findBy*/waitFor give up after 1 s by default — too tight on a loaded machine.
configure({ asyncUtilTimeout: 5_000 })

// @testing-library/react only auto-cleans when test globals are enabled; we
// keep globals off (explicit imports), so unmount between tests here.
afterEach(() => {
    cleanup()
    localStorage.clear()
})
