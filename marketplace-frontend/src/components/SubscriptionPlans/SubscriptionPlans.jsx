import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Star, 
  Zap, 
  Check, 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Rocket,
  Users,
  BarChart3,
  PhoneCall,
  Award,
  Clock,
  ArrowRight
} from 'lucide-react';

const SubscriptionPlans = ({ selectedPlan, onPlanSelect, showYearly = false }) => {
  const [billingCycle, setBillingCycle] = useState(showYearly ? 'yearly' : 'monthly');
  
  const plans = [
    {
      id: 'basic',
      name: 'Plan Básico',
      description: 'Perfecto para empezar',
      monthlyPrice: 0,
      yearlyPrice: 0,
      badge: null,
      badgeColor: '',
      gradient: 'from-gray-400 to-gray-600',
      borderColor: 'border-gray-200',
      bgColor: 'bg-white',
      textColor: 'text-gray-700',
      popular: false,
      icon: Users,
      features: [
        'Perfil básico',
        'Hasta 5 contactos por mes',
        'Soporte por email',
        'Listado en búsquedas'
      ],
      limitations: [
        'Aparición estándar',
        'Sin estadísticas avanzadas',
        'Sin badges especiales'
      ]
    },
    {
      id: 'premium',
      name: 'Plan Premium',
      description: 'Ideal para profesionales establecidos',
      monthlyPrice: 15999,
      yearlyPrice: 159990,
      badge: 'MÁS POPULAR',
      badgeColor: 'bg-gradient-to-r from-orange-500 to-red-500',
      gradient: 'from-orange-500 to-red-600',
      borderColor: 'border-orange-300',
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
      textColor: 'text-orange-700',
      popular: true,
      icon: TrendingUp,
      features: [
        'Todo lo del Plan Gratuito',
        'Hasta 50 contactos por mes',
        'Aparición prioritaria en búsquedas',
        'Badge Premium visible',
        'Estadísticas avanzadas',
        'Soporte prioritario',
        'WhatsApp Business integration'
      ],
      limitations: []
    },
    {
      id: 'pro',
      name: 'Plan Profesional',
      description: 'La opción más completa',
      monthlyPrice: 29999,
      yearlyPrice: 299990,
      badge: 'MÁXIMO PODER',
      badgeColor: 'bg-gradient-to-r from-purple-600 to-pink-600',
      gradient: 'from-purple-600 to-pink-600',
      borderColor: 'border-purple-300',
      bgColor: 'bg-gradient-to-br from-purple-50 to-pink-50',
      textColor: 'text-purple-700',
      popular: false,
      icon: Crown,
      features: [
        'Todo lo del Plan Premium',
        'Contactos ILIMITADOS',
        'Destacado con badge especial',
        'Aparición en primera posición',
        'Perfil destacado visualmente',
        'Acceso a clientes premium',
        'Manager de cuenta dedicado',
        'Reportes detallados',
        'API access para integraciones'
      ],
      limitations: []
    }
  ];

  const formatPrice = (price) => {
    if (price === 0) return 'Gratis';
    return new Intl.NumberFormat('es-AR', { 
      style: 'currency', 
      currency: 'ARS',
      minimumFractionDigits: 0 
    }).format(price / 100);
  };

  const getDiscountPercentage = (monthly, yearly) => {
    if (monthly === 0) return 0;
    const monthlyTotal = monthly * 12;
    const savings = monthlyTotal - yearly;
    return Math.round((savings / monthlyTotal) * 100);
  };

  const PlanCard = ({ plan }) => {
    const isSelected = selectedPlan === plan.id;
    const currentPrice = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
    const discount = getDiscountPercentage(plan.monthlyPrice, plan.yearlyPrice);
    
    return (
      <div 
        onClick={() => onPlanSelect(plan.id)}
        className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
          isSelected 
            ? `ring-4 ring-orange-400 ${plan.bgColor} border-2 ${plan.borderColor} shadow-xl` 
            : `${plan.bgColor} border-2 ${plan.borderColor} hover:border-orange-300 shadow-lg hover:shadow-xl`
        }`}
      >
        {/* Popular Badge */}
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className={`${plan.badgeColor} text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg`}>
              {plan.badge}
            </div>
          </div>
        )}

        {/* Plan Header */}
        <div className="text-center mb-6">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}>
            <plan.icon className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
          <p className="text-gray-600 text-sm">{plan.description}</p>
        </div>

        {/* Pricing */}
        <div className="text-center mb-6">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-extrabold text-gray-900">
              {formatPrice(currentPrice)}
            </span>
            {plan.monthlyPrice > 0 && (
              <span className="text-gray-600 text-lg">
                /{billingCycle === 'yearly' ? 'año' : 'mes'}
              </span>
            )}
          </div>
          
          {billingCycle === 'yearly' && plan.monthlyPrice > 0 && discount > 0 && (
            <div className="mt-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                Ahorrás {discount}%
              </span>
              <p className="text-sm text-gray-500 mt-1">
                {formatPrice(plan.monthlyPrice)} por mes si pagas anual
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <Check className="w-3 h-3 text-green-600" />
              </div>
              <span className="text-gray-700 text-sm">{feature}</span>
            </div>
          ))}
          
          {plan.limitations.map((limitation, index) => (
            <div key={index} className="flex items-start gap-3 opacity-60">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              </div>
              <span className="text-gray-500 text-sm">{limitation}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            isSelected
              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
              : plan.id === 'basic'
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : `bg-gradient-to-r ${plan.gradient} text-white hover:shadow-lg`
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-5 h-5" />
              Seleccionado
            </>
          ) : plan.id === 'basic' ? (
            <>
              Comenzar Gratis
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              Elegir Plan
              <Sparkles className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Selected indicator */}
        {isSelected && (
          <div className="absolute inset-0 rounded-2xl bg-orange-400 opacity-10 pointer-events-none"></div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-xl p-1 flex">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all relative ${
              billingCycle === 'yearly'
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Anual
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
              -17%
            </span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>

      {/* Benefits Section */}
      <div className="mt-12 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            ¿Por qué elegir un plan pago?
          </h3>
          <p className="text-gray-600">
            Los profesionales con planes pagos reciben hasta 10x más contactos
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Más Visibilidad</h4>
            <p className="text-sm text-gray-600">Aparecés primero en todas las búsquedas</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Badge Premium</h4>
            <p className="text-sm text-gray-600">Los clientes confían más en profesionales verificados</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Estadísticas</h4>
            <p className="text-sm text-gray-600">Monitoreá tu performance y optimizá tu perfil</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">Soporte</h4>
            <p className="text-sm text-gray-600">Soporte prioritario cuando lo necesites</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;