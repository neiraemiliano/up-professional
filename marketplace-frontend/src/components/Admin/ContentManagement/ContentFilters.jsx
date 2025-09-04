import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const ContentFilters = ({ filters, categories, onChange }) => {
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  const handleSearchChange = (value) => {
    setLocalSearch(value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      onChange({ ...filters, search: value });
    }, 300);
    
    return () => clearTimeout(timeoutId);
  };

  const handleCategoryChange = (category) => {
    onChange({ ...filters, category });
  };

  const clearFilters = () => {
    setLocalSearch('');
    onChange({ category: '', search: '' });
  };

  const hasActiveFilters = filters.category || filters.search;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-900 flex items-center space-x-2">
          <Filter className="w-4 h-4" />
          <span>Filtros</span>
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <X className="w-3 h-3" />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buscar
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Buscar por nombre, clave o descripción..."
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categoría
        </label>
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryChange('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !filters.category 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'hover:bg-gray-50 border border-transparent'
            }`}
          >
            Todas las categorías
          </button>
          
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors capitalize ${
                filters.category === category
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              {category.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="pt-3 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Filtros activos:</h4>
          <div className="space-y-1">
            {filters.category && (
              <div className="flex items-center justify-between bg-blue-50 px-2 py-1 rounded text-xs">
                <span>
                  <strong>Categoría:</strong> {filters.category.replace('_', ' ')}
                </span>
                <button
                  onClick={() => handleCategoryChange('')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            {filters.search && (
              <div className="flex items-center justify-between bg-blue-50 px-2 py-1 rounded text-xs">
                <span>
                  <strong>Buscar:</strong> "{filters.search}"
                </span>
                <button
                  onClick={() => {
                    setLocalSearch('');
                    onChange({ ...filters, search: '' });
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="pt-3 border-t">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Acciones rápidas:</h4>
        <div className="space-y-1">
          <button
            onClick={() => onChange({ ...filters, category: 'hero' })}
            className="w-full text-left px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
          >
            🎯 Ver contenido del Hero
          </button>
          <button
            onClick={() => onChange({ ...filters, category: 'buttons' })}
            className="w-full text-left px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
          >
            🔘 Ver todos los botones
          </button>
          <button
            onClick={() => onChange({ ...filters, category: 'footer' })}
            className="w-full text-left px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
          >
            📄 Ver contenido del Footer
          </button>
          <button
            onClick={() => onChange({ ...filters, search: 'modificado' })}
            className="w-full text-left px-2 py-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
          >
            ✏️ Ver contenido modificado
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContentFilters;