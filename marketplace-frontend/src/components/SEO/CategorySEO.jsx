import SEO from './SEO';
import { useSEO, SEO_CONFIGS } from '../../hooks/useSEO';

const CategorySEO = ({ category, location, professionalCount = 0 }) => {
  const { getServiceStructuredData, getBreadcrumbsStructuredData, getFAQStructuredData } = useSEO();

  // Configuración SEO específica por categoría
  const categoryConfig = SEO_CONFIGS.categories[category] || {
    title: `${category} en Argentina - Profesionales Verificados | UP Professional`,
    description: `Encuentra los mejores profesionales de ${category} cerca de ti. Presupuestos gratis y trabajo garantizado en toda Argentina.`,
    keywords: `${category}, profesionales ${category}, ${category} argentina, presupuestos ${category}`
  };

  // Ajustar título y descripción con ubicación si está presente
  const title = location 
    ? `${categoryConfig.title.replace('Argentina', location)}`
    : categoryConfig.title;
  
  const description = location
    ? categoryConfig.description.replace('cerca de ti', `en ${location}`)
    : categoryConfig.description;

  // Generar breadcrumbs
  const breadcrumbs = [
    { name: 'Inicio', url: 'https://www.home-fixed.com' },
    { name: 'Servicios', url: 'https://www.home-fixed.com/search' },
    { name: categoryConfig.title.split(' - ')[0], url: `https://www.home-fixed.com/category/${category}` }
  ];

  if (location) {
    breadcrumbs.push({
      name: `${categoryConfig.title.split(' - ')[0]} en ${location}`,
      url: `https://www.home-fixed.com/search?service=${category}&location=${location}`
    });
  }

  // Datos estructurados del servicio
  const serviceData = getServiceStructuredData({
    name: categoryConfig.title.split(' - ')[0],
    description: description,
    category: category,
    priceRange: getCategoryPriceRange(category)
  });

  // FAQs específicas por categoría
  const categoryFAQs = getCategoryFAQs(category);
  const faqData = categoryFAQs.length > 0 ? getFAQStructuredData(categoryFAQs) : null;

  // Combinar datos estructurados
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      serviceData,
      getBreadcrumbsStructuredData(breadcrumbs),
      ...(faqData ? [faqData] : [])
    ]
  };

  return (
    <SEO
      title={title}
      description={description}
      keywords={categoryConfig.keywords}
      url={location 
        ? `https://www.home-fixed.com/search?service=${category}&location=${location}`
        : `https://www.home-fixed.com/category/${category}`
      }
      structuredData={structuredData}
      additionalMeta={[
        { name: "geo.placename", content: location || "Argentina" },
        { name: "geo.region", content: "AR" },
        { property: "article:section", content: "Servicios" },
        { property: "article:tag", content: category }
      ]}
    />
  );
};

// Función auxiliar para obtener rangos de precio por categoría
const getCategoryPriceRange = (category) => {
  const priceRanges = {
    plomeria: { min: 2000, max: 15000 },
    electricidad: { min: 1500, max: 12000 },
    carpinteria: { min: 3000, max: 25000 },
    limpieza: { min: 1000, max: 8000 },
    pintura: { min: 2500, max: 20000 },
    jardineria: { min: 1500, max: 10000 },
    albanileria: { min: 5000, max: 50000 },
    cerrajeria: { min: 800, max: 6000 },
    gasista: { min: 2000, max: 18000 },
    'aire-acondicionado': { min: 3000, max: 30000 }
  };
  return priceRanges[category] || { min: 1000, max: 20000 };
};

// Función auxiliar para obtener FAQs por categoría
const getCategoryFAQs = (category) => {
  const faqs = {
    plomeria: [
      {
        question: "¿Cuánto cuesta un plomero en Argentina?",
        answer: "El costo de un plomero varía según el trabajo. Las reparaciones menores van desde $2,000, mientras que instalaciones completas pueden costar hasta $15,000. Solicita presupuestos gratuitos para comparar precios."
      },
      {
        question: "¿Los plomeros de UP Professional están asegurados?",
        answer: "Sí, todos nuestros profesionales están verificados y cuentan con seguro de responsabilidad civil. Trabajamos solo con plomeros matriculados y con experiencia comprobada."
      }
    ],
    electricidad: [
      {
        question: "¿Es seguro contratar un electricista por internet?",
        answer: "Absolutamente. Todos nuestros electricistas están verificados, matriculados y cuentan con seguro. Puedes ver sus calificaciones, trabajos anteriores y contratar con total confianza."
      },
      {
        question: "¿Qué trabajos eléctricos realizan?",
        answer: "Nuestros electricistas realizan instalaciones, reparaciones, cambios de tablero, instalación de aires acondicionados, iluminación LED, y trabajos eléctricos en general."
      }
    ],
    carpinteria: [
      {
        question: "¿Hacen muebles a medida?",
        answer: "Sí, nuestros carpinteros realizan muebles a medida según tus necesidades y especificaciones. Desde placards hasta cocinas completas, todo diseñado especialmente para tu hogar."
      },
      {
        question: "¿Cuánto tardan en hacer un mueble a medida?",
        answer: "El tiempo varía según la complejidad del proyecto. Un mueble simple puede tardar 1-2 semanas, mientras que proyectos más complejos pueden tomar 4-6 semanas."
      }
    ]
  };
  return faqs[category] || [];
};

export default CategorySEO;