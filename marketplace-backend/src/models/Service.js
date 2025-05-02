class Service {
  constructor({
    id,
    professionalId,
    categoryId,
    title,
    description,
    price,
    createdAt,
  }) {
    this.id = id;
    this.professionalId = professionalId;
    this.categoryId = categoryId;
    this.title = title;
    this.description = description;
    this.price = price;
    this.createdAt = createdAt;
  }
}

module.exports = Service;
