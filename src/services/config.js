// Configuración de la API
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

// Configuración base de la API
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(import.meta.env.VITE_JWT_STORAGE_KEY);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log de requests en desarrollo
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar responses y errores
api.interceptors.response.use(
  (response) => {
    // Log de responses exitosas en desarrollo
    if (import.meta.env.VITE_NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    
    // Verificar si el token está próximo a expirar
    if (response.headers['x-token-expiring']) {
      console.warn('⚠️ Token expiring soon, consider refreshing');
      // Aquí podrías implementar refresh automático del token
    }
    
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    
    // Manejar errores específicos
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token inválido o expirado
          Cookies.remove(import.meta.env.VITE_JWT_STORAGE_KEY);
          Cookies.remove(import.meta.env.VITE_REFRESH_TOKEN_KEY);
          toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
          
          // Redirigir al login si no estamos ya ahí
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
          
        case 403:
          toast.error('No tienes permisos para realizar esta acción.');
          break;
          
        case 404:
          toast.error('Recurso no encontrado.');
          break;
          
        case 429:
          toast.error('Demasiadas solicitudes. Por favor, espera un momento.');
          break;
          
        case 500:
          toast.error('Error interno del servidor. Por favor, intenta más tarde.');
          break;
          
        default:
          toast.error(data?.message || 'Ha ocurrido un error inesperado.');
      }
    } else if (error.request) {
      // Error de red
      toast.error('Error de conexión. Verifica tu conexión a internet.');
    } else {
      // Error de configuración
      toast.error('Error de configuración de la aplicación.');
    }
    
    return Promise.reject(error);
  }
);

export default api;