# TiendaEcommerce Frontend

Frontend de la aplicación de e-commerce desarrollado con React + Vite y CSS vanilla.

## 🚀 Características

- **React 19** con Vite para desarrollo rápido
- **CSS Vanilla** - Sin dependencias de CSS frameworks
- **Autenticación JWT** - Login/registro seguro
- **Carrito de compras** - Persistente en localStorage
- **Panel de administración** - Gestión completa de productos, pedidos y usuarios
- **Responsive Design** - Adaptable a todos los dispositivos
- **Navegación SPA** - Sin recarga de página

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Header.jsx      # Navegación principal
│   └── ProductCard.jsx # Tarjeta de producto
├── context/            # Context providers
│   ├── AuthContext.jsx # Gestión de autenticación
│   └── CartContext.jsx # Gestión del carrito
├── pages/              # Páginas principales
│   ├── Home.jsx        # Página de inicio
│   ├── Products.jsx    # Catálogo de productos
│   ├── Login.jsx       # Inicio de sesión
│   ├── Register.jsx    # Registro de usuarios
│   ├── Cart.jsx        # Carrito de compras
│   ├── Profile.jsx     # Perfil del usuario
│   └── AdminPanel.jsx  # Panel de administración
├── services/           # Servicios API
│   └── api.js         # Cliente API centralizado
├── App.jsx            # Componente principal
├── main.jsx           # Punto de entrada
└── index.css          # Estilos globales
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Backend ejecutándose en http://localhost:3000

### Instalación

1. **Navegar al directorio del frontend:**
   ```bash
   cd frontend/tiendaEcomerce
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   ```bash
   # .env
   VITE_API_URL=http://localhost:3000
   VITE_APP_NAME=TiendaEcommerce
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador:**
   ```
   http://localhost:5173
   ```

## 🎨 Características de Diseño

### Sistema de Colores
- **Primario:** #2563eb (Azul)
- **Secundario:** #64748b (Gris)
- **Éxito:** #10b981 (Verde)
- **Peligro:** #ef4444 (Rojo)
- **Advertencia:** #f59e0b (Amarillo)

### Componentes CSS
- **Botones:** `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`
- **Tarjetas:** `.card`, `.card-header`, `.card-body`, `.card-footer`
- **Formularios:** `.form-group`, `.form-label`, `.form-input`
- **Grid:** `.products-grid`, `.container`
- **Utilidades:** `.text-center`, `.font-bold`, `.spinner`

## 🔐 Autenticación

### Context de Autenticación
```jsx
const { user, login, register, logout, loading } = useAuth()
```

### Funciones Disponibles
- `login(email, password)` - Iniciar sesión
- `register(userData)` - Registrar usuario
- `logout()` - Cerrar sesión
- `user` - Datos del usuario actual
- `loading` - Estado de carga

## 🛒 Carrito de Compras

### Context del Carrito
```jsx
const { 
  cartItems, 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  getCartTotal,
  getCartItemsCount 
} = useCart()
```

### Persistencia
- Los datos del carrito se guardan automáticamente en `localStorage`
- Se restauran al recargar la aplicación

## 👤 Roles de Usuario

### Cliente
- Ver productos
- Agregar al carrito
- Realizar pedidos
- Ver historial de pedidos
- Gestionar perfil

### Administrador
- Todas las funciones de cliente
- Gestionar productos (CRUD)
- Ver todos los pedidos
- Ver todos los usuarios
- Acceso al panel de administración

## 🌐 API Integration

### Endpoints Utilizados
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/auth/verify` - Verificar token
- `GET /api/productos` - Obtener productos
- `POST /api/productos` - Crear producto (admin)
- `PUT /api/productos/:id` - Actualizar producto (admin)
- `DELETE /api/productos/:id` - Eliminar producto (admin)
- `GET /api/pedidos` - Obtener pedidos (admin)
- `GET /api/pedidos/mis-pedidos` - Pedidos del usuario
- `POST /api/pedidos` - Crear pedido
- `GET /api/usuarios` - Obtener usuarios (admin)

## 📱 Responsive Design

### Breakpoints
- **Desktop:** > 768px
- **Mobile:** ≤ 768px

### Adaptaciones Móviles
- Header colapsable
- Grid de productos adaptativo
- Formularios optimizados
- Carrito responsive

## 🚀 Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Vista previa de producción
npm run preview

# Linting
npm run lint
```

## 🔧 Configuración de Vite

El proyecto utiliza la configuración estándar de Vite con:
- Plugin de React
- Hot Module Replacement (HMR)
- Optimización automática de dependencias

## 📦 Dependencias

### Dependencias de Producción
- `react` - Biblioteca de UI
- `react-dom` - Renderizado DOM

### Dependencias de Desarrollo
- `vite` - Herramienta de construcción
- `@vitejs/plugin-react` - Plugin de React para Vite
- `eslint` - Linter de JavaScript

## 🎯 Características Implementadas

✅ **Autenticación completa**
- Login/registro con validación
- Gestión de tokens JWT
- Protección de rutas

✅ **Catálogo de productos**
- Listado con filtros y búsqueda
- Ordenamiento por precio/nombre
- Paginación automática

✅ **Carrito de compras**
- Agregar/quitar productos
- Actualizar cantidades
- Persistencia local
- Cálculo de totales

✅ **Gestión de pedidos**
- Crear pedidos
- Historial de compras
- Estados de pedido

✅ **Panel de administración**
- CRUD de productos
- Gestión de pedidos
- Lista de usuarios

✅ **Diseño responsive**
- Adaptable a móviles
- CSS Grid y Flexbox
- Componentes reutilizables

## 🔮 Próximas Mejoras

- [ ] Implementar React Router para URLs amigables
- [ ] Agregar sistema de notificaciones
- [ ] Implementar filtros avanzados
- [ ] Agregar sistema de reseñas
- [ ] Implementar chat de soporte
- [ ] Optimización de imágenes
- [ ] PWA (Progressive Web App)

## 🐛 Solución de Problemas

### Error de conexión con el backend
- Verificar que el backend esté ejecutándose en http://localhost:3000
- Revisar la configuración de CORS en el backend
- Verificar las variables de entorno

### Problemas de autenticación
- Limpiar localStorage: `localStorage.clear()`
- Verificar que el token JWT sea válido
- Revisar la configuración del backend

### Problemas de estilo
- Verificar que index.css se esté cargando
- Revisar la consola del navegador por errores CSS
- Verificar que las clases CSS estén correctamente aplicadas

## 📞 Soporte

Para reportar problemas o solicitar nuevas características, crear un issue en el repositorio del proyecto.