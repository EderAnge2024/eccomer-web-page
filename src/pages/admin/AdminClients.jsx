import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import {
  Users,
  User,
  Shield,
  Mail,
  Phone,
  MapPin,
  Edit2,
  AlertCircle,
  Search,
  RefreshCw,
  Filter,
  CheckCircle2,
  XCircle,
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminClients.css';

const AdminClients = () => {
  const { user } = useAuth();
  const [clientes, setClientes] = useState([]);
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [nuevoRol, setNuevoRol] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');

  const esSuperAdmin = user?.es_super_admin === true;

  useEffect(() => {
    cargarClientes();
  }, []);

  useEffect(() => {
    filterData();
  }, [clientes, searchTerm, roleFilter]);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      if (response.success) {
        // En base a userService.js, la data viene en response.data
        // La app móvil espera response.data.users
        const usersList = response.data?.users || response.data || [];
        setClientes(usersList);
      } else {
        toast.error(response.message || 'Error al cargar usuarios');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let result = [...clientes];

    // Búsqueda por texto
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(c =>
        (c.nombre && c.nombre.toLowerCase().includes(search)) ||
        (c.apellido && c.apellido.toLowerCase().includes(search)) ||
        (c.usuario && c.usuario.toLowerCase().includes(search)) ||
        (c.correo && c.correo.toLowerCase().includes(search))
      );
    }

    // Filtro por rol
    if (roleFilter !== 'todos') {
      result = result.filter(c => c.rol === roleFilter);
    }

    setFilteredClientes(result);
  };

  const abrirModalCambiarRol = (cliente) => {
    setClienteSeleccionado(cliente);
    setNuevoRol(cliente.rol);
    setModalVisible(true);
  };

  const handleCambiarRol = async () => {
    if (!clienteSeleccionado || !nuevoRol) {
      toast.error('Selecciona un rol');
      return;
    }

    if (nuevoRol === clienteSeleccionado.rol) {
      toast.error('El rol seleccionado es el mismo que el actual');
      return;
    }

    if (nuevoRol === 'administrador' && !esSuperAdmin) {
      toast.error('Solo el super administrador puede promover usuarios a administrador');
      return;
    }

    try {
      setLoading(true);
      const userData = {
        nombre: clienteSeleccionado.nombre,
        apellido: clienteSeleccionado.apellido,
        correo: clienteSeleccionado.correo,
        telefono: clienteSeleccionado.telefono,
        direccion: clienteSeleccionado.direccion,
        rol: nuevoRol,
        usuario: clienteSeleccionado.usuario
      };

      const response = await userService.updateUser(clienteSeleccionado.id_usuario, userData);

      if (response.success) {
        toast.success(`Rol de ${clienteSeleccionado.nombre} actualizado a ${nuevoRol}`);
        setModalVisible(false);
        cargarClientes();
      } else {
        toast.error(response.message || 'Error al actualizar el rol');
      }
    } catch (error) {
      toast.error('Error al procesar el cambio de rol');
    } finally {
      setLoading(false);
    }
  };

  const getRolColor = (rol) => {
    return rol === 'administrador' ? '#4CAF50' : '#2196F3';
  };

  const getRolIcon = (rol) => {
    return rol === 'administrador' ? Shield : User;
  };

  if (loading && clientes.length === 0) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Sincronizando clientes...</p>
      </div>
    );
  }

  return (
    <div className="admin-clients-container">
      <div className="clients-page-header">
        <div className="header-title-section">
          <div className="header-icon-badge">
            <Users size={28} />
          </div>
          <div>
            <h1>Gestión de Usuarios</h1>
            <p>Administra accesos, roles y perfiles de clientes</p>
          </div>
        </div>

        <div className="header-actions-section">
          <div className="search-bar-premium">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre, usuario o correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group-premium">
            <Filter size={18} className="filter-icon" />
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="todos">Todos los roles</option>
              <option value="cliente">Clientes</option>
              <option value="administrador">Administradores</option>
            </select>
          </div>
          <button className="btn-refresh-premium" onClick={cargarClientes} disabled={loading}>
            <RefreshCw size={20} className={loading ? 'spinning' : ''} />
          </button>
        </div>
      </div>

      <div className="clients-stats-grid">
        <div className="client-stat-card total">
          <div className="stat-card-icon"><Users size={24} /></div>
          <div className="stat-card-data">
            <h3>{clientes.length}</h3>
            <p>Usuarios Registrados</p>
          </div>
        </div>
        <div className="client-stat-card clients">
          <div className="stat-card-icon"><User size={24} /></div>
          <div className="stat-card-data">
            <h3>{clientes.filter(c => c.rol === 'cliente').length}</h3>
            <p>Clientes</p>
          </div>
        </div>
        <div className="client-stat-card admins">
          <div className="stat-card-icon"><Shield size={24} /></div>
          <div className="stat-card-data">
            <h3>{clientes.filter(c => c.rol === 'administrador').length}</h3>
            <p>Administradores</p>
          </div>
        </div>
      </div>

      {filteredClientes.length === 0 ? (
        <div className="clients-empty-state">
          <XCircle size={64} color="#ddd" />
          <h3>No se encontraron resultados</h3>
          <p>Prueba con otros términos de búsqueda o filtros.</p>
          {searchTerm || roleFilter !== 'todos' ? (
            <button className="btn-clear-filters" onClick={() => { setSearchTerm(''); setRoleFilter('todos'); }}>
              Limpiar filtros
            </button>
          ) : null}
        </div>
      ) : (
        <div className="clients-cards-layout">
          {filteredClientes.map((cliente) => {
            const RolIcon = getRolIcon(cliente.rol);
            return (
              <div key={cliente.id_usuario} className="premium-client-card">
                <div className="card-top-accent" style={{ backgroundColor: getRolColor(cliente.rol) }}></div>
                <div className="card-inner-content">
                  <div className="card-user-header">
                    <div className="user-avatar-premium">
                      {cliente.nombre?.charAt(0) || <User size={24} />}
                    </div>
                    <div className="user-main-info">
                      <div className="name-row">
                        <h4>{cliente.nombre} {cliente.apellido}</h4>
                        <div className="role-chip" style={{ color: getRolColor(cliente.rol), backgroundColor: `${getRolColor(cliente.rol)}15` }}>
                          <RolIcon size={14} />
                          <span>{cliente.rol}</span>
                        </div>
                      </div>
                      <span className="user-handle">@{cliente.usuario}</span>
                    </div>
                    <button
                      className="btn-card-action"
                      onClick={() => abrirModalCambiarRol(cliente)}
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>

                  <div className="card-contact-details">
                    <div className="contact-item">
                      <Mail size={16} />
                      <span>{cliente.correo}</span>
                    </div>
                    {cliente.telefono && (
                      <div className="contact-item">
                        <Phone size={16} />
                        <span>{cliente.telefono}</span>
                      </div>
                    )}
                    {cliente.direccion && (
                      <div className="contact-item">
                        <MapPin size={16} />
                        <span className="address-text">{cliente.direccion}</span>
                      </div>
                    )}
                  </div>

                  <div className="card-status-footer">
                    <div className="status-indicator-tag passive">
                      <div className="dot"></div>
                      <span>Verificado</span>
                    </div>
                    <span className="join-date">ID: #{cliente.id_usuario}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalVisible && clienteSeleccionado && (
        <div className="premium-modal-overlay" onClick={() => setModalVisible(false)}>
          <div className="premium-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-premium">
              <div className="modal-header-icon">
                <Shield size={24} />
              </div>
              <div>
                <h2>Gestionar Permisos</h2>
                <p>Cambiar rol para un usuario específico</p>
              </div>
              <button className="modal-close-btn" onClick={() => setModalVisible(false)}>&times;</button>
            </div>

            <div className="modal-body-premium">
              <div className="modal-user-summary">
                <div className="summary-avatar">
                  {clienteSeleccionado.nombre?.charAt(0)}
                </div>
                <div className="summary-text">
                  <h3>{clienteSeleccionado.nombre} {clienteSeleccionado.apellido}</h3>
                  <p>{clienteSeleccionado.correo}</p>
                </div>
              </div>

              <div className="role-selection-section">
                <label className="section-label">Seleccionar el nivel de acceso</label>
                <div className="roles-options-grid">
                  <button
                    className={`role-option-card ${nuevoRol === 'cliente' ? 'active' : ''}`}
                    onClick={() => setNuevoRol('cliente')}
                  >
                    <div className="option-icon"><User size={24} /></div>
                    <div className="option-info">
                      <strong>Cliente</strong>
                      <span>Acceso básico a la tienda</span>
                    </div>
                    <div className="check-mark"><CheckCircle2 size={20} /></div>
                  </button>

                  <button
                    className={`role-option-card ${nuevoRol === 'administrador' ? 'active' : ''} ${!esSuperAdmin ? 'locked' : ''}`}
                    onClick={() => esSuperAdmin && setNuevoRol('administrador')}
                    disabled={!esSuperAdmin}
                  >
                    <div className="option-icon"><Shield size={24} /></div>
                    <div className="option-info">
                      <strong>Administrador</strong>
                      <span>Gestión de productos y pedidos</span>
                    </div>
                    {!esSuperAdmin ? <div className="lock-icon"><Shield size={16} /></div> : <div className="check-mark"><CheckCircle2 size={20} /></div>}
                  </button>
                </div>
              </div>

              {!esSuperAdmin && (
                <div className="modal-warning-alert error">
                  <AlertCircle size={18} />
                  <span>Solo el <strong>Super Administrador</strong> puede promover otros usuarios a este nivel.</span>
                </div>
              )}

              <div className="modal-warning-alert info">
                <AlertCircle size={18} />
                <span>Cambiar el rol afectará inmediatamente los permisos del usuario en la plataforma.</span>
              </div>
            </div>

            <div className="modal-footer-premium">
              <button className="btn-modal-secondary" onClick={() => setModalVisible(false)}>
                Cancelar
              </button>
              <button
                className="btn-modal-primary"
                onClick={handleCambiarRol}
                disabled={loading || nuevoRol === clienteSeleccionado.rol}
              >
                {loading ? <div className="spinner-small"></div> : 'Confirmar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClients;
