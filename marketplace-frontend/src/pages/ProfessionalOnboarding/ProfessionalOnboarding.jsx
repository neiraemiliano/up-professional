import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { 
  MapPin, 
  Building2, 
  Clock, 
  Briefcase, 
  Star, 
  Camera, 
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  Shield,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { professionalApi } from '../../api/professional';

const ProfessionalOnboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    description: '',
    experience: '',
    bio: '',
    
    // Step 2: Services & Pricing
    priceFrom: '',
    services: [],
    specialties: [],
    
    // Step 3: Location & Availability
    address: '',
    city: '',
    province: '',
    postalCode: '',
    workingHours: '',
    emergencyService: false,
    supportsUrgent: false,
    
    // Step 4: Professional Details
    insurance: '',
    certifications: [],
    languages: ['Español'],
    
    // Step 5: Portfolio
    portfolioImages: []
  });

  const totalSteps = 5;

  // Get user data from location state (passed after normal registration)
  const userData = location.state?.userData || null;

  useEffect(() => {
    if (!userData || userData.role !== 'professional') {
      navigate('/signup');
    }
  }, [userData, navigate]);

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
      navigate('/professional-dashboard', { replace: true });
    },
    onError: (error) => {
      console.error('Error completing professional registration:', error);
    }
  });

  const handleSubmit = () => {
    const { selectedPlan, ...restFormData } = formData;
    const professionalData = {
      userId: userData.id,
      ...restFormData,
      // Remove subscription plan from onboarding - handle separately
      avgRating: 0,
      completedJobs: 0,
      respondsQuickly: false,
      isVerified: false,
      responseTime: null,
      satisfactionRate: 0
    };

    completeProfessionalRegistration.mutate(professionalData);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">¡Bienvenido, {userData.name}!</h1>
              <p className="text-gray-600">Completemos tu perfil profesional</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
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

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-orange-100">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <User className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Información Básica</h2>
                <p className="text-gray-600">Contanos sobre tu experiencia profesional</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción Profesional *
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    placeholder="Ej: Electricista matriculado con 10 años de experiencia..."
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Años de Experiencia *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-orange-500" />
                      <select
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Biografía Profesional
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    placeholder="Contanos más sobre vos, tu trayectoria y lo que te hace único..."
                    value={formData.bio}
                    onChange={(e) => updateFormData('bio', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location & Availability */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <MapPin className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Ubicación y Disponibilidad</h2>
                <p className="text-gray-600">¿Dónde trabajás y cuándo estás disponible?</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <option value="Chaco">Chaco</option>
                      <option value="Corrientes">Corrientes</option>
                      <option value="Misiones">Misiones</option>
                      <option value="San Juan">San Juan</option>
                      <option value="Jujuy">Jujuy</option>
                      <option value="Río Negro">Río Negro</option>
                      <option value="Formosa">Formosa</option>
                      <option value="Chubut">Chubut</option>
                      <option value="San Luis">San Luis</option>
                      <option value="Catamarca">Catamarca</option>
                      <option value="La Rioja">La Rioja</option>
                      <option value="Santiago del Estero">Santiago del Estero</option>
                      <option value="Neuquén">Neuquén</option>
                      <option value="La Pampa">La Pampa</option>
                      <option value="Santa Cruz">Santa Cruz</option>
                      <option value="Tierra del Fuego">Tierra del Fuego</option>
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

                <div className="space-y-4">
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

          {/* Step 3: Professional Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Shield className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Detalles Profesionales</h2>
                <p className="text-gray-600">Información adicional que genera confianza</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Seguros y Coberturas
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
                    placeholder="Ej: ART cubierta hasta $2.000.000, Responsabilidad civil"
                    value={formData.insurance}
                    onChange={(e) => updateFormData('insurance', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Idiomas que hablás
                  </label>
                  <div className="space-y-2">
                    {['Español', 'Inglés', 'Portugués', 'Francés', 'Italiano'].map(lang => (
                      <label key={lang} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-orange-500 rounded focus:ring-orange-400"
                          checked={formData.languages.includes(lang)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateFormData('languages', [...formData.languages, lang]);
                            } else {
                              updateFormData('languages', formData.languages.filter(l => l !== lang));
                            }
                          }}
                        />
                        <span className="text-gray-700">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Services */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Briefcase className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Servicios</h2>
                <p className="text-gray-600">¿Qué servicios ofrecés? (Podrás agregar más después)</p>
              </div>

              <div className="space-y-6">
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg">
                  <p className="text-sm text-orange-700">
                    💡 <strong>Tip:</strong> Por ahora podés saltear este paso. Podrás configurar tus servicios detalladamente desde tu panel de control profesional.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Portfolio */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Camera className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Portfolio (Opcional)</h2>
                <p className="text-gray-600">Mostrá tu trabajo con fotos</p>
              </div>

              <div className="space-y-6">
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg">
                  <p className="text-sm text-orange-700">
                    📸 <strong>Tip:</strong> Podrás subir fotos de tus trabajos desde tu panel de control profesional. ¡No te preocupes si no tenés fotos ahora!
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Arrastra fotos aquí o</p>
                  <button className="text-orange-600 font-semibold hover:text-orange-700">
                    Elegir archivos
                  </button>
                </div>
              </div>
            </div>
          )}


          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
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
                disabled={completeProfessionalRegistration.isPending}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50"
              >
                {completeProfessionalRegistration.isPending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Finalizando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Completar Registro
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
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

export default ProfessionalOnboarding;