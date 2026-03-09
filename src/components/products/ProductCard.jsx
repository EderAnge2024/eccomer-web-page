// Componente de tarjeta de producto
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useCart } from '../../contexts/CartContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Button from '../ui/Button.jsx';
import { formatPrice, formatImageUrl, truncateText } from '../../utils/formatters.js';
import toast from 'react-hot-toast';

const ProductCard = ({ product, showQuickView = true }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product);
  };

  const handleToggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Inicia sesión para guardar productos favoritos');
      return;
    }
    
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Removido de favoritos' : 'Agregado a favoritos');
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // TODO: Implementar vista rápida del producto
    toast.info('Vista rápida próximamente');
  };

  const inCart = isInCart(product.id);
  const quantity = getItemQuantity(product.id);

  // Determinar si es un producto externo (de API) o interno (BD)
  const isExternalProduct = !product.id_usuario;
  const productSource = isExternalProduct ? 'API Externa' : 'Tienda Local';

  return (
    <div className="group relative bg-white rounded-xl border border-secondary-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Badge de origen del producto */}
      {isExternalProduct && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            Externo
          </span>
        </div>
      )}

      {/* Botón de favoritos */}
      <button
        onClick={handleToggleLike}
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-50"
      >
        <Heart 
          className={`w-4 h-4 transition-colors ${
            isLiked ? 'text-red-500 fill-current' : 'text-secondary-400 hover:text-red-500'
          }`} 
        />
      </button>

      {/* Imagen del producto */}
      <Link to={`/producto/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-secondary-100">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          )}
          <img
            src={formatImageUrl(product.image)}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
              setImageLoading(false);
            }}
          />
          
          {/* Overlay con acciones rápidas */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 space-x-2">
              {showQuickView && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleQuickView}
                  className="bg-white hover:bg-secondary-100"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Información del producto */}
      <div className="p-4">
        {/* Categoría */}
        {product.category && (
          <p className="text-xs text-secondary-500 uppercase tracking-wide mb-1">
            {product.category}
          </p>
        )}

        {/* Título */}
        <Link to={`/producto/${product.id}`}>
          <h3 className="font-medium text-secondary-900 mb-2 hover:text-primary-600 transition-colors">
            {truncateText(product.title, 60)}
          </h3>
        </Link>

        {/* Rating (si está disponible) */}
        {product.rating && (
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating.rate)
                      ? 'text-yellow-400 fill-current'
                      : 'text-secondary-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-secondary-500 ml-2">
              ({product.rating.count})
            </span>
          </div>
        )}

        {/* Precio */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-bold text-secondary-900">
              {formatPrice(product.price)}
            </span>
            {/* Precio original si hay descuento */}
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-secondary-500 line-through ml-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Badge de descuento */}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Información del vendedor (para productos internos) */}
        {!isExternalProduct && product.vendedor && (
          <p className="text-xs text-secondary-500 mb-3">
            Vendido por: {product.vendedor}
          </p>
        )}

        {/* Botón de agregar al carrito */}
        <div className="space-y-2">
          {inCart ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600 font-medium">
                En carrito ({quantity})
              </span>
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="flex-1 ml-3"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Agregar más
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAddToCart}
              className="w-full"
              size="sm"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Agregar al Carrito
            </Button>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-3 pt-3 border-t border-secondary-100">
          <div className="flex items-center justify-between text-xs text-secondary-500">
            <span>{productSource}</span>
            {product.stock && (
              <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;