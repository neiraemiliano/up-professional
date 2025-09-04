// src/repositories/FeatureFlagRepository.js
const { PrismaClient } = require("@prisma/client");
const FeatureFlag = require("../models/FeatureFlag");

class FeatureFlagRepository {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll() {
    const featureFlags = await this.prisma.featureFlag.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });
    return featureFlags.map(FeatureFlag.fromPrisma);
  }

  async findByCategory(category) {
    const featureFlags = await this.prisma.featureFlag.findMany({
      where: { category },
      orderBy: { name: 'asc' }
    });
    return featureFlags.map(FeatureFlag.fromPrisma);
  }

  async findById(id) {
    const featureFlag = await this.prisma.featureFlag.findUnique({
      where: { id }
    });
    return featureFlag ? FeatureFlag.fromPrisma(featureFlag) : null;
  }

  async findEnabledFlags() {
    const featureFlags = await this.prisma.featureFlag.findMany({
      where: { isEnabled: true },
      orderBy: { name: 'asc' }
    });
    return featureFlags.map(FeatureFlag.fromPrisma);
  }

  async update(id, data) {
    const updatedFeatureFlag = await this.prisma.featureFlag.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
    return FeatureFlag.fromPrisma(updatedFeatureFlag);
  }

  async toggleFlag(id) {
    // First get current state
    const currentFlag = await this.prisma.featureFlag.findUnique({
      where: { id }
    });
    
    if (!currentFlag) {
      throw new Error(`Feature flag with id ${id} not found`);
    }

    // Toggle the flag
    const updatedFeatureFlag = await this.prisma.featureFlag.update({
      where: { id },
      data: {
        isEnabled: !currentFlag.isEnabled,
        updatedAt: new Date()
      }
    });
    
    return FeatureFlag.fromPrisma(updatedFeatureFlag);
  }

  async create(data) {
    const featureFlag = await this.prisma.featureFlag.create({
      data
    });
    return FeatureFlag.fromPrisma(featureFlag);
  }

  async delete(id) {
    await this.prisma.featureFlag.delete({
      where: { id }
    });
    return true;
  }

  async isFeatureEnabled(flagId) {
    const featureFlag = await this.prisma.featureFlag.findUnique({
      where: { id: flagId },
      select: { isEnabled: true }
    });
    
    return featureFlag ? featureFlag.isEnabled : false;
  }

  async getEnabledFeaturesMap() {
    const featureFlags = await this.prisma.featureFlag.findMany({
      select: { id: true, isEnabled: true }
    });
    
    return featureFlags.reduce((acc, flag) => {
      acc[flag.id] = flag.isEnabled;
      return acc;
    }, {});
  }
}

module.exports = FeatureFlagRepository;