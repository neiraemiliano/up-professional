import React from 'react';
import { 
  User, 
  UserCheck, 
  Briefcase, 
  Star, 
  Settings,
  Clock,
  Calendar,
  MapPin,
  DollarSign
} from 'lucide-react';

const RecentActivityTable = ({ data }) => {
  if (!data) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityItems = () => {
    const activities = [];

    // Nuevos usuarios
    if (data.users) {
      data.users.forEach(user => {
        activities.push({
          id: `user-${user.id}`,
          type: 'user',
          icon: User,
          title: 'Nuevo usuario registrado',
          description: `${user.name} ${user.lastName} (${user.role})`,
          time: user.createdAt,
          color: 'blue'
        });
      });
    }

    // Nuevos profesionales
    if (data.professionals) {
      data.professionals.forEach(professional => {
        activities.push({
          id: `professional-${professional.id}`,
          type: 'professional',
          icon: UserCheck,
          title: 'Nuevo profesional registrado',
          description: `${professional.User.name} ${professional.User.lastName} - ${professional.location?.city || 'Sin ubicación'}`,
          time: professional.createdAt,
          color: 'green'
        });
      });
    }

    // Nuevos bookings
    if (data.bookings) {
      data.bookings.forEach(booking => {
        activities.push({
          id: `booking-${booking.id}`,
          type: 'booking',
          icon: Briefcase,
          title: 'Nuevo trabajo creado',
          description: `${booking.User.name} ${booking.User.lastName} contrató a ${booking.Service?.Professional?.User?.name || 'Profesional'}`,
          time: booking.createdAt,
          color: 'orange',
          amount: booking.totalAmount
        });
      });
    }

    // Nuevas reviews
    if (data.reviews) {
      data.reviews.forEach(review => {
        activities.push({
          id: `review-${review.id}`,
          type: 'review',
          icon: Star,
          title: 'Nueva reseña',
          description: `${review.User.name} ${review.User.lastName} calificó a ${review.Professional?.User?.name || 'Profesional'} con ${review.rating}⭐`,
          time: review.createdAt,
          color: 'yellow'
        });
      });
    }

    // Nuevos servicios
    if (data.services) {
      data.services.forEach(service => {
        activities.push({
          id: `service-${service.id}`,
          type: 'service',
          icon: Settings,
          title: 'Nuevo servicio publicado',
          description: `${service.Professional?.User?.name || 'Profesional'} publicó "${service.title}" en ${service.Category?.name || 'Categoría'}`,
          time: service.createdAt,
          color: 'purple',
          amount: service.price
        });
      });
    }

    // Ordenar por fecha (más reciente primero)
    return activities
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 20); // Mostrar solo los 20 más recientes
  };

  const activities = getActivityItems();

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      red: 'bg-red-100 text-red-600 border-red-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay actividad reciente disponible
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const IconComponent = activity.icon;
        return (
          <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border ${getColorClasses(activity.color)}`}>
              <IconComponent className="w-4 h-4" />
            </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {activity.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {formatDate(activity.time)}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mt-1">
              {activity.description}
            </p>

            {activity.amount && (
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600 font-medium">
                <DollarSign className="w-3 h-3" />
                ${activity.amount.toLocaleString()}
              </div>
            )}
          </div>
        </div>
        );
      })}

      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay actividad reciente
        </div>
      )}
    </div>
  );
};

export default RecentActivityTable;