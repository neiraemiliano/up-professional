import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { CheckCircle, Award, ArrowRight } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { paymentsApi } from '../../api/payments';
import useAuth from '../../hooks/context/useAuth';

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const paymentId = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const merchantOrder = searchParams.get('merchant_order_id');

  const processPayment = useMutation({
    mutationFn: (data) => paymentsApi.processSubscriptionSuccess(data),
    onSuccess: () => {
      // Payment processed successfully, redirect to dashboard
      setTimeout(() => {
        navigate('/professional-dashboard');
      }, 3000);
    },
    onError: (error) => {
      console.error('Error processing payment:', error);
    }
  });

  useEffect(() => {
    if (paymentId && status === 'approved' && user) {
      // Process the successful payment
      processPayment.mutate({
        paymentId,
        status,
        merchantOrder,
        userId: user.id
      });
    }
  }, [paymentId, status, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            ¡Pago Exitoso!
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Tu suscripción ha sido activada correctamente. Ya podés disfrutar de todos los beneficios de tu plan.
          </p>

          {/* Processing Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            {processPayment.isPending ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                <span className="text-blue-700">Procesando suscripción...</span>
              </div>
            ) : processPayment.isError ? (
              <div className="text-red-700">
                Error al procesar la suscripción. Contactá soporte.
              </div>
            ) : processPayment.isSuccess ? (
              <div className="flex items-center justify-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span>Suscripción activada correctamente</span>
              </div>
            ) : null}
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-800">Tu plan incluye:</span>
            </div>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Aparición prioritaria en búsquedas</li>
              <li>✓ Badge Premium visible</li>
              <li>✓ Estadísticas avanzadas</li>
              <li>✓ Soporte prioritario</li>
            </ul>
          </div>

          {/* Payment Details */}
          {paymentId && (
            <div className="text-xs text-gray-500 mb-6">
              ID de pago: {paymentId}
            </div>
          )}

          {/* CTA Button */}
          <button
            onClick={() => navigate('/professional-dashboard')}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          >
            Ir al Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Serás redirigido automáticamente en unos segundos...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;