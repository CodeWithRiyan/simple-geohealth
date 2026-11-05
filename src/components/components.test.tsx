import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { Credits } from './Credits'
import { LanguageSelect } from './LanguageSelect'
import { Nav } from './Nav'
import { CONTENT_ID, SkipLink } from './SkipLink'
import { I18nProvider } from '../i18n/I18nProvider'
import { STORAGE_KEY } from '../i18n/languages'
import { CREDITS, PAGE_CREDITS } from '../lib/credits'
import { pageHref } from '../pages'

describe('Nav', () => {
    it('is a labelled navigation landmark linking to every page', () => {
        render(
            <I18nProvider initialLanguage="en">
                <Nav current="home" />
            </I18nProvider>
        )
        const nav = screen.getByRole('navigation', { name: 'Pages' })
        const link = within(nav).getByRole('link', { name: 'Home' })
        expect(link).toHaveAttribute('href', pageHref('home'))
        expect(link).toHaveAttribute('aria-current', 'page')
    })

    it('is translated', () => {
        render(
            <I18nProvider initialLanguage="id">
                <Nav current="home" />
            </I18nProvider>
        )
        const nav = screen.getByRole('navigation', { name: 'Halaman' })
        expect(within(nav).getByRole('link', { name: 'Beranda' })).toBeVisible()
    })
})

describe('LanguageSelect', () => {
    beforeEach(() => localStorage.clear())

    it('offers Indonesian and English, each named in its own language', () => {
        render(
            <I18nProvider initialLanguage="id">
                <LanguageSelect />
            </I18nProvider>
        )
        const select = screen.getByRole('combobox', { name: 'Bahasa' })
        const options = within(select).getAllByRole('option')
        expect(
            options.map((o) => [o.getAttribute('value'), o.textContent])
        ).toEqual([
            ['id', 'Bahasa Indonesia'],
            ['en', 'English'],
        ])
        expect(select).toHaveValue('id')
    })

    it('switches language, relabels itself and remembers the choice', async () => {
        const user = userEvent.setup()
        render(
            <I18nProvider initialLanguage="id">
                <LanguageSelect />
            </I18nProvider>
        )

        await user.selectOptions(
            screen.getByRole('combobox', { name: 'Bahasa' }),
            'en'
        )

        expect(screen.getByRole('combobox', { name: 'Language' })).toHaveValue(
            'en'
        )
        expect(localStorage.getItem(STORAGE_KEY)).toBe('en')
    })
})

describe('Credits', () => {
    it('lists each source with its credit line, link and licence', () => {
        render(
            <I18nProvider initialLanguage="en">
                <Credits sources={PAGE_CREDITS.home} />
            </I18nProvider>
        )
        const footer = screen.getByTestId('credits')
        expect(
            within(footer).getByRole('heading', { name: 'Sources' })
        ).toBeVisible()
        expect(within(footer).getAllByRole('listitem')).toHaveLength(2)
        expect(screen.getByTestId('credit-osm')).toHaveTextContent(
            'Map © OpenStreetMap contributors. OpenStreetMap — Licence: ODbL'
        )
        expect(
            within(screen.getByTestId('credit-geoBoundaries')).getByRole('link')
        ).toHaveAttribute('href', CREDITS.geoBoundaries.url)
    })

    it('links only with noreferrer and follows the language', () => {
        render(
            <I18nProvider initialLanguage="id">
                <Credits sources={PAGE_CREDITS.home} />
            </I18nProvider>
        )
        expect(screen.getByRole('heading', { name: 'Sumber' })).toBeVisible()
        expect(screen.getByTestId('credit-osm')).toHaveTextContent(
            'Peta © kontributor OpenStreetMap. OpenStreetMap — Lisensi: ODbL'
        )
        for (const link of screen.getAllByRole('link')) {
            expect(link).toHaveAttribute('rel', 'noreferrer')
        }
    })

    it('shows a source without a licence without the licence part', () => {
        CREDITS.osm.licence = undefined
        try {
            render(
                <I18nProvider initialLanguage="en">
                    <Credits sources={['osm']} />
                </I18nProvider>
            )
            expect(screen.getByTestId('credit-osm')).not.toHaveTextContent(
                'Licence'
            )
        } finally {
            CREDITS.osm.licence = 'ODbL'
        }
    })
})

describe('SkipLink', () => {
    it('moves focus to the content', async () => {
        const user = userEvent.setup()
        render(
            <I18nProvider initialLanguage="en">
                <SkipLink />
                <main id={CONTENT_ID} tabIndex={-1}>
                    content
                </main>
            </I18nProvider>
        )
        const link = screen.getByRole('link', { name: 'Skip to content' })
        expect(link).toHaveAttribute('href', `#${CONTENT_ID}`)

        await user.click(link)

        expect(screen.getByRole('main')).toHaveFocus()
    })
})

describe('Nav with more pages', () => {
    it('marks only the current page', () => {
        render(
            <I18nProvider initialLanguage="en">
                {/* A page id that is not current, as later releases add pages. */}
                <Nav current={'other' as never} />
            </I18nProvider>
        )
        const link = screen.getByRole('link', { name: 'Home' })
        expect(link).not.toHaveAttribute('aria-current')
    })
})
