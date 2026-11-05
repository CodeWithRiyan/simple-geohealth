import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { I18nProvider } from './I18nProvider'
import { useI18n } from './context'
import { STORAGE_KEY } from './languages'

const Probe = () => {
    const { language, t, setLanguage } = useI18n()
    return (
        <div>
            <span data-testid="language">{language}</span>
            <span data-testid="label">{t.language.label}</span>
            <button
                onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            >
                toggle
            </button>
        </div>
    )
}

const mockBrowserLanguages = (languages: string[]) => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(languages)
}

describe('I18nProvider', () => {
    beforeEach(() => {
        localStorage.clear()
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('starts in the browser language when nothing was saved', () => {
        mockBrowserLanguages(['en-US'])
        render(
            <I18nProvider>
                <Probe />
            </I18nProvider>
        )
        expect(screen.getByTestId('language')).toHaveTextContent('en')
        expect(screen.getByTestId('label')).toHaveTextContent('Language')
    })

    it('falls back to Indonesian for unsupported browser languages', () => {
        mockBrowserLanguages(['fr-FR'])
        render(
            <I18nProvider>
                <Probe />
            </I18nProvider>
        )
        expect(screen.getByTestId('language')).toHaveTextContent('id')
        expect(screen.getByTestId('label')).toHaveTextContent('Bahasa')
    })

    it('restores a saved choice over the browser language', () => {
        mockBrowserLanguages(['en-US'])
        localStorage.setItem(STORAGE_KEY, 'id')
        render(
            <I18nProvider>
                <Probe />
            </I18nProvider>
        )
        expect(screen.getByTestId('language')).toHaveTextContent('id')
    })

    it('switching updates strings, persists the choice and sets <html lang>', () => {
        render(
            <I18nProvider initialLanguage="id">
                <Probe />
            </I18nProvider>
        )
        expect(document.documentElement.lang).toBe('id')

        act(() => screen.getByRole('button', { name: 'toggle' }).click())

        expect(screen.getByTestId('label')).toHaveTextContent('Language')
        expect(localStorage.getItem(STORAGE_KEY)).toBe('en')
        expect(document.documentElement.lang).toBe('en')
    })
})
