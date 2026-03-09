// Header principal de la aplicación web
import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X, Shield, LogOut, Home, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Header = ({ currentPage, onNavigate }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cantidadProductos } = useCart();
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    onNavigate('home');
    setMenuMobileOpen(false);
  };

  const handleNavigation = (page) => {
    onNavigate(page);
    setMenuMobileOpen(false);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => handleNavigation('home')}
          >
            <Package className="h-8 w-8 text-purple-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">TiendaWeb</span>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => handleNavigation('home')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'home'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
              }`}
            >
              <Home className="h-4 w-4 mr-1" />
              Inicio
            </button>
            
            <button
              onClick={() => handleNavigation('products')}
              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'products'
                  ? 'text-purple-600 bg-purple-50'
                  : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
              }`}
            >
              <Package className="h-4 w-4 mr-1" />
              Productos
            </button>
          </nav>

          {/* Acciones del usuario */}
          <div className="flex items-center space-x-4">
            {/* Carrito */}
            <button
              onClick={() => handleNavigation('cart')}
              className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cantidadProductos() > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cantidadProductos()}
                </span>
              )}
            </button>

            {/* Usuario autenticado */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Hola, {user?.nombre}
                </span>
                
                {/* Botón Admin */}
                {isAdmin() && (
                  <button
                    onClick={() => handleNavigation('admin')}
                    className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    <Shield className="h-4 w-4 mr-1" />
                    Admin
                  </button>
                )}
                
                {/* Perfil */}
                <button
                  onClick={() => handleNavigation('profile')}
                  className="p-2 text-gray-700 hover:text-purple-600 transition-colors"
                >
                  <User className="h-5 w-5" />
                </button>
                
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              /* Usuario no autenticado */
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => handleNavigation('login')}
                  className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => handleNavigation('register')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Registrarse
                </button>
              </div>
            )}

            {/* Botón menú móvil */}
            <button
              onClick={() => setMenuMobileOpen(!menuMobileOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-purple-600"
            >
              {menuMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {menuMobileOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleNavigation('home')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'home'
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                <Home className="h-4 w-4 mr-2" />
                Inicio
              </button>
              
              <button
                onClick={() => handleNavigation('products')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  currentPage === 'products'
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                }`}
              >
                <Package className="h-4 w-4 mr-2" />
                Productos
              </button>

              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-500 border-t border-gray-200 mt-2 pt-2">
                    Hola, {user?.nombre}
                  </div>
                  
                  {isAdmin() && (
                    <button
                      onClick={() => handleNavigation('admin')}
                      className="flex items-center px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-md text-sm font-medium"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Panel Admin
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleNavigation('profile')}
                    className="flex items-center px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-gray-50 rounded-md text-sm font-medium"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Mi Perfil
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-md text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigation('login')}
                    className="flex items-center px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-md text-sm font-medium"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => handleNavigation('register')}
                    className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700"
                  >
                    Registrarse
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;