// Servicios de usuarios
import api from './config.js';

export const usersService = {
  // Obtener todos los usuarios (solo administradores)
  getAllUsers: async () => {
    try {
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener usuario por ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Actualizar usuario
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/usuarios/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Actualizar información del perfil
  updateUserInfo: async (id, userInfo) => {
    try {
      const response = await api.put(`/usuarios/update-info/${id}`, userInfo);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Actualizar credenciales (usuario y contraseña)
  updateCredentials: async (id, credentials) => {
    try {
      const response = await api.put(`/usuarios/update-credentials/${id}`, credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Eliminar usuario (solo super administradores)
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};