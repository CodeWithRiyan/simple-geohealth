import Link from '@mui/material/Link'
import { useI18n } from '../i18n/context'

export const CONTENT_ID = 'content'

/**
 * "Skip to content": the first thing Tab reaches. Visually hidden until it
 * has focus, so keyboard users can jump past the map (whose canvas and
 * attribution links come first in the document) straight to the content.
 */
export const SkipLink = () => {
    const { t } = useI18n()

    return (
        <Link
            href={`#${CONTENT_ID}`}
            onClick={(event) => {
                event.preventDefault()
                document.getElementById(CONTENT_ID)?.focus()
            }}
            sx={{
                position: 'absolute',
                left: 8,
                top: 8,
                zIndex: (theme) => theme.zIndex.tooltip,
                px: 2,
                py: 1,
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 3,
                // Off-screen until focused (never display:none, or it is unfocusable).
                transform: 'translateY(-200%)',
                '&:focus-visible': { transform: 'none' },
            }}
        >
            {t.skipToContent}
        </Link>
    )
}

export default SkipLink
