// Página de Perfil de Usuario
import React, { useState, useEffect } from 'react';
import { User, MapPin, Package, Settings, LogOut, Plus, Edit2, Trash2, Check, Phone, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { locationService } from '../services/locationService';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import './Profile.css';

const Profile = ({ onNavigate }) => {
  const { user, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [ubicaciones, setUbicaciones] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUbicacionModal, setShowUbicacionModal] = useState(false);
  const [showPedidoModal, setShowPedidoModal] = useState(false);
  const [editingUbicacion, setEditingUbicacion] = useState(null);
  const [pedidoDetallado, setPedidoDetallado] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  // Cache de info detallada de productos: { id_producto: { title, image, id_usuario, ... } }
  // (Sincronizado con App Móvil)
  const [productosInfo, setProductosInfo] = useState({});
  // Cache de info de vendedores: { id_usuario: { nombre, apellido, telefono, ... } }
  const [vendedoresInfo, setVendedoresInfo] = useState({});
  
  // Form state para ubicación
  const [ubicacionForm, setUbicacionForm] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    codigo_postal: '',
    telefono: '',
    es_principal: false
  });

  useEffect(() => {
    if (user?.id_usuario) {
      cargarUbicaciones();
      cargarPedidos();
    }
  }, [user]);

  const cargarUbicaciones = async () => {
    try {
      setLoading(true);
      const response = await locationService.getUbicacionesByUser(user.id_usuario);
      
      if (response.success) {
        setUbicaciones(response.ubicaciones || []);
      }
    } catch (error) {
      console.error('Error cargando ubicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const response = await orderService.getPedidosByUser(user.id_usuario);
      
      if (response.success) {
        setPedidos(response.pedidos || []);
      }
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar información detallada de un producto (mismo patrón que App Móvil)
  const cargarInfoProducto = async (id_producto) => {
    try {
      const id_producto_int = parseInt(id_producto, 10);
      const response = await productService.getProductoById(id_producto_int);
      if (response.success && response.producto) {
        setProductosInfo(prev => ({
          ...prev,
          [id_producto]: response.producto,
        }));
        return response.producto;
      }
    } catch (error) {
      console.error('Error cargando info del producto:', error);
    }
    return null;
  };

  // Cargar info de un vendedor por ID
  const cargarInfoVendedor = async (id_vendedor) => {
    if (vendedoresInfo[id_vendedor]) return vendedoresInfo[id_vendedor];
    try {
      const response = await authService.getUserById(id_vendedor);
      if (response.success && response.usuario) {
        setVendedoresInfo(prev => ({ ...prev, [id_vendedor]: response.usuario }));
        return response.usuario;
      }
    } catch (error) {
      console.error('Error cargando info del vendedor:', error);
    }
    return null;
  };

  // Agrupar productos por vendedor usando la info de producto.id_usuario
  const agruparProductosPorVendedor = (productos) => {
    const grupos = productos.reduce((acumulador, prod) => {
      const info = productosInfo[prod.id_producto];
      const vendedorId = info?.id_usuario || 'desconocido';
      
      if (!acumulador[vendedorId]) {
        const vendedor = vendedoresInfo[vendedorId] || { nombre: 'Vendedor', apellido: '', telefono: '' };
        acumulador[vendedorId] = {
          vendedorId,
          vendedor,
          productos: [],
          subtotal: 0
        };
      }
      
      acumulador[vendedorId].productos.push(prod);
      acumulador[vendedorId].subtotal += prod.cantidad * parseFloat(prod.precio || 0);
      
      return acumulador;
    }, {});
    
    return Object.values(grupos);
  };

  // Cargar productos de un pedido, resolver info y agrupar por vendedor
  const cargarProductosDePedido = async (id_pedido) => {
    const response = await orderService.getProductosByPedido(id_pedido);
    if (response.success) {
      return response.productos;
    }
    return [];
  };

  const handleVerDetalles = async (pedido) => {
    try {
      setLoadingDetalle(true);
      setShowPedidoModal(true);
      
      // Obtener productos del pedido
      const productos = await cargarProductosDePedido(pedido.id_pedido);
      
      // Cargar info de productos faltantes antes de agrupar
      const productosFaltantes = productos.filter(p => !productosInfo[p.id_producto]);
      if (productosFaltantes.length > 0) {
        await Promise.all(
          productosFaltantes.map(p => cargarInfoProducto(p.id_producto))
        );
      }
      
      // Cargar info de vendedores faltantes
      const vendedoresPendientes = new Set();
      productos.forEach(prod => {
        const info = productosInfo[prod.id_producto];
        if (info?.id_usuario && !vendedoresInfo[info.id_usuario]) {
          vendedoresPendientes.add(info.id_usuario);
        }
      });
      if (vendedoresPendientes.size > 0) {
        await Promise.all(
          Array.from(vendedoresPendientes).map(id => cargarInfoVendedor(id))
        );
      }
      
      // Agrupar por vendedor (ahora síncrono y eficiente)
      const gruposVendedor = agruparProductosPorVendedor(productos);
      
      // Si es maestro, también traer sub-pedidos para referencia
      let subPedidos = [];
      if (pedido.tipo_pedido === 'maestro' || pedido.es_pedido_compartido) {
        const response = await orderService.getPedidoMaestroById(pedido.id_pedido);
        if (response.success) {
          subPedidos = response.resumen.sub_pedidos;
        }
      }
      
      setPedidoDetallado({
        pedido_maestro: pedido,
        sub_pedidos: subPedidos,
        productos,
        gruposVendedor
      });
    } catch (error) {
      console.error('Error al ver detalles:', error);
      toast.error('Error al cargar detalles');
    } finally {
      setLoadingDetalle(false);
    }
  };

  const handleAgregarUbicacion = () => {
    setEditingUbicacion(null);
    setUbicacionForm({
      nombre: '',
      direccion: '',
      ciudad: '',
      codigo_postal: '',
      telefono: '',
      es_principal: ubicaciones.length === 0
    });
    setShowUbicacionModal(true);
  };

  const handleEditarUbicacion = (ubicacion) => {
    setEditingUbicacion(ubicacion);
    setUbicacionForm({
      nombre: ubicacion.nombre,
      direccion: ubicacion.direccion,
      ciudad: ubicacion.ciudad || '',
      codigo_postal: ubicacion.codigo_postal || '',
      telefono: ubicacion.telefono || '',
      es_principal: ubicacion.es_principal || false
    });
    setShowUbicacionModal(true);
  };

  const handleGuardarUbicacion = async () => {
    if (!ubicacionForm.nombre || !ubicacionForm.direccion) {
      toast.error('Nombre y dirección son obligatorios');
      return;
    }

    try {
      const ubicacionData = {
        ...ubicacionForm,
        id_usuario: user.id_usuario
      };

      let response;
      if (editingUbicacion) {
        response = await locationService.updateUbicacion(editingUbicacion.id_ubicacion, ubicacionData);
      } else {
        response = await locationService.createUbicacion(ubicacionData);
      }

      if (response.success) {
        toast.success(editingUbicacion ? 'Ubicación actualizada' : 'Ubicación agregada');
        setShowUbicacionModal(false);
        cargarUbicaciones();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error guardando ubicación:', error);
      toast.error('Error al guardar ubicación');
    }
  };

  const handleEliminarUbicacion = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta ubicación?')) return;

    try {
      const response = await locationService.deleteUbicacion(id);
      
      if (response.success) {
        toast.success('Ubicación eliminada');
        cargarUbicaciones();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error eliminando ubicación:', error);
      toast.error('Error al eliminar ubicación');
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate?.('home');
  };

  return (
    <div className="profile-page-premium">
      <div className="profile-container-premium">
        {/* Header Premium */}
        <div className="profile-header-premium">
          <div className="profile-user-info">
            <div className="flex items-center gap-6">
              <div className="avatar-premium">
                {user?.nombre?.charAt(0).toUpperCase()}
              </div>
              <div className="user-text-meta">
                <h1>{user?.nombre} {user?.apellido}</h1>
                <p>{user?.correo}</p>
                <div className={`role-badge-premium ${
                  user?.rol === 'administrador' ? 'role-admin' : 'role-client'
                }`}>
                  {user?.rol === 'administrador' ? 'Super Administrador' : 'Cliente Premium'}
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              {isAdmin() && (
                <button
                  onClick={() => onNavigate?.('admin')}
                  className="btn-action-premium btn-primary-profile"
                >
                  <Settings size={18} />
                  <span>Panel Admin</span>
                </button>
              )}
              <button
                onClick={handleLogout}
                className="btn-action-premium btn-danger-profile"
              >
                <LogOut size={18} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Premium */}
        <div className="profile-tabs-premium">
          <button
            onClick={() => setActiveTab('info')}
            className={`tab-btn-premium ${activeTab === 'info' ? 'active' : ''}`}
          >
            <User size={20} />
            Información
          </button>
          <button
            onClick={() => setActiveTab('ubicaciones')}
            className={`tab-btn-premium ${activeTab === 'ubicaciones' ? 'active' : ''}`}
          >
            <MapPin size={20} />
            Direcciones
          </button>
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`tab-btn-premium ${activeTab === 'pedidos' ? 'active' : ''}`}
          >
            <Package size={20} />
            Pedidos
          </button>
        </div>

        <div className="tab-content-premium">
          {/* Tab: Información Personal */}
          {activeTab === 'info' && (
            <div className="info-grid-premium">
              <div className="info-item-premium">
                <span className="info-label-premium">Nombre</span>
                <span className="info-value-premium">{user?.nombre || '-'}</span>
              </div>
              <div className="info-item-premium">
                <span className="info-label-premium">Apellido</span>
                <span className="info-value-premium">{user?.apellido || '-'}</span>
              </div>
              <div className="info-item-premium">
                <span className="info-label-premium">Email</span>
                <span className="info-value-premium">{user?.correo || '-'}</span>
              </div>
              <div className="info-item-premium">
                <span className="info-label-premium">Teléfono</span>
                <span className="info-value-premium">{user?.telefono || '-'}</span>
              </div>
              <div className="info-item-premium md:col-span-2">
                <span className="info-label-premium">Usuario</span>
                <span className="info-value-premium">{user?.usuario || '-'}</span>
              </div>
            </div>
          )}

          {/* Tab: Ubicaciones */}
          {activeTab === 'ubicaciones' && (
            <div>
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-2xl font-black text-slate-800">Direcciones</h3>
                <button
                  onClick={handleAgregarUbicacion}
                  className="btn-action-premium btn-primary-profile"
                >
                  <Plus size={18} />
                  Nueva Dirección
                </button>
              </div>

              {loading ? (
                <p className="text-center text-gray-500 py-8">Cargando direcciones...</p>
              ) : ubicaciones.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No tienes direcciones guardadas</p>
                  <button
                    onClick={handleAgregarUbicacion}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Agregar Primera Dirección
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ubicaciones.map((ubicacion) => (
                    <div
                      key={ubicacion.id_ubicacion}
                      className={`address-card-premium ${ubicacion.es_principal ? 'principal' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold text-slate-800 text-lg">{ubicacion.nombre}</h4>
                          {ubicacion.es_principal && (
                            <span className="principal-badge-premium">Principal</span>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditarUbicacion(ubicacion)}
                            className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleEliminarUbicacion(ubicacion.id_ubicacion)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-600 font-medium leading-relaxed">{ubicacion.direccion}</p>
                      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-1">
                        <p className="text-slate-500 text-sm flex items-center gap-2">
                          <MapPin size={14} />
                          {ubicacion.ciudad} {ubicacion.codigo_postal && `(${ubicacion.codigo_postal})`}
                        </p>
                        {ubicacion.telefono && (
                          <p className="text-slate-500 text-sm flex items-center gap-2">
                            <span>📞</span> {ubicacion.telefono}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Pedidos */}
          {activeTab === 'pedidos' && (
            <div>
              <h3 className="text-2xl font-black text-slate-800 mb-10">Historial de Pedidos</h3>

              {loading ? (
                <p className="text-center text-gray-500 py-8">Cargando pedidos...</p>
              ) : pedidos.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No tienes pedidos aún</p>
                  <button
                    onClick={() => onNavigate?.('products')}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    Comenzar a Comprar
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {pedidos.map((pedido) => (
                    <div key={pedido.id_pedido} className="order-card-premium">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-lg text-xs font-black uppercase">
                              #{pedido.id_pedido}
                            </span>
                            <span className={`status-badge-premium ${
                              pedido.estado === 'Pendiente' ? 'status-pendiente' : 
                              pedido.estado === 'En proceso' ? 'status-proceso' : 'status-entregado'
                            }`}>
                              {pedido.estado}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm font-medium mt-2">
                            {new Date(pedido.fecha_pedido).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-3xl font-black text-slate-800">
                            S/ {parseFloat(pedido.total).toFixed(2)}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Pago Autorizado
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button 
                          className="btn-action-premium btn-secondary-premium py-2 px-6"
                          onClick={() => handleVerDetalles(pedido)}
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal de Detalles de Pedido */}
        {showPedidoModal && (
          <div className="modal-overlay-premium">
            <div className="modal-content-premium max-w-2xl">
              <div className="modal-header-premium">
                <div className="modal-icon-container">
                  <Package className="h-10 w-10" />
                </div>
                <h3 className="modal-title-premium">
                  Detalles del Pedido #{pedidoDetallado?.pedido_maestro?.id_pedido || ''}
                </h3>
                <p className="modal-subtitle-premium">
                  Realizado el {pedidoDetallado?.pedido_maestro?.fecha_pedido && new Date(pedidoDetallado.pedido_maestro.fecha_pedido).toLocaleDateString()}
                </p>
              </div>

              {loadingDetalle ? (
                <div className="py-10 text-center">
                  <div className="spinner mx-auto mb-4"></div>
                  <p className="text-slate-500">Cargando información detallada...</p>
                </div>
              ) : (
                <div className="space-y-6 max-h-[60vh] overflow-y-auto px-1">
                  {/* Resumen de Estado */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-slate-500 uppercase">Estado General</span>
                      <span className="badge-premium badge-success">Pago Autorizado</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Pagado</p>
                        <p className="text-3xl font-black text-slate-800">S/ {parseFloat(pedidoDetallado?.pedido_maestro?.total || 0).toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Ubicación</p>
                        <p className="text-sm font-bold text-slate-700">{pedidoDetallado?.pedido_maestro?.ubicacion_nombre || 'Dirección de envío'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Productos agrupados por Vendedor */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest pl-1">Productos por Vendedor</h4>
                    
                    {pedidoDetallado?.gruposVendedor && pedidoDetallado.gruposVendedor.length > 0 ? (
                      pedidoDetallado.gruposVendedor.map((grupo, idx) => (
                        <div key={idx} className="vendor-card-premium">
                          {/* Header del Vendedor */}
                          <div className="vendor-card-header">
                            <div className="vendor-avatar">
                              <Store size={18} />
                            </div>
                            <div className="vendor-info">
                              <p className="vendor-name">{grupo.vendedor.nombre} {grupo.vendedor.apellido}</p>
                              {user?.telefono && (
                                <div className="vendor-yape">
                                  <Phone size={12} />
                                  <span>Yape (Admin): {user.telefono}</span>
                                </div>
                              )}
                            </div>
                            <div className="vendor-subtotal-badge">
                              S/ {grupo.subtotal.toFixed(2)}
                            </div>
                          </div>
                          
                          {/* Productos del Vendedor */}
                          <div className="vendor-products-list">
                            {grupo.productos.map((prod, pidx) => {
                              const info = productosInfo[prod.id_producto];
                              return (
                                <div key={pidx} className="profile-product-item">
                                  <div className="profile-product-image-wrap">
                                    {info?.image ? (
                                      <img src={info.image} alt={info.title} className="profile-product-img" onError={(e) => { e.target.style.display = 'none'; }} />
                                    ) : (
                                      <div className="profile-product-img-placeholder"><Package size={18} color="#ccc" /></div>
                                    )}
                                  </div>
                                  <div className="profile-product-details">
                                    <p className="profile-product-name">{info?.title || `Producto #${prod.id_producto}`}</p>
                                    <p className="profile-product-qty">Cantidad: {prod.cantidad}</p>
                                  </div>
                                  <div className="profile-product-price">
                                    <p className="profile-product-subtotal">S/ {(prod.cantidad * parseFloat(prod.precio)).toFixed(2)}</p>
                                    <p className="profile-product-unit">S/ {parseFloat(prod.precio).toFixed(2)} c/u</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                        <p className="text-sm text-center text-slate-400 py-3">Cargando productos...</p>
                      </div>
                    )}
                  </div>

                  {/* Dirección de Envío */}
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin size={20} className="text-purple-500" />
                      <h4 className="text-sm font-bold text-slate-800">Dirección de Entrega</h4>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {pedidoDetallado?.pedido_maestro?.ubicacion_direccion}<br />
                      {pedidoDetallado?.pedido_maestro?.ubicacion_ciudad}
                    </p>
                  </div>
                </div>
              )}

              <div className="modal-actions-premium mt-8">
                <button
                  onClick={() => setShowPedidoModal(false)}
                  className="btn-checkout-premium flex-1 mb-0"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {showUbicacionModal && (
          <div className="modal-overlay-premium">
            <div className="modal-content-premium">
              <div className="modal-header-premium">
                <div className="modal-icon-container">
                  <MapPin className="h-10 w-10" />
                </div>
                <h3 className="modal-title-premium">
                  {editingUbicacion ? 'Editar Dirección' : 'Nueva Dirección'}
                </h3>
                <p className="modal-subtitle-premium">
                  Completa los datos para el envío de tus productos
                </p>
              </div>

              <div className="space-y-5">
                <div className="input-premium-container mb-0">
                  <label className="input-label-premium">Nombre de la dirección</label>
                  <input
                    type="text"
                    value={ubicacionForm.nombre}
                    onChange={(e) => setUbicacionForm({ ...ubicacionForm, nombre: e.target.value })}
                    placeholder="Ej: Casa, Oficina..."
                    className="input-field-premium"
                  />
                </div>

                <div className="input-premium-container mb-0">
                  <label className="input-label-premium">Dirección Completa</label>
                  <textarea
                    value={ubicacionForm.direccion}
                    onChange={(e) => setUbicacionForm({ ...ubicacionForm, direccion: e.target.value })}
                    placeholder="Calle, número, referencias..."
                    rows={2}
                    className="input-field-premium resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="input-premium-container mb-0">
                    <label className="input-label-premium">Ciudad</label>
                    <input
                      type="text"
                      value={ubicacionForm.ciudad}
                      onChange={(e) => setUbicacionForm({ ...ubicacionForm, ciudad: e.target.value })}
                      className="input-field-premium"
                    />
                  </div>
                  <div className="input-premium-container mb-0">
                    <label className="input-label-premium">Cód. Postal</label>
                    <input
                      type="text"
                      value={ubicacionForm.codigo_postal}
                      onChange={(e) => setUbicacionForm({ ...ubicacionForm, codigo_postal: e.target.value })}
                      className="input-field-premium"
                    />
                  </div>
                </div>

                <div className="input-premium-container mb-0">
                  <label className="input-label-premium">Teléfono de contacto</label>
                  <input
                    type="tel"
                    value={ubicacionForm.telefono}
                    onChange={(e) => setUbicacionForm({ ...ubicacionForm, telefono: e.target.value })}
                    className="input-field-premium"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <input
                    type="checkbox"
                    id="es_principal"
                    checked={ubicacionForm.es_principal}
                    onChange={(e) => setUbicacionForm({ ...ubicacionForm, es_principal: e.target.checked })}
                    className="h-5 w-5 text-purple-600 rounded-lg border-slate-300 focus:ring-purple-500"
                  />
                  <label htmlFor="es_principal" className="text-sm font-bold text-slate-700 cursor-pointer">
                    Establecer como dirección principal
                  </label>
                </div>
              </div>

              <div className="modal-actions-premium mt-8">
                <button
                  onClick={() => setShowUbicacionModal(false)}
                  className="btn-secondary-premium flex-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleGuardarUbicacion}
                  className="btn-checkout-premium flex-1 mb-0"
                >
                  {editingUbicacion ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;