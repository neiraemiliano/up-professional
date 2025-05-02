// =======================
// src/controllers/base.controller.js
// =======================
function generateController(service) {
  return {
    getAll: async (req, res, next) => {
      try {
        const items = await service.findAll();
        res.json(items);
      } catch (err) {
        next(err);
      }
    },

    getById: async (req, res, next) => {
      try {
        const id = parseInt(req.params.id, 10);
        const item = await service.findById(id);
        if (!item) return res.status(404).json({ message: "Not found" });
        res.json(item);
      } catch (err) {
        next(err);
      }
    },

    create: async (req, res, next) => {
      try {
        const created = await service.create(req.body);
        res.status(201).json(created);
      } catch (err) {
        next(err);
      }
    },

    update: async (req, res, next) => {
      try {
        const id = parseInt(req.params.id, 10);
        const updated = await service.update(id, req.body);
        res.json(updated);
      } catch (err) {
        next(err);
      }
    },

    delete: async (req, res, next) => {
      try {
        const id = parseInt(req.params.id, 10);
        await service.delete(id);
        res.status(204).end();
      } catch (err) {
        next(err);
      }
    },
  };
}

module.exports = generateController;
