const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ContentController {
  // Obtener todo el contenido activo
  async getAllContent(req, res) {
    try {
      const content = await prisma.content.findMany({
        where: { isActive: true },
        orderBy: [
          { category: 'asc' },
          { key: 'asc' }
        ]
      });

      // Convertir a objeto con keys para fácil acceso en frontend
      const contentMap = content.reduce((acc, item) => {
        acc[item.key] = {
          id: item.id,
          value: item.value,
          type: item.type,
          metadata: item.metadata
        };
        return acc;
      }, {});

      res.json({
        success: true,
        data: contentMap
      });
    } catch (error) {
      console.error('Error getting content:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener contenido',
        error: error.message
      });
    }
  }

  // Obtener contenido por categoría
  async getContentByCategory(req, res) {
    try {
      const { category } = req.params;
      
      const content = await prisma.content.findMany({
        where: { 
          category,
          isActive: true 
        },
        orderBy: { key: 'asc' }
      });

      res.json({
        success: true,
        data: content
      });
    } catch (error) {
      console.error('Error getting content by category:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener contenido por categoría',
        error: error.message
      });
    }
  }

  // Obtener contenido específico por key
  async getContentByKey(req, res) {
    try {
      const { key } = req.params;
      
      const content = await prisma.content.findUnique({
        where: { key }
      });

      if (!content) {
        return res.status(404).json({
          success: false,
          message: 'Contenido no encontrado'
        });
      }

      res.json({
        success: true,
        data: content
      });
    } catch (error) {
      console.error('Error getting content by key:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener contenido',
        error: error.message
      });
    }
  }

  // ADMIN: Obtener todo el contenido para administración
  async getAdminContent(req, res) {
    try {
      const { category, search } = req.query;
      let where = {};

      if (category) {
        where.category = category;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { key: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ];
      }

      const content = await prisma.content.findMany({
        where,
        orderBy: [
          { category: 'asc' },
          { key: 'asc' }
        ]
      });

      // Obtener categorías únicas
      const categories = await prisma.content.groupBy({
        by: ['category'],
        orderBy: { category: 'asc' }
      });

      res.json({
        success: true,
        data: {
          content,
          categories: categories.map(c => c.category)
        }
      });
    } catch (error) {
      console.error('Error getting admin content:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener contenido de administración',
        error: error.message
      });
    }
  }

  // ADMIN: Crear contenido
  async createContent(req, res) {
    try {
      const {
        key,
        name,
        value,
        defaultValue,
        description,
        type = 'text',
        category = 'general',
        metadata
      } = req.body;

      // Verificar que no exista la key
      const existing = await prisma.content.findUnique({
        where: { key }
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe contenido con esa clave'
        });
      }

      const content = await prisma.content.create({
        data: {
          id: key, // Usar key como id también
          key,
          name,
          value,
          defaultValue: defaultValue || value,
          description,
          type,
          category,
          metadata,
          updatedBy: req.user?.email || 'admin'
        }
      });

      res.status(201).json({
        success: true,
        message: 'Contenido creado exitosamente',
        data: content
      });
    } catch (error) {
      console.error('Error creating content:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear contenido',
        error: error.message
      });
    }
  }

  // ADMIN: Actualizar contenido
  async updateContent(req, res) {
    try {
      const { id } = req.params;
      const {
        name,
        value,
        defaultValue,
        description,
        type,
        category,
        isActive,
        metadata
      } = req.body;

      const content = await prisma.content.update({
        where: { id },
        data: {
          name,
          value,
          defaultValue,
          description,
          type,
          category,
          isActive,
          metadata,
          updatedBy: req.user?.email || 'admin'
        }
      });

      res.json({
        success: true,
        message: 'Contenido actualizado exitosamente',
        data: content
      });
    } catch (error) {
      console.error('Error updating content:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar contenido',
        error: error.message
      });
    }
  }

  // ADMIN: Restaurar contenido a valor por defecto
  async resetContent(req, res) {
    try {
      const { id } = req.params;

      const content = await prisma.content.update({
        where: { id },
        data: {
          value: {
            set: await prisma.content.findUnique({
              where: { id },
              select: { defaultValue: true }
            }).then(c => c.defaultValue)
          },
          updatedBy: req.user?.email || 'admin'
        }
      });

      res.json({
        success: true,
        message: 'Contenido restaurado al valor por defecto',
        data: content
      });
    } catch (error) {
      console.error('Error resetting content:', error);
      res.status(500).json({
        success: false,
        message: 'Error al restaurar contenido',
        error: error.message
      });
    }
  }

  // ADMIN: Eliminar contenido
  async deleteContent(req, res) {
    try {
      const { id } = req.params;

      await prisma.content.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'Contenido eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error deleting content:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar contenido',
        error: error.message
      });
    }
  }

  // ADMIN: Bulk update - actualizar múltiples contenidos
  async bulkUpdateContent(req, res) {
    try {
      const { updates } = req.body; // Array de { id, value }

      const results = await Promise.all(
        updates.map(update => 
          prisma.content.update({
            where: { id: update.id },
            data: {
              value: update.value,
              updatedBy: req.user?.email || 'admin'
            }
          })
        )
      );

      res.json({
        success: true,
        message: `${results.length} contenidos actualizados exitosamente`,
        data: results
      });
    } catch (error) {
      console.error('Error bulk updating content:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar contenidos',
        error: error.message
      });
    }
  }

  // Obtener anuncios activos
  async getActiveAnnouncements(req, res) {
    try {
      const { page = 'all', userType = 'all' } = req.query;
      const now = new Date();

      let where = {
        isActive: true,
        startDate: { lte: now },
        OR: [
          { endDate: null },
          { endDate: { gte: now } }
        ]
      };

      // Filtrar por tipo de usuario
      if (userType !== 'all') {
        where.targetUsers = { in: [userType, 'all'] };
      }

      // Filtrar por página específica
      if (page !== 'all') {
        where.showOnPages = {
          path: ['$'],
          array_contains: page
        };
      }

      const announcements = await prisma.announcement.findMany({
        where,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      // Incrementar contador de impresiones
      if (announcements.length > 0) {
        await Promise.all(
          announcements.map(ann => 
            prisma.announcement.update({
              where: { id: ann.id },
              data: { impressions: { increment: 1 } }
            })
          )
        );
      }

      res.json({
        success: true,
        data: announcements
      });
    } catch (error) {
      console.error('Error getting announcements:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener anuncios',
        error: error.message
      });
    }
  }

  // ADMIN: Gestión de anuncios
  async getAdminAnnouncements(req, res) {
    try {
      const announcements = await prisma.announcement.findMany({
        orderBy: [
          { isActive: 'desc' },
          { priority: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      res.json({
        success: true,
        data: announcements
      });
    } catch (error) {
      console.error('Error getting admin announcements:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener anuncios de administración',
        error: error.message
      });
    }
  }

  // ADMIN: Crear anuncio
  async createAnnouncement(req, res) {
    try {
      const announcement = await prisma.announcement.create({
        data: {
          ...req.body,
          createdBy: req.user?.email || 'admin'
        }
      });

      res.status(201).json({
        success: true,
        message: 'Anuncio creado exitosamente',
        data: announcement
      });
    } catch (error) {
      console.error('Error creating announcement:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear anuncio',
        error: error.message
      });
    }
  }

  // ADMIN: Actualizar anuncio
  async updateAnnouncement(req, res) {
    try {
      const { id } = req.params;

      const announcement = await prisma.announcement.update({
        where: { id: parseInt(id) },
        data: req.body
      });

      res.json({
        success: true,
        message: 'Anuncio actualizado exitosamente',
        data: announcement
      });
    } catch (error) {
      console.error('Error updating announcement:', error);
      res.status(500).json({
        success: false,
        message: 'Error al actualizar anuncio',
        error: error.message
      });
    }
  }

  // ADMIN: Eliminar anuncio
  async deleteAnnouncement(req, res) {
    try {
      const { id } = req.params;

      await prisma.announcement.delete({
        where: { id: parseInt(id) }
      });

      res.json({
        success: true,
        message: 'Anuncio eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error deleting announcement:', error);
      if (error.code === 'P2025') {
        res.status(404).json({
          success: false,
          message: 'Anuncio no encontrado'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al eliminar anuncio',
          error: error.message
        });
      }
    }
  }

  // Registrar clic en anuncio
  async trackAnnouncementClick(req, res) {
    try {
      const { id } = req.params;

      await prisma.announcement.update({
        where: { id: parseInt(id) },
        data: { clicks: { increment: 1 } }
      });

      res.json({
        success: true,
        message: 'Clic registrado'
      });
    } catch (error) {
      console.error('Error tracking announcement click:', error);
      res.status(500).json({
        success: false,
        message: 'Error al registrar clic',
        error: error.message
      });
    }
  }
}

module.exports = new ContentController();