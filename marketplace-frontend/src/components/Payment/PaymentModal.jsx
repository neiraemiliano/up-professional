import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  X,
  Clock,
  Shield
} from 'lucide-react';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  paymentData, 
  type = 'subscription' // 'subscription' | 'service'
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const endpoint = type === 'subscription' 
        ? '/api/payments/subscription'
        : '/api/payments/service';

      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(paymentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar el pago');
      }

      // Redirect to MercadoPago
      if (data.data.initPoint) {
        window.open(data.data.initPoint, '_blank');
      }

    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const isSubscription = type === 'subscription';
  const title = isSubscription 
    ? `Pagar Suscripción - ${paymentData.planName}`
    : `Pagar Servicio - ${paymentData.serviceName}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Amount Display */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-8 h-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">
                ${paymentData.amount?.toLocaleString('es-AR')}
              </span>
            </div>
            <p className="text-gray-600">
              {isSubscription ? 'Mensual' : 'Pago único'}
            </p>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Detalles del pago</h3>
            
            {isSubscription && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">{paymentData.planName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duración:</span>
                  <span className="font-medium">1 mes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Renovación automática:</span>
                  <span className="font-medium text-green-600">Activada</span>
                </div>
              </div>
            )}

            {!isSubscription && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Servicio:</span>
                  <span className="font-medium">{paymentData.serviceName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Profesional:</span>
                  <span className="font-medium">{paymentData.professionalName}</span>
                </div>
                {paymentData.isAdvance && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tipo:</span>
                    <span className="font-medium text-orange-600">
                      Adelanto {Math.round(paymentData.advancePercentage * 100)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Security Info */}
          <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg mb-6">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-blue-900 text-sm">Pago seguro</h4>
              <p className="text-blue-700 text-sm mt-1">
                Procesado por MercadoPago con encriptación SSL de 256 bits
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 p-4 rounded-lg mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-900 text-sm">Error de pago</h4>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Procesando...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5" />
                <span>Pagar con MercadoPago</span>
              </div>
            )}
          </button>

          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-4">
            Al proceder, aceptas nuestros{' '}
            <a href="#" className="text-blue-600 hover:underline">
              términos y condiciones
            </a>{' '}
            y{' '}
            <a href="#" className="text-blue-600 hover:underline">
              política de privacidad
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;