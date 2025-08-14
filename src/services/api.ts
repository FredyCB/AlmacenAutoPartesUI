import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
export const api = axios.create({ baseURL })

// Optional: interceptors for errors
api.interceptors.response.use(
  r => r,
  e => {
    const msg = e?.response?.data?.detail || e.message
    console.error('API error:', msg)
    return Promise.reject(e)
  }
)
