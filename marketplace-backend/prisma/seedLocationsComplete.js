const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const locations = [
  // Capital Federal
  { city: 'Capital Federal', province: 'CABA', country: 'Argentina', postalCode: 'C1000', latitude: -34.6118, longitude: -58.3960 },
  { city: 'Palermo', province: 'CABA', country: 'Argentina', postalCode: 'C1414', latitude: -34.5875, longitude: -58.4206 },
  { city: 'Belgrano', province: 'CABA', country: 'Argentina', postalCode: 'C1426', latitude: -34.5627, longitude: -58.4548 },
  { city: 'Caballito', province: 'CABA', country: 'Argentina', postalCode: 'C1406', latitude: -34.6188, longitude: -58.4394 },
  { city: 'Villa Crespo', province: 'CABA', country: 'Argentina', postalCode: 'C1414', latitude: -34.6027, longitude: -58.4374 },
  { city: 'San Telmo', province: 'CABA', country: 'Argentina', postalCode: 'C1300', latitude: -34.6213, longitude: -58.3727 },
  { city: 'Recoleta', province: 'CABA', country: 'Argentina', postalCode: 'C1113', latitude: -34.5889, longitude: -58.3963 },
  { city: 'Microcentro', province: 'CABA', country: 'Argentina', postalCode: 'C1000', latitude: -34.6037, longitude: -58.3816 },
  { city: 'Puerto Madero', province: 'CABA', country: 'Argentina', postalCode: 'C1107', latitude: -34.6105, longitude: -58.3635 },
  { city: 'La Boca', province: 'CABA', country: 'Argentina', postalCode: 'C1169', latitude: -34.6345, longitude: -58.3635 },
  
  // Zona Norte GBA
  { city: 'Vicente López', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1602', latitude: -34.5267, longitude: -58.4754 },
  { city: 'Olivos', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1636', latitude: -34.5089, longitude: -58.4858 },
  { city: 'Martínez', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1640', latitude: -34.4919, longitude: -58.5070 },
  { city: 'San Isidro', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1642', latitude: -34.4708, longitude: -58.5269 },
  { city: 'Tigre', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1648', latitude: -34.4264, longitude: -58.5797 },
  { city: 'San Fernando', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1646', latitude: -34.4417, longitude: -58.5597 },
  { city: 'Acassuso', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1641', latitude: -34.4781, longitude: -58.5156 },
  { city: 'Béccar', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1643', latitude: -34.4619, longitude: -58.5339 },
  { city: 'Florida', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1602', latitude: -34.5322, longitude: -58.4989 },
  { city: 'Muñiz', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1605', latitude: -34.5183, longitude: -58.5089 },
  
  // Zona Sur GBA
  { city: 'Avellaneda', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1870', latitude: -34.6637, longitude: -58.3672 },
  { city: 'Quilmes', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1878', latitude: -34.7203, longitude: -58.2537 },
  { city: 'Berazategui', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1884', latitude: -34.7583, longitude: -58.2089 },
  { city: 'Florencio Varela', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1888', latitude: -34.8056, longitude: -58.2789 },
  { city: 'Lanús', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1824', latitude: -34.7069, longitude: -58.3931 },
  { city: 'Banfield', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1828', latitude: -34.7433, longitude: -58.3931 },
  { city: 'Lomas de Zamora', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1832', latitude: -34.7600, longitude: -58.4019 },
  { city: 'Temperley', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1834', latitude: -34.7669, longitude: -58.3997 },
  { city: 'Adrogué', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1846', latitude: -34.8017, longitude: -58.3894 },
  { city: 'Burzaco', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1852', latitude: -34.8244, longitude: -58.3889 },
  
  // Zona Oeste GBA
  { city: 'Morón', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1708', latitude: -34.6533, longitude: -58.6194 },
  { city: 'Castelar', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1712', latitude: -34.6550, longitude: -58.6497 },
  { city: 'Ituzaingó', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1714', latitude: -34.6583, longitude: -58.6736 },
  { city: 'Haedo', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1706', latitude: -34.6397, longitude: -58.5936 },
  { city: 'Ramos Mejía', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1704', latitude: -34.6422, longitude: -58.5664 },
  { city: 'Villa Ballester', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1653', latitude: -34.5547, longitude: -58.5506 },
  { city: 'San Martín', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1650', latitude: -34.5739, longitude: -58.5372 },
  { city: 'Villa Maipú', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1603', latitude: -34.5106, longitude: -58.5244 },
  { city: 'Caseros', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1678', latitude: -34.6058, longitude: -58.5656 },
  { city: 'Santos Lugares', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1676', latitude: -34.5947, longitude: -58.5500 },
  
  // La Plata y alrededores
  { city: 'La Plata', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1900', latitude: -34.9214, longitude: -57.9544 },
  { city: 'City Bell', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1896', latitude: -34.8708, longitude: -58.0422 },
  { city: 'Villa Elisa', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1894', latitude: -34.8453, longitude: -58.0856 },
  { city: 'Gonnet', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1897', latitude: -34.8556, longitude: -58.0272 },
  { city: 'Berisso', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1923', latitude: -34.8797, longitude: -57.8794 },
  { city: 'Ensenada', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B1925', latitude: -34.8669, longitude: -57.9022 },
  
  // Otras ciudades importantes de Buenos Aires
  { city: 'Mar del Plata', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B7600', latitude: -38.0055, longitude: -57.5426 },
  { city: 'Bahía Blanca', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B8000', latitude: -38.7183, longitude: -62.2669 },
  { city: 'Tandil', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B7000', latitude: -37.3217, longitude: -59.1332 },
  { city: 'Olavarría', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B7400', latitude: -36.8927, longitude: -60.3225 },
  { city: 'Pergamino', province: 'Buenos Aires', country: 'Argentina', postalCode: 'B2700', latitude: -33.8894, longitude: -60.5739 },
  
  // Córdoba
  { city: 'Córdoba', province: 'Córdoba', country: 'Argentina', postalCode: 'X5000', latitude: -31.4201, longitude: -64.1888 },
  { city: 'Villa Carlos Paz', province: 'Córdoba', country: 'Argentina', postalCode: 'X5152', latitude: -31.4244, longitude: -64.4978 },
  { city: 'Río Cuarto', province: 'Córdoba', country: 'Argentina', postalCode: 'X5800', latitude: -33.1307, longitude: -64.3499 },
  
  // Rosario
  { city: 'Rosario', province: 'Santa Fe', country: 'Argentina', postalCode: 'S2000', latitude: -32.9442, longitude: -60.6505 },
  { city: 'Santa Fe', province: 'Santa Fe', country: 'Argentina', postalCode: 'S3000', latitude: -31.6333, longitude: -60.7000 },
  
  // Mendoza
  { city: 'Mendoza', province: 'Mendoza', country: 'Argentina', postalCode: 'M5500', latitude: -32.8895, longitude: -68.8458 },
  { city: 'Godoy Cruz', province: 'Mendoza', country: 'Argentina', postalCode: 'M5501', latitude: -32.9267, longitude: -68.8431 },
  
  // Tucumán
  { city: 'San Miguel de Tucumán', province: 'Tucumán', country: 'Argentina', postalCode: 'T4000', latitude: -26.8083, longitude: -65.2176 },
  
  // Salta
  { city: 'Salta', province: 'Salta', country: 'Argentina', postalCode: 'A4400', latitude: -24.7821, longitude: -65.4232 }
];

async function seedLocations() {
  console.log('🌱 Seeding locations...');

  try {
    for (const location of locations) {
      const existing = await prisma.location.findFirst({
        where: {
          city: location.city,
          province: location.province
        }
      });

      if (!existing) {
        await prisma.location.create({
          data: location
        });
      }
    }

    console.log(`✅ ${locations.length} locations seeded`);

  } catch (error) {
    console.error('❌ Error seeding locations:', error);
    throw error;
  }
}

if (require.main === module) {
  seedLocations()
    .then(() => {
      console.log('✨ Location seeding completed!');
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

module.exports = { seedLocations };