import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = "",
  showInfo = true,
  totalItems = 0,
  itemsPerPage = 12
}) => {
  // Generar array de páginas visibles
  const getVisiblePages = () => {
    const delta = 2; // Número de páginas a mostrar a cada lado de la página actual
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    // Remover duplicados
    return rangeWithDots.filter((item, index, arr) => 
      index === 0 || arr[index - 1] !== item
    );
  };

  const visiblePages = getVisiblePages();

  // Calcular información de elementos
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Información de resultados */}
      {showInfo && (
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          Mostrando <span className="font-semibold text-gray-900">{startItem}</span> al{' '}
          <span className="font-semibold text-gray-900">{endItem}</span> de{' '}
          <span className="font-semibold text-gray-900">{totalItems}</span> profesionales
        </div>
      )}

      {/* Controles de paginación */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* Botón anterior */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200
            ${currentPage === 1
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600'
            }
          `}
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Números de página */}
        <div className="flex items-center gap-1 mx-2">
          {visiblePages.map((page, index) => (
            page === '...' ? (
              <div 
                key={`dots-${index}`} 
                className="flex items-center justify-center w-10 h-10 text-gray-400"
              >
                <MoreHorizontal className="w-5 h-5" />
              </div>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`
                  flex items-center justify-center w-10 h-10 rounded-xl font-medium transition-all duration-200
                  ${currentPage === page
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'border border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600'
                  }
                `}
              >
                {page}
              </button>
            )
          ))}
        </div>

        {/* Botón siguiente */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200
            ${currentPage === totalPages
              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600'
            }
          `}
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;