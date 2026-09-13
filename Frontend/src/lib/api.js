import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL,
  withCredentials: true, // sends the accessToken cookie set by /api/auth/login
  headers: { 'Content-Type': 'application/json' },
})

export default api
