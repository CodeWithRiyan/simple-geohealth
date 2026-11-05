/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Raster tile URL template for the map. Defaults to OpenStreetMap's tile server. */
    readonly VITE_TILE_URL?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
