// src/middleware/errorHandler.js

function errorHandler(err, req, res, next) {
  // 1. Determinar el status code
  const statusCode = err.statusCode || err.status || 500;

  // 2. Crear el payload base
  const payload = {
    message: err.message || "Internal server error",
  };

  // 3. Agregar validaciones específicas
  //    - Errores de validación (Mongo/Mongoose)
  if (err.name === "ValidationError") {
    payload.message = "Validation failed";
    payload.errors = Object.values(err.errors).map((e) => e.message);
    // sobre-escribir statusCode a 400
    return res.status(400).json(payload);
  }
  //    - Errores de cast (ObjectId inválido, etc.)
  if (err.name === "CastError") {
    payload.message = `Invalid ${err.path}: ${err.value}`;
    return res.status(400).json(payload);
  }

  // 4. Incluir stack sólo en desarrollo
  if (process.env.NODE_ENV === "development") {
    payload.stack = err.stack;
  }

  // 5. Enviar la respuesta
  res.status(statusCode).json(payload);
}

module.exports = errorHandler;
