import "react-photo-view/dist/react-photo-view.css";
import { 
  Image, 
  Camera, 
  Award, 
  Calendar, 
  MapPin, 
  Star, 
  Eye,
  ZoomIn,
  Grid3x3,
  Play,
  Badge,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import GalleryCarousel from "../../../components/GalleryCarousel/GalleryCarousel";
import ImageGallery from "../../../components/ImageGallery/ImageGallery";
import { getText } from "../../../config/texts/texts";

const portfolioImages = [
  {
    id: 1,
    url: "/images/grid-image/image-01.png",
    title: "Instalación eléctrica completa",
    description: "Trabajo de instalación eléctrica en departamento de 3 ambientes. Incluyó tablero principal y tomas.",
    category: "Electricidad",
    location: "Palermo, CABA",
    date: "2024-01-10",
    beforeAfter: true,
    featured: true,
    rating: 5
  },
  {
    id: 2,
    url: "/images/grid-image/image-02.png", 
    title: "Reparación de aire acondicionado",
    description: "Mantenimiento y limpieza de equipo split. Cliente muy satisfecho con el resultado.",
    category: "Climatización",
    location: "Villa Crespo, CABA",
    date: "2024-01-05",
    beforeAfter: false,
    featured: false,
    rating: 5
  },
  {
    id: 3,
    url: "/images/grid-image/image-03.png",
    title: "Cableado en cocina integral", 
    description: "Instalación de circuito dedicado para electrodomésticos de alta potencia.",
    category: "Electricidad",
    location: "Belgrano, CABA",
    date: "2023-12-20",
    beforeAfter: true,
    featured: true,
    rating: 5
  },
  {
    id: 4,
    url: "/images/grid-image/image-04.png",
    title: "Tablero eléctrico nuevo",
    description: "Reemplazo completo de tablero antiguo por uno moderno con térmicas.",
    category: "Electricidad",
    location: "San Telmo, CABA",
    date: "2023-12-15",
    beforeAfter: false,
    featured: false,
    rating: 5
  },
  {
    id: 5,
    url: "/images/grid-image/image-05.png",
    title: "Iluminación LED exterior",
    description: "Proyecto de iluminación para jardín y entrada principal.",
    category: "Iluminación",
    location: "Olivos, GBA Norte",
    date: "2023-12-01",
    beforeAfter: true,
    featured: true,
    rating: 5
  },
  {
    id: 6,
    url: "/images/grid-image/image-06.png",
    title: "Automatización hogar inteligente",
    description: "Instalación de sistema domótico con control remoto via app.",
    category: "Domótica",
    location: "Puerto Madero, CABA",
    date: "2023-11-20",
    beforeAfter: false,
    featured: true,
    rating: 5
  }
];

const PortfolioCard = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid, masonry

  const categories = ['all', ...new Set(portfolioImages.map(img => img.category))];
  
  const filteredImages = selectedCategory === 'all' 
    ? portfolioImages 
    : portfolioImages.filter(img => img.category === selectedCategory);

  const featuredImages = portfolioImages.filter(img => img.featured);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { 
      year: 'numeric', 
      month: 'short'
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-b p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{getText("portfolio")}</h3>
              <p className="text-gray-600">Galería de trabajos realizados</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-600 hover:bg-white'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats rápidas */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-3 text-center border border-orange-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Image className="w-4 h-4 text-orange-500" />
              <span className="text-lg font-bold text-gray-800">{portfolioImages.length}</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">Proyectos</span>
          </div>
          
          <div className="bg-white rounded-xl p-3 text-center border border-green-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Award className="w-4 h-4 text-green-500" />
              <span className="text-lg font-bold text-gray-800">{featuredImages.length}</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">Destacados</span>
          </div>
          
          <div className="bg-white rounded-xl p-3 text-center border border-blue-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-lg font-bold text-gray-800">5.0</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">Rating</span>
          </div>
          
          <div className="bg-white rounded-xl p-3 text-center border border-purple-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span className="text-lg font-bold text-gray-800">2024</span>
            </div>
            <span className="text-xs text-gray-600 font-medium">Activo</span>
          </div>
        </div>
      </div>

      {/* Filtros por categoría */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-gray-700 mr-2">Categorías:</span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-orange-300 hover:text-orange-600'
              }`}
            >
              {category === 'all' ? 'Todos' : category}
              <span className="ml-1 text-xs">
                ({category === 'all' ? portfolioImages.length : portfolioImages.filter(img => img.category === category).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Trabajos destacados */}
      {selectedCategory === 'all' && (
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-orange-500" />
            <h4 className="font-bold text-gray-800">Proyectos Destacados</h4>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              Premium
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredImages.slice(0, 3).map((image) => (
              <div key={image.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl">
                  <img 
                    src={image.url} 
                    alt={image.title}
                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Badges overlay */}
                  <div className="absolute top-2 left-2 flex gap-2">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      ⭐ Destacado
                    </div>
                    {image.beforeAfter && (
                      <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        Antes/Después
                      </div>
                    )}
                  </div>
                  
                  {/* Zoom icon */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 p-2 rounded-full">
                      <ZoomIn className="w-4 h-4 text-gray-700" />
                    </div>
                  </div>
                  
                  {/* Info overlay */}
                  <div className="absolute bottom-2 left-2 right-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h5 className="text-white font-semibold text-sm mb-1">{image.title}</h5>
                    <div className="flex items-center gap-2 text-white/80 text-xs">
                      <MapPin className="w-3 h-3" />
                      <span>{image.location}</span>
                      <span>•</span>
                      <span>{formatDate(image.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Galería principal */}
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-gray-800">
              {selectedCategory === 'all' ? 'Todos los trabajos' : `Trabajos de ${selectedCategory}`}
            </h4>
            <p className="text-gray-600 text-sm">
              {filteredImages.length} proyecto{filteredImages.length !== 1 ? 's' : ''} encontrado{filteredImages.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-1 text-gray-500 text-sm">
            <Eye className="w-4 h-4" />
            <span>Clic para ampliar</span>
          </div>
        </div>
        
        <ImageGallery images={filteredImages} />
      </div>

      {/* Footer con garantía y certificaciones */}
      <div className="p-6 border-t bg-gradient-to-r from-orange-50 to-red-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-800 text-sm">100% Garantizado</div>
              <div className="text-gray-600 text-xs">Todos los trabajos</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Camera className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-800 text-sm">Fotos reales</div>
              <div className="text-gray-600 text-xs">Sin filtros ni edición</div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Badge className="w-5 h-5" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-800 text-sm">Certificado</div>
              <div className="text-gray-600 text-xs">Profesional matriculado</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;