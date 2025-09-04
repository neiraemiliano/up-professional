// prisma/seedLocations.js - Cargar locations de Argentina
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const file = path.join(__dirname, "data", "AR.csv");

const BATCH_SIZE = 500;
let batch = [];

async function seedLocations() {
  console.log("🌎 Iniciando carga de locations de Argentina...");
  
  const stream = fs
    .createReadStream(file)
    .pipe(csv({ headers: false, separator: "," }));

  let totalProcessed = 0;

  stream.on("data", async (rowObj) => {
    const [
      , // country_code ("AR")
      postalCode, // 1
      city, // 2
      province, // 3
      , , , , , // admin codes (no usados)
      lat, // 9
      lng, // 10
    ] = Object.values(rowObj);

    if (city && province) {
      batch.push({
        city: city.trim(),
        province: province.trim(),
        country: "Argentina",
        postalCode: postalCode || "",
        latitude: lat ? parseFloat(lat) : null,
        longitude: lng ? parseFloat(lng) : null,
      });

      if (batch.length >= BATCH_SIZE) {
        stream.pause();
        
        try {
          await prisma.location.createMany({
            data: batch,
            skipDuplicates: true,
          });
          totalProcessed += batch.length;
          console.log(`📍 Procesadas ${totalProcessed} locations...`);
        } catch (error) {
          console.error("Error insertando batch:", error.message);
        }
        
        batch = [];
        stream.resume();
      }
    }
  });

  stream.on("end", async () => {
    if (batch.length) {
      try {
        await prisma.location.createMany({
          data: batch,
          skipDuplicates: true,
        });
        totalProcessed += batch.length;
      } catch (error) {
        console.error("Error insertando último batch:", error.message);
      }
    }
    
    console.log(`✅ Seed de locations completado! Total: ${totalProcessed} locations`);
    
    // Mostrar algunas estadísticas
    const totalLocations = await prisma.location.count();
    const provinces = await prisma.location.groupBy({
      by: ['province'],
      _count: { province: true },
      orderBy: { _count: { province: 'desc' } },
      take: 10
    });
    
    console.log(`📊 Total locations en BD: ${totalLocations}`);
    console.log("🏛️ Top provincias:");
    provinces.forEach(p => {
      console.log(`   ${p.province}: ${p._count.province} ciudades`);
    });
    
    await prisma.$disconnect();
  });

  stream.on("error", (err) => {
    console.error("❌ Error leyendo archivo CSV:", err);
    process.exit(1);
  });
}

seedLocations();