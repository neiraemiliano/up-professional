import SEO from './SEO';
import { useSEO, SEO_CONFIGS } from '../../hooks/useSEO';

const ProfessionalSEO = ({ professional }) => {
  const { getProfessionalStructuredData, getBreadcrumbsStructuredData } = useSEO();

  if (!professional) {
    return (
      <SEO
        title="Profesional no encontrado - Home Fixed"
        description="El profesional que buscas no está disponible. Explora otros profesionales verificados en Home Fixed."
        noindex={true}
      />
    );
  }

  // Generar configuración SEO específica
  const seoConfig = SEO_CONFIGS.profile(professional.name, professional.specialty);
  
  // URLs y metadatos
  const professionalUrl = `https://www.home-fixed.com/professional/${professional.id}`;
  const imageUrl = professional.profileImage || `https://www.home-fixed.com/images/professionals/default.jpg`;
  
  // Keywords específicos
  const keywords = [
    professional.name,
    professional.specialty,
    `${professional.specialty} ${professional.city}`,
    `profesional ${professional.specialty}`,
    `${professional.specialty} verificado`,
    'presupuesto gratis',
    professional.city,
    professional.province,
    ...professional.skills?.slice(0, 5) || []
  ].join(', ');

  // Generar breadcrumbs
  const breadcrumbs = [
    { name: 'Inicio', url: 'https://www.home-fixed.com' },
    { name: 'Profesionales', url: 'https://www.home-fixed.com/search' },
    { name: professional.specialty, url: `https://www.home-fixed.com/category/${professional.categorySlug}` },
    { name: professional.name, url: professionalUrl }
  ];

  // Datos estructurados del profesional
  const professionalData = getProfessionalStructuredData(professional);
  
  // Reseñas estructuradas
  const reviewsData = professional.reviews?.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ReviewList",
    "itemListElement": professional.reviews.slice(0, 5).map((review, index) => ({
      "@type": "Review",
      "position": index + 1,
      "author": {
        "@type": "Person",
        "name": review.customerName
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.comment,
      "datePublished": review.date
    }))
  } : null;

  // Combinar datos estructurados
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      professionalData,
      getBreadcrumbsStructuredData(breadcrumbs),
      ...(reviewsData ? [reviewsData] : [])
    ]
  };

  // Meta tags adicionales específicos
  const additionalMeta = [
    { name: "author", content: professional.name },
    { name: "geo.placename", content: professional.city },
    { name: "geo.region", content: professional.province },
    { name: "geo.country", content: "Argentina" },
    { property: "profile:first_name", content: professional.name.split(' ')[0] },
    { property: "profile:last_name", content: professional.name.split(' ').slice(1).join(' ') },
    { property: "profile:username", content: professional.id },
    { property: "article:author", content: professional.name },
    { property: "article:section", content: professional.specialty },
    { property: "article:published_time", content: professional.joinedDate },
    { property: "article:modified_time", content: professional.lastActive },
    { name: "rating", content: professional.rating?.toString() },
    { name: "review_count", content: professional.reviewCount?.toString() },
    { name: "price_range", content: professional.priceRange || "$$" }
  ];

  return (
    <SEO
      title={seoConfig.title}
      description={seoConfig.description}
      keywords={keywords}
      url={professionalUrl}
      image={imageUrl}
      type="profile"
      structuredData={structuredData}
      additionalMeta={additionalMeta}
    />
  );
};

export default ProfessionalSEO;