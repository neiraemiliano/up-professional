// utils/sitemap.js - Generador de sitemap dinámico

export const generateSitemap = async () => {
  const baseUrl = 'https://www.home-fixed.com';
  const currentDate = new Date().toISOString().split('T')[0];

  // URLs estáticas principales
  const staticUrls = [
    {
      url: baseUrl,
      changefreq: 'daily',
      priority: 1.0,
      lastmod: currentDate
    },
    {
      url: `${baseUrl}/search`,
      changefreq: 'daily', 
      priority: 0.9,
      lastmod: currentDate
    },
    {
      url: `${baseUrl}/about`,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: currentDate
    },
    {
      url: `${baseUrl}/contact`,
      changefreq: 'monthly',
      priority: 0.6,
      lastmod: currentDate
    },
    {
      url: `${baseUrl}/faq`,
      changefreq: 'weekly',
      priority: 0.6,
      lastmod: currentDate
    },
    {
      url: `${baseUrl}/terms`,
      changefreq: 'yearly',
      priority: 0.4,
      lastmod: currentDate
    },
    {
      url: `${baseUrl}/privacy`,
      changefreq: 'yearly',
      priority: 0.4,
      lastmod: currentDate
    }
  ];

  // Categorías principales de servicios
  const categories = [
    { slug: 'plomeria', name: 'Plomería', priority: 0.8 },
    { slug: 'electricidad', name: 'Electricidad', priority: 0.8 },
    { slug: 'carpinteria', name: 'Carpintería', priority: 0.8 },
    { slug: 'limpieza', name: 'Limpieza', priority: 0.8 },
    { slug: 'pintura', name: 'Pintura', priority: 0.7 },
    { slug: 'jardineria', name: 'Jardinería', priority: 0.7 },
    { slug: 'albanileria', name: 'Albañilería', priority: 0.7 },
    { slug: 'cerrajeria', name: 'Cerrajería', priority: 0.7 },
    { slug: 'gasista', name: 'Gasista', priority: 0.7 },
    { slug: 'aire-acondicionado', name: 'Aire Acondicionado', priority: 0.7 }
  ];

  const categoryUrls = categories.map(category => ({
    url: `${baseUrl}/category/${category.slug}`,
    changefreq: 'weekly',
    priority: category.priority,
    lastmod: currentDate
  }));

  // Ciudades principales de Argentina
  const cities = [
    'buenos-aires',
    'cordoba', 
    'rosario',
    'mendoza',
    'tucuman',
    'la-plata',
    'mar-del-plata',
    'salta',
    'santa-fe',
    'san-juan'
  ];

  // URLs de categorías por ciudad
  const locationUrls = [];
  categories.forEach(category => {
    cities.forEach(city => {
      locationUrls.push({
        url: `${baseUrl}/search?service=${category.slug}&location=${city}`,
        changefreq: 'weekly',
        priority: 0.6,
        lastmod: currentDate
      });
    });
  });

  // Combinar todas las URLs
  const allUrls = [...staticUrls, ...categoryUrls, ...locationUrls];

  // Generar XML del sitemap
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(item => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xmlContent;
};

// Generar sitemap de profesionales (dinámico)
export const generateProfessionalSitemap = async (professionals) => {
  const baseUrl = 'https://www.home-fixed.com';
  const currentDate = new Date().toISOString().split('T')[0];

  const professionalUrls = professionals.map(professional => ({
    url: `${baseUrl}/professional/${professional.id}`,
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: professional.updatedAt || currentDate
  }));

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${professionalUrls.map(item => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xmlContent;
};

// Generar índice de sitemaps
export const generateSitemapIndex = () => {
  const baseUrl = 'https://www.home-fixed.com';
  const currentDate = new Date().toISOString();

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-professionals.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

  return xmlContent;
};