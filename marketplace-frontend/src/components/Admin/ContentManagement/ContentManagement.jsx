import React, { useState } from 'react';
import { useAdminContent } from '../../../hooks/api/content';
import ContentList from './ContentList';
import ContentEditor from './ContentEditor';
import ContentFilters from './ContentFilters';
import { Loader2, Plus } from 'lucide-react';

const ContentManagement = () => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filters, setFilters] = useState({ category: '', search: '' });
  
  const {
    content,
    categories,
    loading,
    error,
    fetchContent,
    createContent,
    updateContent,
    resetContent,
    deleteContent,
    bulkUpdateContent
  } = useAdminContent();

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchContent(newFilters);
  };

  const handleEdit = (contentItem) => {
    setSelectedContent(contentItem);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setSelectedContent(null);
    setIsCreating(true);
  };

  const handleSave = async (data) => {
    try {
      if (isCreating) {
        await createContent(data);
      } else {
        await updateContent(selectedContent.id, data);
      }
      setSelectedContent(null);
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving content:', error);
      throw error;
    }
  };

  const handleReset = async (id) => {
    try {
      await resetContent(id);
    } catch (error) {
      console.error('Error resetting content:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContent(id);
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  };

  const handleBulkUpdate = async (updates) => {
    try {
      await bulkUpdateContent(updates);
    } catch (error) {
      console.error('Error bulk updating content:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-medium mb-2">Error al cargar contenido</h3>
        <p className="text-red-600">{error.message}</p>
        <button 
          onClick={() => fetchContent(filters)}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Contenido</h1>
          <p className="text-gray-600 mt-1">
            Administra todos los textos y contenido de la aplicación
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Contenido</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-blue-600 text-sm font-medium">Total Contenidos</div>
          <div className="text-2xl font-bold text-blue-700">{content.length}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-green-600 text-sm font-medium">Categorías</div>
          <div className="text-2xl font-bold text-green-700">{categories.length}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-yellow-600 text-sm font-medium">Activos</div>
          <div className="text-2xl font-bold text-yellow-700">
            {content.filter(c => c.isActive).length}
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-purple-600 text-sm font-medium">Modificados</div>
          <div className="text-2xl font-bold text-purple-700">
            {content.filter(c => c.value !== c.defaultValue).length}
          </div>
        </div>
      </div>

      {/* Content Editor Modal */}
      {(selectedContent || isCreating) && (
        <ContentEditor
          content={selectedContent}
          isCreating={isCreating}
          categories={categories}
          onSave={handleSave}
          onCancel={() => {
            setSelectedContent(null);
            setIsCreating(false);
          }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ContentFilters
            filters={filters}
            categories={categories}
            onChange={handleFilterChange}
          />
        </div>

        {/* Content List */}
        <div className="lg:col-span-3">
          <ContentList
            content={content}
            onEdit={handleEdit}
            onReset={handleReset}
            onDelete={handleDelete}
            onBulkUpdate={handleBulkUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;