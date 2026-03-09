// Hook para manejar pedidos
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '../api/orders.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';

// Hook para obtener todos los pedidos (admin)
export const useOrders = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.getAllOrders,
    staleTime: 2 * 60 * 1000, // 2 minutos
    cacheTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    onError: (error) => {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar los pedidos');
    }
  });
};

// Hook para obtener un pedido por ID
export const useOrder = (id) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersService.getOrderById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error('Error fetching order:', error);
      toast.error('Error al cargar el pedido');
    }
  });
};

// Hook para obtener pedidos por usuario
export const useOrdersByUser = (userId) => {
  return useQuery({
    queryKey: ['orders', 'user', userId],
    queryFn: () => ordersService.getOrdersByUser(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error('Error fetching user orders:', error);
      toast.error('Error al cargar tus pedidos');
    }
  });
};

// Hook para obtener pedidos por administrador
export const useOrdersByAdmin = (adminId) => {
  return useQuery({
    queryKey: ['orders', 'admin', adminId],
    queryFn: () => ordersService.getOrdersByAdmin(adminId),
    enabled: !!adminId,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: 2
  });
};

// Hook para obtener pedidos por vendedor
export const useOrdersByVendor = (vendorId) => {
  return useQuery({
    queryKey: ['orders', 'vendor', vendorId],
    queryFn: () => ordersService.getOrdersByVendor(vendorId),
    enabled: !!vendorId,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: 2
  });
};

// Hook para obtener resumen de pedido maestro
export const useMasterOrderSummary = (masterOrderId) => {
  return useQuery({
    queryKey: ['order', 'master', masterOrderId],
    queryFn: () => ordersService.getMasterOrderSummary(masterOrderId),
    enabled: !!masterOrderId,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
    retry: 2
  });
};

// Hook para preview de división de pedido
export const useOrderDivisionPreview = () => {
  return useMutation({
    mutationFn: ordersService.previewOrderDivision,
    onError: (error) => {
      console.error('Error getting order division preview:', error);
      toast.error('Error al calcular la división del pedido');
    }
  });
};

// Hook para crear pedido simple
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: ordersService.createOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['orders', 'user', user?.id_usuario]);
      toast.success('Pedido creado exitosamente');
    },
    onError: (error) => {
      console.error('Error creating order:', error);
      toast.error(error.message || 'Error al crear el pedido');
    }
  });
};

// Hook para crear pedido multi-vendedor
export const useCreateMultiVendorOrder = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: ordersService.createMultiVendorOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['orders', 'user', user?.id_usuario]);
      toast.success('Pedido multi-vendedor creado exitosamente');
    },
    onError: (error) => {
      console.error('Error creating multi-vendor order:', error);
      toast.error(error.message || 'Error al crear el pedido');
    }
  });
};

// Hook para actualizar pedido
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => ordersService.updateOrder(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['order', variables.id]);
      toast.success('Pedido actualizado exitosamente');
    },
    onError: (error) => {
      console.error('Error updating order:', error);
      toast.error(error.message || 'Error al actualizar el pedido');
    }
  });
};

// Hook para actualizar estado del pedido
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }) => ordersService.updateOrderStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['order', variables.id]);
      toast.success('Estado del pedido actualizado');
    },
    onError: (error) => {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'Error al actualizar el estado');
    }
  });
};

// Hook para eliminar pedido
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ordersService.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      toast.success('Pedido eliminado exitosamente');
    },
    onError: (error) => {
      console.error('Error deleting order:', error);
      toast.error(error.message || 'Error al eliminar el pedido');
    }
  });
};

// Hook para obtener notificaciones de pedidos
export const useOrderNotifications = (userId, onlyUnread = false) => {
  return useQuery({
    queryKey: ['notifications', 'orders', userId, onlyUnread],
    queryFn: () => ordersService.getOrderNotifications(userId, onlyUnread),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minuto
    cacheTime: 2 * 60 * 1000, // 2 minutos
    retry: 2,
    refetchInterval: 30 * 1000 // Refetch cada 30 segundos
  });
};

// Hook para marcar notificación como leída
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ordersService.markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    },
    onError: (error) => {
      console.error('Error marking notification as read:', error);
    }
  });
};