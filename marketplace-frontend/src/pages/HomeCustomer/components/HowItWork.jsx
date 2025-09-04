import {
  CheckCircle,
  FileText,
  MessageCircle,
  Users,
  ArrowRight,
  Clock,
  Star,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
  Phone,
} from "lucide-react";
import { useState, useEffect } from "react";

const HowItWork = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Auto-avanzar pasos cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer para animaciones
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById("how-it-works");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      icon: FileText,
      title: "Describe tu problema",
      subtitle: "En segundos con voz o texto",
      description:
        "Contanos qué necesitás reparar o instalar. Mientras más detalles, mejores profesionales encontraremos.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      textColor: "text-blue-700",
      stats: "⚡ Promedio: 30 segundos",
      features: [
        "🎤 Búsqueda por voz",
        "📋 Formulario inteligente",
        "💡 Sugerencias automáticas",
      ],
    },
    {
      icon: Users,
      title: "Recibe propuestas",
      subtitle: "De profesionales verificados",
      description:
        "En menos de 2 horas recibirás múltiples presupuestos de profesionales cerca tuyo, todos verificados.",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50",
      textColor: "text-green-700",
      stats: "⏰ Promedio: 1.2 horas",
      features: [
        "✅ Profesionales verificados",
        "🏆 Top rated",
        "📍 Cerca de tu zona",
      ],
    },
    {
      icon: CheckCircle,
      title: "Compara y elige",
      subtitle: "El mejor precio y profesional",
      description:
        "Compará precios, reseñas, tiempos y perfiles. Elegí el que mejor se adapte a tu necesidad y presupuesto.",
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50",
      textColor: "text-orange-700",
      stats: "💰 Ahorro promedio: 25%",
      features: [
        "💵 Compara precios",
        "⭐ Lee reseñas reales",
        "⚖️ Decide informado",
      ],
    },
    {
      icon: Phone,
      title: "Contacta directo",
      subtitle: "WhatsApp al instante",
      description:
        "Conectate directamente por WhatsApp con el profesional elegido. Sin intermediarios, comunicación directa.",
      color: "from-emerald-500 to-green-500",
      bgColor: "from-emerald-50 to-green-50",
      textColor: "text-emerald-700",
      stats: "📱 95% usa WhatsApp",
      features: [
        "💬 Chat directo",
        "📞 Llamada inmediata",
        "🔄 Sin intermediarios",
      ],
    },
  ];

  return (
    <section
      className="relative py-24 bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden"
      id="how-it-works"
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/20 to-green-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header premium */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-orange-200">
            <Sparkles className="w-4 h-4" />
            <span>Proceso súper simple</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-violet-900 bg-clip-text text-transparent">
              ¿Cómo funciona
            </span>
            <br />
            <span className="text-gray-800">Home Fixed?</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Conectamos personas con los mejores profesionales de Argentina en
            <span className="font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded mx-2">
              4 pasos simples
            </span>
            que toman menos de 5 minutos.
          </p>

          {/* Indicadores de beneficios */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">100% gratis para ti</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">Sin intermediarios</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">Profesionales verificados</span>
            </div>
          </div>
        </div>

        {/* Steps mejorados */}
        <div className="relative">
          {/* Línea de conexión animada */}
          <div className="hidden lg:block absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl">
            <div className="relative h-2">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-green-200 via-orange-200 to-emerald-200 rounded-full opacity-30"></div>
              <div
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-1000"
                style={{ width: `${((activeStep + 1) / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Grid de pasos */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                step={step}
                stepNumber={index + 1}
                isActive={activeStep === index}
                isVisible={isVisible}
                onClick={() => setActiveStep(index)}
                delay={index * 200}
              />
            ))}
          </div>
        </div>

        {/* Sección de estadísticas */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard
            icon={Clock}
            title="2 horas promedio"
            description="Para recibir la primera propuesta"
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={Star}
            title="4.8★ calificación"
            description="Promedio de nuestros profesionales"
            color="text-yellow-600"
            bgColor="bg-yellow-50"
          />
          <StatCard
            icon={TrendingUp}
            title="25% de ahorro"
            description="Versus contratar directamente"
            color="text-green-600"
            bgColor="bg-green-50"
          />
        </div>

        {/* CTA final */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col items-center gap-4 bg-white/80 backdrop-blur-sm p-8 rounded-2xl border border-gray-200/50 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-800">
              ¿Listo para encontrar tu profesional ideal?
            </h3>
            <p className="text-gray-600 max-w-md">
              Más de 10,000 profesionales verificados te están esperando.
              ¡Empezá ahora!
            </p>
            <button
              onClick={() =>
                document
                  .getElementById("buscar")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              Buscar profesional ahora
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente Step Card mejorado
function StepCard({ step, stepNumber, isActive, isVisible, onClick, delay }) {
  return (
    <div
      className={`
        group cursor-pointer transition-all duration-700 transform
        ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
        ${isActive ? "scale-105" : "hover:scale-102"}
      `}
      style={{ transitionDelay: `${delay}ms` }}
      onClick={onClick}
    >
      <div
        className={`
        relative bg-gradient-to-br ${
          step.bgColor
        } p-8 rounded-2xl border-2 transition-all duration-300
        ${
          isActive
            ? "border-orange-300 shadow-2xl shadow-orange-500/20"
            : "border-gray-200/50 hover:border-gray-300 shadow-lg hover:shadow-xl"
        }
      `}
      >
        {/* Número del paso */}
        <div
          className={`
          absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg
          bg-gradient-to-r ${step.color}
          ${isActive ? "animate-pulse" : ""}
        `}
        >
          {stepNumber}
        </div>

        {/* Icono principal */}
        <div
          className={`
          w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300
          bg-gradient-to-br ${step.color}
          ${isActive ? "animate-bounce" : "group-hover:scale-110"}
        `}
        >
          <step.icon className="w-8 h-8 text-white" />
        </div>

        {/* Contenido */}
        <div className="text-center">
          <h3 className={`text-xl font-bold mb-2 ${step.textColor}`}>
            {step.title}
          </h3>
          <p
            className={`text-sm font-semibold mb-4 ${step.textColor} opacity-80`}
          >
            {step.subtitle}
          </p>
          <p className="text-gray-700 text-sm leading-relaxed mb-4">
            {step.description}
          </p>

          {/* Estadística destacada */}
          <div className="bg-white/70 backdrop-blur-sm rounded-lg px-3 py-2 mb-4 border border-gray-200">
            <span className="text-xs font-bold text-gray-800">
              {step.stats}
            </span>
          </div>

          {/* Features */}
          <div className="space-y-2">
            {step.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-xs text-gray-600"
              >
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Flecha de siguiente paso */}
          {stepNumber < 4 && (
            <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2">
              <ArrowRight
                className={`w-6 h-6 transition-colors duration-300 ${
                  isActive ? "text-orange-500 animate-pulse" : "text-gray-300"
                }`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente de estadísticas
function StatCard({ icon: Icon, title, description, color, bgColor }) {
  return (
    <div
      className={`
      ${bgColor} p-6 rounded-2xl border border-gray-200/50 text-center hover:shadow-lg transition-all duration-300 hover:scale-105
    `}
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

export default HowItWork;
