// Servicio de pedidos - Compatible con backend
import api from './api.js';

export const orderService = {
  // Crear pedido multi-vendedor
  async createPedidoMultiVendedor(pedidoData) {
    try {
      console.log('🌐 POST /pedidos/multi-vendor', pedidoData);
      const response = await api.post('/pedidos/multi-vendor', pedidoData);

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

  // Obtener TODOS los pedidos del sistema (Solo superadmin)
  async getAllPedidos() {
    try {
      console.log('🌐 GET /pedidos (todos)');
      const response = await api.get('/pedidos');

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
      console.error('❌ Error en getAllPedidos:', error);
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

  // Obtener productos de un pedido específico (Sincronizado con App Móvil)
  async getProductosByPedido(idPedido) {
    try {
      console.log(`🌐 GET /pedido-productos/pedido/${idPedido}`);
      const response = await api.get(`/pedido-productos/pedido/${idPedido}`);

      if (response.data.success) {
        return {
          success: true,
          productos: response.data.productos || []
        };
      }

      return {
        success: false,
        message: response.data.message || 'Error al cargar productos del pedido',
        productos: []
      };
    } catch (error) {
      console.error('❌ Error en getProductosByPedido:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión',
        productos: []
      };
    }
  },

  // Obtener detalles de pedido maestro (incluye sub-pedidos y productos)
  async getPedidoMaestroById(pedidoId) {
    try {
      console.log(`🌐 GET /pedidos/maestro/${pedidoId}`);
      const response = await api.get(`/pedidos/maestro/${pedidoId}`);

      if (response.data.success) {
        return {
          success: true,
          resumen: response.data.resumen
        };
      }

      return {
        success: false,
        message: response.data.message || 'Pedido no encontrado'
      };
    } catch (error) {
      console.error('❌ Error en getPedidoMaestroById:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  }
};

export default orderService;