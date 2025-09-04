const prisma = require("../config/db");

class AdminService {
  
  // Dashboard Overview Stats
  async getDashboardStats() {
    try {
      // Ejecutar todas las consultas en paralelo para mejor performance
      const [
        totalUsers,
        totalProfessionals,
        totalClients,
        totalServices,
        totalBookings,
        totalReviews,
        totalCategories,
        activeBookings,
        completedBookings,
        pendingBookings,
        averageRating,
        totalRevenue,
        newUsersThisMonth,
        newProfessionalsThisMonth,
        topCategories,
        recentActivity
      ] = await Promise.all([
        // Contadores básicos
        prisma.user.count(),
        prisma.user.count({ where: { role: 'professional' } }),
        prisma.user.count({ where: { role: 'customer' } }),
        prisma.service.count(),
        prisma.booking.count(),
        prisma.review.count(),
        prisma.category.count(),
        
        // Estados de bookings
        prisma.booking.count({ where: { status: 'active' } }),
        prisma.booking.count({ where: { status: 'completed' } }),
        prisma.booking.count({ where: { status: 'pending' } }),
        
        // Rating promedio
        prisma.review.aggregate({
          _avg: { rating: true }
        }),
        
        // Revenue simulado (suma de precios de bookings completados)
        prisma.booking.aggregate({
          where: { status: 'completed' },
          _sum: { finalPrice: true }
        }),
        
        // Nuevos usuarios este mes
        prisma.user.count({
          where: {
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        }),
        
        // Nuevos profesionales este mes
        prisma.user.count({
          where: {
            role: 'professional',
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            }
          }
        }),
        
        // Top categorías más usadas
        prisma.service.groupBy({
          by: ['categoryId'],
          _count: { categoryId: true },
          orderBy: { _count: { categoryId: 'desc' } },
          take: 5
        }),
        
        // Actividad reciente (últimos 10 registros)
        this.getRecentActivity()
      ]);

      return {
        overview: {
          totalUsers,
          totalProfessionals,
          totalClients,
          totalServices,
          totalBookings,
          totalReviews,
          totalCategories,
          averageRating: averageRating._avg.rating || 0,
          totalRevenue: totalRevenue._sum.finalPrice || 0,
          newUsersThisMonth,
          newProfessionalsThisMonth
        },
        bookings: {
          active: activeBookings,
          completed: completedBookings,
          pending: pendingBookings,
          total: totalBookings
        },
        topCategories,
        recentActivity
      };

    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw new Error('Error obteniendo estadísticas del dashboard');
    }
  }

  // Métricas de usuarios
  async getUserMetrics(period = '30d') {
    try {
      const dateRange = this.getDateRange(period);
      
      const [
        userGrowth,
        usersByRole,
        usersByStatus,
        topLocations,
        userRegistrationTrend
      ] = await Promise.all([
        // Crecimiento de usuarios
        prisma.user.count({
          where: { createdAt: { gte: dateRange.start } }
        }),
        
        // Usuarios por rol
        prisma.user.groupBy({
          by: ['role'],
          _count: { role: true }
        }),
        
        // Usuarios por estado verificado
        prisma.user.groupBy({
          by: ['isVerified'],
          _count: { isVerified: true }
        }),
        
        // Top ubicaciones
        prisma.professional.groupBy({
          by: ['locationId'],
          _count: { locationId: true },
          orderBy: { _count: { locationId: 'desc' } },
          take: 10,
          where: {
            locationId: { not: null }
          }
        }),
        
        // Tendencia de registro (últimos 7 días)
        this.getUserRegistrationTrend(7)
      ]);

      return {
        growth: userGrowth,
        byRole: usersByRole,
        byVerification: usersByStatus,
        topLocations,
        registrationTrend: userRegistrationTrend
      };

    } catch (error) {
      console.error('Error getting user metrics:', error);
      throw new Error('Error obteniendo métricas de usuarios');
    }
  }

  // Métricas de profesionales
  async getProfessionalMetrics() {
    try {
      const [
        professionalStats,
        topProfessionals,
        verificationStats,
        serviceStats,
        ratingDistribution,
        professionalActivity
      ] = await Promise.all([
        // Stats generales de profesionales
        prisma.professional.aggregate({
          _avg: { avgRating: true, completedJobs: true, experience: true },
          _max: { avgRating: true, completedJobs: true },
          _min: { avgRating: true, completedJobs: true },
          _count: { id: true }
        }),
        
        // Top profesionales por rating
        prisma.professional.findMany({
          take: 10,
          orderBy: [
            { avgRating: 'desc' },
            { completedJobs: 'desc' }
          ],
          include: {
            User: { select: { name: true, lastName: true, email: true } },
            location: true,
            _count: { select: { Reviews: true, Services: true } }
          }
        }),
        
        // Stats de verificación
        prisma.professional.groupBy({
          by: ['isVerified'],
          _count: { isVerified: true }
        }),
        
        // Stats de servicios por profesional
        prisma.service.groupBy({
          by: ['professionalId'],
          _count: { professionalId: true },
          orderBy: { _count: { professionalId: 'desc' } },
          take: 10
        }),
        
        // Distribución de ratings
        prisma.review.groupBy({
          by: ['rating'],
          _count: { rating: true },
          orderBy: { rating: 'asc' }
        }),
        
        // Actividad de profesionales (últimos servicios creados)
        prisma.service.findMany({
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: {
            Professional: {
              include: { User: { select: { name: true, lastName: true } } }
            },
            Category: true
          }
        })
      ]);

      return {
        stats: professionalStats,
        topProfessionals,
        verification: verificationStats,
        serviceDistribution: serviceStats,
        ratingDistribution,
        recentActivity: professionalActivity
      };

    } catch (error) {
      console.error('Error getting professional metrics:', error);
      throw new Error('Error obteniendo métricas de profesionales');
    }
  }

  // Métricas de bookings/trabajos
  async getBookingMetrics(period = '30d') {
    try {
      const dateRange = this.getDateRange(period);
      
      const [
        bookingStats,
        bookingsByStatus,
        bookingsByCategory,
        revenueByPeriod,
        bookingTrend,
        averageBookingValue,
        completionRate,
        topServices
      ] = await Promise.all([
        // Stats generales
        prisma.booking.aggregate({
          where: { createdAt: { gte: dateRange.start } },
          _count: { id: true },
          _sum: { finalPrice: true },
          _avg: { finalPrice: true }
        }),
        
        // Por status
        prisma.booking.groupBy({
          by: ['status'],
          _count: { status: true },
          where: { createdAt: { gte: dateRange.start } }
        }),
        
        // Por categoría
        prisma.booking.groupBy({
          by: ['serviceId'],
          _count: { serviceId: true },
          _sum: { finalPrice: true },
          orderBy: { _count: { serviceId: 'desc' } },
          take: 10
        }),
        
        // Revenue por mes (últimos 6 meses)
        this.getRevenueByMonth(6),
        
        // Tendencia de bookings (últimos 30 días)
        this.getBookingTrend(30),
        
        // Valor promedio de booking
        prisma.booking.aggregate({
          _avg: { finalPrice: true },
          where: { 
            finalPrice: { not: null },
            status: 'completed'
          }
        }),
        
        // Tasa de completación
        this.getCompletionRate(),
        
        // Servicios más solicitados
        prisma.service.findMany({
          take: 10,
          orderBy: {
            Bookings: { _count: 'desc' }
          },
          include: {
            Category: true,
            Professional: {
              include: { User: { select: { name: true, lastName: true } } }
            },
            _count: { select: { Bookings: true } }
          }
        })
      ]);

      return {
        stats: bookingStats,
        byStatus: bookingsByStatus,
        byCategory: bookingsByCategory,
        revenueByPeriod,
        trend: bookingTrend,
        averageValue: averageBookingValue._avg.finalPrice || 0,
        completionRate,
        topServices
      };

    } catch (error) {
      console.error('Error getting booking metrics:', error);
      throw new Error('Error obteniendo métricas de bookings');
    }
  }

  // Métricas financieras
  async getFinancialMetrics() {
    try {
      const [
        totalRevenue,
        monthlyRevenue,
        revenueGrowth,
        commissionStats,
        paymentMethods,
        outstandingPayments
      ] = await Promise.all([
        // Revenue total
        prisma.booking.aggregate({
          where: { status: 'completed' },
          _sum: { finalPrice: true },
          _count: { id: true }
        }),
        
        // Revenue mensual
        this.getMonthlyRevenue(),
        
        // Crecimiento de revenue
        this.getRevenueGrowth(),
        
        // Stats de comisiones (simulado)
        this.getCommissionStats(),
        
        // Métodos de pago más usados (simulado)
        this.getPaymentMethodStats(),
        
        // Pagos pendientes (simulado como bookings sin precio final)
        prisma.booking.aggregate({
          where: { 
            status: 'confirmed',
            finalPrice: null
          },
          _sum: { estimatedPrice: true },
          _count: { id: true }
        })
      ]);

      return {
        totalRevenue: totalRevenue._sum.finalPrice || 0,
        totalTransactions: totalRevenue._count,
        monthlyRevenue,
        revenueGrowth,
        commissionStats,
        paymentMethods,
        outstandingPayments: outstandingPayments._sum.estimatedPrice || 0,
        outstandingCount: outstandingPayments._count
      };

    } catch (error) {
      console.error('Error getting financial metrics:', error);
      throw new Error('Error obteniendo métricas financieras');
    }
  }

  // Actividad reciente del sistema
  async getRecentActivity() {
    try {
      const [
        recentUsers,
        recentProfessionals,
        recentBookings,
        recentReviews,
        recentServices
      ] = await Promise.all([
        // Nuevos usuarios
        prisma.user.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: { id: true, name: true, lastName: true, email: true, role: true, createdAt: true }
        }),
        
        // Nuevos profesionales
        prisma.professional.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            User: { select: { name: true, lastName: true, email: true } },
            location: true
          }
        }),
        
        // Bookings recientes
        prisma.booking.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            User: { select: { name: true, lastName: true } },
            Service: {
              include: {
                Professional: {
                  include: { User: { select: { name: true, lastName: true } } }
                }
              }
            }
          }
        }),
        
        // Reviews recientes
        prisma.review.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            User: { select: { name: true, lastName: true } },
            Professional: {
              include: { User: { select: { name: true, lastName: true } } }
            }
          }
        }),
        
        // Servicios recientes
        prisma.service.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            Professional: {
              include: { User: { select: { name: true, lastName: true } } }
            },
            Category: true
          }
        })
      ]);

      return {
        users: recentUsers,
        professionals: recentProfessionals,
        bookings: recentBookings,
        reviews: recentReviews,
        services: recentServices
      };

    } catch (error) {
      console.error('Error getting recent activity:', error);
      throw new Error('Error obteniendo actividad reciente');
    }
  }

  // Helpers
  getDateRange(period) {
    const now = new Date();
    let start;
    
    switch (period) {
      case '7d':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    return { start, end: now };
  }

  async getUserRegistrationTrend(days) {
    const trend = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: date,
            lt: nextDate
          }
        }
      });
      
      trend.push({
        date: date.toISOString().split('T')[0],
        count
      });
    }
    return trend;
  }

  async getBookingTrend(days) {
    const trend = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const [count, revenue] = await Promise.all([
        prisma.booking.count({
          where: {
            createdAt: { gte: date, lt: nextDate }
          }
        }),
        prisma.booking.aggregate({
          where: {
            createdAt: { gte: date, lt: nextDate },
            status: 'completed'
          },
          _sum: { finalPrice: true }
        })
      ]);
      
      trend.push({
        date: date.toISOString().split('T')[0],
        bookings: count,
        revenue: revenue._sum.finalPrice || 0
      });
    }
    return trend;
  }

  async getRevenueByMonth(months) {
    const revenue = [];
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      
      const nextMonth = new Date(date);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const result = await prisma.booking.aggregate({
        where: {
          createdAt: { gte: date, lt: nextMonth },
          status: 'completed'
        },
        _sum: { finalPrice: true },
        _count: { id: true }
      });
      
      revenue.push({
        month: date.toISOString().split('T')[0].substring(0, 7),
        revenue: result._sum.finalPrice || 0,
        bookings: result._count
      });
    }
    return revenue;
  }

  async getMonthlyRevenue() {
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const lastMonth = new Date(thisMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const [currentMonth, previousMonth] = await Promise.all([
      prisma.booking.aggregate({
        where: {
          createdAt: { gte: thisMonth },
          status: 'completed'
        },
        _sum: { finalPrice: true }
      }),
      prisma.booking.aggregate({
        where: {
          createdAt: { gte: lastMonth, lt: thisMonth },
          status: 'completed'
        },
        _sum: { finalPrice: true }
      })
    ]);
    
    return {
      current: currentMonth._sum.finalPrice || 0,
      previous: previousMonth._sum.finalPrice || 0
    };
  }

  async getRevenueGrowth() {
    const monthly = await this.getMonthlyRevenue();
    const growth = monthly.previous > 0 
      ? ((monthly.current - monthly.previous) / monthly.previous) * 100 
      : 0;
    
    return {
      percentage: growth,
      amount: monthly.current - monthly.previous
    };
  }

  async getCompletionRate() {
    const [total, completed] = await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'completed' } })
    ]);
    
    return total > 0 ? (completed / total) * 100 : 0;
  }

  // Simulaciones para datos que no existen en el schema actual
  async getCommissionStats() {
    const revenue = await prisma.booking.aggregate({
      where: { status: 'completed' },
      _sum: { finalPrice: true }
    });
    
    const totalRevenue = revenue._sum.finalPrice || 0;
    const commissionRate = 0.15; // 15% commission
    
    return {
      totalCommissions: totalRevenue * commissionRate,
      commissionRate,
      totalRevenue
    };
  }

  async getPaymentMethodStats() {
    // Simulación de métodos de pago
    const totalBookings = await prisma.booking.count({ where: { status: 'completed' } });
    
    return [
      { method: 'Tarjeta de Crédito', count: Math.floor(totalBookings * 0.6), percentage: 60 },
      { method: 'Tarjeta de Débito', count: Math.floor(totalBookings * 0.25), percentage: 25 },
      { method: 'Transferencia', count: Math.floor(totalBookings * 0.10), percentage: 10 },
      { method: 'Efectivo', count: Math.floor(totalBookings * 0.05), percentage: 5 }
    ];
  }
}

module.exports = new AdminService();