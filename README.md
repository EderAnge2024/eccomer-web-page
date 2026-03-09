# TiendaEcommerce - Frontend Web 🌐

Plataforma e-commerce moderna y ultra-rápida desarrollada con **React 19 + Vite**, diseñada con un sistema de estilos puro (**CSS Vanilla**) para máximo rendimiento y personalización.

## 🚀 Características Destacadas

- **Rendimiento SPA**: Navegación instantánea y fluida.
- **Arquitectura de Contexto**: Gestión de estado centralizada para Autenticación y Carrito.
- **Diseño Adaptativo**: Experiencia optimizada para Desktop, Tablet y Móvil.
- **Seguridad Integrada**: Integración nativa con tokens JWT y protección de rutas.
- **Visuales Premium**: Micro-animaciones y paleta de colores curada para una experiencia de usuario superior.

## 🛠️ Guía de Inicio

### Requisitos
- Node.js 18+
- Backend activo en `http://localhost:3000`

### Instalación
1. **Entrar al directorio**:
   ```bash
   cd frontend/tiendaEcomerce
   ```
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Variables de Entorno**:
   Crea un archivo `.env` con:
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_APP_NAME=TiendaEcommerce
   ```
4. **Desarrollo**:
   ```bash
   npm run dev
   ```

## 📁 Estructura del Sistema

- `src/components/`: Piezas de UI reutilizables (Headers, Cards, Loaders).
- `src/context/`: Lógica central de Auth y Carrito persistente.
- `src/pages/`: Vistas principales (Home, Catálogo, Login, Panel Admin).
- `src/services/`: Capa de abstracción para peticiones a la API.
- `src/index.css`: Sistema de diseño basado en variables y utilidades CSS.

## 🎨 Design System

Elegancia y claridad:
- **Azul Primario**: `#2563eb` - Acciones principales.
- **Gris Slate**: `#64748b` - Tipografía y jerarquía.
- **Emerald Green**: `#10b981` - Éxito y confirmaciones.

## 👨‍💼 Panel de Administración

El sistema incluye un tablero de control avanzado para administradores:
- **Gestión de Stock**: CRUD completo de productos en tiempo real.
- **Control de Pedidos**: Seguimiento detallado de ventas y logistica.
- **Visión de Usuarios**: Gestión de la base de clientes registrada.

---

## 📈 Próximos Pasos (Roadmap)
- [ ] Implementación de Pasarela de Pagos.
- [ ] Sistema de Notificaciones Push.
- [ ] Soporte Multi-lenguaje (i18n).

**Comprometidos con la excelencia en el desarrollo web.** ✨
icar que index.css se esté cargando
- Revisar la consola del navegador por errores CSS
- Verificar que las clases CSS estén correctamente aplicadas

## 📞 Soporte

Para reportar problemas o solicitar nuevas características, crear un issue en el repositorio del proyecto.