import React, { useState } from "react";
import { 
  Wrench, 
  DollarSign, 
  Clock, 
  Star, 
  CheckCircle, 
  Zap,
  Award,
  Shield,
  TrendingUp,
  Users,
  Calendar,
  MapPin
} from "lucide-react";
import { getText } from "../../../config/texts/texts";
import Carousel from "../../../components/Carousel/Carousel";

// Mock data mejorado para servicios
const mockServices = [
  {
    id: 1,
    category: { name: "Instalación Eléctrica", icon: "⚡" },
    description: "Instalación completa de circuitos eléctricos, tableros y sistemas de iluminación para hogares y oficinas.",
    basePrice: 2500,
    duration: "2-4 horas",
    rating: 4.9,
    completedJobs: 145,
    urgent: true,
    warranty: "12 meses",
    features: ["Materiales incluidos", "Garantía extendida", "Servicio urgente"],
    priceRange: "2500-8000"
  },
  {
    id: 2,
    category: { name: "Reparación de Aires", icon: "❄️" },
    description: "Servicio técnico especializado en aires acondicionados split y centrales. Reparación, mantenimiento y limpieza.",
    basePrice: 1800,
    duration: "1-3 horas",
    rating: 4.8,
    completedJobs: 89,
    urgent: true,
    warranty: "6 meses",
    features: ["Diagnóstico gratis", "Gas incluido", "Garantía por escrito"],
    priceRange: "1800-4500"
  },
  {
    id: 3,
    category: { name: "Plomería General", icon: "🔧" },
    description: "Servicios completos de plomería: destapes, reparaciones, instalación de grifería y artefactos sanitarios.",
    basePrice: 2000,
    duration: "1-2 horas",
    rating: 4.9,
    completedJobs: 203,
    urgent: true,
    warranty: "12 meses",
    features: ["Presupuesto gratis", "Trabajo garantizado", "Disponible 24/7"],
    priceRange: "2000-6000"
  },
  {
    id: 4,
    category: { name: "Carpintería Fina", icon: "🪚" },
    description: "Trabajos de carpintería, muebles a medida, restauración y reparaciones de maderas finas.",
    basePrice: 3500,
    duration: "4-8 horas",
    rating: 5.0,
    completedJobs: 67,
    urgent: false,
    warranty: "24 meses",
    features: ["Diseño personalizado", "Maderas premium", "Acabado profesional"],
    priceRange: "3500-12000"
  }
];

const ServicesCard = ({ services = [], professional }) => {
  const [selectedService, setSelectedService] = useState(null);
  
  // Mapear servicios reales del backend
  const mappedServices = services.map(service => ({
    id: service.id,
    category: { 
      name: service.Category?.name || "Servicio General", 
      icon: service.Category?.icon || "🔧" 
    },
    description: service.description || "Servicio profesional de calidad",
    basePrice: service.price,
    duration: service.estimatedTime || "2-4 horas",
    rating: professional?.avgRating || 4.5,
    completedJobs: Math.floor((professional?.completedJobs || 50) * 0.3), // Aproximadamente 30% por servicio
    urgent: service.isUrgentAvailable || false,
    warranty: "12 meses",
    features: service.includesMaterials 
      ? ["Materiales incluidos", "Garantía extendida", "Servicio profesional"]
      : ["Presupuesto gratis", "Garantía extendida", "Servicio profesional"],
    priceRange: `${service.price}-${Math.round(service.price * 1.8)}`
  }));
  
  // Usar servicios reales o mock data como fallback
  const allServices = mappedServices.length > 0 ? mappedServices : mockServices;
  
  const totalServices = allServices.length;
  const avgRating = allServices.reduce((acc, s) => acc + (s.rating || 4.5), 0) / totalServices;
  const totalJobs = allServices.reduce((acc, s) => acc + (s.completedJobs || 50), 0);
  const urgentServices = allServices.filter(s => s.urgent).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{getText("service")}</h3>
              <p className="text-gray-600">Servicios especializados</p>
            </div>
          </div>
        </div>

        {/* Stats de servicios */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-3 text-center border border-orange-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Wrench className="w-4 h-4 text-orange-500" />
              <span className="text-lg font-bold text-gray-800">{totalServices}</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">Servicios</span>
          </div>
          
          <div className="bg-white rounded-xl p-3 text-center border border-green-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-lg font-bold text-gray-800">{avgRating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">Rating</span>
          </div>
          
          <div className="bg-white rounded-xl p-3 text-center border border-blue-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-lg font-bold text-gray-800">{totalJobs}</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">Trabajos</span>
          </div>
          
          <div className="bg-white rounded-xl p-3 text-center border border-red-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Zap className="w-4 h-4 text-red-500" />
              <span className="text-lg font-bold text-gray-800">{urgentServices}</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">Urgentes</span>
          </div>
        </div>
      </div>

      {/* Services Carousel */}
      <div className="p-6">
        <div className="mb-4">
          <h4 className="font-bold text-gray-800 mb-2">Servicios disponibles</h4>
          <p className="text-gray-600 text-sm">
            Todos los servicios incluyen garantía y materiales de calidad
          </p>
        </div>
        
        <Carousel className="gap-4">
          {allServices.map((service, index) => (
            <div
              key={service.id || index}
              onClick={() => setSelectedService(service)}
              className="snap-start shrink-0 basis-[90%] sm:basis-1/2 lg:basis-1/3 max-w-sm cursor-pointer group"
            >
              <div className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-orange-300 h-[380px] flex flex-col group-hover:bg-gradient-to-br group-hover:from-orange-50 group-hover:to-red-50">
                
                {/* Header con categoría */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{service.category?.icon || "🔧"}</div>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-800 text-lg">
                        {service.category?.name || "Servicio General"}
                      </h5>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-semibold text-gray-700">
                            {service.rating?.toFixed(1) || "4.8"}
                          </span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {service.completedJobs || 50} trabajos
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {service.urgent && (
                    <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      🚨 Urgente
                    </div>
                  )}
                </div>

                {/* Descripción */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                  {service.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {(service.features || ["Servicio garantizado", "Materiales incluidos", "Presupuesto gratis"]).slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Precio y duración */}
                <div className="border-t border-gray-200 pt-4 group-hover:border-orange-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs text-gray-500">Desde</span>
                      <div className="font-bold text-xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        ${service.basePrice || 2500}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-gray-600 mb-1">
                        <Clock className="w-3 h-3" />
                        <span className="text-xs">{service.duration || "2-4 hrs"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600 font-semibold">
                          {service.warranty || "6 meses"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* CTA */}
                  <div className="mt-3">
                    <div className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 px-4 rounded-xl text-center font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105">
                      💬 Solicitar presupuesto
                    </div>
                  </div>
                </div>

                {/* Hover effect indicator */}
                <div className="mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs text-orange-600 font-medium">
                    Clic para más detalles →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Footer con garantías */}
      <div className="p-6 border-t bg-gradient-to-r from-orange-50 to-red-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-800 text-sm">Garantía Total</div>
              <div className="text-gray-600 text-xs">En todos los servicios</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-800 text-sm">Certificado</div>
              <div className="text-gray-600 text-xs">Profesional matriculado</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-800 text-sm">Servicio Rápido</div>
              <div className="text-gray-600 text-xs">Respuesta en 30min</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de servicio detallado (placeholder) */}
      {selectedService && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedService(null)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{selectedService.category?.icon}</div>
              <h4 className="font-bold text-xl mb-2">{selectedService.category?.name}</h4>
              <p className="text-gray-600 mb-4">{selectedService.description}</p>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold">
                Desde ${selectedService.basePrice}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesCard;