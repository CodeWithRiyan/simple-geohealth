import { act, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MapView } from './MapView'
import {
    DEFAULT_TILE_URL,
    PROVINCES_LAYER,
    PROVINCES_SOURCE,
    mapStyle,
    provincesUrl,
    tileUrl,
} from './mapStyle'
import { I18nProvider } from '../i18n/I18nProvider'
import { useI18n } from '../i18n/context'
import { MapMock, mapInstances } from '../test/maplibreMock'

vi.mock('maplibre-gl', async () =>
    (await import('../test/maplibreMock')).maplibreMockFactory()
)

const PROVINCES = { type: 'FeatureCollection', features: [] }

const respond = (body: unknown, ok = true) =>
    vi.fn(async () => ({
        ok,
        status: ok ? 200 : 404,
        json: async () => body,
    }))

const LanguageButton = () => {
    const { setLanguage } = useI18n()
    return <button onClick={() => setLanguage('en')}>en</button>
}

const renderMap = () =>
    render(
        <I18nProvider initialLanguage="id">
            <MapView />
            <LanguageButton />
        </I18nProvider>
    )

describe('mapStyle', () => {
    it('uses the OpenStreetMap tile server unless VITE_TILE_URL is set', () => {
        expect(tileUrl(undefined)).toBe(DEFAULT_TILE_URL)
        expect(tileUrl('  ')).toBe(DEFAULT_TILE_URL)
        expect(tileUrl(' https://tiles.example/{z}/{x}/{y}.png ')).toBe(
            'https://tiles.example/{z}/{x}/{y}.png'
        )
        const style = mapStyle('https://tiles.example/{z}/{x}/{y}.png')
        expect(style.sources.osm).toMatchObject({
            tiles: ['https://tiles.example/{z}/{x}/{y}.png'],
        })
    })

    it('finds the province file under the site base path', () => {
        expect(provincesUrl('/simple-geohealth/')).toBe(
            '/simple-geohealth/data/provinces.geojson'
        )
    })
})

describe('MapView', () => {
    beforeEach(() => {
        MapMock.mockClear()
    })
    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    it('constructs one map over Indonesia, labelled in the current language', () => {
        vi.stubGlobal('fetch', respond(PROVINCES))
        renderMap()

        expect(MapMock).toHaveBeenCalledTimes(1)
        expect(MapMock.mock.calls[0][0]).toMatchObject({
            center: [118, -2.5],
            attributionControl: { compact: false },
            locale: { 'Map.Title': 'Peta' },
        })
    })

    it('draws the province outlines once the map has loaded', async () => {
        const fetchMock = respond(PROVINCES)
        vi.stubGlobal('fetch', fetchMock)
        renderMap()
        const map = mapInstances()[0]
        expect(fetchMock).not.toHaveBeenCalled()

        act(() => map.fireLoad())

        await waitFor(() =>
            expect(screen.getByTestId('map-view')).toHaveAttribute(
                'data-provinces',
                'loaded'
            )
        )
        expect(fetchMock).toHaveBeenCalledWith(provincesUrl())
        expect(map.addSource).toHaveBeenCalledWith(
            PROVINCES_SOURCE,
            expect.objectContaining({ type: 'geojson', data: PROVINCES })
        )
        expect(map.addLayer).toHaveBeenCalledWith(
            expect.objectContaining({
                id: PROVINCES_LAYER,
                source: PROVINCES_SOURCE,
            })
        )
    })

    it('keeps the map and says so when the outlines fail to load', async () => {
        vi.spyOn(console, 'warn').mockImplementation(() => {})
        vi.stubGlobal('fetch', respond(null, false))
        renderMap()

        act(() => mapInstances()[0].fireLoad())

        expect(await screen.findByRole('status')).toHaveTextContent(
            'Batas provinsi tidak dapat dimuat.'
        )
        expect(screen.getByTestId('map-view')).toHaveAttribute(
            'data-provinces',
            'failed'
        )
    })

    it('ignores outlines that arrive after the map was removed', async () => {
        let resolve: (value: unknown) => void = () => {}
        vi.stubGlobal(
            'fetch',
            vi.fn(() => new Promise((r) => (resolve = r)))
        )
        const { unmount } = renderMap()
        const map = mapInstances()[0]
        act(() => map.fireLoad())

        unmount()
        await act(async () =>
            resolve({ ok: true, status: 200, json: async () => PROVINCES })
        )

        expect(map.remove).toHaveBeenCalled()
        expect(map.addSource).not.toHaveBeenCalled()
    })

    it('ignores a failure that arrives after the map was removed', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
        let reject: (error: Error) => void = () => {}
        vi.stubGlobal(
            'fetch',
            vi.fn(() => new Promise((_, r) => (reject = r)))
        )
        const { unmount } = renderMap()
        act(() => mapInstances()[0].fireLoad())

        unmount()
        await act(async () => reject(new Error('offline')))

        expect(warn).not.toHaveBeenCalled()
    })

    it('relabels the map canvas when the language changes', () => {
        vi.stubGlobal('fetch', respond(PROVINCES))
        renderMap()

        act(() => screen.getByRole('button', { name: 'en' }).click())

        expect(mapInstances()[0].getCanvas().getAttribute('aria-label')).toBe(
            'Map'
        )
    })

    it('shows an alert instead of the map when MapLibre cannot start', () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
        MapMock.mockImplementationOnce(function () {
            throw new Error('WebGL not supported')
        })
        renderMap()

        expect(screen.getByRole('alert')).toHaveTextContent(
            'Peta tidak dapat ditampilkan di browser ini (WebGL tidak tersedia).'
        )
        expect(screen.queryByTestId('map-view')).not.toBeInTheDocument()
    })
})
