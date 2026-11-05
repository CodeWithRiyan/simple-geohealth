import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { I18nContext, I18nContextValue } from './context'
import {
    LANGUAGES,
    browserLanguages,
    detectLanguage,
    storage,
} from './languages'
import { Language } from './types'

export interface I18nProviderProps {
    children: React.ReactNode
    /** Force a language (tests); otherwise detected and persisted. */
    initialLanguage?: Language
}

/**
 * Owns the current UI language: detects it on first render, persists changes,
 * keeps <html lang> in sync and feeds MUI its matching locale so built-in
 * component texts (e.g. the Autocomplete clear button) follow too.
 */
export const I18nProvider = ({
    children,
    initialLanguage,
}: I18nProviderProps) => {
    const [language, setLanguageState] = useState<Language>(
        () =>
            initialLanguage ??
            detectLanguage(storage.read(), browserLanguages())
    )

    const setLanguage = useCallback((next: Language) => {
        setLanguageState(next)
        storage.write(next)
    }, [])

    useEffect(() => {
        document.documentElement.lang = language
    }, [language])

    const value = useMemo<I18nContextValue>(
        () => ({ language, t: LANGUAGES[language].strings, setLanguage }),
        [language, setLanguage]
    )
    const theme = useMemo(
        () => createTheme({}, LANGUAGES[language].muiLocale),
        [language]
    )

    return (
        <I18nContext.Provider value={value}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </I18nContext.Provider>
    )
}

export default I18nProvider
