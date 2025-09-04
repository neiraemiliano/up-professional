import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Filter,
  ChevronDown,
  Star,
  MapPin,
  Briefcase,
  CheckCircle,
  Award,
  Eye,
  Settings,
  Users,
  Phone,
  Mail,
  Calendar,
  Clock,
  AlertCircle,
  Shield
} from 'lucide-react';
import { useProfessionalMetrics } from '../../../hooks/api/admin';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import TopProfessionalsTable from './TopProfessionalsTable';

const ProfessionalsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const { data: professionalMetrics, isLoading, error } = useProfessionalMetrics();

  const getVerificationColor = (isVerified) => {
    return isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        Error al cargar datos de profesionales: {error.message}
      </div>
    );
  }

  const professionals = professionalMetrics?.topProfessionals || [];
  // Calcular estadísticas reales basadas en los datos de la API
  const stats = {
    totalProfessionals: professionalMetrics?.stats?._count?.id || 0,
    verifiedProfessionals: professionalMetrics?.verification?.find(v => v.isVerified === true)?._count?.isVerified || 0,
    avgRating: professionalMetrics?.stats?._avg?.avgRating || 0,
    totalServices: professionalMetrics?.topProfessionals?.reduce((total, prof) => total + (prof._count?.Services || 0), 0) || 0
  };

  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = professional.User?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professional.User?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professional.User?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && professional.User?.isActive) ||
                         (statusFilter === 'inactive' && !professional.User?.isActive);
    const matchesVerification = verificationFilter === 'all' || 
                               (verificationFilter === 'verified' && professional.isVerified) ||
                               (verificationFilter === 'pending' && !professional.isVerified);
    return matchesSearch && matchesStatus && matchesVerification;
  });

  const getInitials = (name, lastName) => {
    return `${name?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : '0.0';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-green-500" />
            Gestión de Profesionales
          </h2>
          <p className="text-gray-600 mt-1">Administra todos los profesionales registrados en la plataforma</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Profesionales</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalProfessionals || 0}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Verificados</div>
              <div className="text-2xl font-bold text-gray-900">{stats.verifiedProfessionals || 0}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Rating Promedio</div>
              <div className="text-2xl font-bold text-gray-900">{stats.avgRating?.toFixed(1) || '0.0'}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Briefcase className="w-8 h-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Servicios</div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalServices || 0}</div>
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
              placeholder="Buscar profesionales..."
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
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Verificación</option>
              <option value="verified">Verificados</option>
              <option value="pending">Pendientes</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Top Professionals Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Top Profesionales
          </h3>
        </div>
        <div className="p-6">
          <TopProfessionalsTable data={professionalMetrics?.topProfessionals} />
        </div>
      </div>

      {/* Detailed Professionals Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Todos los Profesionales ({filteredProfessionals.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profesional
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicios
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
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
              {filteredProfessionals.map((professional) => (
                <tr key={professional.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {professional.User?.avatarUrl ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={professional.User.avatarUrl}
                            alt={`${professional.User.name} ${professional.User.lastName}`}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
                            {getInitials(professional.User?.name, professional.User?.lastName)}
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {professional.User?.name} {professional.User?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">ID: {professional.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {professional.User?.email}
                      </div>
                      {professional.User?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {professional.User.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 ${getRatingColor(professional.avgRating)}`}>
                        <Star className="w-3 h-3 fill-current" />
                        {formatRating(professional.avgRating)}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({professional._count?.Reviews || 0})
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 font-medium">
                        {professional._count?.Services || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {professional.location ? (
                        `${professional.location.city}, ${professional.location.province}`
                      ) : (
                        'Sin especificar'
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getVerificationColor(professional.isVerified)}`}>
                        {professional.isVerified ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Verificado
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            Pendiente
                          </>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Settings className="w-4 h-4" />
                      </button>
                      {!professional.isVerified && (
                        <button className="text-purple-600 hover:text-purple-900">
                          <Shield className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProfessionals.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron profesionales con los filtros aplicados</p>
            </div>
          )}
        </div>
      </div>

      {/* Professional Categories */}
      {professionalMetrics?.topCategories && professionalMetrics.topCategories.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Categorías Más Populares</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {professionalMetrics.topCategories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-500">{category._count?.professionals || 0} profesionales</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {Math.round((category._count?.professionals || 0) / (stats.totalProfessionals || 1) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalsManagement;