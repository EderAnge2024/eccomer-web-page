import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from 'lucide-react';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import './ProductHeroSlider.css';

const ProductHeroSlider = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const { agregarAlCarrito } = useCart();

  const fetchPopularProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productService.getProductosCombinados();
      if (response.success) {
        // Obtenemos los 10 más populares basados en rating count o simplemente los primeros 10 si no hay suficientes ratings
        const popular = response.productos
          .filter(p => p.rating?.count > 0 || p.rating_count > 0)
          .sort((a, b) => {
            const countA = a.rating?.count || a.rating_count || 0;
            const countB = b.rating?.count || b.rating_count || 0;
            return countB - countA;
          })
          .slice(0, 10);
        
        setProducts(popular.length > 0 ? popular : response.productos.slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching popular products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPopularProducts();
  }, [fetchPopularProducts]);

  // Auto-play
  useEffect(() => {
    if (products.length === 0 || loading) return;
    
    const timer = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, products.length, loading]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const handleDotClick = (index) => {
    if (index === currentIndex || isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex(index);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const productForCart = {
      id: product.id_producto || product.id,
      nombre: product.title || product.nombre,
      precio: product.price || product.precio,
      imagen: product.image || product.imagen,
      stock: product.stock
    };
    agregarAlCarrito(productForCart);
  };

  if (loading) {
    return (
      <div className="slider-skeleton">
        <div className="skeleton-loader"></div>
      </div>
    );
  }

  if (products.length === 0) return null;

  const currentProduct = products[currentIndex];

  return (
    <div className="premium-hero-slider">
      <div className="slider-container">
        {products.map((product, index) => (
          <div 
            key={product.id || product.id_producto || index}
            className={`slide ${index === currentIndex ? 'active' : ''} ${index === (currentIndex - 1 + products.length) % products.length ? 'prev' : ''}`}
          >
            <div className="slide-bg">
              <div className="bg-overlay"></div>
              <img src={product.image || product.imagen} alt={product.title} className="bg-img-blur" />
            </div>
            
            <div className="slide-content">
              <div className="slide-grid">
                <div className="slide-image-wrapper">
                  <img 
                    src={product.image || product.imagen} 
                    alt={product.title} 
                    className="slide-main-image"
                  />
                </div>
                
                <div className="slide-info">
                  <div className="slide-badge">Popular Choice</div>
                  <h1 className="slide-title">{product.title || product.nombre}</h1>
                  
                  <div className="slide-meta">
                    <div className="slide-rating">
                      <Star className="star-icon" size={18} fill="#ffcc00" color="#ffcc00" />
                      <span>{product.rating?.rate || product.rating_rate || '4.5'}</span>
                    </div>
                    <div className="slide-price">
                      S/ {(product.price || product.precio || 0).toFixed(2)}
                    </div>
                  </div>

                  <p className="slide-description">
                    {(product.description || product.descripcion || 'Premium selection with exclusive features. Experience quality and performance like never before.').substring(0, 160)}...
                  </p>

                  <div className="slide-actions">
                    <button 
                      className="btn-purple-glowing"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <ShoppingCart size={20} />
                      Featured Purchase
                    </button>
                    <button className="btn-outline-glass">View Details</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="nav-btn prev" onClick={handlePrev}>
        <ChevronLeft size={32} />
      </button>
      <button className="nav-btn next" onClick={handleNext}>
        <ChevronRight size={32} />
      </button>

      <div className="slider-dots">
        {products.map((_, index) => (
          <button 
            key={index} 
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductHeroSlider;
