import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'

const Persons = ({ persons, onDelete, onEdit }) => {
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage()

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

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const toggleFavorite = async (person) => {
    // This will be handled by the parent component
    onEdit({ ...person, favorite: !person.favorite })
  }

  // Determine card layout based on available data
  const getCardLayout = (person) => {
    const dataPoints = [
      person.number,
      person.secondaryNumber,
      person.email,
      person.address,
      person.company,
      person.jobTitle,
      person.birthday,
      person.tags?.length > 0,
      person.notes
    ].filter(Boolean).length

    if (dataPoints <= 2) return 'minimal'
    if (dataPoints <= 4) return 'standard'
    if (dataPoints <= 6) return 'detailed'
    return 'full'
  }

  // Prioritize contact information display
  const getContactItems = (person) => {
    const items = []

    // Priority 1: Essential contact info
    items.push({
      key: 'phone',
      label: t('contacts.phone'),
      value: person.number,
      priority: 'primary',
      order: 1
    })

    // Priority 2: Secondary contact methods
    if (person.email) {
      items.push({
        key: 'email',
        label: t('contacts.email'),
        value: person.email,
        priority: 'primary',
        order: 2
      })
    }

    if (person.secondaryNumber) {
      items.push({
        key: 'secondary',
        label: t('contacts.secondary'),
        value: person.secondaryNumber,
        priority: 'secondary',
        order: 3
      })
    }

    // Priority 3: Professional info
    if (person.company) {
      items.push({
        key: 'company',
        label: t('contacts.company'),
        value: person.company,
        priority: 'secondary',
        order: 4
      })
    }

    // Priority 4: Location and personal info
    if (person.address) {
      items.push({
        key: 'address',
        label: t('contacts.address'),
        value: person.address,
        priority: 'tertiary',
        order: 5
      })
    }

    if (person.birthday) {
      items.push({
        key: 'birthday',
        label: t('contacts.birthday'),
        value: formatDate(person.birthday),
        priority: 'tertiary',
        order: 6
      })
    }

    return items.sort((a, b) => a.order - b.order)
  }

  return (
    <div className="persons-container" key={currentLanguage}>
      {persons.length === 0 ? (
        <p className="no-contacts">{t('contacts.noContacts')}</p>
      ) : (
        <div className="contacts-grid">
          {persons.map(person => {
            const cardLayout = getCardLayout(person)
            const contactItems = getContactItems(person)
            const hasOverflow = contactItems.length > 4

            return (
              <div key={person.id} className={`contact-card ${person.favorite ? 'favorite' : ''} ${cardLayout}`}>
                <div className="contact-header">
                  <div className="contact-title">
                    <h3 className="contact-name">
                      {person.name}
                      {person.favorite && (
                        <span className="favorite-star" title="Favorite">★</span>
                      )}
                    </h3>
                    {(person.company || person.jobTitle) && (
                      <p className="contact-job">
                        {person.jobTitle}{person.company && person.jobTitle ? ' at ' : ''}{person.company}
                      </p>
                    )}
                  </div>
                  <span
                    className="contact-category"
                    style={{ backgroundColor: getCategoryColor(person.category) }}
                  >
                    {getCategoryLabel(person.category)}
                  </span>
                </div>

                <div className={`contact-details ${hasOverflow ? 'has-overflow' : ''}`}>
                  {contactItems.map(item => (
                    <div key={item.key} className={`contact-item ${item.priority} priority-${item.order}`}>
                      <span className="contact-label">{item.label}:</span>
                      <span className="contact-value">{item.value}</span>
                    </div>
                  ))}

                  {person.tags && person.tags.length > 0 && (
                    <div className="contact-item secondary priority-7">
                      <span className="contact-label">{t('contacts.tags')}:</span>
                      <div className={`contact-tags ${person.tags.length > 3 ? 'has-more' : ''}`} data-count={person.tags.length - 3}>
                        {person.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {person.notes && (
                    <div className="contact-notes">
                      {person.notes}
                    </div>
                  )}
                </div>

                <div className="contact-actions">
                  <button
                    className={`favorite-button ${person.favorite ? 'favorited' : ''}`}
                    onClick={() => toggleFavorite(person)}
                    type="button"
                    title={person.favorite ? t('contacts.removeFromFavorites') : t('contacts.addToFavorites')}
                  >
                    {person.favorite ? '★' : '☆'}
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => onEdit(person)}
                    type="button"
                  >
                    {t('contacts.edit')}
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => onDelete(person.id)}
                    type="button"
                  >
                    {t('contacts.delete')}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Persons