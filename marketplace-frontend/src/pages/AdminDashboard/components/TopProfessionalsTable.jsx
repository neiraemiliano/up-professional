import React from 'react';
import { Star, MapPin, Briefcase, CheckCircle, Award } from 'lucide-react';

const TopProfessionalsTable = ({ data }) => {
  // Validar que data sea un array válido
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay datos de profesionales disponibles
      </div>
    );
  }

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : '0.0';
  };

  const getInitials = (name, lastName) => {
    return `${name?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600 bg-green-100';
    if (rating >= 4.0) return 'text-blue-600 bg-blue-100';
    if (rating >= 3.5) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Profesional
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rating
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trabajos
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
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((professional, index) => (
            <tr key={professional.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {professional.User.avatarUrl ? (
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={professional.User.avatarUrl}
                        alt={`${professional.User.name} ${professional.User.lastName}`}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
                        {getInitials(professional.User.name, professional.User.lastName)}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {professional.User.name} {professional.User.lastName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {professional.User.email}
                    </div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatingColor(professional.avgRating)}`}>
                    <Star className="w-3 h-3 fill-current" />
                    {formatRating(professional.avgRating)}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({professional._count?.Reviews || 0} reviews)
                  </span>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900 font-medium">
                    {professional.completedJobs || 0}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900 font-medium">
                    {professional._count?.Services || 0}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {professional.location ? (
                      `${professional.location.city}, ${professional.location.province}`
                    ) : (
                      'Sin especificar'
                    )}
                  </span>
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  {professional.isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium text-green-800 bg-green-100">
                      <CheckCircle className="w-3 h-3" />
                      Verificado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-800 bg-gray-100">
                      Pendiente
                    </span>
                  )}
                  
                  {/* Ranking badge */}
                  {index < 3 && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${
                      index === 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : index === 1 
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}>
                      #{index + 1}
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No hay profesionales para mostrar</p>
        </div>
      )}
    </div>
  );
};

export default TopProfessionalsTable;