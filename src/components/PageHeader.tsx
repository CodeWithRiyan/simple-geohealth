import Box from '@mui/material/Box'
import { EmergencyNumbers } from './EmergencyNumbers'
import { LanguageSelect } from './LanguageSelect'
import { Nav } from './Nav'
import { PageId } from '../pages'

export interface PageHeaderProps {
    current: PageId
}

/**
 * Top of every page: the emergency numbers first, then navigation on the
 * left and the language picker on the right.
 */
export const PageHeader = ({ current }: PageHeaderProps) => (
    <>
        <EmergencyNumbers />
        <Box
            sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2,
                mb: 2,
            }}
        >
            <Nav current={current} />
            <LanguageSelect />
        </Box>
    </>
)

export default PageHeader
