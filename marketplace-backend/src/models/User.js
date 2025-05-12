class User {
  constructor({
    id,
    name,
    lastName,
    email,
    phone,
    password,
    confirmPassword,
    role,
    createdAt,
  }) {
    this.id = id;
    this.name = name;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.role = role;
    this.createdAt = createdAt;
  }
  // Métodos de dominio (p.ej. canBook, isProfessional, etc.)
}

module.exports = User;
