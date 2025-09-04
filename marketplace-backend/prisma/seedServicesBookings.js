const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Services templates based on categories
const serviceTemplates = {
  'Plomería': [
    { title: 'Destapación urgente', description: 'Servicio de destapación rápida de cañerías y desagües', price: 3500, priceType: 'fixed', estimatedTime: '1-2 horas', includesMaterials: true, isUrgentAvailable: true, urgentSurcharge: 0.5 },
    { title: 'Instalación de griferías', description: 'Instalación y cambio de griferías para cocina y baño', price: 4500, priceType: 'fixed', estimatedTime: '2-3 horas', includesMaterials: false },
    { title: 'Reparación de termotanque', description: 'Diagnóstico y reparación de termotanques eléctricos y a gas', price: 6000, priceType: 'hourly', estimatedTime: '2-4 horas', includesMaterials: false },
    { title: 'Instalación de inodoros', description: 'Instalación completa de inodoros con conexiones', price: 5500, priceType: 'fixed', estimatedTime: '3-4 horas', includesMaterials: false },
    { title: 'Reparación de pérdidas', description: 'Detección y reparación de pérdidas de agua', price: 3000, priceType: 'hourly', estimatedTime: '1-3 horas', includesMaterials: true }
  ],
  'Electricidad': [
    { title: 'Instalación de luces LED', description: 'Instalación de sistemas de iluminación LED', price: 6000, priceType: 'fixed', estimatedTime: '2-3 horas', includesMaterials: false },
    { title: 'Reparación de enchufes', description: 'Arreglo y cambio de tomacorrientes e interruptores', price: 2500, priceType: 'fixed', estimatedTime: '1 hora', includesMaterials: true, isUrgentAvailable: true, urgentSurcharge: 0.3 },
    { title: 'Instalación de tableros', description: 'Instalación y actualización de tableros eléctricos', price: 12000, priceType: 'quote', estimatedTime: '4-6 horas', includesMaterials: false },
    { title: 'Cableado domiciliario', description: 'Instalación de cableado eléctrico residencial', price: 8000, priceType: 'hourly', estimatedTime: '1 día', includesMaterials: false },
    { title: 'Instalación de ventiladores', description: 'Instalación de ventiladores de techo', price: 3500, priceType: 'fixed', estimatedTime: '1-2 horas', includesMaterials: false }
  ],
  'Carpintería': [
    { title: 'Muebles de cocina a medida', description: 'Diseño y fabricación de muebles de cocina personalizados', price: 45000, priceType: 'quote', estimatedTime: '1-2 semanas', includesMaterials: true },
    { title: 'Reparación de puertas', description: 'Arreglo de puertas de madera y ajustes', price: 5000, priceType: 'fixed', estimatedTime: '2-3 horas', includesMaterials: true },
    { title: 'Instalación de estantes', description: 'Instalación de estanterías y repisas', price: 6000, priceType: 'fixed', estimatedTime: '2-4 horas', includesMaterials: false },
    { title: 'Construcción de deck', description: 'Construcción de deck de madera para exteriores', price: 35000, priceType: 'quote', estimatedTime: '3-5 días', includesMaterials: true },
    { title: 'Restauración de muebles', description: 'Restauración y reparación de muebles antiguos', price: 18000, priceType: 'quote', estimatedTime: '1-2 semanas', includesMaterials: true }
  ],
  'Pintura': [
    { title: 'Pintura de habitaciones', description: 'Pintura interior completa de habitaciones', price: 12000, priceType: 'fixed', estimatedTime: '1-2 días', includesMaterials: false },
    { title: 'Pintura de fachadas', description: 'Pintura exterior de frentes de casas', price: 25000, priceType: 'quote', estimatedTime: '2-3 días', includesMaterials: false },
    { title: 'Pintura decorativa', description: 'Técnicas decorativas y efectos especiales', price: 8000, priceType: 'hourly', estimatedTime: '4-6 horas', includesMaterials: false },
    { title: 'Empapelado', description: 'Colocación de papel pintado y vinilos', price: 15000, priceType: 'fixed', estimatedTime: '1 día', includesMaterials: false },
    { title: 'Pintura de departamentos', description: 'Pintura completa de departamentos', price: 35000, priceType: 'quote', estimatedTime: '3-5 días', includesMaterials: false }
  ],
  'Limpieza': [
    { title: 'Limpieza profunda', description: 'Limpieza completa y profunda de hogares', price: 8000, priceType: 'fixed', estimatedTime: '4-6 horas', includesMaterials: true },
    { title: 'Limpieza post mudanza', description: 'Limpieza después de mudanzas', price: 6000, priceType: 'fixed', estimatedTime: '3-5 horas', includesMaterials: true },
    { title: 'Limpieza de vidrios', description: 'Limpieza especializada de ventanas y cristales', price: 3500, priceType: 'fixed', estimatedTime: '2-3 horas', includesMaterials: true },
    { title: 'Desinfección sanitaria', description: 'Desinfección profesional contra virus y bacterias', price: 5000, priceType: 'fixed', estimatedTime: '2-3 horas', includesMaterials: true },
    { title: 'Limpieza de alfombras', description: 'Limpieza profunda de alfombras y tapizados', price: 7000, priceType: 'fixed', estimatedTime: '3-4 horas', includesMaterials: true }
  ]
};

// Booking statuses and descriptions
const bookingScenarios = [
  { status: 'pending', description: 'Necesito arreglar la canilla del baño que gotea constantemente', paymentStatus: 'pending' },
  { status: 'confirmed', description: 'Instalación de luces LED en living y comedor', paymentStatus: 'paid' },
  { status: 'in_progress', description: 'Pintura completa del dormitorio principal', paymentStatus: 'partial' },
  { status: 'completed', description: 'Reparación de pérdida en la cocina', paymentStatus: 'paid' },
  { status: 'completed', description: 'Limpieza profunda post mudanza', paymentStatus: 'paid' },
  { status: 'cancelled', description: 'Instalación de muebles de cocina', paymentStatus: 'refunded' },
  { status: 'completed', description: 'Destapación urgente de desagüe principal', paymentStatus: 'paid' },
  { status: 'confirmed', description: 'Instalación de ventilador de techo', paymentStatus: 'paid' },
  { status: 'pending', description: 'Arreglo de enchufes que no funcionan', paymentStatus: 'pending' },
  { status: 'completed', description: 'Construcción de estantes para biblioteca', paymentStatus: 'paid' }
];

async function seedServicesAndBookings() {
  console.log('🌱 Seeding services and bookings...');

  try {
    // Get all professionals, categories, and customers
    const professionals = await prisma.professional.findMany({
      include: { User: true }
    });
    const categories = await prisma.category.findMany();
    const customers = await prisma.user.findMany({
      where: { role: 'customer' }
    });

    let servicesCreated = 0;
    let bookingsCreated = 0;

    // Create services for each professional
    for (const professional of professionals) {
      // Determine which categories this professional works with based on their description
      const relevantCategories = categories.filter(category => 
        professional.description.toLowerCase().includes(category.name.toLowerCase()) ||
        professional.bio.toLowerCase().includes(category.name.toLowerCase())
      );

      // If no specific category found, assign based on common patterns
      if (relevantCategories.length === 0) {
        const description = professional.description.toLowerCase();
        if (description.includes('plomer') || description.includes('destap')) {
          relevantCategories.push(categories.find(c => c.name === 'Plomería'));
        } else if (description.includes('electric') || description.includes('luz')) {
          relevantCategories.push(categories.find(c => c.name === 'Electricidad'));
        } else if (description.includes('carpin') || description.includes('mueble')) {
          relevantCategories.push(categories.find(c => c.name === 'Carpintería'));
        } else if (description.includes('pint')) {
          relevantCategories.push(categories.find(c => c.name === 'Pintura'));
        } else if (description.includes('limp')) {
          relevantCategories.push(categories.find(c => c.name === 'Limpieza'));
        }
      }

      // Create services for relevant categories
      for (const category of relevantCategories) {
        const templates = serviceTemplates[category.name] || [];
        
        // Create 2-4 services per category for this professional
        const numServices = Math.floor(Math.random() * 3) + 2;
        const selectedTemplates = templates.slice(0, numServices);

        for (const template of selectedTemplates) {
          await prisma.service.create({
            data: {
              professionalId: professional.id,
              categoryId: category.id,
              title: template.title,
              description: template.description,
              price: template.price,
              priceType: template.priceType,
              estimatedTime: template.estimatedTime,
              includesMaterials: template.includesMaterials || false,
              isUrgentAvailable: template.isUrgentAvailable || false,
              urgentSurcharge: template.urgentSurcharge || null
            }
          });
          servicesCreated++;
        }
      }
    }

    console.log(`✅ ${servicesCreated} services created`);

    // Create bookings
    const services = await prisma.service.findMany({
      include: {
        Professional: true,
        Category: true
      }
    });

    // Create bookings with different scenarios
    for (let i = 0; i < 50; i++) {
      const service = services[Math.floor(Math.random() * services.length)];
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const scenario = bookingScenarios[Math.floor(Math.random() * bookingScenarios.length)];

      // Random booking date (last 3 months)
      const bookingDate = new Date();
      bookingDate.setDate(bookingDate.getDate() - Math.floor(Math.random() * 90));

      // Calculate prices
      const basePrice = service.price;
      const variation = (Math.random() - 0.5) * 0.3; // ±15% variation
      const estimatedPrice = Math.round(basePrice * (1 + variation));
      const finalPrice = scenario.status === 'completed' ? 
        Math.round(estimatedPrice * (0.9 + Math.random() * 0.2)) : // ±10% from estimated
        null;

      await prisma.booking.create({
        data: {
          userId: customer.id,
          serviceId: service.id,
          status: scenario.status,
          paymentStatus: scenario.paymentStatus,
          bookingDate: bookingDate,
          description: scenario.description,
          estimatedPrice: estimatedPrice,
          finalPrice: finalPrice,
          includesMaterials: service.includesMaterials
        }
      });
      bookingsCreated++;
    }

    console.log(`✅ ${bookingsCreated} bookings created`);

  } catch (error) {
    console.error('❌ Error seeding services and bookings:', error);
    throw error;
  }
}

if (require.main === module) {
  seedServicesAndBookings()
    .then(() => {
      console.log('✨ Services and bookings seeding completed!');
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedServicesAndBookings };