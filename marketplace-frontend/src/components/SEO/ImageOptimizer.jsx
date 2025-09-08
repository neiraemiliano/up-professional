import { useState, useEffect, useRef } from 'react';

const ImageOptimizer = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder = 'blur',
  quality = 80,
  webp = true,
  sizes = '100vw',
  loading = 'lazy',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Generar placeholder base64 para evitar layout shift
  const generatePlaceholder = (w, h) => {
    const canvas = document.createElement('canvas');
    canvas.width = w || 10;
    canvas.height = h || 10;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
  };

  // Optimizar URL de imagen
  const optimizeImageUrl = (url, options = {}) => {
    if (!url) return '';
    
    // Si es una URL externa, devolverla tal como está
    if (url.startsWith('http') && !url.includes(window.location.hostname)) {
      return url;
    }

    // Construir parámetros de optimización
    const params = new URLSearchParams();
    
    if (options.width) params.append('w', options.width);
    if (options.height) params.append('h', options.height);
    if (options.quality) params.append('q', options.quality);
    if (options.format) params.append('f', options.format);
    
    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  };

  // Detectar soporte WebP
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
  };

  // Lazy loading con Intersection Observer
  useEffect(() => {
    if (priority) {
      // Cargar inmediatamente si es prioritaria
      loadImage();
      return;
    }

    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [src, priority]);

  const loadImage = () => {
    const format = webp && supportsWebP() ? 'webp' : undefined;
    const optimizedSrc = optimizeImageUrl(src, {
      width,
      height, 
      quality,
      format
    });
    
    setCurrentSrc(optimizedSrc);
  };

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    // Fallback a la imagen original si falla la optimizada
    if (currentSrc !== src) {
      setCurrentSrc(src);
      setHasError(false);
    }
    onError?.(e);
  };

  // Estilos para transición suave
  const imageStyles = {
    transition: 'opacity 0.3s ease',
    opacity: isLoaded ? 1 : 0,
    backgroundColor: placeholder === 'blur' ? '#f3f4f6' : 'transparent',
  };

  const placeholderSrc = generatePlaceholder(width, height);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <img
          src={placeholderSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
          aria-hidden="true"
        />
      )}
      
      {/* Imagen principal */}
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        sizes={sizes}
        style={imageStyles}
        onLoad={handleLoad}
        onError={handleError}
        className="w-full h-full object-cover"
        {...props}
      />
      
      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <span>Imagen no disponible</span>
        </div>
      )}
    </div>
  );
};

export default ImageOptimizer;