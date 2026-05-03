import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'

const Footer = () => {
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage()

  return (
    <div className="footer" key={currentLanguage}>
      {t('footer.copyright')}
    </div>
  )
}

export default Footer