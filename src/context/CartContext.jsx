// Context del carrito de compras
import { createContext, useContext, useState, useEffect } from 'react';
import { orderService } from '../services/orderService.js';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    try {
      const carritoGuardado = localStorage.getItem('carrito');
      return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch (error) {
      console.error('Error inicializando carrito desde localStorage:', error);
      return [];
    }
  });

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existente = prev.find(p => p.id === producto.id);
      
      if (existente) {
        // Incrementar cantidad
        return prev.map(p =>
          p.id === producto.id
            ? { ...p, cantidad: (p.cantidad || 1) + 1 }
            : p
        );
      } else {
        // Agregar nuevo producto
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
    
    toast.success('Producto agregado al carrito');
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(p => p.id !== id));
    toast.success('Producto eliminado del carrito');
  };

  const incrementarCantidad = (id) => {
    setCarrito(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, cantidad: (p.cantidad || 1) + 1 }
          : p
      )
    );
  };

  const decrementarCantidad = (id) => {
    setCarrito(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nuevaCantidad = (p.cantidad || 1) - 1;
          return nuevaCantidad <= 0 ? null : { ...p, cantidad: nuevaCantidad };
        }
        return p;
      }).filter(p => p !== null)
    );
  };

  const limpiarCarrito = () => {
    setCarrito([]);
    toast.success('Carrito vaciado');
  };

  const calcularTotal = () => {
    return carrito.reduce((total, producto) => {
      const precio = producto.precio || producto.price || 0;
      return total + (precio * (producto.cantidad || 1));
    }, 0);
  };

  const cantidadProductos = () => {
    return carrito.reduce((total, producto) => {
      return total + (producto.cantidad || 1);
    }, 0);
  };

  // Finalizar compra multi-vendedor
  const finalizarCompraMultiVendedor = async (id_usuario, id_ubicacion) => {
    try {
      if (carrito.length === 0) {
        toast.error('El carrito está vacío');
        return { success: false, message: 'El carrito está vacío' };
      }

      console.log('🛒 Finalizando compra multi-vendedor:', { 
        id_usuario, 
        productos: carrito.length, 
        id_ubicacion 
      });

      // Preparar productos para el backend
      const productos = carrito.map(p => ({
        id: p.id,
        nombre: p.nombre,
        precio: p.precio,
        cantidad: p.cantidad || 1,
        imagen: p.imagen
      }));

      // Procesar compra con división automática por vendedor
      const resultado = await orderService.createPedidoMultiVendedor({
        id_usuario,
        productos,
        id_ubicacion
      });

      if (resultado.success) {
        // Limpiar el carrito después de crear el pedido
        limpiarCarrito();
        toast.success('¡Pedido creado exitosamente!');
        
        return {
          success: true,
          message: resultado.message,
          resultado: resultado.resultado
        };
      } else {
        toast.error(resultado.message || 'Error al procesar el pedido');
        return {
          success: false,
          message: resultado.message
        };
      }
    } catch (error) {
      console.error('Error al finalizar compra multi-vendedor:', error);
      toast.error('Error al procesar el pedido');
      return { 
        success: false, 
        message: 'Error al procesar el pedido' 
      };
    }
  };

  const value = {
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    incrementarCantidad,
    decrementarCantidad,
    limpiarCarrito,
    calcularTotal,
    cantidadProductos,
    finalizarCompraMultiVendedor
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};