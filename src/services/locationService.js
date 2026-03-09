// Servicio de ubicaciones - Compatible con backend
import api from './api.js';

export const locationService = {
  // Obtener ubicaciones por usuario
  async getUbicacionesByUser(userId) {
    try {
      console.log(`🌐 GET /ubicaciones/usuario/${userId}`);
      const response = await api.get(`/ubicaciones/usuario/${userId}`);
      
      if (response.data.success) {
        return {
          success: true,
          ubicaciones: response.data.ubicaciones || []
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al cargar ubicaciones'
      };
    } catch (error) {
      console.error('❌ Error en getUbicacionesByUser:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión',
        ubicaciones: []
      };
    }
  },

  // Crear ubicación
  async createUbicacion(ubicacionData) {
    try {
      console.log('🌐 POST /ubicaciones', ubicacionData);
      const response = await api.post('/ubicaciones', ubicacionData);
      
      if (response.data.success) {
        return {
          success: true,
          ubicacion: response.data.ubicacion,
          message: 'Ubicación creada exitosamente'
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al crear ubicación'
      };
    } catch (error) {
      console.error('❌ Error en createUbicacion:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  // Actualizar ubicación
  async updateUbicacion(id, ubicacionData) {
    try {
      console.log(`🌐 PUT /ubicaciones/${id}`, ubicacionData);
      const response = await api.put(`/ubicaciones/${id}`, ubicacionData);
      
      if (response.data.success) {
        return {
          success: true,
          ubicacion: response.data.ubicacion,
          message: 'Ubicación actualizada exitosamente'
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al actualizar ubicación'
      };
    } catch (error) {
      console.error('❌ Error en updateUbicacion:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  // Eliminar ubicación
  async deleteUbicacion(id) {
    try {
      console.log(`🌐 DELETE /ubicaciones/${id}`);
      const response = await api.delete(`/ubicaciones/${id}`);
      
      if (response.data.success) {
        return {
          success: true,
          message: 'Ubicación eliminada exitosamente'
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al eliminar ubicación'
      };
    } catch (error) {
      console.error('❌ Error en deleteUbicacion:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  // Establecer ubicación principal
  async setUbicacionPrincipal(id, userId) {
    try {
      console.log(`🌐 PUT /ubicaciones/${id}/principal`);
      const response = await api.put(`/ubicaciones/${id}/principal`, { id_usuario: userId });
      
      if (response.data.success) {
        return {
          success: true,
          message: 'Ubicación principal actualizada'
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al actualizar ubicación principal'
      };
    } catch (error) {
      console.error('❌ Error en setUbicacionPrincipal:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  }
};

export default locationService;
