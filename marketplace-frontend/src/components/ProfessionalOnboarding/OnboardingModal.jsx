import React, { useState } from 'react';
import { 
  User,
  MapPin,
  Shield,
  Briefcase,
  Camera,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Calendar,
  Award,
  CreditCard,
  X
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { professionalApi } from '../../api/professional';
import { paymentsApi } from '../../api/payments';
import SubscriptionPlans from '../SubscriptionPlans/SubscriptionPlans';

const OnboardingModal = ({ isOpen, onComplete, userData, fallbackMode = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info (required)
    description: '',
    experience: '',
    priceFrom: '',
    
    // Step 2: Location (required)
    city: '',
    province: '',
    postalCode: '',
    
    // Step 3: Optional details
    workingHours: '',
    emergencyService: false,
    supportsUrgent: false,
    insurance: '',
    languages: ['Español'],
    
    // Step 4: Subscription Plan
    selectedPlan: 'basic'
  });

  const totalSteps = 4;

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeProfessionalRegistration = useMutation({
    mutationFn: (data) => professionalApi.completeRegistration(data),
    onSuccess: () => {
      // Call the onComplete callback (which marks onboarding as complete in backend)
      onComplete();
    },
    onError: (error) => {
      console.error('Error completing professional registration:', error);
    }
  });

  const createPaymentPreference = useMutation({
    mutationFn: (data) => paymentsApi.createSubscriptionPreference(data),
    onSuccess: (response) => {
      // Redirect to MercadoPago
      if (response.init_point) {
        window.location.href = response.init_point;
      }
    },
    onError: (error) => {
      console.error('Error creating payment preference:', error);
    }
  });

  const handleSubmit = async () => {
    const { selectedPlan, ...restFormData } = formData;
    
    // If plan is basic (free), complete registration immediately
    if (selectedPlan === 'basic') {
      const professionalData = {
        userId: userData.id,
        ...restFormData,
        subscriptionPlan: selectedPlan,
        avgRating: 0,
        completedJobs: 0,
        respondsQuickly: false,
        isVerified: false,
        responseTime: null,
        satisfactionRate: 0
      };

      completeProfessionalRegistration.mutate(professionalData);
    } else {
      // For paid plans, first create the professional profile, then payment preference
      const professionalData = {
        userId: userData.id,
        ...restFormData,
        subscriptionPlan: selectedPlan,
        avgRating: 0,
        completedJobs: 0,
        respondsQuickly: false,
        isVerified: false,
        responseTime: null,
        satisfactionRate: 0
      };

      
      try {
        // First create the professional profile
        const professionalResponse = await professionalApi.completeRegistration(professionalData);
        
        if (professionalResponse.success && professionalResponse.data.id) {
          // Now create payment preference with the professionalId
          const paymentData = {
            professionalId: professionalResponse.data.id,
            planId: selectedPlan
          };
          
          createPaymentPreference.mutate(paymentData);
        } else {
          console.error('Failed to create professional profile:', professionalResponse);
        }
      } catch (error) {
        console.error('Error creating professional profile for paid plan:', error);
      }
    }
  };

  // Validation for required fields
  const isStep1Valid = formData.description && formData.experience && formData.priceFrom;
  const isStep2Valid = formData.city && formData.province;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header - No close button to prevent closing */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Completá tu perfil profesional!
            </h2>
            <p className="text-gray-600">
              Solo necesitamos algunos datos para que puedas empezar a recibir solicitudes
            </p>
            
            {fallbackMode && (
              <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Modo de recuperación activado. Algunos servicios pueden estar temporalmente no disponibles.
                </p>
              </div>
            )}
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto mt-6">
              <div className="flex justify-between mb-2">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i + 1}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      i + 1 <= currentStep
                        ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {i + 1 < currentStep ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                  </div>
                ))}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Información Básica</h3>
                <p className="text-gray-600">Contanos sobre tu experiencia profesional</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción Profesional *
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    placeholder="Ej: Electricista matriculado con 10 años de experiencia..."
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Años de Experiencia *
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                      value={formData.experience}
                      onChange={(e) => updateFormData('experience', e.target.value)}
                    >
                      <option value="">Selecciona años</option>
                      {Array.from({ length: 30 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1} año{i + 1 !== 1 ? 's' : ''}</option>
                      ))}
                      <option value="30+">Más de 30 años</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Precio Base por Hora *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-5 w-5 text-orange-500" />
                      <input
                        type="number"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                        placeholder="5000"
                        value={formData.priceFrom}
                        onChange={(e) => updateFormData('priceFrom', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <MapPin className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ubicación</h3>
                <p className="text-gray-600">¿Dónde trabajás?</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                      placeholder="Buenos Aires"
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Provincia *
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                      value={formData.province}
                      onChange={(e) => updateFormData('province', e.target.value)}
                    >
                      <option value="">Selecciona provincia</option>
                      <option value="Buenos Aires">Buenos Aires</option>
                      <option value="CABA">Ciudad Autónoma de Buenos Aires</option>
                      <option value="Córdoba">Córdoba</option>
                      <option value="Santa Fe">Santa Fe</option>
                      <option value="Mendoza">Mendoza</option>
                      <option value="Tucumán">Tucumán</option>
                      <option value="Entre Ríos">Entre Ríos</option>
                      <option value="Salta">Salta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    placeholder="1425"
                    value={formData.postalCode}
                    onChange={(e) => updateFormData('postalCode', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Optional Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Shield className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Detalles Adicionales</h3>
                <p className="text-gray-600">Información opcional que genera confianza</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Horarios de Trabajo
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    placeholder="Lun-Vie 8:00-18:00, Sáb 9:00-13:00"
                    value={formData.workingHours}
                    onChange={(e) => updateFormData('workingHours', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Seguros y Coberturas
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    placeholder="Ej: ART cubierta hasta $2.000.000"
                    value={formData.insurance}
                    onChange={(e) => updateFormData('insurance', e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="emergencyService"
                      className="w-5 h-5 text-orange-500 rounded focus:ring-orange-400"
                      checked={formData.emergencyService}
                      onChange={(e) => updateFormData('emergencyService', e.target.checked)}
                    />
                    <label htmlFor="emergencyService" className="text-gray-700 font-medium">
                      Ofrezco servicio de emergencias 24hs
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="supportsUrgent"
                      className="w-5 h-5 text-orange-500 rounded focus:ring-orange-400"
                      checked={formData.supportsUrgent}
                      onChange={(e) => updateFormData('supportsUrgent', e.target.checked)}
                    />
                    <label htmlFor="supportsUrgent" className="text-gray-700 font-medium">
                      Acepto trabajos urgentes (mismo día)
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Subscription Plan */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Award className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Elegí tu Plan</h3>
                <p className="text-gray-600">Maximizá tus oportunidades de negocio</p>
              </div>

              <SubscriptionPlans 
                selectedPlan={formData.selectedPlan}
                onPlanSelect={(planId) => updateFormData('selectedPlan', planId)}
                showYearly={true}
              />

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>¡Podés cambiar tu plan en cualquier momento!</strong> Comenzá con el plan básico y actualizá cuando estés listo.
                </p>
              </div>

              {formData.selectedPlan !== 'basic' && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                  <p className="text-sm text-green-700">
                    <CreditCard className="w-4 h-4 inline mr-2" />
                    <strong>Siguiente:</strong> Serás redirigido a MercadoPago para completar el pago de forma segura.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Anterior
            </button>

            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                disabled={completeProfessionalRegistration.isPending || createPaymentPreference.isPending}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(completeProfessionalRegistration.isPending || createPaymentPreference.isPending) ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {formData.selectedPlan === 'basic' ? 'Completando...' : 'Procesando pago...'}
                  </>
                ) : (
                  <>
                    {formData.selectedPlan === 'basic' ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Completar Perfil
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Proceder al Pago
                      </>
                    )}
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={currentStep === 1 ? !isStep1Valid : currentStep === 2 ? !isStep2Valid : false}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;