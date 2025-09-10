import {
  Activity,
  BarChart3,
  Calendar,
  Download,
  Eye,
  Filter,
  LineChart,
  PieChart,
  RefreshCw,
  Search,
  TrendingUp,
  Users,
  UserCheck,
  Briefcase,
  DollarSign,
  Clock,
  MousePointer,
  Globe,
  Smartphone,
  Monitor
} from "lucide-react";
import { useState, useEffect } from "react";
import { useDashboardAnalytics, useAnalyticsTracker } from "../../../hooks/api/analytics";
import MetricsChart from "./MetricsChart";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import { Button } from "../../../components/atoms/Button/Button";

const AnalyticsTab = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [activeView, setActiveView] = useState("overview");
  const [searchFilter, setSearchFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Simplified - only use dashboard analytics to prevent loops
  const dashboard = useDashboardAnalytics(selectedPeriod, {
    retry: 1,
    staleTime: 10 * 60 * 1000, // 10 minutes cache
    cacheTime: 15 * 60 * 1000   // 15 minutes cache
  });
  
  const isLoading = dashboard.isLoading;
  const isError = dashboard.isError;

  // Track page view on component mount - temporarily disabled to fix loops
  // useEffect(() => {
  //   trackPageView('/admin/analytics');
  // }, [trackPageView]);

  // Auto-refresh removed to prevent infinite loops

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handleRefresh = () => {
    dashboard.refetch();
  };

  const handleExport = (type) => {
    // Export functionality would go here
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <ErrorMessage message="Error al cargar los datos de analytics" />
      </div>
    );
  }

  const renderOverviewCards = () => {
    const overviewData = dashboard?.data?.overview || {};
    const trends = dashboard?.data?.trends || {};

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
              <p className="text-2xl font-bold text-blue-600">{typeof overviewData.totalUsers === 'object' ? (overviewData.totalUsers?.current || overviewData.totalUsers?.count || 0) : (overviewData.totalUsers || 0)}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={`w-4 h-4 ${trends.usersGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-xs ${trends.usersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trends.usersGrowth >= 0 ? '+' : ''}{trends.usersGrowth?.toFixed(1) || 0}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profesionales</p>
              <p className="text-2xl font-bold text-green-600">{typeof overviewData.totalProfessionals === 'object' ? (overviewData.totalProfessionals?.current || overviewData.totalProfessionals?.count || 0) : (overviewData.totalProfessionals || 0)}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={`w-4 h-4 ${trends.professionalsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-xs ${trends.professionalsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trends.professionalsGrowth >= 0 ? '+' : ''}{trends.professionalsGrowth?.toFixed(1) || 0}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Trabajos</p>
              <p className="text-2xl font-bold text-purple-600">{typeof overviewData.totalBookings === 'object' ? (overviewData.totalBookings?.current || overviewData.totalBookings?.count || 0) : (overviewData.totalBookings || 0)}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={`w-4 h-4 ${trends.bookingsGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-xs ${trends.bookingsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trends.bookingsGrowth >= 0 ? '+' : ''}{trends.bookingsGrowth?.toFixed(1) || 0}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Briefcase className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos</p>
              <p className="text-2xl font-bold text-orange-600">
                ${(typeof overviewData.totalRevenue === 'object' ? 
                  (overviewData.totalRevenue?.current || overviewData.totalRevenue?.amount || 0) : 
                  (overviewData.totalRevenue || 0)
                ).toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={`w-4 h-4 ${trends.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-xs ${trends.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {trends.revenueGrowth >= 0 ? '+' : ''}{trends.revenueGrowth?.toFixed(1) || 0}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRealtimeMetrics = () => {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Métricas del Sistema
            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              BETA
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">27</div>
            <div className="text-xs text-gray-500">Usuarios Totales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">15</div>
            <div className="text-xs text-gray-500">Profesionales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">50</div>
            <div className="text-xs text-gray-500">Trabajos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">0</div>
            <div className="text-xs text-gray-500">Contactos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">5</div>
            <div className="text-xs text-gray-500">Eventos Analytics</div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalyticsCharts = () => {
    const chartData = dashboard?.data?.chartData || [];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Growth Trends */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-blue-500" />
            Tendencias de Crecimiento
          </h3>
          <MetricsChart
            data={chartData}
            type="line"
            xKey="date"
            yKey="newUsers"
            height={300}
            multipleLines={true}
            lineKeys={["newUsers", "newProfessionals", "newBookings"]}
          />
        </div>

        {/* Search Analytics */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-purple-500" />
            Análisis de Búsquedas
          </h3>
          <MetricsChart
            data={chartData}
            type="bar"
            xKey="date"
            yKey="searchQueries"
            height={300}
          />
        </div>

        {/* Revenue Trends */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Evolución de Ingresos
          </h3>
          <MetricsChart
            data={chartData}
            type="area"
            xKey="date"
            yKey="revenue"
            height={300}
          />
        </div>

        {/* Professional Contacts */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MousePointer className="w-5 h-5 text-orange-500" />
            Contactos a Profesionales
          </h3>
          <MetricsChart
            data={chartData}
            type="line"
            xKey="date"
            yKey="professionalContacts"
            height={300}
          />
        </div>
      </div>
    );
  };

  const renderTopSearchTerms = () => {
    const topSearchTerms = dashboard?.data?.topSearchTerms || [];

    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-purple-500" />
          Términos de Búsqueda Populares
        </h3>
        
        <div className="space-y-3">
          {topSearchTerms.length > 0 ? topSearchTerms.map((term, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{term.term || term}</p>
                  <p className="text-xs text-gray-500">
                    {term.searches || 0} búsquedas
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-800">
                  {term.conversionRate ? `${term.conversionRate.toFixed(1)}%` : 'N/A'}
                </div>
                <div className="text-xs text-gray-500">conversión</div>
              </div>
            </div>
          )) : (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay datos de búsquedas disponibles</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-500" />
              Analytics Dashboard
            </h2>
            <p className="text-gray-600 mt-1">
              Análisis detallado del comportamiento de usuarios y rendimiento de la plataforma
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Period Selector */}
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
              <option value="1y">Último año</option>
            </select>

            {/* Auto-refresh disabled to prevent infinite loops */}

            {/* Refresh Button */}
            <Button
              onClick={handleRefresh}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </Button>

            {/* Filters Button */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </Button>

            {/* Export Button */}
            <Button
              onClick={() => handleExport('dashboard')}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar eventos
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Buscar por término, usuario..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha desde
                </label>
                <input
                  type="date"
                  value={dateFilter.start}
                  onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha hasta
                </label>
                <input
                  type="date"
                  value={dateFilter.end}
                  onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Todas las categorías</option>
                  <option value="user">Usuarios</option>
                  <option value="professional">Profesionales</option>
                  <option value="search">Búsquedas</option>
                  <option value="booking">Trabajos</option>
                  <option value="payment">Pagos</option>
                  <option value="system">Sistema</option>
                </select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center gap-2 mt-4">
              <Button
                onClick={() => {
                  setSearchFilter("");
                  setDateFilter({ start: "", end: "" });
                  setCategoryFilter("all");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
              >
                Limpiar Filtros
              </Button>
              <div className="text-xs text-gray-500">
                {searchFilter || dateFilter.start || dateFilter.end || categoryFilter !== 'all'
                  ? 'Filtros aplicados'
                  : 'Sin filtros activos'}
              </div>
            </div>
          </div>
        )}

        {/* View Selector */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto">
          {[
            { key: 'overview', label: 'Vista General', icon: Eye },
            { key: 'users', label: 'Usuarios', icon: Users },
            { key: 'search', label: 'Búsquedas', icon: Search },
            { key: 'bookings', label: 'Trabajos', icon: Briefcase },
            { key: 'revenue', label: 'Ingresos', icon: DollarSign }
          ].map(view => {
            const IconComponent = view.icon;
            return (
              <button
                key={view.key}
                onClick={() => setActiveView(view.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeView === view.key
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {view.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Cards */}
      {activeView === 'overview' && (
        <>
          {renderOverviewCards()}
          {renderRealtimeMetrics()}
          {/* Temporarily disabled to fix performance */}
          {/* {renderAnalyticsCharts()} */}
          {/* {renderTopSearchTerms()} */}
        </>
      )}

      {/* Specific Views */}
      {activeView === 'users' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Análisis de Usuarios</h3>
          <p className="text-gray-500">Vista detallada de usuarios disponible próximamente...</p>
        </div>
      )}

      {activeView === 'search' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Análisis de Búsquedas</h3>
          <p className="text-gray-500">Vista detallada de búsquedas disponible próximamente...</p>
        </div>
      )}

      {activeView === 'bookings' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Análisis de Trabajos</h3>
          <p className="text-gray-500">Vista detallada de trabajos disponible próximamente...</p>
        </div>
      )}

      {activeView === 'revenue' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Análisis de Ingresos</h3>
          <p className="text-gray-500">Vista detallada de ingresos disponible próximamente...</p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsTab;