import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Briefcase,
  Eye,
  Filter,
  Download
} from 'lucide-react';
import { useBookingMetrics } from '../../../hooks/api/admin';
import StatsCard from './StatsCard';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';

const BookingManagement = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: bookingMetrics, isLoading, error } = useBookingMetrics(selectedPeriod);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <AlertCircle className="w-4 h-4" />,
      confirmed: <CheckCircle className="w-4 h-4" />,
      in_progress: <Clock className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />
    };
    return icons[status] || <AlertCircle className="w-4 h-4" />;
  };

  const translateStatus = (status) => {
    const translations = {
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      in_progress: 'En Progreso',
      completed: 'Completado',
      cancelled: 'Cancelado'
    };
    return translations[status] || status;
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
        Error al cargar datos de bookings: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-500" />
            Gestión de Trabajos
          </h2>
          <p className="text-gray-600 mt-1">Administra y monitorea todos los trabajos de la plataforma</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Trabajos"
          value={bookingMetrics?.stats?._count?.id || 0}
          icon={Briefcase}
          color="blue"
        />
        <StatsCard
          title="Ingresos Totales"
          value={`$${(bookingMetrics?.stats?._sum?.finalPrice || 0).toLocaleString()}`}
          icon={DollarSign}
          color="green"
        />
        <StatsCard
          title="Valor Promedio"
          value={`$${Math.round(bookingMetrics?.stats?._avg?.finalPrice || 0).toLocaleString()}`}
          icon={TrendingUp}
          color="purple"
        />
        <StatsCard
          title="Tasa de Finalización"
          value={`${bookingMetrics?.completionRate || 0}%`}
          icon={CheckCircle}
          color="green"
        />
      </div>

      {/* Status Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Estado</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {bookingMetrics?.byStatus?.map((statusData) => (
            <div key={statusData.status} className="text-center p-4 rounded-lg border border-gray-100">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-2 ${getStatusColor(statusData.status)}`}>
                {getStatusIcon(statusData.status)}
                {translateStatus(statusData.status)}
              </div>
              <div className="text-2xl font-bold text-gray-900">{statusData._count.status}</div>
              <div className="text-sm text-gray-500">
                {Math.round((statusData._count.status / (bookingMetrics?.stats?._count?.id || 1)) * 100)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Services */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Servicios Más Solicitados</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profesional
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookingMetrics?.topServices?.slice(0, 10)?.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{service.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{service.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {service.Professional?.User?.name} {service.Professional?.User?.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{service.Category?.icon}</span>
                      <span className="text-sm text-gray-900">{service.Category?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {service._count?.Bookings} trabajos
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${service.price?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tendencia de Ingresos</h3>
        <div className="space-y-4">
          {bookingMetrics?.revenueByPeriod?.map((period) => (
            <div key={period.month} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">
                  {new Date(period.month + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </div>
                <div className="text-sm text-gray-500">
                  {period.bookings?.id || 0} trabajos
                </div>
              </div>
              <div className="text-lg font-bold text-green-600">
                ${(period.revenue || 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingManagement;