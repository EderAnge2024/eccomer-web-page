const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const token = localStorage.getItem('token')
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en la petición')
      }
      
      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }

  async verifyToken() {
    return this.request('/api/auth/verify')
  }

  // Products endpoints
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/api/productos${queryString ? `?${queryString}` : ''}`)
  }

  async createProduct(productData) {
    return this.request('/api/productos', {
      method: 'POST',
      body: JSON.stringify(productData)
    })
  }

  async updateProduct(id, productData) {
    return this.request(`/api/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    })
  }

  async deleteProduct(id) {
    return this.request(`/api/productos/${id}`, {
      method: 'DELETE'
    })
  }

  // Orders endpoints
  async getOrders() {
    return this.request('/api/pedidos')
  }

  async getUserOrders() {
    return this.request('/api/pedidos/mis-pedidos')
  }

  async createOrder(orderData) {
    return this.request('/api/pedidos', {
      method: 'POST',
      body: JSON.stringify(orderData)
    })
  }

  // Users endpoints
  async getUsers() {
    return this.request('/api/usuarios')
  }
}

export default new ApiService()