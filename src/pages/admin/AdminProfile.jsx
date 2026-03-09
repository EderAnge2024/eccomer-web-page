import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { User, Mail, Shield, CheckCircle, RefreshCcw, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminProfile.css';

const AdminProfile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        correo: user?.correo || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const hasChanges = () => {
        return (
            formData.nombre !== (user?.nombre || '') ||
            formData.apellido !== (user?.apellido || '') ||
            formData.correo !== (user?.correo || '')
        );
    };

    const handleReset = () => {
        setFormData({
            nombre: user?.nombre || '',
            apellido: user?.apellido || '',
            correo: user?.correo || '',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.correo.trim()) {
            toast.error('Todos los campos son obligatorios');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.correo)) {
            toast.error('Formato de correo inválido');
            return;
        }

        try {
            setLoading(true);
            const response = await userService.updateUser(user.id_usuario, formData);

            if (response.success) {
                toast.success('Información actualizada correctamente');
                // Actualizar el contexto con los nuevos datos
                const updatedUserData = {
                    ...user,
                    ...response.user,
                };
                updateUser(updatedUserData);
            } else {
                toast.error(response.message || 'Error al actualizar información');
            }
        } catch (error) {
            toast.error('Error de conexión al actualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-profile-container">
            <div className="admin-profile-header">
                <div className="profile-header-icon">
                    <User size={32} />
                </div>
                <div>
                    <h1>Editar Perfil</h1>
                    <p>Actualiza tu información personal y de contacto</p>
                </div>
            </div>

            <div className="profile-content-grid">
                <div className="profile-form-section">
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-alert-info">
                            <CheckCircle size={20} />
                            <p>Tu información se mantiene segura y privada.</p>
                        </div>

                        <div className="form-group-profile">
                            <label>Nombre</label>
                            <div className="input-with-icon-profile">
                                <User size={20} className="input-icon-profile" />
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    placeholder="Tu nombre"
                                />
                            </div>
                        </div>

                        <div className="form-group-profile">
                            <label>Apellido</label>
                            <div className="input-with-icon-profile">
                                <User size={20} className="input-icon-profile" />
                                <input
                                    type="text"
                                    name="apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    placeholder="Tu apellido"
                                />
                            </div>
                        </div>

                        <div className="form-group-profile">
                            <label>Correo Electrónico</label>
                            <div className="input-with-icon-profile">
                                <Mail size={20} className="input-icon-profile" />
                                <input
                                    type="email"
                                    name="correo"
                                    value={formData.correo}
                                    onChange={handleChange}
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>
                        </div>

                        <div className="profile-form-actions">
                            <button
                                type="button"
                                className="btn-reset-profile"
                                onClick={handleReset}
                                disabled={loading || !hasChanges()}
                            >
                                <RefreshCcw size={18} />
                                Restablecer
                            </button>
                            <button
                                type="submit"
                                className="btn-save-profile"
                                disabled={loading || !hasChanges()}
                            >
                                {loading ? (
                                    <div className="spinner-small"></div>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Guardar Cambios
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="profile-info-section">
                    <div className="account-details-card">
                        <h3>Información de la Cuenta</h3>
                        <div className="detail-item-profile">
                            <label>Usuario</label>
                            <span>@{user?.usuario}</span>
                        </div>
                        <div className="detail-item-profile">
                            <label>Rol de Acceso</label>
                            <div className="role-tag-profile">
                                <Shield size={14} />
                                <span>{user?.rol}</span>
                            </div>
                        </div>
                        {user?.es_super_admin && (
                            <div className="detail-item-profile">
                                <label>Nivel de Permisos</label>
                                <span className="superadmin-tag-profile">Super Administrador</span>
                            </div>
                        )}
                    </div>

                    <div className="security-tips-card">
                        <h3>Consejos de Seguridad</h3>
                        <ul>
                            <li>Mantén tus datos actualizados para recibir notificaciones.</li>
                            <li>Tu correo electrónico se usa para la recuperación de cuenta.</li>
                            <li>Si cambias tu correo, deberás usar el nuevo para iniciar sesión.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
