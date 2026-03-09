// Componente de tarjeta de producto
import { ShoppingCart, Star, Package } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { agregarAlCarrito } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  // Normalizar datos del producto (compatible con backend y API externa)
  const id = product.id_producto || product.id;
  const title = product.title || product.nombre || 'Producto sin nombre';
  const price = product.price || product.precio || 0;
  const image = product.image || product.imagen;
  const rating = product.rating_rate ? { rate: product.rating_rate, count: product.rating_count } : product.rating;
  const stock = product.stock || 0;
  const category = product.category || product.categoria;
  const description = product.description || product.descripcion || '';

  const hasStock = stock > 0;
  const lowStock = stock > 0 && stock <= 5;

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Normalizar el producto para el carrito
    const productoNormalizado = {
      id: id,
      nombre: title,
      precio: price,
      imagen: image,
      stock: stock
    };
    
    agregarAlCarrito(productoNormalizado);
    
    // Show feedback for a moment
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  if (viewMode === 'list') {
    return (
      <div className="product-card-list">
        <div className="product-image-container">
          <img
            src={image && image.trim() !== '' ? image : 'https://via.placeholder.com/150x150?text=No+Image'}
            alt={title}
            className="product-image-list"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
            }}
          />
          
          {/* Badge de stock */}
          {!hasStock && (
            <div className="stock-badge out-of-stock">Sin Stock</div>
          )}
          {lowStock && (
            <div className="stock-badge low-stock">¡Últimas unidades!</div>
          )}
        </div>

        <div className="product-content-list">
          <div className="product-header-list">
            {category && (
              <span className="product-category">{category}</span>
            )}
            <h3 className="product-title-list">{title}</h3>
            {description && (
              <p className="product-description-list">{description.substring(0, 150)}...</p>
            )}
          </div>

          <div className="product-details-list">
            {/* Rating */}
            {rating && (
              <div className="product-rating">
                <Star className="star-icon" />
                <span>{rating.rate?.toFixed(1)} ({rating.count || 0})</span>
              </div>
            )}

            {/* Stock */}
            <div className="product-stock">
              <Package className={`stock-icon ${lowStock ? 'warning' : hasStock ? 'success' : 'danger'}`} />
              <span className={`stock-text ${lowStock ? 'warning' : hasStock ? 'success' : 'danger'}`}>
                Stock: {stock}
              </span>
            </div>
          </div>

          <div className="product-actions-list">
            <div className="product-price-list">
              S/ {price?.toFixed(2)}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!hasStock || isAdding}
              className={`add-to-cart-btn ${hasStock && !isAdding ? 'available' : 'disabled'}`}
            >
              <ShoppingCart size={16} />
              {isAdding ? '¡Agregado!' : hasStock ? 'Agregar al carrito' : 'Agotado'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vista de grilla (por defecto)
  return (
    <div className="product-card-grid">
      {/* Imagen del producto */}
      <div className="product-image-container">
        <img
          src={image && image.trim() !== '' ? image : 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={title}
          className="product-image-grid"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
          }}
        />
        
        {/* Badge de stock */}
        {!hasStock && (
          <div className="stock-badge out-of-stock">Sin Stock</div>
        )}
        {lowStock && (
          <div className="stock-badge low-stock">¡Últimas unidades!</div>
        )}
      </div>

      {/* Contenido */}
      <div className="product-content-grid">
        {/* Categoría */}
        {category && (
          <span className="product-category">{category}</span>
        )}

        {/* Título */}
        <h3 className="product-title-grid">{title}</h3>

        {/* Rating */}
        {rating && (
          <div className="product-rating">
            <Star className="star-icon" />
            <span>{rating.rate?.toFixed(1)} ({rating.count || 0})</span>
          </div>
        )}

        {/* Stock */}
        <div className="product-stock">
          <Package className={`stock-icon ${lowStock ? 'warning' : hasStock ? 'success' : 'danger'}`} />
          <span className={`stock-text ${lowStock ? 'warning' : hasStock ? 'success' : 'danger'}`}>
            Stock: {stock}
          </span>
        </div>

        {/* Precio y botón */}
        <div className="product-footer">
          <div className="product-price-grid">
            S/ {price?.toFixed(2)}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={!hasStock || isAdding}
            className={`add-to-cart-btn ${hasStock && !isAdding ? 'available' : 'disabled'}`}
          >
            <ShoppingCart size={16} />
            {isAdding ? '¡Agregado!' : hasStock ? 'Agregar' : 'Agotado'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
