import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { CheckCircle, ArrowRight, Home, User, CreditCard, Calendar } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const type = searchParams.get('type'); // 'subscription' | 'service'
  const professionalId = searchParams.get('professionalId');
  const planId = searchParams.get('planId');
  const servicePaymentId = searchParams.get('servicePaymentId');

  useEffect(() => {
    // Here you could fetch additional payment confirmation data
    // For now, we'll use URL parameters
    setPaymentInfo({
      type,
      professionalId,
      planId,
      servicePaymentId
    });
    setLoading(false);
  }, [type, professionalId, planId, servicePaymentId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const isSubscription = type === 'subscription';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md text-center p-8">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Pago exitoso! 🎉
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-8">
          {isSubscription 
            ? 'Tu suscripción ha sido activada correctamente'
            : 'Tu pago por el servicio ha sido procesado'
          }
        </p>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            Detalles del pago
          </h3>
          
          {isSubscription ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium">Suscripción Premium</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duración:</span>
                <span className="font-medium">1 mes</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Próxima renovación:</span>
                <span className="font-medium">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Estado:</span>
                <span className="font-medium text-green-600">Activa</span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tipo:</span>
                <span className="font-medium">Pago de servicio</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Estado:</span>
                <span className="font-medium text-green-600">Confirmado</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-medium">
                  {new Date().toLocaleDateString('es-AR')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Benefits (for subscription) */}
        {isSubscription && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">
              ✨ Beneficios activados
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Apareces primero en búsquedas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Badge de suscriptor premium</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Hasta 50 contactos por mes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Estadísticas detalladas</span>
              </li>
            </ul>
          </div>
        )}

        {/* Next Steps */}
        <div className="text-left mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">¿Qué sigue?</h3>
          {isSubscription ? (
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="bg-orange-100 text-orange-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <span>Completa tu perfil profesional</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-orange-100 text-orange-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <span>Agrega tus servicios y portafolio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-orange-100 text-orange-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <span>¡Empieza a recibir clientes!</span>
              </li>
            </ol>
          ) : (
            <ol className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="bg-orange-100 text-orange-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <span>El profesional fue notificado del pago</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-orange-100 text-orange-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <span>Te contactará para coordinar el servicio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-orange-100 text-orange-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <span>Podrás calificar el servicio al finalizarlo</span>
              </li>
            </ol>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {isSubscription ? (
            <>
              <Link
                to="/professional/dashboard"
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <User className="w-5 h-5" />
                Ir a mi Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/"
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Volver al inicio
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/mis-reservas"
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Ver mis reservas
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/"
                className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Buscar más profesionales
              </Link>
            </>
          )}
        </div>

        {/* Support */}
        <p className="text-xs text-gray-500 mt-8">
          ¿Necesitas ayuda? Contacta nuestro{' '}
          <a href="#" className="text-orange-600 hover:underline">
            soporte al cliente
          </a>
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;