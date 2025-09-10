import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAuth from "../../hooks/context/useAuth";
import { professionalApi } from "../../api/professional";
import OnboardingModal from "../../components/ProfessionalOnboarding/OnboardingModal";
import {
  User,
  Briefcase,
  Star,
  Settings,
  Bell,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Edit,
  Camera,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  CreditCard,
  Plus,
  Filter,
} from "lucide-react";

const ProfessionalDashboard = () => {
  const { user } = useAuth();

  // Query to check onboarding status from backend
  const {
    data: onboardingStatus,
    refetch: refetchOnboardingStatus,
    isLoading: isCheckingOnboarding,
    error: onboardingError,
    isError: hasOnboardingError,
  } = useQuery({
    queryKey: ["onboardingStatus", user?.id],
    queryFn: professionalApi.checkOnboardingStatus,
    enabled: !!user && user.role === "professional",
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2, // Retry twice on failure
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000), // Exponential backoff
  });

  // Mutation to mark onboarding as completed
  const completeOnboardingMutation = useMutation({
    mutationFn: professionalApi.markOnboardingComplete,
    onSuccess: () => {
      refetchOnboardingStatus();
    },
  });

  const handleOnboardingComplete = () => {
    completeOnboardingMutation.mutate();
  };

  // Fallback logic: if API fails, assume onboarding is needed for new professional users
  // This prevents professionals from being stuck if the backend is down
  const shouldShowOnboarding = () => {
    if (isCheckingOnboarding) {
      return false; // Don't show while loading
    }

    if (hasOnboardingError) {
      // API failed - check if user is a new professional without a professional record
      // As a fallback, assume new professional users need onboarding
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "Onboarding status check failed, using fallback logic:",
          onboardingError
        );
      }

      // If user has professional role but we can't verify onboarding status,
      // show onboarding modal as a precaution
      const showFallback = user?.role === "professional";
      return showFallback;
    }

    // API succeeded - check if onboarding is NOT completed
    // Show modal when isCompleted is false
    const shouldShow = onboardingStatus?.data.isCompleted === false;
    return shouldShow;
  };

  // Mock data - In real app, this would come from API
  const [profileData] = useState({
    name: user?.name || "Juan Pérez",
    profession: "Plomero Certificado",
    rating: 4.8,
    reviews: 127,
    completedJobs: 156,
    responseTime: "2h",
    location: "Buenos Aires, CABA",
    phone: "+54 9 11 1234-5678",
    email: user?.email || "juan@ejemplo.com",
    profileImage: null,
    isVerified: true,
    subscription: "premium",
  });

  const [pendingRequests] = useState([
    {
      id: 1,
      service: "Reparación de cañería",
      client: "María González",
      location: "Palermo, CABA",
      date: "2024-01-20",
      time: "14:00",
      budget: 5000,
      description: "Necesito reparar una cañería que tiene una fuga en el baño",
      priority: "urgent",
    },
    {
      id: 2,
      service: "Instalación de grifería",
      client: "Carlos López",
      location: "Villa Crespo, CABA",
      date: "2024-01-22",
      time: "10:00",
      budget: 3500,
      description: "Instalar nueva grifería en cocina",
      priority: "normal",
    },
  ]);

  const [activeJobs] = useState([
    {
      id: 1,
      service: "Mantenimiento plomería",
      client: "Ana Rodríguez",
      location: "Recoleta, CABA",
      date: "2024-01-18",
      status: "in_progress",
      payment: 4500,
    },
  ]);

  const [earnings] = useState({
    thisMonth: 45000,
    lastMonth: 38000,
    pending: 12000,
    total: 580000,
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "normal":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityText = (priority) => {
    switch (priority) {
      case "urgent":
        return "Urgente";
      case "high":
        return "Alta";
      case "normal":
        return "Normal";
      default:
        return "Baja";
    }
  };

  // Show loading state while checking onboarding status
  if (isCheckingOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Verificando estado del perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header with Profile Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                {profileData.profileImage ? (
                  <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10" />
                )}
              </div>
              {profileData.isVerified && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">{profileData.name}</h1>
              <p className="text-blue-100 mb-2">{profileData.profession}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-300 fill-current" />
                  <span>{profileData.rating}</span>
                  <span className="text-blue-100">
                    ({profileData.reviews} reseñas)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>{profileData.completedJobs} trabajos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Responde en {profileData.responseTime}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end gap-2">
            <div
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                profileData.subscription === "premium"
                  ? "bg-yellow-500 text-yellow-900"
                  : "bg-white/20 text-white"
              }`}
            >
              {profileData.subscription === "premium" ? "Premium" : "Básico"}
            </div>
            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Editar Perfil
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                ${earnings.thisMonth.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Este mes</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600">+18%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {pendingRequests.length}
              </p>
              <p className="text-sm text-gray-600">Solicitudes</p>
              {pendingRequests.some((r) => r.priority === "urgent") && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3 text-red-500" />
                  <span className="text-xs text-red-600">Urgente</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {activeJobs.length}
              </p>
              <p className="text-sm text-gray-600">En progreso</p>
              <div className="flex items-center gap-1 mt-1">
                <Clock className="w-3 h-3 text-orange-500" />
                <span className="text-xs text-orange-600">Activos</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {profileData.rating}
              </p>
              <p className="text-sm text-gray-600">Calificación</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">
                  {profileData.reviews} reseñas
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Requests */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Solicitudes Pendientes
              </h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ver todas
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {request.service}
                    </h3>
                    <p className="text-sm text-gray-600">{request.client}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                      request.priority
                    )}`}
                  >
                    {getPriorityText(request.priority)}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {request.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {request.date} - {request.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {request.location}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-green-600">
                    ${request.budget.toLocaleString()}
                  </span>
                  <div className="flex gap-2">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm transition-colors">
                      Rechazar
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                      Aceptar
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {pendingRequests.length === 0 && (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No tienes solicitudes pendientes
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Active Jobs & Profile Quick Edit */}
        <div className="space-y-6">
          {/* Active Jobs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Trabajos Activos
                </h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Ver historial
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {activeJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-blue-50 rounded-lg p-4 border border-blue-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {job.service}
                      </h3>
                      <p className="text-sm text-gray-600">{job.client}</p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      En progreso
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {job.date}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-green-600">
                      ${job.payment.toLocaleString()}
                    </span>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                      Marcar como completado
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Profile Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Perfil Profesional
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Edit className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">
                    Editar información personal
                  </span>
                </div>
                <Eye className="w-4 h-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Gestionar portfolio</span>
                </div>
                <Eye className="w-4 h-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <span className="font-medium">Configurar disponibilidad</span>
                </div>
                <Eye className="w-4 h-4 text-gray-400" />
              </button>

              <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-orange-600" />
                  <span className="font-medium">Actualizar tarifas</span>
                </div>
                <Eye className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Resumen de Ingresos
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Ver detalles
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-green-600">
                ${earnings.thisMonth.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Este mes</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-blue-600">
                ${earnings.lastMonth.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Mes anterior</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-orange-600">
                ${earnings.pending.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Pendiente</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-lg font-bold text-purple-600">
                ${earnings.total.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total histórico</p>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      {(() => {
        const modalShouldOpen = shouldShowOnboarding();
        // OnboardingModal render debug info
        // modalShouldOpen: modalShouldOpen, hasOnboardingError: hasOnboardingError
        // });
        return (
          <OnboardingModal
            isOpen={modalShouldOpen}
            onComplete={handleOnboardingComplete}
            userData={user}
            fallbackMode={hasOnboardingError}
          />
        );
      })()}
    </div>
  );
};

export default ProfessionalDashboard;
