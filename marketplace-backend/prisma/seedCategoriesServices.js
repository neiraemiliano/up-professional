const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
  {
    name: 'Plomería',
    value: 'plomeria',
    icon: '🔧',
    avgPrice: 8500,
    priceRange: '3500-15000'
  },
  {
    name: 'Electricidad',
    value: 'electricidad',
    icon: '⚡',
    avgPrice: 9200,
    priceRange: '4000-18000'
  },
  {
    name: 'Carpintería',
    value: 'carpinteria',
    icon: '🪚',
    avgPrice: 12000,
    priceRange: '5000-25000'
  },
  {
    name: 'Pintura',
    value: 'pintura',
    icon: '🎨',
    avgPrice: 7800,
    priceRange: '3000-20000'
  },
  {
    name: 'Limpieza',
    value: 'limpieza',
    icon: '🧽',
    avgPrice: 4500,
    priceRange: '2000-8000'
  },
  {
    name: 'Jardinería',
    value: 'jardineria',
    icon: '🌱',
    avgPrice: 6500,
    priceRange: '2500-12000'
  },
  {
    name: 'Gasista',
    value: 'gasista',
    icon: '🔥',
    avgPrice: 11000,
    priceRange: '5000-20000'
  },
  {
    name: 'Aire Acondicionado',
    value: 'aire-acondicionado',
    icon: '❄️',
    avgPrice: 15000,
    priceRange: '8000-35000'
  },
  {
    name: 'Cerrajería',
    value: 'cerrajeria',
    icon: '🔐',
    avgPrice: 6800,
    priceRange: '3000-12000'
  },
  {
    name: 'Albañilería',
    value: 'albanileria',
    icon: '🧱',
    avgPrice: 13500,
    priceRange: '6000-30000'
  },
  {
    name: 'Techista',
    value: 'techista',
    icon: '🏠',
    avgPrice: 16000,
    priceRange: '8000-40000'
  },
  {
    name: 'Electrodomésticos',
    value: 'electrodomesticos',
    icon: '🔌',
    avgPrice: 8900,
    priceRange: '4000-18000'
  },
  {
    name: 'Mudanzas',
    value: 'mudanzas',
    icon: '📦',
    avgPrice: 25000,
    priceRange: '12000-60000'
  },
  {
    name: 'Soldadura',
    value: 'soldadura',
    icon: '🔥',
    avgPrice: 10500,
    priceRange: '5000-22000'
  },
  {
    name: 'Vidriería',
    value: 'vidrieria',
    icon: '🪟',
    avgPrice: 7200,
    priceRange: '3500-15000'
  }
];

const specialties = [
  // Plomería
  { name: 'Destapaciones', categoryName: 'Plomería', icon: '🚰' },
  { name: 'Instalación de griferías', categoryName: 'Plomería', icon: '🚿' },
  { name: 'Reparación de calderas', categoryName: 'Plomería', icon: '🔥' },
  { name: 'Instalación de termotanques', categoryName: 'Plomería', icon: '🌡️' },
  { name: 'Reparación de pérdidas', categoryName: 'Plomería', icon: '💧' },
  
  // Electricidad
  { name: 'Instalaciones eléctricas', categoryName: 'Electricidad', icon: '⚡' },
  { name: 'Sistemas LED', categoryName: 'Electricidad', icon: '💡' },
  { name: 'Tableros eléctricos', categoryName: 'Electricidad', icon: '🔌' },
  { name: 'Automatización', categoryName: 'Electricidad', icon: '🤖' },
  { name: 'Cableado estructurado', categoryName: 'Electricidad', icon: '🔗' },
  
  // Carpintería
  { name: 'Muebles a medida', categoryName: 'Carpintería', icon: '🪑' },
  { name: 'Puertas y ventanas', categoryName: 'Carpintería', icon: '🚪' },
  { name: 'Deck y pergolas', categoryName: 'Carpintería', icon: '🏗️' },
  { name: 'Reparaciones en general', categoryName: 'Carpintería', icon: '🔨' },
  { name: 'Restauración de muebles', categoryName: 'Carpintería', icon: '✨' },
  
  // Pintura
  { name: 'Pintura interior', categoryName: 'Pintura', icon: '🏠' },
  { name: 'Pintura exterior', categoryName: 'Pintura', icon: '🏢' },
  { name: 'Pintura decorativa', categoryName: 'Pintura', icon: '🎨' },
  { name: 'Empapelado', categoryName: 'Pintura', icon: '📜' },
  { name: 'Trabajos en altura', categoryName: 'Pintura', icon: '🪜' },
  
  // Limpieza
  { name: 'Limpieza profunda', categoryName: 'Limpieza', icon: '✨' },
  { name: 'Limpieza post obra', categoryName: 'Limpieza', icon: '🏗️' },
  { name: 'Limpieza de vidrios', categoryName: 'Limpieza', icon: '🪟' },
  { name: 'Limpieza de alfombras', categoryName: 'Limpieza', icon: '🧽' },
  { name: 'Desinfección', categoryName: 'Limpieza', icon: '🦠' },
  
  // Jardinería
  { name: 'Mantenimiento de jardines', categoryName: 'Jardinería', icon: '🌿' },
  { name: 'Diseño paisajístico', categoryName: 'Jardinería', icon: '🎨' },
  { name: 'Poda de árboles', categoryName: 'Jardinería', icon: '✂️' },
  { name: 'Sistemas de riego', categoryName: 'Jardinería', icon: '💧' },
  { name: 'Césped y parquización', categoryName: 'Jardinería', icon: '🌱' }
];

const searchSuggestions = [
  // Plomería
  { text: 'Destapación urgente', categoryName: 'Plomería', icon: '🚰', estimatedTime: '1-2 horas', avgPrice: '$3500', isUrgent: true, popularity: 95 },
  { text: 'Cambio de grifo cocina', categoryName: 'Plomería', icon: '🚿', estimatedTime: '2-3 horas', avgPrice: '$4500', popularity: 85 },
  { text: 'Reparar pérdida en baño', categoryName: 'Plomería', icon: '💧', estimatedTime: '1-2 horas', avgPrice: '$3000', popularity: 90 },
  { text: 'Instalación termotanque', categoryName: 'Plomería', icon: '🌡️', estimatedTime: '3-4 horas', avgPrice: '$8000', popularity: 70 },
  { text: 'Arreglo de ducha', categoryName: 'Plomería', icon: '🚿', estimatedTime: '1-2 horas', avgPrice: '$4000', popularity: 80 },
  
  // Electricidad
  { text: 'Instalación de luces LED', categoryName: 'Electricidad', icon: '💡', estimatedTime: '2-3 horas', avgPrice: '$6000', popularity: 85 },
  { text: 'Arreglo de enchufe', categoryName: 'Electricidad', icon: '🔌', estimatedTime: '1 hora', avgPrice: '$2500', popularity: 90 },
  { text: 'Cambio de tablero eléctrico', categoryName: 'Electricidad', icon: '⚡', estimatedTime: '4-6 horas', avgPrice: '$12000', popularity: 60 },
  { text: 'Instalación de ventilador', categoryName: 'Electricidad', icon: '🌪️', estimatedTime: '1-2 horas', avgPrice: '$3500', popularity: 75 },
  { text: 'Arreglo de corte luz', categoryName: 'Electricidad', icon: '⚡', estimatedTime: '1-2 horas', avgPrice: '$4000', isUrgent: true, popularity: 95 },
  
  // Carpintería
  { text: 'Mueble de cocina a medida', categoryName: 'Carpintería', icon: '🪑', estimatedTime: '1-2 semanas', avgPrice: '$45000', popularity: 70 },
  { text: 'Arreglo de puerta', categoryName: 'Carpintería', icon: '🚪', estimatedTime: '2-3 horas', avgPrice: '$5000', popularity: 85 },
  { text: 'Instalación de estantes', categoryName: 'Carpintería', icon: '📚', estimatedTime: '2-4 horas', avgPrice: '$6000', popularity: 80 },
  { text: 'Deck de madera', categoryName: 'Carpintería', icon: '🏗️', estimatedTime: '3-5 días', avgPrice: '$35000', popularity: 65 },
  { text: 'Restaurar mueble antiguo', categoryName: 'Carpintería', icon: '✨', estimatedTime: '1-2 semanas', avgPrice: '$18000', popularity: 55 },
  
  // Pintura
  { text: 'Pintar habitación completa', categoryName: 'Pintura', icon: '🏠', estimatedTime: '1-2 días', avgPrice: '$12000', popularity: 90 },
  { text: 'Pintar frente de casa', categoryName: 'Pintura', icon: '🏢', estimatedTime: '2-3 días', avgPrice: '$25000', popularity: 75 },
  { text: 'Pintura decorativa pared', categoryName: 'Pintura', icon: '🎨', estimatedTime: '4-6 horas', avgPrice: '$8000', popularity: 60 },
  { text: 'Empapelar dormitorio', categoryName: 'Pintura', icon: '📜', estimatedTime: '1 día', avgPrice: '$15000', popularity: 65 },
  { text: 'Pintar departamento completo', categoryName: 'Pintura', icon: '🏠', estimatedTime: '3-5 días', avgPrice: '$35000', popularity: 80 },
  
  // Limpieza
  { text: 'Limpieza profunda casa', categoryName: 'Limpieza', icon: '✨', estimatedTime: '4-6 horas', avgPrice: '$8000', popularity: 95 },
  { text: 'Limpieza post mudanza', categoryName: 'Limpieza', icon: '📦', estimatedTime: '3-5 horas', avgPrice: '$6000', popularity: 80 },
  { text: 'Limpiar vidrios balcón', categoryName: 'Limpieza', icon: '🪟', estimatedTime: '2-3 horas', avgPrice: '$3500', popularity: 70 },
  { text: 'Desinfección por COVID', categoryName: 'Limpieza', icon: '🦠', estimatedTime: '2-3 horas', avgPrice: '$5000', popularity: 85 },
  { text: 'Limpieza alfombras y sillones', categoryName: 'Limpieza', icon: '🧽', estimatedTime: '3-4 horas', avgPrice: '$7000', popularity: 75 }
];

async function seedCategoriesAndServices() {
  console.log('🌱 Seeding categories and services...');

  try {
    // Seed categories
    const createdCategories = [];
    for (const category of categories) {
      const existing = await prisma.category.findFirst({
        where: { value: category.value }
      });

      if (existing) {
        const updated = await prisma.category.update({
          where: { id: existing.id },
          data: category
        });
        createdCategories.push(updated);
      } else {
        const created = await prisma.category.create({
          data: category
        });
        createdCategories.push(created);
      }
    }

    // Seed specialties
    for (const specialty of specialties) {
      const category = createdCategories.find(c => c.name === specialty.categoryName);
      if (category) {
        await prisma.specialty.upsert({
          where: { name: specialty.name },
          update: {
            categoryId: category.id,
            description: `Especialidad en ${specialty.name.toLowerCase()}`,
            icon: specialty.icon
          },
          create: {
            name: specialty.name,
            categoryId: category.id,
            description: `Especialidad en ${specialty.name.toLowerCase()}`,
            icon: specialty.icon
          }
        });
      }
    }

    // Seed search suggestions
    for (const suggestion of searchSuggestions) {
      const category = createdCategories.find(c => c.name === suggestion.categoryName);
      if (category) {
        const existing = await prisma.searchSuggestion.findFirst({
          where: {
            categoryId: category.id,
            text: suggestion.text
          }
        });

        if (!existing) {
          await prisma.searchSuggestion.create({
            data: {
              categoryId: category.id,
              text: suggestion.text,
              icon: suggestion.icon,
              estimatedTime: suggestion.estimatedTime,
              avgPrice: suggestion.avgPrice,
              isUrgent: suggestion.isUrgent || false,
              popularity: suggestion.popularity
            }
          });
        }
      }
    }

    console.log(`✅ ${categories.length} categories seeded`);
    console.log(`✅ ${specialties.length} specialties seeded`);
    console.log(`✅ ${searchSuggestions.length} search suggestions seeded`);

  } catch (error) {
    console.error('❌ Error seeding categories and services:', error);
    throw error;
  }
}

if (require.main === module) {
  seedCategoriesAndServices()
    .then(() => {
      console.log('✨ Categories and services seeding completed!');
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedCategoriesAndServices };