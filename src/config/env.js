// Configuración centralizada de variables de entorno para React Web

export const ENV_CONFIG = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // App Configuration
  APP_NAME: import.meta.env.VITE_APP_NAME || 'TiendaEcommerce Web',
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  
  // Debug Configuration
  DEBUG_MODE: import.meta.env.VITE_DEBUG_MODE === 'true',
  
  // Helper functions
  isDevelopment: () => ENV_CONFIG.NODE_ENV === 'development',
  isProduction: () => ENV_CONFIG.NODE_ENV === 'production',
  
  // Log configuration
  logConfig: () => {
    if (ENV_CONFIG.DEBUG_MODE && ENV_CONFIG.isDevelopment()) {
      console.log('🌐 Web App Configuration:');
      console.log('  - App Name:', ENV_CONFIG.APP_NAME);
      console.log('  - Environment:', ENV_CONFIG.NODE_ENV);
      console.log('  - API URL:', ENV_CONFIG.API_BASE_URL);
      console.log('  - Debug Mode:', ENV_CONFIG.DEBUG_MODE);
    }
  }
};

// Log configuration on import
ENV_CONFIG.logConfig();

export default ENV_CONFIG;