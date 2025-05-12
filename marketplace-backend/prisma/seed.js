// // prisma/seed.js   (CommonJS)
// const fs = require("fs");
// const path = require("path");
// const csv = require("csv-parser");
// const { PrismaClient } = require("@prisma/client");

// const prisma = new PrismaClient();
// const file = path.join(__dirname, "data", "AR.csv"); // asegúrate de que existe

// const BATCH_SIZE = 500; // menor tamaño = menos memoria
// let batch = [];

// (async function seed() {
//   const stream = fs
//     .createReadStream(file)
//     .pipe(csv({ headers: false, separator: "," }));

//   stream.on("data", async (rowObj) => {
//     const [
//       ,
//       // 0  country_code ("AR")
//       postalCode, // 1
//       city, // 2
//       province, // 3 // 4‑8  admin codes (no usados)
//       ,
//       ,
//       ,
//       ,
//       ,
//       lat, // 9
//       lng, // 10
//     ] = Object.values(rowObj);

//     batch.push({
//       city,
//       province,
//       country: "Argentina",
//       postalCode,
//       // latitude: lat ? parseFloat(lat) : null,
//       // longitude: lng ? parseFloat(lng) : null,
//     });

//     if (batch.length >= BATCH_SIZE) {
//       stream.pause(); // ⏸️  detenemos la lectura
//       await prisma.location.createMany({
//         data: batch,
//         skipDuplicates: true,
//       });
//       batch = []; // limpiamos
//       stream.resume(); // ▶️  reanudamos
//     }
//   });

//   stream.on("end", async () => {
//     if (batch.length) {
//       await prisma.location.createMany({
//         data: batch,
//         skipDuplicates: true,
//       });
//     }
//     console.log("Seed completado ✅");
//     await prisma.$disconnect();
//   });

//   stream.on("error", (err) => {
//     console.error(err);
//     process.exit(1);
//   });
// })();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.category.createMany({
    data: [
      { id: 1, name: "Electricista", value: "electricista", icon: "plug-zap" },
      { id: 2, name: "Plomero", value: "plomero", icon: "wrench" },
      { id: 3, name: "Gasista", value: "gasista", icon: "flame" },
      { id: 4, name: "Carpintero", value: "carpintero", icon: "hammer" },
      { id: 5, name: "Pintor", value: "pintor", icon: "paint-roller" },
      { id: 6, name: "Albañil", value: "albanil", icon: "bricks" },
      { id: 7, name: "Jardinero", value: "jardinero", icon: "leaf" },
      { id: 8, name: "Techista", value: "techista", icon: "home-roof" },
      { id: 9, name: "Herrero", value: "herrero", icon: "anvil" },
      { id: 10, name: "Mecánico", value: "mecanico", icon: "car" },
      { id: 11, name: "Cerrajero", value: "cerrajero", icon: "lock-key" },
      { id: 12, name: "Fumigador", value: "fumigador", icon: "bug-off" },
      { id: 13, name: "Mudanzas", value: "mudanzas", icon: "truck" },
      { id: 14, name: "Informático", value: "informatico", icon: "monitor" },
      { id: 15, name: "Fotógrafo", value: "fotografo", icon: "camera" },
    ],
    skipDuplicates: true, // evita error si ya existen
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
