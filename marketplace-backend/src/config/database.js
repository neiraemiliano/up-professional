// src/config/database.js
const { PrismaClient } = require('@prisma/client');

class DatabaseClient {
  constructor() {
    if (!DatabaseClient.instance) {
      this.prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
        errorFormat: 'minimal',
      });
      
      // Connect to database
      this.connect();
      
      DatabaseClient.instance = this;
    }
    
    return DatabaseClient.instance;
  }

  async connect() {
    try {
      await this.prisma.$connect();
      console.log('✅ Database connected successfully');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      process.exit(1);
    }
  }

  async disconnect() {
    try {
      await this.prisma.$disconnect();
      console.log('✅ Database disconnected successfully');
    } catch (error) {
      console.error('❌ Database disconnection failed:', error);
    }
  }

  getClient() {
    return this.prisma;
  }
}

// Create singleton instance
const databaseClient = new DatabaseClient();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Graceful shutdown initiated...');
  await databaseClient.disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Graceful shutdown initiated...');
  await databaseClient.disconnect();
  process.exit(0);
});

module.exports = databaseClient.getClient();