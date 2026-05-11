import React from 'react';
import { Trash2, Plus, Minus, Package } from 'lucide-react';
import './CartItemCard.css';

const CartItemCard = ({ 
  item, 
  onIncrement, 
  onDecrement, 
  onRemove 
}) => {
  const stock = item.stock || 0;
  const hasStock = stock > 0;
  
  return (
    <div className="cart-item-card">
      <div className="cart-item-image-container">
        {item.imagen && item.imagen.trim() !== '' ? (
          <img
            src={item.imagen}
            alt={item.nombre}
            className="cart-item-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
            }}
          />
        ) : (
          <div className="cart-item-no-image">
            <Package size={32} />
          </div>
        )}
      </div>

      <div className="cart-item-content">
        <div className="cart-item-info">
          <h3 className="cart-item-name">{item.nombre}</h3>
          <div className="cart-item-pricing">
            <span className="cart-item-unit-price">S/ {item.precio?.toFixed(2)}</span>
            <span className="cart-item-subtotal-label">Subtotal:</span>
            <span className="cart-item-subtotal">S/ {(item.precio * (item.cantidad || 1)).toFixed(2)}</span>
          </div>
        </div>

        <div className="cart-item-controls">
          <div className="quantity-selector">
            <button
              onClick={() => onDecrement(item.id)}
              className="qty-btn"
              title="Disminuir"
            >
              <Minus size={16} />
            </button>
            <span className="qty-value">{item.cantidad || 1}</span>
            <button
              onClick={() => onIncrement(item.id)}
              className="qty-btn"
              title="Aumentar"
              disabled={item.cantidad >= stock}
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="cart-item-remove-btn"
            title="Eliminar del carrito"
          >
            <Trash2 size={18} />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
