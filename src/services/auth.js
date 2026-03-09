// Servicios de autenticación
import api from './config.js';
import Cookies from 'js-cookie';

const TOKEN_KEY = import.meta.env.VITE_JWT_STORAGE_KEY;
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY;

export const authService = {
  // Registro de usuario
  register: async (userData) => {
    try {
      const response = await api.post('/usuarios/register', userData);
      
      if (response.data.success && response.data.data.tokens) {
        const { accessToken, refreshToken } = response.data.data.tokens;
        
        // Guardar tokens en cookies seguras
        Cookies.set(TOKEN_KEY, accessToken, { 
          expires: 1, // 1 día
          secure: import.meta.env.PROD,
          sameSite: 'strict'
        });
        
        Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { 
          expires: 7, // 7 días
          secure: import.meta.env.PROD,
          sameSite: 'strict'
        });
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Login de usuario
  login: async (credentials) => {
    try {
      const response = await api.post('/usuarios/login', credentials);
      
      if (response.data.success && response.data.data.tokens) {
        const { accessToken, refreshToken } = response.data.data.tokens;
        
        // Guardar tokens en cookies seguras
        Cookies.set(TOKEN_KEY, accessToken, { 
          expires: 1, // 1 día
          secure: import.meta.env.PROD,
          sameSite: 'strict'
        });
        
        Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { 
          expires: 7, // 7 días
          secure: import.meta.env.PROD,
          sameSite: 'strict'
        });
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Logout
  logout: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    
    // Limpiar cualquier dato del usuario en localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    
    // Redirigir al login
    window.location.href = '/login';
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    return !!Cookies.get(TOKEN_KEY);
  },

  // Obtener token actual
  getToken: () => {
    return Cookies.get(TOKEN_KEY);
  },

  // Obtener refresh token
  getRefreshToken: () => {
    return Cookies.get(REFRESH_TOKEN_KEY);
  },

  // Solicitar código de recuperación
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/usuarios/request-code', { correo: email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verificar código y resetear contraseña
  resetPassword: async (email, code, newPassword) => {
    try {
      const response = await api.post('/usuarios/verify-code-reset', {
        correo: email,
        codigo: code,
        nuevaContrasena: newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verificar email
  verifyEmail: async (email) => {
    try {
      const response = await api.post('/usuarios/verify-email', { correo: email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};