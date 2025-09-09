import {
  Activity,
  AlertTriangle,
  BarChart3,
  Briefcase,
  CheckCircle,
  Clock,
  Code,
  DollarSign,
  Download,
  Edit,
  Eye,
  EyeOff,
  FileText,
  Home,
  LineChart,
  Loader2,
  Megaphone,
  PieChart,
  Plus,
  RefreshCw,
  Save,
  Shield,
  Star,
  ToggleLeft,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

import {
  useBookingMetrics,
  useContactMetrics,
  useDashboardStats,
  useExportData,
  useFinancialMetrics,
  useProfessionalMetrics,
  useRecentActivity,
  useUserMetrics,
} from "../../hooks/api/admin";

import {
  useCreateFeatureFlag,
  useDeleteFeatureFlag,
  useFeatureFlagsGrouped,
  useToggleFeatureFlag,
  useUpdateFeatureFlag,
} from "../../hooks/api/featureFlags";

import PaymentMetrics from "../../components/Admin/PaymentMetrics";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import PaymentNotifications from "../../components/Notifications/PaymentNotifications";
import Button from "../../components/template/ui/button/Button";
import ActivityLog from "./components/ActivityLog";
import AnalyticsTab from "./components/AnalyticsTab";
import AnnouncementManagement from "./components/AnnouncementManagement";
import BookingManagement from "./components/BookingManagement";
import ContentManagement from "./components/ContentManagement";
import MetricsChart from "./components/MetricsChart";
import ProfessionalsManagement from "./components/ProfessionalsManagement";
import StatsCard from "./components/StatsCard";
import UsersManagement from "./components/UsersManagement";

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFlag, setEditingFlag] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({
    type: "success", // success, error
    title: "",
    message: ""
  });
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    category: "general",
    isEnabled: false,
  });

  // API hooks
  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  const { data: userMetrics, isLoading: userLoading } =
    useUserMetrics(selectedPeriod);
  const { data: professionalMetrics, isLoading: profLoading } =
    useProfessionalMetrics();
  const { data: bookingMetrics, isLoading: bookingLoading } =
    useBookingMetrics(selectedPeriod);
  const { data: financialMetrics, isLoading: financialLoading } =
    useFinancialMetrics();
  const { data: contactMetrics, isLoading: contactLoading } =
    useContactMetrics();
  const { data: recentActivity, isLoading: activityLoading } =
    useRecentActivity();
  const exportData = useExportData();

  // Feature Flags API hooks
  const {
    data: featureFlags,
    isLoading: flagsLoading,
    error: flagsError,
    refetch: refetchFlags,
  } = useFeatureFlagsGrouped();
  
  // Debugging temporal
  console.log('Feature flags data:', featureFlags);
  console.log('Feature flags loading:', flagsLoading);
  console.log('Feature flags error:', flagsError);
  const toggleFeatureMutation = useToggleFeatureFlag();
  const createFeatureMutation = useCreateFeatureFlag();
  const updateFeatureMutation = useUpdateFeatureFlag();
  const deleteFeatureMutation = useDeleteFeatureFlag();

  const showNotificationMessage = (type, title, message) => {
    setNotification({ type, title, message });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handleExport = (type) => {
    exportData.mutate({ type, period: selectedPeriod });
  };

  const handleFeatureToggle = (featureId) => {
    toggleFeatureMutation.mutate(featureId, {
      onSuccess: () => {
        showNotificationMessage(
          "success", 
          "Feature Flag Actualizado", 
          "El estado del feature flag se cambió correctamente."
        );
      },
      onError: (error) => {
        console.error("Error toggling feature flag:", error);
        showNotificationMessage(
          "error", 
          "Error al Actualizar", 
          "No se pudo cambiar el estado del feature flag. Por favor, intenta nuevamente."
        );
      }
    });
  };

  const handleCreateFlag = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      category: "general",
      isEnabled: false,
    });
    setEditingFlag(null);
    setShowCreateModal(true);
  };

  const handleEditFlag = (flag) => {
    setFormData({
      id: flag.id,
      name: flag.name,
      description: flag.description || "",
      category: flag.category || "general",
      isEnabled: flag.isEnabled,
    });
    setEditingFlag(flag);
    setShowCreateModal(true);
  };

  const handleDeleteFlag = (flagId) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este feature flag?")
    ) {
      deleteFeatureMutation.mutate(flagId, {
        onSuccess: () => {
          showNotificationMessage(
            "success",
            "Feature Flag Eliminado",
            "El feature flag se eliminó correctamente."
          );
        },
        onError: (error) => {
          console.error("Error deleting feature flag:", error);
          showNotificationMessage(
            "error",
            "Error al Eliminar",
            "No se pudo eliminar el feature flag. Por favor, intenta nuevamente."
          );
        }
      });
    }
  };

  const handleSaveFlag = (e) => {
    e.preventDefault();

    // Validar que el ID no esté vacío y no contenga espacios
    if (!editingFlag && (!formData.id || formData.id.trim() === "")) {
      showNotificationMessage("error", "Error de Validación", "El ID es requerido");
      return;
    }

    // Validar formato del ID (solo letras, números y guiones bajos)
    const idPattern = /^[a-zA-Z0-9_]+$/;
    if (!editingFlag && !idPattern.test(formData.id)) {
      showNotificationMessage("error", "Error de Validación", "El ID solo puede contener letras, números y guiones bajos");
      return;
    }

    if (editingFlag) {
      updateFeatureMutation.mutate({
        id: editingFlag.id,
        data: {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          isEnabled: formData.isEnabled,
        },
      }, {
        onSuccess: () => {
          showNotificationMessage("success", "Feature Flag Actualizado", "El feature flag se actualizó correctamente.");
          setShowCreateModal(false);
          setEditingFlag(null);
        },
        onError: (error) => {
          console.error("Error updating feature flag:", error);
          let errorMessage = "Error al actualizar el feature flag";
          if (error?.response?.data?.error) {
            errorMessage = error.response.data.error;
          }
          showNotificationMessage("error", "Error al Actualizar", errorMessage);
        }
      });
    } else {
      // Verificar si el ID ya existe
      const allFlags =
        featureFlags && typeof featureFlags === "object"
          ? Object.values(featureFlags).filter(Array.isArray).flat()
          : [];

      const existingFlag = allFlags.find((flag) => flag.id === formData.id);
      if (existingFlag) {
        showNotificationMessage("error", "Error de Validación", `Ya existe un feature flag con el ID "${formData.id}"`);
        return;
      }

      createFeatureMutation.mutate(formData, {
        onSuccess: () => {
          showNotificationMessage("success", "Feature Flag Creado", "El nuevo feature flag se creó correctamente.");
          setShowCreateModal(false);
          setEditingFlag(null);
        },
        onError: (error) => {
          console.error("Error creating feature flag:", error);
          let errorMessage = "Error al crear el feature flag";
          if (error?.response?.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          if (errorMessage.includes("Unique constraint failed")) {
            errorMessage = `Ya existe un feature flag con el ID "${formData.id}"`;
          }
          showNotificationMessage("error", "Error al Crear", errorMessage);
        }
      });
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingFlag(null);
  };

  // Loading state
  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (statsError) {
    return (
      <div className="p-6">
        <ErrorMessage message="Error al cargar los datos del dashboard" />
      </div>
    );
  }

  const renderOverview = () => {
    // Sample data for charts when API data is not available
    const sampleUserGrowth = [
      { name: "Ene", usuarios: 120, profesionales: 45, trabajos: 80 },
      { name: "Feb", usuarios: 150, profesionales: 52, trabajos: 95 },
      { name: "Mar", usuarios: 180, profesionales: 60, trabajos: 110 },
      { name: "Abr", usuarios: 220, profesionales: 68, trabajos: 125 },
      { name: "May", usuarios: 280, profesionales: 75, trabajos: 140 },
      { name: "Jun", usuarios: 350, profesionales: 85, trabajos: 160 },
      { name: "Jul", usuarios: 420, profesionales: 95, trabajos: 185 },
    ];

    const sampleRevenueData = [
      { name: "Servicios", value: 45000, color: "#3B82F6" },
      { name: "Comisiones", value: 28000, color: "#10B981" },
      { name: "Suscripciones", value: 15000, color: "#F59E0B" },
      { name: "Extras", value: 8000, color: "#8B5CF6" },
    ];

    const sampleBookingsData = [
      { name: "Lun", completados: 45, pendientes: 12, cancelados: 3 },
      { name: "Mar", completados: 52, pendientes: 8, cancelados: 2 },
      { name: "Mie", completados: 48, pendientes: 15, cancelados: 5 },
      { name: "Jue", completados: 61, pendientes: 10, cancelados: 1 },
      { name: "Vie", completados: 55, pendientes: 18, cancelados: 4 },
      { name: "Sab", completados: 70, pendientes: 22, cancelados: 2 },
      { name: "Dom", completados: 38, pendientes: 8, cancelados: 1 },
    ];

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Usuarios"
            value={
              dashboardStats?.totalUsers ||
              dashboardStats?.overview?.totalUsers ||
              1247
            }
            icon={Users}
            color="blue"
            trend={{
              value: dashboardStats?.userGrowth || 12,
              isPositive: (dashboardStats?.userGrowth || 12) > 0,
            }}
          />
          <StatsCard
            title="Profesionales"
            value={
              dashboardStats?.totalProfessionals ||
              dashboardStats?.overview?.totalProfessionals ||
              384
            }
            icon={UserCheck}
            color="green"
            trend={{
              value: dashboardStats?.professionalGrowth || 8,
              isPositive: (dashboardStats?.professionalGrowth || 8) > 0,
            }}
          />
          <StatsCard
            title="Trabajos"
            value={
              dashboardStats?.totalBookings ||
              dashboardStats?.overview?.totalBookings ||
              2156
            }
            icon={Briefcase}
            color="purple"
            trend={{
              value: dashboardStats?.bookingGrowth || 15,
              isPositive: (dashboardStats?.bookingGrowth || 15) > 0,
            }}
          />
          <StatsCard
            title="Ingresos"
            value={`$${
              dashboardStats?.totalRevenue ||
              dashboardStats?.overview?.totalRevenue ||
              96000
            }`}
            icon={DollarSign}
            color="orange"
            trend={{
              value: dashboardStats?.revenueGrowth || 22,
              isPositive: (dashboardStats?.revenueGrowth || 22) > 0,
            }}
          />
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Crecimiento de Usuarios
              </h3>
              <div className="flex items-center gap-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1"
                >
                  <option value="7d">7 días</option>
                  <option value="30d">30 días</option>
                  <option value="90d">90 días</option>
                </select>
              </div>
            </div>
            <MetricsChart
              data={
                userMetrics?.chartData ||
                userMetrics?.data ||
                userMetrics ||
                sampleUserGrowth
              }
              type="line"
              xKey="name"
              yKey="usuarios"
              height={250}
              multipleLines={true}
              lineKeys={["usuarios", "profesionales", "trabajos"]}
            />
          </div>

          {/* Revenue Distribution */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-green-500" />
              Distribución de Ingresos
            </h3>
            <MetricsChart
              data={
                financialMetrics?.revenueDistribution ||
                financialMetrics?.chartData ||
                sampleRevenueData
              }
              type="pie"
              dataKey="value"
              nameKey="name"
              height={250}
            />
          </div>
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bookings Status */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              Estado de Trabajos
            </h3>
            <MetricsChart
              data={
                bookingMetrics?.statusData ||
                bookingMetrics?.chartData ||
                bookingMetrics ||
                sampleBookingsData
              }
              type="bar"
              xKey="name"
              yKey="completados"
              height={200}
            />
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-500" />
              Métricas de Rendimiento
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Tiempo promedio de respuesta
                </span>
                <span className="font-semibold text-green-600">
                  {dashboardStats?.avgResponseTime ||
                    professionalMetrics?.avgResponseTime ||
                    "2.4h"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Satisfacción del cliente
                </span>
                <span className="font-semibold text-blue-600">
                  {dashboardStats?.customerSatisfaction ||
                    bookingMetrics?.satisfaction ||
                    "4.8"}
                  /5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Tasa de finalización
                </span>
                <span className="font-semibold text-purple-600">
                  {dashboardStats?.completionRate ||
                    bookingMetrics?.completionRate ||
                    "94"}
                  %
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Profesionales activos
                </span>
                <span className="font-semibold text-orange-600">
                  {dashboardStats?.activeProfessionalsRate ||
                    professionalMetrics?.activeRate ||
                    "87"}
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              Actividad Reciente
            </h3>
            <div className="space-y-3">
              {(Array.isArray(recentActivity)
                ? recentActivity
                : [
                    {
                      type: "booking",
                      message: "Nuevo trabajo creado",
                      time: "5 min",
                      user: "María García",
                    },
                    {
                      type: "user",
                      message: "Usuario registrado",
                      time: "12 min",
                      user: "Carlos López",
                    },
                    {
                      type: "professional",
                      message: "Profesional verificado",
                      time: "28 min",
                      user: "Ana Ruiz",
                    },
                    {
                      type: "payment",
                      message: "Pago procesado",
                      time: "45 min",
                      user: "Juan Pérez",
                    },
                  ]
              )
                .slice(0, 4)
                .map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "booking"
                          ? "bg-purple-500"
                          : activity.type === "user"
                          ? "bg-blue-500"
                          : activity.type === "professional"
                          ? "bg-green-500"
                          : "bg-orange-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.user} • hace {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Top Professionals and System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Professionals */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Top Profesionales
            </h3>
            <div className="space-y-3">
              {[
                {
                  name: "Miguel Rodríguez",
                  rating: 4.9,
                  jobs: 156,
                  specialty: "Plomería",
                },
                {
                  name: "Laura Fernández",
                  rating: 4.8,
                  jobs: 142,
                  specialty: "Electricidad",
                },
                {
                  name: "Carlos Vega",
                  rating: 4.8,
                  jobs: 138,
                  specialty: "Carpintería",
                },
                {
                  name: "Ana Castro",
                  rating: 4.7,
                  jobs: 125,
                  specialty: "Limpieza",
                },
              ].map((professional, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {professional.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {professional.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {professional.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-semibold text-gray-800">
                        {professional.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {professional.jobs} trabajos
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Estado del Sistema
            </h3>
            <div className="space-y-4">
              {[
                {
                  service: "API Principal",
                  status: "online",
                  uptime: "99.9%",
                  color: "green",
                },
                {
                  service: "Base de Datos",
                  status: "online",
                  uptime: "99.8%",
                  color: "green",
                },
                {
                  service: "Pagos",
                  status: "online",
                  uptime: "99.7%",
                  color: "green",
                },
                {
                  service: "Notificaciones",
                  status: "warning",
                  uptime: "98.2%",
                  color: "yellow",
                },
                {
                  service: "Almacenamiento",
                  status: "online",
                  uptime: "99.9%",
                  color: "green",
                },
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        service.color === "green"
                          ? "bg-green-500"
                          : service.color === "yellow"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {service.service}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      {service.uptime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Todos los sistemas operativos
                </span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Última verificación: hace 2 minutos
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => <UsersManagement />;

  const renderProfessionals = () => <ProfessionalsManagement />;

  const renderFeatureFlags = () => {
    if (flagsLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-gray-600">Cargando feature flags...</span>
          </div>
        </div>
      );
    }

    if (flagsError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-800">
                Error al cargar Feature Flags
              </h3>
              <p className="text-red-600 text-sm">
                No se pudieron cargar las configuraciones de características
              </p>
            </div>
          </div>
        </div>
      );
    }

    const allFlags =
      featureFlags && typeof featureFlags === "object"
        ? Object.values(featureFlags).filter(Array.isArray).flat()
        : [];

    console.log('Render allFlags:', allFlags);
    console.log('Render featureFlags raw:', featureFlags);

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <ToggleLeft className="w-6 h-6 text-purple-500" />
                Feature Flags
              </h2>
              <p className="text-gray-600 mt-1">
                Controla qué características están habilitadas en la plataforma
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleCreateFlag}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Crear Flag
              </Button>
              <Button
                onClick={() => refetchFlags()}
                disabled={flagsLoading || toggleFeatureMutation.isLoading}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${flagsLoading ? "animate-spin" : ""}`}
                />
                Actualizar
              </Button>
            </div>
          </div>

          {allFlags.length === 0 ? (
            <div className="text-center py-12">
              <ToggleLeft className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No hay feature flags configurados
              </h3>
              <p className="text-gray-500">
                Los feature flags aparecerán aquí cuando se configuren
              </p>
            </div>
          ) : (
            <>
              {/* Feature Flags by Category */}
              {featureFlags &&
                Object.entries(featureFlags).map(([category, flags]) => (
                  <div key={category} className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">
                      {category === "general" ? "General" : category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.isArray(flags) &&
                        flags.map((flag) => (
                          <div
                            key={flag.id}
                            className={`p-4 rounded-xl border-2 transition-all ${
                              flag.isEnabled
                                ? "bg-green-50 border-green-200 hover:bg-green-100"
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`p-2 rounded-lg ${
                                    flag.isEnabled
                                      ? "bg-green-100"
                                      : "bg-gray-100"
                                  }`}
                                >
                                  {flag.isEnabled ? (
                                    <Eye className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <EyeOff className="w-5 h-5 text-gray-500" />
                                  )}
                                </div>
                                <div>
                                  <h3
                                    className={`font-semibold ${
                                      flag.isEnabled
                                        ? "text-green-900"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {flag.name}
                                  </h3>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Code className="w-3 h-3 text-blue-500" />
                                    <span className="text-xs text-blue-600 font-mono">
                                      {flag.id}
                                    </span>
                                  </div>
                                  {flag.id === "ai_search" && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <Zap className="w-3 h-3 text-yellow-500" />
                                      <span className="text-xs text-yellow-600 font-medium">
                                        Nueva Feature
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditFlag(flag)}
                                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                                  title="Editar flag"
                                >
                                  <Edit className="w-4 h-4 text-gray-600" />
                                </button>
                                <button
                                  onClick={() => handleDeleteFlag(flag.id)}
                                  className="p-1 hover:bg-red-100 rounded-full transition-colors"
                                  title="Eliminar flag"
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </button>
                                <button
                                  onClick={() => handleFeatureToggle(flag.id)}
                                  disabled={toggleFeatureMutation.isLoading}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 ${
                                    flag.isEnabled
                                      ? "bg-green-500"
                                      : "bg-gray-300"
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      flag.isEnabled
                                        ? "translate-x-6"
                                        : "translate-x-1"
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              {flag.description}
                            </p>
                            {flag.isEnabled && (
                              <div className="mt-2 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span className="text-xs text-green-600">
                                  Activo
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      {!Array.isArray(flags) && (
                        <div className="text-center py-4 text-gray-500">
                          No flags available for this category
                        </div>
                      )}
                    </div>
                  </div>
                ))}

              {/* Feature Usage Stats */}
              <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">
                  Estadísticas de Uso
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {allFlags.filter((f) => f.isEnabled).length}
                    </p>
                    <p className="text-sm text-purple-700">Features Activos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {allFlags.filter((f) => !f.isEnabled).length}
                    </p>
                    <p className="text-sm text-blue-700">Features Inactivos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {allFlags.length > 0
                        ? Math.round(
                            (allFlags.filter((f) => f.isEnabled).length /
                              allFlags.length) *
                              100
                          )
                        : 0}
                      %
                    </p>
                    <p className="text-sm text-green-700">Adopción</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderFeatureFlagModal = () => {
    if (!showCreateModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-bold text-gray-800">
              {editingFlag ? "Editar Feature Flag" : "Crear Feature Flag"}
            </h3>
            <button
              onClick={handleCloseModal}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSaveFlag} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID (clave){" "}
                {!editingFlag && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={formData.id}
                onChange={(e) => {
                  const value = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9_]/g, "");
                  setFormData({ ...formData, id: value });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="ej: new_feature"
                disabled={!!editingFlag}
                required={!editingFlag}
              />
              {!editingFlag && (
                <p className="text-xs text-gray-500 mt-1">
                  Solo letras minúsculas, números y guiones bajos. No espacios.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="ej: Nueva Funcionalidad"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Descripción del feature flag"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="general">General</option>
                <option value="search">Búsqueda</option>
                <option value="booking">Reservas</option>
                <option value="payment">Pagos</option>
                <option value="professional">Profesionales</option>
                <option value="review">Reseñas</option>
                <option value="monetization">Monetización</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isEnabled"
                checked={formData.isEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, isEnabled: e.target.checked })
                }
                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
              />
              <label
                htmlFor="isEnabled"
                className="text-sm font-medium text-gray-700"
              >
                Habilitado por defecto
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={
                  createFeatureMutation.isLoading ||
                  updateFeatureMutation.isLoading
                }
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingFlag ? "Guardar" : "Crear"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderFinancial = () => {
    const sampleFinancialData = [
      { name: "Ene", ingresos: 82000, gastos: 45000, comisiones: 18000 },
      { name: "Feb", ingresos: 95000, gastos: 48000, comisiones: 22000 },
      { name: "Mar", ingresos: 108000, gastos: 52000, comisiones: 26000 },
      { name: "Abr", ingresos: 125000, gastos: 55000, comisiones: 30000 },
      { name: "May", ingresos: 138000, gastos: 58000, comisiones: 34000 },
      { name: "Jun", ingresos: 152000, gastos: 62000, comisiones: 38000 },
    ];

    const sampleTransactionVolume = [
      { name: "Servicios Hogar", value: 65, color: "#3B82F6" },
      { name: "Profesionales", value: 25, color: "#10B981" },
      { name: "Emergencias", value: 8, color: "#F59E0B" },
      { name: "Otros", value: 2, color: "#8B5CF6" },
    ];

    return (
      <div className="space-y-6">
        {/* Financial KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Ingresos Mensuales
                </p>
                <p className="text-2xl font-bold text-green-600">
                  $
                  {financialMetrics?.monthlyRevenue?.current || 
                   (typeof financialMetrics?.totalRevenue === 'object' ? 
                     (financialMetrics?.totalRevenue?.current || financialMetrics?.totalRevenue?.amount || "152,000") :
                     (financialMetrics?.totalRevenue || "152,000"))}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-600">+12.5%</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Transacciones
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {(typeof financialMetrics?.totalTransactions === 'object' ? 
                     (financialMetrics?.totalTransactions?.current || financialMetrics?.totalTransactions?.count || "2,847") :
                     (financialMetrics?.totalTransactions)) ||
                   (typeof financialMetrics?.transactions === 'object' ? 
                     (financialMetrics?.transactions?.current || financialMetrics?.transactions?.count || "2,847") :
                     (financialMetrics?.transactions)) ||
                   "2,847"}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-blue-600">+8.2%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Ticket Promedio
                </p>
                <p className="text-2xl font-bold text-purple-600">$185</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span className="text-xs text-purple-600">+3.4%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Margen</p>
                <p className="text-2xl font-bold text-orange-600">23.5%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  <span className="text-xs text-orange-600">+1.8%</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <PieChart className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-green-500" />
              Evolución Financiera
            </h3>
            <MetricsChart
              data={financialMetrics?.trend || sampleFinancialData}
              type="line"
              xKey="name"
              yKey="ingresos"
              height={300}
              multipleLines={true}
              lineKeys={["ingresos", "gastos", "comisiones"]}
            />
          </div>

          {/* Transaction Volume */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-blue-500" />
              Volumen por Categoría
            </h3>
            <MetricsChart
              data={financialMetrics?.categoryVolume || sampleTransactionVolume}
              type="pie"
              dataKey="value"
              nameKey="name"
              height={300}
            />
          </div>
        </div>

        {/* Payment Methods and Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Métodos de Pago
            </h3>
            <div className="space-y-3">
              {[
                {
                  method: "Tarjeta de Crédito",
                  percentage: 68,
                  amount: "$103,360",
                },
                { method: "Transferencia", percentage: 22, amount: "$33,440" },
                { method: "Efectivo", percentage: 8, amount: "$12,160" },
                { method: "Otros", percentage: 2, amount: "$3,040" },
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        index === 0
                          ? "bg-green-500"
                          : index === 1
                          ? "bg-blue-500"
                          : index === 2
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {payment.method}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">
                      {payment.percentage}%
                    </p>
                    <p className="text-xs text-gray-500">{payment.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Estado de Pagos
            </h3>
            <div className="space-y-3">
              {[
                { status: "Completados", count: 2456, color: "green" },
                { status: "Pendientes", count: 186, color: "yellow" },
                { status: "Procesando", count: 124, color: "blue" },
                { status: "Fallidos", count: 81, color: "red" },
              ].map((status, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        status.color === "green"
                          ? "bg-green-500"
                          : status.color === "yellow"
                          ? "bg-yellow-500"
                          : status.color === "blue"
                          ? "bg-blue-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {status.status}
                    </span>
                  </div>
                  <span
                    className={`font-bold ${
                      status.color === "green"
                        ? "text-green-600"
                        : status.color === "yellow"
                        ? "text-yellow-600"
                        : status.color === "blue"
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {status.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Métricas Clave
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Tasa de conversión
                </span>
                <span className="font-semibold text-green-600">3.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tiempo prom. pago</span>
                <span className="font-semibold text-blue-600">1.2 días</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Disputas</span>
                <span className="font-semibold text-yellow-600">0.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Retención</span>
                <span className="font-semibold text-purple-600">89%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Original Payment Components */}
        <PaymentMetrics />
        <PaymentNotifications />
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "users":
        return renderUsers();
      case "professionals":
        return renderProfessionals();
      case "bookings":
        return <BookingManagement />;
      case "payments":
      case "financial":
        return renderFinancial();
      case "activity":
        return <ActivityLog />;
      case "content":
        return <ContentManagement />;
      case "announcements":
        return <AnnouncementManagement />;
      case "feature-flags":
        return renderFeatureFlags();
      case "analytics":
        return <AnalyticsTab />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header with Tabs */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                Dashboard Administrativo
              </h1>
              <p className="text-gray-600 mt-1">
                Panel de control y gestión de la plataforma
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => handleExport("users")}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                disabled={exportData.isLoading}
              >
                <Download className="w-4 h-4" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto space-x-1">
            {[
              { key: "overview", label: "Overview", icon: Home },
              { key: "analytics", label: "Analytics", icon: BarChart3, isNew: true },
              { key: "users", label: "Usuarios", icon: Users },
              { key: "professionals", label: "Profesionales", icon: UserCheck },
              { key: "bookings", label: "Trabajos", icon: Briefcase },
              { key: "financial", label: "Financiero", icon: DollarSign },
              { key: "activity", label: "Actividad", icon: Activity },
              { key: "content", label: "Contenido", icon: FileText },
              { key: "announcements", label: "Anuncios", icon: Megaphone },
              {
                key: "feature-flags",
                label: "Feature Flags",
                icon: ToggleLeft,
              },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.key
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {tab.label}
                  {(tab.key === "feature-flags" || tab.isNew) && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full ml-1">
                      Nuevo
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">{renderContent()}</div>

      {/* Feature Flag Modal */}
      {renderFeatureFlagModal()}

      {/* Notification Popup */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className={`rounded-xl shadow-2xl border-2 p-6 transform transition-all duration-300 ${
            notification.type === "success" 
              ? "bg-green-50 border-green-200" 
              : "bg-red-50 border-red-200"
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${
                notification.type === "success" 
                  ? "bg-green-100" 
                  : "bg-red-100"
              }`}>
                {notification.type === "success" ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-lg ${
                  notification.type === "success" 
                    ? "text-green-800" 
                    : "text-red-800"
                }`}>
                  {notification.title}
                </h4>
                <p className={`text-sm mt-1 ${
                  notification.type === "success" 
                    ? "text-green-700" 
                    : "text-red-700"
                }`}>
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className={`p-1 rounded-full hover:bg-opacity-20 transition-colors ${
                  notification.type === "success" 
                    ? "hover:bg-green-600" 
                    : "hover:bg-red-600"
                }`}
              >
                <X className={`w-5 h-5 ${
                  notification.type === "success" 
                    ? "text-green-600" 
                    : "text-red-600"
                }`} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
