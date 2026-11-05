import { StyleSpecification } from 'maplibre-gl'

/** Indonesia from end to end on a laptop screen. */
export const INDONESIA_CENTER = { lat: -2.5, lng: 118 }
export const DEFAULT_ZOOM = 3.6

export const DEFAULT_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

/**
 * The tile URL comes from VITE_TILE_URL when set, so the site can move to
 * another tile server without a code change (as the OSM tile usage policy
 * recommends: https://operations.osmfoundation.org/policies/tiles/).
 */
export const tileUrl = (configured = import.meta.env.VITE_TILE_URL): string =>
    configured?.trim() ? configured.trim() : DEFAULT_TILE_URL

/** Raster tiles; no API key required. */
export const mapStyle = (tiles = tileUrl()): StyleSpecification => ({
    version: 8,
    sources: {
        osm: {
            type: 'raster',
            tiles: [tiles],
            tileSize: 256,
            maxzoom: 19,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        },
    },
    layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
})

export const PROVINCES_SOURCE = 'provinces'
export const PROVINCES_LAYER = 'provinces-outline'

/** Where the built province outlines live (see scripts/boundaries/build.ts). */
export const provincesUrl = (base = import.meta.env.BASE_URL): string =>
    `${base}data/provinces.geojson`

export const PROVINCES_ATTRIBUTION =
    '<a href="https://www.geoboundaries.org/">geoBoundaries</a> (ODbL)'
