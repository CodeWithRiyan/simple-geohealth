import TextField from '@mui/material/TextField'
import { useI18n } from '../i18n/context'
import { LANGUAGES, SUPPORTED_LANGUAGES, isLanguage } from '../i18n/languages'

/**
 * Language picker. A native <select> (via MUI) for the best keyboard, screen
 * reader and mobile behaviour; each option is named in its own language.
 */
export const LanguageSelect = () => {
    const { language, setLanguage, t } = useI18n()

    return (
        <TextField
            select
            size="small"
            id="language-select"
            label={t.language.label}
            value={language}
            onChange={(event) => {
                if (isLanguage(event.target.value))
                    setLanguage(event.target.value)
            }}
            SelectProps={{ native: true }}
            sx={{ minWidth: 180 }}
        >
            {SUPPORTED_LANGUAGES.map((code) => (
                <option key={code} value={code} lang={code}>
                    {LANGUAGES[code].nativeName}
                </option>
            ))}
        </TextField>
    )
}

export default LanguageSelect
