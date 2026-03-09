import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminOrders from './admin/AdminOrders';
import AdminClients from './admin/AdminClients';
import AdminPOS from './admin/AdminPOS';
import AdminProfile from './admin/AdminProfile';
import AdminSecurity from './admin/AdminSecurity';
import { LayoutDashboard, Package, ShoppingCart, Users, Store, User, ShieldCheck, LogOut, ChevronLeft } from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = () => {
  const { user, logout, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Verificar permisos
  if (!isAdmin()) {
    return (
      <div className="admin-panel-error">
        <ShieldCheck size={64} color="#ff5252" style={{ marginBottom: '20px' }} />
        <h2>Acceso Denegado</h2>
        <p>No tienes los permisos necesarios para acceder al panel administrativo de TiendaEcommerce.</p>
        <button onClick={() => navigate('/')} className="btn-save-profile" style={{ marginTop: '30px', width: 'auto', padding: '12px 30px' }}>
          Volver a la Tienda
        </button>
      </div>
    );
  }

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout();
      navigate('/login');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard user={user} isSuperAdmin={isSuperAdmin()} setActiveTab={setActiveTab} />;
      case 'products':
        return <AdminProducts />;
      case 'orders':
        return <AdminOrders />;
      case 'clients':
        return <AdminClients />;
      case 'pos':
        return isSuperAdmin() ? <AdminPOS /> : null;
      case 'profile':
        return <AdminProfile />;
      case 'security':
        return <AdminSecurity />;
      default:
        return <AdminDashboard user={user} isSuperAdmin={isSuperAdmin()} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="admin-panel">
      {/* Sidebar Navigation */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <ShieldCheck size={24} color="white" />
            </div>
            <h2>AdminPanel</h2>
          </div>

          <div className="sidebar-user-info">
            <span className="user-display-name">{user?.nombre} {user?.apellido}</span>
            <span className="user-display-email">{user?.correo}</span>
            {isSuperAdmin() && <span className="super-admin-badge">Super Admin Mode</span>}
          </div>
        </div>

        <nav className="admin-nav">
          <button
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => { setActiveTab('products'); setMobileMenuOpen(false); }}
          >
            <Package size={20} />
            <span>Productos</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
          >
            <ShoppingCart size={20} />
            <span>Pedidos</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => { setActiveTab('clients'); setMobileMenuOpen(false); }}
          >
            <Users size={20} />
            <span>Usuarios</span>
          </button>

          {isSuperAdmin() && (
            <button
              className={`admin-nav-item ${activeTab === 'pos' ? 'active' : ''}`}
              onClick={() => { setActiveTab('pos'); setMobileMenuOpen(false); }}
            >
              <Store size={20} />
              <span>Punto de Venta</span>
            </button>
          )}

          <div className="nav-divider"></div>

          <button
            className={`admin-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }}
          >
            <User size={20} />
            <span>Mi Perfil</span>
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => { setActiveTab('security'); setMobileMenuOpen(false); }}
          >
            <ShieldCheck size={20} />
            <span>Seguridad</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Toggle Button for Mobile (Optional, hidden by CSS normally) */}
      <div className="mobile-header d-md-none">
        {/* Mobile menu logic could be added here if needed */}
      </div>

      {/* Main Content Area */}
      <main className="admin-content">
        <div className="content-breadcrumb">
          {activeTab !== 'dashboard' ? (
            <button className="btn-back-dashboard" onClick={() => setActiveTab('dashboard')}>
              <ChevronLeft size={18} />
              Volver al inicio
            </button>
          ) : <div></div>}

          <div className="active-tab-indicator">
            {/* Opcional: muestra la sección actual arriba a la derecha */}
          </div>
        </div>

        <div className="content-render-area">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
