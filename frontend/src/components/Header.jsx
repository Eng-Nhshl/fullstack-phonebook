import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'
import authService from '../services/auth'
import LanguageSwitcher from './LanguageSwitcher'

const Header = ({ user, onLogout }) => {
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage() // This will trigger re-render on language change

  const handleLogout = () => {
    authService.logout()
    onLogout()
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <h1 key={currentLanguage}>{t('app.title')}</h1>
        <div className="header-actions">
          <LanguageSwitcher />
          {user && (
            <div className="user-info">
              <span className="welcome-text">
                {t('auth.welcomeBack', { name: `${user.firstName} ${user.lastName}` })}
              </span>
              <button
                className="logout-button"
                onClick={handleLogout}
                type="button"
              >
                {t('auth.logout')}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
