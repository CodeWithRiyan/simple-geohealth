import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('maplibre-gl', async () =>
    (await import('./test/maplibreMock')).maplibreMockFactory()
)

describe('App', () => {
    beforeEach(() => {
        vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['id-ID'])
        vi.stubGlobal(
            'fetch',
            vi.fn(async () => ({
                ok: true,
                status: 200,
                json: async () => ({}),
            }))
        )
    })
    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    it('shows the map, the title, what is coming and the sources', () => {
        render(<App />)

        expect(screen.getByTestId('map-view')).toBeInTheDocument()
        expect(
            screen.getByRole('heading', {
                level: 1,
                name: 'Simple Geohealth',
            })
        ).toBeVisible()
        const main = screen.getByRole('main')
        expect(within(main).getAllByRole('listitem').length).toBeGreaterThan(4)
        expect(screen.getByTestId('credits')).toBeInTheDocument()
    })

    it('switches the whole page to English', async () => {
        const user = userEvent.setup()
        render(<App />)

        await user.selectOptions(
            screen.getByRole('combobox', { name: 'Bahasa' }),
            'en'
        )

        expect(
            screen.getByRole('heading', { name: 'Coming next' })
        ).toBeVisible()
        expect(
            screen.getByRole('link', { name: 'Skip to content' })
        ).toBeInTheDocument()
    })
})
