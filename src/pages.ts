/**
 * The pages of the site. Each is its own HTML entry in the Vite build (see
 * `PAGES` in vite.config.mts), so every page can be opened directly and
 * reloaded; this module only knows where they live so the navigation can
 * link between them. New pages arrive with their release (see the roadmap).
 */
export type PageId = 'home'

/** Path of each page relative to the app's base URL (always with a trailing slash). */
export const PAGE_PATHS: Record<PageId, string> = {
    home: '',
}

export const PAGE_IDS = Object.keys(PAGE_PATHS) as PageId[]

/** Absolute URL path of a page, including Vite's `base`. */
export const pageHref = (page: PageId): string =>
    `${import.meta.env.BASE_URL}${PAGE_PATHS[page]}`
