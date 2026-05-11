import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, Lock, Eye, EyeOff, ArrowLeft, Send, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Code & New Password
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    correo: '',
    codigo: '',
    nuevaContrasena: '',
    confirmarContrasena: ''
  });

  const { requestCode, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!formData.correo) {
      toast.error('Por favor ingresa tu correo electrónico');
      return;
    }

    try {
      setLoading(true);
      const response = await requestCode(formData.correo);
      if (response.success) {
        toast.success('Código enviado. Revisa tu correo');
        setStep(2);
      } else {
        toast.error(response.message || 'Error al enviar código');
      }
    } catch (error) {
      toast.error('Error al solicitar el código');
    } finally {
      setLoading(false);
    }
  };

  const validatePasswordComplexity = (password) => {
    if (password.length < 8) return false;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const criteriaCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    return criteriaCount >= 3;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.nuevaContrasena || !formData.confirmarContrasena) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    if (formData.nuevaContrasena !== formData.confirmarContrasena) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (!validatePasswordComplexity(formData.nuevaContrasena)) {
      toast.error('La contraseña debe tener al menos 8 caracteres y cumplir con los requisitos de seguridad');
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword(formData.correo, formData.codigo, formData.nuevaContrasena);
      if (response.success) {
        toast.success('¡Contraseña actualizada exitosamente!');
        navigate('/login');
      } else {
        toast.error(response.message || 'Código inválido o expirado');
      }
    } catch (error) {
      toast.error('Error al restablecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <div className="forgot-header">
          <div className="forgot-icon-container">
            {step === 1 ? <Mail size={40} /> : <ShieldCheck size={40} />}
          </div>
          <h2 className="forgot-title">
            {step === 1 ? 'Recuperar Contraseña' : 'Nueva Contraseña'}
          </h2>
          <p className="forgot-subtitle">
            {step === 1 
              ? 'Ingresa tu correo y te enviaremos un código de verificación para restablecer tu cuenta.'
              : `Ingresa el código enviado a ${formData.correo} y tu nueva contraseña.`
            }
          </p>
        </div>

        {/* Step Indicator */}
        <div className="steps-indicator-web">
          <div className={`step-dot-web ${step >= 1 ? 'active' : ''}`}>1</div>
          <div className={`step-line-web ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step-dot-web ${step >= 2 ? 'active' : ''}`}>2</div>
        </div>

        {step === 1 ? (
          <form className="forgot-form" onSubmit={handleSendCode}>
            <div className="input-group-forgot">
              <label className="label-forgot">Correo Electrónico</label>
              <div className="input-wrapper-forgot">
                <Mail className="input-icon-forgot" size={20} />
                <input
                  type="email"
                  name="correo"
                  placeholder="tu@email.com"
                  value={formData.correo}
                  onChange={handleChange}
                  className="input-field-forgot"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-forgot-premium">
              {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Enviar Código</>}
            </button>
          </form>
        ) : (
          <form className="forgot-form" onSubmit={handleResetPassword}>
            <div className="input-group-forgot">
              <label className="label-forgot">Código de Verificación</label>
              <div className="input-wrapper-forgot">
                <ShieldCheck className="input-icon-forgot" size={20} />
                <input
                  type="text"
                  name="codigo"
                  placeholder="000000"
                  maxLength={6}
                  value={formData.codigo}
                  onChange={handleChange}
                  className="input-field-forgot"
                  required
                />
              </div>
            </div>

            <div className="input-group-forgot">
              <label className="label-forgot">Nueva Contraseña</label>
              <div className="input-wrapper-forgot">
                <Lock className="input-icon-forgot" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="nuevaContrasena"
                  placeholder="Mín. 8 caracteres"
                  value={formData.nuevaContrasena}
                  onChange={handleChange}
                  className="input-field-forgot"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1.25rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="input-group-forgot">
              <label className="label-forgot">Confirmar Contraseña</label>
              <div className="input-wrapper-forgot">
                <Lock className="input-icon-forgot" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmarContrasena"
                  placeholder="Mín. 8 caracteres"
                  value={formData.confirmarContrasena}
                  onChange={handleChange}
                  className="input-field-forgot"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '1.25rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-forgot-premium">
              {loading ? <Loader2 className="animate-spin" /> : <><CheckCircle size={18} /> Cambiar Contraseña</>}
            </button>

            <div className="resend-container">
              <button type="button" onClick={handleSendCode} className="btn-resend" disabled={loading}>
                Reenviar código
              </button>
            </div>
          </form>
        )}

        <Link to="/login" className="back-to-login">
          <ArrowLeft size={16} />
          <span>Volver al inicio de sesión</span>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
