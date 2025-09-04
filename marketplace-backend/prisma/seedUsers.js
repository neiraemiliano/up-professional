const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const adminUsers = [
  {
    name: 'Admin',
    lastName: 'Principal',
    email: 'admin@homefixed.com',
    phone: '+54911234567',
    password: 'admin123',
    role: 'admin',
    isVerified: true
  },
  {
    name: 'Super',
    lastName: 'Admin',
    email: 'superadmin@homefixed.com',
    phone: '+54911234568',
    password: 'superadmin123',
    role: 'admin',
    isVerified: true
  }
];

const customerUsers = [
  {
    name: 'María',
    lastName: 'González',
    email: 'maria.gonzalez@gmail.com',
    phone: '+54911555001',
    password: 'cliente123',
    role: 'customer',
    isVerified: true
  },
  {
    name: 'Carlos',
    lastName: 'Rodríguez',
    email: 'carlos.rodriguez@gmail.com',
    phone: '+54911555002',
    password: 'cliente123',
    role: 'customer',
    isVerified: true
  },
  {
    name: 'Ana',
    lastName: 'Martínez',
    email: 'ana.martinez@gmail.com',
    phone: '+54911555003',
    password: 'cliente123',
    role: 'customer',
    isVerified: true
  },
  {
    name: 'Diego',
    lastName: 'López',
    email: 'diego.lopez@gmail.com',
    phone: '+54911555004',
    password: 'cliente123',
    role: 'customer',
    isVerified: true
  },
  {
    name: 'Laura',
    lastName: 'Fernández',
    email: 'laura.fernandez@gmail.com',
    phone: '+54911555005',
    password: 'cliente123',
    role: 'customer',
    isVerified: false
  },
  {
    name: 'Roberto',
    lastName: 'Silva',
    email: 'roberto.silva@gmail.com',
    phone: '+54911555006',
    password: 'cliente123',
    role: 'customer',
    isVerified: true
  },
  {
    name: 'Patricia',
    lastName: 'García',
    email: 'patricia.garcia@gmail.com',
    phone: '+54911555007',
    password: 'cliente123',
    role: 'customer',
    isVerified: true
  },
  {
    name: 'Fernando',
    lastName: 'Torres',
    email: 'fernando.torres@gmail.com',
    phone: '+54911555008',
    password: 'cliente123',
    role: 'customer',
    isVerified: true
  }
];

const professionalUsers = [
  {
    name: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@gmail.com',
    phone: '+54911444001',
    password: 'prof123',
    role: 'professional',
    isVerified: true
  },
  {
    name: 'Luis',
    lastName: 'García',
    email: 'luis.garcia@gmail.com',
    phone: '+54911444002',
    password: 'prof123',
    role: 'professional',
    isVerified: true
  },
  {
    name: 'Miguel',
    lastName: 'Rodríguez',
    email: 'miguel.rodriguez@gmail.com',
    phone: '+54911444003',
    password: 'prof123',
    role: 'professional',
    isVerified: true
  },
  {
    name: 'Pedro',
    lastName: 'López',
    email: 'pedro.lopez@gmail.com',
    phone: '+54911444004',
    password: 'prof123',
    role: 'professional',
    isVerified: true
  },
  {
    name: 'Ricardo',
    lastName: 'Martínez',
    email: 'ricardo.martinez@gmail.com',
    phone: '+54911444005',
    password: 'prof123',
    role: 'professional',
    isVerified: true
  },
  {
    name: 'Andrés',
    lastName: 'Sánchez',
    email: 'andres.sanchez@gmail.com',
    phone: '+54911444006',
    password: 'prof123',
    role: 'professional',
    isVerified: true
  },
  {
    name: 'Eduardo',
    lastName: 'Morales',
    email: 'eduardo.morales@gmail.com',
    phone: '+54911444007',
    password: 'prof123',
    role: 'professional',
    isVerified: true
  },
  {
    name: 'Javier',
    lastName: 'Herrera',
    email: 'javier.herrera@gmail.com',
    phone: '+54911444008',
    password: 'prof123',
    role: 'professional',
    isVerified: true
  },
  {
    name: 'Daniel',
    lastName: 'Castro',
    email: 'daniel.castro@gmail.com',
    phone: '+54911444009',
    password: 'prof123',
    role: 'professional',
    isVerified: true
  },
  {
    name: 'Alberto',
    lastName: 'Vargas',
    email: 'alberto.vargas@gmail.com',
    phone: '+54911444010',
    password: 'prof123',
    role: 'professional',
    isVerified: true
  },
  {
    name: 'Oscar',
    lastName: 'Ramírez',
    email: 'oscar.ramirez@gmail.com',
    phone: '+54911444011',
    password: 'prof123',
    role: 'professional',
    isVerified: true
  },
  {
    name: 'Sergio',
    lastName: 'Jiménez',
    email: 'sergio.jimenez@gmail.com',
    phone: '+54911444012',
    password: 'prof123',
    role: 'professional',
    isVerified: true
  },
  {
    name: 'Alejandro',
    lastName: 'Cruz',
    email: 'alejandro.cruz@gmail.com',
    phone: '+54911444013',
    password: 'prof123',
    role: 'professional',
    isVerified: false
  },
  {
    name: 'Raúl',
    lastName: 'Mendoza',
    email: 'raul.mendoza@gmail.com',
    phone: '+54911444014',
    password: 'prof123',
    role: 'professional',
    isVerified: true
  },
  {
    name: 'Gustavo',
    lastName: 'Flores',
    email: 'gustavo.flores@gmail.com',
    phone: '+54911444015',
    password: 'prof123',
    role: 'professional',
    isVerified: true
  }
];

async function seedUsers() {
  console.log('🌱 Seeding users...');

  try {
    // Hash all passwords
    const hashPassword = async (password) => {
      return await bcrypt.hash(password, 10);
    };

    // Seed admin users
    for (const admin of adminUsers) {
      const hashedPassword = await hashPassword(admin.password);
      await prisma.user.upsert({
        where: { email: admin.email },
        update: {},
        create: {
          ...admin,
          password: hashedPassword
        }
      });
    }

    // Seed customer users
    for (const customer of customerUsers) {
      const hashedPassword = await hashPassword(customer.password);
      await prisma.user.upsert({
        where: { email: customer.email },
        update: {},
        create: {
          ...customer,
          password: hashedPassword
        }
      });
    }

    // Seed professional users
    for (const professional of professionalUsers) {
      const hashedPassword = await hashPassword(professional.password);
      await prisma.user.upsert({
        where: { email: professional.email },
        update: {},
        create: {
          ...professional,
          password: hashedPassword
        }
      });
    }

    console.log(`✅ ${adminUsers.length} admin users seeded`);
    console.log(`✅ ${customerUsers.length} customer users seeded`);
    console.log(`✅ ${professionalUsers.length} professional users seeded`);

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
}

if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('✨ User seeding completed!');
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedUsers };