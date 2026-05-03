import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Translation files
import enTranslations from './locales/en.json'
import arTranslations from './locales/ar.json'

const resources = {
  en: {
    translation: enTranslations
  },
  ar: {
    translation: arTranslations
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true, // Enable debug to see what's happening

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },

    interpolation: {
      escapeValue: false
    },

    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i']
    },

    // Force initial language
    lng: localStorage.getItem('i18nextLng') || 'en',

    // Ensure resources are loaded
    load: 'languageOnly',
    preload: ['en', 'ar']
  })

// Update document attributes on language change
i18n.on('languageChanged', (lng) => {
  console.log('Language changed to:', lng)
  document.documentElement.lang = lng
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.body.className = lng === 'ar' ? 'rtl-mode' : 'ltr-mode'
})

// Debug: Log available resources
console.log('i18n resources:', i18n.options.resources)
console.log('Current language:', i18n.language)
console.log('Arabic resources:', i18n.options.resources?.ar?.translation)
console.log('English resources:', i18n.options.resources?.en?.translation)

// Test translation directly
setTimeout(() => {
  console.log('Direct translation test:')
  console.log('EN app.title:', i18n.t('app.title', { lng: 'en' }))
  console.log('AR app.title:', i18n.t('app.title', { lng: 'ar' }))
  console.log('Current app.title:', i18n.t('app.title'))
}, 1000)

export default i18n
