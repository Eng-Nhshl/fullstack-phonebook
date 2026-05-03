import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [, forceUpdate] = useState({})

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      console.log('LanguageSwitcher: Language changed to', lng)

      // Update document attributes
      document.documentElement.lang = lng
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
      document.body.className = lng === 'ar' ? 'rtl-mode' : 'ltr-mode'

      // Force re-render of all components
      forceUpdate({})
    }

    i18n.on('languageChanged', handleLanguageChange)

    // Initial setup
    const currentLang = i18n.language || 'en'
    handleLanguageChange(currentLang)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  const toggleLanguage = () => {
    const currentLang = i18n.language || 'en'
    const newLang = currentLang === 'en' ? 'ar' : 'en'
    console.log('Switching from', currentLang, 'to', newLang)
    i18n.changeLanguage(newLang)
  }

  const currentLang = i18n.language || 'en'
  const switchText = currentLang === 'en' ? 'العربية' : 'English'

  return (
    <button
      className="language-switcher"
      onClick={toggleLanguage}
      type="button"
      title={`Switch to ${currentLang === 'en' ? 'Arabic' : 'English'}`}
    >
      <span className="language-icon">🌐</span>
      <span className="language-text">{switchText}</span>
    </button>
  )
}

export default LanguageSwitcher
