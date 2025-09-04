const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class VerificationController {
  // Solicitar verificación (solo profesionales autenticados)
  async requestVerification(req, res) {
    try {
      const professionalId = req.user.Professional?.id;
      
      if (!professionalId) {
        return res.status(403).json({ error: "Acceso solo para profesionales" });
      }

      const { 
        documentType, 
        documentNumber, 
        workLicense, 
        certifications = [],
        experience,
        references = []
      } = req.body;

      // Verificar si ya tiene una solicitud pendiente
      const existing = await prisma.verificationRequest.findFirst({
        where: { 
          professionalId,
          status: { in: ['pending', 'under_review'] }
        }
      });

      if (existing) {
        return res.status(400).json({ 
          error: "Ya tienes una solicitud de verificación pendiente" 
        });
      }

      // Crear solicitud de verificación
      const verificationRequest = await prisma.verificationRequest.create({
        data: {
          professionalId,
          documentType,
          documentNumber,
          workLicense,
          certifications,
          experience,
          references,
          status: 'pending'
        }
      });

      res.json({
        success: true,
        data: verificationRequest,
        message: "Solicitud de verificación enviada correctamente"
      });

    } catch (error) {
      console.error("Error requesting verification:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Obtener estado de verificación del profesional
  async getVerificationStatus(req, res) {
    try {
      const { professionalId } = req.params;

      const professional = await prisma.professional.findUnique({
        where: { id: parseInt(professionalId) },
        select: { 
          isVerified: true,
          User: { select: { name: true } }
        }
      });

      if (!professional) {
        return res.status(404).json({ error: "Profesional no encontrado" });
      }

      const verificationRequest = await prisma.verificationRequest.findFirst({
        where: { professionalId: parseInt(professionalId) },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        data: {
          isVerified: professional.isVerified,
          professionalName: professional.User.name,
          verificationRequest: verificationRequest || null,
          verificationBadge: this.getVerificationBadge(professional.isVerified)
        }
      });

    } catch (error) {
      console.error("Error getting verification status:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Obtener mis solicitudes de verificación (solo profesional autenticado)
  async getMyVerificationRequests(req, res) {
    try {
      const professionalId = req.user.Professional?.id;
      
      if (!professionalId) {
        return res.status(403).json({ error: "Acceso solo para profesionales" });
      }

      const requests = await prisma.verificationRequest.findMany({
        where: { professionalId },
        orderBy: { createdAt: 'desc' }
      });

      res.json({ data: requests });

    } catch (error) {
      console.error("Error getting verification requests:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Obtener profesionales verificados (público)
  async getVerifiedProfessionals(req, res) {
    try {
      const { categoryId, limit = 10 } = req.query;

      const where = { isVerified: true };
      
      if (categoryId) {
        where.Services = {
          some: { categoryId: parseInt(categoryId) }
        };
      }

      const professionals = await prisma.professional.findMany({
        where,
        include: {
          User: { 
            select: { name: true, avatarUrl: true }
          },
          Services: {
            select: { title: true, categoryId: true },
            take: 3
          }
        },
        orderBy: [
          { avgRating: 'desc' },
          { completedJobs: 'desc' }
        ],
        take: parseInt(limit)
      });

      const formatted = professionals.map(prof => ({
        ...prof,
        verificationBadge: this.getVerificationBadge(true),
        trustLevel: this.calculateTrustLevel(prof)
      }));

      res.json({ data: formatted });

    } catch (error) {
      console.error("Error getting verified professionals:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Métodos auxiliares
  getVerificationBadge(isVerified) {
    return {
      verified: isVerified,
      icon: isVerified ? "✅" : "⏳",
      text: isVerified ? "Profesional Verificado" : "Sin verificar",
      color: isVerified ? "green" : "gray"
    };
  }

  calculateTrustLevel(professional) {
    let score = 0;
    
    // Verificación
    if (professional.isVerified) score += 40;
    
    // Rating
    if (professional.avgRating >= 4.5) score += 30;
    else if (professional.avgRating >= 4.0) score += 20;
    else if (professional.avgRating >= 3.5) score += 10;
    
    // Trabajos completados
    if (professional.completedJobs >= 100) score += 20;
    else if (professional.completedJobs >= 50) score += 15;
    else if (professional.completedJobs >= 20) score += 10;
    else if (professional.completedJobs >= 5) score += 5;
    
    // Respuesta rápida
    if (professional.respondsQuickly) score += 10;

    let level = "Básico";
    if (score >= 80) level = "Premium";
    else if (score >= 60) level = "Confiable";
    else if (score >= 40) level = "Verificado";

    return {
      score,
      level,
      features: this.getTrustFeatures(professional)
    };
  }

  getTrustFeatures(professional) {
    const features = [];
    
    if (professional.isVerified) features.push("✅ Verificado");
    if (professional.avgRating >= 4.5) features.push("⭐ Top Rating");
    if (professional.completedJobs >= 50) features.push("🏆 Experto");
    if (professional.respondsQuickly) features.push("⚡ Respuesta Rápida");
    if (professional.supportsUrgent) features.push("🚨 Urgencias");
    
    return features;
  }
}

module.exports = new VerificationController();