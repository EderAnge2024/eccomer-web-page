// Servicios de productos
import api from './config.js';

export const productsService = {
  // Obtener todos los productos (combinados: BD + API externa)
  getProducts: async () => {
    try {
      const response = await api.get('/productos/combinados');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener productos solo de la base de datos
  getProductsFromDB: async () => {
    try {
      const response = await api.get('/productos/database');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener producto por ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener productos por categoría
  getProductsByCategory: async (category) => {
    try {
      const response = await api.get(`/productos/categoria/${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener productos por usuario (administrador)
  getProductsByUser: async (userId) => {
    try {
      const response = await api.get(`/productos/usuario/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Crear producto (solo administradores)
  createProduct: async (productData) => {
    try {
      const response = await api.post('/productos', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Actualizar producto (solo administradores)
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/productos/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Eliminar producto (solo administradores)
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};