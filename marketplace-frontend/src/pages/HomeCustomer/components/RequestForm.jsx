import React, { useState, useEffect } from "react";
import {
  Send,
  MapPin,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Zap,
  Star,
  Users,
  TrendingUp,
  Shield,
  Timer,
  ArrowRight,
  Mic,
} from "lucide-react";
import VoiceInput from "../../../components/VoiceInput/VoiceInput";
import useGeolocation from "../../../hooks/useGeolocation";

const RequestForm = () => {
  const [formData, setFormData] = useState({
    description: "",
    location: "",
    contact: "",
    urgency: "normal",
    contactMethod: "whatsapp",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // Geolocation hook
  const {
    location,
    getCurrentLocation,
    isSupported: geoSupported,
  } = useGeolocation();

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

    const section = document.getElementById("presupuesto");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Auto-llenar ubicación cuando se obtiene geolocalización
  useEffect(() => {
    if (location && !formData.location) {
      setFormData((prev) => ({
        ...prev,
        location: "Ubicación actual detectada",
      }));
    }
  }, [location, formData.location]);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case "description":
        if (!value.trim()) {
          newErrors.description = "Describe qué necesitás";
        } else if (value.length < 10) {
          newErrors.description = "Añadí más detalles (mín. 10 caracteres)";
        } else {
          delete newErrors.description;
        }
        break;

      case "location":
        if (!value.trim()) {
          newErrors.location = "Indicá dónde necesitás el servicio";
        } else {
          delete newErrors.location;
        }
        break;

      case "contact":
        if (!value.trim()) {
          newErrors.contact = "Dejá tu contacto para recibir presupuestos";
        } else if (formData.contactMethod === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newErrors.contact = "Ingresá un email válido";
          } else {
            delete newErrors.contact;
          }
        } else if (formData.contactMethod === "whatsapp") {
          const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
          if (!phoneRegex.test(value)) {
            newErrors.contact = "Ingresá un número de WhatsApp válido";
          } else {
            delete newErrors.contact;
          }
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validación en tiempo real
    if (errors[name]) {
      setTimeout(() => validateField(name, value), 500);
    }
  };

  const handleVoiceInput = (transcript) => {
    setFormData((prev) => ({ ...prev, description: transcript }));
    validateField("description", transcript);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos
    const isValid = ["description", "location", "contact"].every((field) =>
      validateField(field, formData[field])
    );

    if (!isValid) return;

    setIsSubmitting(true);

    try {
      // Simular envío de formulario
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Analytics tracking
      if (window.gtag) {
        window.gtag("event", "request_quote", {
          urgency: formData.urgency,
          contact_method: formData.contactMethod,
          location: formData.location,
        });
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return <SuccessMessage />;
  }

  return (
    <section
      className="relative py-24 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 overflow-hidden"
      id="presupuesto"
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-orange-100/30 to-red-100/30 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Sección izquierda - Información y beneficios */}
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-8 opacity-0"
            }`}
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 border border-orange-200">
              <Timer className="w-4 h-4" />
              <span>Respuesta en 2 horas</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-700 bg-clip-text text-transparent">
                ¿Necesitás un presupuesto
              </span>
              <br />
              <span className="text-gray-800">súper rápido?</span>
            </h2>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Contanos qué necesitás y en menos de 2 horas recibirás
              <span className="font-bold text-orange-600">
                {" "}
                múltiples presupuestos
              </span>{" "}
              de profesionales verificados cerca tuyo.
            </p>

            {/* Beneficios destacados */}
            <div className="space-y-4 mb-8">
              <BenefitItem
                icon={Clock}
                text="Respuesta promedio en 43 minutos"
                color="text-blue-600"
              />
              <BenefitItem
                icon={Shield}
                text="Solo profesionales verificados"
                color="text-green-600"
              />
              <BenefitItem
                icon={TrendingUp}
                text="Ahorrás hasta 30% comparando precios"
                color="text-orange-600"
              />
              <BenefitItem
                icon={Users}
                text="Más de 10,000 profesionales disponibles"
                color="text-purple-600"
              />
            </div>

            {/* Estadísticas sociales */}
            <div className="grid grid-cols-2 gap-4 p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  95%
                </div>
                <div className="text-sm text-gray-600">Satisfacción</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  2.3k+
                </div>
                <div className="text-sm text-gray-600">Este mes</div>
              </div>
            </div>
          </div>

          {/* Sección derecha - Formulario */}
          <div
            className={`transition-all duration-700 delay-300 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-8 opacity-0"
            }`}
          >
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-gray-200/50">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Solicitar presupuestos gratis
                </h3>
                <p className="text-gray-600 text-sm">
                  Completá el formulario y recibí propuestas en minutos
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo descripción con voz */}
                <FormField
                  label="¿Qué necesitás?"
                  error={errors.description}
                  focused={focusedField === "description"}
                >
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("description")}
                      onBlur={() => setFocusedField("")}
                      placeholder="Ej: Necesito instalar un aire acondicionado split en una habitación de 4x3m..."
                      rows={4}
                      className="w-full pl-12 pr-16 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-200 resize-none text-gray-700 placeholder-gray-400"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-orange-50 rounded-full p-1 border border-orange-200">
                        <VoiceInput onTranscript={handleVoiceInput} />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>{formData.description.length} caracteres</span>
                    {formData.description.length > 20 && (
                      <span className="text-green-600 font-semibold">
                        ¡Perfecto nivel de detalle! 👍
                      </span>
                    )}
                  </div>
                </FormField>

                {/* Campo ubicación */}
                <FormField
                  label="¿Dónde?"
                  error={errors.location}
                  focused={focusedField === "location"}
                >
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("location")}
                      onBlur={() => setFocusedField("")}
                      placeholder="Ej: Palermo, CABA o Villa Carlos Paz, Córdoba"
                      className="w-full pl-12 pr-16 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
                    />
                    {geoSupported && (
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all duration-200"
                        title="Usar mi ubicación"
                      >
                        <MapPin className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </FormField>

                {/* Método de contacto */}
                <FormField
                  label="¿Cómo te contactamos?"
                  error={errors.contact}
                  focused={focusedField === "contact"}
                >
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            contactMethod: "whatsapp",
                            contact: "",
                          }))
                        }
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                          formData.contactMethod === "whatsapp"
                            ? "border-green-400 bg-green-50 text-green-700 shadow-sm"
                            : "border-gray-200 hover:border-green-200 text-gray-600"
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        <span className="font-semibold">WhatsApp</span>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            contactMethod: "email",
                            contact: "",
                          }))
                        }
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                          formData.contactMethod === "email"
                            ? "border-blue-400 bg-blue-50 text-blue-700 shadow-sm"
                            : "border-gray-200 hover:border-blue-200 text-gray-600"
                        }`}
                      >
                        <Mail className="w-4 h-4" />
                        <span className="font-semibold">Email</span>
                      </button>
                    </div>

                    <div className="relative">
                      {formData.contactMethod === "whatsapp" ? (
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      ) : (
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      )}
                      <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("contact")}
                        onBlur={() => setFocusedField("")}
                        placeholder={
                          formData.contactMethod === "whatsapp"
                            ? "Ej: +54 11 1234-5678"
                            : "Ej: tu@email.com"
                        }
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-gray-700 placeholder-gray-400"
                      />
                    </div>
                  </div>
                </FormField>

                {/* Nivel de urgencia */}
                <FormField label="¿Qué tan urgente es?">
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        value: "normal",
                        label: "Normal",
                        color: "blue",
                        emoji: "📅",
                      },
                      {
                        value: "urgent",
                        label: "Urgente",
                        color: "orange",
                        emoji: "⚡",
                      },
                      {
                        value: "emergency",
                        label: "Ya!",
                        color: "red",
                        emoji: "🚨",
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            urgency: option.value,
                          }))
                        }
                        className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                          formData.urgency === option.value
                            ? `border-${option.color}-400 bg-${option.color}-50 text-${option.color}-700 shadow-sm`
                            : "border-gray-200 hover:border-gray-300 text-gray-600"
                        }`}
                      >
                        <div className="text-lg mb-1">{option.emoji}</div>
                        <div className="text-sm font-semibold">
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </FormField>

                {/* Botón de envío */}
                <button
                  type="submit"
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full"></div>
                      Enviando solicitud...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Recibir presupuestos gratis
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {/* Disclaimer */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    🔒 Tu información está segura. Sin spam ni llamadas
                    molestas.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente de campo de formulario
function FormField({ label, error, focused, children }) {
  return (
    <div className="space-y-2">
      <label
        className={`block text-sm font-semibold transition-colors duration-200 ${
          focused ? "text-orange-600" : error ? "text-red-600" : "text-gray-700"
        }`}
      >
        {label}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// Componente de beneficio
function BenefitItem({ icon: Icon, text, color }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 ${color} bg-white rounded-lg flex items-center justify-center shadow-sm`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-gray-700 font-medium">{text}</span>
    </div>
  );
}

// Componente de mensaje de éxito
function SuccessMessage() {
  return (
    <section className="py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-gray-200/50">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            ¡Solicitud enviada con éxito!
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            Recibirás las primeras propuestas en tu
            <span className="font-bold text-green-600">
              {" "}
              WhatsApp/Email en menos de 2 horas
            </span>
            . Te contactaremos solo con profesionales verificados de tu zona.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <Timer className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-semibold text-green-700">Paso 1</div>
              <div className="text-xs text-gray-600">
                Revisando tu solicitud
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-semibold text-blue-700">Paso 2</div>
              <div className="text-xs text-gray-600">
                Contactando profesionales
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <Star className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <div className="text-sm font-semibold text-orange-700">
                Paso 3
              </div>
              <div className="text-xs text-gray-600">Recibirás propuestas</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-xl border border-green-200">
            <p className="text-sm text-green-800">
              <span className="font-semibold">💡 Mientras esperás:</span> Podés
              seguir explorando profesionales en nuestra plataforma para
              comparar perfiles y reseñas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RequestForm;
