import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api'

const api = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' } })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

export const ticketAPI = {
  getAll:    (params) => api.get('/tickets', { params }),
  getById:   (id)     => api.get(`/tickets/${id}`),
  create:    (data)   => api.post('/tickets', data),
  update:    (id, d)  => api.put(`/tickets/${id}`, d),
  delete:    (id)     => api.delete(`/tickets/${id}`),
  myTickets: ()       => api.get('/tickets/my'),
}

export const aiAPI = {
  classify:  (data) => api.post('/ai/classify', data),
  summarize: (id)   => api.get(`/ai/summarize/${id}`),
}

export default api
