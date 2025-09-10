// src/middlewares/webhookValidation.js
const crypto = require('crypto');

/**
 * Middleware to validate MercadoPago webhook signatures
 * Prevents webhook spoofing attacks
 */
const validateMercadoPagoWebhook = (req, res, next) => {
  try {
    const signature = req.headers['x-signature'];
    const requestId = req.headers['x-request-id'];
    
    if (!signature || !requestId) {
      console.error('Missing webhook headers:', { signature: !!signature, requestId: !!requestId });
      return res.status(400).json({ 
        error: 'Missing required webhook headers' 
      });
    }

    // MercadoPago webhook secret from environment
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('MERCADOPAGO_WEBHOOK_SECRET not configured');
      return res.status(500).json({ 
        error: 'Webhook validation not properly configured' 
      });
    }

    // Parse signature header (format: "ts=timestamp,v1=signature")
    const parts = signature.split(',');
    let timestamp, v1Signature;
    
    for (const part of parts) {
      const [key, value] = part.split('=');
      if (key === 'ts') timestamp = value;
      if (key === 'v1') v1Signature = value;
    }

    if (!timestamp || !v1Signature) {
      console.error('Invalid signature format:', signature);
      return res.status(400).json({ 
        error: 'Invalid webhook signature format' 
      });
    }

    // Check timestamp (reject requests older than 5 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    const webhookTime = parseInt(timestamp);
    const maxAge = 300; // 5 minutes in seconds

    if (Math.abs(currentTime - webhookTime) > maxAge) {
      console.error('Webhook timestamp too old:', { webhookTime, currentTime });
      return res.status(400).json({ 
        error: 'Webhook timestamp too old' 
      });
    }

    // Create expected signature
    const rawBody = JSON.stringify(req.body);
    const payload = `id:${req.body.id};request-id:${requestId};ts:${timestamp};`;
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(payload)
      .digest('hex');

    // Verify signature using secure comparison
    const isValid = crypto.timingSafeEqual(
      Buffer.from(v1Signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );

    if (!isValid) {
      console.error('Invalid webhook signature:', {
        expected: expectedSignature,
        received: v1Signature,
        payload: payload
      });
      return res.status(401).json({ 
        error: 'Invalid webhook signature' 
      });
    }

    // Signature valid, proceed to webhook handler
    next();

  } catch (error) {
    console.error('Webhook validation error:', error);
    return res.status(500).json({ 
      error: 'Webhook validation failed' 
    });
  }
};

/**
 * Generic webhook validation for other services
 */
const validateGenericWebhook = (secret) => {
  return (req, res, next) => {
    const signature = req.headers['x-webhook-signature'] || req.headers['x-signature'];
    
    if (!signature) {
      return res.status(400).json({ error: 'Missing webhook signature' });
    }

    const rawBody = JSON.stringify(req.body);
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    const receivedSignature = signature.replace('sha256=', '');
    
    const isValid = crypto.timingSafeEqual(
      Buffer.from(receivedSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    next();
  };
};

module.exports = {
  validateMercadoPagoWebhook,
  validateGenericWebhook
};