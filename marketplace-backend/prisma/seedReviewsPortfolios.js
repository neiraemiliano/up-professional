const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Sample reviews with realistic content
const reviewTemplates = [
  {
    rating: 5,
    comment: 'Excelente trabajo, muy profesional y puntual. Lo recomiendo 100%.',
    aspectRatings: { punctuality: true, quality: true, communication: true, cleanliness: true, price: true },
    wouldRecommend: true
  },
  {
    rating: 5,
    comment: 'Muy buen servicio, llegó en horario y terminó el trabajo perfectamente. Súper recomendable.',
    aspectRatings: { punctuality: true, quality: true, communication: true, cleanliness: true, price: true },
    wouldRecommend: true
  },
  {
    rating: 4,
    comment: 'Buen trabajo, aunque se demoró un poco más de lo esperado. El resultado final fue bueno.',
    aspectRatings: { punctuality: false, quality: true, communication: true, cleanliness: true, price: true },
    wouldRecommend: true
  },
  {
    rating: 5,
    comment: 'Impecable el trabajo! Muy prolijo y ordenado. Además dejó todo limpio.',
    aspectRatings: { punctuality: true, quality: true, communication: true, cleanliness: true, price: true },
    wouldRecommend: true
  },
  {
    rating: 4,
    comment: 'Buen profesional, cumplió con todo lo acordado. El precio fue justo.',
    aspectRatings: { punctuality: true, quality: true, communication: true, cleanliness: true, price: true },
    wouldRecommend: true
  },
  {
    rating: 5,
    comment: 'Excelente atención y calidad de trabajo. Muy recomendable, lo volvería a contratar.',
    aspectRatings: { punctuality: true, quality: true, communication: true, cleanliness: true, price: true },
    wouldRecommend: true
  },
  {
    rating: 3,
    comment: 'El trabajo estuvo bien pero tuvo que volver porque algo no funcionaba correctamente.',
    aspectRatings: { punctuality: true, quality: false, communication: true, cleanliness: true, price: true },
    wouldRecommend: false
  },
  {
    rating: 5,
    comment: 'Súper profesional, muy buena comunicación y trabajo de excelente calidad.',
    aspectRatings: { punctuality: true, quality: true, communication: true, cleanliness: true, price: true },
    wouldRecommend: true
  },
  {
    rating: 4,
    comment: 'Trabajo bien hecho, llegó puntual y fue muy amable. Lo recomendaría.',
    aspectRatings: { punctuality: true, quality: true, communication: true, cleanliness: true, price: true },
    wouldRecommend: true
  },
  {
    rating: 5,
    comment: 'Increíble trabajo! Superó mis expectativas. Definitivamente lo voy a recomendar.',
    aspectRatings: { punctuality: true, quality: true, communication: true, cleanliness: true, price: true },
    wouldRecommend: true
  },
  {
    rating: 4,
    comment: 'Muy conforme con el servicio. Profesional serio y responsable.',
    aspectRatings: { punctuality: true, quality: true, communication: true, cleanliness: true, price: true },
    wouldRecommend: true
  },
  {
    rating: 5,
    comment: 'Excelente! Muy rápido y eficiente. El trabajo quedó perfecto.',
    aspectRatings: { punctuality: true, quality: true, communication: true, cleanliness: true, price: true },
    wouldRecommend: true
  },
  {
    rating: 3,
    comment: 'El trabajo estuvo bien, aunque el precio me pareció un poco elevado.',
    aspectRatings: { punctuality: true, quality: true, communication: true, cleanliness: true, price: false },
    wouldRecommend: false
  },
  {
    rating: 5,
    comment: 'Muy profesional, explicó todo lo que iba haciendo y quedó excelente.',
    aspectRatings: { punctuality: true, quality: true, communication: true, cleanliness: true, price: true },
    wouldRecommend: true
  },
  {
    rating: 4,
    comment: 'Buen servicio, llegó en horario y cumplió con lo acordado.',
    aspectRatings: { punctuality: true, quality: true, communication: true, cleanliness: true, price: true },
    wouldRecommend: true
  }
];

// Service types for reviews
const serviceTypes = [
  'Destapación', 'Instalación de griferías', 'Reparación eléctrica', 'Pintura de habitación',
  'Limpieza profunda', 'Instalación de luces', 'Carpintería', 'Jardinería',
  'Reparación de electrodomésticos', 'Instalación de aire acondicionado'
];

// Portfolio images (using placeholder URLs)
const portfolioImages = [
  { title: 'Instalación de cocina completa', description: 'Muebles de cocina a medida con mesada de granito', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800' },
  { title: 'Baño moderno', description: 'Renovación completa de baño con sanitarios de primera línea', url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800' },
  { title: 'Instalación eléctrica', description: 'Sistema de luces LED con control inteligente', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' },
  { title: 'Pintura decorativa', description: 'Técnica de pintura con efectos especiales en living', url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800' },
  { title: 'Deck de madera', description: 'Construcción de deck en patio con pérgola', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800' },
  { title: 'Jardín paisajístico', description: 'Diseño y construcción de jardín con sistema de riego', url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800' },
  { title: 'Reparación de techo', description: 'Impermeabilización completa con membrana EPDM', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800' },
  { title: 'Instalación de cerraduras', description: 'Sistema de seguridad con cerradura multipunto', url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800' },
  { title: 'Aire acondicionado', description: 'Instalación de equipo split con canaletas decorativas', url: 'https://images.unsplash.com/photo-1631545806602-c715c77e5a5a?w=800' },
  { title: 'Soldadura artística', description: 'Reja decorativa con diseño personalizado', url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800' },
  { title: 'Vidriera comercial', description: 'Instalación de vitrina para local comercial', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800' },
  { title: 'Limpieza post obra', description: 'Limpieza profunda después de renovación completa', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800' }
];

async function seedReviewsAndPortfolios() {
  console.log('🌱 Seeding reviews and portfolios...');

  try {
    // Get all professionals and customers
    const professionals = await prisma.professional.findMany({
      include: { User: true }
    });
    const customers = await prisma.user.findMany({
      where: { role: 'customer' }
    });

    let reviewsCreated = 0;
    let portfoliosCreated = 0;

    // Create reviews for each professional
    for (const professional of professionals) {
      // Create 3-15 reviews per professional
      const numReviews = Math.floor(Math.random() * 13) + 3;
      
      for (let i = 0; i < numReviews; i++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const template = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];
        const serviceType = serviceTypes[Math.floor(Math.random() * serviceTypes.length)];
        
        // Random service date (last 6 months)
        const serviceDate = new Date();
        serviceDate.setDate(serviceDate.getDate() - Math.floor(Math.random() * 180));

        await prisma.review.create({
          data: {
            userId: customer.id,
            professionalId: professional.id,
            rating: template.rating,
            comment: template.comment,
            aspectRatings: template.aspectRatings,
            isAnonymous: Math.random() < 0.1, // 10% anonymous reviews
            wouldRecommend: template.wouldRecommend,
            serviceDate: serviceDate,
            helpful: Math.floor(Math.random() * 10), // 0-9 helpful votes
            service: serviceType
          }
        });
        reviewsCreated++;
      }

      // Update professional's average rating based on reviews
      const reviews = await prisma.review.findMany({
        where: { professionalId: professional.id }
      });
      
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

      await prisma.professional.update({
        where: { id: professional.id },
        data: { avgRating: Math.round(avgRating * 10) / 10 }
      });

      // Create portfolio images (2-6 per professional)
      const numPortfolioItems = Math.floor(Math.random() * 5) + 2;
      
      for (let i = 0; i < numPortfolioItems; i++) {
        const portfolioItem = portfolioImages[Math.floor(Math.random() * portfolioImages.length)];
        
        await prisma.portfolioImage.create({
          data: {
            professionalId: professional.id,
            url: portfolioItem.url,
            title: portfolioItem.title,
            description: portfolioItem.description,
            orderIndex: i
          }
        });
        portfoliosCreated++;
      }

      console.log(`✅ Created ${numReviews} reviews and ${numPortfolioItems} portfolio items for ${professional.User.name}`);
    }

    console.log(`✅ ${reviewsCreated} reviews created`);
    console.log(`✅ ${portfoliosCreated} portfolio items created`);

  } catch (error) {
    console.error('❌ Error seeding reviews and portfolios:', error);
    throw error;
  }
}

if (require.main === module) {
  seedReviewsAndPortfolios()
    .then(() => {
      console.log('✨ Reviews and portfolios seeding completed!');
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedReviewsAndPortfolios };