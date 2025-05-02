// src/middlewares/validate.js

// Validar el cuerpo de la petición
const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
  });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ errors });
  }
  next();
};

// Validar parámetros de ruta
const validateParams = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params, {
    abortEarly: false,
    allowUnknown: false,
  });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ errors });
  }
  next();
};

// Validar query strings
const validateQuery = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.query, {
    abortEarly: false,
    allowUnknown: false,
  });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return res.status(400).json({ errors });
  }
  next();
};

module.exports = { validateBody, validateParams, validateQuery };
