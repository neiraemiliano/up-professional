import { Star, User, ThumbsUp, Calendar, Badge } from "lucide-react";
import Carousel from "../../../components/Carousel/Carousel";

export default function ReviewsList({ reviews = [], openModal }) {
  if (!reviews.length) {
    return (
      <div className="text-center py-8">
        <Star className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 text-lg font-medium">Aún no hay reseñas.</p>
        <p className="text-gray-400 text-sm">Sé el primero en compartir tu experiencia</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Carousel className="gap-4">
      {reviews.map((review, index) => (
        <div
          key={`${review.id}-${index}`}
          onClick={openModal}
          className="snap-start shrink-0 basis-[90%] sm:basis-1/2 lg:basis-1/3 max-w-sm cursor-pointer group"
        >
          <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-orange-300 h-[280px] flex flex-col group-hover:bg-gradient-to-br group-hover:from-orange-50 group-hover:to-red-50">
            {/* Header con usuario y rating */}
            <div className="flex items-start gap-4 mb-4">
              <div className="relative">
                {review.user?.avatarUrl ? (
                  <img
                    src={review.user.avatarUrl}
                    alt={review.user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-red-100 border-2 border-orange-200 flex items-center justify-center">
                    <User className="w-6 h-6 text-orange-600" />
                  </div>
                )}
                {/* Badge de cliente verificado */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 truncate">
                  {review.user?.name ?? "Cliente verificado"}
                </h4>
                
                {/* Rating con estrellas */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating 
                            ? "text-yellow-400 fill-yellow-400" 
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {review.rating}.0
                  </span>
                </div>

                {/* Fecha y servicio */}
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(review.date)}</span>
                  {review.service && (
                    <>
                      <span>•</span>
                      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                        {review.service}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Comentario */}
            <div className="flex-1 mb-4">
              <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                "{review.comment}"
              </p>
            </div>

            {/* Footer con utilidad */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 group-hover:border-orange-200">
              <div className="flex items-center gap-1 text-gray-500">
                <ThumbsUp className="w-4 h-4" />
                <span className="text-xs">
                  {review.helpful || 0} útil{(review.helpful || 0) !== 1 ? 'es' : ''}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Badge de review destacada */}
                {review.rating === 5 && (
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    ⭐ Destacada
                  </div>
                )}
                
                {/* Indicador de review reciente */}
                {new Date(review.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) && (
                  <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                    Reciente
                  </div>
                )}
              </div>
            </div>

            {/* Hover effect indicator */}
            <div className="mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-xs text-orange-600 font-medium">
                Clic para ver detalles →
              </span>
            </div>
          </div>
        </div>
      ))}
    </Carousel>
  );
}