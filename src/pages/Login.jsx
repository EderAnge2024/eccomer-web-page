// Página de Login
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Login.css';

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
    <div className="login-page-premium">
      <div className="login-card-premium">
        {/* Título y Subtítulo */}
        <div className="login-header">
          <h2 className="login-title-premium">
            Iniciar Sesión
          </h2>
          <p className="login-subtitle-premium">
            Bienvenido de nuevo
          </p>
        </div>

        <form className="login-form-premium" onSubmit={handleSubmit}>
          {/* Campo Usuario */}
          <div className="input-group-premium">
            <div className="input-wrapper-premium">
              <User className="input-icon" size={20} />
              <input
                id="usuario"
                name="usuario"
                type="text"
                autoComplete="username"
                required
                value={formData.usuario}
                onChange={handleChange}
                className="login-input-premium"
                placeholder="Usuario"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div className="input-group-premium">
            <div className="input-wrapper-premium">
              <Lock className="input-icon" size={20} />
              <input
                id="contrasena"
                name="contrasena"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.contrasena}
                onChange={handleChange}
                className="login-input-premium"
                placeholder="Contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-premium"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Link Olvidaste contraseña */}
          <Link 
            to="/forgot-password" 
            className="forgot-password-link bg-transparent border-none cursor-pointer text-sm text-gray-400 hover:text-purple-400 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>

          {/* Botón Login */}
          <button
            type="submit"
            disabled={loading}
            className="btn-login-premium"
          >
            {loading ? (
              <>
                <div className="animate-spin-premium rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Cargando...</span>
              </>
            ) : (
              <span>Acceder ahora</span>
            )}
          </button>
        </form>

        {/* Registro Link */}
        <div className="login-footer">
          <span>¿No tienes cuenta?</span>
          <Link
            to="/register"
            className="register-link-premium"
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;