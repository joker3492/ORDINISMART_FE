import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000', // Base URL generica per il back-end
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
})

// Interceptor per aggiungere il token JWT alle richieste
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Interceptor per gestire errori delle risposte
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token non valido o scaduto
      localStorage.removeItem('accessToken')
      alert('Sessione scaduta. Effettua di nuovo il login.')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
