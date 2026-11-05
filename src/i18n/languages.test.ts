import { afterEach, describe, expect, it, vi } from 'vitest'
import { en } from './en'
import { id } from './id'
import {
    DEFAULT_LANGUAGE,
    LANGUAGES,
    STORAGE_KEY,
    SUPPORTED_LANGUAGES,
    browserLanguages,
    detectLanguage,
    storage,
} from './languages'

/** Flatten a dictionary to "path -> kind" so two languages can be compared. */
function shape(obj: object, prefix = ''): Record<string, string> {
    return Object.entries(obj).reduce<Record<string, string>>(
        (acc, [key, value]) => {
            const path = prefix ? `${prefix}.${key}` : key
            if (value && typeof value === 'object')
                return { ...acc, ...shape(value, path) }
            acc[path] =
                typeof value === 'function'
                    ? `function/${(value as () => unknown).length}`
                    : typeof value
            return acc
        },
        {}
    )
}

/** Every leaf string (functions called with a sample argument). */
function leaves(obj: object): string[] {
    return Object.values(obj).flatMap((value) => {
        if (typeof value === 'function') return [String(value('Sample'))]
        if (value && typeof value === 'object') return leaves(value)
        return [String(value)]
    })
}

describe('dictionaries', () => {
    it('supports exactly Indonesian and English', () => {
        expect(SUPPORTED_LANGUAGES).toEqual(['id', 'en'])
        expect(LANGUAGES.id.nativeName).toBe('Bahasa Indonesia')
        expect(LANGUAGES.en.nativeName).toBe('English')
    })

    it('Indonesian and English define the same keys with the same arities', () => {
        expect(shape(en)).toEqual(shape(id))
    })

    it('has no empty strings in either language', () => {
        for (const text of [...leaves(id), ...leaves(en)]) {
            expect(text.trim()).not.toBe('')
        }
    })

    it('actually translates (apart from the site name)', () => {
        const idTexts = leaves(id)
        const enTexts = leaves(en)
        const identical = idTexts.filter((text, i) => text === enTexts[i])
        expect(identical).toEqual([id.app.title])
    })

    it('pairs each language with the matching MUI locale', () => {
        const autocomplete = LANGUAGES.id.muiLocale.components?.MuiAutocomplete
            ?.defaultProps as { clearText: string }
        expect(autocomplete.clearText).toBe('Hapus')
        // MUI's built-in defaults are English, so its enUS locale is empty.
        expect(LANGUAGES.en.muiLocale).toEqual({})
    })
})

describe('detectLanguage', () => {
    it('prefers an explicit earlier choice over the browser', () => {
        expect(detectLanguage('en', ['id-ID'])).toBe('en')
        expect(detectLanguage('id', ['en-US'])).toBe('id')
    })

    it('ignores a stored value that is not a supported language', () => {
        expect(detectLanguage('fr', ['en-GB'])).toBe('en')
    })

    it('uses the first supported browser language, by primary subtag', () => {
        expect(detectLanguage(null, ['fr-FR', 'en-GB', 'id'])).toBe('en')
        expect(detectLanguage(null, ['ID-id'])).toBe('id')
    })

    it('falls back to Indonesian', () => {
        expect(DEFAULT_LANGUAGE).toBe('id')
        expect(detectLanguage(null, ['fr-FR', 'de'])).toBe('id')
        expect(detectLanguage(null, [])).toBe('id')
    })
})

describe('browserLanguages', () => {
    afterEach(() => vi.restoreAllMocks())

    it('reads navigator.languages, or navigator.language when that is empty', () => {
        vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-GB'])
        expect(browserLanguages()).toEqual(['en-GB'])

        vi.spyOn(navigator, 'languages', 'get').mockReturnValue([])
        vi.spyOn(navigator, 'language', 'get').mockReturnValue('id-ID')
        expect(browserLanguages()).toEqual(['id-ID'])
    })
})

describe('storage', () => {
    afterEach(() => {
        vi.restoreAllMocks()
        localStorage.clear()
    })

    it('round-trips the choice under a namespaced key', () => {
        storage.write('en')
        expect(STORAGE_KEY).toBe('simple-geohealth.language')
        expect(localStorage.getItem(STORAGE_KEY)).toBe('en')
        expect(storage.read()).toBe('en')
    })

    it('never throws when localStorage is unavailable', () => {
        vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('SecurityError')
        })
        vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('QuotaExceededError')
        })
        expect(storage.read()).toBeNull()
        expect(() => storage.write('en')).not.toThrow()
    })
})
