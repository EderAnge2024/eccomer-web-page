// Página del Carrito de Compras
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, MapPin, Lock, CreditCard, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { locationService } from '../services/locationService';
import CartItemCard from '../components/ui/CartItemCard';
import toast from 'react-hot-toast';
import './Cart.css';

const Cart = ({ onNavigate }) => {
  const { 
    carrito, 
    eliminarDelCarrito, 
    incrementarCantidad, 
    decrementarCantidad, 
    limpiarCarrito,
    calcularTotal,
    cantidadProductos,
    finalizarCompraMultiVendedor
  } = useCart();
  
  const { user, isAuthenticated } = useAuth();
  
  const [ubicaciones, setUbicaciones] = useState([]);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null);
  const [loadingUbicaciones, setLoadingUbicaciones] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.id_usuario) {
      cargarUbicaciones();
    }
  }, [isAuthenticated, user]);

  const cargarUbicaciones = async () => {
    try {
      setLoadingUbicaciones(true);
      const response = await locationService.getUbicacionesByUser(user.id_usuario);
      
      if (response.success) {
        setUbicaciones(response.ubicaciones || []);
        
        // Seleccionar la principal por defecto
        const principal = response.ubicaciones?.find(u => u.es_principal);
        if (principal) {
          setUbicacionSeleccionada(principal.id_ubicacion);
        } else if (response.ubicaciones?.length > 0) {
          setUbicacionSeleccionada(response.ubicaciones[0].id_ubicacion);
        }
      }
    } catch (error) {
      console.error('Error cargando ubicaciones:', error);
    } finally {
      setLoadingUbicaciones(false);
    }
  };

  const handleFinalizarCompra = () => {
    if (carrito.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para realizar una compra');
      onNavigate?.('login');
      return;
    }

    if (ubicaciones.length === 0) {
      toast.error('Debes agregar una dirección de envío');
      onNavigate?.('profile');
      return;
    }

    if (!ubicacionSeleccionada) {
      toast.error('Por favor selecciona una dirección de envío');
      return;
    }

    setShowPasswordModal(true);
  };

  const handleConfirmarCompra = async () => {
    if (!password) {
      toast.error('Por favor ingresa tu contraseña');
      return;
    }

    try {
      setProcessing(true);

      // Verificar contraseña (simulado - en producción deberías verificar con el backend)
      // Por ahora solo procesamos el pedido
      
      const resultado = await finalizarCompraMultiVendedor(
        user.id_usuario,
        ubicacionSeleccionada
      );

      if (resultado.success) {
        setShowPasswordModal(false);
        setPassword('');
        toast.success('¡Pedido realizado exitosamente!');
        
        // Navegar a perfil para ver pedidos
        setTimeout(() => {
          onNavigate?.('profile');
        }, 2000);
      }
    } catch (error) {
      console.error('Error al finalizar compra:', error);
      toast.error('Error al procesar el pedido');
    } finally {
      setProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Inicia sesión para ver tu carrito
          </h2>
          <p className="text-gray-600 mb-6">
            Necesitas una cuenta para agregar productos al carrito
          </p>
          <button
            onClick={() => onNavigate?.('login')}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (carrito.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-600 mb-6">
            Agrega productos para comenzar tu compra
          </p>
          <button
            onClick={() => onNavigate?.('products')}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-premium py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="cart-header-section flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div>
            <h1 className="cart-title-premium flex items-center gap-4">
              Mi Carrito
            </h1>
            <p className="text-slate-500 mt-3 font-semibold text-lg">
              Estás a un paso de completar tu pedido premium.
            </p>
          </div>
          
          <div className="cart-count-badge-premium">
            {cantidadProductos()} {cantidadProductos() === 1 ? 'Producto' : 'Productos'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {carrito.map((item) => (
                <CartItemCard 
                  key={item.id}
                  item={item}
                  onIncrement={incrementarCantidad}
                  onDecrement={decrementarCantidad}
                  onRemove={eliminarDelCarrito}
                />
              ))}
            </div>

            {/* Acciones del carrito */}
            <div className="flex flex-col sm:flex-row gap-6 pt-8">
              <button
                onClick={() => onNavigate?.('products')}
                className="btn-secondary-premium flex-1"
              >
                <ArrowLeft className="h-6 w-6" />
                Seguir Comprando
              </button>
              <button
                onClick={limpiarCarrito}
                className="btn-danger-premium flex-1"
              >
                <Trash2 className="h-6 w-6" />
                Vaciar Carrito
              </button>
            </div>
          </div>

          {/* Resumen y checkout */}
          <div className="lg:col-span-1">
            <div className="summary-box-premium">
              <h2 className="summary-title-premium">
                <CreditCard className="text-purple-600" />
                Resumen del Pedido
              </h2>
 

              {/* Dirección de envío */}
              {isAuthenticated && (
                <div className="shipping-selector-premium">
                  <div className="shipping-label">
                    <MapPin className="h-5 w-5" />
                    Enviar a:
                  </div>
                  
                  {loadingUbicaciones ? (
                    <p className="text-sm text-gray-500 animate-pulse">Cargando direcciones...</p>
                  ) : ubicaciones.length === 0 ? (
                    <button
                      onClick={() => onNavigate?.('profile')}
                      className="w-full py-3 border-2 border-dashed border-purple-200 rounded-xl text-sm text-purple-600 hover:bg-purple-50 transition-all font-bold"
                    >
                      + Agregar dirección
                    </button>
                  ) : (
                    <select
                      value={ubicacionSeleccionada || ''}
                      onChange={(e) => setUbicacionSeleccionada(Number(e.target.value))}
                      className="shipping-select-premium"
                    >
                      {ubicaciones.map((ubicacion) => (
                        <option key={ubicacion.id_ubicacion} value={ubicacion.id_ubicacion}>
                          {ubicacion.nombre} - {ubicacion.direccion}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Desglose de precios */}
              <div className="space-y-4 mb-8">
                <div className="summary-row">
                  <span>Productos</span>
                  <span>S/ {calcularTotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Costo de Envío</span>
                  <span className="text-emerald-600 font-bold">¡GRATIS!</span>
                </div>
              </div>

              {/* Total */}
              <div className="summary-total-row">
                <span className="total-label">Total estimado</span>
                <span className="total-amount">
                  S/ {calcularTotal().toFixed(2)}
                </span>
              </div>

              {/* Botón finalizar compra */}
              <button
                onClick={handleFinalizarCompra}
                className="btn-checkout-premium mt-8"
              >
                <CreditCard className="h-6 w-6" />
                Proceder al Pago
              </button>

              <p className="text-xs text-gray-500 text-center">
                Al finalizar la compra, aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación premium */}
      {showPasswordModal && (
        <div className="modal-overlay-premium">
          <div className="modal-content-premium">
            <div className="modal-header-premium">
              <div className="modal-icon-container">
                <Lock className="h-10 w-10" />
              </div>
              <h3 className="modal-title-premium">Confirmar Compra</h3>
              <p className="modal-subtitle-premium">
                Ingresa tu contraseña para autorizar la transacción
              </p>
            </div>

            {/* Resumen mini */}
            <div className="order-summary-mini">
              <div className="mini-summary-item">
                <span>Items en el pedido:</span>
                <span>{cantidadProductos()}</span>
              </div>
              <div className="mini-summary-item">
                <span>Envío:</span>
                <span className="text-emerald-600 font-bold">GRATIS</span>
              </div>
              <div className="mini-summary-total">
                <span>Total a pagar:</span>
                <span className="text-purple-600">S/ {calcularTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Password input */}
            <div className="input-premium-container">
              <label className="input-label-premium">Tu Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field-premium"
                  placeholder="••••••••"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Modal actions */}
            <div className="modal-actions-premium">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                  setShowPassword(false);
                }}
                disabled={processing}
                className="btn-secondary-premium flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarCompra}
                disabled={processing || !password}
                className="btn-checkout-premium flex-1 mb-0"
              >
                {processing ? 'Procesando...' : 'Confirmar Pago'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
