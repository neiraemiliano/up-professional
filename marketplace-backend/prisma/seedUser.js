// prisma/seedUsers.ts
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();
const PASSWORD_PLAIN = "123456";
const SALT_ROUNDS = 10;

async function main() {
  // 1) Hash único para todos (cámbialo si quieres contraseñas distintas)
  const passwordHash = await bcrypt.hash(PASSWORD_PLAIN, SALT_ROUNDS);

  // 2) Construimos el array de usuarios
  const users = [];

  // ── Admin (1) ───────────────────────────
  users.push({
    name: "Admin",
    lastName: "Root",
    email: "admin@example.com",
    password: passwordHash,
    role: "admin",
  });

  // ── Clientes (5) ────────────────────────
  for (let i = 1; i <= 5; i++) {
    users.push({
      name: `Customer${i}`,
      lastName: `User${i}`,
      email: `customer${i}@example.com`,
      password: passwordHash,
      role: "customer",
    });
  }

  // ── Profesionales (44) ──────────────────
  for (let i = 1; i <= 44; i++) {
    users.push({
      name: `Pro${i}`,
      lastName: `User${i}`,
      email: `pro${i}@example.com`,
      password: passwordHash,
      role: "professional",
    });
  }

  // 3) Inserción masiva
  await prisma.user.createMany({
    data: users,
    skipDuplicates: true, // si lo corres dos veces, no revienta
  });

  console.log(`✅  Sembrados ${users.length} usuarios`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
