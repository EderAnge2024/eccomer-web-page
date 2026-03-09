// Componente del carrito lateral
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Button from '../ui/Button.jsx';
import { formatPrice, formatImageUrl } from '../../utils/formatters.js';

const CartSidebar = () => {
  const { 
    isOpen, 
    items, 
    total, 
    itemCount, 
    toggleCart, 
    updateQuantity, 
    removeFromCart 
  } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toggleCart();
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    toggleCart();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    toggleCart();
    navigate('/productos');
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={toggleCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-secondary-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-start justify-between p-4 border-b border-secondary-200">
                      <Dialog.Title className="text-lg font-medium text-secondary-900">
                        Carrito de Compras
                      </Dialog.Title>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          className="relative -m-2 p-2 text-secondary-400 hover:text-secondary-500"
                          onClick={toggleCart}
                        >
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Cerrar panel</span>
                          <X className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    {/* Contenido del carrito */}
                    <div className="flex-1 overflow-y-auto">
                      {items.length === 0 ? (
                        // Carrito vacío
                        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                          <ShoppingBag className="h-16 w-16 text-secondary-300 mb-4" />
                          <h3 className="text-lg font-medium text-secondary-900 mb-2">
                            Tu carrito está vacío
                          </h3>
                          <p className="text-secondary-500 mb-6">
                            Agrega algunos productos para comenzar tu compra
                          </p>
                          <Button onClick={handleContinueShopping}>
                            Explorar Productos
                          </Button>
                        </div>
                      ) : (
                        // Lista de productos
                        <div className="p-4 space-y-4">
                          {items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 bg-secondary-50 rounded-lg p-3">
                              {/* Imagen del producto */}
                              <div className="flex-shrink-0">
                                <img
                                  src={formatImageUrl(item.image)}
                                  alt={item.title}
                                  className="h-16 w-16 rounded-lg object-cover"
                                  onError={(e) => {
                                    e.target.src = '/placeholder-image.jpg';
                                  }}
                                />
                              </div>

                              {/* Información del producto */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-secondary-900 truncate">
                                  {item.title}
                                </h4>
                                <p className="text-sm text-secondary-500">
                                  {formatPrice(item.price)} c/u
                                </p>
                                
                                {/* Controles de cantidad */}
                                <div className="flex items-center space-x-2 mt-2">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 rounded-md hover:bg-secondary-200 transition-colors"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="h-4 w-4 text-secondary-600" />
                                  </button>
                                  
                                  <span className="text-sm font-medium text-secondary-900 min-w-[2rem] text-center">
                                    {item.quantity}
                                  </span>
                                  
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 rounded-md hover:bg-secondary-200 transition-colors"
                                  >
                                    <Plus className="h-4 w-4 text-secondary-600" />
                                  </button>
                                </div>
                              </div>

                              {/* Precio total y eliminar */}
                              <div className="flex flex-col items-end space-y-2">
                                <p className="text-sm font-medium text-secondary-900">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer con total y botones */}
                    {items.length > 0 && (
                      <div className="border-t border-secondary-200 p-4 space-y-4">
                        {/* Resumen */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-secondary-600">
                              Subtotal ({itemCount} productos)
                            </span>
                            <span className="text-secondary-900 font-medium">
                              {formatPrice(total)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-secondary-600">Envío</span>
                            <span className="text-secondary-900">
                              {total >= 100000 ? 'Gratis' : formatPrice(15000)}
                            </span>
                          </div>
                          <div className="border-t border-secondary-200 pt-2">
                            <div className="flex justify-between text-base font-medium">
                              <span className="text-secondary-900">Total</span>
                              <span className="text-secondary-900">
                                {formatPrice(total + (total >= 100000 ? 0 : 15000))}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="space-y-2">
                          <Button
                            onClick={handleCheckout}
                            className="w-full"
                            size="lg"
                          >
                            {isAuthenticated ? 'Proceder al Pago' : 'Iniciar Sesión para Comprar'}
                          </Button>
                          
                          <Button
                            variant="outline"
                            onClick={handleContinueShopping}
                            className="w-full"
                          >
                            Continuar Comprando
                          </Button>
                        </div>

                        {/* Mensaje de envío gratis */}
                        {total < 100000 && (
                          <div className="text-center">
                            <p className="text-xs text-secondary-500">
                              Agrega {formatPrice(100000 - total)} más para envío gratis
                            </p>
                            <div className="w-full bg-secondary-200 rounded-full h-2 mt-2">
                              <div
                                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${Math.min((total / 100000) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CartSidebar;