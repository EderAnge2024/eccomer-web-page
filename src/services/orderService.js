// Servicio de pedidos - Compatible con backend
import api from './api.js';

export const orderService = {
  // Crear pedido multi-vendedor
  async createPedidoMultiVendedor(pedidoData) {
    try {
      console.log('🌐 POST /pedidos/multi-vendedor', pedidoData);
      const response = await api.post('/pedidos/multi-vendedor', pedidoData);

      if (response.data.success) {
        return {
          success: true,
          resultado: response.data.resultado,
          message: response.data.message || 'Pedido creado exitosamente'
        };
      }

      return {
        success: false,
        message: response.data.message || 'Error al crear pedido'
      };
    } catch (error) {
      console.error('❌ Error en createPedidoMultiVendedor:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  // Obtener pedidos por usuario (cliente)
  async getPedidosByUser(userId) {
    try {
      console.log(`🌐 GET /pedidos/usuario/${userId}`);
      const response = await api.get(`/pedidos/usuario/${userId}`);

      if (response.data.success) {
        return {
          success: true,
          pedidos: response.data.pedidos || []
        };
      }

      return {
        success: false,
        message: response.data.message || 'Error al cargar pedidos'
      };
    } catch (error) {
      console.error('❌ Error en getPedidosByUser:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión',
        pedidos: []
      };
    }
  },

  // Obtener pedidos por vendedor (administrador)
  async getPedidosByVendedor(vendedorId) {
    try {
      console.log(`🌐 GET /pedidos/vendedor/${vendedorId}`);
      const response = await api.get(`/pedidos/vendedor/${vendedorId}`);

      if (response.data.success) {
        return {
          success: true,
          pedidos: response.data.pedidos || []
        };
      }

      return {
        success: false,
        message: response.data.message || 'Error al cargar pedidos'
      };
    } catch (error) {
      console.error('❌ Error en getPedidosByVendedor:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión',
        pedidos: []
      };
    }
  },

  // Obtener pedidos que contienen productos de un administrador (Sincronizado con App Móvil)
  async getPedidosByAdmin(adminId) {
    try {
      console.log(`🌐 GET /pedidos/admin/${adminId}`);
      const response = await api.get(`/pedidos/admin/${adminId}`);

      if (response.data.success) {
        return {
          success: true,
          pedidos: response.data.pedidos || []
        };
      }

      return {
        success: false,
        message: response.data.message || 'Error al cargar pedidos del admin'
      };
    } catch (error) {
      console.error('❌ Error en getPedidosByAdmin:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión',
        pedidos: []
      };
    }
  },

  // Actualizar estado de pedido
  async updateEstadoPedido(pedidoId, estado) {
    try {
      console.log(`🌐 PUT /pedidos/${pedidoId}/estado`, { estado });
      const response = await api.put(`/pedidos/${pedidoId}/estado`, { estado });

      if (response.data.success) {
        return {
          success: true,
          pedido: response.data.pedido,
          message: 'Estado actualizado exitosamente'
        };
      }

      return {
        success: false,
        message: response.data.message || 'Error al actualizar estado'
      };
    } catch (error) {
      console.error('❌ Error en updateEstadoPedido:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  // Obtener detalles de pedido
  async getPedidoById(pedidoId) {
    try {
      console.log(`🌐 GET /pedidos/${pedidoId}`);
      const response = await api.get(`/pedidos/${pedidoId}`);

      if (response.data.success) {
        return {
          success: true,
          pedido: response.data.pedido
        };
      }

      return {
        success: false,
        message: response.data.message || 'Pedido no encontrado'
      };
    } catch (error) {
      console.error('❌ Error en getPedidoById:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  }
};

export default orderService;
