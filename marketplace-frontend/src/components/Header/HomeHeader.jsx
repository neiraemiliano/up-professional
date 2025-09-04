import {
  Building,
  Clock,
  Menu,
  Phone,
  Shield,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getText } from "../../config/texts/texts";

const HomeHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Detectar scroll para cambiar estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${
            isScrolled
              ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-orange-100"
              : "bg-white/80 backdrop-blur-sm shadow-sm"
          }
        `}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo y marca */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </button>

              <Link
                to="/"
                className="flex items-center gap-3 group"
                onClick={closeAllMenus}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {getText("appTitle")}
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">
                    Tu marketplace de confianza
                  </p>
                </div>
              </Link>
            </div>

            {/* Navegación desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              <a
                href="#buscar"
                onClick={closeAllMenus}
                className="px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300 font-medium flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                {getText("findProfessional")}
              </a>

              <a
                href="#how-it-works"
                onClick={closeAllMenus}
                className="px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300 font-medium flex items-center gap-2"
              >
                <Clock className="w-4 h-4" />
                {getText("howItWorks")}
              </a>

              <a
                href="#testimonios"
                onClick={closeAllMenus}
                className="px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300 font-medium flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                Testimonios
              </a>

              <a
                href="#contacto"
                onClick={closeAllMenus}
                className="px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300 font-medium flex items-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Contacto
              </a>
            </nav>

            {/* CTAs de la derecha */}
            <div className="flex items-center gap-3">
              {/* Enlace discreto de admin */}
              <Link
                to="/admin-login"
                className="hidden lg:flex items-center justify-center w-9 h-9 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-300"
                title="Acceso de Administrador"
              >
                <Shield className="w-4 h-4" />
              </Link>

              {/* Indicador de confianza */}
              <div className="hidden md:flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold border border-green-200">
                <Shield className="w-4 h-4" />
                <span>100% Seguro</span>
              </div>

              {/* Botón principal CTA */}
              <Link
                to="/professional"
                onClick={closeAllMenus}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {getText("becomeProfessional")}
                </span>
                <span className="sm:hidden">Profesional</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <nav className="flex flex-col gap-2">
                <a
                  href="#buscar"
                  onClick={closeAllMenus}
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                >
                  <Users className="w-5 h-5" />
                  {getText("findProfessional")}
                </a>

                <div className="border-t border-gray-100 my-2"></div>

                <div className="border-t border-gray-100 my-2"></div>

                <a
                  href="#how-it-works"
                  onClick={closeAllMenus}
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                >
                  <Clock className="w-5 h-5" />
                  {getText("howItWorks")}
                </a>

                <a
                  href="#testimonios"
                  onClick={closeAllMenus}
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                >
                  <Star className="w-5 h-5" />
                  Testimonios
                </a>

                <a
                  href="#contacto"
                  onClick={closeAllMenus}
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Contacto
                </a>

                <div className="border-t border-gray-100 my-2"></div>

                {/* Admin access móvil */}
                <Link
                  to="/admin-login"
                  onClick={closeAllMenus}
                  className="flex items-center gap-3 p-3 text-gray-500 hover:bg-gray-50 hover:text-gray-700 rounded-lg transition-colors text-sm"
                >
                  <Shield className="w-4 h-4" />
                  Acceso Administrador
                </Link>

                <div className="border-t border-gray-100 my-2"></div>

                {/* CTA móvil */}
                <Link
                  to="/professional"
                  onClick={closeAllMenus}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-3 rounded-xl font-bold text-center transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  {getText("becomeProfessional")}
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Spacer para compensar el header fixed */}
      <div className="h-20"></div>

      {/* Overlay para cerrar menús al hacer click fuera */}
      {(isMobileMenuOpen || activeDropdown) && (
        <div
          className="fixed inset-0 z-40 bg-black/10"
          onClick={closeAllMenus}
        ></div>
      )}
    </>
  );
};

export default HomeHeader;
