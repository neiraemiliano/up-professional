// prisma/seedBasicProfessionals.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedBasicProfessionals() {
  console.log("👔 Creando profesionales básicos...");
  
  try {
    // Get some Buenos Aires locations
    const buenosAiresLocations = await prisma.location.findMany({
      where: { province: "Buenos Aires" },
      take: 20
    });
    
    // Get some categories
    const categories = await prisma.category.findMany();
    
    // Get professional users (users with role 'professional')
    const professionalUsers = await prisma.user.findMany({
      where: { role: 'professional' },
      take: 20
    });
    
    console.log(`📍 Encontradas ${buenosAiresLocations.length} locations de Buenos Aires`);
    console.log(`👥 Encontrados ${professionalUsers.length} usuarios profesionales`);
    console.log(`🏗️ Encontradas ${categories.length} categorías`);
    
    if (professionalUsers.length === 0) {
      console.log("⚠️ No hay usuarios con rol 'professional'. Ejecutar seedUser.js primero");
      return;
    }
    
    const professionals = [];
    
    for (let i = 0; i < Math.min(professionalUsers.length, 15); i++) {
      const user = professionalUsers[i];
      const location = buenosAiresLocations[i % buenosAiresLocations.length];
      
      professionals.push({
        userId: user.id,
        locationId: location?.id || null,
        description: `Profesional ${categories[i % categories.length]?.name || 'general'} con experiencia en ${location?.city || 'Buenos Aires'}`,
        experience: Math.floor(Math.random() * 15) + 1,
        bio: `Especialista en ${categories[i % categories.length]?.name || 'servicios generales'} con años de experiencia brindando servicios de calidad.`,
        priceFrom: Math.floor(Math.random() * 5000) + 2000,
        avgRating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Between 3.0 and 5.0
        completedJobs: Math.floor(Math.random() * 50) + 5,
        respondsQuickly: Math.random() > 0.3,
        isVerified: Math.random() > 0.4,
        supportsUrgent: Math.random() > 0.6,
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
        workingHours: "Lun-Vie 8:00-18:00, Sáb 9:00-15:00",
        emergencyService: Math.random() > 0.7,
        insurance: "Seguro de responsabilidad civil hasta $500.000",
        responseTime: Math.floor(Math.random() * 180) + 30, // 30-210 minutes
        satisfactionRate: Math.round((Math.random() * 20 + 80) * 10) / 10, // Between 80-100%
        languages: JSON.stringify(["Español"]),
        subscriptionPlan: "free",
        subscriptionStatus: "active"
      });
    }
    
    // Insert professionals
    await prisma.professional.createMany({
      data: professionals,
      skipDuplicates: true,
    });
    
    console.log(`✅ Creados ${professionals.length} profesionales`);
    
    // Create some services for these professionals
    console.log("🛠️ Creando servicios...");
    
    const createdProfessionals = await prisma.professional.findMany({
      take: 10
    });
    
    const services = [];
    for (const prof of createdProfessionals) {
      const numServices = Math.floor(Math.random() * 3) + 1; // 1-3 services per professional
      
      for (let j = 0; j < numServices; j++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        services.push({
          professionalId: prof.id,
          categoryId: category.id,
          title: `${category.name} profesional`,
          description: `Servicio de ${category.name.toLowerCase()} con garantía y materiales incluidos`,
          price: Math.floor(Math.random() * 8000) + 2000,
          priceType: Math.random() > 0.3 ? "hourly" : "fixed",
          estimatedTime: Math.random() > 0.5 ? "2-4 horas" : "1 día",
          includesMaterials: Math.random() > 0.4,
          isUrgentAvailable: Math.random() > 0.6,
          urgentSurcharge: Math.random() > 0.5 ? 0.25 : null
        });
      }
    }
    
    if (services.length > 0) {
      await prisma.service.createMany({
        data: services,
        skipDuplicates: true,
      });
      console.log(`✅ Creados ${services.length} servicios`);
    }
    
    // Show statistics
    const totalProfessionals = await prisma.professional.count();
    const totalServices = await prisma.service.count();
    const locationsWithProfessionals = await prisma.professional.groupBy({
      by: ['locationId'],
      _count: { locationId: true },
      where: { locationId: { not: null } }
    });
    
    console.log("📊 Estadísticas:");
    console.log(`   Total profesionales: ${totalProfessionals}`);
    console.log(`   Total servicios: ${totalServices}`);
    console.log(`   Locations con profesionales: ${locationsWithProfessionals.length}`);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedBasicProfessionals();