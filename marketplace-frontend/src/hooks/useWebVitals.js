import { useEffect } from 'react';

export const useWebVitals = (reportVitals = true) => {
  useEffect(() => {
    if (!reportVitals) return;

    // Función para reportar métricas
    const reportMetric = (metric) => {
      // En producción, enviar a Google Analytics o servicio de monitoring
      if (import.meta.env.MODE === 'production') {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
          gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.value),
            non_interaction: true
          });
        }

        // También puedes enviar a tu propio endpoint
        // fetch('/api/analytics/web-vitals', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(metric)
        // });
      }

      // En desarrollo, mostrar en consola
      if (import.meta.env.MODE === 'development') {
        console.group(`🔍 Web Vital: ${metric.name}`);
        console.log(`Value: ${metric.value}`);
        console.log(`Rating: ${metric.rating}`);
        console.log(`Delta: ${metric.delta}`);
        console.log(`ID: ${metric.id}`);
        console.groupEnd();
      }
    };

    // Importar dinámicamente web-vitals solo cuando sea necesario
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(reportMetric);  // Cumulative Layout Shift
      onFID(reportMetric);  // First Input Delay
      onFCP(reportMetric);  // First Contentful Paint
      onLCP(reportMetric);  // Largest Contentful Paint
      onTTFB(reportMetric); // Time to First Byte
    });
  }, [reportVitals]);

  // Funciones para optimizar manualmente
  const preloadResources = (resources) => {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as || 'fetch';
      if (resource.type) link.type = resource.type;
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
      document.head.appendChild(link);
    });
  };

  const prefetchResources = (resources) => {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });
  };

  // Optimizar LCP (Largest Contentful Paint)
  const optimizeLCP = () => {
    // Precargar recursos críticos
    preloadResources([
      { href: '/fonts/main.woff2', as: 'font', type: 'font/woff2', crossorigin: true },
      { href: '/api/categories', as: 'fetch' },
      { href: '/images/hero-banner.webp', as: 'image' }
    ]);

    // Lazy load de imágenes no críticas
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    }
  };

  // Optimizar CLS (Cumulative Layout Shift)
  const optimizeCLS = () => {
    // Reservar espacio para elementos dinámicos
    const dynamicElements = document.querySelectorAll('[data-dynamic]');
    dynamicElements.forEach(element => {
      if (!element.style.minHeight && element.dataset.minHeight) {
        element.style.minHeight = element.dataset.minHeight;
      }
    });

    // Precargar fuentes críticas
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.href = '/fonts/main.woff2';
    fontPreload.as = 'font';
    fontPreload.type = 'font/woff2';
    fontPreload.crossOrigin = '';
    document.head.appendChild(fontPreload);
  };

  // Optimizar FID (First Input Delay)
  const optimizeFID = () => {
    // Diferir JavaScript no crítico
    const nonCriticalScripts = document.querySelectorAll('script[data-defer]');
    nonCriticalScripts.forEach(script => {
      script.defer = true;
    });

    // Usar requestIdleCallback para tareas no críticas
    const runWhenIdle = (callback) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(callback);
      } else {
        setTimeout(callback, 1);
      }
    };

    return { runWhenIdle };
  };

  return {
    preloadResources,
    prefetchResources,
    optimizeLCP,
    optimizeCLS,
    optimizeFID
  };
};

// Hook para measuring performance
export const usePerformanceMonitor = () => {
  useEffect(() => {
    // Observar entradas de PerformanceObserver
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.entryType === 'navigation') {
            console.log('Navigation Timing:', {
              domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
              loadComplete: entry.loadEventEnd - entry.loadEventStart,
              firstPaint: entry.responseEnd - entry.requestStart
            });
          }
          
          if (entry.entryType === 'paint') {
            console.log(`${entry.name}: ${entry.startTime}ms`);
          }
        });
      });

      observer.observe({ entryTypes: ['navigation', 'paint'] });

      return () => observer.disconnect();
    }
  }, []);
};

// Configurar service worker para cache estratégico
export const setupServiceWorker = () => {
  if ('serviceWorker' in navigator && import.meta.env.MODE === 'production') {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  }
};

export default useWebVitals;