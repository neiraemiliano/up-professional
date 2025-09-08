import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = "Home Fixed - Encuentra Profesionales de Confianza en Argentina",
  description = "Conecta con los mejores profesionales verificados para el hogar en Argentina. Plomeros, electricistas, carpinteros y más. Presupuestos gratis en menos de 2 horas.",
  keywords = "profesionales, hogar, servicios, plomero, electricista, carpintero, argentina, presupuestos",
  image = "https://www.home-fixed.com/images/og-image.jpg",
  url = "https://www.home-fixed.com",
  type = "website",
  canonical,
  noindex = false,
  structuredData,
  additionalMeta = []
}) => {
  const siteName = "Home Fixed";
  const twitterHandle = "@homefixed";

  // Generar título completo
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  
  // URL canónica
  const canonicalUrl = canonical || url;

  return (
    <Helmet>
      {/* Título básico */}
      <title>{fullTitle}</title>
      
      {/* Meta tags básicos */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      
      {/* URL canónica */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="es_AR" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Meta tags adicionales */}
      {additionalMeta.map((meta, index) => (
        <meta key={index} {...meta} />
      ))}
      
      {/* Datos estructurados JSON-LD */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;