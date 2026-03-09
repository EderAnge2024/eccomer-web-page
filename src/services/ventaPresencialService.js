// Servicio de venta presencial (POS) - Compatible con backend
import api from './api.js';

export const ventaPresencialService = {
  // Buscar productos para venta presencial
  async buscarProductos(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (params.search) queryParams.append('search', params.search);
      if (params.categoria) queryParams.append('categoria', params.categoria);
      if (params.limit) queryParams.append('limit', params.limit);
      
      console.log('🌐 GET /venta-presencial/productos?' + queryParams.toString());
      const response = await api.get(`/venta-presencial/productos?${queryParams.toString()}`);
      
      if (response.data.success) {
        return {
          success: true,
          productos: response.data.productos || [],
          categorias: response.data.categorias || []
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al buscar productos',
        productos: [],
        categorias: []
      };
    } catch (error) {
      console.error('❌ Error en buscarProductos:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión',
        productos: [],
        categorias: []
      };
    }
  },

  // Crear venta presencial
  async crearVenta(ventaData) {
    try {
      console.log('🌐 POST /venta-presencial/crear', ventaData);
      const response = await api.post('/venta-presencial/crear', ventaData);
      
      if (response.data.success) {
        return {
          success: true,
          pedido: response.data.pedido,
          message: response.data.message || 'Venta creada exitosamente'
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al crear venta'
      };
    } catch (error) {
      console.error('❌ Error en crearVenta:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  // Obtener resumen de ventas del día
  async obtenerResumenDelDia() {
    try {
      console.log('🌐 GET /venta-presencial/resumen-dia');
      const response = await api.get('/venta-presencial/resumen-dia');
      
      if (response.data.success) {
        return {
          success: true,
          ...response.data
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al obtener resumen'
      };
    } catch (error) {
      console.error('❌ Error en obtenerResumenDelDia:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  }
};

export default ventaPresencialService;
