// prisma/seedProfessionals.ts
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  /* ──────────────────────────────────────
   *  1) Construimos los 44 profesionales
   *     – userId 21‒64  (ambos inclusive)
   *     – description / experience simples
   *     – locationId: null (puedes asignar
   *       más tarde si ya sembraste Location)
   * ────────────────────────────────────── */
  const professionals = [];

  for (let userId = 21; userId <= 64; userId++) {
    professionals.push({
      userId,
      description: `Descripción del profesional #${userId}`,
      experience: (userId % 10) + 1, // 1‒10 años de experiencia
      locationId: null, // o asigna un ID válido
    });
  }

  /* ──────────────────────────────────────
   *  2) Inserción masiva
   *     – createMany ignora la PK "id"
   *       (se autoincrementa)
   *     – skipDuplicates evita error si
   *       se corre el seed varias veces
   * ────────────────────────────────────── */
  await prisma.professional.createMany({
    data: professionals,
    skipDuplicates: true,
  });

  console.log("✅ 44 profesionales sembrados");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
