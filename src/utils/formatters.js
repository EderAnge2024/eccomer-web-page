// Utilidades para formatear datos

// Formatear precio en pesos colombianos
export const formatPrice = (price) => {
  if (typeof price !== 'number') {
    price = parseFloat(price) || 0;
  }
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// Formatear fecha
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
};

// Formatear fecha corta
export const formatDateShort = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(dateObj);
};

// Formatear fecha relativa (hace X tiempo)
export const formatRelativeDate = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const dateObj = new Date(date);
  const diffInSeconds = Math.floor((now - dateObj) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Hace unos segundos';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  }
  
  return formatDateShort(date);
};

// Formatear número con separadores de miles
export const formatNumber = (number) => {
  if (typeof number !== 'number') {
    number = parseFloat(number) || 0;
  }
  
  return new Intl.NumberFormat('es-CO').format(number);
};

// Truncar texto
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength).trim() + '...';
};

// Capitalizar primera letra
export const capitalize = (text) => {
  if (!text) return '';
  
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Formatear nombre completo
export const formatFullName = (firstName, lastName) => {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.join(' ');
};

// Formatear teléfono
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remover caracteres no numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Formatear según longitud
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  }
  
  return phone;
};

// Formatear estado del pedido
export const formatOrderStatus = (status) => {
  const statusMap = {
    'Pendiente': { text: 'Pendiente', color: 'yellow' },
    'En proceso': { text: 'En Proceso', color: 'blue' },
    'Entregado': { text: 'Entregado', color: 'green' }
  };
  
  return statusMap[status] || { text: status, color: 'gray' };
};

// Formatear rol de usuario
export const formatUserRole = (role) => {
  const roleMap = {
    'cliente': 'Cliente',
    'administrador': 'Administrador'
  };
  
  return roleMap[role] || role;
};

// Generar iniciales de nombre
export const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  
  return first + last || '?';
};

// Formatear tamaño de archivo
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Validar y formatear URL de imagen
export const formatImageUrl = (url, fallback = '/placeholder-image.jpg') => {
  if (!url) return fallback;
  
  // Si es una URL completa, devolverla tal como está
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Si es una ruta relativa, agregar el dominio base
  if (url.startsWith('/')) {
    return url;
  }
  
  return fallback;
};