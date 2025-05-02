class BaseService {
  constructor(repository) {
    this.repo = repository;
  }

  findAll(opts) {
    return this.repo.findAll(opts);
  }

  findById(id, opts) {
    return this.repo.findById(id, opts);
  }

  create(data) {
    return this.repo.create(data);
  }

  update(id, data) {
    return this.repo.update(id, data);
  }

  delete(id) {
    return this.repo.delete(id);
  }
}

module.exports = BaseService;
