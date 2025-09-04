const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const subscriptionPlans = [
  {
    id: 'free',
    name: 'Plan Gratuito',
    description: 'Perfecto para empezar en la plataforma',
    price: 0,
    yearlyPrice: 0,
    monthlyLeadLimit: 5,
    isPriority: false,
    isFeatured: false,
    customBadge: null,
    features: JSON.stringify([
      'Perfil básico',
      'Hasta 5 contactos por mes',
      'Soporte por email',
      'Listado en búsquedas'
    ]),
    isActive: true
  },
  {
    id: 'premium',
    name: 'Plan Premium',
    description: 'Ideal para profesionales establecidos',
    price: 15999,
    yearlyPrice: 159990, // 10 meses (2 meses gratis)
    monthlyLeadLimit: 50,
    isPriority: true,
    isFeatured: false,
    customBadge: 'PREMIUM',
    features: JSON.stringify([
      'Todo lo del Plan Gratuito',
      'Hasta 50 contactos por mes',
      'Aparición prioritaria en búsquedas',
      'Badge Premium visible',
      'Estadísticas avanzadas',
      'Soporte prioritario',
      'WhatsApp business integration'
    ]),
    isActive: true
  },
  {
    id: 'pro',
    name: 'Plan Profesional',
    description: 'La opción más completa para profesionales serios',
    price: 29999,
    yearlyPrice: 299990, // 10 meses (2 meses gratis)
    monthlyLeadLimit: -1, // Ilimitado
    isPriority: true,
    isFeatured: true,
    customBadge: 'PRO',
    features: JSON.stringify([
      'Todo lo del Plan Premium',
      'Contactos ILIMITADOS',
      'Destacado con badge especial',
      'Aparición en primera posición',
      'Perfil destacado visualmente',
      'Acceso a clientes premium',
      'Manager de cuenta dedicado',
      'Reportes detallados',
      'API access para integraciones'
    ]),
    isActive: true
  }
];

async function main() {
  console.log('🌱 Seeding subscription plans...');
  
  for (const plan of subscriptionPlans) {
    await prisma.subscriptionPlan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    });
    console.log(`✅ Created/Updated plan: ${plan.name}`);
  }
  
  console.log('✨ Subscription plans seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });