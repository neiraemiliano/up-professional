import React, { useState } from 'react';
import {
  Flag,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Search,
  Filter,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  Settings,
  Code,
  Users,
  Globe,
  ChevronDown,
  Eye
} from 'lucide-react';
import {
  useFeatureFlags,
  useCreateFeatureFlag,
  useUpdateFeatureFlag,
  useDeleteFeatureFlag,
  useToggleFeatureFlag
} from '../../../hooks/api/featureFlags';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';

const FeatureFlagManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    category: 'general',
    isEnabled: true,
    metadata: {}
  });

  // API Hooks
  const { data: featureFlags = [], isLoading, error, refetch } = useFeatureFlags();
  const createMutation = useCreateFeatureFlag();
  const updateMutation = useUpdateFeatureFlag();
  const deleteMutation = useDeleteFeatureFlag();
  const toggleMutation = useToggleFeatureFlag();

  // Categories for filtering and creation
  const categories = [
    { value: 'general', label: 'General', color: 'blue' },
    { value: 'ui', label: 'Interfaz', color: 'purple' },
    { value: 'api', label: 'API', color: 'green' },
    { value: 'experimental', label: 'Experimental', color: 'orange' },
    { value: 'payment', label: 'Pagos', color: 'yellow' },
    { value: 'search', label: 'Búsqueda', color: 'indigo' },
    { value: 'notifications', label: 'Notificaciones', color: 'pink' }
  ];

  // Filter feature flags
  const filteredFlags = featureFlags.filter(flag => {
    const matchesSearch = flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flag.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || flag.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'enabled' && flag.isEnabled) ||
                         (statusFilter === 'disabled' && !flag.isEnabled);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryInfo = (category) => {
    return categories.find(c => c.value === category) || categories[0];
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      category: 'general',
      isEnabled: true,
      metadata: {}
    });
  };

  const handleCreate = () => {
    setShowCreateModal(true);
    resetForm();
  };

  const handleEdit = (flag) => {
    setSelectedFlag(flag);
    setFormData({
      id: flag.id,
      name: flag.name,
      description: flag.description,
      category: flag.category,
      isEnabled: flag.isEnabled,
      metadata: flag.metadata || {}
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (showCreateModal) {
        await createMutation.mutateAsync(formData);
        setShowCreateModal(false);
      } else {
        await updateMutation.mutateAsync({ 
          id: selectedFlag.id, 
          data: formData 
        });
        setShowEditModal(false);
      }
      resetForm();
      refetch();
    } catch (error) {
      console.error('Error saving feature flag:', error);
    }
  };

  const handleToggle = async (flag) => {
    try {
      await toggleMutation.mutateAsync(flag.id);
      refetch();
    } catch (error) {
      console.error('Error toggling feature flag:', error);
    }
  };

  const handleDelete = async (flag) => {
    if (window.confirm(`¿Estás seguro de eliminar la feature flag "${flag.name}"?`)) {
      try {
        await deleteMutation.mutateAsync(flag.id);
        refetch();
      } catch (error) {
        console.error('Error deleting feature flag:', error);
      }
    }
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedFlag(null);
    resetForm();
  };

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Flag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Feature Flags</h2>
            <p className="text-gray-600">Gestiona las funcionalidades del sistema</p>
          </div>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          Nueva Feature Flag
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar feature flags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las categorías</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="enabled">Habilitadas</option>
              <option value="disabled">Deshabilitadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feature Flags List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Feature Flag</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Categoría</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Estado</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Descripción</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredFlags.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No se encontraron feature flags
                    </td>
                  </tr>
                ) : (
                  filteredFlags.map((flag) => {
                    const categoryInfo = getCategoryInfo(flag.category);
                    return (
                      <tr key={flag.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              categoryInfo.color === 'blue' ? 'bg-blue-100' :
                              categoryInfo.color === 'purple' ? 'bg-purple-100' :
                              categoryInfo.color === 'green' ? 'bg-green-100' :
                              categoryInfo.color === 'orange' ? 'bg-orange-100' :
                              categoryInfo.color === 'yellow' ? 'bg-yellow-100' :
                              categoryInfo.color === 'indigo' ? 'bg-indigo-100' :
                              categoryInfo.color === 'pink' ? 'bg-pink-100' : 'bg-gray-100'
                            }`}>
                              <Flag className={`w-4 h-4 ${
                                categoryInfo.color === 'blue' ? 'text-blue-600' :
                                categoryInfo.color === 'purple' ? 'text-purple-600' :
                                categoryInfo.color === 'green' ? 'text-green-600' :
                                categoryInfo.color === 'orange' ? 'text-orange-600' :
                                categoryInfo.color === 'yellow' ? 'text-yellow-600' :
                                categoryInfo.color === 'indigo' ? 'text-indigo-600' :
                                categoryInfo.color === 'pink' ? 'text-pink-600' : 'text-gray-600'
                              }`} />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{flag.name}</div>
                              <div className="text-sm text-gray-500">ID: {flag.id}</div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            categoryInfo.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                            categoryInfo.color === 'purple' ? 'bg-purple-100 text-purple-800' :
                            categoryInfo.color === 'green' ? 'bg-green-100 text-green-800' :
                            categoryInfo.color === 'orange' ? 'bg-orange-100 text-orange-800' :
                            categoryInfo.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                            categoryInfo.color === 'indigo' ? 'bg-indigo-100 text-indigo-800' :
                            categoryInfo.color === 'pink' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {categoryInfo.label}
                          </span>
                        </td>
                        
                        <td className="py-4 px-6">
                          <button
                            onClick={() => handleToggle(flag)}
                            disabled={toggleMutation.isPending}
                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                              flag.isEnabled
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {flag.isEnabled ? (
                              <>
                                <ToggleRight className="w-4 h-4" />
                                Habilitada
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-4 h-4" />
                                Deshabilitada
                              </>
                            )}
                          </button>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {flag.description || 'Sin descripción'}
                          </div>
                        </td>
                        
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(flag)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(flag)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {showCreateModal ? 'Nueva Feature Flag' : 'Editar Feature Flag'}
                </h3>
                <button
                  onClick={closeModals}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ID de la Feature Flag *
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ej: voice_input, advanced_search"
                    required
                    disabled={showEditModal}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Identificador único en snake_case (no se puede modificar después)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nombre descriptivo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Describe qué hace esta feature flag..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isEnabled"
                    checked={formData.isEnabled}
                    onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isEnabled" className="text-sm font-medium text-gray-700">
                    Habilitada al crear
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {showCreateModal ? 'Crear' : 'Guardar'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureFlagManagement;