class Professional {
  constructor({ id, userId, description, experience, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.description = description;
    this.experience = experience;
    this.createdAt = createdAt;
  }
}

module.exports = Professional;
