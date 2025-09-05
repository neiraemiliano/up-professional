# Server Deployment Guide

## Prerequisites for Server

### 1. Node.js & npm
```bash
# Install Node.js (version 18+ recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. PostgreSQL Database
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql
CREATE DATABASE marketplace;
CREATE USER your_user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE marketplace TO your_user;
\q
```

## Backend Deployment Steps

### 1. Upload and Install Dependencies
```bash
# Upload your backend code to server
cd /path/to/your/marketplace-backend

# Install dependencies (Prisma is included as devDependency)
npm install

# Prisma CLI will be available at ./node_modules/.bin/prisma
```

### 2. Environment Configuration
```bash
# Copy and configure environment file
cp .env.example .env
nano .env
```

Required `.env` variables:
```bash
DATABASE_URL="postgresql://your_user:your_password@localhost:5432/marketplace"
PORT=3000
NODE_ENV=production
JWT_SECRET="your-production-jwt-secret-key"
MERCADOPAGO_ACCESS_TOKEN="PROD-your-access-token"
MERCADOPAGO_PUBLIC_KEY="PROD-your-public-key"
MERCADOPAGO_WEBHOOK_SECRET="your-webhook-secret"
MERCADOPAGO_SUCCESS_URL="https://yourdomain.com/payment/success"
MERCADOPAGO_FAILURE_URL="https://yourdomain.com/payment/failure"
MERCADOPAGO_PENDING_URL="https://yourdomain.com/payment/pending"
CORS_ORIGIN="https://yourdomain.com"
```

### 3. Database Setup
```bash
# Generate Prisma Client and push schema to database
npm run build

# This runs: prisma generate && prisma db push
# - Generates Prisma Client
# - Creates all database tables
# - No migrations needed (using db push)
```

### 4. Optional: Seed Database
```bash
# If you have seed data
npm run seed
# or
node prisma/seedReview.js
```

### 5. Start Backend
```bash
# Development
npm run dev

# Production
npm start
```

## Frontend Deployment Steps

### 1. Configure Environment
```bash
cd /path/to/your/marketplace-frontend

# Copy and configure environment file
cp .env.example .env.local
nano .env.local
```

Required `.env.local` variables:
```bash
VITE_API_URL=https://yourdomain.com/api
VITE_APP_NAME="HomeFized"
VITE_APP_URL=https://yourdomain.com
VITE_MERCADOPAGO_PUBLIC_KEY=PROD-your-public-key
```

### 2. Build Frontend
```bash
# Install dependencies
npm install

# Build for production
npm run build

# This creates a 'dist' folder with static files
```

### 3. Serve Static Files
```bash
# Option 1: Using nginx (recommended)
sudo cp -r dist/* /var/www/html/

# Option 2: Using a simple HTTP server
npm install -g serve
serve -s dist -p 5173
```

## Process Management (PM2 Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start backend with PM2
pm2 start src/index.js --name "marketplace-backend"

# Start frontend (if serving with Node.js)
pm2 start "serve -s dist -p 5173" --name "marketplace-frontend"

# Save PM2 configuration
pm2 save
pm2 startup
```

## Important Notes

1. **Prisma is already in package.json** as devDependency - no global installation needed
2. **Database migrations**: Using `prisma db push` (not migrations) for simplicity
3. **PostgreSQL required**: Make sure database is running and accessible
4. **Environment variables**: Production values must be different from development
5. **SSL certificates**: Configure HTTPS for production
6. **Firewall**: Open ports 3000 (backend) and 80/443 (frontend)

## Troubleshooting

```bash
# Check Prisma Client generation
npx prisma generate

# Check database connection
npx prisma db pull

# View database in browser
npx prisma studio

# Check backend logs
pm2 logs marketplace-backend
```