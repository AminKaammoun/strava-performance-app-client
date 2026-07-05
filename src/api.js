import axios from 'axios'

// Vite's dev proxy forwards /api/* to the Spring Boot backend (see vite.config.js),
// so no need to hardcode http://localhost:8080 here.
const api = axios.create({
  baseURL: '/api',
})

export const getItems = () => api.get('/items')
export const getItem = (id) => api.get(`/items/${id}`)
export const createItem = (item) => api.post('/items', item)
export const updateItem = (id, item) => api.put(`/items/${id}`, item)
export const deleteItem = (id) => api.delete(`/items/${id}`)

export default api
