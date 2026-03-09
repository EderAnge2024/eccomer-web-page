// Página de inicio - Cliente
import React, { useState, useEffect } from 'react';
import { Search, Star, TrendingUp, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { productService } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import toast from 'react-hot-toast';

const Home = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated } = useAuth();
  const { agregarAlCarrito } = useCart();

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
    .slice(0, 6);

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
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            ¡Bienvenido a TiendaWeb!
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Descubre los mejores productos al mejor precio
          </p>

          {/* Barra de búsqueda */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900">{productos.length}</h3>
              <p className="text-gray-500 font-medium">Productos Disponibles</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-yellow-100 p-4 rounded-full mb-4">
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900">4.8</h3>
              <p className="text-gray-500 font-medium">Calificación Promedio</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center transform transition-all hover:scale-105 hover:shadow-md">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900">98%</h3>
              <p className="text-gray-500 font-medium">Satisfacción del Cliente</p>
            </div>
          </div>
        </div>
      </section>

      {/* Productos más populares */}
      {masPopulares.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Los Más Populares
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Descubre los productos favoritos de nuestros clientes
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {masPopulares.map((producto, index) => (
                <ProductCard
                  key={`popular-${producto.id}-${index}`}
                  product={producto}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Todos los productos */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos los Productos'}
            </h2>
            <p className="text-gray-600">
              {productosFiltrados.length} productos encontrados
            </p>
          </div>

          {productosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-500">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productosFiltrados.map((producto, index) => (
                <ProductCard
                  key={`product-${producto.id}-${index}`}
                  product={producto}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

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