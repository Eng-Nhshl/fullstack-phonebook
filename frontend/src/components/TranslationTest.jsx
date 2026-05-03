import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'

const TranslationTest = () => {
  const { t, i18n } = useTranslation()
  const { currentLanguage } = useLanguage()

  return (
    <div style={{
      position: 'fixed',
      top: '200px',
      left: '10px',
      background: 'lightblue',
      padding: '15px',
      border: '2px solid blue',
      fontSize: '14px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h3>Translation Test</h3>
      <div><strong>Current Language:</strong> {currentLanguage}</div>
      <div><strong>i18n Language:</strong> {i18n.language}</div>

      <hr />

      <div><strong>Translations:</strong></div>
      <div>App Title: <span style={{ color: 'red' }}>{t('app.title')}</span></div>
      <div>Login: <span style={{ color: 'red' }}>{t('auth.login')}</span></div>
      <div>Logout: <span style={{ color: 'red' }}>{t('auth.logout')}</span></div>
      <div>Email: <span style={{ color: 'red' }}>{t('auth.email')}</span></div>

      <hr />

      <div><strong>Expected Arabic:</strong></div>
      <div>App Title: <span style={{ color: 'green' }}>تطبيق دفتر الهاتف</span></div>
      <div>Login: <span style={{ color: 'green' }}>تسجيل الدخول</span></div>
      <div>Logout: <span style={{ color: 'green' }}>تسجيل الخروج</span></div>
      <div>Email: <span style={{ color: 'green' }}>البريد الإلكتروني</span></div>

      <button
        onClick={() => {
          console.log('Switching to Arabic...')
          i18n.changeLanguage('ar')
          setTimeout(() => {
            console.log('After switch - Current language:', i18n.language)
            console.log('After switch - t(app.title):', t('app.title'))
            console.log('After switch - Direct AR:', i18n.t('app.title', { lng: 'ar' }))
          }, 100)
        }}
        style={{ margin: '5px', padding: '5px' }}
      >
        Arabic
      </button>
      <button
        onClick={() => {
          console.log('Switching to English...')
          i18n.changeLanguage('en')
        }}
        style={{ margin: '5px', padding: '5px' }}
      >
        English
      </button>

      <div style={{ marginTop: '10px', fontSize: '12px' }}>
        <div><strong>Direct i18n test:</strong></div>
        <div>Direct AR: {i18n.t('app.title', { lng: 'ar' })}</div>
        <div>Direct EN: {i18n.t('app.title', { lng: 'en' })}</div>
      </div>
    </div>
  )
}

export default TranslationTest
