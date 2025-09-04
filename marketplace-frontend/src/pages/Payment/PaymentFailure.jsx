import React from 'react';
import { Link } from 'react-router';
import { XCircle, RefreshCw, ArrowLeft, HelpCircle, AlertTriangle } from 'lucide-react';

const PaymentFailure = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md text-center p-8">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Pago rechazado
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-8">
          No pudimos procesar tu pago. No te preocupes, no se realizó ningún cobro.
        </p>

        {/* Common Reasons */}
        <div className="bg-orange-50 rounded-lg p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Posibles causas
          </h3>
          
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>Fondos insuficientes en la tarjeta</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>Datos de la tarjeta incorrectos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>La tarjeta está vencida o bloqueada</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>Límite de compras excedido</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
              <span>Problema temporal con el banco</span>
            </li>
          </ul>
        </div>

        {/* What to do */}
        <div className="text-left mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">¿Qué puedes hacer?</h3>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
              <span>Verifica los datos de tu tarjeta</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
              <span>Asegúrate de tener fondos suficientes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
              <span>Contacta a tu banco si es necesario</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
              <span>Intenta nuevamente o usa otra tarjeta</span>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Intentar nuevamente
          </button>
          
          <Link
            to="/"
            className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver al inicio
          </Link>
        </div>

        {/* Support */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">¿Necesitas ayuda?</h4>
          </div>
          <p className="text-sm text-blue-700 mb-3">
            Nuestro equipo de soporte está aquí para ayudarte
          </p>
          <div className="flex gap-2 justify-center">
            <a
              href="mailto:soporte@homefixed.com"
              className="text-xs bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enviar email
            </a>
            <a
              href="https://wa.me/5491123456789"
              className="text-xs bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>

        {/* Security Note */}
        <p className="text-xs text-gray-500 mt-6">
          🔒 Tus datos están protegidos con encriptación SSL de 256 bits
        </p>
      </div>
    </div>
  );
};

export default PaymentFailure;