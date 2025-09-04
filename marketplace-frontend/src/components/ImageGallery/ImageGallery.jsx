import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

const ImageGallery = ({ images = [], className = "" }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock images para demo
  const mockImages = [
    { id: 1, url: "/images/cards/card-01.jpg", title: "Trabajo eléctrico completo", description: "Instalación de tablero eléctrico en casa familiar" },
    { id: 2, url: "/images/cards/card-02.jpg", title: "Reparación de aire acondicionado", description: "Mantenimiento y reparación de sistema split" },
    { id: 3, url: "/images/cards/card-03.jpg", title: "Instalación eléctrica nueva", description: "Cableado completo en departamento renovado" },
    { id: 4, url: "/images/user/user-01.jpg", title: "Proyecto finalizado", description: "Cliente satisfecho con el resultado" }
  ];

  const displayImages = images.length > 0 ? images : mockImages;

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImage(displayImages[index]);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? displayImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(displayImages[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex === displayImages.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedImage(displayImages[newIndex]);
  };

  if (displayImages.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <ZoomIn className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>Este profesional aún no ha subido trabajos a su portfolio</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Grid de imágenes */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {displayImages.map((image, index) => (
          <div
            key={image.id || index}
            className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.url}
              alt={image.title || `Trabajo ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            
            {/* Overlay con zoom */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>

            {/* Título en hover */}
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                <p className="text-white text-sm font-medium truncate">
                  {image.title}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          {/* Botón cerrar */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navegación */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 text-white hover:text-gray-300 z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-4 text-white hover:text-gray-300 z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Imagen principal */}
          <div className="max-w-4xl max-h-full flex flex-col items-center">
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-w-full max-h-[70vh] object-contain"
            />
            
            {/* Información de la imagen */}
            {(selectedImage.title || selectedImage.description) && (
              <div className="mt-4 text-center text-white max-w-2xl">
                {selectedImage.title && (
                  <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
                )}
                {selectedImage.description && (
                  <p className="text-gray-300">{selectedImage.description}</p>
                )}
              </div>
            )}

            {/* Indicador de página */}
            {displayImages.length > 1 && (
              <p className="text-white text-sm mt-4">
                {currentIndex + 1} de {displayImages.length}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;