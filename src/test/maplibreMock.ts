import type {
    FlyToOptions,
    LngLatLike,
    MapOptions,
    PointLike,
} from 'maplibre-gl'
import { vi } from 'vitest'

/**
 * Stand-in for maplibre-gl (needs WebGL, which jsdom lacks). Records
 * constructor calls and the methods MapView relies on.
 */
type Handler = (event?: unknown) => void

export interface SourceInstance {
    options: unknown
    setData: ReturnType<typeof vi.fn<(data: unknown) => void>>
    getClusterExpansionZoom: ReturnType<
        typeof vi.fn<(clusterId: number) => Promise<number>>
    >
}

/** A handler MapLibre exposes as `map.<name>` (keyboard, dragPan, …). */
export interface HandlerInstance {
    enable: ReturnType<typeof vi.fn<() => void>>
    disable: ReturnType<typeof vi.fn<() => void>>
    isEnabled: () => boolean
}

/** Pixels per degree in the mock's flat projection (centre of the canvas = map centre). */
export const MOCK_PX_PER_DEGREE = 100
/** The mock canvas's size, px. */
export const MOCK_CANVAS = { width: 400, height: 300 }

export interface MapInstance {
    container: HTMLElement
    flyTo: ReturnType<typeof vi.fn<(options: FlyToOptions) => void>>
    easeTo: ReturnType<typeof vi.fn<(options: unknown) => void>>
    /** Moves the centre by the given pixels (flat projection). */
    panBy: ReturnType<
        typeof vi.fn<(offset: [number, number], options?: unknown) => void>
    >
    /** The current centre of the mock's flat projection. */
    getCenter: () => { lng: number; lat: number }
    /** Flat projection: 100 px per degree, centre of the canvas = centre. Takes arrays or objects, like the real thing. */
    project: (lngLat: LngLatLike) => { x: number; y: number }
    unproject: (point: PointLike) => { lng: number; lat: number }
    getContainer: () => HTMLElement
    keyboard: HandlerInstance
    dragPan: HandlerInstance
    dragRotate: HandlerInstance
    doubleClickZoom: HandlerInstance
    removeLayer: ReturnType<typeof vi.fn<(id: string) => void>>
    removeSource: ReturnType<typeof vi.fn<(id: string) => void>>
    moveLayer: ReturnType<typeof vi.fn<(id: string, before?: string) => void>>
    /** Whether a source's tiles are loaded (default: yes). */
    isSourceLoaded: ReturnType<typeof vi.fn<(id: string) => boolean>>
    /** Simulate a rendered frame. */
    fireRender: () => void
    off: ReturnType<typeof vi.fn<(event: string, handler: Handler) => void>>
    fitBounds: ReturnType<
        typeof vi.fn<(bounds: unknown, options?: unknown) => void>
    >
    triggerRepaint: ReturnType<typeof vi.fn<() => void>>
    /** Simulate MapLibre's 'idle' event (rendering done). */
    fireIdle: () => void
    version: string
    remove: ReturnType<typeof vi.fn>
    once: ReturnType<typeof vi.fn<(event: string, handler: Handler) => void>>
    /** `on(event, handler)` or `on(event, layerId, handler)`, like the real thing. */
    on: ReturnType<
        typeof vi.fn<
            (
                event: string,
                layerOrHandler: string | Handler,
                handler?: Handler
            ) => void
        >
    >
    getZoom: () => number
    addSource: ReturnType<typeof vi.fn<(id: string, options: unknown) => void>>
    addLayer: ReturnType<typeof vi.fn<(layer: { id: string }) => void>>
    getSource: (id: string) => SourceInstance | undefined
    getLayer: (id: string) => { id: string } | undefined
    /** What a screen-point query answers (default: nothing). */
    queryRenderedFeatures: ReturnType<
        typeof vi.fn<(...args: unknown[]) => unknown[]>
    >
    /** What a source query answers (default: nothing); set `.mockReturnValue` to simulate clusters. */
    querySourceFeatures: ReturnType<
        typeof vi.fn<(...args: unknown[]) => unknown[]>
    >
    /** Simulate MapLibre's 'load' event. */
    fireLoad: () => void
    /** Simulate a click on the map at the given position. */
    fireClick: (
        lngLat: { lng: number; lat: number },
        point?: { x: number; y: number }
    ) => void
    /** Simulate a click that hit a layer (`on(event, layerId, handler)` listeners). */
    fireLayerClick: (layerId: string, features: unknown[]) => void
    /** Simulate the user zooming to `zoom` (fires 'zoomend'). */
    fireZoomEnd: (zoom: number) => void
    /** Simulate the hotspot source having (re)loaded, then a map move. */
    fireSourceLoaded: (sourceId: string) => void
    fireMove: () => void
    getCanvas: () => HTMLCanvasElement
}

export interface MarkerInstance {
    setLngLat: ReturnType<
        typeof vi.fn<(lngLat: [number, number]) => MarkerInstance>
    >
    addTo: ReturnType<typeof vi.fn<(map: MapInstance) => MarkerInstance>>
    remove: ReturnType<typeof vi.fn<() => MarkerInstance>>
    getElement: () => HTMLElement
}

const toLngLat = (value: LngLatLike): { lng: number; lat: number } => {
    if (Array.isArray(value)) return { lng: value[0], lat: value[1] }
    if ('lon' in value) return { lng: value.lon, lat: value.lat }
    return { lng: value.lng, lat: value.lat }
}

const toPoint = (value: PointLike): { x: number; y: number } =>
    Array.isArray(value) ? { x: value[0], y: value[1] } : value

const handlerMock = (): HandlerInstance => {
    let enabled = true
    return {
        enable: vi.fn(() => {
            enabled = true
        }),
        disable: vi.fn(() => {
            enabled = false
        }),
        isEnabled: () => enabled,
    }
}

export const MapMock = vi.fn(function (this: MapInstance, options: MapOptions) {
    this.container = options.container as HTMLElement
    // Like the real thing: a focusable canvas landmark labelled from options.locale.
    const canvas = document.createElement('canvas')
    canvas.className = 'maplibregl-canvas'
    canvas.tabIndex = 0
    canvas.width = MOCK_CANVAS.width
    canvas.height = MOCK_CANVAS.height
    canvas.setAttribute('role', 'region')
    canvas.setAttribute('aria-label', options.locale?.['Map.Title'] ?? 'Map')
    this.container.appendChild(canvas)
    this.getCanvas = () => canvas
    this.getContainer = () => this.container
    let zoom = options.zoom ?? 0
    const initialCenter = options.center as [number, number] | undefined
    let center = {
        lng: initialCenter?.[0] ?? 0,
        lat: initialCenter?.[1] ?? 0,
    }
    this.getCenter = () => center
    this.project = (lngLat) => {
        const { lng, lat } = toLngLat(lngLat)
        return {
            x: MOCK_CANVAS.width / 2 + (lng - center.lng) * MOCK_PX_PER_DEGREE,
            y: MOCK_CANVAS.height / 2 - (lat - center.lat) * MOCK_PX_PER_DEGREE,
        }
    }
    this.unproject = (point) => {
        const { x, y } = toPoint(point)
        return {
            lng: center.lng + (x - MOCK_CANVAS.width / 2) / MOCK_PX_PER_DEGREE,
            lat: center.lat - (y - MOCK_CANVAS.height / 2) / MOCK_PX_PER_DEGREE,
        }
    }
    this.panBy = vi.fn(([dx, dy]: [number, number]) => {
        center = {
            lng: center.lng + dx / MOCK_PX_PER_DEGREE,
            lat: center.lat - dy / MOCK_PX_PER_DEGREE,
        }
    })
    this.keyboard = handlerMock()
    this.dragPan = handlerMock()
    this.dragRotate = handlerMock()
    this.doubleClickZoom = handlerMock()
    this.removeLayer = vi.fn()
    this.removeSource = vi.fn()
    this.moveLayer = vi.fn()
    this.fitBounds = vi.fn()
    this.isSourceLoaded = vi.fn(() => true)
    this.triggerRepaint = vi.fn()
    this.version = '6.14.0'
    this.flyTo = vi.fn((flyOptions: FlyToOptions) => {
        if (flyOptions.zoom !== undefined) zoom = flyOptions.zoom
        if (flyOptions.center) {
            const [lng, lat] = flyOptions.center as [number, number]
            center = { lng, lat }
        }
    })
    this.easeTo = vi.fn()
    this.remove = vi.fn()
    this.getZoom = () => zoom
    const sources: Record<string, SourceInstance> = {}
    const layers: Record<string, { id: string }> = {}
    this.addSource = vi.fn((id: string, options: unknown) => {
        sources[id] = {
            options,
            setData: vi.fn(),
            getClusterExpansionZoom: vi.fn(async () => 11),
        }
    })
    this.addLayer = vi.fn((layer: { id: string }) => {
        layers[layer.id] = layer
    })
    this.getSource = (id) => sources[id]
    this.getLayer = (id) => layers[id]
    this.queryRenderedFeatures = vi.fn(() => [])
    this.querySourceFeatures = vi.fn(() => [])
    const onceHandlers: Record<string, Handler[]> = {}
    const onHandlers: Record<string, Handler[]> = {}
    const layerHandlers: Record<string, Handler[]> = {}
    this.once = vi.fn((event: string, handler: Handler) => {
        ;(onceHandlers[event] ??= []).push(handler)
    })
    this.on = vi.fn(
        (
            event: string,
            layerOrHandler: string | Handler,
            handler?: Handler
        ) => {
            if (typeof layerOrHandler === 'string') {
                ;(layerHandlers[`${event}:${layerOrHandler}`] ??= []).push(
                    handler as Handler
                )
            } else {
                ;(onHandlers[event] ??= []).push(layerOrHandler)
            }
        }
    )
    const fire = (event: string, payload?: unknown) => {
        const pending = onceHandlers[event] ?? []
        onceHandlers[event] = []
        pending.forEach((handler) => handler(payload))
        ;(onHandlers[event] ?? []).forEach((handler) => handler(payload))
    }
    this.fireLoad = () => fire('load')
    this.fireClick = (lngLat, point = { x: 0, y: 0 }) =>
        fire('click', { lngLat, point })
    this.fireLayerClick = (layerId, features) =>
        (layerHandlers[`click:${layerId}`] ?? []).forEach((handler) =>
            handler({ features })
        )
    this.fireZoomEnd = (level) => {
        zoom = level
        fire('zoomend')
    }
    this.fireSourceLoaded = (sourceId) =>
        fire('data', { sourceId, isSourceLoaded: true })
    this.fireMove = () => fire('move')
    this.fireIdle = () => fire('idle')
    this.fireRender = () => fire('render')
    this.off = vi.fn((event: string, handler: Handler) => {
        onHandlers[event] = (onHandlers[event] ?? []).filter(
            (existing) => existing !== handler
        )
    })
})

export const MarkerMock = vi.fn(function (
    this: MarkerInstance,
    options?: { element?: HTMLElement }
) {
    // Like the real thing: a given element is used as the marker itself.
    const element = options?.element ?? document.createElement('div')
    this.setLngLat = vi.fn(() => this)
    // Like the real thing, attach the pin element to the map's container.
    this.addTo = vi.fn((map: MapInstance) => {
        map.container.appendChild(element)
        return this
    })
    this.remove = vi.fn(() => {
        element.remove()
        return this
    })
    this.getElement = () => element
})

export const setWorkerUrlMock = vi.fn()

/** Use as: vi.mock('maplibre-gl', async () => (await import('../test/maplibreMock')).maplibreMockFactory()) */
export const maplibreMockFactory = () => ({
    Map: MapMock,
    Marker: MarkerMock,
    setWorkerUrl: setWorkerUrlMock,
})

export const mapInstances = () =>
    MapMock.mock.instances as unknown as MapInstance[]
export const markerInstances = () =>
    MarkerMock.mock.instances as unknown as MarkerInstance[]
