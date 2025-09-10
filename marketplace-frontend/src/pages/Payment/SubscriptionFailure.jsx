import React from 'react';
import { useNavigate } from 'react-router';
import { XCircle, ArrowLeft, CreditCard, RefreshCw } from 'lucide-react';

const SubscriptionFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Pago no Completado
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Tu pago no pudo ser procesado. No te preocupes, podés intentar nuevamente o continuar con el plan básico gratuito.
          </p>

          {/* Possible Reasons */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">Posibles causas:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Fondos insuficientes en la tarjeta</li>
              <li>• Datos de pago incorrectos</li>
              <li>• Problema con la entidad bancaria</li>
              <li>• Pago cancelado por el usuario</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/professional-dashboard')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Intentar Nuevamente
            </button>

            <button
              onClick={() => navigate('/professional-dashboard')}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Continuar con Plan Básico
            </button>
          </div>

          {/* Support */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              ¿Necesitás ayuda?{' '}
              <a 
                href="mailto:soporte@homefixed.com.ar" 
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Contactá soporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionFailure;