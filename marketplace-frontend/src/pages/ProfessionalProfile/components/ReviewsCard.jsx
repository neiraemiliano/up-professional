import { 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Award, 
  Users, 
  Filter,
  BarChart3,
  Heart,
  ThumbsUp,
  Calendar
} from "lucide-react";
import { useState } from "react";
import { getText } from "../../../config/texts/texts";
import { useModal } from "../../../hooks/useModal";
import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";

const ReviewsCard = (props) => {
  const { reviews = [] } = props;
  const { isOpen, openModal, closeModal } = useModal();
  const [filterRating, setFilterRating] = useState(0);
  const [sortBy, setSortBy] = useState('recent'); // recent, rating, helpful

  // Mock data - en producción vendría del backend
  const mockReviews = [
    {
      id: 1,
      user: { name: "María González", avatarUrl: null },
      rating: 5,
      comment: "Excelente trabajo! Carlos es muy profesional y puntual. Arregló mi instalación eléctrica perfectamente y me explicó todo el proceso. 100% recomendado.",
      date: "2024-01-15",
      helpful: 12,
      service: "Instalación eléctrica"
    },
    {
      id: 2,
      user: { name: "Roberto Martínez", avatarUrl: null },
      rating: 5,
      comment: "Increíble experiencia. Llegó a horario, trabajó muy prolijo y dejó todo impecable. Los precios son justos y la calidad es excelente.",
      date: "2024-01-10",
      helpful: 8,
      service: "Reparación de techos"
    },
    {
      id: 3,
      user: { name: "Ana López", avatarUrl: null },
      rating: 4,
      comment: "Muy buen profesional, resolvió el problema rápidamente. Solo demoró un poco más de lo estimado pero el resultado final fue excelente.",
      date: "2024-01-05",
      helpful: 5,
      service: "Plomería"
    },
    {
      id: 4,
      user: { name: "Diego Fernández", avatarUrl: null },
      rating: 5,
      comment: "Carlos superó mis expectativas. No solo hizo el trabajo sino que me dio consejos para mantener las instalaciones. Un verdadero experto!",
      date: "2023-12-20",
      helpful: 15,
      service: "Mantenimiento general"
    }
  ];

  const allReviews = [...mockReviews, ...reviews];
  
  // Calcular estadísticas
  const totalReviews = allReviews.length;
  const averageRating = totalReviews > 0 
    ? allReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews 
    : 0;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: allReviews.filter(r => r.rating === rating).length,
    percentage: totalReviews > 0 ? (allReviews.filter(r => r.rating === rating).length / totalReviews) * 100 : 0
  }));

  const filteredReviews = allReviews.filter(review => 
    filterRating === 0 || review.rating === filterRating
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'helpful':
        return (b.helpful || 0) - (a.helpful || 0);
      case 'recent':
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{getText("reviews")}</h3>
                <p className="text-gray-600">Opiniones de clientes reales</p>
              </div>
            </div>
          </div>

          {/* Rating Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-200">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= averageRating 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-gray-600 text-sm">
                  Basado en {totalReviews} reseñas
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-200">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-500" />
                Distribución de calificaciones
              </h4>
              <div className="space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm font-medium">{rating}</span>
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-400 to-red-400 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-xl text-center border border-green-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ThumbsUp className="w-4 h-4 text-green-600" />
                <span className="text-lg font-bold text-green-700">98%</span>
              </div>
              <span className="text-xs text-green-600 font-medium">Recomendado</span>
            </div>
            
            <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-xl text-center border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-lg font-bold text-blue-700">{totalReviews}</span>
              </div>
              <span className="text-xs text-blue-600 font-medium">Opiniones</span>
            </div>
            
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-xl text-center border border-purple-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-purple-600" />
                <span className="text-lg font-bold text-purple-700">4.9</span>
              </div>
              <span className="text-xs text-purple-600 font-medium">Satisfacción</span>
            </div>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Filter className="w-4 h-4" />
                Filtrar por:
              </span>
              {[0, 5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(rating)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                    filterRating === rating
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-orange-300'
                  }`}
                >
                  {rating === 0 ? 'Todas' : `${rating}★`}
                </button>
              ))}
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-200"
            >
              <option value="recent">Más recientes</option>
              <option value="rating">Mayor calificación</option>
              <option value="helpful">Más útiles</option>
            </select>
          </div>
        </div>

        {/* Reviews List */}
        <div className="p-6">
          {sortedReviews.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No hay reseñas que coincidan con el filtro seleccionado.</p>
            </div>
          ) : (
            <ReviewsList 
              reviews={sortedReviews}
              openModal={openModal}
            />
          )}
        </div>

        {/* Write Review CTA */}
        <div className="p-6 border-t bg-gradient-to-r from-orange-50 to-red-50">
          <div className="text-center">
            <h4 className="font-semibold text-gray-800 mb-2">¿Ya trabajaste con este profesional?</h4>
            <p className="text-gray-600 text-sm mb-4">
              Tu opinión ayuda a otros clientes a tomar mejores decisiones
            </p>
            <button
              onClick={openModal}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 mx-auto"
            >
              <Star className="w-5 h-5" />
              Escribir reseña
            </button>
          </div>
        </div>
      </div>

      <ReviewForm {...props} isOpen={isOpen} closeModal={closeModal} />
    </>
  );
};

export default ReviewsCard;