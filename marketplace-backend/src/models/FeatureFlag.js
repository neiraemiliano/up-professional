// src/models/FeatureFlag.js
class FeatureFlag {
  constructor({
    id,
    name,
    description,
    isEnabled,
    category,
    configData,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isEnabled = isEnabled;
    this.category = category;
    this.configData = configData;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromPrisma(prismaFeatureFlag) {
    return new FeatureFlag({
      id: prismaFeatureFlag.id,
      name: prismaFeatureFlag.name,
      description: prismaFeatureFlag.description,
      isEnabled: prismaFeatureFlag.isEnabled,
      category: prismaFeatureFlag.category,
      configData: prismaFeatureFlag.configData,
      createdAt: prismaFeatureFlag.createdAt,
      updatedAt: prismaFeatureFlag.updatedAt,
    });
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      isEnabled: this.isEnabled,
      category: this.category,
      configData: this.configData,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = FeatureFlag;