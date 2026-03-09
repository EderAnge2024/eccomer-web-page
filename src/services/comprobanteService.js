// Servicio de comprobantes - Compatible con backend
import api from './api.js';
import { ENV_CONFIG } from '../config/env.js';

export const comprobanteService = {
  // Previsualizar datos del comprobante
  async previsualizarComprobante(id_pedido) {
    try {
      console.log(`🌐 GET /comprobantes/preview/${id_pedido}`);
      const response = await api.get(`/comprobantes/preview/${id_pedido}`);
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        };
      }
      
      return {
        success: false,
        message: response.data.message || 'Error al obtener datos del comprobante'
      };
    } catch (error) {
      console.error('❌ Error en previsualizarComprobante:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error de conexión'
      };
    }
  },

  // Generar y descargar comprobante PDF
  async descargarComprobante(id_pedido) {
    try {
      const token = localStorage.getItem('token');
      const url = `${ENV_CONFIG.API_BASE_URL}/comprobantes/generar/${id_pedido}`;
      
      console.log('🌐 Descargando comprobante:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `comprobante-${id_pedido}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
        return {
          success: true,
          message: 'Comprobante descargado exitosamente'
        };
      }
      
      return {
        success: false,
        message: 'Error al descargar comprobante'
      };
    } catch (error) {
      console.error('❌ Error en descargarComprobante:', error);
      return {
        success: false,
        message: 'Error al descargar comprobante'
      };
    }
  },

  // Abrir comprobante en nueva pestaña
  async abrirComprobante(id_pedido) {
    try {
      const token = localStorage.getItem('token');
      const url = `${ENV_CONFIG.API_BASE_URL}/comprobantes/generar-url/${id_pedido}?token=${token}`;
      
      console.log('🌐 Abriendo comprobante:', url);
      window.open(url, '_blank');
      
      return {
        success: true,
        message: 'Comprobante abierto en nueva pestaña'
      };
    } catch (error) {
      console.error('❌ Error en abrirComprobante:', error);
      return {
        success: false,
        message: 'Error al abrir comprobante'
      };
    }
  }
};

export default comprobanteService;
