import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useI18n } from '../i18n/context'

/** Indonesia's emergency numbers: 112 for any emergency, 119 for health (ambulance). */
const EMERGENCY_NUMBERS = [
    { number: '112', key: 'general' },
    { number: '119', key: 'ambulance' },
] as const

/**
 * The emergency numbers, at the top of every page and tappable on a phone.
 * The site itself is not an emergency service; these numbers are.
 */
export const EmergencyNumbers = () => {
    const { t } = useI18n()

    return (
        <Box
            role="region"
            aria-label={t.emergency.label}
            data-testid="emergency-numbers"
            sx={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 2,
                mb: 2,
                px: 2,
                py: 1,
                borderRadius: 1,
                bgcolor: 'error.main',
                color: 'error.contrastText',
            }}
        >
            <Typography component="span" sx={{ fontWeight: 'bold' }}>
                {t.emergency.lead}
            </Typography>
            {EMERGENCY_NUMBERS.map(({ number, key }) => (
                <Link
                    key={number}
                    href={`tel:${number}`}
                    color="inherit"
                    underline="always"
                    sx={{ fontWeight: 'bold' }}
                >
                    {number} ({t.emergency[key]})
                </Link>
            ))}
        </Box>
    )
}

export default EmergencyNumbers
