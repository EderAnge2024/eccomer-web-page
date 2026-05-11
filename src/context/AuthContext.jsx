// Context de autenticación para React Web
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al iniciar
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    try {
      const userData = authService.getCurrentUser();
      const isAuth = authService.isAuthenticated();
      
      if (isAuth && userData) {
        setUser(userData);
        console.log('✅ Usuario cargado:', userData.nombre, userData.rol);
      } else {
        console.log('ℹ️ No hay usuario autenticado');
      }
    } catch (error) {
      console.error('Error cargando usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (usuario, contrasena) => {
    try {
      setLoading(true);
      const response = await authService.login(usuario, contrasena);
      
      if (response.success) {
        setUser(response.user);
        toast.success(`¡Bienvenido ${response.user.nombre}!`);
        return { success: true, user: response.user };
      } else {
        toast.error(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Error en login:', error);
      toast.error('Error al iniciar sesión');
      return { success: false, message: 'Error al iniciar sesión' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      if (response.success) {
        toast.success('Usuario registrado exitosamente');
        return { success: true };
      } else {
        toast.error(response.message);
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      toast.error('Error al registrar usuario');
      return { success: false, message: 'Error al registrar usuario' };
    } finally {
      setLoading(false);
    }
  };

  const requestCode = async (correo) => {
    try {
      setLoading(true);
      return await authService.requestCode(correo);
    } catch (error) {
      console.error('Error en contexto requestCode:', error);
      return { success: false, message: 'Error al solicitar código' };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (correo, codigo, nuevaContrasena) => {
    try {
      setLoading(true);
      return await authService.verifyCodeAndResetPassword(correo, codigo, nuevaContrasena);
    } catch (error) {
      console.error('Error en contexto resetPassword:', error);
      return { success: false, message: 'Error al restablecer contraseña' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    toast.success('Sesión cerrada exitosamente');
  };

  const isAdmin = () => {
    return authService.isAdmin();
  };

  const isSuperAdmin = () => {
    return authService.isSuperAdmin();
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isSuperAdmin,
    isAuthenticated: authService.isAuthenticated(),
    refreshUser: loadUser,
    requestCode,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};