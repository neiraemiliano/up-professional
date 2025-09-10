const { MercadoPagoConfig, Payment, Preference } = require('mercadopago');
const { PrismaClient } = require('@prisma/client');
const NotificationService = require('./notification.service');

const prisma = new PrismaClient();

class PaymentService {
  constructor() {
    // Configurar MercadoPago
    this.mp = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
      options: {
        timeout: 5000,
        idempotencyKey: 'abc'
      }
    });
    
    this.payment = new Payment(this.mp);
    this.preference = new Preference(this.mp);
  }

  // ========== SUSCRIPCIONES ==========
  async createSubscriptionPayment(professionalId, planId, userId) {
    try {
      console.log('Creating subscription payment:', { professionalId, planId, userId });
      
      // Obtener el plan
      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId }
      });
      
      if (!plan) {
        throw new Error('Plan no encontrado');
      }

      // Obtener datos del profesional
      const professional = await prisma.professional.findUnique({
        where: { id: professionalId },
        include: {
          User: true
        }
      });

      if (!professional) {
        throw new Error('Profesional no encontrado');
      }

      // Crear preferencia de pago
      const preferenceData = {
        items: [{
          id: `subscription_${planId}`,
          title: `${plan.name} - Home Fixed`,
          description: `Suscripción a ${plan.name} por 1 mes`,
          category_id: 'services',
          quantity: 1,
          currency_id: 'ARS',
          unit_price: plan.price
        }],
        payer: {
          name: professional.User.name,
          surname: professional.User.lastName,
          email: professional.User.email,
          phone: {
            area_code: '11',
            number: professional.User.phone
          }
        },
        back_urls: {
          success: `${process.env.MERCADOPAGO_SUCCESS_URL}?type=subscription&professionalId=${professionalId}&planId=${planId}`,
          failure: process.env.MERCADOPAGO_FAILURE_URL,
          pending: process.env.MERCADOPAGO_PENDING_URL
        },
        auto_return: 'approved',
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12
        },
        notification_url: `${process.env.API_URL || 'http://localhost:3000'}/api/webhooks/mercadopago`,
        statement_descriptor: 'Home Fixed',
        external_reference: `subscription_${professionalId}_${planId}_${Date.now()}`,
        expires: true,
        expiration_date_from: new Date().toISOString(),
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
      };

      const preference = await this.preference.create({ body: preferenceData });
      
      // Crear registro de pago pendiente
      const paymentRecord = await prisma.payment.create({
        data: {
          type: 'subscription',
          amount: plan.price,
          currency: 'ARS',
          status: 'pending',
          paymentMethod: 'mercadopago',
          description: `Suscripción ${plan.name}`,
          externalId: preference.id,
          externalData: {
            preference_id: preference.id,
            plan_id: planId,
            professional_id: professionalId
          }
        }
      });

      console.log('Subscription payment created:', paymentRecord.id);

      return {
        preferenceId: preference.id,
        initPoint: preference.init_point,
        sandboxInitPoint: preference.sandbox_init_point,
        paymentId: paymentRecord.id,
        amount: plan.price,
        plan: plan
      };

    } catch (error) {
      console.error('Error creating subscription payment:', error);
      throw error;
    }
  }

  // ========== SERVICIOS ==========
  async createServicePayment(bookingId, amount, isAdvance = false, advancePercentage = 0.5) {
    try {
      console.log('Creating service payment:', { bookingId, amount, isAdvance });

      // Obtener el booking
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          User: true,
          Service: {
            include: {
              Professional: {
                include: {
                  User: true
                }
              }
            }
          }
        }
      });

      if (!booking) {
        throw new Error('Reserva no encontrada');
      }

      // Calcular montos
      const commissionConfig = await this.getCommissionConfig();
      const platformFee = Math.max(
        amount * commissionConfig.serviceFeePercentage,
        commissionConfig.minCommission
      );
      const professionalAmount = amount - platformFee;
      
      const finalAmount = isAdvance ? amount * advancePercentage : amount;

      // Crear ServicePayment
      const servicePayment = await prisma.servicePayment.create({
        data: {
          bookingId: bookingId,
          clientUserId: booking.User.id,
          professionalId: booking.Service.Professional.id,
          amount: amount,
          platformFee: platformFee,
          professionalAmount: professionalAmount,
          status: 'pending',
          paymentMethod: 'mercadopago',
          isAdvancePayment: isAdvance,
          advancePercentage: isAdvance ? advancePercentage : null
        }
      });

      // Crear preferencia de pago
      const title = isAdvance 
        ? `Adelanto ${Math.round(advancePercentage * 100)}% - ${booking.Service.title}`
        : `Pago completo - ${booking.Service.title}`;

      const preferenceData = {
        items: [{
          id: `service_${bookingId}`,
          title: title,
          description: booking.description || 'Servicio profesional',
          category_id: 'services',
          quantity: 1,
          currency_id: 'ARS',
          unit_price: finalAmount
        }],
        payer: {
          name: booking.User.name,
          surname: booking.User.lastName,
          email: booking.User.email,
          phone: {
            area_code: '11',
            number: booking.User.phone
          }
        },
        back_urls: {
          success: `${process.env.MERCADOPAGO_SUCCESS_URL}?type=service&servicePaymentId=${servicePayment.id}`,
          failure: process.env.MERCADOPAGO_FAILURE_URL,
          pending: process.env.MERCADOPAGO_PENDING_URL
        },
        auto_return: 'approved',
        notification_url: `${process.env.API_URL || 'http://localhost:3000'}/api/webhooks/mercadopago`,
        external_reference: `service_${servicePayment.id}_${Date.now()}`
      };

      const preference = await this.preference.create({ body: preferenceData });

      // Crear registro de pago
      const paymentRecord = await prisma.payment.create({
        data: {
          type: 'service',
          amount: finalAmount,
          currency: 'ARS',
          status: 'pending',
          paymentMethod: 'mercadopago',
          description: title,
          servicePaymentId: servicePayment.id,
          externalId: preference.id,
          externalData: {
            preference_id: preference.id,
            service_payment_id: servicePayment.id,
            booking_id: bookingId
          }
        }
      });

      return {
        preferenceId: preference.id,
        initPoint: preference.init_point,
        sandboxInitPoint: preference.sandbox_init_point,
        paymentId: paymentRecord.id,
        servicePaymentId: servicePayment.id,
        amount: finalAmount,
        isAdvance
      };

    } catch (error) {
      console.error('Error creating service payment:', error);
      throw error;
    }
  }

  // ========== WEBHOOKS ==========
  async handleWebhook(data) {
    try {
      console.log('Processing MercadoPago webhook:', data);

      if (data.type === 'payment') {
        const paymentId = data.data.id;
        
        // Obtener información del pago desde MercadoPago
        const mpPayment = await this.payment.get({ id: paymentId });
        
        if (!mpPayment) {
          throw new Error('Payment not found in MercadoPago');
        }

        // Buscar el pago en nuestra base de datos
        const payment = await prisma.payment.findFirst({
          where: {
            externalId: mpPayment.external_reference
          },
          include: {
            ServicePayment: true,
            Subscription: true
          }
        });

        if (!payment) {
          console.log('Payment not found in database, might be external');
          return;
        }

        // Actualizar estado del pago
        await this.updatePaymentStatus(payment, mpPayment);
      }

    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }

  async updatePaymentStatus(payment, mpPayment) {
    try {
      const newStatus = this.mapMercadoPagoStatus(mpPayment.status);
      
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: newStatus,
          paidAt: mpPayment.status === 'approved' ? new Date() : null,
          externalData: {
            ...payment.externalData,
            mercadopago_payment_id: mpPayment.id,
            status_detail: mpPayment.status_detail,
            payment_type: mpPayment.payment_type_id,
            last_updated: new Date().toISOString()
          }
        }
      });

      // Procesar según tipo de pago
      if (mpPayment.status === 'approved') {
        if (payment.type === 'subscription') {
          await this.processApprovedSubscriptionPayment(payment);
        } else if (payment.type === 'service') {
          await this.processApprovedServicePayment(payment);
        }
      }

      console.log(`Payment ${payment.id} status updated to ${newStatus}`);

    } catch (error) {
      console.error('Error updating payment status:', error);
      throw error;
    }
  }

  async processApprovedSubscriptionPayment(payment) {
    try {
      const externalData = payment.externalData;
      const professionalId = externalData.professional_id;
      const planId = externalData.plan_id;

      // Obtener el plan
      const plan = await prisma.subscriptionPlan.findUnique({
        where: { id: planId }
      });

      // Crear o actualizar suscripción
      const subscription = await prisma.subscription.upsert({
        where: { 
          professionalId: professionalId 
        },
        update: {
          planId: planId,
          status: 'active',
          startDate: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
          autoRenew: true,
          paymentMethod: 'mercadopago'
        },
        create: {
          professionalId: professionalId,
          planId: planId,
          status: 'active',
          startDate: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          autoRenew: true,
          paymentMethod: 'mercadopago'
        }
      });

      // Actualizar el profesional
      await prisma.professional.update({
        where: { id: professionalId },
        data: {
          subscriptionPlan: planId,
          subscriptionStatus: 'active',
          subscriptionExpiresAt: subscription.expiresAt,
          isPriority: plan.isPriority,
          isFeatured: plan.isFeatured,
          monthlyLeadLimit: plan.monthlyLeadLimit,
          monthlyLeadsUsed: 0
        }
      });

      // Asociar el pago a la suscripción
      await prisma.payment.update({
        where: { id: payment.id },
        data: { subscriptionId: subscription.id }
      });

      // Enviar notificación
      await NotificationService.createPaymentNotification({
        type: 'subscription_activated',
        userId: (await prisma.professional.findUnique({ 
          where: { id: professionalId },
          select: { userId: true }
        })).userId,
        title: '🎉 ¡Suscripción activada!',
        message: `Tu ${plan.name} está ahora activo. ¡Disfruta de todos los beneficios!`,
        data: {
          paymentId: payment.id,
          subscriptionId: subscription.id,
          planName: plan.name,
          expiresAt: subscription.expiresAt
        },
        priority: 'high'
      });

      console.log('Subscription activated for professional:', professionalId);

    } catch (error) {
      console.error('Error processing approved subscription payment:', error);
      throw error;
    }
  }

  async processApprovedServicePayment(payment) {
    try {
      const servicePayment = await prisma.servicePayment.findUnique({
        where: { id: payment.servicePaymentId },
        include: {
          Professional: {
            include: { User: true }
          },
          ClientUser: true,
          Booking: {
            include: { Service: true }
          }
        }
      });

      // Actualizar ServicePayment
      await prisma.servicePayment.update({
        where: { id: servicePayment.id },
        data: {
          status: 'paid'
        }
      });

      // Actualizar Booking
      const newBookingStatus = servicePayment.isAdvancePayment ? 'confirmed' : 'paid';
      await prisma.booking.update({
        where: { id: servicePayment.bookingId },
        data: {
          status: newBookingStatus,
          paymentStatus: servicePayment.isAdvancePayment ? 'partial' : 'paid'
        }
      });

      // Crear comisión
      await this.createCommission(servicePayment);

      // Notificar al profesional
      await NotificationService.createPaymentNotification({
        type: 'payment_received',
        userId: servicePayment.Professional.userId,
        title: '💰 Pago recibido',
        message: `Has recibido un ${servicePayment.isAdvancePayment ? 'adelanto' : 'pago'} de $${payment.amount.toLocaleString('es-AR')}`,
        data: {
          paymentId: payment.id,
          servicePaymentId: servicePayment.id,
          amount: payment.amount,
          serviceName: servicePayment.Booking.Service.title,
          clientName: servicePayment.ClientUser.name
        },
        priority: 'high'
      });

      console.log('Service payment processed:', servicePayment.id);

    } catch (error) {
      console.error('Error processing approved service payment:', error);
      throw error;
    }
  }

  async createCommission(servicePayment) {
    try {
      const commissionConfig = await this.getCommissionConfig();
      
      const commission = await prisma.commission.create({
        data: {
          professionalId: servicePayment.professionalId,
          servicePaymentId: servicePayment.id,
          type: 'service_fee',
          baseAmount: servicePayment.amount,
          percentage: commissionConfig.serviceFeePercentage,
          amount: servicePayment.platformFee,
          status: 'collected',
          collectedAt: new Date()
        }
      });

      // Crear registro de pago de comisión
      await prisma.payment.create({
        data: {
          type: 'commission',
          amount: servicePayment.platformFee,
          currency: 'ARS',
          status: 'approved',
          paymentMethod: 'automatic',
          description: `Comisión ${commissionConfig.serviceFeePercentage * 100}% - Servicio`,
          commissionId: commission.id,
          paidAt: new Date()
        }
      });

      return commission;
    } catch (error) {
      console.error('Error creating commission:', error);
      throw error;
    }
  }

  async verifyPayment(paymentId) {
    try {
      console.log('Verifying payment:', paymentId);
      const mpPayment = await this.payment.get({ id: paymentId });
      return mpPayment;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  // ========== UTILIDADES ==========
  mapMercadoPagoStatus(mpStatus) {
    const statusMap = {
      'approved': 'approved',
      'pending': 'pending',
      'in_process': 'pending',
      'rejected': 'rejected',
      'cancelled': 'cancelled',
      'refunded': 'refunded',
      'charged_back': 'refunded'
    };
    
    return statusMap[mpStatus] || 'pending';
  }

  async getCommissionConfig() {
    let config = await prisma.commissionConfig.findFirst({
      where: { isActive: true }
    });
    
    if (!config) {
      // Crear configuración por defecto si no existe
      config = await prisma.commissionConfig.create({
        data: {
          serviceFeePercentage: 0.05,
          subscriptionFeePercentage: 0.0,
          processingFeePercentage: 0.029,
          minCommission: 100,
          maxCommission: 5000,
          isActive: true
        }
      });
    }
    
    return config;
  }

  // ========== MÉTODOS DE CONSULTA ==========
  async getPaymentHistory(professionalId, filters = {}) {
    try {
      const { type, status, limit = 50, offset = 0 } = filters;
      
      const where = {
        OR: [
          // Pagos de suscripción
          {
            type: 'subscription',
            externalData: {
              path: ['professional_id'],
              equals: professionalId
            }
          },
          // Pagos de servicios
          {
            type: 'service',
            ServicePayment: {
              professionalId: professionalId
            }
          }
        ]
      };

      if (type) where.type = type;
      if (status) where.status = status;

      const payments = await prisma.payment.findMany({
        where,
        include: {
          ServicePayment: {
            include: {
              Booking: {
                include: {
                  Service: true,
                  User: {
                    select: { name: true, lastName: true }
                  }
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      });

      return payments;
    } catch (error) {
      console.error('Error getting payment history:', error);
      throw error;
    }
  }

  async getPaymentStats(professionalId) {
    try {
      const stats = await prisma.payment.aggregate({
        where: {
          OR: [
            {
              type: 'service',
              ServicePayment: {
                professionalId: professionalId
              }
            }
          ],
          status: 'approved'
        },
        _sum: {
          amount: true
        },
        _count: true
      });

      const commissions = await prisma.commission.aggregate({
        where: {
          professionalId: professionalId,
          status: 'collected'
        },
        _sum: {
          amount: true
        }
      });

      return {
        totalEarnings: stats._sum.amount || 0,
        totalPayments: stats._count || 0,
        totalCommissions: commissions._sum.amount || 0,
        netEarnings: (stats._sum.amount || 0) - (commissions._sum.amount || 0)
      };
    } catch (error) {
      console.error('Error getting payment stats:', error);
      throw error;
    }
  }
}

module.exports = new PaymentService();