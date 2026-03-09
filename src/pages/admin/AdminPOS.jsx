import React, { useState, useEffect } from 'react';
import { ventaPresencialService } from '../../services/ventaPresencialService';
import { comprobanteService } from '../../services/comprobanteService';
import { Store, Search, Plus, Minus, Trash2, ShoppingCart, User, DollarSign, Package, Eye, X, CheckCircle, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminPOS.css';

const AdminPOS = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [modalCliente, setModalCliente] = useState(false);
  const [resumenDia, setResumenDia] = useState(null);
  const [mostrarResumen, setMostrarResumen] = useState(false);

  // Estados para comprobante
  const [modalComprobante, setModalComprobante] = useState(false);
  const [comprobanteData, setComprobanteData] = useState(null);
  const [loadingComprobante, setLoadingComprobante] = useState(false);
  const [ultimoIdPedido, setUltimoIdPedido] = useState(null);

  const [datosCliente, setDatosCliente] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
    notas: ''
  });

  useEffect(() => {
    cargarProductos();
    cargarResumenDelDia();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      cargarProductos();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [busqueda, categoriaSeleccionada]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await ventaPresencialService.buscarProductos({
        search: busqueda,
        categoria: categoriaSeleccionada,
        limit: 50
      });

      if (response.success) {
        setProductos(response.productos);
        setCategorias(response.categorias);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const cargarResumenDelDia = async () => {
    try {
      const response = await ventaPresencialService.obtenerResumenDelDia();
      if (response.success) {
        setResumenDia(response);
      }
    } catch (error) {
      console.error('Error cargando resumen del día:', error);
    }
  };

  const agregarAlCarrito = (producto) => {
    const existeEnCarrito = carrito.find(item => item.id_producto === producto.id_producto);

    if (existeEnCarrito) {
      if (existeEnCarrito.cantidad >= producto.stock_disponible) {
        toast.error(`Solo hay ${producto.stock_disponible} unidades disponibles`);
        return;
      }

      setCarrito(carrito.map(item =>
        item.id_producto === producto.id_producto
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, {
        id_producto: producto.id_producto,
        title: producto.title,
        price: parseFloat(producto.price),
        cantidad: 1,
        stock_disponible: producto.stock_disponible,
        image: producto.image,
        category: producto.category
      }]);
    }

    toast.success(`${producto.title} agregado al carrito`);
  };

  const modificarCantidadCarrito = (id_producto, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      setCarrito(carrito.filter(item => item.id_producto !== id_producto));
      return;
    }

    const producto = carrito.find(item => item.id_producto === id_producto);
    if (nuevaCantidad > producto.stock_disponible) {
      toast.error(`Solo hay ${producto.stock_disponible} unidades disponibles`);
      return;
    }

    setCarrito(carrito.map(item =>
      item.id_producto === id_producto
        ? { ...item, cantidad: nuevaCantidad }
        : item
    ));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.price * item.cantidad), 0);
  };

  const procesarVenta = async () => {
    if (carrito.length === 0) {
      toast.error('Debe agregar al menos un producto');
      return;
    }

    if (!datosCliente.nombre.trim()) {
      toast.error('El nombre del cliente es requerido');
      return;
    }

    try {
      setLoading(true);

      const ventaData = {
        cliente_nombre: datosCliente.nombre,
        cliente_apellido: datosCliente.apellido,
        cliente_correo: datosCliente.correo,
        cliente_telefono: datosCliente.telefono,
        cliente_direccion: datosCliente.direccion,
        notas: datosCliente.notas || 'Venta presencial',
        productos: carrito.map(item => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario: item.price
        }))
      };

      const response = await ventaPresencialService.crearVenta(ventaData);

      if (response && response.success && response.pedido) {
        const idPedido = response.pedido.id_pedido;
        setUltimoIdPedido(idPedido);
        setModalCliente(false);
        limpiarVenta();

        toast.success(
          `Venta completada - Pedido #${idPedido}\nTotal: S/ ${response.pedido.total.toFixed(2)}`,
          { duration: 4000 }
        );

        // Cargar datos del comprobante automáticamente
        verComprobante(idPedido);

        cargarProductos();
        cargarResumenDelDia();
      } else {
        toast.error(response?.message || 'Error al procesar la venta');
      }
    } catch (error) {
      toast.error('Error al procesar la venta');
      console.error('Error procesando venta:', error);
    } finally {
      setLoading(false);
    }
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
      toast.error('Error al obtener datos del comprobante');
    } finally {
      setLoadingComprobante(false);
    }
  };

  const descargarPDF = async () => {
    if (!comprobanteData) return;
    try {
      await comprobanteService.descargarComprobante(comprobanteData.pedido.id_pedido);
      toast.success('Descargando comprobante...');
    } catch (error) {
      toast.error('Error al descargar PDF');
    }
  };

  const abrirEnNuevaPestana = async () => {
    if (!comprobanteData) return;
    await comprobanteService.abrirComprobante(comprobanteData.pedido.id_pedido);
  };

  const limpiarVenta = () => {
    setCarrito([]);
    setDatosCliente({
      nombre: '',
      apellido: '',
      correo: '',
      telefono: '',
      direccion: '',
      notas: ''
    });
    setModalCliente(false);
  };

  return (
    <div className="admin-pos">
      <div className="pos-header">
        <div className="header-left">
          <Store size={32} />
          <h1>Punto de Venta</h1>
        </div>
        <div className="header-actions">
          <button
            className="btn-resumen"
            onClick={() => setMostrarResumen(true)}
          >
            <DollarSign size={20} />
            Resumen del Día
          </button>
        </div>
      </div>

      <div className="pos-container">
        <div className="pos-products-section">
          <div className="search-section">
            <div className="search-bar">
              <Search size={20} />
              <input
                type="text"
                placeholder="Buscar productos o categorías..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="categories-filter">
              <button
                className={`category-btn ${!categoriaSeleccionada ? 'active' : ''}`}
                onClick={() => setCategoriaSeleccionada('')}
              >
                Todas
              </button>
              {categorias.map((categoria) => (
                <button
                  key={categoria}
                  className={`category-btn ${categoriaSeleccionada === categoria ? 'active' : ''}`}
                  onClick={() => setCategoriaSeleccionada(categoria)}
                >
                  {categoria}
                </button>
              ))}
            </div>
          </div>

          {loading && !productos.length ? (
            <div className="pos-loading">
              <div className="spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <div className="products-grid-pos">
              {productos.map((producto) => (
                <div key={producto.id_producto} className="product-card-pos" onClick={() => agregarAlCarrito(producto)}>
                  <div className="product-image-container-pos">
                    {producto.image ? (
                      <img
                        src={producto.image}
                        alt={producto.title}
                        className="product-image-pos"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    ) : (
                      <Package size={40} color="#ccc" />
                    )}
                    {producto.stock_disponible <= 5 && producto.stock_disponible > 0 && (
                      <span className="badge-low-stock">Bajo Stock</span>
                    )}
                    {producto.stock_disponible <= 0 && (
                      <span className="badge-no-stock">Agotado</span>
                    )}
                  </div>
                  <div className="product-info-pos">
                    <p className="product-category-pos">{producto.category}</p>
                    <h4>{producto.title}</h4>
                    <p className="product-price-pos">S/ {parseFloat(producto.price).toFixed(2)}</p>
                    <div className="product-footer-pos">
                      <span className={`stock-indicator ${producto.stock_disponible <= 0 ? 'agotado' : producto.stock_disponible <= 5 ? 'bajo' : 'ok'}`}>
                        {producto.stock_disponible} disponibles
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn-add-pos-minimal"
                    disabled={producto.stock_disponible <= 0}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pos-cart-section">
          <div className="cart-header">
            <div className="cart-header-title">
              <ShoppingCart size={24} />
              <h2>Carrito</h2>
              <span className="cart-count">{carrito.reduce((t, i) => t + i.cantidad, 0)}</span>
            </div>
            {carrito.length > 0 && (
              <button className="btn-clear-cart" onClick={limpiarVenta} title="Limpiar carrito">
                <Trash2 size={18} />
              </button>
            )}
          </div>

          {carrito.length === 0 ? (
            <div className="cart-empty">
              <div className="empty-icon-circle">
                <Package size={48} color="#ccc" />
              </div>
              <p>El carrito está vacío</p>
              <span>Selecciona productos para comenzar una venta</span>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {carrito.map((item) => (
                  <div key={item.id_producto} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.title}</h4>
                      <div className="cart-item-price-row">
                        <span className="unit-price">S/ {item.price.toFixed(2)}</span>
                        <span className="item-subtotal">S/ {(item.price * item.cantidad).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="cart-item-controls">
                      <button className="control-btn" onClick={() => modificarCantidadCarrito(item.id_producto, item.cantidad - 1)}>
                        <Minus size={14} />
                      </button>
                      <span className="qty-value">{item.cantidad}</span>
                      <button className="control-btn" onClick={() => modificarCantidadCarrito(item.id_producto, item.cantidad + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>S/ {calcularTotal().toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>S/ {calcularTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                className="btn-process-sale"
                onClick={() => setModalCliente(true)}
              >
                <User size={20} />
                Continuar con el Cliente
              </button>
            </>
          )}
        </div>
      </div>

      {modalCliente && (
        <div className="modal-overlay" onClick={() => setModalCliente(false)}>
          <div className="modal-container pos-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><User size={24} style={{ marginRight: '10px' }} /> Datos del Cliente</h2>
              <button className="modal-close" onClick={() => setModalCliente(false)}><X /></button>
            </div>

            <div className="modal-content">
              <div className="form-grid">
                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={datosCliente.nombre}
                    onChange={(e) => setDatosCliente({ ...datosCliente, nombre: e.target.value })}
                    placeholder="Ej: Juan"
                  />
                </div>

                <div className="form-group">
                  <label>Apellido</label>
                  <input
                    type="text"
                    value={datosCliente.apellido}
                    onChange={(e) => setDatosCliente({ ...datosCliente, apellido: e.target.value })}
                    placeholder="Ej: Pérez"
                  />
                </div>

                <div className="form-group">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    value={datosCliente.correo}
                    onChange={(e) => setDatosCliente({ ...datosCliente, correo: e.target.value })}
                    placeholder="juan.perez@email.com"
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="tel"
                    value={datosCliente.telefono}
                    onChange={(e) => setDatosCliente({ ...datosCliente, telefono: e.target.value })}
                    placeholder="999 999 999"
                  />
                </div>

                <div className="form-group full-width">
                  <label>Dirección</label>
                  <input
                    type="text"
                    value={datosCliente.direccion}
                    onChange={(e) => setDatosCliente({ ...datosCliente, direccion: e.target.value })}
                    placeholder="Av. Las Lilas 123..."
                  />
                </div>

                <div className="form-group full-width">
                  <label>Notas adicionales</label>
                  <textarea
                    value={datosCliente.notas}
                    onChange={(e) => setDatosCliente({ ...datosCliente, notas: e.target.value })}
                    placeholder="Alguna observación sobre la venta..."
                    rows="2"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setModalCliente(false)}>
                Cancelar
              </button>
              <button
                className="btn-save"
                onClick={procesarVenta}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Completar Venta S/ ' + calcularTotal().toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Comprobante Preview */}
      {modalComprobante && comprobanteData && (
        <div className="modal-overlay" onClick={() => setModalComprobante(false)}>
          <div className="modal-container comprobante-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><CheckCircle size={24} color="#4CAF50" style={{ marginRight: '10px' }} /> Venta Exitosa</h2>
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
                  <p className="section-title-web">DETALLE</p>
                  <table className="comprobante-table-web">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Cant.</th>
                        <th>Total</th>
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
                  <span>TOTAL PAGADO</span>
                  <span>S/ {parseFloat(comprobanteData.pedido.total).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer comprobante-actions">
              <button className="btn-secondary" onClick={abrirEnNuevaPestana}>
                <Eye size={18} /> Ver Pantalla Completa
              </button>
              <button className="btn-secondary" onClick={descargarPDF}>
                <DollarSign size={18} /> Descargar PDF
              </button>
              <button className="btn-primary" onClick={() => setModalComprobante(false)}>
                Nueva Venta
              </button>
            </div>
          </div>
        </div>
      )}

      {mostrarResumen && resumenDia && (
        <div className="modal-overlay" onClick={() => setMostrarResumen(false)}>
          <div className="modal-container pos-modal resumo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><DollarSign size={24} style={{ marginRight: '10px' }} /> Resumen de Caja</h2>
              <button className="modal-close" onClick={() => setMostrarResumen(false)}><X /></button>
            </div>

            <div className="modal-content">
              <div className="resumen-stats-grid">
                <div className="resumen-stat-item">
                  <label>Total de Ventas</label>
                  <h3>{resumenDia.total_ventas || 0}</h3>
                </div>
                <div className="resumen-stat-item highlight">
                  <label>Ingreso Total</label>
                  <h3>S/ {parseFloat(resumenDia.total_ingresos || 0).toFixed(2)}</h3>
                </div>
                <div className="resumen-stat-item">
                  <label>Productos Vendidos</label>
                  <h3>{resumenDia.productos_vendidos || 0}</h3>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-save" style={{ width: '100%' }} onClick={() => setMostrarResumen(false)}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPOS;
