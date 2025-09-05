# Production Environment Setup Guide

## 🔐 Environment Files Created

### Frontend Production Config
- **File**: `marketplace-frontend/.env.production`
- **Domain**: `home-fixed.com` 
- **API**: `https://api.home-fixed.com/api`

### Backend Production Config  
- **File**: `marketplace-backend/.env.production`
- **Database**: PostgreSQL with SSL
- **Domain**: `api.home-fixed.com`

## 🔑 Keys You Need to Replace

### 1. MercadoPago (Argentina)
Get from: https://www.mercadopago.com.ar/developers/panel/app

**Frontend** (`.env.production`):
```bash
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-your-production-public-key-here
```

**Backend** (`.env.production`):
```bash
MERCADOPAGO_ACCESS_TOKEN=APP_USR-your-production-access-token-here
MERCADOPAGO_PUBLIC_KEY=APP_USR-your-production-public-key-here
MERCADOPAGO_WEBHOOK_SECRET=your-webhook-secret-key-here
```

### 2. Database (PostgreSQL)
Replace in backend `.env.production`:
```bash
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
```

### 3. JWT Secret
Generate a strong JWT secret:
```bash
# Generate random JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Domain URLs
Replace `home-fixed.com` with your actual domain in both files.

## 🚀 Deployment Steps

### 1. Copy Environment Files
```bash
# Frontend
cp marketplace-frontend/.env.production marketplace-frontend/.env.local

# Backend  
cp marketplace-backend/.env.production marketplace-backend/.env
```

### 2. Update With Real Values
```bash
# Edit and replace placeholder values
nano marketplace-frontend/.env.local
nano marketplace-backend/.env
```

### 3. Secure File Permissions
```bash
chmod 600 marketplace-frontend/.env.local
chmod 600 marketplace-backend/.env
```

## 🔒 Security Checklist

- [ ] Change all placeholder passwords and secrets
- [ ] Use SSL/HTTPS for all URLs
- [ ] Set strong JWT secret (64+ characters)
- [ ] Enable database SSL (`sslmode=require`)
- [ ] Configure firewall (only ports 80, 443, 22)
- [ ] Set up domain SSL certificates (Let's Encrypt)
- [ ] Enable CORS only for your domain
- [ ] Use environment variables, never commit secrets

## 🌐 DNS Configuration

Point these domains to your server:
- `home-fixed.com` → Frontend (port 80/443)
- `api.home-fixed.com` → Backend (port 3000)

## 📊 Optional Services

### Google Maps API
Get from: https://console.cloud.google.com/apis/credentials
```bash
VITE_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### SendGrid (Email)
Get from: https://app.sendgrid.com/settings/api_keys
```bash
SENDGRID_API_KEY=SG.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

### AWS S3 (File Storage)
Get from: https://console.aws.amazon.com/iam/
```bash
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## ⚡ Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Copy and configure environment
cp .env.production .env
nano .env

# 3. Build and deploy
npm run build
npm start

# 4. Use PM2 for process management
pm2 start npm --name "home-fixed-backend" -- start
pm2 save
pm2 startup
```

## 🐛 Troubleshooting

```bash
# Check environment variables are loaded
node -e "console.log(process.env.DATABASE_URL)"

# Test database connection
npx prisma db pull

# Check MercadoPago keys
curl -X GET "https://api.mercadopago.com/v1/account/settings" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---
**Important**: Never commit `.env` files to git. Keep secrets secure!