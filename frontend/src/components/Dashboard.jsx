import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'

const Dashboard = ({ persons }) => {
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage()
  // Calculate statistics
  const totalContacts = persons.length
  const favoritesCount = persons.filter(p => p.favorite).length
  const withEmailCount = persons.filter(p => p.email && p.email.trim() !== '').length
  const withSecondaryPhoneCount = persons.filter(p => p.secondaryNumber && p.secondaryNumber.trim() !== '').length

  // Category statistics
  const categoryStats = persons.reduce((acc, person) => {
    acc[person.category] = (acc[person.category] || 0) + 1
    return acc
  }, {})

  // Recent contacts (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const recentContacts = persons.filter(p =>
    new Date(p.createdAt) > sevenDaysAgo
  ).length

  // Tag statistics (top 5 most used tags)
  const tagStats = persons
    .flatMap(p => p.tags || [])
    .reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1
      return acc
    }, {})

  const topTags = Object.entries(tagStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const getCategoryColor = (category) => {
    const colors = {
      'Family': '#e74c3c',
      'Work': '#3498db',
      'Friends': '#2ecc71',
      'Emergency': '#f39c12',
      'Other': '#95a5a6'
    }
    return colors[category] || colors['Other']
  }

  const getCategoryLabel = (category) => {
    const categoryMap = {
      'Family': t('categories.family'),
      'Work': t('categories.work'),
      'Friends': t('categories.friends'),
      'Emergency': t('categories.emergency'),
      'Other': t('categories.other')
    }
    return categoryMap[category] || category
  }

  const StatCard = ({ title, value, subtitle, icon, color = '#667eea' }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>
        {icon}
      </div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
      </div>
    </div>
  )

  if (totalContacts === 0) {
    return (
      <div className="dashboard" key={currentLanguage}>
        <div className="dashboard-header">
          <h2>📊 {t('dashboard.title')}</h2>
        </div>
        <div className="empty-dashboard">
          <p>{t('dashboard.emptyMessage')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard" key={currentLanguage}>
      <div className="dashboard-header">
        <h2>📊 {t('dashboard.title')}</h2>
        <span className="dashboard-subtitle">{t('dashboard.subtitle')}</span>
      </div>

      {/* Main Statistics */}
      <div className="stats-grid">
        <StatCard
          title={t('dashboard.totalContacts')}
          value={totalContacts}
          icon="👥"
          color="#667eea"
        />

        <StatCard
          title={t('dashboard.favorites')}
          value={favoritesCount}
          subtitle={`${((favoritesCount / totalContacts) * 100).toFixed(0)}% ${t('dashboard.ofTotal')}`}
          icon="⭐"
          color="#f39c12"
        />

        <StatCard
          title={t('dashboard.withEmail')}
          value={withEmailCount}
          subtitle={`${((withEmailCount / totalContacts) * 100).toFixed(0)}% ${t('dashboard.ofTotal')}`}
          icon="📧"
          color="#2ecc71"
        />

        <StatCard
          title={t('dashboard.recent')}
          value={recentContacts}
          subtitle={t('dashboard.newlyAdded')}
          icon="🆕"
          color="#9b59b6"
        />
      </div>

      {/* Category Breakdown */}
      <div className="dashboard-section">
        <h3>📂 {t('dashboard.categories')}</h3>
        <div className="category-stats">
          {Object.entries(categoryStats).map(([category, count]) => (
            <div key={category} className="category-stat">
              <div className="category-info">
                <span
                  className="category-dot"
                  style={{ backgroundColor: getCategoryColor(category) }}
                ></span>
                <span className="category-name">{getCategoryLabel(category)}</span>
              </div>
              <div className="category-count">
                <span className="count">{count}</span>
                <div
                  className="category-bar"
                  style={{
                    width: `${(count / totalContacts) * 100}%`,
                    backgroundColor: getCategoryColor(category)
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Tags */}
      {topTags.length > 0 && (
        <div className="dashboard-section">
          <h3>🏷️ {t('dashboard.popularTags')}</h3>
          <div className="tags-stats">
            {topTags.map(([tag, count]) => (
              <div key={tag} className="tag-stat">
                <span className="tag-name">{tag}</span>
                <span className="tag-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Stats */}
      <div className="dashboard-section">
        <h3>📱 {t('dashboard.contactDetails')}</h3>
        <div className="detail-stats">
          <div className="detail-stat">
            <span className="detail-label">{t('dashboard.secondaryPhones')}:</span>
            <span className="detail-value">{withSecondaryPhoneCount}</span>
          </div>
          <div className="detail-stat">
            <span className="detail-label">{t('dashboard.withAddress')}:</span>
            <span className="detail-value">
              {persons.filter(p => p.address && p.address.trim() !== '').length}
            </span>
          </div>
          <div className="detail-stat">
            <span className="detail-label">{t('dashboard.professionalContacts')}:</span>
            <span className="detail-value">
              {persons.filter(p => (p.company && p.company.trim() !== '') || (p.jobTitle && p.jobTitle.trim() !== '')).length}
            </span>
          </div>
          <div className="detail-stat">
            <span className="detail-label">{t('dashboard.birthdaysRecorded')}:</span>
            <span className="detail-value">
              {persons.filter(p => p.birthday).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
