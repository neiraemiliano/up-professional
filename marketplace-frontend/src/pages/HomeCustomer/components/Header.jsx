import {
  Users,
  Clock,
  Star,
  Phone,
  Award,
  MapPin,
  ChevronDown,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import HomeHeader from "../../../components/Header/HomeHeader";
import { getText } from "../../../config/texts/texts";
import { useState } from "react";

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleDropdownToggle = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  const servicesMenuItems = [
    {
      name: "Plomería",
      href: "/servicios/plomeria",
      icon: "🔧",
      popular: true,
    },
    {
      name: "Electricidad",
      href: "/servicios/electricidad",
      icon: "⚡",
      popular: true,
    },
    {
      name: "Carpintería",
      href: "/servicios/carpinteria",
      icon: "🪚",
      popular: true,
    },
    { name: "Pintura", href: "/servicios/pintura", icon: "🎨", popular: true },
    {
      name: "Limpieza",
      href: "/servicios/limpieza",
      icon: "🧽",
      popular: true,
    },
    { name: "Jardinería", href: "/servicios/jardineria", icon: "🌱" },
    { name: "Gasista", href: "/servicios/gasista", icon: "🔥" },
    { name: "Aires Acond.", href: "/servicios/aire-acondicionado", icon: "❄️" },
    { name: "Ver todos", href: "/servicios", icon: "📋" },
  ];

  const zonasMenuItems = [
    {
      name: "Capital Federal",
      href: "/zona/caba",
      icon: "🏙️",
      count: "2,500+",
    },
    {
      name: "Zona Norte GBA",
      href: "/zona/norte",
      icon: "🌳",
      count: "1,200+",
    },
    { name: "Zona Sur GBA", href: "/zona/sur", icon: "🏘️", count: "800+" },
    { name: "Zona Oeste GBA", href: "/zona/oeste", icon: "🏭", count: "950+" },
    { name: "La Plata", href: "/zona/la-plata", icon: "🏛️", count: "400+" },
    { name: "Ver todas", href: "/zonas", icon: "📍" },
  ];

  return (
    <HomeHeader>
      {/* Navegación mejorada con dropdowns premium */}
      <nav className="hidden lg:flex items-center gap-1">
        <a
          href="#buscar"
          className="px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300 font-medium flex items-center gap-2 group"
        >
          <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
          {getText("findProfessional")}
        </a>

        {/* Dropdown Servicios Premium */}
        <div className="relative">
          <button
            onClick={() => handleDropdownToggle("servicios")}
            className="px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300 font-medium flex items-center gap-2 group"
          >
            <Award className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Servicios
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                activeDropdown === "servicios"
                  ? "rotate-180 text-orange-600"
                  : ""
              }`}
            />
          </button>

          {activeDropdown === "servicios" && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200/50 p-4 animate-in slide-in-from-top-5 duration-200 z-50">
              {/* Header del dropdown */}
              <div className="mb-4 pb-3 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 mb-1">
                  Servicios Más Solicitados
                </h3>
                <p className="text-sm text-gray-500">
                  +15,000 profesionales verificados
                </p>
              </div>

              {/* Grid de servicios */}
              <div className="grid grid-cols-3 gap-2">
                {servicesMenuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={closeDropdowns}
                    className={`
                      flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 hover:scale-105 text-center
                      ${
                        item.popular
                          ? "bg-orange-50 hover:bg-orange-100 text-orange-700 hover:text-orange-800 border border-orange-200"
                          : "hover:bg-gray-50 text-gray-700 hover:text-gray-800"
                      }
                    `}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium text-xs leading-tight">
                      {item.name}
                    </span>
                    {item.popular && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    )}
                  </a>
                ))}
              </div>

              {/* Footer del dropdown */}
              <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <a
                  href="/servicios"
                  onClick={closeDropdowns}
                  className="text-orange-600 hover:text-orange-700 font-semibold text-sm hover:underline"
                >
                  Ver todos los servicios →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Dropdown Zonas Premium */}
        <div className="relative">
          <button
            onClick={() => handleDropdownToggle("zonas")}
            className="px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300 font-medium flex items-center gap-2 group"
          >
            <MapPin className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Zonas
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${
                activeDropdown === "zonas" ? "rotate-180 text-orange-600" : ""
              }`}
            />
          </button>

          {activeDropdown === "zonas" && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200/50 p-4 animate-in slide-in-from-top-5 duration-200 z-50">
              {/* Header del dropdown */}
              <div className="mb-4 pb-3 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 mb-1">
                  Zonas de Cobertura
                </h3>
                <p className="text-sm text-gray-500">
                  Profesionales en toda Argentina
                </p>
              </div>

              {/* Footer del dropdown */}
              <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <a
                  href="/zonas"
                  onClick={closeDropdowns}
                  className="text-orange-600 hover:text-orange-700 font-semibold text-sm hover:underline"
                >
                  Ver todas las zonas →
                </a>
              </div>
            </div>
          )}
        </div>

        <a
          href="#how-it-works"
          className="px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300 font-medium flex items-center gap-2 group"
        >
          <Clock className="w-4 h-4 group-hover:scale-110 transition-transform" />
          {getText("howItWorks")}
        </a>

        <a
          href="#testimonios"
          className="px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300 font-medium flex items-center gap-2 group"
        >
          <Star className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Testimonios
        </a>

        <a
          href="#contacto"
          className="px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300 font-medium flex items-center gap-2 group"
        >
          <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Contacto
        </a>

        {/* Badge de confianza integrado en navegación */}
        <div className="ml-4 flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-green-200">
          <ShieldCheck className="w-4 h-4" />
          <span>Verificado</span>
        </div>
      </nav>

      {/* Overlay para cerrar dropdowns */}
      {activeDropdown && (
        <div className="fixed inset-0 z-40" onClick={closeDropdowns}></div>
      )}
    </HomeHeader>
  );
};

export default Header;

// Nota: Este componente usa el nuevo HomeHeader premium con navegación avanzada
// Incluye dropdowns para servicios y zonas, badges de confianza, y micro-animaciones
