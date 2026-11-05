import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useI18n } from './context'

const Probe = () => {
    const { language, t, setLanguage } = useI18n()
    // Without a provider, setting the language is a harmless no-op.
    setLanguage('en')
    return (
        <span data-testid="probe">
            {language} {t.language.label}
        </span>
    )
}

describe('useI18n without a provider', () => {
    it('falls back to Indonesian strings', () => {
        render(<Probe />)
        expect(screen.getByTestId('probe')).toHaveTextContent('id Bahasa')
    })
})
