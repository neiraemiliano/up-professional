import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
  Home,
  User,
  Briefcase,
  Calendar,
  Star,
  DollarSign,
  MessageSquare,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Crown,
  TrendingUp,
  Users,
  Clock,
  Award,
  Camera,
  FileText,
  HelpCircle,
  Sun,
  Moon,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';

const ProfessionalLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Nueva reserva de servicio', time: '5m', type: 'success' },
    { id: 2, title: 'Pago recibido: $25.000', time: '15m', type: 'success' },
    { id: 3, title: 'Nueva reseña: 5 estrellas', time: '1h', type: 'info' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [user] = useState({ 
    name: 'Juan Pérez', 
    email: 'juan@ejemplo.com',
    plan: 'premium', // free, premium, pro
    rating: 4.8,
    completedJobs: 127
  });
  
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarItems = [
    {
      title: 'Dashboard',
      items: [
        { name: 'Overview', path: '/professional-dashboard', icon: Home },
        { name: 'Mi Perfil', path: '/professional/profile', icon: User },
        { name: 'Mis Servicios', path: '/professional/services', icon: Briefcase },
        { name: 'Calendario', path: '/professional/calendar', icon: Calendar },
        { name: 'Reservas', path: '/professional/bookings', icon: Clock }
      ]
    },
    {
      title: 'Clientes',
      items: [
        { name: 'Clientes', path: '/professional/clients', icon: Users },
        { name: 'Reseñas', path: '/professional/reviews', icon: Star },
        { name: 'Mensajes', path: '/professional/messages', icon: MessageSquare }
      ]
    },
    {
      title: 'Negocio',
      items: [
        { name: 'Analíticas', path: '/professional/analytics', icon: BarChart3 },
        { name: 'Facturación', path: '/professional/billing', icon: DollarSign },
        { name: 'Suscripción', path: '/professional/subscription', icon: Crown },
        { name: 'Portafolio', path: '/professional/portfolio', icon: Camera }
      ]
    },
    {
      title: 'Configuración',
      items: [
        { name: 'Configuración', path: '/professional/settings', icon: Settings },
        { name: 'Ayuda', path: '/professional/help', icon: HelpCircle },
        { name: 'Documentos', path: '/professional/documents', icon: FileText }
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

  const getPlanBadge = (plan) => {
    switch (plan) {
      case 'pro':
        return {
          text: 'PRO',
          icon: Crown,
          gradient: 'from-purple-600 to-pink-600',
          textColor: 'text-purple-100'
        };
      case 'premium':
        return {
          text: 'PREMIUM',
          icon: Zap,
          gradient: 'from-orange-500 to-red-500',
          textColor: 'text-orange-100'
        };
      default:
        return {
          text: 'GRATIS',
          icon: Shield,
          gradient: 'from-gray-400 to-gray-600',
          textColor: 'text-gray-100'
        };
    }
  };

  const planBadge = getPlanBadge(user.plan);

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
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl`}>
          
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-orange-600 to-red-600 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
            </div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Home Fixed</h1>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${planBadge.gradient}`}>
                  <planBadge.icon className="w-3 h-3" />
                  <span className={planBadge.textColor}>{planBadge.text}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors relative z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Professional Stats */}
          <div className="p-4 bg-gradient-to-b from-orange-50 to-white dark:from-gray-700 dark:to-gray-800 border-b border-orange-100 dark:border-gray-600">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-yellow-500 mb-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-gray-900 dark:text-white">{user.rating}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">Rating</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Award className="w-4 h-4 text-green-500" />
                  <span className="font-bold text-gray-900 dark:text-white">{user.completedJobs}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">Trabajos</p>
              </div>
            </div>
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
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden ${
                                isActive
                                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-orange-600 dark:hover:text-orange-400'
                              }`}
                            >
                              {isActive && (
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-400/20 animate-pulse"></div>
                              )}
                              <item.icon className={`w-5 h-5 relative z-10 ${
                                isActive ? 'text-white' : 'text-gray-500 group-hover:text-orange-500'
                              }`} />
                              <span className="relative z-10">{item.name}</span>
                              {item.name === 'Reservas' && (
                                <div className="ml-auto w-2 h-2 bg-orange-400 rounded-full animate-pulse relative z-10"></div>
                              )}
                              {item.name === 'Mensajes' && (
                                <div className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center relative z-10">
                                  3
                                </div>
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

            {/* Sidebar Footer - Professional Info */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-orange-50 dark:from-gray-700 dark:to-gray-600">
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center relative">
                  <span className="text-white font-semibold text-sm">
                    {user.name.charAt(0)}
                  </span>
                  {user.plan !== 'free' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
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
                  className="p-2 text-gray-500 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
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
          <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-20 shadow-sm">
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
                      placeholder="Buscar clientes, reservas..."
                      className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors w-64 lg:w-80"
                    />
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                {/* Upgrade button for free users */}
                {user.plan === 'free' && (
                  <Link
                    to="/professional/subscription"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 text-sm font-medium"
                  >
                    <Crown className="w-4 h-4" />
                    <span>Actualizar</span>
                  </Link>
                )}

                {/* Performance indicator */}
                <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">+15% este mes</span>
                </div>

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
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-gray-700 dark:to-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Notificaciones
                        </h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors"
                          >
                            <div className={`p-3 border-l-4 rounded-r-lg ${getNotificationColor(notification.type)}`}>
                              <p className="font-medium">{notification.title}</p>
                              <p className="text-sm opacity-70">Hace {notification.time}</p>
                            </div>
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
          <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-orange-50/30 dark:from-gray-900 dark:to-gray-800">
            <div className="p-6">
              <Outlet />
            </div>
          </main>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden backdrop-blur-sm"
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
          background: linear-gradient(to bottom, #f97316, #dc2626);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #ea580c, #b91c1c);
        }
      `}</style>
    </div>
  );
};

export default ProfessionalLayout;