import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { productService } from '../../services/productService';
import { Package, Plus, Edit2, Trash2, Star, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminProducts.css';

const AdminProducts = () => {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: '',
    rating_rate: '',
    rating_count: '',
    stock: ''
  });

  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionadaState] = useState('');

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const response = await productService.getProductosByUser(user.id_usuario);
      if (response.success) {
        setProductos(response.productos);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await productService.getProductosCombinados();
      if (response.success) {
        const cats = [...new Set(
          response.productos
            .map(p => p.category)
            .filter(c => c && c.trim() !== '')
        )].sort();
        setCategorias(cats);
      }
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const abrirModalNuevo = () => {
    setModoEdicion(false);
    setProductoSeleccionado(null);
    setFormData({
      title: '',
      price: '',
      description: '',
      category: '',
      image: '',
      rating_rate: '',
      rating_count: '',
      stock: ''
    });
    setNuevaCategoria('');
    setCategoriaSeleccionadaState('');
    setModalVisible(true);
  };

  const abrirModalEditar = (producto) => {
    setModoEdicion(true);
    setProductoSeleccionado(producto);
    setFormData({
      title: producto.title,
      price: producto.price.toString(),
      description: producto.description || '',
      category: producto.category || '',
      image: producto.image || '',
      rating_rate: producto.rating_rate?.toString() || '',
      rating_count: producto.rating_count?.toString() || '',
      stock: producto.stock?.toString() || '0'
    });
    
    if (producto.category && categorias.includes(producto.category)) {
      setCategoriaSeleccionadaState(producto.category);
      setNuevaCategoria('');
    } else {
      setNuevaCategoria(producto.category || '');
      setCategoriaSeleccionadaState('');
    }
    
    setModalVisible(true);
  };

  const handleGuardar = async () => {
    if (!formData.title || !formData.price) {
      toast.error('El título y precio son obligatorios');
      return;
    }

    let categoriaFinal = '';
    if (nuevaCategoria.trim()) {
      categoriaFinal = nuevaCategoria.trim();
    } else if (categoriaSeleccionada.trim()) {
      categoriaFinal = categoriaSeleccionada.trim();
    } else {
      toast.error('Debe ingresar una nueva categoría o seleccionar una existente');
      return;
    }

    try {
      const productoData = {
        id_usuario: user.id_usuario,
        title: formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
        category: categoriaFinal,
        image: formData.image,
        rating_rate: formData.rating_rate ? parseFloat(formData.rating_rate) : null,
        rating_count: formData.rating_count ? parseInt(formData.rating_count) : null,
        stock: formData.stock ? parseInt(formData.stock) : 0
      };

      let response;
      if (modoEdicion && productoSeleccionado) {
        response = await productService.updateProducto(productoSeleccionado.id_producto, productoData);
      } else {
        response = await productService.createProducto(productoData);
      }

      if (response.success) {
        toast.success(modoEdicion ? 'Producto actualizado' : 'Producto creado');
        setModalVisible(false);
        cargarProductos();
        cargarCategorias();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Error al guardar el producto');
    }
  };

  const handleEliminar = async (producto) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${producto.title}"?`)) {
      return;
    }

    try {
      const response = await productService.deleteProducto(producto.id_producto);
      if (response.success) {
        toast.success('Producto eliminado');
        cargarProductos();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Error al eliminar el producto');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <div className="header-left">
          <Package size={32} />
          <h1>Gestión de Productos</h1>
        </div>
        <button className="btn-add" onClick={abrirModalNuevo}>
          <Plus size={20} />
          Agregar Producto
        </button>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>{productos.length}</h3>
          <p>Total Productos</p>
        </div>
      </div>

      {productos.length === 0 ? (
        <div className="empty-state">
          <Package size={64} color="#ccc" />
          <p>No hay productos registrados</p>
          <button className="btn-primary" onClick={abrirModalNuevo}>
            Agregar Primer Producto
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {productos.map((producto) => (
            <div key={producto.id_producto} className="product-card">
              {producto.image && (
                <img 
                  src={producto.image} 
                  alt={producto.title}
                  className="product-image"
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
              <div className="product-info">
                <h3>{producto.title}</h3>
                <p className="product-price">S/ {parseFloat(producto.price).toFixed(2)}</p>
                {producto.category && (
                  <span className="product-category">{producto.category}</span>
                )}
                <div className="product-stock">
                  <span>Stock: </span>
                  <span className={producto.stock <= 5 ? 'stock-low' : 'stock-normal'}>
                    {producto.stock || 0} unidades
                  </span>
                </div>
                {producto.rating_rate && (
                  <div className="product-rating">
                    <Star size={14} fill="#FFA500" color="#FFA500" />
                    <span>{producto.rating_rate} ({producto.rating_count || 0})</span>
                  </div>
                )}
              </div>
              <div className="product-actions">
                <button className="btn-edit" onClick={() => abrirModalEditar(producto)}>
                  <Edit2 size={18} />
                </button>
                <button className="btn-delete" onClick={() => handleEliminar(producto)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalVisible && (
        <div className="modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button className="modal-close" onClick={() => setModalVisible(false)}>×</button>
            </div>

            <div className="modal-content">
              <div className="form-group">
                <label>Título *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Nombre del producto"
                />
              </div>

              <div className="form-group">
                <label>Precio *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  placeholder="99.99"
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Descripción del producto"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Nueva Categoría</label>
                <input
                  type="text"
                  value={nuevaCategoria}
                  onChange={(e) => {
                    setNuevaCategoria(e.target.value);
                    if (e.target.value.trim()) {
                      setCategoriaSeleccionadaState('');
                    }
                  }}
                  placeholder="Ingresa una nueva categoría"
                />
              </div>

              <div className="form-group">
                <label>O Seleccionar Categoría Existente</label>
                <select
                  value={categoriaSeleccionada}
                  onChange={(e) => {
                    setCategoriaSeleccionadaState(e.target.value);
                    if (e.target.value) {
                      setNuevaCategoria('');
                    }
                  }}
                >
                  <option value="">Seleccionar categoría...</option>
                  {categorias.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {(nuevaCategoria.trim() || categoriaSeleccionada) && (
                <div className="category-preview">
                  <AlertCircle size={16} />
                  <span>
                    Categoría: {nuevaCategoria.trim() || categoriaSeleccionada}
                    {nuevaCategoria.trim() && " (Nueva)"}
                  </span>
                </div>
              )}

              <div className="form-group">
                <label>URL de Imagen</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rating (0-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating_rate}
                    onChange={(e) => setFormData({...formData, rating_rate: e.target.value})}
                    placeholder="4.5"
                  />
                </div>

                <div className="form-group">
                  <label>Cantidad de Reviews</label>
                  <input
                    type="number"
                    value={formData.rating_count}
                    onChange={(e) => setFormData({...formData, rating_count: e.target.value})}
                    placeholder="120"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Stock *</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setModalVisible(false)}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleGuardar}>
                {modoEdicion ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
