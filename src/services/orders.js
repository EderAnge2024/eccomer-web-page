// Servicios de pedidos
import api from './config.js';

export const ordersService = {
  // Crear pedido simple
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/pedidos', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Crear pedido multi-vendedor
  createMultiVendorOrder: async (orderData) => {
    try {
      const response = await api.post('/pedidos/multi-vendor', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Preview de división por vendedor
  previewOrderDivision: async (products) => {
    try {
      const response = await api.post('/pedidos/preview-division', { productos: products });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener todos los pedidos (solo administradores)
  getAllOrders: async () => {
    try {
      const response = await api.get('/pedidos');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener pedido por ID
  getOrderById: async (id) => {
    try {
      const response = await api.get(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener pedidos por usuario
  getOrdersByUser: async (userId) => {
    try {
      const response = await api.get(`/pedidos/usuario/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener pedidos por administrador/vendedor
  getOrdersByAdmin: async (adminId) => {
    try {
      const response = await api.get(`/pedidos/admin/${adminId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener pedidos por vendedor
  getOrdersByVendor: async (vendorId) => {
    try {
      const response = await api.get(`/pedidos/vendedor/${vendorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener resumen de pedido maestro
  getMasterOrderSummary: async (masterOrderId) => {
    try {
      const response = await api.get(`/pedidos/maestro/${masterOrderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Actualizar pedido
  updateOrder: async (id, orderData) => {
    try {
      const response = await api.put(`/pedidos/${id}`, orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Actualizar estado del pedido (solo administradores)
  updateOrderStatus: async (id, status) => {
    try {
      const response = await api.put(`/pedidos/${id}/estado`, { estado: status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Eliminar pedido (solo administradores)
  deleteOrder: async (id) => {
    try {
      const response = await api.delete(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Obtener notificaciones de pedidos
  getOrderNotifications: async (userId, onlyUnread = false) => {
    try {
      const response = await api.get(`/pedidos/notificaciones/${userId}`, {
        params: { solo_no_leidas: onlyUnread }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Marcar notificación como leída
  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/pedidos/notificaciones/${notificationId}/leer`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};