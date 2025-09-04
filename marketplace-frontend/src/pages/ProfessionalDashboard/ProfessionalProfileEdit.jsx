import React, { useState } from 'react';
import useAuth from '../../hooks/context/useAuth';
import {
  User,
  Camera,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Clock,
  Star,
  Plus,
  X,
  Save,
  Upload,
  Edit,
  Award,
  Briefcase,
  Calendar,
  FileText
} from 'lucide-react';

const ProfessionalProfileEdit = () => {
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState({
    // Basic Info
    name: user?.name || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '+54 9 11 1234-5678',
    location: 'Buenos Aires, CABA',
    profession: 'Plomero Certificado',
    description: 'Profesional con más de 10 años de experiencia en plomería residencial y comercial. Especializado en instalaciones, reparaciones y mantenimiento.',
    
    // Professional Details
    experience: '10+',
    certifications: ['Gasista Matriculado', 'Plomero Certificado UOCRA'],
    services: ['Reparaciones', 'Instalaciones', 'Mantenimiento', 'Emergencias'],
    workingHours: {
      monday: { start: '08:00', end: '18:00', enabled: true },
      tuesday: { start: '08:00', end: '18:00', enabled: true },
      wednesday: { start: '08:00', end: '18:00', enabled: true },
      thursday: { start: '08:00', end: '18:00', enabled: true },
      friday: { start: '08:00', end: '18:00', enabled: true },
      saturday: { start: '09:00', end: '15:00', enabled: true },
      sunday: { start: '10:00', end: '14:00', enabled: false }
    },
    
    // Pricing
    basePrice: 2500,
    emergencyPrice: 3500,
    travelFee: 500,
    
    // Portfolio
    portfolio: [],
    profileImage: null,
    
    // Settings
    instantBooking: true,
    emergencyAvailable: true,
    travelRadius: 15
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [isUploading, setIsUploading] = useState(false);

  const days = [
    { key: 'monday', label: 'Lunes' },
    { key: 'tuesday', label: 'Martes' },
    { key: 'wednesday', label: 'Miércoles' },
    { key: 'thursday', label: 'Jueves' },
    { key: 'friday', label: 'Viernes' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWorkingHoursChange = (day, field, value) => {
    setProfileData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value
        }
      }
    }));
  };

  const addService = () => {
    const newService = prompt('Ingrese el nombre del servicio:');
    if (newService && newService.trim()) {
      setProfileData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
    }
  };

  const removeService = (index) => {
    setProfileData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const addCertification = () => {
    const newCert = prompt('Ingrese la certificación:');
    if (newCert && newCert.trim()) {
      setProfileData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCert.trim()]
      }));
    }
  };

  const removeCertification = (index) => {
    setProfileData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload - in real app, upload to server
      setTimeout(() => {
        const imageUrl = URL.createObjectURL(file);
        setProfileData(prev => ({
          ...prev,
          profileImage: imageUrl
        }));
        setIsUploading(false);
      }, 1500);
    }
  };

  const handleSave = async () => {
    // In real app, save to API
    console.log('Saving profile data:', profileData);
    alert('Perfil actualizado exitosamente!');
  };

  const TabButton = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
        activeTab === id
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Editar Perfil Profesional</h1>
            <p className="text-blue-100">
              Actualiza tu información para atraer más clientes
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Edit className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              <TabButton id="basic" label="Información Básica" icon={User} />
              <TabButton id="professional" label="Datos Profesionales" icon={Briefcase} />
              <TabButton id="schedule" label="Horarios" icon={Calendar} />
              <TabButton id="pricing" label="Precios" icon={DollarSign} />
              <TabButton id="portfolio" label="Portfolio" icon={Camera} />
              <TabButton id="settings" label="Configuración" icon={Edit} />
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Basic Information Tab */}
            {activeTab === 'basic' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Información Básica</h2>
                
                {/* Profile Image */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto de Perfil
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {profileData.profileImage ? (
                          <img 
                            src={profileData.profileImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="profile-image"
                      />
                      <label
                        htmlFor="profile-image"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Subir Foto
                      </label>
                      <p className="text-sm text-gray-500 mt-1">
                        JPG, PNG o GIF. Máximo 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basic Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profesión
                    </label>
                    <input
                      type="text"
                      value={profileData.profession}
                      onChange={(e) => handleInputChange('profession', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción Profesional
                  </label>
                  <textarea
                    value={profileData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe tu experiencia, especialidades y qué te diferencia de otros profesionales..."
                  />
                </div>
              </div>
            )}

            {/* Professional Information Tab */}
            {activeTab === 'professional' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Datos Profesionales</h2>
                
                <div className="space-y-6">
                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Años de Experiencia
                    </label>
                    <input
                      type="text"
                      value={profileData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ej: 10+"
                    />
                  </div>

                  {/* Services */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Servicios que Ofreces
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {profileData.services.map((service, index) => (
                        <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          {service}
                          <button
                            onClick={() => removeService(index)}
                            className="hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addService}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Agregar Servicio
                    </button>
                  </div>

                  {/* Certifications */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Certificaciones y Títulos
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {profileData.certifications.map((cert, index) => (
                        <div key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {cert}
                          <button
                            onClick={() => removeCertification(index)}
                            className="hover:bg-green-200 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addCertification}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Agregar Certificación
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Tab */}
            {activeTab === 'schedule' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Horarios de Trabajo</h2>
                
                <div className="space-y-4">
                  {days.map(day => (
                    <div key={day.key} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-20">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={profileData.workingHours[day.key].enabled}
                            onChange={(e) => handleWorkingHoursChange(day.key, 'enabled', e.target.checked)}
                            className="mr-2"
                          />
                          <span className="font-medium">{day.label}</span>
                        </label>
                      </div>
                      
                      {profileData.workingHours[day.key].enabled && (
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-sm text-gray-600">Desde</span>
                          <input
                            type="time"
                            value={profileData.workingHours[day.key].start}
                            onChange={(e) => handleWorkingHoursChange(day.key, 'start', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-600">hasta</span>
                          <input
                            type="time"
                            value={profileData.workingHours[day.key].end}
                            onChange={(e) => handleWorkingHoursChange(day.key, 'end', e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Tarifas y Precios</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio Base por Hora (ARS)
                    </label>
                    <input
                      type="number"
                      value={profileData.basePrice}
                      onChange={(e) => handleInputChange('basePrice', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio de Emergencia (ARS)
                    </label>
                    <input
                      type="number"
                      value={profileData.emergencyPrice}
                      onChange={(e) => handleInputChange('emergencyPrice', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Costo de Viaje (ARS)
                    </label>
                    <input
                      type="number"
                      value={profileData.travelFee}
                      onChange={(e) => handleInputChange('travelFee', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Radio de Viaje (km)
                    </label>
                    <input
                      type="number"
                      value={profileData.travelRadius}
                      onChange={(e) => handleInputChange('travelRadius', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Vista Previa de Precios</h3>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• Servicio regular: ${profileData.basePrice}/hora + ${profileData.travelFee} viaje</p>
                    <p>• Servicio de emergencia: ${profileData.emergencyPrice}/hora + ${profileData.travelFee} viaje</p>
                    <p>• Cobertura: {profileData.travelRadius}km de radio</p>
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio Tab */}
            {activeTab === 'portfolio' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Portfolio de Trabajos</h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sube fotos de tus trabajos</h3>
                  <p className="text-gray-600 mb-4">
                    Muestra tu calidad de trabajo para atraer más clientes
                  </p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Subir Fotos
                  </button>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración del Perfil</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Reservas Instantáneas</h3>
                      <p className="text-sm text-gray-600">Permite que los clientes te contraten automáticamente</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.instantBooking}
                      onChange={(e) => handleInputChange('instantBooking', e.target.checked)}
                      className="toggle-checkbox"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">Disponible para Emergencias</h3>
                      <p className="text-sm text-gray-600">Acepta trabajos fuera del horario normal</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={profileData.emergencyAvailable}
                      onChange={(e) => handleInputChange('emergencyAvailable', e.target.checked)}
                      className="toggle-checkbox"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="border-t border-gray-200 p-6">
              <button
                onClick={handleSave}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfileEdit;