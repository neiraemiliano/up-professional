import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  BarChart3,
  Users,
  UserCheck,
  Briefcase,
  DollarSign,
  Activity,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Shield,
  ChevronDown,
  Home,
  PieChart,
  TrendingUp,
  MessageSquare,
  Calendar,
  Database,
  FileText,
  HelpCircle,
  Sun,
  Moon
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Nuevo profesional registrado', time: '2m', type: 'info' },
    { id: 2, title: 'Pago procesado exitosamente', time: '5m', type: 'success' },
    { id: 3, title: 'Error en webhook MercadoPago', time: '10m', type: 'error' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user] = useState({ name: 'Admin', email: 'admin@homefixed.com' });
  
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarItems = [
    {
      title: 'Dashboard',
      items: [
        { name: 'Overview', path: '/admin', icon: Home, activeTab: 'overview' },
        { name: 'Usuarios', path: '/admin', icon: Users, activeTab: 'users' },
        { name: 'Profesionales', path: '/admin', icon: UserCheck, activeTab: 'professionals' },
        { name: 'Trabajos', path: '/admin', icon: Briefcase, activeTab: 'bookings' },
        { name: 'Pagos', path: '/admin', icon: DollarSign, activeTab: 'payments' },
        { name: 'Financiero', path: '/admin', icon: PieChart, activeTab: 'financial' },
        { name: 'Actividad', path: '/admin', icon: Activity, activeTab: 'activity' }
      ]
    },
    {
      title: 'Analíticas',
      items: [
        { name: 'Reportes', path: '/admin/reports', icon: BarChart3 },
        { name: 'Métricas', path: '/admin/metrics', icon: TrendingUp },
        { name: 'Exportar Datos', path: '/admin/export', icon: Database }
      ]
    },
    {
      title: 'Gestión',
      items: [
        { name: 'Configuración', path: '/admin/settings', icon: Settings },
        { name: 'Soporte', path: '/admin/support', icon: MessageSquare },
        { name: 'Documentación', path: '/admin/docs', icon: FileText }
      ]
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-100 border-green-200 text-green-800';
      case 'error': return 'bg-red-100 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      default: return 'bg-blue-100 border-blue-200 text-blue-800';
    }
  };

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-orange-600 to-red-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Home Fixed</h1>
                <p className="text-orange-100 text-sm">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex flex-col h-full">
            <div className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
              <nav className="space-y-6">
                {sidebarItems.map((section, sectionIndex) => (
                  <div key={sectionIndex}>
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                      {section.title}
                    </h3>
                    <ul className="space-y-1">
                      {section.items.map((item, itemIndex) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <li key={itemIndex}>
                            <Link
                              to={item.path}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                isActive
                                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                              }`}
                            >
                              <item.icon className={`w-5 h-5 ${
                                isActive ? 'text-white' : 'text-gray-500 group-hover:text-orange-500'
                              }`} />
                              <span>{item.name}</span>
                              {item.name === 'Overview' && (
                                <div className="ml-auto w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Top Navigation */}
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-20">
            <div className="flex items-center justify-between h-full px-6">
              {/* Mobile menu button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>

                {/* Search */}
                <div className="hidden sm:block">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Buscar usuarios, profesionales..."
                      className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors w-64 lg:w-80"
                    />
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Notificaciones
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-l-4 ${getNotificationColor(notification.type)} m-2 rounded-r-lg`}
                          >
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm opacity-70">Hace {notification.time}</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button className="w-full text-center text-orange-600 hover:text-orange-700 font-medium text-sm">
                          Ver todas las notificaciones
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Help */}
                <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  <HelpCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;