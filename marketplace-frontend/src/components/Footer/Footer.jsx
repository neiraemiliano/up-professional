import {
  MapPin,
  Phone,
  Mail,
  Shield,
  Clock,
  Users,
  Star,
  Heart,
  ExternalLink,
  Facebook,
  Instagram,
  Twitter,
  ArrowUp,
  MessageCircle,
  CheckCircle,
  Award,
  Globe,
  Building,
  Smartphone,
} from "lucide-react";
import { useContent } from "../../hooks/api/content";

const Footer = () => {
  const { getContent } = useContent();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Para Clientes",
      links: [
        { name: "¿Cómo funciona?", href: "#how-it-works", icon: Clock },
        { name: "Buscar profesionales", href: "#buscar", icon: Users },
        { name: "Testimonios", href: "#testimonios", icon: Star },
        { name: "Preguntas frecuentes", href: "#faq", icon: MessageCircle },
        { name: "Contacto", href: "#contacto", icon: Phone },
      ],
    },
    {
      title: "Para Profesionales",
      links: [
        { name: "Registrarse gratis", href: "/profesional/registro", icon: Users },
        { name: "Cómo ganar dinero", href: "/profesional/info", icon: Award },
        { name: "Tarifas y comisiones", href: "/profesional/precios", icon: CheckCircle },
        { name: "Centro de ayuda", href: "/ayuda", icon: Shield },
        { name: "App móvil", href: "#app", icon: Smartphone },
      ],
    },
    {
      title: "Servicios Populares",
      links: [
        { name: "Plomeros", href: "/servicios/plomeria", icon: null },
        { name: "Electricistas", href: "/servicios/electricidad", icon: null },
        { name: "Carpinteros", href: "/servicios/carpinteria", icon: null },
        { name: "Pintores", href: "/servicios/pintura", icon: null },
        { name: "Limpieza del hogar", href: "/servicios/limpieza", icon: null },
      ],
    },
    {
      title: "Zonas de Cobertura",
      links: [
        { name: "Capital Federal", href: "/zona/caba", icon: MapPin },
        { name: "Zona Norte GBA", href: "/zona/zona-norte", icon: MapPin },
        { name: "Zona Sur GBA", href: "/zona/zona-sur", icon: MapPin },
        { name: "Zona Oeste GBA", href: "/zona/zona-oeste", icon: MapPin },
        { name: "Ver todas las zonas", href: "/zonas", icon: Globe },
      ],
    },
  ];

  const socialLinks = [
    { name: "Facebook", href: getContent('social_facebook', 'https://facebook.com/homefixed'), icon: Facebook },
    { name: "Instagram", href: getContent('social_instagram', 'https://instagram.com/homefixed'), icon: Instagram },
    { name: "Twitter", href: getContent('social_twitter', 'https://twitter.com/homefixed'), icon: Twitter },
  ];

  const legalLinks = [
    { name: "Términos y Condiciones", href: "/terminos" },
    { name: "Política de Privacidad", href: "/privacidad" },
    { name: "Política de Cookies", href: "/cookies" },
    { name: "Defensa del Consumidor", href: "/defensa-consumidor" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Contenido principal del footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Header del footer con logo y descripción */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Logo y descripción */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                <Building className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  Home Fixed
                </h3>
                <p className="text-gray-400 text-sm">Tu marketplace de confianza</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              {getContent('footer_company_description', 'La plataforma más confiable para encontrar profesionales del hogar en Argentina.')}
            </p>
            
            {/* Estadísticas destacadas */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  <span className="text-orange-400 font-semibold">+15K</span>
                </div>
                <p className="text-gray-300 text-sm">Clientes satisfechos</p>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">4.9⭐</span>
                </div>
                <p className="text-gray-300 text-sm">Calificación promedio</p>
              </div>
            </div>

            {/* Redes sociales */}
            <div>
              <p className="text-gray-400 text-sm mb-3">Seguinos en redes</p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                    title={social.name}
                  >
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-orange-400" />
                ¿Necesitás ayuda? Estamos acá para vos
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Atención al Cliente</p>
                      <p className="text-gray-300 text-sm">{getContent('contact_phone', '+54 11 1234-5678')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Email de Soporte</p>
                      <p className="text-gray-300 text-sm">{getContent('contact_email', 'contacto@homefixed.com')}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Horarios de Atención</p>
                      <p className="text-gray-300 text-sm">Lun a Vie: 8:00 - 20:00 hs</p>
                      <p className="text-gray-300 text-sm">Sáb: 9:00 - 18:00 hs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">WhatsApp</p>
                      <p className="text-gray-300 text-sm">{getContent('whatsapp_number', '+5491123456789')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secciones de enlaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-bold mb-4 text-orange-400">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 group"
                    >
                      {link.icon && (
                        <link.icon className="w-4 h-4 text-gray-500 group-hover:text-orange-400 transition-colors" />
                      )}
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Sección de certificaciones y seguridad */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h5 className="font-bold text-white mb-2">100% Seguro</h5>
              <p className="text-gray-300 text-sm">Profesionales verificados y procesos seguros garantizados</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h5 className="font-bold text-white mb-2">Calidad Premium</h5>
              <p className="text-gray-300 text-sm">Solo los mejores profesionales con calificaciones altas</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h5 className="font-bold text-white mb-2">Soporte 24/7</h5>
              <p className="text-gray-300 text-sm">Estamos siempre disponibles para ayudarte cuando lo necesites</p>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright y enlaces legales */}
          <div className="text-center md:text-left">
            <p className="text-gray-400 mb-2">
              {getContent('footer_copyright', `© ${currentYear} Home Fixed. Todos los derechos reservados.`)}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {legalLinks.map((link, index) => (
                <span key={link.name} className="flex items-center gap-4">
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                  {index < legalLinks.length - 1 && (
                    <span className="text-gray-600">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Botón scroll to top */}
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            title="Volver arriba"
          >
            <ArrowUp className="w-5 h-5" />
            <span className="hidden sm:inline">Volver arriba</span>
          </button>
        </div>

        {/* Mensaje final con corazón */}
        <div className="text-center mt-8 pt-6 border-t border-white/10">
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <span>Hecho con</span>
            <Heart className="w-4 h-4 text-red-400 animate-pulse" />
            <span>en Buenos Aires, Argentina</span>
            <span className="text-lg">🇦🇷</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;