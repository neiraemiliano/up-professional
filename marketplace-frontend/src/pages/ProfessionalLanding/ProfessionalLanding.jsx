import {
  ArrowRight,
  Award,
  Building,
  Clock,
  DollarSign,
  Eye,
  Heart,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

export default function ProfessionalLanding() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Carlos Mendoza",
      profession: "Plomero",
      location: "Villa Crespo, CABA",
      avatar: "👨‍🔧",
      quote:
        "Desde que me uní a Home Fixed, mis ingresos aumentaron un 180%. ¡Ahora tengo trabajo todos los días!",
      earnings: "+$180,000/mes",
      rating: 4.9,
    },
    {
      name: "María González",
      profession: "Limpieza del Hogar",
      location: "Palermo, CABA",
      avatar: "👩‍💼",
      quote:
        "La plataforma me cambió la vida. Pasé de buscar clientes a que me busquen a mí. ¡Increíble!",
      earnings: "+$120,000/mes",
      rating: 5.0,
    },
    {
      name: "Roberto Silva",
      profession: "Carpintero",
      location: "San Telmo, CABA",
      avatar: "👨‍🏭",
      quote:
        "Lo que más me gusta es que puedo elegir mis trabajos y mis horarios. Total flexibilidad.",
      earnings: "+$250,000/mes",
      rating: 4.8,
    },
  ];

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const section = document.querySelector("#hero");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Header Premium */}
      <header className="absolute inset-x-0 top-0 z-50 bg-black/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Home Fixed</h1>
              <p className="text-xs text-white/80 -mt-1">Para Profesionales</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <a
              href="#como-funciona"
              className="text-white/90 hover:text-white transition-colors font-medium"
            >
              ¿Cómo funciona?
            </a>
            <a
              href="#testimonios"
              className="text-white/90 hover:text-white transition-colors font-medium"
            >
              Testimonios
            </a>
            <a
              href="#ganancias"
              className="text-white/90 hover:text-white transition-colors font-medium"
            >
              Ganancias
            </a>
            <Link
              to="/signin"
              className="text-white/90 hover:text-white transition-colors font-medium"
            >
              Iniciar sesión
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-black/90 backdrop-blur-md border-t border-white/10">
            <nav className="max-w-7xl mx-auto px-6 py-4 space-y-4">
              <a
                href="#como-funciona"
                className="block text-white hover:text-orange-400 transition-colors font-medium"
              >
                ¿Cómo funciona?
              </a>
              <a
                href="#testimonios"
                className="block text-white hover:text-orange-400 transition-colors font-medium"
              >
                Testimonios
              </a>
              <a
                href="#ganancias"
                className="block text-white hover:text-orange-400 transition-colors font-medium"
              >
                Ganancias
              </a>
              <Link
                to="/signin"
                className="block text-white hover:text-orange-400 transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Iniciar sesión
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section Premium */}
      <section
        id="hero"
        className="relative flex flex-col lg:flex-row lg:min-h-screen overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-orange-900 to-red-900"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Content Column */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div
              className={`space-y-8 transform transition-all duration-700 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-8 opacity-0"
              }`}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100/20 to-red-100/20 backdrop-blur-sm text-orange-300 px-4 py-2 rounded-full text-sm font-bold border border-orange-500/30">
                <Sparkles className="w-4 h-4" />
                <span>¡Más de 5,000 profesionales ganando dinero!</span>
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                <span className="bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                  ¿Sos profesional?
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                  ¡Ganá más dinero!
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-white/90 leading-relaxed max-w-lg">
                Conseguí más clientes mostrando tus servicios en la plataforma
                de profesionales
                <span className="font-bold text-orange-300">
                  {" "}
                  #1 de Argentina
                </span>
                . 100% gratis para empezar.
              </p>

              {/* Benefits */}
              <ul className="space-y-4">
                {[
                  {
                    text: "Accedé a +2,000 oportunidades mensuales cerca tuyo",
                    icon: Target,
                  },
                  {
                    text: "Conectá con clientes que buscan tus habilidades específicas",
                    icon: Users,
                  },
                  {
                    text: "Aumentá tus ingresos hasta un 200% en el primer mes",
                    icon: TrendingUp,
                  },
                ].map((benefit, index) => (
                  <li key={index} className="flex gap-4 items-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
                      <benefit.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/90 font-medium text-lg">
                      {benefit.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Earnings Preview */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-bold text-lg">
                    Potencial de Ingresos
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-orange-300">
                      $150K+
                    </div>
                    <div className="text-sm text-white/70">
                      Por mes promedio
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-300">
                      85%
                    </div>
                    <div className="text-sm text-white/70">Aumento típico</div>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-4">
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Zap className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">🚀 EMPEZAR GRATIS AHORA</span>
                  <ArrowRight className="w-6 h-6 relative z-10" />
                </Link>

                <p className="text-center text-white/80">
                  <span className="mr-2">¿Ya tenés cuenta?</span>
                  <Link
                    to="/signin"
                    className="text-orange-300 font-bold hover:text-orange-200 transition-colors hover:underline"
                  >
                    Iniciar sesión
                  </Link>
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {["👨‍🔧", "👩‍💼", "👨‍🏭", "👩‍🎨"].map((avatar, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center border-2 border-white text-sm"
                      >
                        {avatar}
                      </div>
                    ))}
                  </div>
                  <span className="text-white/80 text-sm font-medium">
                    +5,000 profesionales activos
                  </span>
                </div>
              </div>
            </div>

            {/* Right Image/Testimonial */}
            <div
              className={`transform transition-all duration-700 delay-300 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-8 opacity-0"
              }`}
            >
              {/* Featured Testimonial Card */}
              <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-t-3xl"></div>

                {/* Testimonial Content */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {testimonials[currentTestimonial].name}
                      </h3>
                      <p className="text-orange-600 font-semibold">
                        {testimonials[currentTestimonial].profession}
                      </p>
                      <p className="text-gray-600 text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {testimonials[currentTestimonial].location}
                      </p>
                    </div>
                  </div>

                  <blockquote className="text-gray-700 text-lg italic leading-relaxed">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                      <span className="ml-2 text-gray-700 font-semibold">
                        {testimonials[currentTestimonial].rating}
                      </span>
                    </div>
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm">
                      {testimonials[currentTestimonial].earnings}
                    </div>
                  </div>

                  {/* Navigation dots */}
                  <div className="flex justify-center gap-2 pt-4">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentTestimonial
                            ? "bg-orange-500 scale-125"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo Funciona Premium */}
      <section
        id="como-funciona"
        className="py-24 bg-gradient-to-br from-gray-50 to-orange-50"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-orange-200">
              <Award className="w-4 h-4" />
              <span>Proceso súper simple</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-orange-800 to-red-900 bg-clip-text text-transparent">
                ¿Cómo funciona
              </span>
              <br />
              <span className="text-gray-800">para profesionales?</span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              En solo 3 pasos simples empezás a recibir clientes y aumentar tus
              ingresos
              <span className="font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded mx-2">
                desde el primer día
              </span>
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <StepCardPremium
              icon={UserPlus}
              number={1}
              title="Creá tu perfil gratis"
              subtitle="En menos de 5 minutos"
              description="Completá tu información, agregá fotos de tus trabajos y listá todos los servicios que ofrecés."
              color="from-blue-500 to-cyan-500"
              bgColor="from-blue-50 to-cyan-50"
              features={[
                "📄 Perfil profesional completo",
                "📸 Galería de trabajos",
                "⚡ Verificación instantánea",
              ]}
            />
            <StepCardPremium
              icon={Eye}
              number={2}
              title="Recibí solicitudes"
              subtitle="Clientes te van a encontrar"
              description="Los clientes van a ver tu perfil cuando busquen servicios como los tuyos en tu zona."
              color="from-green-500 to-emerald-500"
              bgColor="from-green-50 to-emerald-50"
              features={[
                "🎯 Clientes cerca tuyo",
                "📞 Contacto directo",
                "💬 Chat integrado",
              ]}
            />
            <StepCardPremium
              icon={DollarSign}
              number={3}
              title="Trabajá y cobrá"
              subtitle="Aumentá tus ingresos"
              description="Acordá el trabajo, realizalo con excelencia y cobrá el precio que vos quieras."
              color="from-orange-500 to-red-500"
              bgColor="from-orange-50 to-red-50"
              features={[
                "💰 Vos ponés el precio",
                "⭐ Construí tu reputación",
                "📈 Clientes recurrentes",
              ]}
            />
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Sparkles className="w-5 h-5" />
              Empezar ahora gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Ganancias Section */}
      <section id="ganancias" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-gray-800">
              ¿Cuánto podés ganar?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nuestros profesionales están ganando más dinero que nunca.
              <span className="font-bold text-orange-600">
                {" "}
                ¡Vos también podés!
              </span>
            </p>
          </div>

          {/* Earnings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <EarningsCard
              profession="Plomero"
              avgEarnings="$180,000"
              topEarnings="$350,000"
              icon="🔧"
              growth="+125%"
            />
            <EarningsCard
              profession="Electricista"
              avgEarnings="$220,000"
              topEarnings="$420,000"
              icon="⚡"
              growth="+145%"
            />
            <EarningsCard
              profession="Carpintero"
              avgEarnings="$250,000"
              topEarnings="$480,000"
              icon="🪚"
              growth="+160%"
            />
          </div>

          {/* Success Stats */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8 border border-orange-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  85%
                </div>
                <div className="text-sm text-gray-600">Aumentan ingresos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  $150K+
                </div>
                <div className="text-sm text-gray-600">Ganancia promedio</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  2.3x
                </div>
                <div className="text-sm text-gray-600">Más trabajos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  4.8★
                </div>
                <div className="text-sm text-gray-600">Rating promedio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios Premium */}
      <section
        id="testimonios"
        className="py-24 bg-gradient-to-br from-gray-50 to-orange-50"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-16 text-gray-800">
            Lo que dicen nuestros profesionales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-xl shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-orange-600 font-semibold text-sm">
                      {testimonial.profession}
                    </p>
                  </div>
                </div>

                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                    {testimonial.earnings}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
            ¿Listo para cambiar tu vida profesional?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Uní a miles de profesionales que ya están ganando más dinero con
            Home Fixed.
            <br />
            <strong>¡Es gratis y toma menos de 5 minutos!</strong>
          </p>

          <div className="space-y-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-3 bg-white text-orange-600 px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:bg-orange-50"
            >
              <Sparkles className="w-6 h-6" />
              ¡EMPEZAR GRATIS AHORA!
              <ArrowRight className="w-6 h-6" />
            </Link>

            <p className="text-white/90">
              ¿Ya tenés cuenta?{" "}
              <Link to="/signin" className="font-bold hover:underline">
                Iniciar sesión
              </Link>
            </p>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span>100% Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Setup en 5 min</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              <span>Gratis para empezar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Premium */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo Column */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Home Fixed</h3>
                  <p className="text-xs text-gray-400">Para Profesionales</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                La plataforma #1 de Argentina para profesionales independientes.
              </p>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="font-semibold mb-4">Profesionales</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cómo funciona
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Precios
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Centro de ayuda
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Plomería
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Electricidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Carpintería
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>0800-UP-PROF</span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>+54 9 11 1234-5678</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 Home Fixed. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Premium Step Card Component
function StepCardPremium({
  icon: Icon,
  number,
  title,
  subtitle,
  description,
  color,
  bgColor,
  features,
}) {
  return (
    <div
      className={`relative bg-gradient-to-br ${bgColor} p-8 rounded-3xl border-2 border-orange-200/50 hover:border-orange-300 transition-all duration-300 hover:shadow-xl hover:scale-105 group`}
    >
      {/* Number Badge */}
      <div
        className={`absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg bg-gradient-to-r ${color}`}
      >
        {number}
      </div>

      {/* Icon */}
      <div
        className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform bg-gradient-to-br ${color}`}
      >
        <Icon className="w-8 h-8 text-white" />
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-orange-600 font-semibold text-sm mb-4">{subtitle}</p>
        <p className="text-gray-700 mb-6 leading-relaxed">{description}</p>

        {/* Features */}
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-xs text-gray-600 justify-center"
            >
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Earnings Card Component
function EarningsCard({ profession, avgEarnings, topEarnings, icon, growth }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="text-center">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">{profession}</h3>

        <div className="space-y-3">
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {avgEarnings}
            </div>
            <div className="text-sm text-gray-600">Promedio mensual</div>
          </div>

          <div>
            <div className="text-lg font-semibold text-green-600">
              {topEarnings}
            </div>
            <div className="text-xs text-gray-600">Top performers</div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {growth} vs. trabajar solo
          </div>
        </div>
      </div>
    </div>
  );
}
