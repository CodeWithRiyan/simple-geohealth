import { expect, test } from '@playwright/test'
import { expectNoSeriousA11yIssues } from './axe'

test.describe('home page', () => {
    test('shows the map with province outlines and the sources', async ({
        page,
    }) => {
        await page.goto('./')

        await expect(
            page.getByRole('heading', { level: 1, name: 'Simple Geohealth' })
        ).toBeVisible()
        await expect(page.getByTestId('map-view')).toHaveAttribute(
            'data-provinces',
            'loaded',
            { timeout: 30_000 }
        )
        await expect(page.getByTestId('credit-geoBoundaries')).toBeVisible()
    })

    test('switches language and keeps it after a reload', async ({ page }) => {
        await page.goto('./')
        await page.getByRole('combobox', { name: 'Bahasa' }).selectOption('en')
        await expect(
            page.getByRole('heading', { name: 'Coming next' })
        ).toBeVisible()
        await expect(page.locator('html')).toHaveAttribute('lang', 'en')

        await page.reload()

        await expect(
            page.getByRole('combobox', { name: 'Language' })
        ).toHaveValue('en')
    })

    test('the first Tab reaches "skip to content", which moves focus', async ({
        page,
    }) => {
        await page.goto('./')
        await page.keyboard.press('Tab')
        const skip = page.getByRole('link', { name: 'Lompat ke konten' })
        await expect(skip).toBeFocused()

        await page.keyboard.press('Enter')

        await expect(page.getByRole('main')).toBeFocused()
    })

    test('has no serious accessibility issues, on desktop and at 360 px', async ({
        page,
    }) => {
        await page.goto('./')
        await expect(page.getByTestId('map-view')).toHaveAttribute(
            'data-provinces',
            'loaded',
            { timeout: 30_000 }
        )
        await expectNoSeriousA11yIssues(page, 'desktop')

        await page.setViewportSize({ width: 360, height: 740 })
        const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth > window.innerWidth
        )
        expect(overflow, 'no horizontal scroll at 360 px').toBe(false)
        await expectNoSeriousA11yIssues(page, '360 px')
    })

    test('shows the emergency numbers as phone links, also at 360 px', async ({
        page,
    }) => {
        await page.setViewportSize({ width: 360, height: 740 })
        await page.goto('./')
        const region = page.getByRole('region', { name: 'Nomor darurat' })
        await expect(
            region.getByRole('link', { name: '112 (Umum)' })
        ).toHaveAttribute('href', 'tel:112')
        await expect(
            region.getByRole('link', { name: '119 (Ambulans)' })
        ).toHaveAttribute('href', 'tel:119')
        await expect(region).toBeInViewport()
    })
})
