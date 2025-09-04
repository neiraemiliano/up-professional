import { 
  Star, 
  DollarSign, 
  Shield, 
  Zap, 
  Clock, 
  Award, 
  MapPin, 
  Users, 
  X, 
  Filter,
  Calendar,
  TrendingUp,
  Heart,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import clsx from "clsx";
import { useState, useEffect } from "react";

interface Props {
  filters: {
    categoryId: string;
    locationId: string;
    description: string;
    minRating: number;
    maxPrice?: number | null;
    isVerified: boolean;
    isUrgent: boolean;
    respondsQuickly: boolean;
  };
  onChange: (f: Partial<Props["filters"]>) => void;
  className?: string;
  /** Si es mobile = aparece como sheet/drawer */
  mobile?: boolean;
}

const priceRanges = [
  { label: "Hasta $5,000", value: 5000, icon: "💰" },
  { label: "Hasta $10,000", value: 10000, icon: "💵" },
  { label: "Hasta $20,000", value: 20000, icon: "💸" },
  { label: "Hasta $50,000", value: 50000, icon: "🤑" },
  { label: "Sin límite", value: null, icon: "∞" }
];

const experienceRanges = [
  { label: "Cualquier experiencia", value: 0 },
  { label: "Mín. 1 año", value: 1 },
  { label: "Mín. 3 años", value: 3 },
  { label: "Mín. 5 años", value: 5 },
  { label: "Más de 10 años", value: 10 }
];

const availabilityOptions = [
  { key: "respondsQuickly", label: "Respuesta rápida", icon: Zap, color: "orange" },
  { key: "isUrgent", label: "Disponible urgente", icon: Clock, color: "red" },
  { key: "isVerified", label: "Solo verificados", icon: Shield, color: "green" }
];

export default function FilterSidebar({
  filters,
  onChange,
  className,
  mobile = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [customPrice, setCustomPrice] = useState(filters.maxPrice || "");

  // Contar filtros activos
  useEffect(() => {
    const count = Object.entries(filters).reduce((acc, [key, value]) => {
      if (key === 'categoryId' || key === 'locationId' || key === 'description') return acc;
      if (key === 'minRating' && value > 0) return acc + 1;
      if (key === 'maxPrice' && value) return acc + 1;
      if ((key === 'isVerified' || key === 'isUrgent' || key === 'respondsQuickly') && value) return acc + 1;
      return acc;
    }, 0);
    setActiveFilters(count);
  }, [filters]);

  const handleRatingChange = (rating: number) => {
    onChange({ minRating: rating === filters.minRating ? 0 : rating });
  };

  const handlePriceChange = (price: number | null) => {
    onChange({ maxPrice: price });
    setCustomPrice(price?.toString() || "");
  };

  const handleCustomPriceChange = (value: string) => {
    setCustomPrice(value);
    const numValue = parseInt(value) || null;
    onChange({ maxPrice: numValue });
  };

  const handleToggleChange = (key: keyof Props["filters"]) => {
    onChange({ [key]: !filters[key as keyof typeof filters] });
  };

  const handleClearAll = () => {
    onChange({
      minRating: 0,
      maxPrice: null,
      isVerified: false,
      isUrgent: false,
      respondsQuickly: false,
    });
    setCustomPrice("");
  };

  if (mobile) {
    return (
      <>
        {/* Mobile Filter Button */}
        <div className="fixed bottom-4 left-4 right-4 z-50 lg:hidden">
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 px-6 rounded-2xl shadow-2xl flex items-center justify-center gap-3 font-bold text-lg transform hover:scale-105 transition-all duration-300"
          >
            <Filter className="w-6 h-6" />
            Filtros
            {activeFilters > 0 && (
              <span className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold">
                {activeFilters}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Drawer */}
        {isOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Drawer */}
            <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 shadow-2xl transform transition-transform duration-300">
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-50 to-red-50">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Filtros</h3>
                    {activeFilters > 0 && (
                      <p className="text-sm text-orange-600 font-medium">
                        {activeFilters} filtro{activeFilters > 1 ? 's' : ''} activo{activeFilters > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  <FilterContent 
                    filters={filters} 
                    onRatingChange={handleRatingChange}
                    onPriceChange={handlePriceChange}
                    onCustomPriceChange={handleCustomPriceChange}
                    onToggleChange={handleToggleChange}
                    customPrice={customPrice}
                    compact
                  />
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 space-y-3">
                  <button
                    onClick={handleClearAll}
                    className="w-full py-3 px-4 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    Limpiar filtros
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-4 rounded-xl font-bold transition-all duration-300 shadow-lg"
                  >
                    Ver resultados
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop Sidebar
  return (
    <aside className={clsx(
      "bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Filter className="w-5 h-5 text-orange-500" />
              Filtros
            </h3>
            {activeFilters > 0 && (
              <p className="text-sm text-orange-600 font-medium mt-1">
                {activeFilters} filtro{activeFilters > 1 ? 's' : ''} activo{activeFilters > 1 ? 's' : ''}
              </p>
            )}
          </div>
          {activeFilters > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium hover:underline transition-colors"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8">
        <FilterContent 
          filters={filters} 
          onRatingChange={handleRatingChange}
          onPriceChange={handlePriceChange}
          onCustomPriceChange={handleCustomPriceChange}
          onToggleChange={handleToggleChange}
          customPrice={customPrice}
        />
      </div>
    </aside>
  );
}

// Componente separado para el contenido de los filtros
function FilterContent({ 
  filters, 
  onRatingChange, 
  onPriceChange, 
  onCustomPriceChange, 
  onToggleChange, 
  customPrice, 
  compact = false 
}: {
  filters: Props["filters"];
  onRatingChange: (rating: number) => void;
  onPriceChange: (price: number | null) => void;
  onCustomPriceChange: (value: string) => void;
  onToggleChange: (key: keyof Props["filters"]) => void;
  customPrice: string;
  compact?: boolean;
}) {
  return (
    <>
      {/* Rating Filter */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <h4 className="font-semibold text-gray-800">Calificación mínima</h4>
        </div>
        
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onRatingChange(rating)}
              className={clsx(
                "flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200",
                filters.minRating >= rating
                  ? "bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-300 text-orange-700"
                  : "hover:bg-gray-50 border-2 border-gray-200 text-gray-600"
              )}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={clsx(
                      "w-4 h-4",
                      i < rating 
                        ? "text-yellow-400 fill-yellow-400" 
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">
                {rating} estrella{rating > 1 ? 's' : ''} o más
              </span>
              {filters.minRating >= rating && (
                <CheckCircle className="w-4 h-4 text-orange-500 ml-auto" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-500" />
          <h4 className="font-semibold text-gray-800">Precio máximo</h4>
        </div>

        {/* Price ranges */}
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <button
              key={range.value || 'unlimited'}
              type="button"
              onClick={() => onPriceChange(range.value)}
              className={clsx(
                "flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200",
                filters.maxPrice === range.value
                  ? "bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300 text-green-700"
                  : "hover:bg-gray-50 border-2 border-gray-200 text-gray-600"
              )}
            >
              <span className="text-lg">{range.icon}</span>
              <span className="text-sm font-medium">{range.label}</span>
              {filters.maxPrice === range.value && (
                <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
              )}
            </button>
          ))}
        </div>

        {/* Custom price input */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            O ingresa un precio personalizado
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={customPrice}
              onChange={(e) => onCustomPriceChange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-400 focus:ring-2 focus:ring-orange-200 text-gray-700 placeholder-gray-400"
              placeholder="Ej: 15000"
              min="0"
              step="1000"
            />
          </div>
        </div>
      </div>

      {/* Availability and Quality Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-500" />
          <h4 className="font-semibold text-gray-800">Calidad y disponibilidad</h4>
        </div>

        <div className="space-y-3">
          {availabilityOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => onToggleChange(option.key as keyof Props["filters"])}
              className={clsx(
                "flex items-center gap-3 w-full p-4 rounded-xl transition-all duration-200 border-2",
                filters[option.key as keyof typeof filters]
                  ? `bg-gradient-to-r from-${option.color}-100 to-${option.color}-50 border-${option.color}-300 text-${option.color}-700`
                  : "hover:bg-gray-50 border-gray-200 text-gray-600"
              )}
            >
              <div className={clsx(
                "p-2 rounded-lg",
                filters[option.key as keyof typeof filters]
                  ? `bg-${option.color}-500 text-white`
                  : "bg-gray-100 text-gray-500"
              )}>
                <option.icon className="w-4 h-4" />
              </div>
              <div className="text-left flex-1">
                <span className="text-sm font-semibold">{option.label}</span>
                <p className="text-xs opacity-80 mt-1">
                  {option.key === 'respondsQuickly' && "Profesionales que responden en menos de 2 horas"}
                  {option.key === 'isUrgent' && "Disponibles para trabajos urgentes hoy mismo"}
                  {option.key === 'isVerified' && "Identidad y experiencia verificada por Home Fixed"}
                </p>
              </div>
              {filters[option.key as keyof typeof filters] && (
                <CheckCircle className={`w-5 h-5 text-${option.color}-500`} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Premium Badge */}
      {!compact && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5" />
            <span className="font-bold">Búsqueda Inteligente</span>
          </div>
          <p className="text-sm opacity-90">
            Usamos IA para mostrarte los profesionales que mejor se adaptan a tus necesidades.
          </p>
        </div>
      )}
    </>
  );
}