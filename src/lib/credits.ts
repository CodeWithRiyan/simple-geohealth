/**
 * Every data source behind the site, with the credit each asks for and a
 * link. Rendered as the footer of every page (`Credits`), so a reader can
 * always see where a number came from. Nothing here is the site's own: no
 * ads, no promotion — only the sources.
 */

export type CreditId = 'osm' | 'geoBoundaries'

export interface Credit {
    id: CreditId
    /** The source's name, as it names itself. */
    name: string
    /** Its home page or the page it asks to be credited with. */
    url: string
    /** The credit line the source asks for, or a plain description of what it provides. */
    text: { id: string; en: string }
    /** The licence or terms, when the source states one. */
    licence?: string
}

export const CREDITS: Record<CreditId, Credit> = {
    osm: {
        id: 'osm',
        name: 'OpenStreetMap',
        url: 'https://www.openstreetmap.org/copyright',
        text: {
            id: 'Peta © kontributor OpenStreetMap.',
            en: 'Map © OpenStreetMap contributors.',
        },
        licence: 'ODbL',
    },
    geoBoundaries: {
        id: 'geoBoundaries',
        name: 'geoBoundaries',
        url: 'https://www.geoboundaries.org/api/current/gbOpen/IDN/ADM1/',
        text: {
            id: 'Batas provinsi dari geoBoundaries (gbOpen IDN ADM1, dari OpenStreetMap).',
            en: 'Province outlines from geoBoundaries (gbOpen IDN ADM1, from OpenStreetMap).',
        },
        licence: 'ODbL',
    },
}

/** Which sources each page draws on, in the order they are shown. */
export const PAGE_CREDITS = {
    home: ['osm', 'geoBoundaries'],
} as const satisfies Record<string, readonly CreditId[]>
