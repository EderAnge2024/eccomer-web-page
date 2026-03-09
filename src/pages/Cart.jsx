// Página del Carrito de Compras
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, MapPin, Lock, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { locationService } from '../services/locationService';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8" />
            Mi Carrito
            <span className="text-lg font-normal text-gray-500">
              ({cantidadProductos()} {cantidadProductos() === 1 ? 'producto' : 'productos'})
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {carrito.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-4">
                  {/* Imagen */}
                  {item.imagen && item.imagen.trim() !== '' && (
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-24 h-24 object-contain rounded-lg bg-gray-50"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                      }}
                    />
                  )}

                  {/* Información */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.nombre}
                    </h3>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-2xl font-bold text-purple-600">
                        S/ {item.precio.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500">
                        x {item.cantidad || 1}
                      </span>
                    </div>

                    {/* Controles de cantidad */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => decrementarCantidad(item.id)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 font-semibold">
                          {item.cantidad || 1}
                        </span>
                        <button
                          onClick={() => incrementarCantidad(item.id)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => eliminarDelCarrito(item.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                    <p className="text-xl font-bold text-gray-900">
                      S/ {(item.precio * (item.cantidad || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Botón vaciar carrito */}
            <button
              onClick={limpiarCarrito}
              className="w-full py-3 border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="h-5 w-5" />
              Vaciar Carrito
            </button>
          </div>

          {/* Resumen y checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Resumen del Pedido
              </h2>

              {/* Dirección de envío */}
              {isAuthenticated && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <h3 className="font-semibold text-gray-900">Enviar a:</h3>
                  </div>
                  
                  {loadingUbicaciones ? (
                    <p className="text-sm text-gray-500">Cargando direcciones...</p>
                  ) : ubicaciones.length === 0 ? (
                    <button
                      onClick={() => onNavigate?.('profile')}
                      className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-purple-600 hover:text-purple-600 transition-colors"
                    >
                      + Agregar dirección de envío
                    </button>
                  ) : (
                    <select
                      value={ubicacionSeleccionada || ''}
                      onChange={(e) => setUbicacionSeleccionada(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>S/ {calcularTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-purple-600">
                  S/ {calcularTotal().toFixed(2)}
                </span>
              </div>

              {/* Botón finalizar compra */}
              <button
                onClick={handleFinalizarCompra}
                className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                <CreditCard className="h-5 w-5" />
                Finalizar Compra
              </button>

              <p className="text-xs text-gray-500 text-center">
                Al finalizar la compra, aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación con contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <Lock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Confirmar Pedido
              </h3>
              <p className="text-gray-600">
                Ingresa tu contraseña para confirmar la compra
              </p>
            </div>

            {/* Resumen de productos */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-48 overflow-y-auto">
              <p className="font-semibold text-gray-900 mb-2">Productos:</p>
              {carrito.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{item.nombre} x{item.cantidad}</span>
                  <span>S/ {(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-gray-300 mt-2 pt-2 flex justify-between font-bold text-gray-900">
                <span>Total:</span>
                <span>S/ {calcularTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Campo de contraseña */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Ingresa tu contraseña"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword('');
                  setShowPassword(false);
                }}
                disabled={processing}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarCompra}
                disabled={processing || !password}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Procesando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
