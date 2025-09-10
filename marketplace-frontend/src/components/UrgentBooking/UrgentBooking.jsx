import { AlertTriangle, Clock, Zap, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "../atoms/Button/Button";
import Badge from "../Badge/Badge";

const UrgentBooking = ({ onClose, onConfirm, professional }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const urgentTimeframes = [
    { 
      value: "now", 
      label: "Ahora mismo", 
      description: "Disponible en 30-60 min",
      surcharge: "+100%",
      icon: "🚨"
    },
    { 
      value: "2hours", 
      label: "En 2 horas", 
      description: "Llegada estimada 2-3 horas",
      surcharge: "+75%",
      icon: "⚡"
    },
    { 
      value: "today", 
      label: "Hoy mismo", 
      description: "En algún momento de hoy",
      surcharge: "+50%",
      icon: "📅"
    },
    { 
      value: "tomorrow", 
      label: "Primera hora mañana", 
      description: "Entre 8-10 AM",
      surcharge: "+25%",
      icon: "🌅"
    }
  ];

  const handleConfirm = async () => {
    if (!selectedTimeframe) return;
    
    setIsSubmitting(true);
    
    // Simular llamada a API
    setTimeout(() => {
      onConfirm({
        timeframe: selectedTimeframe,
        isUrgent: true,
        professional: professional
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-red-100 bg-red-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900">
                  Servicio Urgente
                </h3>
                <p className="text-sm text-red-700">
                  Solicitud prioritaria
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-red-400 hover:text-red-600"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Professional info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={professional?.avatarUrl || "/images/user/user-01.jpg"}
              alt={professional?.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{professional?.name}</p>
              <div className="flex items-center gap-2">
                <Badge variant="available" size="xs">
                  Disponible para urgencias
                </Badge>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 mb-1">
                  Tarifas de emergencia
                </p>
                <p className="text-yellow-700">
                  Los servicios urgentes tienen un recargo adicional por disponibilidad inmediata y prioridad.
                </p>
              </div>
            </div>
          </div>

          {/* Timeframe selection */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              ¿Cuándo necesitas el servicio?
            </h4>
            <div className="space-y-2">
              {urgentTimeframes.map((timeframe) => (
                <label
                  key={timeframe.value}
                  className={`
                    flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all
                    ${selectedTimeframe === timeframe.value
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="timeframe"
                      value={timeframe.value}
                      checked={selectedTimeframe === timeframe.value}
                      onChange={(e) => setSelectedTimeframe(e.target.value)}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{timeframe.icon}</span>
                        <span className="font-medium">{timeframe.label}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {timeframe.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={timeframe.value === "now" ? "error" : "warning"}
                      size="xs"
                    >
                      {timeframe.surcharge}
                    </Badge>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-600" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">
                  Confirmación inmediata
                </p>
                <p className="text-blue-700">
                  Te contactaremos por WhatsApp en menos de 5 minutos para coordinar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedTimeframe || isSubmitting}
            className="flex-1 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Confirmando...
              </div>
            ) : (
              "Confirmar Urgencia"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UrgentBooking;