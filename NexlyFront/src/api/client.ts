import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const client = axios.create({
  baseURL: '/api',
  withCredentials: true, // envía la cookie HttpOnly automáticamente
})

client.interceptors.response.use(
  (res) => res,
  (error) => {
    const { initialized } = useAuthStore.getState()
    if (error.response?.status === 401 && initialized) window.location.href = '/login'
    return Promise.reject(error)
  }
)

export default client
