import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state to show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Generate unique error ID for debugging
    const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorId: errorId
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error Boundary Caught Error [${errorId}]`);
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }

    // In production, you might want to send this to an error reporting service
    // Example: Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // reportErrorToService(error, errorInfo, errorId);
    }
  }

  handleRefresh = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, errorId: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI based on error boundary level
      const { level = 'component', fallback } = this.props;
      
      // Custom fallback provided by parent
      if (fallback) {
        return fallback;
      }

      // Different UI for different levels
      if (level === 'route') {
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Oops, algo salió mal
              </h1>
              
              <p className="text-gray-600 mb-6">
                Ha ocurrido un error inesperado en esta página. Puedes intentar recargar o volver al inicio.
              </p>

              {process.env.NODE_ENV === 'development' && (
                <div className="bg-gray-100 rounded p-3 mb-4 text-left">
                  <p className="text-xs text-gray-500 mb-2">Error ID: {this.state.errorId}</p>
                  <p className="text-xs font-mono text-red-600 break-all">
                    {this.state.error?.toString()}
                  </p>
                </div>
              )}
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={this.handleRefresh}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reintentar
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Ir al inicio
                </button>
              </div>
            </div>
          </div>
        );
      }

      // Component level error boundary (smaller fallback)
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-2">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800 mb-1">
                Error en el componente
              </h3>
              <p className="text-sm text-red-700 mb-3">
                Este componente no se pudo cargar correctamente.
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-white rounded border p-2 mb-3">
                  <p className="text-xs text-gray-500 mb-1">Error ID: {this.state.errorId}</p>
                  <p className="text-xs font-mono text-red-600 break-all">
                    {this.state.error?.toString()}
                  </p>
                </div>
              )}
              
              <button
                onClick={this.handleRefresh}
                className="inline-flex items-center gap-1 text-sm text-red-700 hover:text-red-800 underline"
              >
                <RefreshCw className="w-3 h-3" />
                Reintentar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;