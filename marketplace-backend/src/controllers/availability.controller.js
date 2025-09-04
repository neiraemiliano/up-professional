const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class AvailabilityController {
  // Obtener horarios de un profesional
  async getProfessionalSchedule(req, res) {
    try {
      const { professionalId } = req.params;

      const schedule = await prisma.availability.findMany({
        where: { professionalId: parseInt(professionalId) },
        orderBy: { dayOfWeek: 'asc' }
      });

      const formattedSchedule = schedule.map(slot => ({
        ...slot,
        dayName: this.getDayName(slot.dayOfWeek),
        isToday: this.isToday(slot.dayOfWeek)
      }));

      res.json({ data: formattedSchedule });

    } catch (error) {
      console.error("Error fetching professional schedule:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Actualizar horarios de disponibilidad (solo profesionales autenticados)
  async updateSchedule(req, res) {
    try {
      const professionalId = req.user.Professional?.id;
      
      if (!professionalId) {
        return res.status(403).json({ error: "Acceso solo para profesionales" });
      }

      const { schedule } = req.body; // Array de horarios

      if (!Array.isArray(schedule)) {
        return res.status(400).json({ error: "Schedule debe ser un array" });
      }

      // Eliminar horarios existentes
      await prisma.availability.deleteMany({
        where: { professionalId }
      });

      // Crear nuevos horarios
      const created = await prisma.availability.createMany({
        data: schedule.map(slot => ({
          professionalId,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: slot.isAvailable || true
        }))
      });

      res.json({
        success: true,
        message: "Horarios actualizados correctamente",
        data: { count: created.count }
      });

    } catch (error) {
      console.error("Error updating schedule:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Verificar si un profesional está disponible ahora
  async checkCurrentAvailability(req, res) {
    try {
      const { professionalId } = req.params;

      const now = new Date();
      const currentDay = now.getDay(); // 0=domingo, 1=lunes, etc.
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      const availability = await prisma.availability.findFirst({
        where: {
          professionalId: parseInt(professionalId),
          dayOfWeek: currentDay,
          isAvailable: true,
          startTime: { lte: currentTime },
          endTime: { gte: currentTime }
        }
      });

      const isAvailable = Boolean(availability);
      let nextAvailable = null;

      if (!isAvailable) {
        // Buscar la próxima disponibilidad
        nextAvailable = await this.findNextAvailability(parseInt(professionalId));
      }

      res.json({
        data: {
          isAvailableNow: isAvailable,
          currentTime,
          dayOfWeek: currentDay,
          nextAvailable,
          currentSlot: availability
        }
      });

    } catch (error) {
      console.error("Error checking availability:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Obtener próximos horarios disponibles
  async getUpcomingAvailability(req, res) {
    try {
      const { professionalId } = req.params;
      const { days = 7 } = req.query;

      const upcoming = [];
      const today = new Date();

      for (let i = 0; i < parseInt(days); i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dayOfWeek = date.getDay();

        const availability = await prisma.availability.findMany({
          where: {
            professionalId: parseInt(professionalId),
            dayOfWeek: dayOfWeek,
            isAvailable: true
          },
          orderBy: { startTime: 'asc' }
        });

        if (availability.length > 0) {
          upcoming.push({
            date: date.toISOString().split('T')[0],
            dayName: this.getDayName(dayOfWeek),
            slots: availability
          });
        }
      }

      res.json({ data: upcoming });

    } catch (error) {
      console.error("Error getting upcoming availability:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  // Métodos auxiliares
  getDayName(dayOfWeek) {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return days[dayOfWeek];
  }

  isToday(dayOfWeek) {
    return new Date().getDay() === dayOfWeek;
  }

  async findNextAvailability(professionalId) {
    const today = new Date();
    const currentDay = today.getDay();
    const currentTime = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;

    // Buscar en los próximos 7 días
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);
      const checkDay = checkDate.getDay();
      
      const whereClause = {
        professionalId,
        dayOfWeek: checkDay,
        isAvailable: true
      };

      // Si es hoy, solo buscar horarios futuros
      if (i === 0) {
        whereClause.startTime = { gt: currentTime };
      }

      const availability = await prisma.availability.findFirst({
        where: whereClause,
        orderBy: { startTime: 'asc' }
      });

      if (availability) {
        return {
          date: checkDate.toISOString().split('T')[0],
          dayName: this.getDayName(checkDay),
          startTime: availability.startTime,
          endTime: availability.endTime
        };
      }
    }

    return null;
  }
}

module.exports = new AvailabilityController();