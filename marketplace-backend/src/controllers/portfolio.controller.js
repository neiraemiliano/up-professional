const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class PortfolioController {
  // Obtener portfolio de un profesional
  async getPortfolio(req, res) {
    try {
      const { professionalId } = req.params;

      const portfolio = await prisma.portfolioImage.findMany({
        where: { professionalId: parseInt(professionalId) },
        orderBy: [
          { orderIndex: "asc" },
          { createdAt: "desc" }
        ]
      });

      res.json({ data: portfolio });
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Agregar imagen al portfolio (solo profesional dueño)
  async addPortfolioImage(req, res) {
    try {
      const professionalId = req.user.Professional?.id;
      
      if (!professionalId) {
        return res.status(403).json({ error: "Acceso solo para profesionales" });
      }

      const { url, title, description, orderIndex } = req.body;

      if (!url) {
        return res.status(400).json({ error: "URL de imagen es requerida" });
      }

      // Obtener el siguiente índice si no se especifica
      let finalOrderIndex = orderIndex;
      if (!orderIndex) {
        const lastImage = await prisma.portfolioImage.findFirst({
          where: { professionalId },
          orderBy: { orderIndex: "desc" }
        });
        finalOrderIndex = (lastImage?.orderIndex || 0) + 1;
      }

      const portfolioImage = await prisma.portfolioImage.create({
        data: {
          professionalId,
          url,
          title,
          description,
          orderIndex: finalOrderIndex
        }
      });

      res.status(201).json({
        success: true,
        data: portfolioImage,
        message: "Imagen agregada al portfolio"
      });

    } catch (error) {
      console.error("Error adding portfolio image:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Actualizar imagen del portfolio
  async updatePortfolioImage(req, res) {
    try {
      const { id } = req.params;
      const professionalId = req.user.Professional?.id;

      if (!professionalId) {
        return res.status(403).json({ error: "Acceso solo para profesionales" });
      }

      const { title, description, orderIndex } = req.body;

      // Verificar que la imagen pertenece al profesional
      const existingImage = await prisma.portfolioImage.findFirst({
        where: { 
          id: parseInt(id),
          professionalId 
        }
      });

      if (!existingImage) {
        return res.status(404).json({ error: "Imagen no encontrada" });
      }

      const updated = await prisma.portfolioImage.update({
        where: { id: parseInt(id) },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(orderIndex !== undefined && { orderIndex })
        }
      });

      res.json({
        success: true,
        data: updated,
        message: "Imagen actualizada"
      });

    } catch (error) {
      console.error("Error updating portfolio image:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Eliminar imagen del portfolio
  async deletePortfolioImage(req, res) {
    try {
      const { id } = req.params;
      const professionalId = req.user.Professional?.id;

      if (!professionalId) {
        return res.status(403).json({ error: "Acceso solo para profesionales" });
      }

      // Verificar que la imagen pertenece al profesional
      const existingImage = await prisma.portfolioImage.findFirst({
        where: { 
          id: parseInt(id),
          professionalId 
        }
      });

      if (!existingImage) {
        return res.status(404).json({ error: "Imagen no encontrada" });
      }

      await prisma.portfolioImage.delete({
        where: { id: parseInt(id) }
      });

      res.json({
        success: true,
        message: "Imagen eliminada del portfolio"
      });

    } catch (error) {
      console.error("Error deleting portfolio image:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Reordenar imágenes del portfolio
  async reorderPortfolio(req, res) {
    try {
      const professionalId = req.user.Professional?.id;
      
      if (!professionalId) {
        return res.status(403).json({ error: "Acceso solo para profesionales" });
      }

      const { imageOrders } = req.body; // Array de { id, orderIndex }

      if (!Array.isArray(imageOrders)) {
        return res.status(400).json({ error: "imageOrders debe ser un array" });
      }

      // Actualizar en una transacción
      await prisma.$transaction(
        imageOrders.map(({ id, orderIndex }) =>
          prisma.portfolioImage.update({
            where: { 
              id: parseInt(id),
              professionalId // Asegurar que pertenece al profesional
            },
            data: { orderIndex }
          })
        )
      );

      res.json({
        success: true,
        message: "Portfolio reordenado exitosamente"
      });

    } catch (error) {
      console.error("Error reordering portfolio:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Obtener estadísticas del portfolio
  async getPortfolioStats(req, res) {
    try {
      const professionalId = req.user.Professional?.id;
      
      if (!professionalId) {
        return res.status(403).json({ error: "Acceso solo para profesionales" });
      }

      const totalImages = await prisma.portfolioImage.count({
        where: { professionalId }
      });

      const imagesWithTitles = await prisma.portfolioImage.count({
        where: { 
          professionalId,
          title: { not: null }
        }
      });

      const imagesWithDescriptions = await prisma.portfolioImage.count({
        where: { 
          professionalId,
          description: { not: null }
        }
      });

      res.json({
        data: {
          totalImages,
          imagesWithTitles,
          imagesWithDescriptions,
          completeness: totalImages > 0 ? 
            Math.round(((imagesWithTitles + imagesWithDescriptions) / (totalImages * 2)) * 100) : 0
        }
      });

    } catch (error) {
      console.error("Error fetching portfolio stats:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = new PortfolioController();