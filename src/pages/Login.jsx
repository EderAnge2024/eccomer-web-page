// Página de Login
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, isAdmin } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.usuario || !formData.contrasena) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      setLoading(true);
      const response = await login(formData.usuario, formData.contrasena);

      if (response.success) {
        if (isAdmin()) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
      {/* Contenedor tipo móvil centrado */}
      <div className="w-full max-w-[400px] bg-white rounded-3xl shadow-lg p-8">

        {/* Título y Subtítulo */}
        <div className="text-center mb-10">
          <h2 className="text-[32px] font-bold text-[#221329] mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-base text-[#666]">
            Bienvenido de nuevo
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Campo Usuario */}
          <div className="flex items-center bg-[#f9f9f9] border border-[#ddd] rounded-xl px-4 h-[50px] mb-4 transition-colors focus-within:border-[#221329]">
            <User className="h-5 w-5 text-[#666] mr-3" />
            <input
              id="usuario"
              name="usuario"
              type="text"
              autoComplete="username"
              required
              value={formData.usuario}
              onChange={handleChange}
              className="flex-1 bg-transparent border-none outline-none text-[#333] text-base placeholder-[#999] w-full h-full"
              placeholder="Usuario"
            />
          </div>

          {/* Campo Contraseña */}
          <div className="flex items-center bg-[#f9f9f9] border border-[#ddd] rounded-xl px-4 h-[50px] mb-2 transition-colors focus-within:border-[#221329]">
            <Lock className="h-5 w-5 text-[#666] mr-3" />
            <input
              id="contrasena"
              name="contrasena"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={formData.contrasena}
              onChange={handleChange}
              className="flex-1 bg-transparent border-none outline-none text-[#333] text-base placeholder-[#999] w-full h-full"
              placeholder="Contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-[#666] hover:text-[#333] focus:outline-none p-1"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Link Olvidaste contraseña */}
          <div className="flex justify-end mb-6">
            <button type="button" className="text-sm font-semibold text-[#221329] hover:opacity-80 bg-transparent border-none cursor-pointer transition-opacity">
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Botón Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[54px] flex justify-center items-center rounded-xl bg-[#221329] shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span className="text-white font-bold text-base">Cargando...</span>
              </div>
            ) : (
              <span className="text-white font-bold text-base">Iniciar Sesión</span>
            )}
          </button>
        </form>

        {/* Registro Link */}
        <div className="mt-8 flex justify-center items-center space-x-1">
          <span className="text-sm text-[#666]">
            ¿No tienes cuenta?
          </span>
          <Link
            to="/register"
            className="text-sm font-semibold text-[#221329] hover:underline"
          >
            Regístrate
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;