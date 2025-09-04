const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedPaymentConfig() {
  try {
    console.log('🏦 Seeding payment configuration...');

    // Crear configuración de comisiones
    const commissionConfig = await prisma.commissionConfig.upsert({
      where: { id: 1 },
      update: {
        serviceFeePercentage: 0.05,  // 5% comisión por servicios
        subscriptionFeePercentage: 0.0, // Sin comisión en suscripciones
        processingFeePercentage: 0.029, // ~3% fee de MercadoPago
        minCommission: 100, // Mínimo $100 ARS
        maxCommission: 5000, // Máximo $5000 ARS
        isActive: true
      },
      create: {
        id: 1,
        serviceFeePercentage: 0.05,
        subscriptionFeePercentage: 0.0,
        processingFeePercentage: 0.029,
        minCommission: 100,
        maxCommission: 5000,
        isActive: true
      }
    });

    console.log('✅ Commission config created:', {
      serviceFee: commissionConfig.serviceFeePercentage * 100 + '%',
      processingFee: commissionConfig.processingFeePercentage * 100 + '%',
      minCommission: '$' + commissionConfig.minCommission,
      maxCommission: '$' + commissionConfig.maxCommission
    });

    console.log('💡 Payment configuration ready for use!');

    console.log('🎯 Payment system seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log('- Commission configuration: Set up');
    console.log('- Payment system: Ready to process payments');
    console.log('- MercadoPago integration: Ready to configure');

  } catch (error) {
    console.error('❌ Error seeding payment data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed si se llama directamente
if (require.main === module) {
  seedPaymentConfig()
    .then(() => {
      console.log('🏁 Payment seed completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Payment seed failed:', error);
      process.exit(1);
    });
}

module.exports = { seedPaymentConfig };