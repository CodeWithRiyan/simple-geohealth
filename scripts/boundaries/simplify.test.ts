import { describe, expect, it } from 'vitest'
import type { FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import { buildProvinces, roundRing } from './simplify'

type Source = FeatureCollection<
    Polygon | MultiPolygon,
    { shapeName: string; shapeISO: string }
>

const square = (x: number, y: number, size: number) => [
    [x, y],
    [x + size, y],
    [x + size, y + size],
    [x, y + size],
    [x, y],
]

const source = (features: Source['features']): Source => ({
    type: 'FeatureCollection',
    features,
})

describe('roundRing', () => {
    it('rounds to 4 decimals and drops repeated points', () => {
        expect(
            roundRing([
                [106.123456, -6.123456],
                [106.123461, -6.123451],
                [106.2, -6.1],
            ])
        ).toEqual([
            [106.1235, -6.1235],
            [106.2, -6.1],
        ])
    })
})

describe('buildProvinces', () => {
    it('keeps only the name and ISO code, sorted by ISO code', () => {
        const result = buildProvinces(
            source([
                {
                    type: 'Feature',
                    properties: { shapeName: 'Bali', shapeISO: 'ID-BA' },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [square(115, -8.5, 1)],
                    },
                },
                {
                    type: 'Feature',
                    properties: { shapeName: 'Aceh', shapeISO: 'ID-AC' },
                    geometry: {
                        type: 'MultiPolygon',
                        coordinates: [[square(95, 4, 1)], [square(97, 2, 1)]],
                    },
                },
            ])
        )

        expect(result.features.map((f) => f.properties)).toEqual([
            { name: 'Aceh', iso: 'ID-AC' },
            { name: 'Bali', iso: 'ID-BA' },
        ])
        expect(result.features[0].geometry.type).toBe('MultiPolygon')
        expect(result.features[1].geometry).toEqual({
            type: 'Polygon',
            coordinates: [square(115, -8.5, 1)],
        })
    })

    it('drops polygons and holes that collapse below the tolerance', () => {
        const result = buildProvinces(
            source([
                {
                    type: 'Feature',
                    properties: { shapeName: 'Tiny', shapeISO: 'ID-XX' },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [square(100, 0, 0.00001)],
                    },
                },
                {
                    type: 'Feature',
                    properties: { shapeName: 'Islands', shapeISO: 'ID-YY' },
                    geometry: {
                        type: 'MultiPolygon',
                        coordinates: [
                            [square(110, 0, 1), square(110.4, 0.4, 0.00001)],
                            [square(112, 0, 0.00001)],
                        ],
                    },
                },
                {
                    type: 'Feature',
                    properties: { shapeName: 'Dust', shapeISO: 'ID-ZZ' },
                    geometry: {
                        type: 'MultiPolygon',
                        coordinates: [[square(120, 0, 0.00001)]],
                    },
                },
            ])
        )

        expect(result.features).toHaveLength(1)
        expect(result.features[0].properties.iso).toBe('ID-YY')
        expect(result.features[0].geometry).toEqual({
            type: 'MultiPolygon',
            coordinates: [[square(110, 0, 1)]],
        })
    })
})
