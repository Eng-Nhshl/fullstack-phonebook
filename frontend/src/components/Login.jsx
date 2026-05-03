import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'
import authService from '../services/auth'

const Login = ({ onLogin, onToggleForm, setMessage }) => {
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage() // Force re-render on language change

  const getErrorMessage = (error) => {
    const serverError = error.response?.data?.error
    if (!serverError) return t('auth.loginFailed')

    // Map common server errors to translation keys
    const errorMap = {
      'Invalid credentials': 'validation.invalidCredentials',
      'User not found': 'validation.invalidCredentials',
      'Invalid password': 'validation.invalidCredentials',
      'Email and password are required': 'validation.emailRequired',
      'Server error': 'validation.serverError'
    }

    return t(errorMap[serverError] || 'auth.loginFailed')
  }
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)


  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)


    try {
      const response = await authService.login(credentials)
      setMessage({
        successMsg: t('auth.welcomeBack', { name: response.user.firstName }),
        errorMsg: null
      })
      onLogin(response.user)
    } catch (error) {
      setMessage({
        errorMsg: getErrorMessage(error),
        successMsg: null
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container" key={currentLanguage}>
      <div className="auth-form">
        <h2>{t('auth.loginTitle')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder={t('form.emailPlaceholder')}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t('auth.password')}:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? t('auth.loggingIn') : t('auth.loginButton')}
          </button>
        </form>

        <p className="auth-toggle">
          {t('auth.noAccount')}{' '}
          <button
            type="button"
            className="link-button"
            onClick={onToggleForm}
            disabled={loading}
          >
            {t('auth.registerHere')}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
