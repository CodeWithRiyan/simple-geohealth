#!/usr/bin/env tsx
/**
 * Build the province outlines the map draws:
 *
 *   pnpm boundaries:build
 *
 * Downloads geoBoundaries' simplified ADM1 file for Indonesia from a pinned
 * release commit (so the result never changes under us), simplifies and
 * rounds it (see simplify.ts), and writes public/data/provinces.geojson,
 * which is committed. The download is cached in .cache/.
 *
 * Source: geoBoundaries gbOpen IDN ADM1, built from OpenStreetMap
 * (https://www.geoboundaries.org/api/current/gbOpen/IDN/ADM1/).
 * Licence: ODbL 1.0 — credit "© OpenStreetMap contributors" and geoBoundaries.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildProvinces } from './simplify'

/** geoBoundaries release commit 9469f09 (build of Dec 12, 2023). */
export const SOURCE_URL =
    'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/IDN/ADM1/geoBoundaries-IDN-ADM1_simplified.geojson'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..', '..')
const cacheFile = join(
    root,
    '.cache',
    'geoBoundaries-IDN-ADM1_simplified.geojson'
)
const outFile = join(root, 'public', 'data', 'provinces.geojson')

async function source(): Promise<string> {
    try {
        return await readFile(cacheFile, 'utf8')
    } catch {
        const response = await fetch(SOURCE_URL)
        if (!response.ok) {
            throw new Error(`geoBoundaries answered HTTP ${response.status}`)
        }
        const text = await response.text()
        await mkdir(dirname(cacheFile), { recursive: true })
        await writeFile(cacheFile, text)
        return text
    }
}

async function main() {
    const provinces = buildProvinces(JSON.parse(await source()))
    const json = JSON.stringify(provinces) + '\n'
    await mkdir(dirname(outFile), { recursive: true })
    await writeFile(outFile, json)
    console.log(
        `Wrote ${provinces.features.length} provinces, ${(json.length / 1024).toFixed(0)} kB, to ${outFile}`
    )
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
