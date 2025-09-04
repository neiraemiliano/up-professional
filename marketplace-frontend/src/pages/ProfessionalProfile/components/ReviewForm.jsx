import React, { useState, useContext, useEffect } from "react";
import { 
  Star, 
  User, 
  MessageSquare, 
  Send, 
  X, 
  Award,
  CheckCircle,
  AlertCircle,
  Heart,
  ThumbsUp,
  Camera,
  Sparkles,
  LogIn
} from "lucide-react";
import { useCreateReview } from "../../../hooks/api/reviews";
import { Modal } from "../../../components/template/ui/modal";
import Button from "../../../components/template/ui/button/Button";
import { getText } from "../../../config/texts/texts";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router";

const ratingLabels = {
  1: { text: "Muy malo", color: "text-red-600", emoji: "😞" },
  2: { text: "Malo", color: "text-orange-600", emoji: "😕" },
  3: { text: "Regular", color: "text-yellow-600", emoji: "😐" },
  4: { text: "Bueno", color: "text-green-600", emoji: "😊" },
  5: { text: "Excelente", color: "text-green-700", emoji: "🤩" }
};

const reviewAspects = [
  { key: "punctuality", label: "Puntualidad", icon: "⏰" },
  { key: "quality", label: "Calidad del trabajo", icon: "⭐" },
  { key: "communication", label: "Comunicación", icon: "💬" },
  { key: "pricing", label: "Precio justo", icon: "💰" },
  { key: "cleanliness", label: "Limpieza", icon: "✨" },
  { key: "professionalism", label: "Profesionalismo", icon: "🎯" }
];

export default function ReviewForm({
  isOpen,
  closeModal,
  professionalId,
  reviews = [],
  professionalName = "este profesional"
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [aspectRatings, setAspectRatings] = useState({});
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [serviceDate, setServiceDate] = useState("");
  const [step, setStep] = useState(1); // 1: Rating, 2: Details, 3: Confirmation, 0: Auth Required

  const { user, initialized } = useContext(AuthContext);
  const navigate = useNavigate();
  const createReview = useCreateReview();

  // Check authentication when modal opens
  const checkAuthAndProceed = () => {
    if (!user) {
      setStep(0); // Auth required step
      return;
    }
    
    // If user is not a customer, show error
    if (user.role !== 'customer') {
      setStep(-1); // Invalid role step
      return;
    }
    
    setStep(1); // Normal flow
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) return;

    const reviewData = {
      professionalId,
      rating,
      comment,
      aspectRatings,
      isAnonymous,
      wouldRecommend,
      serviceDate
    };

    createReview.mutate(reviewData, {
      onSuccess: () => {
        setStep(3);
        setTimeout(() => {
          resetForm();
          closeModal();
        }, 2000);
      }
    });
  };

  const resetForm = () => {
    setRating(0);
    setComment("");
    setAspectRatings({});
    setIsAnonymous(false);
    setWouldRecommend(true);
    setServiceDate("");
    setStep(1);
    setHoveredRating(0);
  };

  const handleClose = () => {
    resetForm();
    closeModal();
  };

  const handleGoToLogin = () => {
    handleClose();
    navigate('/signin', { state: { returnTo: window.location.pathname } });
  };

  // Check auth when modal opens
  const handleModalOpen = () => {
    if (isOpen && initialized) {
      checkAuthAndProceed();
    }
  };

  // React to modal opening
  useEffect(() => {
    handleModalOpen();
  }, [isOpen, initialized, user]);

  const canProceedToStep2 = rating > 0;
  const canSubmit = rating > 0 && comment.trim().length >= 10;

  const currentRating = hoveredRating || rating;
  const ratingInfo = ratingLabels[currentRating];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl m-4">
      <div className="relative w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-2xl font-bold">Escribir reseña</h4>
                <p className="text-white/90">
                  Comparte tu experiencia con {professionalName}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress indicator - only show for normal review flow */}
          {step > 0 && (
            <div className="flex items-center gap-2 mt-4">
              {[1, 2, 3].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    step >= stepNum ? 'bg-white' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              
              <h5 className="text-2xl font-bold text-gray-800 mb-2">
                Inicia sesión para escribir tu reseña
              </h5>
              <p className="text-gray-600 mb-6">
                Solo los clientes registrados pueden publicar reseñas
              </p>

              <div className="flex gap-3 justify-center">
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  className="px-6 py-3"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleGoToLogin}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Iniciar sesión
                </Button>
              </div>
            </div>
          )}

          {step === -1 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              
              <h5 className="text-2xl font-bold text-gray-800 mb-2">
                Solo clientes pueden escribir reseñas
              </h5>
              <p className="text-gray-600 mb-6">
                Las reseñas solo pueden ser escritas por clientes que han contratado servicios
              </p>

              <Button
                onClick={handleClose}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-bold transition-all duration-300"
              >
                Entendido
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              {/* Rating Selection */}
              <div className="text-center">
                <h5 className="text-xl font-bold text-gray-800 mb-2">
                  ¿Cómo calificarías el servicio?
                </h5>
                <p className="text-gray-600 mb-6">
                  Tu opinión nos ayuda a mejorar la plataforma
                </p>

                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-2 hover:scale-110 transition-transform duration-200"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        className={`w-12 h-12 ${
                          star <= currentRating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        } transition-colors duration-200`}
                      />
                    </button>
                  ))}
                </div>

                {/* Rating feedback */}
                {currentRating > 0 && ratingInfo && (
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="text-2xl">{ratingInfo.emoji}</span>
                    <span className={`text-lg font-semibold ${ratingInfo.color}`}>
                      {ratingInfo.text}
                    </span>
                  </div>
                )}

                {/* Service Date */}
                <div className="max-w-md mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ¿Cuándo recibiste el servicio? (opcional)
                  </label>
                  <input
                    type="date"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-colors"
                  />
                </div>
              </div>

              {/* Continue Button */}
              <div className="text-center">
                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                  className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                    canProceedToStep2
                      ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Continuar
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Summary */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                <div className="flex items-center justify-center gap-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-800">
                    {rating} estrella{rating > 1 ? 's' : ''} - {ratingLabels[rating]?.text}
                  </span>
                </div>
              </div>

              {/* Detailed Aspects (for ratings 4+) */}
              {rating >= 4 && (
                <div>
                  <h5 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-orange-500" />
                    ¿Qué aspectos destacarías?
                  </h5>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {reviewAspects.map((aspect) => (
                      <button
                        key={aspect.key}
                        type="button"
                        onClick={() => setAspectRatings(prev => ({
                          ...prev,
                          [aspect.key]: !prev[aspect.key]
                        }))}
                        className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${
                          aspectRatings[aspect.key]
                            ? 'bg-gradient-to-r from-orange-100 to-red-100 border-orange-300 text-orange-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-orange-200'
                        }`}
                      >
                        <span className="mr-2">{aspect.icon}</span>
                        {aspect.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuéntanos más sobre tu experiencia *
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 resize-none transition-colors"
                  placeholder="Describe tu experiencia: qué trabajo realizó, cómo fue el servicio, si lo recomendarías..."
                  required
                  minLength={10}
                />
                <div className="flex justify-between mt-2">
                  <span className={`text-xs ${comment.length >= 10 ? 'text-green-600' : 'text-gray-500'}`}>
                    Mínimo 10 caracteres
                  </span>
                  <span className="text-xs text-gray-500">
                    {comment.length}/500
                  </span>
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-800">
                      ¿Recomendarías este profesional?
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setWouldRecommend(true)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        wouldRecommend
                          ? 'bg-green-500 text-white'
                          : 'bg-white text-gray-600 border border-gray-300'
                      }`}
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => setWouldRecommend(false)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        !wouldRecommend
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-600 border border-gray-300'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              {/* Anonymous Option */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-200"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  Publicar como anónimo
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  Volver
                </Button>
                <Button
                  type="submit"
                  disabled={!canSubmit || createReview.isLoading}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all duration-300 ${
                    canSubmit
                      ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {createReview.isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {getText("publish")}
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              
              <h5 className="text-2xl font-bold text-gray-800 mb-2">
                ¡Reseña publicada!
              </h5>
              <p className="text-gray-600 mb-6">
                Gracias por compartir tu experiencia. Tu opinión ayuda a otros clientes.
              </p>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium text-orange-700">
                    ¡Has ganado 50 puntos de reputación!
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Reviews Preview (Step 1 only) */}
        {step === 1 && reviews.length > 0 && (
          <div className="px-6 pb-6">
            <div className="border-t pt-6">
              <h5 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-500" />
                Reseñas recientes
              </h5>
              
              <div className="space-y-3 max-h-32 overflow-y-auto">
                {reviews.slice(0, 2).map((review, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-800">
                          {review.user?.name || "Cliente verificado"}
                        </span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= (review.rating || 5)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {review.comment || "Excelente servicio, muy recomendable."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}