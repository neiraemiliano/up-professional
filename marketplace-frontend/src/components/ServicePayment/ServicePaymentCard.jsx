import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  Clock,
  Shield,
  CheckCircle,
  AlertTriangle,
  Calculator
} from 'lucide-react';
import PaymentModal from '../Payment/PaymentModal';

const ServicePaymentCard = ({ 
  service, 
  professional, 
  bookingId,
  onPaymentSuccess 
}) => {
  const [selectedPaymentType, setSelectedPaymentType] = useState('advance'); // 'advance' | 'full'
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [advancePercentage] = useState(0.5); // 50% default

  const basePrice = service.price || 0;
  const advanceAmount = basePrice * advancePercentage;
  const remainingAmount = basePrice - advanceAmount;

  // Calculate estimated fees (5% platform fee + 3% processing fee)
  const calculateFees = (amount) => {
    const platformFee = amount * 0.05;
    const processingFee = amount * 0.029;
    return {
      platformFee: Math.round(platformFee),
      processingFee: Math.round(processingFee),
      total: Math.round(platformFee + processingFee)
    };
  };

  const advanceFees = calculateFees(advanceAmount);
  const fullFees = calculateFees(basePrice);

  const handlePayment = () => {
    const paymentData = {
      bookingId: bookingId,
      amount: selectedPaymentType === 'advance' ? advanceAmount : basePrice,
      isAdvance: selectedPaymentType === 'advance',
      advancePercentage: selectedPaymentType === 'advance' ? advancePercentage : null,
      serviceName: service.title,
      professionalName: `${professional.User?.name} ${professional.User?.lastName}`
    };

    setShowPaymentModal(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-full">
          <CreditCard className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Realizar pago</h3>
          <p className="text-gray-600 text-sm">Confirma tu reserva con el pago</p>
        </div>
      </div>

      {/* Service Info */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-gray-900 mb-2">{service.title}</h4>
        <p className="text-gray-600 text-sm mb-3">{service.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Precio del servicio:</span>
          <span className="font-bold text-lg text-gray-900">
            ${basePrice.toLocaleString('es-AR')}
          </span>
        </div>
      </div>

      {/* Payment Options */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-900">Opciones de pago</h4>
        
        {/* Advance Payment */}
        <div
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            selectedPaymentType === 'advance'
              ? 'border-orange-400 bg-orange-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setSelectedPaymentType('advance')}
        >
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full border-2 ${
              selectedPaymentType === 'advance'
                ? 'border-orange-500 bg-orange-500'
                : 'border-gray-300'
            }`}>
              {selectedPaymentType === 'advance' && (
                <div className="w-full h-full rounded-full bg-white scale-50"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">
                  Adelanto {Math.round(advancePercentage * 100)}%
                </span>
                <span className="font-bold text-orange-600">
                  ${advanceAmount.toLocaleString('es-AR')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Paga ahora ${advanceAmount.toLocaleString('es-AR')}, 
                el resto (${remainingAmount.toLocaleString('es-AR')}) al finalizar el servicio
              </p>
              <div className="flex items-center gap-1 mt-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-orange-600">Recomendado - Reserva garantizada</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Payment */}
        <div
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            selectedPaymentType === 'full'
              ? 'border-green-400 bg-green-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => setSelectedPaymentType('full')}
        >
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full border-2 ${
              selectedPaymentType === 'full'
                ? 'border-green-500 bg-green-500'
                : 'border-gray-300'
            }`}>
              {selectedPaymentType === 'full' && (
                <div className="w-full h-full rounded-full bg-white scale-50"></div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Pago completo</span>
                <span className="font-bold text-green-600">
                  ${basePrice.toLocaleString('es-AR')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Paga el monto total ahora y olvídate de pagos pendientes
              </p>
              <div className="flex items-center gap-1 mt-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600">Sin pagos pendientes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Calculator className="w-4 h-4 text-blue-600" />
          <h5 className="font-semibold text-blue-900 text-sm">Desglose del pago</h5>
        </div>
        
        {selectedPaymentType === 'advance' ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Adelanto ({Math.round(advancePercentage * 100)}%):</span>
              <span className="font-medium">${advanceAmount.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Comisión plataforma:</span>
              <span className="font-medium">${advanceFees.platformFee.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Procesamiento:</span>
              <span className="font-medium">${advanceFees.processingFee.toLocaleString('es-AR')}</span>
            </div>
            <div className="border-t border-blue-200 pt-2 flex justify-between font-semibold">
              <span className="text-blue-900">Total a pagar ahora:</span>
              <span className="text-blue-900">${advanceAmount.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-blue-600">Pendiente (sin comisiones):</span>
              <span className="text-blue-600">${remainingAmount.toLocaleString('es-AR')}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Servicio completo:</span>
              <span className="font-medium">${basePrice.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Comisión plataforma:</span>
              <span className="font-medium">${fullFees.platformFee.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Procesamiento:</span>
              <span className="font-medium">${fullFees.processingFee.toLocaleString('es-AR')}</span>
            </div>
            <div className="border-t border-blue-200 pt-2 flex justify-between font-semibold">
              <span className="text-blue-900">Total a pagar:</span>
              <span className="text-blue-900">${basePrice.toLocaleString('es-AR')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Security Info */}
      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg mb-6">
        <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Pago 100% seguro</p>
          <p className="text-xs text-gray-600">
            Procesado por MercadoPago con encriptación SSL
          </p>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
      >
        <CreditCard className="w-5 h-5" />
        <span>
          Pagar ${(selectedPaymentType === 'advance' ? advanceAmount : basePrice).toLocaleString('es-AR')}
        </span>
      </button>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center mt-4">
        Al realizar el pago aceptas nuestros{' '}
        <a href="#" className="text-orange-600 hover:underline">términos y condiciones</a>
        {' '}y confirmas la reserva del servicio
      </p>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          paymentData={{
            bookingId: bookingId,
            amount: selectedPaymentType === 'advance' ? advanceAmount : basePrice,
            isAdvance: selectedPaymentType === 'advance',
            advancePercentage: selectedPaymentType === 'advance' ? advancePercentage : null,
            serviceName: service.title,
            professionalName: `${professional.User?.name} ${professional.User?.lastName}`
          }}
          type="service"
        />
      )}
    </div>
  );
};

export default ServicePaymentCard;