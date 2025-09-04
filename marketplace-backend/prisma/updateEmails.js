const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAdminEmails() {
  console.log('🔄 Updating admin emails to Home Fixed branding...');

  try {
    // Update admin email
    const admin = await prisma.user.update({
      where: { email: 'admin@upprofessional.com' },
      data: { email: 'admin@homefixed.com' }
    });
    console.log(`✅ Updated admin email: ${admin.email}`);

    // Update super admin email
    const superAdmin = await prisma.user.update({
      where: { email: 'superadmin@upprofessional.com' },
      data: { email: 'superadmin@homefixed.com' }
    });
    console.log(`✅ Updated super admin email: ${superAdmin.email}`);

    console.log('✨ Email update completed successfully!');

  } catch (error) {
    console.error('❌ Error updating emails:', error);
    throw error;
  }
}

updateAdminEmails()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });