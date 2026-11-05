import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useI18n } from '../i18n/context'
import { CREDITS, CreditId } from '../lib/credits'

export interface CreditsProps {
    /** Which sources this page draws on, in the order to show them. */
    sources: readonly CreditId[]
}

/**
 * The sources footer: every data provider behind the page, with the
 * credit line it asks for and a link to it. Nothing else belongs here.
 */
export const Credits = ({ sources }: CreditsProps) => {
    const { t, language } = useI18n()

    return (
        <Box
            component="footer"
            data-testid="credits"
            sx={{ width: '100%', maxWidth: 480, mt: 4 }}
        >
            <Typography component="h2" variant="subtitle2" sx={{ mb: 0.5 }}>
                {t.credits.heading}
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {sources.map((id) => {
                    const credit = CREDITS[id]
                    return (
                        <Typography
                            key={id}
                            component="li"
                            variant="caption"
                            color="text.secondary"
                            data-testid={`credit-${id}`}
                        >
                            {credit.text[language]}{' '}
                            <Link href={credit.url} rel="noreferrer">
                                {credit.name}
                            </Link>
                            {credit.licence
                                ? ` — ${t.credits.licence(credit.licence)}`
                                : null}
                        </Typography>
                    )
                })}
            </Box>
        </Box>
    )
}

export default Credits
