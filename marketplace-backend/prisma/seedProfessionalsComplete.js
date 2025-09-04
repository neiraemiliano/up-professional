const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const professionalProfiles = [
  {
    email: 'juan.perez@gmail.com',
    description: 'Plomero con más de 10 años de experiencia en instalaciones residenciales y comerciales.',
    experience: 10,
    bio: 'Especialista en destapaciones urgentes, instalación de griferías y reparación de calderas. Trabajo con materiales de primera calidad y ofrezco garantía en todos mis trabajos.',
    priceFrom: 3500,
    avgRating: 4.8,
    completedJobs: 156,
    respondsQuickly: true,
    isVerified: true,
    supportsUrgent: true,
    latitude: -34.6118,
    longitude: -58.3960,
    workingHours: 'Lun-Vie 8:00-18:00, Sáb 8:00-13:00',
    emergencyService: true,
    insurance: 'ART cubierta hasta $2.000.000',
    responseTime: 25,
    satisfactionRate: 96.5,
    languages: ['Español'],
    subscriptionPlan: 'premium',
    isPriority: true,
    isFeatured: true,
    monthlyLeadLimit: 50,
    locationName: 'Capital Federal'
  },
  {
    email: 'luis.garcia@gmail.com',
    description: 'Electricista matriculado especializado en instalaciones domiciliarias e industriales.',
    experience: 8,
    bio: 'Técnico electricista con matrícula provincial. Especializado en sistemas LED, automatización del hogar y tableros eléctricos. Disponible para emergencias 24/7.',
    priceFrom: 4000,
    avgRating: 4.9,
    completedJobs: 203,
    respondsQuickly: true,
    isVerified: true,
    supportsUrgent: true,
    latitude: -34.5875,
    longitude: -58.4206,
    workingHours: 'Lun-Dom 7:00-22:00',
    emergencyService: true,
    insurance: 'Seguro de responsabilidad civil hasta $3.000.000',
    responseTime: 15,
    satisfactionRate: 98.2,
    languages: ['Español', 'Inglés'],
    subscriptionPlan: 'pro',
    isPriority: true,
    isFeatured: true,
    monthlyLeadLimit: 100,
    locationName: 'Palermo'
  },
  {
    email: 'miguel.rodriguez@gmail.com',
    description: 'Carpintero especializado en muebles a medida y restauración.',
    experience: 12,
    bio: 'Maestro carpintero con taller propio. Diseño y fabricación de muebles a medida, restauración de antigüedades y trabajos de ebanistería fina. Uso maderas selectas.',
    priceFrom: 5000,
    avgRating: 4.7,
    completedJobs: 89,
    respondsQuickly: false,
    isVerified: true,
    supportsUrgent: false,
    latitude: -34.5627,
    longitude: -58.4548,
    workingHours: 'Lun-Vie 8:00-17:00',
    emergencyService: false,
    insurance: 'Cobertura de taller hasta $1.500.000',
    responseTime: 45,
    satisfactionRate: 94.1,
    languages: ['Español'],
    subscriptionPlan: 'premium',
    isPriority: true,
    isFeatured: false,
    monthlyLeadLimit: 30,
    locationName: 'Belgrano'
  },
  {
    email: 'pedro.lopez@gmail.com',
    description: 'Pintor profesional con especialización en pintura decorativa.',
    experience: 6,
    bio: 'Pintor profesional especializado en técnicas decorativas, empapelado y trabajos en altura. Uso pinturas ecológicas y de alta durabilidad.',
    priceFrom: 3000,
    avgRating: 4.6,
    completedJobs: 124,
    respondsQuickly: true,
    isVerified: true,
    supportsUrgent: true,
    latitude: -34.6188,
    longitude: -58.4394,
    workingHours: 'Lun-Sáb 7:00-16:00',
    emergencyService: false,
    insurance: 'Seguro contra accidentes laborales',
    responseTime: 30,
    satisfactionRate: 92.8,
    languages: ['Español'],
    subscriptionPlan: 'premium',
    isPriority: false,
    isFeatured: false,
    monthlyLeadLimit: 40,
    locationName: 'Caballito'
  },
  {
    email: 'ricardo.martinez@gmail.com',
    description: 'Gasista matriculado para instalaciones domiciliarias.',
    experience: 15,
    bio: 'Gasista matriculado con amplia experiencia en instalaciones de gas natural, GLP y reparación de artefactos. Certificado por Enargas.',
    priceFrom: 5000,
    avgRating: 4.9,
    completedJobs: 178,
    respondsQuickly: true,
    isVerified: true,
    supportsUrgent: true,
    latitude: -34.6027,
    longitude: -58.4374,
    workingHours: 'Lun-Vie 8:00-18:00',
    emergencyService: true,
    insurance: 'Cobertura integral hasta $5.000.000',
    responseTime: 20,
    satisfactionRate: 97.5,
    languages: ['Español'],
    subscriptionPlan: 'pro',
    isPriority: true,
    isFeatured: true,
    monthlyLeadLimit: 80,
    locationName: 'Villa Crespo'
  },
  {
    email: 'andres.sanchez@gmail.com',
    description: 'Técnico en aire acondicionado y climatización.',
    experience: 9,
    bio: 'Técnico especializado en instalación, mantenimiento y reparación de equipos de aire acondicionado. Trabajo con todas las marcas y modelos.',
    priceFrom: 8000,
    avgRating: 4.8,
    completedJobs: 145,
    respondsQuickly: true,
    isVerified: true,
    supportsUrgent: true,
    latitude: -34.6213,
    longitude: -58.3727,
    workingHours: 'Lun-Vie 8:00-19:00, Sáb 9:00-13:00',
    emergencyService: true,
    insurance: 'ART y seguro de equipos',
    responseTime: 35,
    satisfactionRate: 95.3,
    languages: ['Español'],
    subscriptionPlan: 'premium',
    isPriority: true,
    isFeatured: false,
    monthlyLeadLimit: 45,
    locationName: 'San Telmo'
  },
  {
    email: 'eduardo.morales@gmail.com',
    description: 'Cerrajero 24hs especializado en seguridad.',
    experience: 7,
    bio: 'Cerrajero disponible las 24 horas. Apertura de puertas, instalación de cerraduras de seguridad, blindajes y sistemas de acceso.',
    priceFrom: 3000,
    avgRating: 4.5,
    completedJobs: 267,
    respondsQuickly: true,
    isVerified: true,
    supportsUrgent: true,
    latitude: -34.5889,
    longitude: -58.3963,
    workingHours: 'Disponible 24/7',
    emergencyService: true,
    insurance: 'Seguro de responsabilidad civil',
    responseTime: 18,
    satisfactionRate: 91.7,
    languages: ['Español'],
    subscriptionPlan: 'premium',
    isPriority: true,
    isFeatured: false,
    monthlyLeadLimit: 60,
    locationName: 'Recoleta'
  },
  {
    email: 'javier.herrera@gmail.com',
    description: 'Albañil especializado en reformas y ampliaciones.',
    experience: 14,
    bio: 'Maestro mayor de obra especializado en construcción, reformas integrales, ampliaciones y trabajos de albañilería en general.',
    priceFrom: 6000,
    avgRating: 4.7,
    completedJobs: 95,
    respondsQuickly: false,
    isVerified: true,
    supportsUrgent: false,
    latitude: -34.6037,
    longitude: -58.3816,
    workingHours: 'Lun-Vie 7:00-16:00',
    emergencyService: false,
    insurance: 'ART construcción hasta $3.000.000',
    responseTime: 60,
    satisfactionRate: 93.4,
    languages: ['Español'],
    subscriptionPlan: 'premium',
    isPriority: false,
    isFeatured: false,
    monthlyLeadLimit: 25,
    locationName: 'Microcentro'
  },
  {
    email: 'daniel.castro@gmail.com',
    description: 'Jardinero paisajista con diseño de espacios verdes.',
    experience: 5,
    bio: 'Diseñador de jardines y especialista en mantenimiento de espacios verdes. Poda de árboles, sistemas de riego y paisajismo.',
    priceFrom: 2500,
    avgRating: 4.4,
    completedJobs: 73,
    respondsQuickly: true,
    isVerified: true,
    supportsUrgent: false,
    latitude: -34.6105,
    longitude: -58.3635,
    workingHours: 'Lun-Sáb 8:00-16:00',
    emergencyService: false,
    insurance: 'Seguro básico',
    responseTime: 40,
    satisfactionRate: 89.6,
    languages: ['Español'],
    subscriptionPlan: 'free',
    isPriority: false,
    isFeatured: false,
    monthlyLeadLimit: 15,
    locationName: 'Puerto Madero'
  },
  {
    email: 'alberto.vargas@gmail.com',
    description: 'Técnico en electrodomésticos y reparaciones.',
    experience: 11,
    bio: 'Técnico especializado en reparación de electrodomésticos: heladeras, lavarropas, lavavajillas, hornos y microondas. Service autorizado.',
    priceFrom: 4000,
    avgRating: 4.6,
    completedJobs: 189,
    respondsQuickly: true,
    isVerified: true,
    supportsUrgent: true,
    latitude: -34.6345,
    longitude: -58.3635,
    workingHours: 'Lun-Vie 9:00-18:00, Sáb 9:00-13:00',
    emergencyService: false,
    insurance: 'Cobertura de repuestos y mano de obra',
    responseTime: 25,
    satisfactionRate: 94.8,
    languages: ['Español'],
    subscriptionPlan: 'premium',
    isPriority: false,
    isFeatured: false,
    monthlyLeadLimit: 35,
    locationName: 'La Boca'
  },
  {
    email: 'oscar.ramirez@gmail.com',
    description: 'Soldador especializado en estructuras metálicas.',
    experience: 13,
    bio: 'Soldador profesional especializado en soldadura eléctrica, MIG y TIG. Fabricación de rejas, portones y estructuras metálicas.',
    priceFrom: 5000,
    avgRating: 4.8,
    completedJobs: 67,
    respondsQuickly: false,
    isVerified: true,
    supportsUrgent: false,
    latitude: -34.5267,
    longitude: -58.4754,
    workingHours: 'Lun-Vie 8:00-17:00',
    emergencyService: false,
    insurance: 'Seguro industrial completo',
    responseTime: 50,
    satisfactionRate: 96.1,
    languages: ['Español'],
    subscriptionPlan: 'premium',
    isPriority: false,
    isFeatured: true,
    monthlyLeadLimit: 30,
    locationName: 'Vicente López'
  },
  {
    email: 'sergio.jimenez@gmail.com',
    description: 'Vidriero con instalación y reparación de vidrios.',
    experience: 8,
    bio: 'Especialista en vidriería: instalación de ventanas, mamparas de baño, espejos, vidrios de seguridad y templados.',
    priceFrom: 3500,
    avgRating: 4.5,
    completedJobs: 112,
    respondsQuickly: true,
    isVerified: true,
    supportsUrgent: true,
    latitude: -34.5089,
    longitude: -58.4858,
    workingHours: 'Lun-Vie 8:00-17:00, Sáb 8:00-12:00',
    emergencyService: true,
    insurance: 'Cobertura de cristales',
    responseTime: 30,
    satisfactionRate: 92.3,
    languages: ['Español'],
    subscriptionPlan: 'premium',
    isPriority: false,
    isFeatured: false,
    monthlyLeadLimit: 40,
    locationName: 'Olivos'
  },
  {
    email: 'alejandro.cruz@gmail.com',
    description: 'Personal de limpieza especializado en limpieza profunda.',
    experience: 3,
    bio: 'Servicio de limpieza profesional para hogares y oficinas. Limpieza profunda, post obra, desinfección y mantenimiento.',
    priceFrom: 2000,
    avgRating: 4.3,
    completedJobs: 156,
    respondsQuickly: true,
    isVerified: false,
    supportsUrgent: true,
    latitude: -34.4919,
    longitude: -58.5070,
    workingHours: 'Lun-Sáb 8:00-18:00',
    emergencyService: false,
    insurance: 'Seguro básico',
    responseTime: 35,
    satisfactionRate: 87.9,
    languages: ['Español'],
    subscriptionPlan: 'free',
    isPriority: false,
    isFeatured: false,
    monthlyLeadLimit: 10,
    locationName: 'Martínez'
  },
  {
    email: 'raul.mendoza@gmail.com',
    description: 'Techista especializado en impermeabilizaciones.',
    experience: 16,
    bio: 'Especialista en techos: impermeabilizaciones, reparación de goteras, instalación de membranas y trabajos en altura.',
    priceFrom: 8000,
    avgRating: 4.9,
    completedJobs: 84,
    respondsQuickly: false,
    isVerified: true,
    supportsUrgent: true,
    latitude: -34.4708,
    longitude: -58.5269,
    workingHours: 'Lun-Vie 7:00-15:00',
    emergencyService: true,
    insurance: 'Seguro de altura y ART',
    responseTime: 40,
    satisfactionRate: 97.8,
    languages: ['Español'],
    subscriptionPlan: 'pro',
    isPriority: true,
    isFeatured: true,
    monthlyLeadLimit: 50,
    locationName: 'San Isidro'
  },
  {
    email: 'gustavo.flores@gmail.com',
    description: 'Servicio de mudanzas y transporte.',
    experience: 7,
    bio: 'Empresa de mudanzas con camiones equipados y personal especializado. Mudanzas locales e inteprovinciales, embalaje y guardamuebles.',
    priceFrom: 12000,
    avgRating: 4.4,
    completedJobs: 234,
    respondsQuickly: true,
    isVerified: true,
    supportsUrgent: true,
    latitude: -34.4264,
    longitude: -58.5797,
    workingHours: 'Lun-Sáb 6:00-20:00',
    emergencyService: false,
    insurance: 'Cobertura total de mercadería',
    responseTime: 45,
    satisfactionRate: 90.5,
    languages: ['Español'],
    subscriptionPlan: 'premium',
    isPriority: false,
    isFeatured: false,
    monthlyLeadLimit: 40,
    locationName: 'Tigre'
  }
];

async function seedProfessionals() {
  console.log('🌱 Seeding professionals...');

  try {
    // Get users, locations and categories
    const users = await prisma.user.findMany({
      where: { role: 'professional' }
    });

    const locations = await prisma.location.findMany();
    const categories = await prisma.category.findMany();
    const specialties = await prisma.specialty.findMany({
      include: { Category: true }
    });

    // Create professional profiles
    for (const profile of professionalProfiles) {
      const user = users.find(u => u.email === profile.email);
      const location = locations.find(l => l.city === profile.locationName);
      
      if (user && location) {
        const professional = await prisma.professional.upsert({
          where: { userId: user.id },
          update: {
            description: profile.description,
            experience: profile.experience,
            bio: profile.bio,
            priceFrom: profile.priceFrom,
            avgRating: profile.avgRating,
            completedJobs: profile.completedJobs,
            respondsQuickly: profile.respondsQuickly,
            isVerified: profile.isVerified,
            supportsUrgent: profile.supportsUrgent,
            latitude: profile.latitude,
            longitude: profile.longitude,
            workingHours: profile.workingHours,
            emergencyService: profile.emergencyService,
            insurance: profile.insurance,
            responseTime: profile.responseTime,
            satisfactionRate: profile.satisfactionRate,
            languages: profile.languages,
            subscriptionPlan: profile.subscriptionPlan,
            isPriority: profile.isPriority,
            isFeatured: profile.isFeatured,
            monthlyLeadLimit: profile.monthlyLeadLimit,
            locationId: location.id
          },
          create: {
            userId: user.id,
            description: profile.description,
            experience: profile.experience,
            bio: profile.bio,
            priceFrom: profile.priceFrom,
            avgRating: profile.avgRating,
            completedJobs: profile.completedJobs,
            respondsQuickly: profile.respondsQuickly,
            isVerified: profile.isVerified,
            supportsUrgent: profile.supportsUrgent,
            latitude: profile.latitude,
            longitude: profile.longitude,
            workingHours: profile.workingHours,
            emergencyService: profile.emergencyService,
            insurance: profile.insurance,
            responseTime: profile.responseTime,
            satisfactionRate: profile.satisfactionRate,
            languages: profile.languages,
            subscriptionPlan: profile.subscriptionPlan,
            isPriority: profile.isPriority,
            isFeatured: profile.isFeatured,
            monthlyLeadLimit: profile.monthlyLeadLimit,
            locationId: location.id
          }
        });

        // Assign random specialties based on their description
        const profSpecialties = specialties.filter(s => 
          profile.description.toLowerCase().includes(s.Category.name.toLowerCase()) ||
          profile.bio.toLowerCase().includes(s.name.toLowerCase())
        );

        // Add 1-3 relevant specialties
        const selectedSpecialties = profSpecialties.slice(0, Math.floor(Math.random() * 3) + 1);
        
        for (const specialty of selectedSpecialties) {
          await prisma.professionalSpecialty.upsert({
            where: {
              professionalId_specialtyId: {
                professionalId: professional.id,
                specialtyId: specialty.id
              }
            },
            update: {
              yearsExperience: Math.min(profile.experience, Math.floor(Math.random() * profile.experience) + 1),
              isMain: selectedSpecialties.indexOf(specialty) === 0
            },
            create: {
              professionalId: professional.id,
              specialtyId: specialty.id,
              yearsExperience: Math.min(profile.experience, Math.floor(Math.random() * profile.experience) + 1),
              isMain: selectedSpecialties.indexOf(specialty) === 0
            }
          });
        }

        console.log(`✅ Created professional profile for ${user.name} ${user.lastName}`);
      }
    }

    console.log(`✅ ${professionalProfiles.length} professional profiles seeded`);

  } catch (error) {
    console.error('❌ Error seeding professionals:', error);
    throw error;
  }
}

if (require.main === module) {
  seedProfessionals()
    .then(() => {
      console.log('✨ Professional seeding completed!');
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedProfessionals };