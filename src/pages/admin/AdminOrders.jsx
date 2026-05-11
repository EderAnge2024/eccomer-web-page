import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { comprobanteService } from '../../services/comprobanteService';
import { ShoppingCart, ChevronDown, ChevronUp, User, Mail, Phone, MapPin, MessageCircle, FileText, Download, Eye, X, CheckCircle, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminOrders.css';

const AdminOrders = () => {
  const { user, isSuperAdmin } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPedido, setExpandedPedido] = useState(null);
  const [filterMode, setFilterMode] = useState('my_products'); // 'my_products' or 'all'

  // Estados para productos del pedido (Sincronizado con App Móvil)
  // Cache de productos por pedido: { id_pedido: [productos] }
  const [productosPedido, setProductosPedido] = useState({});
  // Cache de info detallada de productos: { id_producto: { title, image, ... } }
  const [productosInfo, setProductosInfo] = useState({});
  // Loading de productos por pedido
  const [loadingProductos, setLoadingProductos] = useState({});

  // Estados para comprobante
  const [modalComprobante, setModalComprobante] = useState(false);
  const [comprobanteData, setComprobanteData] = useState(null);
  const [loadingComprobante, setLoadingComprobante] = useState(false);

  useEffect(() => {
    cargarPedidos();
  }, [filterMode]);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      let response;

      if (filterMode === 'all' && isSuperAdmin()) {
        // Opción para super admin de ver absolutamente TODO
        console.log('🌐 Obteniendo todos los pedidos del sistema (Super Admin)');
        response = await orderService.getAllPedidos();
      } else {
        // Lógica de la app: Pedidos que contienen productos del admin
        console.log(`🌐 Obteniendo pedidos con productos del admin: ${user.id_usuario}`);
        response = await orderService.getPedidosByAdmin(user.id_usuario);
      }

      if (response.success) {
        setPedidos(response.pedidos);
      } else {
        toast.error(response.message || 'Error al cargar pedidos');
      }
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      toast.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos de un pedido específico (mismo patrón que App Móvil)
  const cargarProductosPedido = async (id_pedido) => {
    try {
      // Evitar cargar si ya están en memoria
      if (productosPedido[id_pedido]) {
        return;
      }

      setLoadingProductos(prev => ({ ...prev, [id_pedido]: true }));

      const response = await orderService.getProductosByPedido(id_pedido);
      if (response.success) {
        setProductosPedido(prev => ({
          ...prev,
          [id_pedido]: response.productos,
        }));

        // Cargar información detallada de cada producto (nombre, imagen)
        for (const producto of response.productos) {
          if (!productosInfo[producto.id_producto]) {
            cargarInfoProducto(producto.id_producto);
          }
        }
      }
    } catch (error) {
      console.error('Error cargando productos del pedido:', error);
    } finally {
      setLoadingProductos(prev => ({ ...prev, [id_pedido]: false }));
    }
  };

  // Cargar información detallada de un producto (mismo patrón que App Móvil)
  const cargarInfoProducto = async (id_producto) => {
    try {
      // Convertir id_producto a integer (viene como string desde pedido_producto)
      const id_producto_int = parseInt(id_producto, 10);
      const response = await productService.getProductoById(id_producto_int);
      if (response.success && response.producto) {
        setProductosInfo(prev => ({
          ...prev,
          [id_producto]: response.producto,
        }));
      }
    } catch (error) {
      console.error('Error cargando info del producto:', error);
    }
  };

  const cambiarEstadoPedido = async (id_pedido, nuevoEstado) => {
    try {
      const response = await orderService.updateEstadoPedido(id_pedido, nuevoEstado);
      if (response.success) {
        setPedidos(pedidos.map(p =>
          p.id_pedido === id_pedido ? { ...p, estado: nuevoEstado } : p
        ));
        toast.success('Estado actualizado');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Error al actualizar estado');
    }
  };

  const abrirWhatsApp = (telefono, nombre, apellido, id_pedido) => {
    const telefonoLimpio = telefono.replace(/\D/g, '');
    const mensaje = `Hola ${nombre} ${apellido}, te contactamos desde ECommerce Store sobre tu pedido #${id_pedido}.`;
    const whatsappUrl = `https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
  };

  const verComprobante = async (id_pedido) => {
    try {
      setLoadingComprobante(true);
      const response = await comprobanteService.previsualizarComprobante(id_pedido);
      if (response.success) {
        setComprobanteData(response.data);
        setModalComprobante(true);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Error al previsualizar comprobante');
    } finally {
      setLoadingComprobante(false);
    }
  };

  const descargarComprobante = async (id_pedido) => {
    try {
      const response = await comprobanteService.descargarComprobante(id_pedido);
      if (response.success) {
        toast.success('Comprobante descargado');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Error al descargar comprobante');
    }
  };

  const abrirComprobante = async (id_pedido) => {
    try {
      await comprobanteService.abrirComprobante(id_pedido);
    } catch (error) {
      toast.error('Error al abrir comprobante');
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return '#FFA500';
      case 'En proceso':
        return '#2196F3';
      case 'Entregado':
        return '#4CAF50';
      default:
        return '#999';
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Al expandir un pedido, cargar sus productos (mismo patrón que App Móvil)
  const toggleExpandPedido = async (id_pedido) => {
    if (expandedPedido === id_pedido) {
      setExpandedPedido(null);
    } else {
      setExpandedPedido(id_pedido);
      await cargarProductosPedido(id_pedido);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <div className="header-left-orders">
          <ShoppingCart size={32} />
          <h1>Gestión de Pedidos</h1>
        </div>

        {isSuperAdmin() && (
          <div className="order-filter-toggle">
            <button
              className={filterMode === 'my_products' ? 'active' : ''}
              onClick={() => setFilterMode('my_products')}
            >
              Mis Productos
            </button>
            <button
              className={filterMode === 'all' ? 'active' : ''}
              onClick={() => setFilterMode('all')}
            >
              Todos los Pedidos
            </button>
          </div>
        )}
      </div>

      <div className="stats-container-orders">
        <div className="stat-card-order">
          <h3>{pedidos.length}</h3>
          <p>Total Pedidos</p>
        </div>
        <div className="stat-card-order pending">
          <h3>{pedidos.filter(p => p.estado === 'Pendiente').length}</h3>
          <p>Pendientes</p>
        </div>
        <div className="stat-card-order processing">
          <h3>{pedidos.filter(p => p.estado === 'En proceso').length}</h3>
          <p>En Proceso</p>
        </div>
        <div className="stat-card-order delivered">
          <h3>{pedidos.filter(p => p.estado === 'Entregado').length}</h3>
          <p>Entregados</p>
        </div>
      </div>

      {pedidos.length === 0 ? (
        <div className="empty-state">
          <ShoppingCart size={64} color="#ccc" />
          <p>No hay pedidos registrados</p>
        </div>
      ) : (
        <div className="orders-list">
          {pedidos.map((pedido) => {
            const isExpanded = expandedPedido === pedido.id_pedido;
            const estadoActual = pedido.estado || 'Pendiente';
            const productos = productosPedido[pedido.id_pedido] || [];
            const isLoadingProducts = loadingProductos[pedido.id_pedido];

            return (
              <div key={pedido.id_pedido} className="order-card">
                <div className="order-header" onClick={() => toggleExpandPedido(pedido.id_pedido)}>
                  <div className="order-header-left">
                    <h3>Pedido #{pedido.id_pedido}</h3>
                    <p className="order-client">
                      Cliente: {pedido.nombre} {pedido.apellido}
                    </p>
                    <p className="order-date">{formatearFecha(pedido.fecha_pedido)}</p>
                    <span
                      className="order-status-badge"
                      style={{ backgroundColor: getEstadoColor(estadoActual) }}
                    >
                      {estadoActual}
                    </span>
                  </div>
                  <div className="order-header-right">
                    <p className="order-total">S/ {parseFloat(pedido.total).toFixed(2)}</p>
                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="order-details">
                    <div className="order-details-grid">
                      <div className="order-section">
                        <div className="section-header">
                          <User size={20} />
                          <h4>Información del Cliente</h4>
                        </div>
                        <div className="info-row">
                          <User size={16} />
                          <span>{pedido.nombre} {pedido.apellido}</span>
                        </div>
                        <div className="info-row">
                          <Mail size={16} />
                          <span>{pedido.correo}</span>
                        </div>
                        {pedido.usuario_telefono && (
                          <div className="info-row">
                            <Phone size={16} />
                            <span>{pedido.usuario_telefono}</span>
                            <button
                              className="whatsapp-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                abrirWhatsApp(
                                  pedido.usuario_telefono,
                                  pedido.nombre,
                                  pedido.apellido,
                                  pedido.id_pedido
                                );
                              }}
                            >
                              <MessageCircle size={18} />
                            </button>
                          </div>
                        )}
                      </div>

                      {(pedido.ubicacion_direccion || pedido.ubicacion_nombre) && (
                        <div className="order-section">
                          <div className="section-header">
                            <MapPin size={20} />
                            <h4>Dirección de Envío</h4>
                          </div>
                          {pedido.ubicacion_nombre && (
                            <div className="info-row">
                              <MapPin size={16} />
                              <span>{pedido.ubicacion_nombre}</span>
                            </div>
                          )}
                          {pedido.ubicacion_direccion && (
                            <div className="info-row">
                              <MapPin size={16} />
                              <span>{pedido.ubicacion_direccion}</span>
                            </div>
                          )}
                          {pedido.ubicacion_ciudad && (
                            <div className="info-row">
                              <span>
                                {pedido.ubicacion_ciudad}
                                {pedido.ubicacion_codigo_postal && ` - ${pedido.ubicacion_codigo_postal}`}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Productos del Pedido - Filtrados para mostrar SOLO los del vendedor logueado */}
                    <div className="order-products-section">
                      <div className="order-section">
                        <div className="section-header">
                          <Package size={20} />
                          <h4>Mis Productos en este Pedido</h4>
                          <span className="products-count">{productos.filter(p => {
                            const info = productosInfo[p.id_producto];
                            return info?.id_usuario === user.id_usuario;
                          }).length} producto{productos.filter(p => {
                            const info = productosInfo[p.id_producto];
                            return info?.id_usuario === user.id_usuario;
                          }).length !== 1 ? 's' : ''}</span>
                        </div>

                        {isLoadingProducts ? (
                          <div className="products-loading">
                            <div className="spinner-small"></div>
                            <p>Cargando productos...</p>
                          </div>
                        ) : productos.length > 0 ? (
                          <>
                            <table className="products-table">
                              <thead>
                                <tr>
                                  <th>Producto</th>
                                  <th>Cant.</th>
                                  <th>Precio Unit.</th>
                                  <th>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {productos
                                  .filter(p => {
                                    const info = productosInfo[p.id_producto];
                                    return info?.id_usuario === user.id_usuario;
                                  })
                                  .map((prod, idx) => {
                                    const info = productosInfo[prod.id_producto];
                                    return (
                                      <tr key={idx}>
                                        <td>
                                          <div className="product-row-info">
                                            {info?.image ? (
                                              <img
                                                src={info.image}
                                                alt={info.title}
                                                className="product-row-image"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                              />
                                            ) : (
                                              <div className="product-row-image-placeholder">
                                                <Package size={20} color="#ccc" />
                                              </div>
                                            )}
                                            <div>
                                              <div className="product-row-name">
                                                {info?.title || `Producto #${prod.id_producto}`}
                                              </div>
                                              {info?.category && (
                                                <div className="product-row-category">
                                                  {info.category}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </td>
                                        <td>{prod.cantidad}</td>
                                        <td>S/ {parseFloat(prod.precio).toFixed(2)}</td>
                                        <td className="product-subtotal">S/ {(prod.cantidad * parseFloat(prod.precio)).toFixed(2)}</td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
                            <div className="products-total-row">
                              <span>Total de mis productos: S/ {productos
                                .filter(p => {
                                  const info = productosInfo[p.id_producto];
                                  return info?.id_usuario === user.id_usuario;
                                })
                                .reduce((sum, p) => sum + (p.cantidad * parseFloat(p.precio)), 0).toFixed(2)}</span>
                            </div>
                          </>
                        ) : (
                          <p className="products-empty">No hay productos de tu propiedad en este pedido</p>
                        )}
                      </div>
                    </div>

                    <div className="order-actions-section">
                      <div className="order-section">
                        <h4>Cambiar Estado:</h4>
                        <div className="status-buttons">
                          {['Pendiente', 'En proceso', 'Entregado'].map((estado) => (
                            <button
                              key={estado}
                              className={`status-btn ${estadoActual === estado ? 'active' : ''}`}
                              style={{
                                borderColor: getEstadoColor(estado),
                                backgroundColor: estadoActual === estado ? getEstadoColor(estado) : 'transparent',
                                color: estadoActual === estado ? 'white' : getEstadoColor(estado)
                              }}
                              onClick={() => cambiarEstadoPedido(pedido.id_pedido, estado)}
                            >
                              {estado}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="order-section">
                        <h4>Comprobante de Venta:</h4>
                        <div className="comprobante-buttons">
                          <button
                            className="comprobante-btn preview"
                            onClick={() => verComprobante(pedido.id_pedido)}
                            disabled={loadingComprobante}
                          >
                            <Eye size={20} />
                            Previsualizar
                          </button>
                          <button
                            className="comprobante-btn download"
                            onClick={() => descargarComprobante(pedido.id_pedido)}
                          >
                            <Download size={20} />
                            Descargar
                          </button>
                          <button
                            className="comprobante-btn open"
                            onClick={() => abrirComprobante(pedido.id_pedido)}
                          >
                            <FileText size={20} />
                            Abrir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Comprobante Preview */}
      {modalComprobante && comprobanteData && (
        <div className="modal-overlay" onClick={() => setModalComprobante(false)}>
          <div className="modal-container-comprobante" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><CheckCircle size={24} color="#4CAF50" style={{ marginRight: '10px' }} /> Comprobante de Pago</h2>
              <button className="modal-close" onClick={() => setModalComprobante(false)}><X /></button>
            </div>

            <div className="modal-content">
              <div className="comprobante-preview-web">
                <div className="comprobante-header-web">
                  <h3>ECOMMERCE STORE</h3>
                  <p>COMPROBANTE DE PAGO</p>
                  <div className="pedido-num">Nº Pedido: #{comprobanteData.pedido.id_pedido}</div>
                </div>

                <div className="comprobante-section-web">
                  <p className="section-title-web">CLIENTE</p>
                  <p>{comprobanteData.cliente.nombre} {comprobanteData.cliente.apellido}</p>
                  <p>{comprobanteData.cliente.correo}</p>
                  <p>{comprobanteData.cliente.telefono}</p>
                </div>

                <div className="comprobante-section-web">
                  <p className="section-title-web">DETALLE DEL PEDIDO</p>
                  <table className="comprobante-table-web">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cant.</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comprobanteData.productos.map((prod, idx) => (
                        <tr key={idx}>
                          <td>{prod.title}</td>
                          <td>{prod.cantidad}</td>
                          <td>S/ {(prod.cantidad * prod.precio).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="comprobante-total-web">
                  <span>TOTAL</span>
                  <span>S/ {parseFloat(comprobanteData.pedido.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer-comprobante">
              <button className="btn-secondary-comprobante" onClick={() => descargarComprobante(comprobanteData.pedido.id_pedido)}>
                <Download size={18} /> Descargar PDF
              </button>
              <button className="btn-primary-comprobante" onClick={() => setModalComprobante(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;