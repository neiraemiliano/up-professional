// prisma/seedReviews.ts
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* ───────── Configuración ───────── */
const PROFESSIONAL_FIRST = 1;
const PROFESSIONAL_LAST = 44;

const REVIEWER_IDS = Array.from({ length: 12 }, (_, i) => i + 9); // 9‑20
const REVIEWS_PER_PRO = 3; // cuántas reseñas tendrá cada profesional (≤ 12)

/* Devuelve un array de userId (clientes) distinto por profesional */
function reviewersForProfessional(index) {
  const reviewers = [];
  let offset = index; // simple rotación determinista
  while (reviewers.length < REVIEWS_PER_PRO) {
    const id = REVIEWER_IDS[offset % REVIEWER_IDS.length];
    if (!reviewers.includes(id)) reviewers.push(id);
    offset++;
  }
  return reviewers;
}

async function main() {
  const reviews = [];

  for (let proId = PROFESSIONAL_FIRST; proId <= PROFESSIONAL_LAST; proId++) {
    const reviewers = reviewersForProfessional(proId);

    reviewers.forEach((userId, idx) => {
      const rating = ((proId + idx) % 5) + 1; // rota 1‑5
      reviews.push({
        userId,
        professionalId: proId,
        rating,
        comment: `Comentario ${
          idx + 1
        } del cliente ${userId} sobre el profesional ${proId}`,
      });
    });
  }

  await prisma.review.createMany({
    data: reviews,
    skipDuplicates: true,
  });

  console.log(`✅  Sembradas ${reviews.length} reviews (clientes 9‑20)`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
