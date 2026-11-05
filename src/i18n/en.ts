import { Strings } from './types'

export const en: Strings = {
    app: {
        title: 'Simple Geohealth',
        description:
            'Health facilities in Indonesia on a map, from open data. No account, no tracking.',
        notice: 'This site is not an emergency service, and its data can be incomplete or out of date.',
        roadmapHeading: 'Coming next',
        roadmap: {
            facilities:
                'Find hospitals, community health centres and clinics around a place',
            nearest: 'The nearest facility per type, with the distance',
            coverage: 'Facilities per 10,000 people, by regency',
            risk: 'Facilities near recent earthquakes, floods and haze',
        },
    },
    emergency: {
        label: 'Emergency numbers',
        lead: 'Emergency:',
        general: 'General',
        ambulance: 'Ambulance',
    },
    language: {
        label: 'Language',
    },
    nav: {
        label: 'Pages',
        home: 'Home',
    },
    skipToContent: 'Skip to content',
    map: {
        region: 'Map',
        unavailable:
            'The map cannot be shown in this browser (WebGL is not available).',
        provincesFailed: 'Province outlines could not be loaded.',
    },
    credits: {
        heading: 'Sources',
        licence: (name) => `Licence: ${name}`,
    },
}
