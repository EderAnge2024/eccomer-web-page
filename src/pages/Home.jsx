// Página de inicio - Cliente
import React, { useState, useEffect } from 'react';
import { Search, Star, TrendingUp, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import ProductHeroSlider from '../components/ui/ProductHeroSlider';
import toast from 'react-hot-toast';

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();
  const { agregarAlCarrito } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      console.log('🛍️ Cargando productos para el catálogo web...');

      const response = await productService.getProductosCombinados();

      if (response.success) {
        setProductos(response.productos);
        console.log(`✅ ${response.productos.length} productos cargados`);

        if (response.stats) {
          console.log(`📊 BD: ${response.stats.database}, API externa: ${response.stats.api}`);
        }
      } else {
        console.error('❌ Error cargando productos:', response.message);
        toast.error('Error al cargar los productos');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (producto) => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    if (producto.stock === 0) {
      toast.error('Este producto no tiene stock disponible');
      return;
    }

    const productoCarrito = {
      id: producto.id,
      nombre: producto.title || producto.nombre,
      precio: producto.price || producto.precio,
      imagen: producto.image || producto.imagen,
      stock: producto.stock
    };

    agregarAlCarrito(productoCarrito);
  };

  // Filtrar productos por búsqueda
  const productosFiltrados = searchTerm
    ? productos.filter(p =>
      (p.title || p.nombre)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : productos;

  // Productos más populares (por rating)
  const masPopulares = productosFiltrados
    .filter(p => p.rating?.count > 0)
    .sort((a, b) => (b.rating?.count || 0) - (a.rating?.count || 0))
    .slice(0, 25);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Dynamic Slider */}
      <ProductHeroSlider />

      {/* Productos más populares */}
      {masPopulares.length > 0 && (
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-40">
            <div className="text-center mb-16 relative mt-20">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Los Más Populares
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 mx-auto rounded-full mb-6"></div>
            </div>

            {/* Layout de Grilla Forzado con CSS Directo - 5 por fila (Garantizado) */}
            <div
              className="grid-container-forced"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '15px',
                width: '100%',
                justifyContent: 'start'
              }}
            >
              {masPopulares.map((producto, index) => (
                <div
                  key={`popular-${producto.id}-${index}`}
                  style={{ width: '100%', minHeight: '400px' }}
                  className="transition-all duration-300 hover:-translate-y-2"
                >
                  <ProductCard
                    product={producto}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>

            {/* Estilos adicionales para asegurar el comportamiento de 5 columnas en XL */}
            <style dangerouslySetInnerHTML={{
              __html: `
              @media (min-width: 1280px) {
                .grid-container-forced {
                  grid-template-columns: repeat(5, 1fr) !important;
                }
              }
              @media (max-width: 1279px) and (min-width: 1024px) {
                .grid-container-forced {
                  grid-template-columns: repeat(4, 1fr) !important;
                }
              }
              @media (max-width: 1023px) and (min-width: 768px) {
                .grid-container-forced {
                  grid-template-columns: repeat(3, 1fr) !important;
                }
              }
              @media (max-width: 767px) {
                .grid-container-forced {
                  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)) !important;
                }
              }
            `}} />
          </div>

          {/* Adorno lateral sutil */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
        </section>
      )}

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 bg-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para comenzar a comprar?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Regístrate ahora y obtén acceso a ofertas exclusivas
            </p>
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Registrarse Gratis
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;