// Servicio de productos - Compatible con backend
import api from './api.js';

export const productService = {
  // Obtener productos combinados (BD + API externa)
  async getProductosCombinados() {
    try {
      console.log('🌐 GET /productos/combinados');
      const response = await api.get('/productos/combinados');
      console.log('📡 Response:', response.status);
      
      if (response.data.success) {
        return {
          success: true,
          productos: response.data.productos || [],
          stats: response.data.stats
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al cargar productos'
      };
    } catch (error) {
      console.error('❌ Error en getProductosCombinados:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión',
        productos: []
      };
    }
  },

  // Obtener productos solo de la base de datos
  async getProductosDatabase() {
    try {
      console.log('🌐 GET /productos/database');
      const response = await api.get('/productos/database');
      
      if (response.data.success) {
        return {
          success: true,
          productos: response.data.productos || []
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al cargar productos'
      };
    } catch (error) {
      console.error('❌ Error en getProductosDatabase:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión',
        productos: []
      };
    }
  },

  // Obtener productos por usuario (para administradores)
  async getProductosByUser(userId) {
    try {
      console.log(`🌐 GET /productos/usuario/${userId}`);
      const response = await api.get(`/productos/usuario/${userId}`);
      
      if (response.data.success) {
        return {
          success: true,
          productos: response.data.productos || []
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al cargar productos'
      };
    } catch (error) {
      console.error('❌ Error en getProductosByUser:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión',
        productos: []
      };
    }
  },

  // Crear producto (solo administradores)
  async createProducto(productData) {
    try {
      console.log('🌐 POST /productos', productData);
      const response = await api.post('/productos', productData);
      
      if (response.data.success) {
        return {
          success: true,
          producto: response.data.producto,
          message: 'Producto creado exitosamente'
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al crear producto'
      };
    } catch (error) {
      console.error('❌ Error en createProducto:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  // Actualizar producto (solo administradores)
  async updateProducto(id, productData) {
    try {
      console.log(`🌐 PUT /productos/${id}`, productData);
      const response = await api.put(`/productos/${id}`, productData);
      
      if (response.data.success) {
        return {
          success: true,
          producto: response.data.producto,
          message: 'Producto actualizado exitosamente'
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al actualizar producto'
      };
    } catch (error) {
      console.error('❌ Error en updateProducto:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  // Eliminar producto (solo administradores)
  async deleteProducto(id) {
    try {
      console.log(`🌐 DELETE /productos/${id}`);
      const response = await api.delete(`/productos/${id}`);
      
      if (response.data.success) {
        return {
          success: true,
          message: 'Producto eliminado exitosamente'
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al eliminar producto'
      };
    } catch (error) {
      console.error('❌ Error en deleteProducto:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  // Obtener producto por ID
  async getProductoById(id) {
    try {
      console.log(`🌐 GET /productos/${id}`);
      const response = await api.get(`/productos/${id}`);
      
      if (response.data.success) {
        return {
          success: true,
          producto: response.data.producto
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Producto no encontrado'
      };
    } catch (error) {
      console.error('❌ Error en getProductoById:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  }
};

export default productService;
