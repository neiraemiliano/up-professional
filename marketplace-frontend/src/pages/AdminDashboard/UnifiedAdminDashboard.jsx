import React, { useState } from "react";
import {
  BarChart3,
  Users,
  UserCheck,
  Briefcase,
  TrendingUp,
  DollarSign,
  Activity,
  Settings,
  Download,
  RefreshCw,
  Calendar,
  MessageSquare,
  Shield,
  Clock,
  Star,
  MapPin,
  PhoneCall,
  Mail,
  AlertTriangle,
  CheckCircle,
  PieChart,
  LineChart,
  Eye,
  EyeOff,
  ToggleLeft,
  Zap,
  Loader2,
  Home,
  FileText,
  Megaphone,
} from "lucide-react";

import {
  useDashboardStats,
  useUserMetrics,
  useProfessionalMetrics,
  useBookingMetrics,
  useFinancialMetrics,
  useContactMetrics,
  useRecentActivity,
  useExportData,
} from "../../hooks/api/admin";

import {
  useFeatureFlagsGrouped,
  useToggleFeatureFlag,
} from "../../hooks/api/featureFlags";

import StatsCard from "./components/StatsCard";
import MetricsChart from "./components/MetricsChart";
import RecentActivityTable from "./components/RecentActivityTable";
import TopProfessionalsTable from "./components/TopProfessionalsTable";
import BookingManagement from "./components/BookingManagement";
import ActivityLog from "./components/ActivityLog";
import ContentManagement from "./components/ContentManagement";
import AnnouncementManagement from "./components/AnnouncementManagement";
import UsersManagement from "./components/UsersManagement";
import ProfessionalsManagement from "./components/ProfessionalsManagement";
import PaymentMetrics from "../../components/Admin/PaymentMetrics";
import PaymentNotifications from "../../components/Notifications/PaymentNotifications";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Button from "../../components/template/ui/button/Button";

const UnifiedAdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  // API hooks
  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
  } = useDashboardStats();
  console.log("🚀 ~ UnifiedAdminDashboard ~ dashboardStats:", dashboardStats);
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
  const toggleFeatureMutation = useToggleFeatureFlag();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handleExport = (type) => {
    exportData.mutate({ type, period: selectedPeriod });
  };

  const handleFeatureToggle = async (featureId) => {
    try {
      await toggleFeatureMutation.mutateAsync(featureId);
    } catch (error) {
      console.error("Error toggling feature flag:", error);
      // You could add a toast notification here
    }
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

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Usuarios"
          value={dashboardStats?.overview.totalUsers || 0}
          icon={Users}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Profesionales"
          value={dashboardStats?.overview.totalProfessionals || 0}
          icon={UserCheck}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Trabajos"
          value={dashboardStats?.overview.totalBookings || 0}
          icon={Briefcase}
          color="purple"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Ingresos"
          value={`$${dashboardStats?.overview.totalRevenue || 0}`}
          icon={DollarSign}
          color="orange"
          trend={{ value: 22, isPositive: true }}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <MetricsChart
            title="Crecimiento de Usuarios"
            data={userMetrics}
            period={selectedPeriod}
            onPeriodChange={handlePeriodChange}
          />
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-500" />
            Actividad Reciente
          </h3>
          <RecentActivityTable
            data={recentActivity}
            loading={activityLoading}
          />
        </div>
      </div>
    </div>
  );

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

    const allFlags = featureFlags ? Object.values(featureFlags).flat() : [];

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
                      {flags.map((flag) => (
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
                            <button
                              onClick={() => handleFeatureToggle(flag.id)}
                              disabled={toggleFeatureMutation.isLoading}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 ${
                                flag.isEnabled ? "bg-green-500" : "bg-gray-300"
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

  const renderFinancial = () => (
    <div className="space-y-6">
      <PaymentMetrics />
      <PaymentNotifications />
    </div>
  );

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
                  {tab.key === "feature-flags" && (
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
    </div>
  );
};

export default UnifiedAdminDashboard;
