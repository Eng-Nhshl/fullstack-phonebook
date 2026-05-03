import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageContext } from './languageContext'

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en')

  useEffect(() => {
    const handleLanguageChange = (lng) => {
      console.log('LanguageContext: Language changed to', lng)
      setCurrentLanguage(lng)

      // Update document attributes
      document.documentElement.lang = lng
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
      document.body.className = lng === 'ar' ? 'rtl-mode' : 'ltr-mode'
    }

    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChange)

    // Set initial language
    handleLanguageChange(i18n.language || 'en')

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  return (
    <LanguageContext.Provider value={{ currentLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

