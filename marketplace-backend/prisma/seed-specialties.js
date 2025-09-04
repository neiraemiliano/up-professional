const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const specialtiesData = [
  // Electricidad
  { name: "Instalaciones eléctricas", categoryName: "Electricidad", icon: "⚡", description: "Instalación de circuitos eléctricos residenciales y comerciales" },
  { name: "Sistemas LED", categoryName: "Electricidad", icon: "💡", description: "Instalación y mantenimiento de iluminación LED" },
  { name: "Domótica", categoryName: "Electricidad", icon: "🏠", description: "Sistemas de automatización del hogar" },
  { name: "Automatización", categoryName: "Electricidad", icon: "🤖", description: "Sistemas automatizados para hogares y comercios" },
  { name: "Tableros eléctricos", categoryName: "Electricidad", icon: "⚡", description: "Instalación y mantenimiento de tableros" },
  
  // Plomería
  { name: "Plomería general", categoryName: "Plomería", icon: "🔧", description: "Reparación e instalación de sistemas de plomería" },
  { name: "Destapaciones", categoryName: "Plomería", icon: "🚿", description: "Destapación de cañerías y desagües" },
  { name: "Instalación sanitarios", categoryName: "Plomería", icon: "🚽", description: "Instalación de inodoros, bidets y lavatorios" },
  { name: "Termotanques", categoryName: "Plomería", icon: "🔥", description: "Instalación y reparación de termotanques" },
  
  // Climatización
  { name: "Aires acondicionados", categoryName: "Climatización", icon: "❄️", description: "Instalación y reparación de equipos de AC" },
  { name: "Mantenimiento AC", categoryName: "Climatización", icon: "🔧", description: "Servicio técnico especializado en climatización" },
  { name: "Calefacción", categoryName: "Climatización", icon: "🔥", description: "Sistemas de calefacción y estufas" },
  
  // Carpintería
  { name: "Carpintería fina", categoryName: "Carpintería", icon: "🪚", description: "Trabajos de alta calidad en maderas finas" },
  { name: "Muebles a medida", categoryName: "Carpintería", icon: "🪑", description: "Diseño y fabricación de muebles personalizados" },
  { name: "Restauración", categoryName: "Carpintería", icon: "🎨", description: "Restauración de muebles antiguos y vintage" },
  { name: "Puertas y ventanas", categoryName: "Carpintería", icon: "🚪", description: "Instalación y reparación de aberturas" },
  
  // Construcción
  { name: "Albañilería", categoryName: "Construcción", icon: "🧱", description: "Trabajos de construcción y mampostería" },
  { name: "Pintura", categoryName: "Construcción", icon: "🎨", description: "Pintura interior y exterior" },
  { name: "Reformas", categoryName: "Construcción", icon: "🏗️", description: "Remodelaciones y reformas integrales" },
  { name: "Techos", categoryName: "Construcción", icon: "🏠", description: "Construcción y reparación de techos" },
  
  // Jardinería
  { name: "Paisajismo", categoryName: "Jardinería", icon: "🌱", description: "Diseño y mantenimiento de jardines" },
  { name: "Poda", categoryName: "Jardinería", icon: "✂️", description: "Poda de árboles y arbustos" },
  { name: "Riego automático", categoryName: "Jardinería", icon: "💧", description: "Sistemas de riego automatizado" },
  
  // Limpieza
  { name: "Limpieza general", categoryName: "Limpieza", icon: "🧽", description: "Limpieza profunda de hogares y oficinas" },
  { name: "Limpieza post obra", categoryName: "Limpieza", icon: "🏗️", description: "Limpieza especializada después de obras" },
  { name: "Alfombras y tapizados", categoryName: "Limpieza", icon: "🛋️", description: "Limpieza especializada de textiles" }
];

const certificationsData = [
  { name: "Matrícula Provincial", type: "license", issuer: "Colegio Profesional" },
  { name: "Seguridad Eléctrica", type: "certificate", issuer: "IRAM" },
  { name: "Domótica Avanzada", type: "training", issuer: "Instituto Tecnológico" },
  { name: "Soldadura Certificada", type: "certificate", issuer: "AWS" },
  { name: "Primeros Auxilios", type: "training", issuer: "Cruz Roja" },
  { name: "Manejo Seguro de Gas", type: "license", issuer: "Metrogas" },
  { name: "Instalador de Aire Acondicionado", type: "certificate", issuer: "CAIARA" },
  { name: "Carpintería Artística", type: "training", issuer: "Escuela de Artes y Oficios" }
];

async function seedSpecialtiesAndCertifications() {
  try {
    console.log('🌱 Seeding specialties and certifications...');

    // Obtener todas las categorías existentes
    const categories = await prisma.category.findMany();
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.name] = cat.id;
    });

    // Crear especialidades
    console.log('Creating specialties...');
    for (const specialty of specialtiesData) {
      const categoryId = categoryMap[specialty.categoryName] || null;
      
      await prisma.specialty.upsert({
        where: { name: specialty.name },
        update: {
          description: specialty.description,
          icon: specialty.icon,
          categoryId: categoryId
        },
        create: {
          name: specialty.name,
          description: specialty.description,
          icon: specialty.icon,
          categoryId: categoryId
        }
      });
    }

    // Crear certificaciones de ejemplo para profesionales existentes
    console.log('Creating sample certifications...');
    const professionals = await prisma.professional.findMany({ take: 10 });
    
    for (const professional of professionals) {
      // Crear 2-4 certificaciones por profesional
      const numCertifications = Math.floor(Math.random() * 3) + 2;
      const selectedCertifications = certificationsData
        .sort(() => 0.5 - Math.random())
        .slice(0, numCertifications);

      for (const cert of selectedCertifications) {
        await prisma.certification.create({
          data: {
            professionalId: professional.id,
            name: cert.name,
            type: cert.type,
            issuer: cert.issuer,
            issueDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000 * 5), // Últimos 5 años
            isVerified: Math.random() > 0.3 // 70% verificadas
          }
        });
      }

      // Asignar especialidades al profesional
      const numSpecialties = Math.floor(Math.random() * 4) + 1;
      const availableSpecialties = await prisma.specialty.findMany();
      const selectedSpecialties = availableSpecialties
        .sort(() => 0.5 - Math.random())
        .slice(0, numSpecialties);

      for (let i = 0; i < selectedSpecialties.length; i++) {
        const specialty = selectedSpecialties[i];
        await prisma.professionalSpecialty.create({
          data: {
            professionalId: professional.id,
            specialtyId: specialty.id,
            yearsExperience: Math.floor(Math.random() * 15) + 1,
            isMain: i === 0 // Primera especialidad es la principal
          }
        });
      }

      // Actualizar datos del profesional
      await prisma.professional.update({
        where: { id: professional.id },
        data: {
          experience: Math.floor(Math.random() * 20) + 1,
          workingHours: "Lun-Vie 8:00-18:00, Sáb 9:00-13:00",
          emergencyService: Math.random() > 0.6, // 40% ofrece servicio de emergencia
          insurance: "ART cubierta hasta $2.000.000",
          responseTime: Math.floor(Math.random() * 60) + 5, // 5-65 minutos
          satisfactionRate: 85 + Math.random() * 15, // 85-100%
          languages: JSON.stringify(
            Math.random() > 0.7 ? ["Español", "Inglés"] : ["Español"]
          )
        }
      });
    }

    console.log('✅ Seed completed successfully!');
    console.log(`Created ${specialtiesData.length} specialties`);
    console.log(`Updated ${professionals.length} professionals with certifications and specialties`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedSpecialtiesAndCertifications()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { seedSpecialtiesAndCertifications };