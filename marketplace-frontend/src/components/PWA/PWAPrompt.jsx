import { useState, useEffect } from 'react';
import { Download, Smartphone, X, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { usePWA, useInstallPWA, useIsMobile } from '../../hooks/usePWA';

const PWAPrompt = () => {
  const { isOffline, isUpdateAvailable, updatePWA } = usePWA();
  const { isInstallable, promptInstall } = useInstallPWA();
  const isMobile = useIsMobile();
  
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [showOfflineIndicator, setShowOfflineIndicator] = useState(false);

  useEffect(() => {
    // Show install prompt on mobile devices after 10 seconds if installable
    if (isMobile && isInstallable) {
      const timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isMobile, isInstallable]);

  useEffect(() => {
    if (isUpdateAvailable) {
      setShowUpdatePrompt(true);
    }
  }, [isUpdateAvailable]);

  useEffect(() => {
    if (isOffline) {
      setShowOfflineIndicator(true);
    } else {
      setShowOfflineIndicator(false);
    }
  }, [isOffline]);

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      setShowInstallPrompt(false);
    }
  };

  const handleUpdate = () => {
    updatePWA();
    setShowUpdatePrompt(false);
  };

  return (
    <>
      {/* Offline Indicator */}
      {showOfflineIndicator && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-slide-down">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">Sin conexión - Usando modo offline</span>
        </div>
      )}

      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-4 bg-white border-t border-gray-200 shadow-2xl transform transition-transform duration-300 animate-slide-up">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Instalar Home Fixed</h3>
                <p className="text-sm text-gray-600">Acceso rápido desde tu pantalla de inicio</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleInstall}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Instalar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Prompt */}
      {showUpdatePrompt && (
        <div className="fixed inset-x-0 top-0 z-50 p-4 bg-blue-500 text-white shadow-lg">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5" />
              <div>
                <h3 className="font-medium">Nueva versión disponible</h3>
                <p className="text-sm text-blue-100">Actualiza para obtener las mejoras</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUpdatePrompt(false)}
                className="p-1 text-blue-200 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={handleUpdate}
                className="bg-white text-blue-500 px-3 py-1 rounded font-medium hover:bg-blue-50 transition-colors"
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAPrompt;