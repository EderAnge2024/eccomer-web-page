// Hook para manejar productos
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '../api/products.js';
import toast from 'react-hot-toast';

// Hook para obtener todos los productos
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsService.getProducts,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
    retry: 2,
    onError: (error) => {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar los productos');
    }
  });
};

// Hook para obtener productos de la base de datos
export const useProductsFromDB = () => {
  return useQuery({
    queryKey: ['products', 'database'],
    queryFn: productsService.getProductsFromDB,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2
  });
};

// Hook para obtener un producto por ID
export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      console.error('Error fetching product:', error);
      toast.error('Error al cargar el producto');
    }
  });
};

// Hook para obtener productos por categoría
export const useProductsByCategory = (category) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => productsService.getProductsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2
  });
};

// Hook para obtener productos por usuario
export const useProductsByUser = (userId) => {
  return useQuery({
    queryKey: ['products', 'user', userId],
    queryFn: () => productsService.getProductsByUser(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2
  });
};

// Hook para crear producto
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsService.createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['products']);
      toast.success('Producto creado exitosamente');
    },
    onError: (error) => {
      console.error('Error creating product:', error);
      toast.error(error.message || 'Error al crear el producto');
    }
  });
};

// Hook para actualizar producto
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => productsService.updateProduct(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['product', variables.id]);
      toast.success('Producto actualizado exitosamente');
    },
    onError: (error) => {
      console.error('Error updating product:', error);
      toast.error(error.message || 'Error al actualizar el producto');
    }
  });
};

// Hook para eliminar producto
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Producto eliminado exitosamente');
    },
    onError: (error) => {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Error al eliminar el producto');
    }
  });
};