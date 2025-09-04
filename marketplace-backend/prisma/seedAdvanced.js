const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedAdvancedFeatures() {
  console.log("🌱 Seeding advanced features...");

  try {
    // 1. Actualizar profesionales con nuevos campos
    console.log("📊 Updating professionals with new data...");
    
    const professionals = await prisma.professional.findMany();
    
    for (const prof of professionals) {
      await prisma.professional.update({
        where: { id: prof.id },
        data: {
          bio: `Profesional ${prof.User?.name || 'Experto'} con años de experiencia. Trabajo responsable y garantizado.`,
          priceFrom: Math.floor(Math.random() * 15000) + 8000, // 8000-23000
          avgRating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // 3.0-5.0
          completedJobs: Math.floor(Math.random() * 200) + 10, // 10-210
          respondsQuickly: Math.random() > 0.4, // 60% responde rápido
          isVerified: Math.random() > 0.3, // 70% verificados
          supportsUrgent: Math.random() > 0.5, // 50% soporta urgencias
          latitude: -34.6037 + (Math.random() - 0.5) * 0.1, // Buenos Aires area
          longitude: -58.3816 + (Math.random() - 0.5) * 0.1
        }
      });
    }

    // 2. Crear sugerencias de búsqueda
    console.log("🔍 Creating search suggestions...");
    
    const searchSuggestions = [
      // Electricista
      { categoryId: 1, text: "Instalar aire acondicionado split", icon: "❄️", estimatedTime: "3-4 horas", avgPrice: "$15000", isUrgent: false, popularity: 85 },
      { categoryId: 1, text: "Revisar tablero eléctrico", icon: "⚡", estimatedTime: "1-2 horas", avgPrice: "$8000", isUrgent: false, popularity: 72 },
      { categoryId: 1, text: "Se cortó la luz en toda la casa", icon: "💡", estimatedTime: "2-3 horas", avgPrice: "$12000", isUrgent: true, popularity: 90 },
      { categoryId: 1, text: "Instalar tomas nuevas en cocina", icon: "🔌", estimatedTime: "2-3 horas", avgPrice: "$10000", isUrgent: false, popularity: 45 },

      // Plomero  
      { categoryId: 2, text: "Destapación urgente de inodoro", icon: "🚽", estimatedTime: "30 min", avgPrice: "$5000", isUrgent: true, popularity: 95 },
      { categoryId: 2, text: "Pérdida de agua en caños", icon: "💧", estimatedTime: "2-4 horas", avgPrice: "$18000", isUrgent: true, popularity: 88 },
      { categoryId: 2, text: "Instalar termotanque nuevo", icon: "🔥", estimatedTime: "3-5 horas", avgPrice: "$25000", isUrgent: false, popularity: 60 },
      { categoryId: 2, text: "Cambiar canilla de cocina", icon: "🚿", estimatedTime: "1 hora", avgPrice: "$6000", isUrgent: false, popularity: 40 },

      // Gasista
      { categoryId: 3, text: "Revisar calefón que no enciende", icon: "🔥", estimatedTime: "1-2 horas", avgPrice: "$8000", isUrgent: true, popularity: 92 },
      { categoryId: 3, text: "Instalar estufa a gas nueva", icon: "🌡️", estimatedTime: "2-3 horas", avgPrice: "$15000", isUrgent: false, popularity: 55 },
      { categoryId: 3, text: "Revisión anual de gas", icon: "✅", estimatedTime: "1 hora", avgPrice: "$6000", isUrgent: false, popularity: 35 },
      { categoryId: 3, text: "Conexión de cocina nueva", icon: "🍳", estimatedTime: "2-3 horas", avgPrice: "$18000", isUrgent: false, popularity: 48 },

      // Carpintero
      { categoryId: 4, text: "Arreglar puerta que no cierra", icon: "🚪", estimatedTime: "1-2 horas", avgPrice: "$8000", isUrgent: false, popularity: 65 },
      { categoryId: 4, text: "Hacer mueble a medida", icon: "🔨", estimatedTime: "2-5 días", avgPrice: "$45000", isUrgent: false, popularity: 70 },
      { categoryId: 4, text: "Instalar estantes en pared", icon: "📚", estimatedTime: "2-3 horas", avgPrice: "$12000", isUrgent: false, popularity: 50 },

      // Pintor
      { categoryId: 5, text: "Pintar 2 habitaciones completas", icon: "🎨", estimatedTime: "2-3 días", avgPrice: "$45000", isUrgent: false, popularity: 80 },
      { categoryId: 5, text: "Pintura exterior de la casa", icon: "🏠", estimatedTime: "3-5 días", avgPrice: "$80000", isUrgent: false, popularity: 65 },
      { categoryId: 5, text: "Pintar living y comedor", icon: "🖌️", estimatedTime: "1-2 días", avgPrice: "$30000", isUrgent: false, popularity: 58 },
      { categoryId: 5, text: "Arreglar pintura con humedad", icon: "🔧", estimatedTime: "1 día", avgPrice: "$20000", isUrgent: false, popularity: 42 },

      // Albañil
      { categoryId: 6, text: "Arreglar humedad en pared", icon: "🧱", estimatedTime: "2-3 días", avgPrice: "$35000", isUrgent: false, popularity: 75 },
      { categoryId: 6, text: "Hacer contrapiso en balcón", icon: "🔨", estimatedTime: "3-4 días", avgPrice: "$50000", isUrgent: false, popularity: 62 },
      { categoryId: 6, text: "Revoque interior de habitación", icon: "🏗️", estimatedTime: "2-3 días", avgPrice: "$40000", isUrgent: false, popularity: 55 },
      { categoryId: 6, text: "Construir pared divisoria", icon: "🧱", estimatedTime: "4-5 días", avgPrice: "$70000", isUrgent: false, popularity: 48 }
    ];

    for (const suggestion of searchSuggestions) {
      // Verificar si ya existe esta sugerencia
      const existing = await prisma.searchSuggestion.findFirst({
        where: {
          categoryId: suggestion.categoryId,
          text: suggestion.text
        }
      });

      if (!existing) {
        await prisma.searchSuggestion.create({
          data: suggestion
        });
      }
    }

    // 3. Actualizar categorías con precios promedio
    console.log("💰 Updating categories with average prices...");
    
    const categoryPrices = {
      1: { avgPrice: 12000, priceRange: "8000-20000" }, // Electricista
      2: { avgPrice: 10000, priceRange: "5000-25000" }, // Plomero
      3: { avgPrice: 11000, priceRange: "6000-18000" }, // Gasista
      4: { avgPrice: 15000, priceRange: "8000-50000" }, // Carpintero
      5: { avgPrice: 35000, priceRange: "20000-80000" }, // Pintor
      6: { avgPrice: 40000, priceRange: "25000-70000" }, // Albañil
    };

    for (const [categoryId, prices] of Object.entries(categoryPrices)) {
      await prisma.category.update({
        where: { id: parseInt(categoryId) },
        data: prices
      });
    }

    // 4. Crear portfolio de muestra
    console.log("📸 Creating portfolio images...");
    
    const portfolioImages = [
      // Para algunos profesionales aleatorios
      { professionalId: 1, url: "/images/grid-image/image-01.png", title: "Instalación eléctrica completa", description: "Trabajo de instalación eléctrica en departamento de 3 ambientes.", orderIndex: 1 },
      { professionalId: 1, url: "/images/grid-image/image-02.png", title: "Tablero eléctrico nuevo", description: "Reemplazo completo de tablero antiguo.", orderIndex: 2 },
      
      { professionalId: 2, url: "/images/grid-image/image-03.png", title: "Reparación de pérdida", description: "Arreglo de pérdida en baño principal.", orderIndex: 1 },
      { professionalId: 2, url: "/images/grid-image/image-04.png", title: "Instalación termotanque", description: "Instalación completa de termotanque nuevo.", orderIndex: 2 },
      
      { professionalId: 3, url: "/images/grid-image/image-05.png", title: "Revisión de gas", description: "Mantenimiento anual completo.", orderIndex: 1 },
      
      { professionalId: 4, url: "/images/grid-image/image-06.png", title: "Mueble de cocina", description: "Mueble a medida para cocina integral.", orderIndex: 1 },
    ];

    for (const portfolio of portfolioImages) {
      // Verificar si ya existe esta imagen de portfolio
      const existing = await prisma.portfolioImage.findFirst({
        where: {
          professionalId: portfolio.professionalId,
          orderIndex: portfolio.orderIndex
        }
      });

      if (!existing) {
        await prisma.portfolioImage.create({
          data: portfolio
        });
      }
    }

    // 5. Crear horarios de disponibilidad
    console.log("⏰ Creating availability schedules...");
    
    const professionalIds = await prisma.professional.findMany({ select: { id: true } });
    
    for (const prof of professionalIds.slice(0, 5)) { // Solo primeros 5
      const schedule = [
        { dayOfWeek: 1, startTime: "08:00", endTime: "18:00" }, // Lunes
        { dayOfWeek: 2, startTime: "08:00", endTime: "18:00" }, // Martes
        { dayOfWeek: 3, startTime: "08:00", endTime: "18:00" }, // Miércoles
        { dayOfWeek: 4, startTime: "08:00", endTime: "18:00" }, // Jueves
        { dayOfWeek: 5, startTime: "08:00", endTime: "17:00" }, // Viernes
        { dayOfWeek: 6, startTime: "09:00", endTime: "13:00" }, // Sábado
      ];

      for (const slot of schedule) {
        // Verificar si ya existe este horario
        const existing = await prisma.availability.findFirst({
          where: {
            professionalId: prof.id,
            dayOfWeek: slot.dayOfWeek
          }
        });

        if (!existing) {
          await prisma.availability.create({
            data: {
              professionalId: prof.id,
              ...slot
            }
          });
        }
      }
    }

    // 6. Actualizar ubicaciones con coordenadas
    console.log("📍 Updating locations with coordinates...");
    
    const locations = await prisma.location.findMany();
    for (const location of locations.slice(0, 10)) { // Solo primeras 10
      await prisma.location.update({
        where: { id: location.id },
        data: {
          latitude: -34.6037 + (Math.random() - 0.5) * 0.5, // Área CABA/GBA
          longitude: -58.3816 + (Math.random() - 0.5) * 0.5
        }
      });
    }

    console.log("✅ Advanced features seeded successfully!");

  } catch (error) {
    console.error("❌ Error seeding advanced features:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Solo ejecutar si es llamado directamente
if (require.main === module) {
  seedAdvancedFeatures()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

module.exports = seedAdvancedFeatures;