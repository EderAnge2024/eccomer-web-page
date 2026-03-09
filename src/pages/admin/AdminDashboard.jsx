import React from 'react';
import { Package, ShoppingCart, Users, Store, User, ShieldCheck, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = ({ user, setActiveTab, isSuperAdmin }) => {
    return (
        <div className="admin-dashboard">
            <h1>Bienvenido, {user?.nombre} {user?.apellido}</h1>
            <p className="welcome-subtext">Panel de Administración - E-commerce System</p>

            <div className="dashboard-cards">
                <button className="dashboard-card card-products" onClick={() => setActiveTab('products')}>
                    <div className="card-icon">
                        <Package size={28} />
                    </div>
                    <h3>Productos</h3>
                    <p>Gestionar catálogo, stock y precios</p>
                    <div className="card-arrow">
                        <ChevronRight size={20} />
                    </div>
                </button>

                <button className="dashboard-card card-orders" onClick={() => setActiveTab('orders')}>
                    <div className="card-icon">
                        <ShoppingCart size={28} />
                    </div>
                    <h3>Pedidos</h3>
                    <p>Ver y actualizar estado de envíos</p>
                    <div className="card-arrow">
                        <ChevronRight size={20} />
                    </div>
                </button>

                <button className="dashboard-card card-clients" onClick={() => setActiveTab('clients')}>
                    <div className="card-icon">
                        <Users size={28} />
                    </div>
                    <h3>Clientes</h3>
                    <p>Administrar usuarios y sus roles</p>
                    <div className="card-arrow">
                        <ChevronRight size={20} />
                    </div>
                </button>

                {isSuperAdmin && (
                    <button className="dashboard-card card-pos" onClick={() => setActiveTab('pos')}>
                        <div className="card-icon">
                            <Store size={28} />
                        </div>
                        <h3>Punto de Venta</h3>
                        <p>Ventas presenciales y comprobantes</p>
                        <div className="card-arrow">
                            <ChevronRight size={20} />
                        </div>
                    </button>
                )}

                <button className="dashboard-card card-profile" onClick={() => setActiveTab('profile')}>
                    <div className="card-icon">
                        <User size={28} />
                    </div>
                    <h3>Mi Perfil</h3>
                    <p>Actualizar información personal</p>
                    <div className="card-arrow">
                        <ChevronRight size={20} />
                    </div>
                </button>

                <button className="dashboard-card card-security" onClick={() => setActiveTab('security')}>
                    <div className="card-icon">
                        <ShieldCheck size={28} />
                    </div>
                    <h3>Seguridad</h3>
                    <p>Cambiar contraseña de acceso</p>
                    <div className="card-arrow">
                        <ChevronRight size={20} />
                    </div>
                </button>
            </div>

            <div className="dashboard-info-section">
                <h3>
                    <User size={24} />
                    Información de la Cuenta
                </h3>
                <div className="info-grid">
                    <div className="info-item">
                        <div className="info-item-icon"><User size={20} /></div>
                        <div className="info-item-content">
                            <label>Nombre Completo</label>
                            <span>{user?.nombre} {user?.apellido}</span>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="info-item-icon"><Mail size={20} /></div>
                        <div className="info-item-content">
                            <label>Correo Electrónico</label>
                            <span>{user?.correo}</span>
                        </div>
                    </div>
                    <div className="info-item">
                        <div className="info-item-icon"><ShieldCheck size={20} /></div>
                        <div className="info-item-content">
                            <label>Rol de Usuario</label>
                            <span>{isSuperAdmin ? 'Super Administrador' : user?.rol}</span>
                        </div>
                    </div>
                    {user?.telefono && (
                        <div className="info-item">
                            <div className="info-item-icon"><Phone size={20} /></div>
                            <div className="info-item-content">
                                <label>Teléfono</label>
                                <span>{user.telefono}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
