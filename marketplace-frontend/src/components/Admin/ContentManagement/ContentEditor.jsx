import React, { useState, useEffect } from 'react';
import { X, Save, RotateCcw, Eye, EyeOff } from 'lucide-react';
import DOMPurify from 'dompurify';

const ContentEditor = ({ content, isCreating, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    key: '',
    name: '',
    value: '',
    defaultValue: '',
    description: '',
    type: 'text',
    category: 'general',
    isActive: true,
    metadata: {}
  });
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (content) {
      setFormData({
        key: content.key || '',
        name: content.name || '',
        value: content.value || '',
        defaultValue: content.defaultValue || '',
        description: content.description || '',
        type: content.type || 'text',
        category: content.category || 'general',
        isActive: content.isActive !== undefined ? content.isActive : true,
        metadata: content.metadata || {}
      });
    } else {
      // Reset for new content
      setFormData({
        key: '',
        name: '',
        value: '',
        defaultValue: '',
        description: '',
        type: 'text',
        category: 'general',
        isActive: true,
        metadata: {}
      });
    }
  }, [content]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.key.trim()) {
      newErrors.key = 'La clave es requerida';
    } else if (!/^[a-z0-9_]+$/.test(formData.key)) {
      newErrors.key = 'La clave solo puede contener letras minúsculas, números y guiones bajos';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.value.trim()) {
      newErrors.value = 'El contenido es requerido';
    }
    
    if (formData.type === 'url' && formData.value && !isValidUrl(formData.value)) {
      newErrors.value = 'Debe ser una URL válida';
    }
    
    if (formData.type === 'email' && formData.value && !isValidEmail(formData.value)) {
      newErrors.value = 'Debe ser un email válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Si no se especifica defaultValue, usar el value inicial
      const dataToSave = {
        ...formData,
        defaultValue: formData.defaultValue || formData.value
      };
      
      await onSave(dataToSave);
    } catch (error) {
      console.error('Error saving content:', error);
      setErrors({ submit: 'Error al guardar el contenido' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (content) {
      setFormData(prev => ({
        ...prev,
        value: content.defaultValue || content.value
      }));
    }
  };

  const renderPreview = () => {
    if (!formData.value) return null;

    switch (formData.type) {
      case 'html':
        return (
          <div 
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(formData.value, {
                ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img'],
                ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'class']
              })
            }}
            className="prose max-w-none"
          />
        );
      case 'url':
        return (
          <a 
            href={formData.value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {formData.value}
          </a>
        );
      case 'email':
        return (
          <a 
            href={`mailto:${formData.value}`}
            className="text-blue-600 hover:underline"
          >
            {formData.value}
          </a>
        );
      default:
        return (
          <p className="whitespace-pre-wrap">{formData.value}</p>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {isCreating ? 'Crear Contenido' : 'Editar Contenido'}
            </h2>
            {content && (
              <p className="text-sm text-gray-500 mt-1">
                Clave: <code className="bg-gray-100 px-1 rounded">{content.key}</code>
              </p>
            )}
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[calc(90vh-80px)]">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Form Fields */}
              <div className="space-y-4">
                {/* Key */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Clave *
                  </label>
                  <input
                    type="text"
                    value={formData.key}
                    onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value.toLowerCase() }))}
                    disabled={!isCreating}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.key ? 'border-red-500' : 'border-gray-300'
                    } ${!isCreating ? 'bg-gray-50' : ''}`}
                    placeholder="hero_title, footer_text, etc."
                  />
                  {errors.key && <p className="text-red-500 text-sm mt-1">{errors.key}</p>}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Título del Hero, Texto del Footer, etc."
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descripción de qué es este contenido y dónde se usa"
                  />
                </div>

                {/* Type and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="text">Texto</option>
                      <option value="html">HTML</option>
                      <option value="url">URL</option>
                      <option value="email">Email</option>
                      <option value="number">Número</option>
                      <option value="boolean">Booleano</option>
                      <option value="json">JSON</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="general">General</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Active Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    Contenido activo
                  </label>
                </div>
              </div>

              {/* Right Column - Content and Preview */}
              <div className="space-y-4">
                {/* Content Value */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Contenido *
                    </label>
                    <div className="flex space-x-2">
                      {content && content.value !== content.defaultValue && (
                        <button
                          type="button"
                          onClick={handleReset}
                          className="flex items-center space-x-1 text-xs text-yellow-600 hover:text-yellow-700"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restaurar</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700"
                      >
                        {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showPreview ? 'Ocultar' : 'Vista previa'}</span>
                      </button>
                    </div>
                  </div>
                  
                  <textarea
                    value={formData.value}
                    onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                    rows={formData.type === 'html' || formData.type === 'json' ? 8 : 4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm ${
                      errors.value ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={`Ingresa el contenido ${formData.type}...`}
                  />
                  {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value}</p>}
                </div>

                {/* Preview */}
                {showPreview && formData.value && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vista Previa
                    </label>
                    <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 min-h-[100px]">
                      {renderPreview()}
                    </div>
                  </div>
                )}

                {/* Default Value (only when editing) */}
                {!isCreating && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor por Defecto
                    </label>
                    <textarea
                      value={formData.defaultValue}
                      onChange={(e) => setFormData(prev => ({ ...prev, defaultValue: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm bg-gray-50"
                      placeholder="Valor por defecto del contenido"
                    />
                  </div>
                )}
              </div>
            </div>

            {errors.submit && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t p-6 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Guardando...' : 'Guardar'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentEditor;