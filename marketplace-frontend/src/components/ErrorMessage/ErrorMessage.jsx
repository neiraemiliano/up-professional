import { AlertCircle, Wifi, RefreshCw, Search } from "lucide-react";
import Button from "../template/ui/button/Button";

const ErrorMessage = ({ 
  type = "general",
  title,
  message,
  onRetry,
  actionLabel,
  onAction,
  className = ""
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case "network":
        return {
          icon: <Wifi className="w-12 h-12 text-red-500" />,
          title: title || "Error de conexión",
          message: message || "No se pudo conectar al servidor. Verifica tu conexión a internet.",
          actionLabel: actionLabel || "Reintentar",
          onAction: onRetry
        };
      
      case "no-results":
        return {
          icon: <Search className="w-12 h-12 text-gray-400" />,
          title: title || "Sin resultados",
          message: message || "No encontramos profesionales que coincidan con tu búsqueda.",
          actionLabel: actionLabel || "Cambiar filtros",
          onAction: onAction
        };
      
      case "loading-error":
        return {
          icon: <RefreshCw className="w-12 h-12 text-orange-500" />,
          title: title || "Error al cargar",
          message: message || "Hubo un problema al cargar la información. Intenta nuevamente.",
          actionLabel: actionLabel || "Reintentar",
          onAction: onRetry
        };
      
      default:
        return {
          icon: <AlertCircle className="w-12 h-12 text-red-500" />,
          title: title || "Algo salió mal",
          message: message || "Ocurrió un error inesperado. Por favor intenta nuevamente.",
          actionLabel: actionLabel || "Reintentar",
          onAction: onRetry
        };
    }
  };

  const config = getErrorConfig();

  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-4 ${className}`}>
      <div className="mb-4">
        {config.icon}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {config.title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {config.message}
      </p>
      
      {config.onAction && (
        <Button
          onClick={config.onAction}
          className="bg-violet-900 hover:bg-violet-800 text-white px-6 py-2"
        >
          {config.actionLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;