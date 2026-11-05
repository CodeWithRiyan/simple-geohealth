import simplify from '@turf/simplify'
import type {
    Feature,
    FeatureCollection,
    MultiPolygon,
    Polygon,
    Position,
} from 'geojson'

/** What each province keeps: its name and ISO 3166-2 code, nothing else. */
export interface ProvinceProperties {
    name: string
    iso: string
}

export type ProvinceCollection = FeatureCollection<
    Polygon | MultiPolygon,
    ProvinceProperties
>

interface SourceProperties {
    shapeName: string
    shapeISO: string
}

/** Decimal places kept: 4 is about 11 m, far below what a province outline needs. */
export const PRECISION = 4
/** Douglas–Peucker tolerance in degrees (about 1 km). */
export const TOLERANCE = 0.01

const round = (value: number) => Number(value.toFixed(PRECISION))

/** Round a ring and drop points that rounding made identical to the previous one. */
export function roundRing(ring: Position[]): Position[] {
    const out: Position[] = []
    for (const [lng, lat] of ring) {
        const point = [round(lng), round(lat)]
        const last = out[out.length - 1]
        if (!last || last[0] !== point[0] || last[1] !== point[1]) {
            out.push(point)
        }
    }
    return out
}

/** A ring needs four positions (first = last) to be a valid polygon ring. */
const isRing = (ring: Position[]) => ring.length >= 4

function roundPolygon(rings: Position[][]): Position[][] | null {
    const rounded = rings.map(roundRing)
    // A polygon whose outer ring collapsed is dropped; collapsed holes too.
    if (!isRing(rounded[0])) return null
    return [rounded[0], ...rounded.slice(1).filter(isRing)]
}

/**
 * Turn geoBoundaries' ADM1 file into the small file the map draws:
 * simplified, rounded, with only a name and an ISO code per province,
 * sorted by ISO code so the output is byte-for-byte reproducible.
 */
export function buildProvinces(
    source: FeatureCollection<Polygon | MultiPolygon, SourceProperties>,
    tolerance = TOLERANCE
): ProvinceCollection {
    const simplified = simplify(source, {
        tolerance,
        highQuality: true,
        mutate: false,
    }) as FeatureCollection<Polygon | MultiPolygon, SourceProperties>

    const features: Feature<Polygon | MultiPolygon, ProvinceProperties>[] = []
    for (const feature of simplified.features) {
        const { geometry } = feature
        let rounded: Polygon | MultiPolygon | null = null
        if (geometry.type === 'Polygon') {
            const rings = roundPolygon(geometry.coordinates)
            if (rings) rounded = { type: 'Polygon', coordinates: rings }
        } else {
            const polygons = geometry.coordinates
                .map(roundPolygon)
                .filter((p): p is Position[][] => p !== null)
            if (polygons.length > 0)
                rounded = { type: 'MultiPolygon', coordinates: polygons }
        }
        if (!rounded) continue
        features.push({
            type: 'Feature',
            properties: {
                name: feature.properties.shapeName,
                iso: feature.properties.shapeISO,
            },
            geometry: rounded,
        })
    }
    features.sort((a, b) => a.properties.iso.localeCompare(b.properties.iso))
    return { type: 'FeatureCollection', features }
}
