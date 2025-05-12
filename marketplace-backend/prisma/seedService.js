// prisma/seedServices.ts
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const CATEGORY_COUNT = 15; // IDs 1‒15
const SERVICES_PER_PRO = 3; // servicios distintos por profesional

// Devuelve un array de CATEGORY IDs (únicos) para un profesional
function categoriesForProfessional(proId) {
  const ids = [];
  for (let i = 0; i < SERVICES_PER_PRO; i++) {
    // Rotación determinista
    const catId = ((proId + i * 5) % CATEGORY_COUNT) + 1;
    if (!ids.includes(catId)) ids.push(catId);
  }
  return ids;
}

async function main() {
  const services = [];

  for (let proId = 1; proId <= 44; proId++) {
    const catIds = categoriesForProfessional(proId);

    catIds.forEach((catId) => {
      const price = 1000 + proId * 50 + catId * 20;
      services.push({
        professionalId: proId,
        categoryId: catId,
        title: `Servicio categoría ${catId} del profesional ${proId}`,
        description: `Descripción del servicio del profesional ${proId} en la categoría ${catId}`,
        price,
      });
    });
  }

  // Inserción masiva
  await prisma.service.createMany({
    data: services,
    skipDuplicates: true, // si ya existen no falla
  });

  console.log(`✅  Se crearon ${services.length} servicios`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
