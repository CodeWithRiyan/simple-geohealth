import AxeBuilder from '@axe-core/playwright'
import { expect, type Page } from '@playwright/test'

/**
 * Run axe with WCAG 2.x A/AA and best-practice rules. Only serious and
 * critical findings fail; `label` names the checkpoint in the failure.
 */
export async function expectNoSeriousA11yIssues(page: Page, label = 'page') {
    const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
        .analyze()
    const serious = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical'
    )
    expect(
        serious.map(
            (v) =>
                `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`
        ),
        `serious/critical axe violations at: ${label}`
    ).toEqual([])
}
