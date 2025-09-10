import { 
  Star, 
  MapPin, 
  Shield, 
  Clock, 
  Zap, 
  MessageCircle, 
  AlertTriangle, 
  Award,
  Heart,
  Eye,
  Phone,
  Calendar,
  CheckCircle,
  TrendingUp,
  Users,
  Sparkles
} from "lucide-react";
import { Link } from "react-router";
import { useState, memo, useMemo, useCallback } from "react";
import Badge from "../../../components/Badge/Badge";
import UrgentBooking from "../../../components/UrgentBooking/UrgentBooking";
import SubscriptionBadge from "../../../components/SubscriptionBadge/SubscriptionBadge";

const ProfessionalCard = ({ professional }) => {
  // Memoizar cálculos costosos para evitar re-renders innecesarios
  const professionalStats = useMemo(() => ({
    isAvailableToday: professional?.emergencyService || false,
    isVerified: professional?.isVerified || false,
    respondsQuickly: professional?.respondsQuickly || false,
    completedJobs: professional?.completedJobs || 0,
    distance: professional?.distance ? professional.distance.toFixed(1) : 'N/A',
    supportsUrgent: professional?.supportsUrgent || false,
    isPopular: professional?.avgRating >= 4.8 && (professional?.completedJobs || 0) >= 50,
    responseTime: professional?.responseTime || 30
  }), [
    professional?.emergencyService,
    professional?.isVerified,
    professional?.respondsQuickly,
    professional?.completedJobs,
    professional?.distance,
    professional?.supportsUrgent,
    professional?.avgRating,
    professional?.responseTime
  ]);
  
  const [showUrgentModal, setShowUrgentModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // Memoizar handlers para evitar re-renders de componentes hijos
  const handleWhatsApp = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Use backend API to generate WhatsApp URL with real professional data
      const response = await fetch(`/api/professionals/${professional.id}/whatsapp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `¡Hola ${professional?.name}! 👋 Vi tu perfil en Home Fixed y me interesa contratar tus servicios. ¿Podrías ayudarme?`,
          isUrgent: false
        })
      });
      
      const data = await response.json();
      
      if (data.data?.whatsappURL) {
        window.open(data.data.whatsappURL, "_blank", "noopener,noreferrer");
      } else {
        // Fallback: show error message to user
        alert('Error: No se pudo generar el enlace de WhatsApp para este profesional.');
      }
    } catch (error) {
      console.error('Error generating WhatsApp URL:', error);
      alert('Error: No se pudo contactar al profesional por WhatsApp.');
    }
  }, [professional.id, professional?.name]);

  const handleCall = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `tel:+5491123456789`;
  }, []);

  const handleUrgent = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowUrgentModal(true);
  }, []);

  const handleFavorite = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(prev => !prev);
    // Aquí iría la lógica para guardar en favoritos
  }, []);

  const handleUrgentConfirm = useCallback((urgentData) => {
    setShowUrgentModal(false);
    alert(`¡Reserva urgente confirmada! Te contactaremos en 5 minutos por WhatsApp.`);
  }, []);

  return (
    <>
      <Link
        to={`/professionals/${professional?.id}`}
        className="block group focus:outline-none"
      >
        <article className={`relative bg-white rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-[600px] flex flex-col ${
          professional?.isFeatured 
            ? 'border-2 border-purple-300 shadow-purple-500/25 hover:shadow-purple-500/50 hover:shadow-2xl ring-2 ring-purple-200' 
            : professional?.isPriority 
            ? 'border-2 border-orange-300 shadow-orange-500/25 hover:shadow-orange-500/50 hover:shadow-2xl ring-1 ring-orange-200'
            : 'border-2 border-gray-200 hover:border-orange-300 group-focus:border-orange-400 group-focus:ring-4 group-focus:ring-orange-200'
        }`}>
          {/* Background Pattern - Diferente para cada tipo de plan */}
          <div className="absolute inset-0 opacity-5">
            {professional?.isFeatured ? (
              <>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full translate-y-12 -translate-x-12"></div>
                <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
              </>
            ) : professional?.isPriority ? (
              <>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500 to-red-500 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-400 to-yellow-400 rounded-full translate-y-12 -translate-x-12"></div>
              </>
            ) : (
              <>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-gray-300 to-gray-400 rounded-full translate-y-12 -translate-x-12"></div>
              </>
            )}
          </div>

          {/* Popular Badge */}
          {professionalStats.isPopular && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg z-10">
              <TrendingUp className="w-3 h-3" />
              Popular
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavorite}
            className={`absolute top-3 left-3 p-2 rounded-full transition-all duration-300 z-10 ${
              isFavorited 
                ? 'bg-red-100 text-red-500 scale-110' 
                : 'bg-white/80 text-gray-400 hover:bg-red-50 hover:text-red-500'
            } shadow-lg hover:shadow-xl`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          <header className="flex items-center gap-4 mb-4 relative z-10 mt-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 p-0.5">
                <img
                  src={professional?.User?.avatarUrl || "/images/user/user-01.jpg"}
                  alt={`${professional?.User?.name} ${professional?.User?.lastName}`}
                  className="w-full h-full rounded-2xl object-cover"
                />
              </div>
              
              {/* Status indicator */}
              {professionalStats.isAvailableToday && (
                <div className="absolute -bottom-1 -right-1">
                  <div className="w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 text-lg truncate">
                {professional?.User?.name} {professional?.User?.lastName}
              </h4>
              <p className="text-sm text-gray-600 flex items-center gap-1 mb-1">
                <MapPin className="w-4 h-4 text-orange-500" /> 
                {professional?.location?.city}, {professional?.location?.province} • {professionalStats.distance} km
              </p>
              {professionalStats.respondsQuickly && (
                <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Responde en ~{professionalStats.responseTime} min
                </p>
              )}
            </div>
          </header>

          {/* Trust indicators mejorados */}
          <div className="flex flex-wrap gap-2 mb-4 relative z-10">
            {/* Subscription Badge - mostrado primero para mayor visibilidad */}
            <SubscriptionBadge 
              plan={professional?.subscriptionPlan}
              isFeatured={professional?.isFeatured}
              isPriority={professional?.isPriority}
              size="sm"
            />
            
            {professionalStats.isVerified && (
              <div className="inline-flex items-center gap-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200">
                <Shield className="w-3 h-3" />
                Verificado
              </div>
            )}
            {professionalStats.isAvailableToday && (
              <div className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200">
                <Clock className="w-3 h-3" />
                Disponible hoy
              </div>
            )}
            {professionalStats.respondsQuickly && (
              <div className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold border border-orange-200">
                <Zap className="w-3 h-3" />
                Respuesta rápida
              </div>
            )}
          </div>

          {/* Description */}
          <div className="flex-1 mb-4 relative z-10">
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {professional?.bio || professional?.description || "Profesional experimentado con amplia trayectoria en el sector. Trabajos de calidad garantizada con materiales premium."}
            </p>
          </div>

          {/* Stats mejoradas */}
          <div className="grid grid-cols-2 gap-4 mb-4 relative z-10">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-xl border border-orange-200">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-gray-800">
                  {professional?.avgRating ? professional.avgRating.toFixed(1) : '0.0'}
                </span>
              </div>
              <span className="text-xs text-gray-600">{professionalStats.completedJobs} trabajos</span>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-green-500" />
                <span className="font-bold text-gray-800">
                  {professional?.satisfactionRate ? Math.round(professional.satisfactionRate) + '%' : '95%'}
                </span>
              </div>
              <span className="text-xs text-gray-600">Satisfacción</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <span className="text-xs text-gray-500">Desde</span>
              <div className="font-bold text-2xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                ${professional?.priceFrom ? professional.priceFrom.toLocaleString('es-AR') : '2.500'}/h
              </div>
            </div>
            <div className="text-right">
              {professionalStats.isPopular && (
                <>
                  <div className="text-xs text-gray-500 mb-1">⭐ Premium</div>
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-semibold text-orange-700">Top Rated</span>
                  </div>
                </>
              )}
              {professionalStats.isVerified && (
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-semibold text-green-700">Verificado</span>
                </div>
              )}
            </div>
          </div>

          {/* Botones de contacto mejorados */}
          <div className="grid grid-cols-2 gap-2 relative z-10">
            <button
              onClick={handleWhatsApp}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
            
            <button
              onClick={handleCall}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              <Phone className="w-4 h-4" />
              Llamar
            </button>
          </div>

          {/* Urgent service button */}
          {professionalStats.supportsUrgent && (
            <button
              onClick={handleUrgent}
              className="w-full mt-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 relative z-10 overflow-hidden"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <AlertTriangle className="w-4 h-4 relative z-10" />
              <span className="relative z-10">🚨 SERVICIO URGENTE</span>
              <Sparkles className="w-4 h-4 relative z-10" />
            </button>
          )}

          {/* View profile link */}
          <div className="mt-4 text-center relative z-10">
            <span className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 font-semibold text-sm transition-colors">
              <Eye className="w-4 h-4" />
              Ver perfil completo
            </span>
          </div>
        </article>
      </Link>
      
      {/* Modal de reserva urgente */}
      {showUrgentModal && (
        <UrgentBooking
          professional={professional}
          onClose={() => setShowUrgentModal(false)}
          onConfirm={handleUrgentConfirm}
        />
      )}
    </>
  );
};

export default memo(ProfessionalCard);

// Add display name for better debugging
ProfessionalCard.displayName = 'ProfessionalCard';