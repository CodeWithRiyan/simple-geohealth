import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { I18nProvider } from './i18n/I18nProvider'
import { useI18n } from './i18n/context'
import { Credits } from './components/Credits'
import { MapView } from './components/MapView'
import { PageHeader } from './components/PageHeader'
import { CONTENT_ID, SkipLink } from './components/SkipLink'
import { PAGE_CREDITS } from './lib/credits'

export const Layout = () => {
    const { t } = useI18n()
    const roadmap = Object.values(t.app.roadmap)

    return (
        <Grid
            container
            sx={{
                // Phones: map on top with a fixed share of the screen, panel
                // below, page scrolls vertically. Wider: side by side, full height.
                minHeight: '100dvh',
                height: { sm: '100dvh' },
                alignContent: 'flex-start',
            }}
        >
            <CssBaseline />
            <SkipLink />
            <Grid
                item
                xs={12}
                sm={6}
                sx={{
                    height: { xs: '45dvh', sm: '100%' },
                    minHeight: { xs: 220 },
                }}
            >
                <MapView />
            </Grid>
            <Grid
                item
                xs={12}
                sm={6}
                component={Paper}
                square
                sx={{
                    minHeight: { xs: '55dvh' },
                    height: { sm: '100%' },
                    overflowY: { sm: 'auto' },
                }}
            >
                <Box
                    component="main"
                    id={CONTENT_ID}
                    tabIndex={-1}
                    sx={{
                        py: { xs: 2, sm: 4 },
                        px: { xs: 2, sm: 4 },
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        outline: 'none',
                    }}
                >
                    <PageHeader current="home" />
                    <Typography component="h1" variant="h5">
                        {t.app.title}
                    </Typography>
                    <Typography
                        sx={{ mt: 1, maxWidth: 480, textAlign: 'center' }}
                    >
                        {t.app.description}
                    </Typography>
                    <Alert
                        severity="info"
                        sx={{ mt: 2, width: '100%', maxWidth: 480 }}
                    >
                        {t.app.notice}
                    </Alert>
                    <Box sx={{ width: '100%', maxWidth: 480, mt: 3 }}>
                        <Typography component="h2" variant="subtitle1">
                            {t.app.roadmapHeading}
                        </Typography>
                        <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                            {roadmap.map((item) => (
                                <Typography key={item} component="li">
                                    {item}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                    <Credits sources={PAGE_CREDITS.home} />
                </Box>
            </Grid>
        </Grid>
    )
}

const App = () => (
    <I18nProvider>
        <Layout />
    </I18nProvider>
)

export default App
