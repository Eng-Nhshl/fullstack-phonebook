import axios from 'axios'

const baseURL = 'http://localhost:3001/api/auth'

// Set up axios interceptor to include token in requests
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common['Authorization']
  }
}

// Initialize token from localStorage on app start
const token = localStorage.getItem('token')
if (token) {
  setAuthToken(token)
}

const register = async (userData) => {
  const response = await axios.post(`${baseURL}/register`, userData)
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    setAuthToken(response.data.token)
  }
  return response.data
}

const login = async (credentials) => {
  const response = await axios.post(`${baseURL}/login`, credentials)
  if (response.data.token) {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('user', JSON.stringify(response.data.user))
    setAuthToken(response.data.token)
  }
  return response.data
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  setAuthToken(null)
}

const getCurrentUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

const getProfile = async () => {
  const response = await axios.get(`${baseURL}/profile`)
  return response.data
}

const updateProfile = async (userData) => {
  const response = await axios.put(`${baseURL}/profile`, userData)
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }
  return response.data
}

const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  return !!token
}

export default {
  register,
  login,
  logout,
  getCurrentUser,
  getProfile,
  updateProfile,
  isAuthenticated,
  setAuthToken
}
