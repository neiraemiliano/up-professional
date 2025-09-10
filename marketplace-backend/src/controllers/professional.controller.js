// src/controllers/professional.controller.js
const generateController = require("./base.controller");
const professionalService = require("../services/professional.service");
const prisma = require("../config/database");
const baseController = generateController(professionalService);

class ProfessionalController {
  constructor() {
    // Heredar métodos del controlador base
    Object.assign(this, baseController);
  }

  // Complete professional registration after user creation
  async completeRegistration(req, res) {
    try {
      const professionalData = req.body;
      const result = await professionalService.completeRegistration(professionalData);
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Registro profesional completado exitosamente'
      });
    } catch (error) {
      console.error('Error completing professional registration:', error);
      res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Error completando el registro profesional',
        message: error.message || 'Error completando el registro profesional'
      });
    }
  }

  // Check professional onboarding status
  async checkOnboardingStatus(req, res) {
    try {
      const userId = req.user.id;
      console.log('checkOnboardingStatus called with userId:', userId);
      const onboardingStatus = await professionalService.checkOnboardingStatus(userId);
      
      res.json({
        success: true,
        data: onboardingStatus,
        message: 'Estado del onboarding obtenido exitosamente'
      });
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Error verificando estado del onboarding',
        message: error.message || 'Error verificando estado del onboarding'
      });
    }
  }

  // Mark onboarding as completed
  async markOnboardingComplete(req, res) {
    try {
      const userId = req.user.id;
      console.log('markOnboardingComplete called with userId:', userId);
      const result = await professionalService.markOnboardingComplete(userId);
      
      res.json({
        success: true,
        data: result,
        message: 'Onboarding marcado como completado exitosamente'
      });
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
      res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Error marcando onboarding como completado',
        message: error.message || 'Error marcando onboarding como completado'
      });
    }
  }

  // Get professional dashboard data
  async getDashboard(req, res) {
    try {
      const userId = req.user.id;
      console.log('getDashboard called with userId:', userId);
      const dashboard = await professionalService.getDashboardData(userId);
      
      res.json({
        success: true,
        data: dashboard,
        message: 'Datos del dashboard obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error getting professional dashboard:', error);
      res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Error obteniendo los datos del dashboard',
        message: error.message || 'Error obteniendo los datos del dashboard'
      });
    }
  }

  // Buscar profesionales con filtros avanzados y paginación
  async searchProfessionals(req, res) {
    try {
      const filters = {
        categoryId: req.query.categoryId,
        locationId: req.query.locationId,
        minRating: req.query.minRating,
        maxPrice: req.query.maxPrice,
        isVerified: req.query.isVerified,
        isUrgent: req.query.supportsUrgent,
        respondsQuickly: req.query.respondsQuickly,
        order: req.query.order || 'rating_desc',
        page: req.query.page || 1,
        limit: req.query.limit || 12,
        q: req.query.q
      };

      const result = await professionalService.findAll(filters);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });

    } catch (error) {
      console.error("Error searching professionals:", error);
      res.status(500).json({ 
        success: false,
        error: "Error interno del servidor" 
      });
    }
  }

  // Obtener perfil completo de profesional
  async getFullProfile(req, res) {
    try {
      const { id } = req.params;

      const professional = await prisma.professional.findUnique({
        where: { id: parseInt(id) },
        include: {
          User: {
            select: { 
              name: true, 
              lastName: true, 
              avatarUrl: true, 
              phone: true,
              email: true 
            }
          },
          location: true,
          Portfolio: {
            orderBy: [
              { orderIndex: "asc" },
              { createdAt: "desc" }
            ]
          },
          Reviews: {
            include: {
              User: {
                select: { name: true, lastName: true, avatarUrl: true }
              }
            },
            orderBy: { createdAt: "desc" }
          },
          Services: {
            include: { Category: true }
          },
          Availability: {
            orderBy: { dayOfWeek: "asc" }
          }
        }
      });

      if (!professional) {
        return res.status(404).json({ error: "Profesional no encontrado" });
      }

      res.json({ data: professional });

    } catch (error) {
      console.error("Error fetching professional profile:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Actualizar configuración de urgencias
  async updateUrgentSettings(req, res) {
    try {
      const professionalId = req.user.Professional?.id;
      
      if (!professionalId) {
        return res.status(403).json({ error: "Acceso solo para profesionales" });
      }

      const { supportsUrgent } = req.body;

      const updated = await prisma.professional.update({
        where: { id: professionalId },
        data: { supportsUrgent: Boolean(supportsUrgent) }
      });

      res.json({
        success: true,
        data: updated,
        message: `Servicios urgentes ${supportsUrgent ? 'activados' : 'desactivados'}`
      });

    } catch (error) {
      console.error("Error updating urgent settings:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Generar URL de WhatsApp para contacto directo
  async generateWhatsAppURL(req, res) {
    try {
      const { id } = req.params;
      const { message = "", isUrgent = false } = req.body;

      const professional = await prisma.professional.findUnique({
        where: { id: parseInt(id) },
        include: {
          User: { select: { name: true, phone: true } },
          Services: { 
            select: { title: true, price: true },
            take: 3 
          }
        }
      });

      if (!professional) {
        return res.status(404).json({ error: "Profesional no encontrado" });
      }

      if (!professional.User.phone) {
        return res.status(400).json({ error: "Profesional sin número de WhatsApp" });
      }

      // Formatear número de teléfono (Argentina +54)
      let phoneNumber = professional.User.phone.replace(/\D/g, '');
      if (phoneNumber.startsWith('54')) {
        phoneNumber = phoneNumber;
      } else if (phoneNumber.startsWith('0')) {
        phoneNumber = '54' + phoneNumber.substring(1);
      } else {
        phoneNumber = '549' + phoneNumber;
      }

      // Generar mensaje personalizado
      let whatsappMessage = message || `Hola ${professional.User.name}! Vi tu perfil en Home Fixed y me interesa contactarte`;
      
      if (isUrgent) {
        whatsappMessage += " para un servicio URGENTE";
      }

      if (professional.Services.length > 0) {
        whatsappMessage += `.\n\nServicios disponibles:\n${professional.Services.map(s => `• ${s.title} - $${s.price}`).join('\n')}`;
      }

      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

      // Incrementar contador de contactos (opcional)
      await prisma.professional.update({
        where: { id: parseInt(id) },
        data: {
          // Podríamos agregar un campo contactCount si lo queremos
        }
      });

      res.json({
        data: {
          whatsappURL,
          phoneNumber: `+${phoneNumber}`,
          professionalName: professional.User.name,
          message: whatsappMessage
        }
      });

    } catch (error) {
      console.error("Error generating WhatsApp URL:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Verificar disponibilidad por WhatsApp
  async checkWhatsAppAvailability(req, res) {
    try {
      const { id } = req.params;

      const professional = await prisma.professional.findUnique({
        where: { id: parseInt(id) },
        include: {
          User: { select: { phone: true } }
        }
      });

      if (!professional) {
        return res.status(404).json({ error: "Profesional no encontrado" });
      }

      const hasWhatsApp = Boolean(professional.User.phone);

      res.json({
        data: {
          hasWhatsApp,
          phone: hasWhatsApp ? professional.User.phone : null,
          canContact: hasWhatsApp
        }
      });

    } catch (error) {
      console.error("Error checking WhatsApp availability:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Calcular distancia entre dos puntos (Haversine)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distancia en km
  }
}

module.exports = new ProfessionalController();
