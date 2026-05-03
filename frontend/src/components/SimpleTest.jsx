import { useTranslation } from 'react-i18next'

const SimpleTest = () => {
  const { t, i18n } = useTranslation()

  const switchToArabic = () => {
    i18n.changeLanguage('ar')
  }

  const switchToEnglish = () => {
    i18n.changeLanguage('en')
  }

  return (
    <div style={{ padding: '20px', border: '2px solid red', margin: '20px' }}>
      <h2>Translation Test</h2>
      <p>Current Language: {i18n.language}</p>

      <div style={{ margin: '10px 0' }}>
        <button onClick={switchToEnglish} style={{ marginRight: '10px' }}>
          Switch to English
        </button>
        <button onClick={switchToArabic}>
          Switch to Arabic
        </button>
      </div>

      <div style={{ margin: '10px 0' }}>
        <div>App Title: "{t('app.title')}"</div>
        <div>Login: "{t('auth.login')}"</div>
        <div>Logout: "{t('auth.logout')}"</div>
        <div>Email: "{t('auth.email')}"</div>
        <div>Password: "{t('auth.password')}"</div>
        <div>Login Title: "{t('auth.loginTitle')}"</div>
      </div>

      <div style={{ margin: '10px 0', fontSize: '10px' }}>
        <div>Raw translation test:</div>
        <div>t('app.title') = {JSON.stringify(t('app.title'))}</div>
        <div>Direct Arabic test: تطبيق دفتر الهاتف</div>
        <div>i18n.language = {i18n.language}</div>
        <div>i18n.exists('app.title') = {i18n.exists('app.title') ? 'true' : 'false'}</div>
        <div>Arabic resource exists = {i18n.exists('app.title', { lng: 'ar' }) ? 'true' : 'false'}</div>
      </div>

      <div style={{ fontSize: '12px', color: 'gray' }}>
        <div>Resources: {JSON.stringify(Object.keys(i18n.options.resources || {}))}</div>
        <div>Has Arabic: {i18n.hasResourceBundle('ar', 'translation') ? 'Yes' : 'No'}</div>
      </div>
    </div>
  )
}

export default SimpleTest
