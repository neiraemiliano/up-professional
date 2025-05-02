// src/services/category.service.js
const BaseService = require("./base.service");
const categoryRepo = require("../repositories/CategoryRepository");

class CategoryService extends BaseService {
  constructor() {
    super(categoryRepo);
  }
  // Métodos específicos de Category
}

module.exports = new CategoryService();
