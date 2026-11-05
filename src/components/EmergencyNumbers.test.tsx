import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EmergencyNumbers } from './EmergencyNumbers'
import { PageHeader } from './PageHeader'
import { I18nProvider } from '../i18n/I18nProvider'

describe('EmergencyNumbers', () => {
    it('links 112 and 119 as phone numbers, labelled in Indonesian', () => {
        render(
            <I18nProvider initialLanguage="id">
                <EmergencyNumbers />
            </I18nProvider>
        )
        const region = screen.getByRole('region', { name: 'Nomor darurat' })
        const links = within(region).getAllByRole('link')
        expect(
            links.map((link) => [link.textContent, link.getAttribute('href')])
        ).toEqual([
            ['112 (Umum)', 'tel:112'],
            ['119 (Ambulans)', 'tel:119'],
        ])
    })

    it('is translated', () => {
        render(
            <I18nProvider initialLanguage="en">
                <EmergencyNumbers />
            </I18nProvider>
        )
        const region = screen.getByRole('region', { name: 'Emergency numbers' })
        expect(region).toHaveTextContent(
            'Emergency:112 (General)119 (Ambulance)'
        )
    })

    it('comes first in the page header, before the navigation', () => {
        render(
            <I18nProvider initialLanguage="id">
                <PageHeader current="home" />
            </I18nProvider>
        )
        const region = screen.getByRole('region', { name: 'Nomor darurat' })
        const nav = screen.getByRole('navigation')
        expect(
            region.compareDocumentPosition(nav) &
                Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy()
    })
})
