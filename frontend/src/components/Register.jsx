import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'
import authService from '../services/auth'

const Register = ({ onRegister, onToggleForm, setMessage }) => {
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage()

  const getErrorMessage = (error) => {
    const serverError = error.response?.data?.error
    if (!serverError) return t('auth.registrationFailed')

    // Map common server errors to translation keys
    const errorMap = {
      'User with this email or username already exists': 'validation.userExists',
      'Password must be at least 6 characters long': 'validation.passwordTooShort',
      'Email and password are required': 'validation.emailRequired',
      'Server error': 'validation.serverError',
      'Validation error': 'validation.serverError'
    }

    return t(errorMap[serverError] || 'auth.registrationFailed')
  }
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setMessage({
        errorMsg: t('validation.passwordsNoMatch'),
        successMsg: null
      })
      return
    }

    if (formData.password.length < 6) {
      setMessage({
        errorMsg: t('validation.passwordTooShort'),
        successMsg: null
      })
      return
    }

    setLoading(true)

    try {
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      }
      const response = await authService.register(registrationData)
      setMessage({
        successMsg: t('auth.welcomeNew', { name: response.user.firstName }),
        errorMsg: null
      })
      onRegister(response.user)
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
        <h2>{t('auth.registerTitle')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">{t('auth.firstName')}:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">{t('auth.lastName')}:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">{t('auth.username')}:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('auth.email')}:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">{t('auth.confirmPassword')}:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? t('auth.registering') : t('auth.registerButton')}
          </button>
        </form>

        <p className="auth-toggle">
          {t('auth.hasAccount')}{' '}
          <button
            type="button"
            className="link-button"
            onClick={onToggleForm}
            disabled={loading}
          >
            {t('auth.loginHere')}
          </button>
        </p>
      </div>
    </div>
  )
}

export default Register
