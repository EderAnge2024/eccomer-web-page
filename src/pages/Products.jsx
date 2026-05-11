import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ui/ProductCard'
import Loading from '../components/ui/Loading'
import CategoryCard from '../components/ui/CategoryCard'
import { useSearch } from '../context/SearchContext'
import { productService } from '../services/productService'
import { 
  Shirt, 
  Smartphone, 
  Gem, 
  Laptop, 
  ShirtIcon as Dress,
  Filter,
  Grid3X3,
  List,
  Search,
  Tag
} from 'lucide-react'

// Mapeo de categorías con iconos (igual que en la app móvil)
const categoryIcons = {
  "men's clothing": { icon: Shirt, label: "Ropa Hombre", color: "#3B82F6" },
  "women's clothing": { icon: Dress, label: "Ropa Mujer", color: "#EC4899" },
  "jewelery": { icon: Gem, label: "Joyería", color: "#F59E0B" },
  "electronics": { icon: Laptop, label: "Electrónicos", color: "#10B981" },
}

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('nombre')
  const [filterBy, setFilterBy] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid') // 'grid' o 'list'
  
  const location = useLocation()
  const navigate = useNavigate()
  const { searchTerm } = useSearch()

  useEffect(() => {
    fetchProducts()
  }, [])

  // Manejar parámetros de URL para categoría
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const categoryParam = urlParams.get('category')
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam)
    }
  }, [location.search])

  const fetchProducts = async () => {
    try {
      const result = await productService.getProductosCombinados()
      if (result.success) {
        setProducts(result.productos || [])
      } else {
        console.error('Error fetching products:', result.message)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Obtener categorías únicas
  const categories = [...new Set(products.map(p => p.category || p.categoria).filter(Boolean))]

  // Manejar selección de categoría
  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    
    // Actualizar URL con la categoría seleccionada
    const urlParams = new URLSearchParams(location.search)
    if (category === 'all') {
      urlParams.delete('category')
    } else {
      urlParams.set('category', category)
    }
    
    const newSearch = urlParams.toString()
    const newPath = newSearch ? `/products?${newSearch}` : '/products'
    navigate(newPath, { replace: true })
  }

  const filteredAndSortedProducts = products
    .filter(product => {
      // Manejar tanto 'title' como 'nombre' y 'description' como 'descripcion'
      const nombre = product.title || product.nombre || '';
      const descripcion = product.description || product.descripcion || '';
      const categoria = product.category || product.categoria || '';
      
      // Filtro por búsqueda (usando el contexto)
      let matchesSearch = true
      if (searchTerm) {
        matchesSearch = (nombre && nombre.toLowerCase().includes(searchTerm)) ||
                       (descripcion && descripcion.toLowerCase().includes(searchTerm)) ||
                       (categoria && categoria.toLowerCase().includes(searchTerm))
      }
      
      // Filtro por categoría
      const matchesCategory = selectedCategory === 'all' || categoria === selectedCategory
      
      // Filtro por stock
      let matchesStock = true
      if (filterBy === 'in-stock') matchesStock = (product.stock || 0) > 0
      if (filterBy === 'out-of-stock') matchesStock = (product.stock || 0) === 0
      
      return matchesSearch && matchesCategory && matchesStock
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'precio-asc':
          return (a.price || a.precio || 0) - (b.price || b.precio || 0)
        case 'precio-desc':
          return (b.price || b.precio || 0) - (a.price || a.precio || 0)
        case 'nombre':
          const nombreA = a.title || a.nombre || '';
          const nombreB = b.title || b.nombre || '';
          return nombreA.localeCompare(nombreB)
        case 'stock':
          return (b.stock || 0) - (a.stock || 0)
        default:
          return 0
      }
    })

  return (
    <div className="products-page">
      <div className="container">
        {/* Categorías */}
        <div className="categories-section">
          <h2 className="section-title">Categorías</h2>
          <div className="categories-grid">
            <CategoryCard
              category="all"
              isActive={selectedCategory === 'all'}
              onSelect={handleCategorySelect}
              label="Todas"
              count={products.length}
            />
            
            {categories.map(category => {
              const categoryInfo = categoryIcons[category] || { 
                icon: Tag, 
                label: category.charAt(0).toUpperCase() + category.slice(1), 
                color: "#6B7280" 
              }
              const productCount = products.filter(p => 
                (p.category || p.categoria) === category
              ).length

              return (
                <CategoryCard
                  key={category}
                  category={category}
                  isActive={selectedCategory === category}
                  onSelect={handleCategorySelect}
                  icon={categoryInfo.icon}
                  label={categoryInfo.label}
                  color={categoryInfo.color}
                  count={productCount}
                />
              )
            })}
          </div>
        </div>

        {/* Productos de la categoría seleccionada */}
        <div className="results-section">
          {loading ? (
            <Loading message="Cargando productos..." />
          ) : filteredAndSortedProducts.length > 0 ? (
            <>
              <div className="results-header">
                <h3 className="category-products-title">
                  {selectedCategory === 'all' ? 
                    'Todos los productos' : 
                    categoryIcons[selectedCategory]?.label || selectedCategory
                  }
                  <span className="results-count-badge">
                    {filteredAndSortedProducts.length}
                  </span>
                </h3>
                {searchTerm && (
                  <p className="search-results-info">
                    Resultados de búsqueda para "{searchTerm}"
                  </p>
                )}
              </div>
              
              <div className={`products-container ${viewMode}`}>
                {filteredAndSortedProducts.map(product => (
                  <ProductCard 
                    key={product.id || product.id_producto} 
                    product={product} 
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">
                <Search size={64} />
              </div>
              <h3>No se encontraron productos</h3>
              <p>
                {searchTerm 
                  ? `No hay productos que coincidan con "${searchTerm}"`
                  : selectedCategory !== 'all'
                  ? `No hay productos en la categoría "${categoryIcons[selectedCategory]?.label || selectedCategory}"`
                  : 'No hay productos disponibles'
                }
              </p>
              {(searchTerm || selectedCategory !== 'all' || filterBy !== 'all') && (
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedCategory('all')
                    setFilterBy('all')
                    navigate('/products', { replace: true })
                  }}
                >
                  Ver todos los productos
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products