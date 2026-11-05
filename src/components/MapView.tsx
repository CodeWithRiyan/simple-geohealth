import { useEffect, useRef, useState } from 'react'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import { Map, setWorkerUrl } from 'maplibre-gl'
import maplibreWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'
import 'maplibre-gl/dist/maplibre-gl.css'
import type { FeatureCollection } from 'geojson'
import { useI18n } from '../i18n/context'
import {
    DEFAULT_ZOOM,
    INDONESIA_CENTER,
    PROVINCES_ATTRIBUTION,
    PROVINCES_LAYER,
    PROVINCES_SOURCE,
    mapStyle,
    provincesUrl,
} from './mapStyle'

// MapLibre locates its worker relative to import.meta.url, which points at the
// bundled chunk after a Vite build. Hand it the worker as a static asset instead.
setWorkerUrl(maplibreWorkerUrl)

type ProvincesState = 'loading' | 'loaded' | 'failed'

async function fetchProvinces(url: string): Promise<FeatureCollection> {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return (await response.json()) as FeatureCollection
}

/**
 * The map: OpenStreetMap tiles with the province outlines on top. The Map is
 * constructed exactly once (on mount). If it cannot be created at all (no
 * WebGL) an alert takes its place and the rest of the page keeps working;
 * if only the outlines fail, the map stays and a line says so.
 */
export const MapView = () => {
    const { t } = useI18n()
    const containerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<Map | null>(null)
    const [failed, setFailed] = useState(false)
    const [provinces, setProvinces] = useState<ProvincesState>('loading')

    useEffect(() => {
        const container = containerRef.current
        if (!container || mapRef.current) return

        let map: Map
        try {
            map = new Map({
                container,
                style: mapStyle(),
                center: [INDONESIA_CENTER.lng, INDONESIA_CENTER.lat],
                zoom: DEFAULT_ZOOM,
                attributionControl: { compact: false },
                // MapLibre's own UI strings (the canvas is the map's landmark).
                locale: { 'Map.Title': t.map.region },
            })
        } catch (error) {
            console.error('MapLibre could not start', error)
            // Error path only, runs once: swap the map for an alert.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFailed(true)
            return
        }
        mapRef.current = map

        let cancelled = false
        map.once('load', () => {
            fetchProvinces(provincesUrl())
                .then((data) => {
                    if (cancelled) return
                    map.addSource(PROVINCES_SOURCE, {
                        type: 'geojson',
                        data,
                        attribution: PROVINCES_ATTRIBUTION,
                    })
                    map.addLayer({
                        id: PROVINCES_LAYER,
                        type: 'line',
                        source: PROVINCES_SOURCE,
                        paint: { 'line-color': '#c62828', 'line-width': 1 },
                    })
                    setProvinces('loaded')
                })
                .catch((error) => {
                    if (cancelled) return
                    console.warn('Province outlines failed to load', error)
                    setProvinces('failed')
                })
        })

        return () => {
            cancelled = true
            map.remove()
            mapRef.current = null
        }
        // The map is built once; later language changes relabel it below.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // MapLibre reads `locale` only at construction; follow later language
    // changes by relabelling its canvas (role="region") directly.
    useEffect(() => {
        mapRef.current?.getCanvas().setAttribute('aria-label', t.map.region)
    }, [t])

    if (failed) {
        return (
            <Alert severity="error" role="alert" sx={{ m: 2 }}>
                {t.map.unavailable}
            </Alert>
        )
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div
                ref={containerRef}
                data-testid="map-view"
                data-provinces={provinces}
                style={{ width: '100%', height: '100%' }}
            />
            {provinces === 'failed' && (
                <Typography
                    role="status"
                    variant="caption"
                    sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        px: 1,
                        bgcolor: 'background.paper',
                        borderRadius: 1,
                    }}
                >
                    {t.map.provincesFailed}
                </Typography>
            )}
        </div>
    )
}

export default MapView
