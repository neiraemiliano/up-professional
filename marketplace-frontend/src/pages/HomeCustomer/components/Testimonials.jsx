import {
  Star,
  Quote,
  CheckCircle,
  Users,
  Clock,
  Heart,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      name: "María González",
      location: "Villa Crespo, CABA",
      service: "Plomería",
      rating: 5,
      avatar: "👩‍💼",
      quote: "Increíble servicio! En 20 minutos tenía 4 presupuestos de plomeros verificados. El que elegí llegó súper rápido y solucionó todo perfecto. ¡100% recomendado!",
      highlight: "Respuesta en 20 minutos",
      verified: true,
      timeAgo: "hace 2 días"
    },
    {
      id: 2,
      name: "Carlos Mendoza",
      location: "Palermo, CABA",
      service: "Electricista",
      rating: 5,
      avatar: "👨‍🔧",
      quote: "Necesitaba un electricista urgente y Home Fixed me salvó. Los profesionales son súper confiables y los precios justos. Ya lo uso para todo!",
      highlight: "Profesionales confiables",
      verified: true,
      timeAgo: "hace 1 semana"
    },
    {
      id: 3,
      name: "Ana Rodríguez",
      location: "San Telmo, CABA",
      service: "Limpieza",
      rating: 5,
      avatar: "👩‍🏫",
      quote: "La mejor plataforma para encontrar profesionales. Todo súper fácil, rápido y seguro. Los precios son excelentes y la calidad impecable.",
      highlight: "Precios excelentes",
      verified: true,
      timeAgo: "hace 3 días"
    },
    {
      id: 4,
      name: "Roberto Silva",
      location: "Belgrano, CABA",
      service: "Carpintería",
      rating: 5,
      avatar: "👨‍💼",
      quote: "Contraté un carpintero para mi oficina y quedó espectacular. El proceso fue súper simple y el resultado superó mis expectativas completamente.",
      highlight: "Resultado espectacular",
      verified: true,
      timeAgo: "hace 5 días"
    },
    {
      id: 5,
      name: "Laura Martín",
      location: "Recoleta, CABA",
      service: "Pintura",
      rating: 5,
      avatar: "👩‍🎨",
      quote: "Pintaron todo mi departamento en tiempo récord y con una calidad increíble. La comunicación fue excelente desde el primer contacto por WhatsApp.",
      highlight: "Calidad increíble",
      verified: true,
      timeAgo: "hace 1 semana"
    }
  ];

  // Auto-advance testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById("testimonios");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section
      className="relative py-24 bg-gradient-to-br from-orange-50 via-white to-red-50 overflow-hidden"
      id="testimonios"
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-orange-100/20 to-red-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header premium */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-orange-200">
            <Heart className="w-4 h-4" />
            <span>+15,000 usuarios satisfechos</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-orange-800 to-red-900 bg-clip-text text-transparent">
              Historias reales
            </span>
            <br />
            <span className="text-gray-800">de usuarios felices</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Miles de argentinos ya encontraron a sus profesionales ideales.
            <span className="font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded mx-2">
              ¡Leé sus experiencias!
            </span>
          </p>
        </div>

        {/* Testimonial principal con diseño premium */}
        <div className="relative max-w-5xl mx-auto mb-16">
          <div
            className={`
            transform transition-all duration-700
            ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
          `}
          >
            {/* Card principal del testimonial */}
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-2xl border border-gray-200/50 overflow-hidden">
              {/* Elementos decorativos internos */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full blur-xl"></div>

              {/* Quote icon grande */}
              <div className="absolute top-6 left-6 text-orange-200">
                <Quote className="w-16 h-16 fill-current" />
              </div>

              <div className="relative z-10">
                {/* Header del testimonial */}
                <div className="flex flex-col lg:flex-row lg:items-start gap-6 mb-8">
                  {/* Avatar y info del usuario */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                        {currentTestimonial.avatar}
                      </div>
                      {currentTestimonial.verified && (
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">
                        {currentTestimonial.name}
                      </h4>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{currentTestimonial.location}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold">
                          {currentTestimonial.service}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {currentTestimonial.timeAgo}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Rating y highlight */}
                  <div className="lg:ml-auto lg:text-right">
                    <div className="flex items-center gap-1 justify-center lg:justify-end mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                      ✨ {currentTestimonial.highlight}
                    </div>
                  </div>
                </div>

                {/* Quote del testimonial */}
                <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-6 font-medium italic">
                  "{currentTestimonial.quote}"
                </blockquote>

                {/* Controles de navegación */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevTestimonial}
                      className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                      title="Anterior testimonio"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
                      title="Siguiente testimonio"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Indicadores de progreso */}
                  <div className="flex items-center gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentIndex(index);
                          setIsAutoPlaying(false);
                          setTimeout(() => setIsAutoPlaying(true), 10000);
                        }}
                        className={`
                          w-3 h-3 rounded-full transition-all duration-300
                          ${index === currentIndex 
                            ? "bg-gradient-to-r from-orange-500 to-red-500 scale-125" 
                            : "bg-gray-300 hover:bg-gray-400"
                          }
                        `}
                      />
                    ))}
                  </div>

                  {/* Indicador de auto-play */}
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      isAutoPlaying ? "bg-green-500 animate-pulse" : "bg-gray-400"
                    }`}></div>
                    <span className="hidden sm:inline">
                      {isAutoPlaying ? "Auto" : "Manual"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas de testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <TestimonialStat
            icon={Users}
            title="+15,000 usuarios"
            description="Han encontrado su profesional ideal"
            color="text-orange-600"
            bgColor="bg-orange-50"
            isVisible={isVisible}
            delay={200}
          />
          <TestimonialStat
            icon={Star}
            title="4.9⭐ promedio"
            description="Calificación de satisfacción"
            color="text-yellow-600"
            bgColor="bg-yellow-50"
            isVisible={isVisible}
            delay={400}
          />
          <TestimonialStat
            icon={TrendingUp}
            title="98% recomiendan"
            description="Nuestro servicio a otros"
            color="text-green-600"
            bgColor="bg-green-50"
            isVisible={isVisible}
            delay={600}
          />
        </div>

        {/* CTA final */}
        <div className="text-center">
          <div className="inline-flex flex-col items-center gap-4 bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 shadow-2xl">
            <Sparkles className="w-8 h-8 text-orange-500 animate-pulse" />
            <h3 className="text-2xl font-bold text-gray-800">
              ¡Sé el próximo en tener una historia de éxito!
            </h3>
            <p className="text-gray-600 max-w-md">
              Uní a miles de argentinos que ya encontraron a sus profesionales
              ideales. Tu historia podría ser la siguiente.
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("buscar")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Empezar mi búsqueda ahora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente de estadísticas de testimonios
function TestimonialStat({ icon: Icon, title, description, color, bgColor, isVisible, delay }) {
  return (
    <div
      className={`
        ${bgColor} p-6 rounded-2xl border border-gray-200/50 text-center hover:shadow-lg transition-all duration-700 hover:scale-105 transform
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className={`w-12 h-12 ${color} mx-auto mb-4 bg-white rounded-xl flex items-center justify-center shadow-sm`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <h4 className={`text-2xl font-bold ${color} mb-2`}>{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

export default Testimonials;