const { PrismaClient } = require('@prisma/client');
const { seedUsers } = require('./seedUsers');
const { seedLocations } = require('./seedLocationsComplete');
const { seedCategoriesAndServices } = require('./seedCategoriesServices');
const { seedProfessionals } = require('./seedProfessionalsComplete');
const { seedServicesAndBookings } = require('./seedServicesBookings');
const { seedReviewsAndPortfolios } = require('./seedReviewsPortfolios');
// seedContent will be imported inline due to its structure

const prisma = new PrismaClient();

async function seedAll() {
  console.log('🌱 Starting complete database seeding...');
  console.log('==================================================');

  try {
    // 1. Seed content (texts and announcements)
    console.log('\n📝 STEP 1: Seeding content...');
    // Run seedContent.js as subprocess since it has its own main execution
    const { exec } = require('child_process');
    await new Promise((resolve, reject) => {
      exec('node prisma/seedContent.js', (error, stdout, stderr) => {
        if (error) reject(error);
        else {
          console.log(stdout);
          resolve();
        }
      });
    });

    // 2. Seed locations
    console.log('\n📍 STEP 2: Seeding locations...');
    await seedLocations();

    // 3. Seed users (admins, customers, professionals)
    console.log('\n👥 STEP 3: Seeding users...');
    await seedUsers();

    // 4. Seed categories and services data
    console.log('\n🏷️ STEP 4: Seeding categories and services...');
    await seedCategoriesAndServices();

    // 5. Seed professional profiles
    console.log('\n👨‍🔧 STEP 5: Seeding professional profiles...');
    await seedProfessionals();

    // 6. Seed services and bookings
    console.log('\n🛠️ STEP 6: Seeding services and bookings...');
    await seedServicesAndBookings();

    // 7. Seed reviews and portfolios
    console.log('\n⭐ STEP 7: Seeding reviews and portfolios...');
    await seedReviewsAndPortfolios();

    // Show final statistics
    console.log('\n==================================================');
    console.log('📊 FINAL STATISTICS:');
    console.log('==================================================');

    const stats = {
      users: await prisma.user.count(),
      admins: await prisma.user.count({ where: { role: 'admin' } }),
      customers: await prisma.user.count({ where: { role: 'customer' } }),
      professionalUsers: await prisma.user.count({ where: { role: 'professional' } }),
      locations: await prisma.location.count(),
      categories: await prisma.category.count(),
      specialties: await prisma.specialty.count(),
      professionals: await prisma.professional.count(),
      services: await prisma.service.count(),
      bookings: await prisma.booking.count(),
      reviews: await prisma.review.count(),
      portfolioImages: await prisma.portfolioImage.count(),
      searchSuggestions: await prisma.searchSuggestion.count(),
      contentItems: await prisma.content.count(),
      announcements: await prisma.announcement.count()
    };

    console.log(`👥 Users: ${stats.users} total`);
    console.log(`   ├── Admins: ${stats.admins}`);
    console.log(`   ├── Customers: ${stats.customers}`);
    console.log(`   └── Professionals: ${stats.professionalUsers}`);
    console.log(`📍 Locations: ${stats.locations}`);
    console.log(`🏷️ Categories: ${stats.categories}`);
    console.log(`🎯 Specialties: ${stats.specialties}`);
    console.log(`👨‍🔧 Professional Profiles: ${stats.professionals}`);
    console.log(`🛠️ Services: ${stats.services}`);
    console.log(`📅 Bookings: ${stats.bookings}`);
    console.log(`⭐ Reviews: ${stats.reviews}`);
    console.log(`🖼️ Portfolio Images: ${stats.portfolioImages}`);
    console.log(`💡 Search Suggestions: ${stats.searchSuggestions}`);
    console.log(`📝 Content Items: ${stats.contentItems}`);
    console.log(`📢 Announcements: ${stats.announcements}`);

    console.log('\n==================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('==================================================');

    console.log('\n🎯 QUICK START CREDENTIALS:');
    console.log('==================================================');
    console.log('👑 ADMIN LOGIN:');
    console.log('   Email: admin@homefixed.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('👤 CUSTOMER LOGIN EXAMPLE:');
    console.log('   Email: maria.gonzalez@gmail.com');
    console.log('   Password: cliente123');
    console.log('');
    console.log('👨‍🔧 PROFESSIONAL LOGIN EXAMPLE:');
    console.log('   Email: juan.perez@gmail.com');
    console.log('   Password: prof123');
    console.log('==================================================');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

// Function to run individual seeds
async function seedContentOnly() {
  console.log('🌱 Seeding content only...');
  const { exec } = require('child_process');
  await new Promise((resolve, reject) => {
    exec('node prisma/seedContent.js', (error, stdout, stderr) => {
      if (error) reject(error);
      else {
        console.log(stdout);
        resolve();
      }
    });
  });
  console.log('✅ Content seeding completed!');
}

// Export functions
module.exports = {
  seedAll,
  seedContentOnly
};

// Run if called directly
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'content-only') {
    seedContentOnly()
      .catch((e) => {
        console.error(e);
        process.exit(1);
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
  } else {
    seedAll()
      .catch((e) => {
        console.error(e);
        process.exit(1);
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
  }
}