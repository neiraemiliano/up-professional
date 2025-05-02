// src/services/auth.service.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/UserRepository");

class AuthService {
  constructor() {
    this.userRepo = userRepo;
    this.jwtSecret = process.env.JWT_SECRET || "change_this_secret";
    this.jwtExpires = process.env.JWT_EXPIRES_IN || "1h";
  }

  async register(userData) {
    // Verificar si email existe
    const existing = await this.userRepo.findByEmail(userData.email);
    if (existing) {
      const err = new Error("Email already in use");
      err.status = 400;
      throw err;
    }
    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(userData.password, salt);
    // Crear usuario
    const user = await this.userRepo.create({
      ...userData,
      password: hash,
    });
    const token = jwt.sign({ sub: user.id }, this.jwtSecret, {
      expiresIn: this.jwtExpires,
    });
    delete user.password;
    return { user, token };
  }

  async login({ email, password }) {
    console.log("🚀 ~ AuthService ~ login ~ password:", password);
    const user = await this.userRepo.findByEmail(email);
    console.log("🚀 ~ AuthService ~ login ~ user:", user);
    if (!user) {
      const err = new Error("Usuario o Contreseña incorrectos");
      err.status = 401;
      throw err;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const err = new Error("Usuario o Contreseña incorrectos");
      err.status = 401;
      throw err;
    }
    console.log("🚀 ~ AuthService ~ login ~ isMatch:", isMatch);
    // Generar token
    const payload = { id: user.id, role: user.role };
    const token = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpires,
    });
    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

module.exports = new AuthService();
