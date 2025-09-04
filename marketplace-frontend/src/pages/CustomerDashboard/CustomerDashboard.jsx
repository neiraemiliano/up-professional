import React, { useState } from 'react';
import useAuth from '../../hooks/context/useAuth';
import {
  Search,
  Calendar,
  Star,
  Clock,
  MapPin,
  Phone,
  DollarSign,
  BookOpen,
  Heart,
  History,
  Plus,
  Filter,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  User
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [activeRequests] = useState([
    {
      id: 1,
      service: 'Plomería',
      professional: 'Juan Pérez',
      status: 'confirmed',
      date: '2024-01-20',
      time: '14:00',
      location: 'Buenos Aires, CABA',
      price: 5000,
      avatar: 'JP'
    },
    {
      id: 2,
      service: 'Electricidad',
      professional: 'María García',
      status: 'pending',
      date: '2024-01-22',
      time: '10:00',
      location: 'Buenos Aires, CABA',
      price: 3500,
      avatar: 'MG'
    }
  ]);

  const [recentServices] = useState([
    {
      id: 1,
      service: 'Limpieza del hogar',
      professional: 'Ana Rodríguez',
      date: '2024-01-15',
      rating: 5,
      price: 2500,
      status: 'completed'
    },
    {
      id: 2,
      service: 'Reparación de aires acondicionados',
      professional: 'Carlos López',
      date: '2024-01-10',
      rating: 4,
      price: 4000,
      status: 'completed'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmado';
      case 'pending': return 'Pendiente';
      case 'in_progress': return 'En Progreso';
      case 'completed': return 'Completado';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              ¡Bienvenido, {user?.name || 'Usuario'}!
            </h1>
            <p className="text-green-100">
              Encuentra los mejores profesionales para tus necesidades
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <User className="w-12 h-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Buscar Profesionales</h3>
              <p className="text-sm text-gray-600">Encuentra expertos cerca tuyo</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Nueva Solicitud</h3>
              <p className="text-sm text-gray-600">Solicita un servicio</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <History className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Mi Historial</h3>
              <p className="text-sm text-gray-600">Ver servicios anteriores</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 ml-auto" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeRequests.length}</p>
              <p className="text-sm text-gray-600">Solicitudes Activas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{recentServices.length}</p>
              <p className="text-sm text-gray-600">Completados</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">4.8</p>
              <p className="text-sm text-gray-600">Promedio</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-600">Favoritos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Solicitudes Activas</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver todas
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {activeRequests.map((request) => (
              <div key={request.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold text-sm">
                      {request.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{request.service}</h3>
                      <p className="text-sm text-gray-600">{request.professional}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {request.date} - {request.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {request.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                    <p className="text-sm font-semibold text-gray-900 mt-2">
                      ${request.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {activeRequests.length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No tienes solicitudes activas</p>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Crear nueva solicitud
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Services */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Servicios Recientes</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver historial
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {recentServices.map((service) => (
              <div key={service.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{service.service}</h3>
                    <p className="text-sm text-gray-600">{service.professional}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < service.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {service.date}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(service.status)}`}>
                      {getStatusText(service.status)}
                    </span>
                    <p className="text-sm font-semibold text-gray-900 mt-2">
                      ${service.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Professionals */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Profesionales Recomendados</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Ver más
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-semibold">
                    P{i}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Profesional {i}</h3>
                    <p className="text-sm text-gray-600">Especialidad</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>4.{8 + i}</span>
                  </div>
                  <span className="text-gray-500">$2,500</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;