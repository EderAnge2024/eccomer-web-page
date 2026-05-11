// Servicio de autenticación
import api from './api.js';

export const authService = {
  // Login
  async login(usuario, contrasena) {
    try {
      const response = await api.post('/usuarios/login', {
        usuario,
        contrasena
      });
      
      if (response.data.success) {
        const userData = response.data.data?.user || response.data.user;
        const tokens = response.data.data?.tokens || response.data.tokens;
        
        // Guardar en localStorage
        if (tokens?.accessToken) {
          localStorage.setItem('token', tokens.accessToken);
        }
        localStorage.setItem('user', JSON.stringify(userData));
        
        return {
          success: true,
          user: userData,
          tokens
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error en login'
      };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  // Register
  async register(userData) {
    try {
      const response = await api.post('/usuarios/register', userData);
      
      if (response.data.success) {
        return {
          success: true,
          message: 'Usuario registrado exitosamente'
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error en registro'
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  // Recuperación de Contraseña
  async requestCode(correo) {
    try {
      const response = await api.post('/usuarios/request-code', { correo });
      return response.data;
    } catch (error) {
      console.error('Error al solicitar código:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al enviar el código'
      };
    }
  },

  async verifyCodeAndResetPassword(correo, codigo, nuevaContrasena) {
    try {
      const response = await api.post('/usuarios/verify-code-reset', {
        correo,
        codigo,
        nuevaContrasena
      });
      return response.data;
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al restablecer contraseña'
      };
    }
  },

  // Logout
  async logout() {
    try {
      // Llamar al backend para limpiar cookies
      await api.post('/usuarios/logout');
    } catch (error) {
      console.error('⚠️ Error al cerrar sesión en el servidor:', error);
    } finally {
      // Siempre limpiar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = this.getCurrentUser();
    return !!(token && user);
  },

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.rol === 'administrador';
  },

  // Check if user is super admin
  isSuperAdmin() {
    const user = this.getCurrentUser();
    return user?.es_super_admin === true;
  },

  // Obtener usuario por ID (para info de vendedores en pedidos)
  async getUserById(userId) {
    try {
      const response = await api.get(`/usuarios/${userId}`);
      if (response.data.success) {
        return {
          success: true,
          usuario: response.data.usuario || response.data.user
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('❌ Error en getUserById:', error);
      return { success: false, message: 'Error de conexión' };
    }
  }
};