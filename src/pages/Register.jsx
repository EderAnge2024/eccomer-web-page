// Página de Registro
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, MapPin, Lock, UserPlus, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
    usuario: '',
    contrasena: '',
    confirmarContrasena: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.nombre || !formData.apellido || !formData.correo || 
        !formData.usuario || !formData.contrasena) {
      toast.error('Por favor completa todos los campos obligatorios');
      return false;
    }

    if (formData.contrasena !== formData.confirmarContrasena) {
      toast.error('Las contraseñas no coinciden');
      return false;
    }

    if (formData.contrasena.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    // Validar complejidad de contraseña (coincidir con backend)
    const hasUpperCase = /[A-Z]/.test(formData.contrasena);
    const hasLowerCase = /[a-z]/.test(formData.contrasena);
    const hasNumbers = /\d/.test(formData.contrasena);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.contrasena);
    const criteriaCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (criteriaCount < 3) {
      toast.error('La contraseña debe contener al menos 3 de: mayúsculas, minúsculas, números o símbolos');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      toast.error('Por favor ingresa un email válido');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const userData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        telefono: formData.telefono || '',
        direccion: formData.direccion || '',
        usuario: formData.usuario,
        contrasena: formData.contrasena,
        rol: 'cliente'
      };

      const response = await register(userData);
      
      if (response.success) {
        toast.success('¡Registro exitoso! Ahora puedes iniciar sesión');
        navigate('/login');
      } else {
        toast.error(response.message || 'Error al registrar usuario');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      toast.error('Error inesperado durante el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-premium">
      <div className="register-card-premium">
        <div className="register-header-premium">
          <div className="register-icon-container">
            <UserPlus size={40} strokeWidth={2.5} />
          </div>
          <h2 className="register-title-premium">Crear Cuenta</h2>
          <p className="register-subtitle-premium">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="register-link-premium">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <form className="register-form-premium" onSubmit={handleSubmit}>
          {/* Nombre y Apellido */}
          <div className="register-grid-premium">
            <div className="input-group-premium">
              <label className="label-premium">Nombre *</label>
              <div className="input-wrapper-premium">
                <input
                  name="nombre"
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={handleChange}
                  className="input-field-register"
                  placeholder="Nombre"
                />
                <User className="input-icon-premium" size={20} />
              </div>
            </div>

            <div className="input-group-premium">
              <label className="label-premium">Apellido *</label>
              <div className="input-wrapper-premium">
                <input
                  name="apellido"
                  type="text"
                  required
                  value={formData.apellido}
                  onChange={handleChange}
                  className="input-field-register"
                  placeholder="Apellido"
                  style={{ paddingLeft: '1.25rem' }} // Special case for second grid item
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="input-group-premium">
            <label className="label-premium">Email *</label>
            <div className="input-wrapper-premium">
              <input
                name="correo"
                type="email"
                required
                value={formData.correo}
                onChange={handleChange}
                className="input-field-register"
                placeholder="tu@email.com"
              />
              <Mail className="input-icon-premium" size={20} />
            </div>
          </div>

          {/* Usuario y Teléfono */}
          <div className="register-grid-premium">
            <div className="input-group-premium">
              <label className="label-premium">Usuario *</label>
              <div className="input-wrapper-premium">
                <input
                  name="usuario"
                  type="text"
                  required
                  value={formData.usuario}
                  onChange={handleChange}
                  className="input-field-register"
                  placeholder="Usuario"
                />
                <User className="input-icon-premium" size={20} />
              </div>
            </div>

            <div className="input-group-premium">
              <label className="label-premium">Teléfono</label>
              <div className="input-wrapper-premium">
                <input
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="input-field-register"
                  placeholder="999 999 999"
                />
                <Phone className="input-icon-premium" size={20} />
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div className="input-group-premium">
            <label className="label-premium">Dirección</label>
            <div className="input-wrapper-premium">
              <input
                name="direccion"
                type="text"
                value={formData.direccion}
                onChange={handleChange}
                className="input-field-register"
                placeholder="Tu dirección completa"
              />
              <MapPin className="input-icon-premium" size={20} />
            </div>
          </div>

          {/* Contraseñas */}
          <div className="register-grid-premium">
            <div className="input-group-premium">
              <label className="label-premium">Contraseña *</label>
              <div className="input-wrapper-premium">
                <input
                  name="contrasena"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.contrasena}
                  onChange={handleChange}
                  className="input-field-register"
                  placeholder="Mín. 8 caracteres (A-z, 0-9)"
                />
                <Lock className="input-icon-premium" size={20} />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-premium"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="input-group-premium">
              <label className="label-premium">Confirmar *</label>
              <div className="input-wrapper-premium">
                <input
                  name="confirmarContrasena"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmarContrasena}
                  onChange={handleChange}
                  className="input-field-register"
                  placeholder="Mín. 8 caracteres (A-z, 0-9)"
                />
                <Lock className="input-icon-premium" size={20} />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle-premium"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-register-premium"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Registrando...</span>
              </>
            ) : (
              <>
                <span>Crear Cuenta</span>
                <UserPlus size={20} />
              </>
            )}
          </button>
        </form>

        <Link to="/" className="back-link-premium">
          <ArrowLeft size={16} />
          <span>Volver al inicio</span>
        </Link>
      </div>
    </div>
  );
};

export default Register;