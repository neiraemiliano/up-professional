import React, { useState, memo, useMemo, useCallback } from 'react';
import { 
  Edit, 
  RotateCcw, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search,
  CheckSquare,
  Square,
  Save
} from 'lucide-react';

const ContentList = ({ content, onEdit, onReset, onDelete, onBulkUpdate }) => {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [sortBy, setSortBy] = useState('category');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showInactive, setShowInactive] = useState(true);

  // Funciones de ordenamiento y filtrado
  const filteredAndSortedContent = React.useMemo(() => {
    let filtered = showInactive 
      ? content 
      : content.filter(item => item.isActive);

    return filtered.sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [content, sortBy, sortOrder, showInactive]);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.size === filteredAndSortedContent.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredAndSortedContent.map(item => item.id)));
    }
  }, [selectedItems.size, filteredAndSortedContent]);

  const handleSelectItem = useCallback((id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  }, [selectedItems]);

  const handleBulkReset = useCallback(async () => {
    const updates = Array.from(selectedItems).map(id => {
      const item = content.find(c => c.id === id);
      return { id, value: item.defaultValue };
    });
    
    try {
      await onBulkUpdate(updates);
      setSelectedItems(new Set());
    } catch (error) {
      // Removed console.error for production
    }
  }, [selectedItems, content, onBulkUpdate]);

  const getContentPreview = useCallback((value, type) => {
    if (!value) return '';
    
    if (type === 'html') {
      return value.replace(/<[^>]*>/g, '').substring(0, 100) + '...';
    }
    
    if (value.length > 100) {
      return value.substring(0, 100) + '...';
    }
    
    return value;
  }, []);

  const getCategoryColor = useCallback((category) => {
    const colors = {
      hero: 'bg-blue-100 text-blue-800',
      footer: 'bg-gray-100 text-gray-800',
      contact: 'bg-green-100 text-green-800',
      professional: 'bg-purple-100 text-purple-800',
      search: 'bg-yellow-100 text-yellow-800',
      buttons: 'bg-indigo-100 text-indigo-800',
      notifications: 'bg-red-100 text-red-800',
      social: 'bg-pink-100 text-pink-800',
      how_it_works: 'bg-teal-100 text-teal-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.general;
  }, []);

  if (content.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay contenido</h3>
        <p className="text-gray-500">Agrega el primer contenido para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header with controls */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm"
            >
              <option value="category">Categoría</option>
              <option value="name">Nombre</option>
              <option value="key">Clave</option>
              <option value="updatedAt">Fecha</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50"
            >
              {sortOrder === 'asc' ? '↑' : '↓'} {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
            </button>
            
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm ${
                showInactive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {showInactive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>Mostrar inactivos</span>
            </button>
          </div>

          {selectedItems.size > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedItems.size} seleccionados
              </span>
              <button
                onClick={handleBulkReset}
                className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restaurar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 p-3 text-left">
                <button
                  onClick={handleSelectAll}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {selectedItems.size === filteredAndSortedContent.length && filteredAndSortedContent.length > 0 ? 
                    <CheckSquare className="w-4 h-4" /> : 
                    <Square className="w-4 h-4" />
                  }
                </button>
              </th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Nombre</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Clave</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Categoría</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Contenido</th>
              <th className="p-3 text-left text-sm font-medium text-gray-700">Estado</th>
              <th className="p-3 text-right text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedContent.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-3">
                  <button
                    onClick={() => handleSelectItem(item.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {selectedItems.has(item.id) ? 
                      <CheckSquare className="w-4 h-4" /> : 
                      <Square className="w-4 h-4" />
                    }
                  </button>
                </td>
                
                <td className="p-3">
                  <div className="font-medium text-gray-900">{item.name}</div>
                  {item.description && (
                    <div className="text-sm text-gray-500">{item.description}</div>
                  )}
                </td>
                
                <td className="p-3">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {item.key}
                  </code>
                </td>
                
                <td className="p-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </span>
                </td>
                
                <td className="p-3 max-w-xs">
                  <div className="text-sm text-gray-900">
                    {getContentPreview(item.value, item.type)}
                  </div>
                  {item.value !== item.defaultValue && (
                    <div className="text-xs text-yellow-600 mt-1">
                      ✏️ Modificado
                    </div>
                  )}
                </td>
                
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      item.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      item.type === 'html' 
                        ? 'bg-orange-100 text-orange-800'
                        : item.type === 'url'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.type}
                    </span>
                  </div>
                </td>
                
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    {item.value !== item.defaultValue && (
                      <button
                        onClick={() => onReset(item.id)}
                        className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Restaurar valor por defecto"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
                          onDelete(item.id);
                        }
                      }}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
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

      {filteredAndSortedContent.length === 0 && (
        <div className="p-8 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-500">
            Ajusta los filtros o la búsqueda para ver más contenido.
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(ContentList);

// Add display name for better debugging
ContentList.displayName = 'ContentList';