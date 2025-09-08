import { useMemo } from 'react';
import { useLocation } from 'react-router';

export const useSEO = () => {
  const location = useLocation();

  // Datos base de la organización
  const organizationData = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Home Fixed",
    "url": "https://www.home-fixed.com",
    "logo": "https://www.home-fixed.com/images/logo.png",
    "description": "Marketplace líder de profesionales para el hogar en Argentina. Conectamos clientes con profesionales verificados.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "AR",
      "addressRegion": "CABA"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+54-11-1234-5678",
      "contactType": "customer service",
      "availableLanguage": ["Spanish"]
    },
    "sameAs": [
      "https://www.facebook.com/homefixed",
      "https://www.instagram.com/homefixed",
      "https://www.linkedin.com/company/homefixed"
    ]
  }), []);

  // Datos estructurados para página de inicio
  const getHomeStructuredData = () => ({
    "@context": "https://schema.org",
    "@graph": [
      organizationData,
      {
        "@type": "WebSite",
        "name": "Home Fixed",
        "url": "https://www.home-fixed.com",
        "description": "Encuentra profesionales verificados para el hogar en Argentina",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.home-fixed.com/search?service={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Service",
        "name": "Servicios Profesionales para el Hogar",
        "provider": organizationData,
        "description": "Conectamos clientes con profesionales verificados para servicios del hogar",
        "serviceType": ["Plomería", "Electricidad", "Carpintería", "Limpieza", "Pintura", "Jardinería"],
        "areaServed": {
          "@type": "Country",
          "name": "Argentina"
        }
      }
    ]
  });

  // Datos estructurados para perfil de profesional
  const getProfessionalStructuredData = (professional) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    "name": professional.name,
    "jobTitle": professional.specialty,
    "url": `https://www.home-fixed.com/professional/${professional.id}`,
    "image": professional.profileImage,
    "description": professional.description,
    "telephone": professional.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": professional.city,
      "addressCountry": "AR"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": professional.rating,
      "reviewCount": professional.reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "description": `Servicios de ${professional.specialty}`,
      "areaServed": professional.serviceAreas?.map(area => ({
        "@type": "City",
        "name": area
      }))
    }
  });

  // Datos estructurados para servicio
  const getServiceStructuredData = (service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.name,
    "provider": organizationData,
    "description": service.description,
    "serviceType": service.category,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "ARS",
      "lowPrice": service.priceRange?.min || "500",
      "highPrice": service.priceRange?.max || "50000",
      "description": "Presupuesto gratuito"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Argentina"
    }
  });

  // Breadcrumbs estructurados
  const getBreadcrumbsStructuredData = (breadcrumbs) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  });

  // FAQ estructura
  const getFAQStructuredData = (faqs) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  });

  return {
    getHomeStructuredData,
    getProfessionalStructuredData,
    getServiceStructuredData,
    getBreadcrumbsStructuredData,
    getFAQStructuredData,
    organizationData
  };
};

// Configuraciones SEO predefinidas por página
export const SEO_CONFIGS = {
  home: {
    title: "Home Fixed - Encuentra Profesionales de Confianza en Argentina",
    description: "Conecta con los mejores profesionales verificados para el hogar en Argentina. Plomeros, electricistas, carpinteros y más. Presupuestos gratis en menos de 2 horas.",
    keywords: "profesionales argentina, servicios hogar, plomero, electricista, carpintero, presupuestos gratis, profesionales verificados",
  },
  
  search: {
    title: "Buscar Profesionales - Home Fixed",
    description: "Encuentra el profesional perfecto para tu proyecto. Miles de profesionales verificados esperando ayudarte en toda Argentina.",
    keywords: "buscar profesional, encontrar servicios, profesionales cerca, argentina",
  },
  
  categories: {
    plomeria: {
      title: "Plomeros en Argentina - Profesionales Verificados | Home Fixed",
      description: "Encuentra los mejores plomeros cerca de ti. Profesionales verificados, presupuestos gratis y respuesta rápida. Arreglos de plomería garantizados.",
      keywords: "plomero, plomería, arreglos caños, destapaciones, instalaciones agua, plomero urgente, plomero 24hs"
    },
    electricidad: {
      title: "Electricistas en Argentina - Instalaciones Seguras | Home Fixed", 
      description: "Electricistas profesionales para instalaciones, reparaciones y mantenimiento eléctrico. Trabajo garantizado y presupuesto sin cargo.",
      keywords: "electricista, instalaciones eléctricas, reparaciones eléctricas, electricista 24hs, tablero eléctrico, cableado"
    },
    carpinteria: {
      title: "Carpinteros en Argentina - Muebles y Reparaciones | Home Fixed",
      description: "Carpinteros expertos para muebles a medida, reparaciones y trabajos en madera. Profesionales verificados con años de experiencia.",
      keywords: "carpintero, muebles medida, reparación muebles, trabajos madera, carpintería, amoblamiento"
    }
  },
  
  profile: (professionalName, specialty) => ({
    title: `${professionalName} - ${specialty} Profesional | Home Fixed`,
    description: `Conoce a ${professionalName}, ${specialty} profesional verificado en Home Fixed. Ve reseñas, trabajos anteriores y solicita presupuesto gratis.`,
    keywords: `${professionalName}, ${specialty}, profesional verificado, presupuesto gratis, reseñas`
  }),
  
  about: {
    title: "Sobre Nosotros - Home Fixed | Conectamos Hogares con Profesionales",
    description: "Conoce la historia de Home Fixed, el marketplace líder que conecta hogares argentinos con profesionales verificados y confiables desde 2020.",
    keywords: "sobre nosotros, historia home fixed, marketplace profesionales, misión visión"
  },
  
  contact: {
    title: "Contacto - Home Fixed | Estamos Aquí para Ayudarte",
    description: "¿Necesitas ayuda? Contacta con Home Fixed. Soporte 24/7 para clientes y profesionales. Múltiples canales de comunicación disponibles.",
    keywords: "contacto, soporte, ayuda, atención cliente, whatsapp, email"
  }
};

export default useSEO;