import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'

const AdvancedFilters = ({
  filter,
  onSearchChange,
  filterCategory,
  onCategoryChange,
  filterTag,
  onTagChange,
  filterFavorites,
  onFavoritesChange,
  filterEmail,
  onEmailChange,
  sortBy,
  onSortChange,
  allTags,
  contactCount
}) => {
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage()
  const categories = [
    { value: 'All', label: t('filters.categories.all') },
    { value: 'Family', label: t('filters.categories.family') },
    { value: 'Work', label: t('filters.categories.work') },
    { value: 'Friends', label: t('filters.categories.friends') },
    { value: 'Emergency', label: t('filters.categories.emergency') },
    { value: 'Other', label: t('filters.categories.other') }
  ]
  const favoriteOptions = [
    { value: 'All', label: t('filters.favoriteOptions.all') },
    { value: 'Favorites', label: t('filters.favoriteOptions.favorites') },
    { value: 'Non-Favorites', label: t('filters.favoriteOptions.nonFavorites') }
  ]
  const emailOptions = [
    { value: 'All', label: t('filters.emailOptions.all') },
    { value: 'With Email', label: t('filters.emailOptions.withEmail') },
    { value: 'Without Email', label: t('filters.emailOptions.withoutEmail') }
  ]
  const sortOptions = [
    { value: 'name-asc', label: t('filters.sortOptions.nameAsc') },
    { value: 'name-desc', label: t('filters.sortOptions.nameDesc') },
    { value: 'newest', label: t('filters.sortOptions.newest') },
    { value: 'oldest', label: t('filters.sortOptions.oldest') },
    { value: 'category', label: t('filters.sortOptions.category') },
    { value: 'favorites-first', label: t('filters.sortOptions.favoritesFirst') }
  ]

  const clearAllFilters = () => {
    onSearchChange({ target: { value: '' } })
    onCategoryChange({ target: { value: 'All' } })
    onTagChange({ target: { value: 'All' } })
    onFavoritesChange({ target: { value: 'All' } })
    onEmailChange({ target: { value: 'All' } })
    onSortChange({ target: { value: 'name-asc' } })
  }

  const hasActiveFilters = filter || filterCategory !== 'All' || filterTag !== 'All' ||
    filterFavorites !== 'All' || filterEmail !== 'All' || sortBy !== 'name-asc'

  return (
    <div className="advanced-filters" key={currentLanguage}>
      <div className="filters-header">
        <h3>{t('filters.title')}</h3>
        <div className="filters-info">
          <span className="contact-count">{contactCount} {t('filters.contacts')}</span>
          {hasActiveFilters && (
            <button
              type="button"
              className="clear-filters-button"
              onClick={clearAllFilters}
            >
              {t('filters.clearFilters')}
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="search">{t('filters.search')}:</label>
          <input
            id="search"
            type="text"
            value={filter}
            onChange={onSearchChange}
            placeholder={t('filters.searchPlaceholder')}
            className="search-input"
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="filter-section">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="category-filter">{t('filters.category')}:</label>
            <select
              id="category-filter"
              value={filterCategory}
              onChange={onCategoryChange}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="tag-filter">{t('filters.tag')}:</label>
            <select
              id="tag-filter"
              value={filterTag}
              onChange={onTagChange}
            >
              <option value="All">{t('filters.allTags')}</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="favorites-filter">{t('filters.favorites')}:</label>
            <select
              id="favorites-filter"
              value={filterFavorites}
              onChange={onFavoritesChange}
            >
              {favoriteOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="email-filter">{t('filters.email')}:</label>
            <select
              id="email-filter"
              value={filterEmail}
              onChange={onEmailChange}
            >
              {emailOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="sort-by">{t('filters.sortBy')}:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={onSortChange}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default AdvancedFilters
