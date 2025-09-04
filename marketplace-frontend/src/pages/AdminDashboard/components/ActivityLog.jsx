import React, { useState } from 'react';
import { 
  Activity, 
  User, 
  UserPlus, 
  Briefcase, 
  Star, 
  Clock, 
  Calendar,
  Filter,
  Search,
  ChevronDown
} from 'lucide-react';
import { useRecentActivity } from '../../../hooks/api/admin';
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';

const ActivityLog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activityFilter, setActivityFilter] = useState('all');
  const { data: activities, isLoading, error } = useRecentActivity();

  const getActivityIcon = (type) => {
    const icons = {
      user_registered: <UserPlus className="w-5 h-5 text-green-500" />,
      service_created: <Briefcase className="w-5 h-5 text-blue-500" />,
      booking_created: <Calendar className="w-5 h-5 text-purple-500" />,
      review_created: <Star className="w-5 h-5 text-yellow-500" />,
      professional_verified: <User className="w-5 h-5 text-green-600" />,
      payment_completed: <Briefcase className="w-5 h-5 text-green-500" />,
    };
    return icons[type] || <Activity className="w-5 h-5 text-gray-500" />;
  };

  const getActivityColor = (type) => {
    const colors = {
      user_registered: 'border-green-200 bg-green-50',
      service_created: 'border-blue-200 bg-blue-50',
      booking_created: 'border-purple-200 bg-purple-50',
      review_created: 'border-yellow-200 bg-yellow-50',
      professional_verified: 'border-green-200 bg-green-50',
      payment_completed: 'border-green-200 bg-green-50',
    };
    return colors[type] || 'border-gray-200 bg-gray-50';
  };

  const getActivityItems = (activityData) => {
    if (!activityData) return [];
    
    const activities = [];

    // Nuevos usuarios
    if (activityData.users) {
      activityData.users.forEach(user => {
        activities.push({
          id: `user-${user.id}`,
          type: 'user_registered',
          message: `Nuevo usuario registrado: ${user.name} ${user.lastName}`,
          details: `Rol: ${user.role} - Email: ${user.email}`,
          timestamp: user.createdAt
        });
      });
    }

    // Nuevos profesionales
    if (activityData.professionals) {
      activityData.professionals.forEach(professional => {
        activities.push({
          id: `professional-${professional.id}`,
          type: 'professional_verified',
          message: `Nuevo profesional registrado: ${professional.User.name} ${professional.User.lastName}`,
          details: `Ubicación: ${professional.location?.city || 'Sin especificar'} - Email: ${professional.User.email}`,
          timestamp: professional.createdAt
        });
      });
    }

    // Nuevos bookings
    if (activityData.bookings) {
      activityData.bookings.forEach(booking => {
        activities.push({
          id: `booking-${booking.id}`,
          type: 'booking_created',
          message: `Nuevo trabajo creado por ${booking.User.name} ${booking.User.lastName}`,
          details: `Servicio: ${booking.Service?.title || 'N/A'} - Monto: $${booking.totalAmount || booking.finalPrice || 0}`,
          timestamp: booking.createdAt
        });
      });
    }

    // Nuevas reviews
    if (activityData.reviews) {
      activityData.reviews.forEach(review => {
        activities.push({
          id: `review-${review.id}`,
          type: 'review_created',
          message: `Nueva reseña de ${review.User.name} ${review.User.lastName}`,
          details: `Calificación: ${review.rating}⭐ para ${review.Professional?.User?.name || 'Profesional'}`,
          timestamp: review.createdAt
        });
      });
    }

    // Nuevos servicios
    if (activityData.services) {
      activityData.services.forEach(service => {
        activities.push({
          id: `service-${service.id}`,
          type: 'service_created',
          message: `Nuevo servicio publicado: "${service.title}"`,
          details: `Por: ${service.Professional?.User?.name || 'Profesional'} - Categoría: ${service.Category?.name || 'N/A'} - Precio: $${service.price || 0}`,
          timestamp: service.createdAt
        });
      });
    }

    // Ordenar por fecha (más reciente primero)
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 50); // Mostrar los 50 más recientes
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
        Error al cargar el log de actividad: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-500" />
            Log de Actividad
          </h2>
          <p className="text-gray-600 mt-1">Monitorea todas las actividades de la plataforma en tiempo real</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar actividad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las actividades</option>
              <option value="user_registered">Registros de usuarios</option>
              <option value="service_created">Servicios creados</option>
              <option value="booking_created">Trabajos creados</option>
              <option value="review_created">Reviews creadas</option>
              <option value="professional_verified">Profesionales verificados</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Actividades Hoy</div>
              <div className="text-2xl font-bold text-gray-900">{getActivityItems(activities)?.length || 0}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserPlus className="w-8 h-8 text-green-500" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Nuevos Usuarios</div>
              <div className="text-2xl font-bold text-gray-900">{activities?.users?.length || 0}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Briefcase className="w-8 h-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Servicios Creados</div>
              <div className="text-2xl font-bold text-gray-900">{activities?.services?.length || 0}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Reviews Recientes</div>
              <div className="text-2xl font-bold text-gray-900">{activities?.reviews?.length || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
        </div>
        <div className="p-6">
          {(() => {
            const activityItems = getActivityItems(activities);
            return activityItems && activityItems.length > 0 ? (
              <div className="flow-root">
                <ul className="-mb-8">
                  {activityItems.map((activity, idx) => {
                    return (
                      <li key={activity.id || idx}>
                        <div className="relative pb-8">
                          {idx !== activityItems.length - 1 && (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          )}
                          <div className="relative flex space-x-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${getActivityColor(activity.type)} border-2`}>
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {activity.message}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {activity.details}
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                <time dateTime={activity.timestamp}>
                                  {new Date(activity.timestamp).toLocaleString('es-ES', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No hay actividades recientes para mostrar</p>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Real-time Activity Indicator */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">
              Monitoreo en tiempo real activado
            </p>
            <p className="text-sm text-green-600">
              Las nuevas actividades aparecerán automáticamente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;