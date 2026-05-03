import { useTranslation } from 'react-i18next'

const DebugLanguage = () => {
  const { i18n, t, ready } = useTranslation()

  const testTranslation = (key) => {
    const result = t(key)
    return `${key}: "${result}"`
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: 'yellow',
      padding: '10px',
      fontSize: '11px',
      zIndex: 9999,
      border: '1px solid black',
      maxWidth: '300px',
      fontFamily: 'monospace'
    }}>
      <div><strong>i18n Debug Info:</strong></div>
      <div>Language: {i18n.language}</div>
      <div>Ready: {ready ? 'Yes' : 'No'}</div>
      <div>Dir: {document.documentElement.dir}</div>
      <div>Body Class: {document.body.className}</div>
      <hr style={{ margin: '5px 0' }} />
      <div>{testTranslation('app.title')}</div>
      <div>{testTranslation('auth.login')}</div>
      <div>{testTranslation('auth.logout')}</div>
      <hr style={{ margin: '5px 0' }} />
      <div>Resources loaded: {Object.keys(i18n.options.resources || {}).join(', ')}</div>
      <div>Has AR: {i18n.hasResourceBundle('ar', 'translation') ? 'Yes' : 'No'}</div>
      <div>Has EN: {i18n.hasResourceBundle('en', 'translation') ? 'Yes' : 'No'}</div>
    </div>
  )
}

export default DebugLanguage
