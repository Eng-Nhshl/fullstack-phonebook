import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'

const PersonForm = ({
  onSubmit,
  formData,
  onFieldChange,
  isEditing = false
}) => {
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage()

  const categories = [
    { value: 'Family', label: t('categories.family') },
    { value: 'Work', label: t('categories.work') },
    { value: 'Friends', label: t('categories.friends') },
    { value: 'Emergency', label: t('categories.emergency') },
    { value: 'Other', label: t('categories.other') }
  ]

  const handleTagsChange = (e) => {
    const tagsString = e.target.value
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    onFieldChange('tags', tagsArray)
  }

  const formatDateForInput = (date) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toISOString().split('T')[0]
  }

  return (
    <div className="person-form-container" key={currentLanguage}>
      <form onSubmit={onSubmit} className="person-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3>{t('form.basicInfo')}</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">{t('form.name')} *:</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => onFieldChange('name', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">{t('form.category')}:</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => onFieldChange('category', e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="form-section">
          <h3>{t('form.contactInfo')}</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="number">{t('form.primaryPhone')} *:</label>
              <input
                id="number"
                type="text"
                value={formData.number}
                onChange={(e) => onFieldChange('number', e.target.value)}
                placeholder={t('form.phonePlaceholder')}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="secondaryNumber">{t('form.secondaryPhone')}:</label>
              <input
                id="secondaryNumber"
                type="text"
                value={formData.secondaryNumber}
                onChange={(e) => onFieldChange('secondaryNumber', e.target.value)}
                placeholder={t('form.phonePlaceholder')}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">{t('form.email')}:</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              placeholder={t('form.emailPlaceholder')}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">{t('form.address')}:</label>
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => onFieldChange('address', e.target.value)}
              placeholder={t('form.addressPlaceholder')}
              rows="2"
              maxLength="200"
            />
          </div>
        </div>

        {/* Professional Information */}
        <div className="form-section">
          <h3>{t('form.professionalInfo')}</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="company">{t('form.company')}:</label>
              <input
                id="company"
                type="text"
                value={formData.company}
                onChange={(e) => onFieldChange('company', e.target.value)}
                placeholder={t('form.companyPlaceholder')}
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="jobTitle">{t('form.jobTitle')}:</label>
              <input
                id="jobTitle"
                type="text"
                value={formData.jobTitle}
                onChange={(e) => onFieldChange('jobTitle', e.target.value)}
                placeholder={t('form.jobPlaceholder')}
                maxLength="100"
              />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="form-section">
          <h3>{t('form.personalInfo')}</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="birthday">{t('form.birthday')}:</label>
              <input
                id="birthday"
                type="date"
                value={formatDateForInput(formData.birthday)}
                onChange={(e) => onFieldChange('birthday', e.target.value || null)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="favorite">
                {t('contacts.favorite')}
                :</label>
              <input
                id="favorite"
                type="checkbox"
                checked={formData.favorite}
                onChange={(e) => onFieldChange('favorite', e.target.checked)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">{t('form.tags')}:</label>
            <input
              id="tags"
              type="text"
              value={formData.tags ? formData.tags.join(', ') : ''}
              onChange={handleTagsChange}
              placeholder={t('form.tagsPlaceholder')}
            />
            <small>{t('form.tagsHelp')}</small>
          </div>
        </div>

        {/* Notes */}
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="notes">{t('form.notes')}:</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => onFieldChange('notes', e.target.value)}
              placeholder={t('form.notesPlaceholder')}
              rows="3"
              maxLength="500"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">
            {isEditing ? t('contacts.updateContact') : t('contacts.addContact')}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PersonForm