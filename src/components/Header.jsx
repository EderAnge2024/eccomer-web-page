import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useSearch } from '../context/SearchContext'
import { Search, ShoppingCart } from 'lucide-react'
import { useState, useEffect } from 'react'

const Header = () => {
  const { user, logout, isAdmin } = useAuth()
  const { cantidadProductos } = useCart()
  const { searchTerm, updateSearch, clearSearch } = useSearch()
  const location = useLocation()
  const navigate = useNavigate()
  const [localSearchTerm, setLocalSearchTerm] = useState('')

  // Sincronizar el término de búsqueda local con el contexto
  useEffect(() => {
    setLocalSearchTerm(searchTerm)
  }, [searchTerm])

  // Limpiar búsqueda cuando no estamos en la página de productos
  useEffect(() => {
    if (location.pathname !== '/products') {
      clearSearch()
      setLocalSearchTerm('')
    }
  }, [location.pathname, clearSearch])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (localSearchTerm.trim()) {
      updateSearch(localSearchTerm.trim())
      navigate('/products')
    } else {
      clearSearch()
      if (location.pathname === '/products') {
        // Si ya estamos en productos, solo limpiar la búsqueda
      } else {
        navigate('/products')
      }
    }
  }

  const handleSearchInputChange = (e) => {
    const value = e.target.value
    setLocalSearchTerm(value)
    
    // Si estamos en la página de productos, actualizar la búsqueda en tiempo real
    if (location.pathname === '/products') {
      if (value.trim()) {
        updateSearch(value.trim())
      } else {
        clearSearch()
      }
    }
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            TiendaEcommerce
          </Link>

          {/* Buscador */}
          <div className="search-container">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-container">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={localSearchTerm}
                  onChange={handleSearchInputChange}
                  className="search-input"
                />
                {localSearchTerm && (
                  <button 
                    type="button" 
                    className="search-clear-btn"
                    onClick={() => {
                      setLocalSearchTerm('')
                      clearSearch()
                    }}
                  >
                    ×
                  </button>
                )}
                <button type="submit" className="search-button">
                  Buscar
                </button>
              </div>
            </form>
          </div>

          <nav>
            <ul className="nav-menu">
              <li>
                <Link 
                  to="/" 
                  className={`nav-link ${isActive('/') ? 'active' : ''}`}
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className={`nav-link ${isActive('/products') ? 'active' : ''}`}
                >
                  Productos
                </Link>
              </li>
              {isAdmin() && (
                <li>
                  <Link 
                    to="/admin" 
                    className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="header-actions">
            <Link to="/cart" className="cart-button">
              <ShoppingCart size={20} />
              <span className="cart-count">{cantidadProductos()}</span>
            </Link>

            {user ? (
              <div className="user-menu">
                <span className="user-greeting">Hola, {user.nombre}</span>
                <Link to="/profile" className="btn btn-secondary">
                  Perfil
                </Link>
                <button 
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-secondary">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header