const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class UrgentController {
  // Crear reserva urgente
  async createUrgentBooking(req, res) {
    try {
      const { professionalId, timeframe, description } = req.body;
      const userId = req.user.id;

      // Verificar que el profesional soporte servicios urgentes
      const professional = await prisma.professional.findUnique({
        where: { id: parseInt(professionalId) },
        include: { User: true }
      });

      if (!professional) {
        return res.status(404).json({ error: "Profesional no encontrado" });
      }

      if (!professional.supportsUrgent) {
        return res.status(400).json({ error: "Este profesional no ofrece servicios urgentes" });
      }

      // Definir recargos por tipo de urgencia
      const surchargeRates = {
        now: 1.0,        // +100%
        "2hours": 0.75,  // +75%
        today: 0.5,      // +50%
        tomorrow: 0.25   // +25%
      };

      const surchargeRate = surchargeRates[timeframe] || 0.5;
      const basePrice = professional.priceFrom || 10000;
      const estimatedPrice = basePrice * (1 + surchargeRate);

      const urgentBooking = await prisma.urgentBooking.create({
        data: {
          userId,
          professionalId: parseInt(professionalId),
          timeframe,
          description,
          surchargeRate,
          estimatedPrice,
          status: "pending"
        },
        include: {
          User: {
            select: { name: true, lastName: true, phone: true, email: true }
          },
          Professional: {
            include: {
              User: { select: { name: true, lastName: true, phone: true } }
            }
          }
        }
      });

      // TODO: Aquí se enviaría notificación por WhatsApp al profesional
      // await this.sendWhatsAppNotification(urgentBooking);

      res.status(201).json({
        success: true,
        data: urgentBooking,
        message: "Reserva urgente creada. Te contactaremos en 5 minutos."
      });

    } catch (error) {
      console.error("Error creating urgent booking:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Listar reservas urgentes de un profesional
  async getUrgentBookingsForProfessional(req, res) {
    try {
      const professionalId = req.user.Professional?.id;
      
      if (!professionalId) {
        return res.status(403).json({ error: "Acceso solo para profesionales" });
      }

      const urgentBookings = await prisma.urgentBooking.findMany({
        where: { 
          professionalId,
          status: { in: ["pending", "confirmed"] }
        },
        include: {
          User: {
            select: { name: true, lastName: true, phone: true }
          }
        },
        orderBy: { createdAt: "desc" }
      });

      res.json({ data: urgentBookings });
    } catch (error) {
      console.error("Error fetching urgent bookings:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Confirmar reserva urgente (profesional acepta)
  async confirmUrgentBooking(req, res) {
    try {
      const { id } = req.params;
      const professionalId = req.user.Professional?.id;

      if (!professionalId) {
        return res.status(403).json({ error: "Acceso solo para profesionales" });
      }

      const urgentBooking = await prisma.urgentBooking.findFirst({
        where: { 
          id: parseInt(id), 
          professionalId,
          status: "pending"
        },
        include: {
          User: { select: { name: true, phone: true } }
        }
      });

      if (!urgentBooking) {
        return res.status(404).json({ error: "Reserva urgente no encontrada" });
      }

      const updated = await prisma.urgentBooking.update({
        where: { id: parseInt(id) },
        data: { status: "confirmed" }
      });

      // TODO: Notificar al cliente que fue confirmado
      // await this.notifyCustomerConfirmation(urgentBooking);

      res.json({
        success: true,
        data: updated,
        message: "Reserva urgente confirmada"
      });
    } catch (error) {
      console.error("Error confirming urgent booking:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Rechazar reserva urgente
  async rejectUrgentBooking(req, res) {
    try {
      const { id } = req.params;
      const professionalId = req.user.Professional?.id;

      if (!professionalId) {
        return res.status(403).json({ error: "Acceso solo para profesionales" });
      }

      const updated = await prisma.urgentBooking.update({
        where: { 
          id: parseInt(id),
          professionalId,
          status: "pending"
        },
        data: { status: "cancelled" }
      });

      res.json({
        success: true,
        data: updated,
        message: "Reserva urgente rechazada"
      });
    } catch (error) {
      console.error("Error rejecting urgent booking:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Obtener estadísticas de reservas urgentes
  async getUrgentStats(req, res) {
    try {
      const professionalId = req.user.Professional?.id;
      
      if (!professionalId) {
        return res.status(403).json({ error: "Acceso solo para profesionales" });
      }

      const stats = await prisma.urgentBooking.groupBy({
        by: ["status"],
        where: { professionalId },
        _count: { status: true }
      });

      const totalEarnings = await prisma.urgentBooking.aggregate({
        where: { 
          professionalId,
          status: "confirmed"
        },
        _sum: { estimatedPrice: true }
      });

      res.json({
        data: {
          bookingsByStatus: stats,
          totalUrgentEarnings: totalEarnings._sum.estimatedPrice || 0
        }
      });
    } catch (error) {
      console.error("Error fetching urgent stats:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Método privado para enviar notificaciones (placeholder)
  async sendWhatsAppNotification(urgentBooking) {
    // TODO: Integrar con API de WhatsApp Business
    console.log(`WhatsApp notification would be sent to ${urgentBooking.Professional.User.phone}`);
    console.log(`Message: Nueva reserva urgente de ${urgentBooking.User.name}`);
  }
}

module.exports = new UrgentController();