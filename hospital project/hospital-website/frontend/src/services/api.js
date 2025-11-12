import axios from 'axios'

// Prefer Vite env vars (import.meta.env). Avoid accessing `process` directly in the browser
// because `process` is not defined in the Vite dev/runtime environment and causes
// a runtime ReferenceError when the file is loaded in the browser.
const API_URL = (
  import.meta.env.VITE_REACT_APP_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  (typeof process !== 'undefined' && process.env ? process.env.REACT_APP_API_URL : undefined) ||
  'http://localhost:5000'
)

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000,
})

// attach token
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

export default api
