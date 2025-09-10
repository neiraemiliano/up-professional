import api from './client';

export const paymentsApi = {
  // Create MercadoPago preference for subscription
  createSubscriptionPreference: async (subscriptionData) => {
    const response = await api.post('/payments/create-subscription-preference', subscriptionData);
    return response.data;
  },

  // Process subscription payment success
  processSubscriptionSuccess: async (paymentData) => {
    const response = await api.post('/payments/process-subscription-success', paymentData);
    return response.data;
  },

  // Get payment status
  getPaymentStatus: async (paymentId) => {
    const response = await api.get(`/payments/status/${paymentId}`);
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async (subscriptionId) => {
    const response = await api.post(`/payments/cancel-subscription/${subscriptionId}`);
    return response.data;
  }
};