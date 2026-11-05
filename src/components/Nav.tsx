import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import { useI18n } from '../i18n/context'
import { PAGE_IDS, PageId, pageHref } from '../pages'

export interface NavProps {
    /** The page this navigation is rendered on (marked with aria-current). */
    current: PageId
}

/**
 * Links between the site's pages. Plain links, not a router: each page is a
 * separate HTML entry, so following one is a normal full navigation and the
 * URL can be reloaded or bookmarked.
 */
export const Nav = ({ current }: NavProps) => {
    const { t } = useI18n()

    return (
        <Box component="nav" aria-label={t.nav.label}>
            <Stack
                component="ul"
                direction="row"
                spacing={2}
                sx={{ listStyle: 'none', m: 0, p: 0 }}
            >
                {PAGE_IDS.map((page) => {
                    const isCurrent = page === current
                    return (
                        <li key={page}>
                            <Link
                                href={pageHref(page)}
                                aria-current={isCurrent ? 'page' : undefined}
                                underline={isCurrent ? 'always' : 'hover'}
                                sx={{
                                    fontWeight: isCurrent ? 'bold' : 'normal',
                                    color: isCurrent
                                        ? 'text.primary'
                                        : 'primary.main',
                                }}
                            >
                                {t.nav[page]}
                            </Link>
                        </li>
                    )
                })}
            </Stack>
        </Box>
    )
}

export default Nav
