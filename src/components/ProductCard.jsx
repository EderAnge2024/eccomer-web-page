import { useCart } from '../context/CartContext'
import { useState } from 'react'

const ProductCard = ({ product }) => {
  const { agregarAlCarrito } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    setIsAdding(true)
    
    // Normalizar el producto para el carrito
    const productoNormalizado = {
      id: product.id_producto || product.id,
      nombre: product.title || product.nombre,
      precio: product.price || product.precio,
      imagen: product.image || product.imagen,
      stock: product.stock || 0
    }
    
    agregarAlCarrito(productoNormalizado)
    
    // Show feedback for a moment
    setTimeout(() => {
      setIsAdding(false)
    }, 500)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price)
  }

  // Obtener valores normalizados
  const nombre = product.title || product.nombre || 'Producto sin nombre'
  const descripcion = product.description || product.descripcion || ''
  const precio = product.price || product.precio || 0
  const imagen = product.image || product.imagen
  const stock = product.stock || 0

  return (
    <div className="product-card">
      {imagen && (
        <img 
          src={imagen} 
          alt={nombre}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen'
          }}
        />
      )}
      
      <div className="product-info">
        <h3 className="product-title">{nombre}</h3>
        {descripcion && (
          <p className="product-description">
            {descripcion.length > 100 ? descripcion.substring(0, 100) + '...' : descripcion}
          </p>
        )}
        <div className="product-price">{formatPrice(precio)}</div>
        
        {stock > 0 ? (
          <button 
            className={`btn btn-primary ${isAdding ? 'btn-secondary' : ''}`}
            onClick={handleAddToCart}
            disabled={isAdding}
            style={{ width: '100%' }}
          >
            {isAdding ? '¡Agregado!' : 'Agregar al Carrito'}
          </button>
        ) : (
          <button className="btn btn-secondary" disabled style={{ width: '100%' }}>
            Sin Stock
          </button>
        )}
        
        <div className="text-sm" style={{ marginTop: '0.5rem', color: '#64748b' }}>
          Stock: {stock} unidades
        </div>
      </div>
    </div>
  )
}

export default ProductCard