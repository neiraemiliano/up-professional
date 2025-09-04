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
  Flag,
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

import StatsCard from "./components/StatsCard";
import MetricsChart from "./components/MetricsChart";
import RecentActivityTable from "./components/RecentActivityTable";
import TopProfessionalsTable from "./components/TopProfessionalsTable";
import PaymentMetrics from "../../components/Admin/PaymentMetrics";
import PaymentNotifications from "../../components/Notifications/PaymentNotifications";
import FeatureFlagManagement from "./components/FeatureFlagManagement";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import Button from "../../components/template/ui/button/Button";

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [activeTab, setActiveTab] = useState("overview");

  // Queries principales
  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useDashboardStats();
  console.log("🚀 ~ AdminDashboard ~ dashboardStats:", dashboardStats);
  const { data: userMetrics, isLoading: userLoading } =
    useUserMetrics(selectedPeriod);
  const { data: professionalMetrics, isLoading: professionalLoading } =
    useProfessionalMetrics();
  const { data: bookingMetrics, isLoading: bookingLoading } =
    useBookingMetrics(selectedPeriod);
  const { data: financialMetrics, isLoading: financialLoading } =
    useFinancialMetrics();
  const { data: contactMetrics, isLoading: contactLoading } =
    useContactMetrics();
  const { data: recentActivity, isLoading: activityLoading } =
    useRecentActivity();

  const exportMutation = useExportData();

  const isLoading =
    statsLoading ||
    userLoading ||
    professionalLoading ||
    bookingLoading ||
    financialLoading;

  const handleExport = (type) => {
    exportMutation.mutate({ type, format: "json" });
  };

  const handleRefresh = () => {
    refetchStats();
  };

  if (statsError) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <ErrorMessage
          message="Error cargando el dashboard administrativo"
          onRetry={handleRefresh}
        />
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Usuarios", icon: Users },
    { id: "professionals", label: "Profesionales", icon: UserCheck },
    { id: "bookings", label: "Trabajos", icon: Briefcase },
    { id: "payments", label: "Pagos", icon: DollarSign },
    { id: "financial", label: "Financiero", icon: PieChart },
    { id: "activity", label: "Actividad", icon: Activity },
    { id: "featureflags", label: "Feature Flags", icon: Flag },
  ];

  const periodOptions = [
    { value: "7d", label: "7 días" },
    { value: "30d", label: "30 días" },
    { value: "90d", label: "90 días" },
    { value: "1y", label: "1 año" },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 font-medium">
            Panel de control completo con estadísticas y métricas del sistema
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Selector de período */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-300 font-medium shadow-sm"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Botones de acción */}
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-orange-700 bg-white dark:bg-gray-700 dark:text-orange-400 border border-orange-200 dark:border-gray-600 rounded-xl hover:bg-orange-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-200"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Actualizar
          </button>

          <button
            onClick={() => handleExport("overview")}
            disabled={exportMutation.isLoading}
            className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white dark:bg-gray-800 rounded-2xl p-2 border border-gray-200 dark:border-gray-600 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105"
                : "text-gray-600 dark:text-gray-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-gray-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {isLoading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg animate-pulse">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Cargando Dashboard
              </h3>
              <p className="text-gray-600">
                Obteniendo estadísticas y métricas...
              </p>
              <div className="flex items-center justify-center gap-1 mt-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-orange-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && dashboardStats && (
              <div className="space-y-6">
                {/* Stats Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard
                    title="Total Usuarios"
                    value={dashboardStats.overview?.totalUsers || 0}
                    icon={<Users className="w-6 h-6" />}
                    trend={`+${
                      dashboardStats.overview?.newUsersThisMonth || 0
                    } este mes`}
                    color="blue"
                  />
                  <StatsCard
                    title="Profesionales"
                    value={dashboardStats.overview?.totalProfessionals || 0}
                    icon={<UserCheck className="w-6 h-6" />}
                    trend={`+${
                      dashboardStats.overview?.newProfessionalsThisMonth || 0
                    } este mes`}
                    color="green"
                  />
                  <StatsCard
                    title="Trabajos Realizados"
                    value={dashboardStats.bookings?.completed || 0}
                    icon={<Briefcase className="w-6 h-6" />}
                    trend={`${dashboardStats.bookings?.active || 0} activos`}
                    color="orange"
                  />
                  <StatsCard
                    title="Revenue Total"
                    value={`$${(
                      dashboardStats.overview?.totalRevenue || 0
                    ).toLocaleString()}`}
                    icon={<DollarSign className="w-6 h-6" />}
                    trend={`★ ${(
                      dashboardStats.overview?.averageRating || 0
                    ).toFixed(1)} rating`}
                    color="purple"
                  />
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatsCard
                    title="Servicios Disponibles"
                    value={dashboardStats.overview?.totalServices || 0}
                    icon={<Settings className="w-5 h-5" />}
                    trend={`${
                      dashboardStats.overview?.totalCategories || 0
                    } categorías`}
                    color="indigo"
                    size="sm"
                  />
                  <StatsCard
                    title="Reviews"
                    value={dashboardStats.overview?.totalReviews || 0}
                    icon={<Star className="w-5 h-5" />}
                    trend={`★ ${(
                      dashboardStats.overview?.averageRating || 0
                    ).toFixed(1)} promedio`}
                    color="yellow"
                    size="sm"
                  />
                  <StatsCard
                    title="Trabajos Pendientes"
                    value={dashboardStats.bookings?.pending || 0}
                    icon={<Clock className="w-5 h-5" />}
                    trend="Requieren atención"
                    color="red"
                    size="sm"
                  />
                </div>

                {/* Charts Section */}
                {(userMetrics || bookingMetrics) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {userMetrics && (
                      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-200/50 p-8 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <LineChart className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Registro de Usuarios
                            </h3>
                            <p className="text-sm text-gray-600">
                              Tendencia últimos {selectedPeriod}
                            </p>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50/50 to-white/50 rounded-xl p-4">
                          <MetricsChart
                            data={userMetrics.registrationTrend || []}
                            type="line"
                            xKey="date"
                            yKey="count"
                            height={280}
                          />
                        </div>
                      </div>
                    )}

                    {bookingMetrics && (
                      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-200/50 p-8 hover:shadow-xl transition-all duration-300 group">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                            <PieChart className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">
                              Trabajos por Estado
                            </h3>
                            <p className="text-sm text-gray-600">
                              Distribución actual
                            </p>
                          </div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50/50 to-red-50/50 rounded-xl p-4">
                          <MetricsChart
                            data={(bookingMetrics.byStatus || []).map(
                              (item) => ({
                                status: item.status,
                                count: item._count?.status || 0,
                              })
                            )}
                            type="pie"
                            dataKey="count"
                            nameKey="status"
                            height={280}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Important Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Top Categories Chart */}
                  {dashboardStats?.data?.topCategories && (
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-200/50 p-8 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Categorías Populares
                          </h3>
                          <p className="text-sm text-gray-600">
                            Servicios más solicitados
                          </p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50/50 to-white/50 rounded-xl p-4">
                        <MetricsChart
                          data={dashboardStats.data?.topCategories
                            .slice(0, 5)
                            .map((item) => ({
                              categoryId: `Categoría ${item.categoryId}`,
                              count: item._count.categoryId,
                            }))}
                          type="bar"
                          xKey="categoryId"
                          yKey="count"
                          height={280}
                        />
                      </div>
                    </div>
                  )}

                  {/* Key Performance Indicators */}
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-200/50 p-8 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Indicadores Clave
                        </h3>
                        <p className="text-sm text-gray-600">
                          Métricas de rendimiento
                        </p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {(
                              (dashboardStats?.bookings.completed /
                                dashboardStats?.bookings.total) *
                                100 || 0
                            ).toFixed(1)}
                            %
                          </div>
                          <div className="text-sm text-gray-600">
                            Tasa de Finalización
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {dashboardStats?.overview.averageRating.toFixed(
                              1
                            ) || "0.0"}
                            ★
                          </div>
                          <div className="text-sm text-gray-600">
                            Satisfacción Promedio
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {Math.round(
                              dashboardStats?.overview.totalRevenue /
                                dashboardStats?.bookings.completed || 0
                            ).toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            Revenue por Trabajo
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-orange-600">
                            {dashboardStats?.bookings.pending || 0}
                          </div>
                          <div className="text-sm text-gray-600">
                            Trabajos Pendientes
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                {recentActivity && !activityLoading && (
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-orange-200/50 p-8 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Actividad Reciente
                        </h3>
                        <p className="text-sm text-gray-600">
                          Últimos eventos del sistema
                        </p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50/50 to-white/50 rounded-xl p-4">
                      <RecentActivityTable data={recentActivity.data} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === "users" && userMetrics && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatsCard
                    title="Nuevos Usuarios"
                    value={userMetrics.growth}
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend={`Últimos ${selectedPeriod}`}
                    color="green"
                  />
                  <StatsCard
                    title="Usuarios por Rol"
                    value={userMetrics.byRole.length}
                    icon={<Users className="w-6 h-6" />}
                    trend="Distribución activa"
                    color="blue"
                  />
                  <StatsCard
                    title="Ubicaciones Top"
                    value={userMetrics.topLocations.length}
                    icon={<MapPin className="w-6 h-6" />}
                    trend="Ciudades activas"
                    color="purple"
                  />
                </div>

                {/* User Role Distribution Chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Distribución por Rol
                  </h3>
                  <MetricsChart
                    data={userMetrics.byRole.map((item) => ({
                      role: item.role,
                      count: item._count.role,
                    }))}
                    type="bar"
                    xKey="role"
                    yKey="count"
                  />
                </div>
              </div>
            )}

            {/* Professionals Tab */}
            {activeTab === "professionals" && professionalMetrics && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatsCard
                    title="Rating Promedio"
                    value={
                      professionalMetrics.stats._avg.avgRating?.toFixed(2) ||
                      "0"
                    }
                    icon={<Star className="w-6 h-6" />}
                    trend="★ Calidad general"
                    color="yellow"
                  />
                  <StatsCard
                    title="Trabajos Promedio"
                    value={Math.round(
                      professionalMetrics.stats._avg.completedJobs || 0
                    )}
                    icon={<Briefcase className="w-6 h-6" />}
                    trend="Por profesional"
                    color="blue"
                  />
                  <StatsCard
                    title="Verificados"
                    value={
                      professionalMetrics.verification?.find(
                        (v) => v.isVerified === true
                      )?._count.isVerified || 0
                    }
                    icon={<CheckCircle className="w-6 h-6" />}
                    trend="Profesionales seguros"
                    color="green"
                  />
                  <StatsCard
                    title="Experiencia Promedio"
                    value={`${Math.round(
                      professionalMetrics.stats._avg.experience || 0
                    )} años`}
                    icon={<Clock className="w-6 h-6" />}
                    trend="Expertise del equipo"
                    color="purple"
                  />
                </div>

                {/* Top Professionals Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Top Profesionales
                  </h3>
                  <TopProfessionalsTable
                    data={professionalMetrics?.data?.topProfessionals}
                  />
                </div>

                {/* Rating Distribution */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Distribución de Ratings
                  </h3>
                  <MetricsChart
                    data={professionalMetrics.ratingDistribution.map(
                      (item) => ({
                        rating: `${item.rating}★`,
                        count: item._count.rating,
                      })
                    )}
                    type="bar"
                    xKey="rating"
                    yKey="count"
                  />
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && bookingMetrics && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatsCard
                    title="Total Trabajos"
                    value={bookingMetrics.stats._count.id}
                    icon={<Briefcase className="w-6 h-6" />}
                    trend={`Período ${selectedPeriod}`}
                    color="blue"
                  />
                  <StatsCard
                    title="Revenue Período"
                    value={`$${(
                      bookingMetrics.stats._sum.totalAmount || 0
                    ).toLocaleString()}`}
                    icon={<DollarSign className="w-6 h-6" />}
                    trend="Ingresos totales"
                    color="green"
                  />
                  <StatsCard
                    title="Valor Promedio"
                    value={`$${Math.round(
                      bookingMetrics.averageValue || 0
                    ).toLocaleString()}`}
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend="Por trabajo"
                    color="purple"
                  />
                  <StatsCard
                    title="Tasa Completación"
                    value={`${Math.round(bookingMetrics.completionRate || 0)}%`}
                    icon={<CheckCircle className="w-6 h-6" />}
                    trend="Trabajos exitosos"
                    color="green"
                  />
                </div>

                {/* Booking Trend Chart */}
                {bookingMetrics.trend && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Tendencia de Trabajos
                    </h3>
                    <MetricsChart
                      data={bookingMetrics.trend}
                      type="line"
                      xKey="date"
                      yKey="bookings"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === "payments" && (
              <div className="space-y-6">
                {/* Payment Metrics */}
                <PaymentMetrics />

                {/* Payment Notifications */}
                <div className="bg-white rounded-lg shadow p-6">
                  <PaymentNotifications isAdmin={true} />
                </div>
              </div>
            )}

            {/* Financial Tab */}
            {activeTab === "financial" && financialMetrics && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatsCard
                    title="Revenue Total"
                    value={`$${financialMetrics.totalRevenue.toLocaleString()}`}
                    icon={<DollarSign className="w-6 h-6" />}
                    trend={`${financialMetrics.totalTransactions} transacciones`}
                    color="green"
                  />
                  <StatsCard
                    title="Comisiones"
                    value={`$${Math.round(
                      financialMetrics.commissionStats.totalCommissions
                    ).toLocaleString()}`}
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend={`${
                      financialMetrics.commissionStats.commissionRate * 100
                    }% tasa`}
                    color="blue"
                  />
                  <StatsCard
                    title="Pagos Pendientes"
                    value={`$${financialMetrics.outstandingPayments.toLocaleString()}`}
                    icon={<AlertTriangle className="w-6 h-6" />}
                    trend={`${financialMetrics.outstandingCount} pendientes`}
                    color="red"
                  />
                  <StatsCard
                    title="Crecimiento Mensual"
                    value={`${
                      financialMetrics.revenueGrowth?.percentage?.toFixed(1) ||
                      0
                    }%`}
                    icon={<TrendingUp className="w-6 h-6" />}
                    trend="vs mes anterior"
                    color="purple"
                  />
                </div>

                {/* Financial Stats Cards */}
                {financialMetrics.data && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                      Métricas Financieras
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <DollarSign className="w-8 h-8 text-green-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">
                              Ingresos Totales
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              $
                              {financialMetrics.totalRevenue?.toLocaleString() ||
                                0}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <TrendingUp className="w-8 h-8 text-blue-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">
                              Ingresos del Mes
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              $
                              {financialMetrics.monthlyRevenue?.current?.toLocaleString() ||
                                0}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Activity className="w-8 h-8 text-purple-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">
                              Total Transacciones
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              {financialMetrics.totalTransactions?.id || 0}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <AlertTriangle className="w-8 h-8 text-orange-600" />
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-600">
                              Pagos Pendientes
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                              $
                              {financialMetrics.outstandingPayments?.toLocaleString() ||
                                0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Methods */}
                {financialMetrics.paymentMethods && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Métodos de Pago
                    </h3>
                    <MetricsChart
                      data={financialMetrics.paymentMethods}
                      type="pie"
                      dataKey="count"
                      nameKey="method"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <div className="space-y-6">
                {contactMetrics && !contactLoading && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatsCard
                      title="Contactos Totales"
                      value={contactMetrics.totalContacts}
                      icon={<MessageSquare className="w-6 h-6" />}
                      trend="Interacciones únicas"
                      color="blue"
                    />
                    <StatsCard
                      title="Contactos Diarios"
                      value={contactMetrics.dailyContacts}
                      icon={<PhoneCall className="w-6 h-6" />}
                      trend="Promedio por día"
                      color="green"
                    />
                    <StatsCard
                      title="Tiempo Respuesta"
                      value={contactMetrics.averageResponseTime}
                      icon={<Clock className="w-6 h-6" />}
                      trend="Promedio general"
                      color="orange"
                    />
                    <StatsCard
                      title="Canal Principal"
                      value="WhatsApp"
                      icon={<MessageSquare className="w-6 h-6" />}
                      trend="60% del tráfico"
                      color="purple"
                    />
                  </div>
                )}

                {/* Contact Methods Chart */}
                {contactMetrics && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Métodos de Contacto
                    </h3>
                    <MetricsChart
                      data={contactMetrics.contactsByType}
                      type="pie"
                      dataKey="count"
                      nameKey="type"
                    />
                  </div>
                )}

                {/* Recent Activity */}
                {recentActivity && !activityLoading && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Actividad del Sistema
                    </h3>
                    <RecentActivityTable data={recentActivity.data} />
                  </div>
                )}
              </div>
            )}

            {/* Feature Flags Tab */}
            {activeTab === "featureflags" && <FeatureFlagManagement />}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
