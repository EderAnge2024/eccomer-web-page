import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { authService } from '../../services/authService';
import { Lock, Eye, EyeOff, ShieldCheck, Key, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminSecurity.css';

const AdminSecurity = () => {
    const { user, login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Por favor completa todos los campos');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Las nuevas contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (currentPassword === newPassword) {
            toast.error('La nueva contraseña debe ser diferente a la actual');
            return;
        }

        try {
            setLoading(true);

            // Verificar la contraseña actual haciendo un login
            const verifyResponse = await authService.login(user.usuario, currentPassword);

            if (!verifyResponse.success) {
                toast.error('La contraseña actual es incorrecta');
                return;
            }

            // Actualizar la contraseña
            const updateResponse = await userService.updateUser(user.id_usuario, {
                contrasena: newPassword
            });

            if (updateResponse.success) {
                toast.success('Contraseña actualizada correctamente');
                // Limpiar campos
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                // Mantener la sesión activa con la nueva contraseña
                login(user.usuario, newPassword);
            } else {
                toast.error(updateResponse.message || 'Error al actualizar contraseña');
            }
        } catch (error) {
            toast.error('Error al procesar el cambio de contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-security-container">
            <div className="admin-security-header">
                <div className="security-header-icon">
                    <ShieldCheck size={32} />
                </div>
                <div>
                    <h1>Seguridad</h1>
                    <p>Gestiona el acceso y protección de tu cuenta administrativa</p>
                </div>
            </div>

            <div className="security-content-grid">
                <div className="security-form-section">
                    <h3>Cambiar Contraseña</h3>
                    <p className="section-subtitle">Se recomienda usar una contraseña fuerte que no uses en otros sitios.</p>

                    <form onSubmit={handleSubmit} className="security-form">
                        <div className="form-group-security">
                            <label>Contraseña Actual</label>
                            <div className="input-with-icon-security">
                                <Lock size={20} className="input-icon-security" />
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Tu contraseña actual"
                                />
                                <button
                                    type="button"
                                    className="eye-toggle-security"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group-security">
                            <label>Nueva Contraseña</label>
                            <div className="input-with-icon-security">
                                <Key size={20} className="input-icon-security" />
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                />
                                <button
                                    type="button"
                                    className="eye-toggle-security"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group-security">
                            <label>Confirmar Nueva Contraseña</label>
                            <div className="input-with-icon-security">
                                <Lock size={20} className="input-icon-security" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repite tu nueva contraseña"
                                />
                                <button
                                    type="button"
                                    className="eye-toggle-security"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-update-password"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="spinner-small"></div>
                            ) : (
                                <>
                                    <ShieldCheck size={20} />
                                    Actualizar Contraseña
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="security-info-section">
                    <div className="security-status-card">
                        <h3>Estado de Seguridad</h3>
                        <div className="status-item-security">
                            <div className="status-indicator-positive"></div>
                            <span>Contraseña Activa</span>
                        </div>
                        <div className="status-item-security">
                            <div className="status-indicator-neutral"></div>
                            <span>Sin autenticación de dos pasos</span>
                        </div>
                    </div>

                    <div className="security-tips-card">
                        <div className="tips-header-security">
                            <ShieldAlert size={20} color="#FF9800" />
                            <h3>Consejos de Seguridad</h3>
                        </div>
                        <ul className="security-tips-list">
                            <li>
                                <strong>Carga de caracteres:</strong> Usa una mezcla de letras mayúsculas, minúsculas, números y símbolos.
                            </li>
                            <li>
                                <strong>Longitud:</strong> Una contraseña más larga es generalmente más segura.
                            </li>
                            <li>
                                <strong>Única:</strong> No uses la misma contraseña para múltiples cuentas críticas.
                            </li>
                            <li>
                                <strong>Actualización:</strong> Cambia tu contraseña periódicamente.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSecurity;
