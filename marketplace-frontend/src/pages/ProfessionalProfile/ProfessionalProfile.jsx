import { useParams } from "react-router";
import { useState } from "react";
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  Flag, 
  Star,
  Shield,
  Award,
  TrendingUp,
  Users,
  MessageCircle,
  Phone,
  Calendar
} from "lucide-react";
import { getText } from "../../config/texts/texts";
import { useProfessional } from "../../hooks/api/professionals";
import useAuth from "../../hooks/context/useAuth";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import InfoCard from "./components/InfoCard";
import MetaCard from "./components/MetaCard";
import PortfolioCard from "./components/PortfolioCard";
import ReviewsCard from "./components/ReviewsCard";
import ServicesCard from "./components/ServicesCard";
import TitleCard from "./components/TitleCard";

const ProfessionalProfile = () => {
  const { id } = useParams();
  const { user = null } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isShared, setIsShared] = useState(false);

  const { data: professional, isLoading, error } = useProfessional(id);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // Aquí iría la lógica para guardar en favoritos
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `${professional?.name} - Home Fixed`,
        text: `Mira el perfil de ${professional?.name} en Home Fixed`,
        url: window.location.href
      });
    } catch (err) {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    const phone = "5491123456789";
    const message = encodeURIComponent(
      `¡Hola ${professional?.name}! 👋 Vi tu perfil en Home Fixed y me interesa contratar tus servicios. ¿Podrías ayudarme?`
    );
    const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleCall = () => {
    window.location.href = `tel:+5491123456789`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl animate-pulse mx-auto"></div>
          <p className="text-lg font-semibold text-gray-700">{getText("loading")}</p>
          <p className="text-sm text-gray-500">Cargando perfil del profesional...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorMessage
            type="loading-error"
            title="Error al cargar el profesional"
            message="No pudimos cargar la información del profesional. Verifica que el enlace sea correcto."
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorMessage
            type="no-results"
            title="Profesional no encontrado"
            message="No encontramos el profesional que buscas. Puede que haya sido eliminado o el enlace sea incorrecto."
            actionLabel="Ver profesionales"
            onAction={() => window.location.href = "/search"}
          />
        </div>
      </div>
    );
  }

  const enabledEdit = user?.id === id;

  const breadcrumbItems = [
    { label: "Buscar profesionales", href: "/search" },
    { label: professional?.name || "Profesional" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header fijo con navegación mejorada */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <Breadcrumbs items={breadcrumbItems} className="hidden md:block" />
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isFavorited 
                    ? 'bg-red-100 text-red-500 scale-110' 
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors relative"
              >
                <Share2 className="w-5 h-5" />
                {isShared && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                    ¡Copiado!
                  </div>
                )}
              </button>
              
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section con información clave */}
        <div className="mb-8">
          <TitleCard {...professional} enabledEdit={enabledEdit} />
        </div>

        {/* Layout principal con sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-8">
            <InfoCard {...professional} enabledEdit={enabledEdit} />
            <ServicesCard {...professional} enabledEdit={enabledEdit} />
            <PortfolioCard {...professional} enabledEdit={enabledEdit} />
            <ReviewsCard {...professional} enabledEdit={enabledEdit} />
          </div>

          {/* Sidebar con información de contacto */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Card de contacto premium */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                  <h3 className="text-lg font-bold mb-2">¿Listo para contratar?</h3>
                  <p className="text-white/90 text-sm">
                    Contactá ahora y recibí una respuesta rápida
                  </p>
                </div>
                
                <div className="p-6 space-y-4">
                  <button
                    onClick={handleWhatsApp}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </button>
                  
                  <button
                    onClick={handleCall}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Phone className="w-5 h-5" />
                    Llamar
                  </button>
                  
                  <button className="w-full bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-2 border-orange-300 hover:border-orange-400 py-4 px-6 rounded-xl flex items-center justify-center gap-3 font-bold transition-all duration-300 transform hover:scale-105">
                    <Calendar className="w-5 h-5" />
                    Agendar reunión
                  </button>
                </div>
              </div>

              {/* MetaCard rediseñada para sidebar */}
              <MetaCard {...professional} enabledEdit={enabledEdit} sidebar />

              {/* Trust indicators */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Verificación de confianza
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Identidad verificada</span>
                  </div>
                  <div className="flex items-center gap-3 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Referencias comprobadas</span>
                  </div>
                  <div className="flex items-center gap-3 text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">Seguros al día</span>
                  </div>
                  <div className="flex items-center gap-3 text-orange-600">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm font-medium">Respuesta rápida garantizada</span>
                  </div>
                </div>
              </div>

              {/* Stats premium */}
              <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-2xl p-6 shadow-lg">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Estadísticas destacadas
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">4.9</div>
                    <div className="text-xs text-white/80 flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Calificación
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">156</div>
                    <div className="text-xs text-white/80 flex items-center justify-center gap-1">
                      <Users className="w-3 h-3" />
                      Trabajos
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">98%</div>
                    <div className="text-xs text-white/80">Satisfacción</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">15min</div>
                    <div className="text-xs text-white/80">Respuesta</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;