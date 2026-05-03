import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import AdvancedFilters from './components/AdvancedFilters'
import Dashboard from './components/Dashboard'
import Login from './components/Login'
import Register from './components/Register'
import Header from './components/Header'
import Footer from './components/Footer'
import personServices from './services/phonebook'
import authService from './services/auth'

const App = () => {
  const { i18n, t } = useTranslation()
  const [user, setUser] = useState(null)
  const [renderKey, setRenderKey] = useState(0)
  const [persons, setPersons] = useState([])
  const [showRegister, setShowRegister] = useState(false)
  const [loading, setLoading] = useState(true)

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    category: 'Other',
    notes: '',
    secondaryNumber: '',
    address: '',
    company: '',
    jobTitle: '',
    birthday: null,
    tags: [],
    favorite: false
  })
  const [editingPerson, setEditingPerson] = useState(null)

  // UI states
  const [filter, setFilter] = useState('')
  const [filterCategory, setFilterCategory] = useState('All')
  const [filterTag, setFilterTag] = useState('All')
  const [filterFavorites, setFilterFavorites] = useState('All')
  const [filterEmail, setFilterEmail] = useState('All')
  const [sortBy, setSortBy] = useState('name-asc')
  const [message, setMessage] = useState({
    errorMsg: null,
    successMsg: null
  })

  const clearForm = useCallback(() => {
    setFormData({
      name: '',
      number: '',
      email: '',
      category: 'Other',
      notes: '',
      secondaryNumber: '',
      address: '',
      company: '',
      jobTitle: '',
      birthday: null,
      tags: [],
      favorite: false
    })
    setEditingPerson(null)
  }, [])

  const handleLogout = useCallback(() => {
    setUser(null)
    setPersons([])
    clearForm()
  }, [clearForm])

  // Force re-render when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      console.log('App: Forcing re-render due to language change')
      setRenderKey(prev => prev + 1)
    }

    i18n.on('languageChanged', handleLanguageChange)
    return () => i18n.off('languageChanged', handleLanguageChange)
  }, [i18n])

  // Initialize app - check for existing authentication and language
  useEffect(() => {
    // Set initial language direction
    const currentLang = i18n.language || 'en'
    document.documentElement.lang = currentLang
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr'

    const initializeApp = async () => {
      const currentUser = authService.getCurrentUser()
      if (currentUser && authService.isAuthenticated()) {
        setUser(currentUser)
        try {
          const initialPersons = await personServices.getAll()
          setPersons(initialPersons)
        } catch (error) {
          console.error('Failed to load contacts:', error)
          if (error.response?.status === 401) {
            handleLogout()
          }
        }
      }
      setLoading(false)
    }

    initializeApp()
  }, [handleLogout, i18n.language])

  // Clear message after 5 seconds
  useEffect(() => {
    if (message.errorMsg || message.successMsg) {
      const timer = setTimeout(() => {
        setMessage({ errorMsg: null, successMsg: null })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const handleLogin = async (userData) => {
    setUser(userData)
    try {
      const contacts = await personServices.getAll()
      setPersons(contacts)
    } catch (error) {
      console.error('Failed to load contacts after login:', error)
    }
  }

  const handleRegister = async (userData) => {
    setUser(userData)
    setPersons([]) // New user starts with empty contacts
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addOrUpdatePerson = async (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.number.trim()) {
      setMessage({
        errorMsg: 'Name and phone number are required!',
        successMsg: null
      })
      return
    }

    const personData = {
      name: formData.name.trim(),
      number: formData.number.trim(),
      email: formData.email.trim(),
      category: formData.category,
      notes: formData.notes.trim(),
      secondaryNumber: formData.secondaryNumber.trim(),
      address: formData.address.trim(),
      company: formData.company.trim(),
      jobTitle: formData.jobTitle.trim(),
      birthday: formData.birthday,
      tags: formData.tags,
      favorite: formData.favorite
    }

    try {
      if (editingPerson) {
        // Update existing person
        const updatedPerson = await personServices.update(editingPerson.id, personData)
        setPersons(persons.map(p => p.id === editingPerson.id ? updatedPerson : p))
        setMessage({
          successMsg: `${formData.name} updated successfully!`,
          errorMsg: null
        })
      } else {
        // Check for duplicate names
        const existingPerson = persons.find(p =>
          p.name.toLowerCase() === formData.name.toLowerCase()
        )

        if (existingPerson) {
          if (window.confirm(`${formData.name} already exists. Do you want to update their information?`)) {
            const updatedPerson = await personServices.update(existingPerson.id, personData)
            setPersons(persons.map(p => p.id === existingPerson.id ? updatedPerson : p))
            setMessage({
              successMsg: `${formData.name} updated successfully!`,
              errorMsg: null
            })
          }
          return
        }

        // Create new person
        const newPerson = await personServices.create(personData)
        setPersons(persons.concat(newPerson))
        setMessage({
          successMsg: `${formData.name} added successfully!`,
          errorMsg: null
        })
      }

      clearForm()
    } catch (error) {
      setMessage({
        errorMsg: error.response?.data?.error || 'Operation failed',
        successMsg: null
      })
    }
  }

  const deletePerson = async (id) => {
    const person = persons.find(p => p.id === id)
    if (person && window.confirm(`Delete ${person.name}?`)) {
      try {
        await personServices.delete(id)
        setPersons(persons.filter(p => p.id !== id))
        setMessage({
          successMsg: `${person.name} deleted successfully!`,
          errorMsg: null
        })
      } catch (error) {
        setMessage({
          errorMsg: error.response?.data?.error || 'Delete failed',
          successMsg: null
        })
      }
    }
  }

  const editPerson = (person) => {
    setEditingPerson(person)
    setFormData({
      name: person.name,
      number: person.number,
      email: person.email || '',
      category: person.category || 'Other',
      notes: person.notes || '',
      secondaryNumber: person.secondaryNumber || '',
      address: person.address || '',
      company: person.company || '',
      jobTitle: person.jobTitle || '',
      birthday: person.birthday || null,
      tags: person.tags || [],
      favorite: person.favorite || false
    })
  }

  const cancelEdit = () => {
    clearForm()
  }

  const handleSearchFilter = (e) => {
    setFilter(e.target.value)
  }

  // Get all unique tags for filter dropdown
  const allTags = [...new Set(persons.flatMap(person => person.tags || []))].sort()

  // Advanced filtering and sorting
  const filteredPersons = persons
    .filter(person => {
      // Text search filter
      const matchesText = !filter ||
        person.name.toLowerCase().includes(filter.toLowerCase()) ||
        person.number.includes(filter) ||
        (person.email && person.email.toLowerCase().includes(filter.toLowerCase())) ||
        person.category.toLowerCase().includes(filter.toLowerCase()) ||
        (person.company && person.company.toLowerCase().includes(filter.toLowerCase())) ||
        (person.jobTitle && person.jobTitle.toLowerCase().includes(filter.toLowerCase())) ||
        (person.tags && person.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase())))

      // Category filter
      const matchesCategory = filterCategory === 'All' || person.category === filterCategory

      // Tag filter
      const matchesTag = filterTag === 'All' || (person.tags && person.tags.includes(filterTag))

      // Favorites filter
      const matchesFavorites = filterFavorites === 'All' ||
        (filterFavorites === 'Favorites' && person.favorite) ||
        (filterFavorites === 'Non-Favorites' && !person.favorite)

      // Email filter
      const matchesEmail = filterEmail === 'All' ||
        (filterEmail === 'With Email' && person.email && person.email.trim() !== '') ||
        (filterEmail === 'Without Email' && (!person.email || person.email.trim() === ''))

      return matchesText && matchesCategory && matchesTag && matchesFavorites && matchesEmail
    })
    .sort((a, b) => {
      // Sorting logic
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'category':
          return a.category.localeCompare(b.category)
        case 'favorites-first':
          if (a.favorite && !b.favorite) return -1
          if (!a.favorite && b.favorite) return 1
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  // Show authentication forms if user is not logged in
  if (!user) {
    return (
      <div className="app" key={renderKey}>
        <Notification messages={message} />
        {showRegister ? (
          <Register
            onRegister={handleRegister}
            onToggleForm={() => setShowRegister(false)}
            setMessage={setMessage}
          />
        ) : (
          <Login
            onLogin={handleLogin}
            onToggleForm={() => setShowRegister(true)}
            setMessage={setMessage}
          />
        )}
      </div>
    )
  }

  // Main application for authenticated users
  return (
    <div className="app" key={renderKey}>
      <Header user={user} onLogout={handleLogout} />

      <main className="main-content">
        <Notification messages={message} />

        <Dashboard persons={persons} />

        <section className="search-section">
          <AdvancedFilters
            filter={filter}
            onSearchChange={handleSearchFilter}
            filterCategory={filterCategory}
            onCategoryChange={(e) => setFilterCategory(e.target.value)}
            filterTag={filterTag}
            onTagChange={(e) => setFilterTag(e.target.value)}
            filterFavorites={filterFavorites}
            onFavoritesChange={(e) => setFilterFavorites(e.target.value)}
            filterEmail={filterEmail}
            onEmailChange={(e) => setFilterEmail(e.target.value)}
            sortBy={sortBy}
            onSortChange={(e) => setSortBy(e.target.value)}
            allTags={allTags}
            contactCount={filteredPersons.length}
          />
        </section>

        <section className="form-section">
          <h2>{editingPerson ? t('contacts.editContact') : t('contacts.addNewContact')}</h2>
          <PersonForm
            onSubmit={addOrUpdatePerson}
            formData={formData}
            onFieldChange={handleFormChange}
            isEditing={!!editingPerson}
          />
          {editingPerson && (
            <button
              type="button"
              className="cancel-edit-button"
              onClick={cancelEdit}
            >
              {t('contacts.cancelEdit')}
            </button>
          )}
        </section>

        <section className="contacts-section">
          <h2>{t('contacts.yourContacts')} ({filteredPersons.length})</h2>
          <Persons
            persons={filteredPersons}
            onDelete={deletePerson}
            onEdit={editPerson}
          />
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default App