// Componente de tarjeta de categoría reutilizable
import { Grid3X3, Tag } from 'lucide-react'

const CategoryCard = ({ 
  category, 
  isActive, 
  onSelect, 
  icon: IconComponent, 
  label, 
  color, 
  count 
}) => {
  const handleClick = () => {
    onSelect(category)
  }

  return (
    <button
      className={`category-card ${isActive ? 'active' : ''}`}
      onClick={handleClick}
    >
      <div 
        className={`category-icon ${category === 'all' ? 'all-categories' : ''}`}
        style={category !== 'all' ? { 
          backgroundColor: `${color}20`, 
          color: color 
        } : {}}
      >
        {category === 'all' ? (
          <Grid3X3 size={24} />
        ) : (
          <IconComponent size={24} />
        )}
      </div>
      <span className="category-label">{label}</span>
      <span className="category-count">{count}</span>
    </button>
  )
}

export default CategoryCard