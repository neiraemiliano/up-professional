import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Bell,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  Users,
  Target,
  Save,
  X,
  Filter,
  Search,
  ChevronDown
} from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';

const AnnouncementManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [audienceFilter, setAudienceFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    priority: 'medium',
    audience: 'all',
    startDate: '',
    endDate: '',
    isActive: true,
    showOnDashboard: true,
    showAsNotification: false,
    actionUrl: '',
    actionText: ''
  });

  // Mock data - replace with actual API call
  const announcementsData = [
    {
      id: 1,
      title: 'Nueva función de búsqueda inteligente',
      message: 'Descubre profesionales más fácilmente con nuestra nueva función de búsqueda potenciada por IA.',
      type: 'info',
      priority: 'high',
      audience: 'customers',
      isActive: true,
      showOnDashboard: true,
      showAsNotification: true,
      startDate: '2024-02-01T00:00:00Z',
      endDate: '2024-02-29T23:59:59Z',
      createdAt: '2024-01-28T10:00:00Z',
      createdBy: 'Admin',
      views: 2850,
      clicks: 125,
      actionUrl: '/search',
      actionText: 'Probar ahora'
    },
    {
      id: 2,
      title: 'Mantenimiento programado del sistema',
      message: 'El sistema estará en mantenimiento el próximo domingo de 2:00 AM a 6:00 AM. Durante este tiempo algunos servicios podrían no estar disponibles.',
      type: 'warning',
      priority: 'high',
      audience: 'all',
      isActive: true,
      showOnDashboard: true,
      showAsNotification: true,
      startDate: '2024-02-05T00:00:00Z',
      endDate: '2024-02-11T23:59:59Z',
      createdAt: '2024-02-03T14:30:00Z',
      createdBy: 'Tech Team',
      views: 1520,
      clicks: 0,
      actionUrl: '',
      actionText: ''
    },
    {
      id: 3,
      title: 'Nuevas opciones de pago disponibles',
      message: 'Ahora puedes pagar tus servicios con más métodos de pago incluyendo tarjetas de débito y transferencias bancarias.',
      type: 'success',
      priority: 'medium',
      audience: 'customers',
      isActive: true,
      showOnDashboard: false,
      showAsNotification: false,
      startDate: '2024-01-15T00:00:00Z',
      endDate: '2024-03-15T23:59:59Z',
      createdAt: '2024-01-10T09:15:00Z',
      createdBy: 'Finance Team',
      views: 890,
      clicks: 45,
      actionUrl: '/payments',
      actionText: 'Ver opciones'
    },
    {
      id: 4,
      title: 'Actualización de términos y condiciones',
      message: 'Hemos actualizado nuestros términos y condiciones para mejorar la transparencia y protección de nuestros usuarios.',
      type: 'info',
      priority: 'low',
      audience: 'all',
      isActive: false,
      showOnDashboard: true,
      showAsNotification: false,
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-01-31T23:59:59Z',
      createdAt: '2023-12-28T16:45:00Z',
      createdBy: 'Legal Team',
      views: 1205,
      clicks: 78,
      actionUrl: '/terms',
      actionText: 'Leer términos'
    }
  ];

  const getTypeColor = (type) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type) => {
    const icons = {
      info: <Info className="w-4 h-4" />,
      success: <CheckCircle className="w-4 h-4" />,
      warning: <AlertCircle className="w-4 h-4" />,
      error: <XCircle className="w-4 h-4" />
    };
    return icons[type] || <Info className="w-4 h-4" />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const translateType = (type) => {
    const translations = {
      info: 'Información',
      success: 'Éxito',
      warning: 'Advertencia',
      error: 'Error'
    };
    return translations[type] || type;
  };

  const translatePriority = (priority) => {
    const translations = {
      high: 'Alta',
      medium: 'Media',
      low: 'Baja'
    };
    return translations[priority] || priority;
  };

  const translateAudience = (audience) => {
    const translations = {
      all: 'Todos',
      customers: 'Clientes',
      professionals: 'Profesionales',
      admins: 'Administradores'
    };
    return translations[audience] || audience;
  };

  const handleCreateAnnouncement = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      priority: 'medium',
      audience: 'all',
      startDate: '',
      endDate: '',
      isActive: true,
      showOnDashboard: true,
      showAsNotification: false,
      actionUrl: '',
      actionText: ''
    });
    setShowCreateModal(true);
  };

  const handleEditAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setFormData({
      title: announcement.title || '',
      message: announcement.message || '',
      type: announcement.type || 'info',
      priority: announcement.priority || 'medium',
      audience: announcement.audience || 'all',
      startDate: announcement.startDate ? announcement.startDate.split('T')[0] : '',
      endDate: announcement.endDate ? announcement.endDate.split('T')[0] : '',
      isActive: announcement.isActive ?? true,
      showOnDashboard: announcement.showOnDashboard ?? true,
      showAsNotification: announcement.showAsNotification ?? false,
      actionUrl: announcement.actionUrl || '',
      actionText: announcement.actionText || ''
    });
    setShowEditModal(true);
  };

  const handleSaveAnnouncement = () => {
    // Implementation for saving announcement
    console.log('Saving announcement:', formData);
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedAnnouncement(null);
  };

  const handleDeleteAnnouncement = (announcementId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este anuncio?')) {
      // Implementation for deleting announcement
      console.log('Deleting announcement:', announcementId);
    }
  };

  const handleToggleActive = (announcementId) => {
    // Implementation for toggling announcement active status
    console.log('Toggling active status for announcement:', announcementId);
  };

  const filteredAnnouncements = announcementsData.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && announcement.isActive) ||
                         (statusFilter === 'inactive' && !announcement.isActive);
    const matchesType = typeFilter === 'all' || announcement.type === typeFilter;
    const matchesAudience = audienceFilter === 'all' || announcement.audience === audienceFilter;
    return matchesSearch && matchesStatus && matchesType && matchesAudience;
  });

  const AnnouncementModal = ({ show, onClose, title, isEdit = false }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Anuncio
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Título del anuncio"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Contenido del anuncio"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="info">Información</option>
                  <option value="success">Éxito</option>
                  <option value="warning">Advertencia</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Audiencia
                </label>
                <select
                  value={formData.audience}
                  onChange={(e) => setFormData({...formData, audience: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todos</option>
                  <option value="customers">Clientes</option>
                  <option value="professionals">Profesionales</option>
                  <option value="admins">Administradores</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de Acción (Opcional)
                </label>
                <input
                  type="url"
                  value={formData.actionUrl}
                  onChange={(e) => setFormData({...formData, actionUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto del Botón (Opcional)
                </label>
                <input
                  type="text"
                  value={formData.actionText}
                  onChange={(e) => setFormData({...formData, actionText: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ver más"
                />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-800">Configuración de Visualización</h4>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Anuncio activo
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="showOnDashboard"
                    type="checkbox"
                    checked={formData.showOnDashboard}
                    onChange={(e) => setFormData({...formData, showOnDashboard: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showOnDashboard" className="ml-2 text-sm text-gray-700">
                    Mostrar en dashboard
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="showAsNotification"
                    type="checkbox"
                    checked={formData.showAsNotification}
                    onChange={(e) => setFormData({...formData, showAsNotification: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showAsNotification" className="ml-2 text-sm text-gray-700">
                    Enviar como notificación
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveAnnouncement}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isEdit ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-orange-500" />
            Gestión de Anuncios
          </h2>
          <p className="text-gray-600 mt-1">Administra los anuncios y notificaciones de la plataforma</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleCreateAnnouncement}
            className="flex items-center gap-2 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700"
          >
            <Plus className="w-4 h-4" />
            Nuevo Anuncio
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Megaphone className="w-8 h-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Anuncios</div>
              <div className="text-2xl font-bold text-gray-900">{announcementsData.length}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Eye className="w-8 h-8 text-green-500" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Activos</div>
              <div className="text-2xl font-bold text-gray-900">
                {announcementsData.filter(a => a.isActive).length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Vistas Totales</div>
              <div className="text-2xl font-bold text-gray-900">
                {announcementsData.reduce((total, a) => total + a.views, 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="w-8 h-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Clicks Totales</div>
              <div className="text-2xl font-bold text-gray-900">
                {announcementsData.reduce((total, a) => total + a.clicks, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar anuncios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="info">Información</option>
              <option value="success">Éxito</option>
              <option value="warning">Advertencia</option>
              <option value="error">Error</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las audiencias</option>
              <option value="customers">Clientes</option>
              <option value="professionals">Profesionales</option>
              <option value="admins">Administradores</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Announcements Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Lista de Anuncios</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anuncio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Audiencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vigencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estadísticas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAnnouncements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`p-2 rounded-lg ${getTypeColor(announcement.type)}`}>
                          {getTypeIcon(announcement.type)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {announcement.title}
                          {announcement.showAsNotification && (
                            <Bell className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{announcement.message}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(announcement.type)}`}>
                      {translateType(announcement.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(announcement.priority)}`}>
                      {translatePriority(announcement.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {translateAudience(announcement.audience)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <div>{new Date(announcement.startDate).toLocaleDateString('es-ES')}</div>
                        <div className="text-xs">hasta {new Date(announcement.endDate).toLocaleDateString('es-ES')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-gray-400" />
                        {announcement.views.toLocaleString()} vistas
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-400" />
                        {announcement.clicks} clicks
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(announcement.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        announcement.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          announcement.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEditAnnouncement(announcement)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <AnnouncementModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Anuncio"
        isEdit={false}
      />

      {/* Edit Modal */}
      <AnnouncementModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Anuncio"
        isEdit={true}
      />
    </div>
  );
};

export default AnnouncementManagement;