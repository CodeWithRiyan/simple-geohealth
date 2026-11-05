import { createContext, useContext } from 'react'
import { LANGUAGES, DEFAULT_LANGUAGE } from './languages'
import { Language, Strings } from './types'

export interface I18nContextValue {
    language: Language
    t: Strings
    setLanguage: (language: Language) => void
}

/**
 * Defaults to Indonesian so components rendered without <I18nProvider>
 * (isolated unit tests) still have strings; the app always provides one.
 */
export const I18nContext = createContext<I18nContextValue>({
    language: DEFAULT_LANGUAGE,
    t: LANGUAGES[DEFAULT_LANGUAGE].strings,
    setLanguage: () => {},
})

export const useI18n = () => useContext(I18nContext)
