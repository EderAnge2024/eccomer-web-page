// Página de Perfil de Usuario
import React, { useState, useEffect } from 'react';
import { User, MapPin, Package, Settings, LogOut, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { locationService } from '../services/locationService';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';

const Profile = ({ onNavigate }) => {
  const { user, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('info');
  const [ubicaciones, setUbicaciones] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUbicacionModal, setShowUbicacionModal] = useState(false);
  const [editingUbicacion, setEditingUbicacion] = useState(null);
  
  // Form state para ubicación
  const [ubicacionForm, setUbicacionForm] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    codigo_postal: '',
    telefono: '',
    es_principal: false
  });

  useEffect(() => {
    if (user?.id_usuario) {
      cargarUbicaciones();
      cargarPedidos();
    }
  }, [user]);

  const cargarUbicaciones = async () => {
    try {
      setLoading(true);
      const response = await locationService.getUbicacionesByUser(user.id_usuario);
      
      if (response.success) {
        setUbicaciones(response.ubicaciones || []);
      }
    } catch (error) {
      console.error('Error cargando ubicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      const response = await orderService.getPedidosByUser(user.id_usuario);
      
      if (response.success) {
        setPedidos(response.pedidos || []);
      }
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarUbicacion = () => {
    setEditingUbicacion(null);
    setUbicacionForm({
      nombre: '',
      direccion: '',
      ciudad: '',
      codigo_postal: '',
      telefono: '',
      es_principal: ubicaciones.length === 0 // Primera ubicación es principal por defecto
    });
    setShowUbicacionModal(true);
  };

  const handleEditarUbicacion = (ubicacion) => {
    setEditingUbicacion(ubicacion);
    setUbicacionForm({
      nombre: ubicacion.nombre,
      direccion: ubicacion.direccion,
      ciudad: ubicacion.ciudad || '',
      codigo_postal: ubicacion.codigo_postal || '',
      telefono: ubicacion.telefono || '',
      es_principal: ubicacion.es_principal || false
    });
    setShowUbicacionModal(true);
  };

  const handleGuardarUbicacion = async () => {
    if (!ubicacionForm.nombre || !ubicacionForm.direccion) {
      toast.error('Nombre y dirección son obligatorios');
      return;
    }

    try {
      const ubicacionData = {
        ...ubicacionForm,
        id_usuario: user.id_usuario
      };

      let response;
      if (editingUbicacion) {
        response = await locationService.updateUbicacion(editingUbicacion.id_ubicacion, ubicacionData);
      } else {
        response = await locationService.createUbicacion(ubicacionData);
      }

      if (response.success) {
        toast.success(editingUbicacion ? 'Ubicación actualizada' : 'Ubicación agregada');
        setShowUbicacionModal(false);
        cargarUbicaciones();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error guardando ubicación:', error);
      toast.error('Error al guardar ubicación');
    }
  };

  const handleEliminarUbicacion = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta ubicación?')) return;

    try {
      const response = await locationService.deleteUbicacion(id);
      
      if (response.success) {
        toast.success('Ubicación eliminada');
        cargarUbicaciones();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Error eliminando ubicación:', error);
      toast.error('Error al eliminar ubicación');
    }
  };

  const handleLogout = () => {
    logout();
    onNavigate?.('home');
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'En proceso':
        return 'bg-blue-100 text-blue-800';
      case 'Entregado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.nombre?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user?.nombre} {user?.apellido}</h1>
                <p className="text-gray-600">{user?.correo}</p>
                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  user?.rol === 'administrador' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {user?.rol === 'administrador' ? 'Administrador' : 'Cliente'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-3">
              {isAdmin() && (
                <button
                  onClick={() => onNavigate?.('admin')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Panel Admin
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'info'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="h-5 w-5 inline mr-2" />
                Información Personal
              </button>
              <button
                onClick={() => setActiveTab('ubicaciones')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'ubicaciones'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MapPin className="h-5 w-5 inline mr-2" />
                Direcciones ({ubicaciones.length})
              </button>
              <button
                onClick={() => setActiveTab('pedidos')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'pedidos'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="h-5 w-5 inline mr-2" />
                Mis Pedidos ({pedidos.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Tab: Información Personal */}
            {activeTab === 'info' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={user?.nombre || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                    <input
                      type="text"
                      value={user?.apellido || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                    <input
                      type="email"
                      value={user?.correo || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      value={user?.telefono || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                    <input
                      type="text"
                      value={user?.usuario || ''}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Ubicaciones */}
            {activeTab === 'ubicaciones' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Mis Direcciones</h3>
                  <button
                    onClick={handleAgregarUbicacion}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar Dirección
                  </button>
                </div>

                {loading ? (
                  <p className="text-center text-gray-500 py-8">Cargando direcciones...</p>
                ) : ubicaciones.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No tienes direcciones guardadas</p>
                    <button
                      onClick={handleAgregarUbicacion}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                      Agregar Primera Dirección
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ubicaciones.map((ubicacion) => (
                      <div
                        key={ubicacion.id_ubicacion}
                        className={`border-2 rounded-lg p-4 ${
                          ubicacion.es_principal ? 'border-purple-600 bg-purple-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{ubicacion.nombre}</h4>
                            {ubicacion.es_principal && (
                              <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full flex items-center gap-1">
                                <Check className="h-3 w-3" />
                                Principal
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditarUbicacion(ubicacion)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEliminarUbicacion(ubicacion.id_ubicacion)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-1">{ubicacion.direccion}</p>
                        {ubicacion.ciudad && (
                          <p className="text-gray-600 text-sm">
                            {ubicacion.ciudad} {ubicacion.codigo_postal && `- ${ubicacion.codigo_postal}`}
                          </p>
                        )}
                        {ubicacion.telefono && (
                          <p className="text-gray-600 text-sm mt-2">📞 {ubicacion.telefono}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Pedidos */}
            {activeTab === 'pedidos' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Historial de Pedidos</h3>

                {loading ? (
                  <p className="text-center text-gray-500 py-8">Cargando pedidos...</p>
                ) : pedidos.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No tienes pedidos aún</p>
                    <button
                      onClick={() => onNavigate?.('products')}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                    >
                      Comenzar a Comprar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pedidos.map((pedido) => (
                      <div key={pedido.id_pedido} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-sm text-gray-500">Pedido #{pedido.id_pedido}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(pedido.fecha_pedido).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEstadoColor(pedido.estado)}`}>
                            {pedido.estado}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              S/ {parseFloat(pedido.total).toFixed(2)}
                            </p>
                            {pedido.tipo_pedido && (
                              <p className="text-xs text-gray-500 mt-1">
                                {pedido.tipo_pedido === 'maestro' ? 'Pedido Multi-Vendedor' : 'Pedido Simple'}
                              </p>
                            )}
                          </div>
                          <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                            Ver Detalles
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Ubicación */}
      {showUbicacionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {editingUbicacion ? 'Editar Dirección' : 'Nueva Dirección'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la dirección *
                </label>
                <input
                  type="text"
                  value={ubicacionForm.nombre}
                  onChange={(e) => setUbicacionForm({ ...ubicacionForm, nombre: e.target.value })}
                  placeholder="Ej: Casa, Oficina, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección completa *
                </label>
                <textarea
                  value={ubicacionForm.direccion}
                  onChange={(e) => setUbicacionForm({ ...ubicacionForm, direccion: e.target.value })}
                  placeholder="Calle, número, referencias..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={ubicacionForm.ciudad}
                    onChange={(e) => setUbicacionForm({ ...ubicacionForm, ciudad: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
                  <input
                    type="text"
                    value={ubicacionForm.codigo_postal}
                    onChange={(e) => setUbicacionForm({ ...ubicacionForm, codigo_postal: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={ubicacionForm.telefono}
                  onChange={(e) => setUbicacionForm({ ...ubicacionForm, telefono: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="es_principal"
                  checked={ubicacionForm.es_principal}
                  onChange={(e) => setUbicacionForm({ ...ubicacionForm, es_principal: e.target.checked })}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="es_principal" className="ml-2 block text-sm text-gray-700">
                  Establecer como dirección principal
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUbicacionModal(false)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarUbicacion}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
