// Servicio de usuarios - Compatible con backend
import api from './api.js';

export const userService = {
  // Obtener todos los usuarios (solo super admin)
  async getAllUsers() {
    try {
      console.log('🌐 GET /usuarios');
      const response = await api.get('/usuarios');
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al cargar usuarios'
      };
    } catch (error) {
      console.error('❌ Error en getAllUsers:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión',
        data: { users: [] }
      };
    }
  },

  // Actualizar usuario
  async updateUser(id, userData) {
    try {
      console.log(`🌐 PUT /usuarios/${id}`, userData);
      const response = await api.put(`/usuarios/${id}`, userData);
      
      if (response.data.success) {
        return {
          success: true,
          user: response.data.user,
          message: 'Usuario actualizado exitosamente'
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al actualizar usuario'
      };
    } catch (error) {
      console.error('❌ Error en updateUser:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  // Promover usuario a administrador (solo super admin)
  async promoteToAdmin(id) {
    try {
      console.log(`🌐 PUT /usuarios/promote-admin/${id}`);
      const response = await api.put(`/usuarios/promote-admin/${id}`);
      
      if (response.data.success) {
        return {
          success: true,
          user: response.data.user,
          message: 'Usuario promovido a administrador'
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al promover usuario'
      };
    } catch (error) {
      console.error('❌ Error en promoteToAdmin:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  // Degradar administrador a cliente (solo super admin)
  async demoteAdmin(id) {
    try {
      console.log(`🌐 PUT /usuarios/demote-admin/${id}`);
      const response = await api.put(`/usuarios/demote-admin/${id}`);
      
      if (response.data.success) {
        return {
          success: true,
          user: response.data.user,
          message: 'Administrador degradado a cliente'
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al degradar administrador'
      };
    } catch (error) {
      console.error('❌ Error en demoteAdmin:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  }
};

export default userService;
