import { useFormik } from "formik";
import {
  ArrowRight,
  Award,
  CheckCircle,
  Clock,
  Heart,
  Loader2,
  MapPin,
  MessageCircle,
  Navigation,
  PaintRoller,
  Search,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import SearchSuggestions from "../../../components/SearchSuggestions/SearchSuggestions";
import AutocompleteSelect from "../../../components/Select/AutocompleteSelect";
import TextArea from "../../../components/template/form/input/TextArea";
import Button from "../../../components/template/ui/button/Button";
import VoiceInput from "../../../components/VoiceInput/VoiceInput";
import {
  initialValues,
  validationSchema,
} from "../../../config/forms/searchProfessional";
import { getText } from "../../../config/texts/texts";
import { useCategories } from "../../../hooks/api/categories";
import { useFeatureFlags } from "../../../context/FeatureFlagsContext";
import { useLocations } from "../../../hooks/api/locations";
import useGeolocation from "../../../hooks/useGeolocation";

const FindProsessional = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [nearestLocation, setNearestLocation] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const { data: categories = [] } = useCategories();
  const { data: locations = [] } = useLocations();
  const { isFeatureEnabled } = useFeatureFlags();
  const {
    location,
    loading: geoLoading,
    error: geoError,
    getCurrentLocation,
    isSupported,
  } = useGeolocation();

  const optionsCategory = categories.map((category) => ({
    value: category.id,
    name: category.name,
  }));

  const optionsLocation = locations.map((location) => ({
    value: location.id,
    name: `${location.city}, ${location.province}, ${location.country}`,
  }));

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

    const section = document.getElementById("buscar");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  // Encontrar la ubicación más cercana cuando se obtiene geolocalización
  useEffect(() => {
    if (location && locations.length > 0) {
      // En una app real, las ubicaciones tendrían lat/lng
      // Por ahora simularemos encontrando Buenos Aires como más cercana
      const buenosAires =
        locations.find(
          (loc) =>
            loc.city.toLowerCase().includes("buenos aires") ||
            loc.city.toLowerCase().includes("capital")
        ) || locations[0];

      if (buenosAires) {
        setNearestLocation(buenosAires);
        formik.setFieldValue("location", buenosAires.id);
      }
    }
  }, [location, locations]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: ({ service, location, description }) => {
      const params = new URLSearchParams({
        service,
        loc: location,
        ...(description && { desc: description }),
      }).toString();
      navigate(`/search?${params}`);
    },
  });

  return (
    <section
      className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 py-24 overflow-hidden"
      id="buscar"
    >
      {/* Elementos decorativos de fondo premium */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-red-100/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-orange-100/20 to-red-100/20 rounded-full blur-3xl"></div>

        {/* Patrón de puntos sutil */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle, #f97316 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Hero Section Premium */}
        <div className="text-center mb-16">
          {/* Badge superior */}
          <div
            className={`inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 px-6 py-3 rounded-full text-sm font-bold mb-8 border border-orange-200 shadow-lg transform transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-4 opacity-0 scale-95"
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>{`Argentina's #1 Professional Marketplace`}</span>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          </div>

          {/* Título principal */}
          <h1
            className={`text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 leading-[1.1] transform transition-all duration-700 delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <span className="bg-gradient-to-r from-gray-900 via-orange-800 to-red-900 bg-clip-text text-transparent">
              Encontrá al profesional perfectasdaisds
            </span>
          </h1>

          {/* Subtítulo premium */}
          <p
            className={`max-w-4xl mx-auto text-xl sm:text-2xl text-gray-700 mb-12 leading-relaxed transform transition-all duration-700 delay-400 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            Conectamos hogares con profesionales verificados y confiables
          </p>

          {/* Indicadores de confianza premium */}
          <div
            className={`flex flex-wrap justify-center gap-4 sm:gap-6 mb-12 transform transition-all duration-700 delay-600 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="flex items-center gap-3 bg-green-50 text-green-700 px-5 py-3 rounded-xl text-sm font-bold border border-green-200 shadow-md hover:shadow-lg transition-all">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <Shield className="w-5 h-5" />
              <span>100% Verificados</span>
            </div>
            <div className="flex items-center gap-3 bg-orange-50 text-orange-700 px-5 py-3 rounded-xl text-sm font-bold border border-orange-200 shadow-md hover:shadow-lg transition-all">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <Clock className="w-5 h-5" />
              <span>Respuesta en 2hs</span>
            </div>
            <div className="flex items-center gap-3 bg-blue-50 text-blue-700 px-5 py-3 rounded-xl text-sm font-bold border border-blue-200 shadow-md hover:shadow-lg transition-all">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <TrendingUp className="w-5 h-5" />
              <span>Ahorrá hasta 30%</span>
            </div>
          </div>

          {/* Estadísticas destacadas */}
          <div
            className={`grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mb-16 transform transition-all duration-700 delay-800 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="text-center bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-orange-100 shadow-lg">
              <div className="text-3xl font-bold text-orange-600">+15K</div>
              <div className="text-sm text-gray-600 font-semibold">
                Clientes felices
              </div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-orange-100 shadow-lg">
              <div className="text-3xl font-bold text-orange-600">4.9⭐</div>
              <div className="text-sm text-gray-600 font-semibold">
                Calificación
              </div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-orange-100 shadow-lg">
              <div className="text-3xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-gray-600 font-semibold">
                Disponible
              </div>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-orange-100 shadow-lg">
              <div className="text-3xl font-bold text-orange-600">98%</div>
              <div className="text-sm text-gray-600 font-semibold">
                Recomiendan
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de búsqueda premium */}
        <div
          className={`max-w-5xl mx-auto transform transition-all duration-700 delay-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <form onSubmit={formik.handleSubmit} className="text-left">
            {/* Card principal del formulario */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/30 mb-8 relative overflow-hidden">
              {/* Elementos decorativos internos */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-orange-200/20 to-red-200/20 rounded-full blur-2xl"></div>

              {/* Header del formulario */}
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
                  <Search className="w-8 h-8 text-orange-600" />
                  ¡Empezá tu búsqueda ahora!
                </h2>
                <p className="text-gray-600 text-lg">
                  Completá los datos y recibí múltiples presupuestos en minutos
                </p>
              </div>

              {/* Campos principales */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="space-y-3">
                  <label className="text-lg font-bold text-gray-800 block flex items-center gap-2">
                    <PaintRoller className="w-5 h-5 text-orange-600" />
                    ¿Qué servicio necesitás?
                  </label>
                  <AutocompleteSelect
                    id="service"
                    name="service"
                    placeholder={getText("service")}
                    value={formik.values.service}
                    onChange={(opt) => {
                      formik.setFieldValue("service", opt?.value);
                      const categoryName =
                        optionsCategory.find((c) => c.value === opt?.value)
                          ?.name || "";
                      setSelectedCategory(categoryName);
                    }}
                    onBlur={formik.handleBlur}
                    className="w-full"
                    options={optionsCategory}
                    error={formik.touched.service}
                    hint={formik.touched.service && formik.errors.service}
                    leftIcon={PaintRoller}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-lg font-bold text-gray-800 block flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    ¿Dónde?
                  </label>
                  <div className="relative">
                    <AutocompleteSelect
                      id="location"
                      name="location"
                      placeholder={
                        nearestLocation
                          ? nearestLocation.city
                          : getText("selectLocation")
                      }
                      options={optionsLocation}
                      value={formik.values.location}
                      onChange={(opt) =>
                        formik.setFieldValue("location", opt.value)
                      }
                      error={formik.touched.location}
                      hint={formik.touched.location && formik.errors.location}
                      leftIcon={MapPin}
                      className="w-full pr-14"
                    />

                    {/* Botón de geolocalización premium */}
                    {isSupported && (
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        disabled={geoLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                        title="Usar mi ubicación actual"
                      >
                        {geoLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Navigation className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Mensajes de estado */}
                  {geoError && (
                    <div className="flex items-center gap-3 text-sm text-red-700 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                      <span className="text-lg">⚠️</span>
                      <span>{geoError}</span>
                    </div>
                  )}

                  {nearestLocation && location && (
                    <div className="flex items-center gap-3 text-sm text-green-700 bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                      <CheckCircle className="w-5 h-5" />
                      <span>Ubicación detectada: {nearestLocation.city}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sección de descripción premium */}
              <div className="space-y-6">
                <div className="text-center">
                  <label className="text-xl font-bold text-gray-800 block mb-3 flex items-center justify-center gap-3">
                    <MessageCircle className="w-6 h-6 text-orange-600" />
                    Contanos más sobre tu proyecto
                  </label>
                  <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                    Cuanto más detalles nos proporciones, mejores profesionales
                    podremos conectarte.
                    <span className="font-bold text-orange-700 bg-orange-100 px-3 py-1 rounded-full ml-2">
                      ¡Mejora tus resultados hasta un 70%!
                    </span>
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50/50 via-white to-red-50/50 p-8 rounded-2xl border-2 border-orange-200/50 shadow-inner relative">
                  {/* Tips premium */}
                  <div className="mb-6 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-orange-100 shadow-sm">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3">
                      <Award className="w-6 h-6 text-orange-600" />
                      Tips para una descripción perfecta:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-semibold text-green-800">
                            Problema específico
                          </div>
                          <div className="text-sm text-green-700">
                            ¿Qué necesitás exactamente?
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <div className="font-semibold text-blue-800">
                            Ubicación detallada
                          </div>
                          <div className="text-sm text-blue-700">
                            Dónde es el trabajo (cocina, baño, etc.)
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                        <div>
                          <div className="font-semibold text-orange-800">
                            Urgencia
                          </div>
                          <div className="text-sm text-orange-700">
                            ¿Cuándo lo necesitás?
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                          <div className="font-semibold text-purple-800">
                            Tamaño del trabajo
                          </div>
                          <div className="text-sm text-purple-700">
                            Dimensiones, cantidad, alcance
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <TextArea
                      placeholder="Ejemplo: 'Necesito un plomero urgente para la cocina. La canilla del fregadero perdió presión y gotea por abajo. Es una cocina integrada en un depto de 2 ambientes en Palermo. Quisiera que vengan mañana por la mañana si es posible. El edificio tiene portero las 24hs.'"
                      rows={6}
                      value={formik.values.description}
                      onChange={(value) =>
                        formik.setFieldValue("description", value)
                      }
                      className="bg-white/95 border-2 border-orange-200/50 focus:border-orange-400 focus:ring-4 focus:ring-orange-200/50 rounded-2xl resize-none shadow-sm text-gray-700 placeholder-gray-500 pb-24 pt-6 px-6 text-lg leading-relaxed"
                    />

                    {/* Separador elegante */}
                    <div className="absolute bottom-20 left-6 right-6 h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent"></div>

                    {/* Sección de input por voz premium - Feature Flag */}
                    {isFeatureEnabled("voice_input") && (
                      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-3">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 group relative z-10 hover:scale-110">
                          <div className="bg-white rounded-full p-2">
                            <VoiceInput
                              onTranscript={(transcript) => {
                                const currentValue = formik.values.description;
                                const newValue = currentValue
                                  ? `${currentValue} ${transcript}`
                                  : transcript;
                                formik.setFieldValue("description", newValue);
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-orange-700 font-bold bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-orange-200 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          Habla para describir tu problema
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Contador de caracteres y calidad */}
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                      <span className="text-sm text-gray-600 font-medium">
                        {formik.values.description?.length || 0} caracteres
                      </span>
                      {formik.values.description?.length > 100 && (
                        <span className="text-green-700 font-bold text-sm bg-green-100 px-3 py-1 rounded-full flex items-center gap-2">
                          <Star className="w-4 h-4" />
                          ¡Descripción excelente!
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full transition-colors ${
                          formik.values.description?.length > 30
                            ? "bg-green-400"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <div
                        className={`w-3 h-3 rounded-full transition-colors ${
                          formik.values.description?.length > 80
                            ? "bg-green-400"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <div
                        className={`w-3 h-3 rounded-full transition-colors ${
                          formik.values.description?.length > 150
                            ? "bg-green-400"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      <span className="text-sm text-gray-600 ml-2">
                        Calidad
                      </span>
                    </div>
                  </div>

                  {/* Sugerencias mejoradas */}
                  {selectedCategory && (
                    <div className="mt-8">
                      <div className="text-center mb-6">
                        <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                          <Sparkles className="w-5 h-5 text-orange-600" />
                          Sugerencias para {selectedCategory}:
                        </h4>
                        <p className="text-sm text-gray-600">
                          Hace clic en cualquier sugerencia para agregarla
                          automáticamente
                        </p>
                      </div>
                      <SearchSuggestions
                        category={selectedCategory}
                        onSelect={(suggestion) =>
                          formik.setFieldValue("description", suggestion)
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Botón de envío premium */}
            <div className="text-center space-y-6">
              <Button
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-16 py-6 rounded-2xl flex items-center gap-4 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/40 text-xl font-bold mx-auto border-2 border-orange-400/30 relative overflow-hidden group"
                startIcon={<Zap className="w-7 h-7" />}
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <span className="relative z-10">🔥 Buscar Profesionales</span>
                <ArrowRight className="w-7 h-7 relative z-10" />
              </Button>

              {/* Separador OR */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200"></div>
                </div>
                <div className="relative bg-white px-6 py-2 text-gray-500 font-bold text-lg border border-gray-200 rounded-full">
                  O
                </div>
              </div>

              {/* Botón AI Search Premium */}
              <button
                type="button"
                onClick={() => navigate("/ai-search")}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-16 py-6 rounded-2xl flex items-center gap-4 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/40 text-xl font-bold mx-auto border-2 border-blue-400/30 relative overflow-hidden group"
              >
                {/* Efecto de brillo */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <Sparkles className="w-7 h-7 relative z-10 animate-pulse" />
                <span className="relative z-10">
                  ✨ Búsqueda Inteligente con IA
                </span>
                <ArrowRight className="w-7 h-7 relative z-10" />
              </button>

              <p className="text-lg text-blue-700 font-semibold bg-blue-50 px-6 py-3 rounded-xl border border-blue-200 inline-block">
                🤖{" "}
                <span className="font-bold">
                  Usamos IA para mostrarte los profesionales que mejor se
                  adaptan a tus necesidades
                </span>
              </p>

              <div className="mt-6 space-y-3">
                <p className="text-lg text-gray-700 font-semibold">
                  ⚡{" "}
                  <span className="text-orange-600 font-bold">
                    Respuesta garantizada en menos de 2 horas
                  </span>{" "}
                  • 🔒 100% gratis y sin compromiso
                </p>

                {/* Indicador de actividad */}
                <div className="inline-flex items-center gap-3 bg-orange-50 text-orange-700 px-6 py-3 rounded-xl text-base font-bold border border-orange-200 shadow-md">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    <div
                      className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                  <Users className="w-5 h-5" />
                  <span>+1,847 profesionales activos ahora en Argentina</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Propuestas de valor premium */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-6xl mx-auto transform transition-all duration-700 delay-1200 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-red-50 backdrop-blur-sm rounded-3xl border-2 border-orange-200/50 hover:border-orange-300 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/20 hover:scale-105 group">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
              <Zap className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 mb-3 text-xl">
              Súper Rápido
            </h3>
            <p className="text-gray-700 font-semibold mb-4">
              Profesionales responden en{" "}
              <span className="text-orange-600 font-bold">
                menos de 2 horas
              </span>
            </p>
            <div className="text-sm text-orange-700 bg-orange-100 px-4 py-2 rounded-full inline-block font-bold">
              📈 Promedio real: 43 minutos
            </div>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm rounded-3xl border-2 border-green-200/50 hover:border-green-300 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20 hover:scale-105 group">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 mb-3 text-xl">
              100% Verificados
            </h3>
            <p className="text-gray-700 font-semibold mb-4">
              Profesionales con{" "}
              <span className="text-green-600 font-bold">
                documentos verificados
              </span>{" "}
              y seguros
            </p>
            <div className="text-sm text-green-700 bg-green-100 px-4 py-2 rounded-full inline-block font-bold">
              🛡️ Garantía total de calidad
            </div>
          </div>

          <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-cyan-50 backdrop-blur-sm rounded-3xl border-2 border-blue-200/50 hover:border-blue-300 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 group">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 mb-3 text-xl">
              Mejor Precio
            </h3>
            <p className="text-gray-700 font-semibold mb-4">
              Compará y ahorrá{" "}
              <span className="text-blue-600 font-bold">hasta 30%</span> vs.
              llamar directo
            </p>
            <div className="text-sm text-blue-700 bg-blue-100 px-4 py-2 rounded-full inline-block font-bold">
              💰 Ahorro promedio: $12,500
            </div>
          </div>
        </div>

        {/* Testimonios rápidos */}
        <div
          className={`mt-20 text-center transform transition-all duration-700 delay-1400 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-orange-100 shadow-xl max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-800">María G.</div>
                  <div className="text-sm text-gray-600">
                    {`"Increíble servicio"`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-800">Carlos M.</div>
                  <div className="text-sm text-gray-600">{`"Súper rápido"`}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-800">Ana R.</div>
                  <div className="text-sm text-gray-600">
                    {`"Lo recomiendo 100%"`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindProsessional;
