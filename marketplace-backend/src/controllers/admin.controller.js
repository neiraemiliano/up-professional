const adminService = require('../services/admin.service');

class AdminController {
  
  // Dashboard overview con todas las estadísticas principales
  async getDashboardOverview(req, res) {
    try {
      const stats = await adminService.getDashboardStats();
      
      res.json({
        success: true,
        data: stats,
        message: "Estadísticas del dashboard obtenidas correctamente"
      });
      
    } catch (error) {
      console.error('Error in admin dashboard overview:', error);
      res.status(500).json({
        success: false,
        error: 'Error obteniendo estadísticas del dashboard',
        message: error.message
      });
    }
  }

  // Métricas detalladas de usuarios
  async getUserMetrics(req, res) {
    try {
      const { period = '30d' } = req.query;
      const metrics = await adminService.getUserMetrics(period);
      
      res.json({
        success: true,
        data: metrics,
        message: "Métricas de usuarios obtenidas correctamente"
      });
      
    } catch (error) {
      console.error('Error in user metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Error obteniendo métricas de usuarios',
        message: error.message
      });
    }
  }

  // Métricas detalladas de profesionales
  async getProfessionalMetrics(req, res) {
    try {
      const metrics = await adminService.getProfessionalMetrics();
      
      res.json({
        success: true,
        data: metrics,
        message: "Métricas de profesionales obtenidas correctamente"
      });
      
    } catch (error) {
      console.error('Error in professional metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Error obteniendo métricas de profesionales',
        message: error.message
      });
    }
  }

  // Métricas de bookings/trabajos realizados
  async getBookingMetrics(req, res) {
    try {
      const { period = '30d' } = req.query;
      const metrics = await adminService.getBookingMetrics(period);
      
      res.json({
        success: true,
        data: metrics,
        message: "Métricas de bookings obtenidas correctamente"
      });
      
    } catch (error) {
      console.error('Error in booking metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Error obteniendo métricas de bookings',
        message: error.message
      });
    }
  }

  // Métricas financieras y revenue
  async getFinancialMetrics(req, res) {
    try {
      const metrics = await adminService.getFinancialMetrics();
      
      res.json({
        success: true,
        data: metrics,
        message: "Métricas financieras obtenidas correctamente"
      });
      
    } catch (error) {
      console.error('Error in financial metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Error obteniendo métricas financieras',
        message: error.message
      });
    }
  }

  // Actividad reciente del sistema
  async getRecentActivity(req, res) {
    try {
      const activity = await adminService.getRecentActivity();
      
      res.json({
        success: true,
        data: activity,
        message: "Actividad reciente obtenida correctamente"
      });
      
    } catch (error) {
      console.error('Error in recent activity:', error);
      res.status(500).json({
        success: false,
        error: 'Error obteniendo actividad reciente',
        message: error.message
      });
    }
  }

  // Estadísticas de contactos entre usuarios
  async getContactMetrics(req, res) {
    try {
      // Simulación de métricas de contactos
      // En una implementación real, tendríamos tablas de mensajes/contactos
      const contactStats = {
        totalContacts: Math.floor(Math.random() * 1000) + 500,
        dailyContacts: Math.floor(Math.random() * 50) + 20,
        averageResponseTime: '2.3 horas',
        contactsByType: [
          { type: 'WhatsApp', count: 450, percentage: 60 },
          { type: 'Llamada', count: 225, percentage: 30 },
          { type: 'Email', count: 75, percentage: 10 }
        ],
        popularContactTimes: [
          { hour: '09:00', contacts: 45 },
          { hour: '14:00', contacts: 38 },
          { hour: '18:00', contacts: 52 },
          { hour: '20:00', contacts: 33 }
        ]
      };
      
      res.json({
        success: true,
        data: contactStats,
        message: "Métricas de contactos obtenidas correctamente"
      });
      
    } catch (error) {
      console.error('Error in contact metrics:', error);
      res.status(500).json({
        success: false,
        error: 'Error obteniendo métricas de contactos',
        message: error.message
      });
    }
  }

  // Exportar datos para análisis
  async exportData(req, res) {
    try {
      const { type = 'overview', format = 'json' } = req.query;
      
      let data;
      switch (type) {
        case 'users':
          data = await adminService.getUserMetrics();
          break;
        case 'professionals':
          data = await adminService.getProfessionalMetrics();
          break;
        case 'bookings':
          data = await adminService.getBookingMetrics();
          break;
        case 'financial':
          data = await adminService.getFinancialMetrics();
          break;
        default:
          data = await adminService.getDashboardStats();
      }
      
      if (format === 'csv') {
        // En una implementación real, convertiríamos a CSV
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${type}-${Date.now()}.csv`);
        res.send('CSV export functionality not implemented yet');
      } else {
        res.json({
          success: true,
          data,
          exportedAt: new Date().toISOString(),
          type,
          format
        });
      }
      
    } catch (error) {
      console.error('Error in data export:', error);
      res.status(500).json({
        success: false,
        error: 'Error exportando datos',
        message: error.message
      });
    }
  }

  // Configuración del sistema
  async getSystemConfig(req, res) {
    try {
      const config = {
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: {
          status: 'connected',
          tables: [
            'users', 'professionals', 'services', 'bookings', 
            'reviews', 'categories', 'locations', 'portfolios'
          ]
        },
        features: {
          intelligentSearch: true,
          pagination: true,
          authentication: true,
          reviews: true,
          whatsappIntegration: true
        },
        limits: {
          maxProfessionals: 10000,
          maxServicesPerProfessional: 50,
          maxReviewsPerUser: 100
        }
      };
      
      res.json({
        success: true,
        data: config,
        message: "Configuración del sistema obtenida correctamente"
      });
      
    } catch (error) {
      console.error('Error in system config:', error);
      res.status(500).json({
        success: false,
        error: 'Error obteniendo configuración del sistema',
        message: error.message
      });
    }
  }
}

module.exports = new AdminController();