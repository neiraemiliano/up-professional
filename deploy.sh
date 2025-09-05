#!/bin/bash

# Home-Fixed Auto Deployment Script
# Run this script on the server when you want to deploy new changes

set -e  # Exit on any error

echo "🚀 Starting Home-Fixed deployment..."
echo "================================================="

# Configuration
PROJECT_DIR="/srv/homefixed/up-professional"
BACKEND_DIR="$PROJECT_DIR/marketplace-backend"
FRONTEND_DIR="$PROJECT_DIR/marketplace-frontend"
WEB_ROOT="/var/www/home-fixed"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check required commands
print_status "Checking required tools..."
for cmd in git node npm pm2; do
    if ! command_exists $cmd; then
        print_error "$cmd is not installed!"
        exit 1
    fi
done
print_success "All required tools are available"

# Step 1: Pull latest changes from git
print_status "Pulling latest changes from git..."
cd "$PROJECT_DIR"
git fetch origin
git pull origin main
print_success "Code updated from git"

# Step 2: Backend deployment
print_status "Deploying backend..."
cd "$BACKEND_DIR"

# Install/update dependencies
print_status "Installing backend dependencies..."
npm install

# Generate Prisma client and update database
print_status "Updating database schema..."
npx prisma generate
npx prisma db push

# Restart backend with PM2
print_status "Restarting backend service..."
if pm2 list | grep -q "marketplace-backend"; then
    pm2 restart marketplace-backend --update-env
else
    pm2 start src/index.js --name marketplace-backend --env-file .env
fi

# Wait a moment for backend to start
sleep 3

# Check if backend is running
if pm2 list | grep -q "online.*marketplace-backend"; then
    print_success "Backend deployed and running"
else
    print_error "Backend failed to start"
    pm2 logs marketplace-backend --lines 10
    exit 1
fi

# Step 3: Frontend deployment
print_status "Deploying frontend..."
cd "$FRONTEND_DIR"

# Install/update dependencies
print_status "Installing frontend dependencies..."
npm install

# Build frontend
print_status "Building frontend for production..."
npm run build

# Copy built files to web directory
print_status "Deploying frontend files..."
sudo mkdir -p "$WEB_ROOT"
sudo cp -r dist/* "$WEB_ROOT/"
sudo chown -R www-data:www-data "$WEB_ROOT"
sudo chmod -R 755 "$WEB_ROOT"

print_success "Frontend deployed to $WEB_ROOT"

# Step 4: Fix image paths and permissions
print_status "Fixing image paths and permissions..."

# Create uploads directory if it doesn't exist
sudo mkdir -p "$WEB_ROOT/uploads"
sudo chown -R www-data:www-data "$WEB_ROOT/uploads"
sudo chmod -R 755 "$WEB_ROOT/uploads"

# Copy existing uploads if they exist in backend
if [ -d "$BACKEND_DIR/uploads" ]; then
    sudo cp -r "$BACKEND_DIR/uploads"/* "$WEB_ROOT/uploads/" 2>/dev/null || true
fi

# Fix permissions for all static files
sudo find "$WEB_ROOT" -type f -exec chmod 644 {} \;
sudo find "$WEB_ROOT" -type d -exec chmod 755 {} \;

print_success "Image paths and permissions fixed"

# Step 5: Restart web server (nginx/apache)
print_status "Restarting web server..."
if command_exists nginx; then
    sudo nginx -t && sudo systemctl reload nginx
    print_success "Nginx reloaded"
elif command_exists apache2; then
    sudo apache2ctl configtest && sudo systemctl reload apache2
    print_success "Apache reloaded"
else
    print_warning "No web server detected, make sure to restart your web server"
fi

# Step 6: Health check
print_status "Running health checks..."

# Check if backend API is responding
if curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
    print_success "Backend API is responding"
else
    print_warning "Backend API health check failed"
fi

# Check if frontend files exist
if [ -f "$WEB_ROOT/index.html" ]; then
    print_success "Frontend files deployed successfully"
else
    print_error "Frontend deployment failed"
fi

# Step 7: Show deployment status
echo ""
echo "================================================="
print_success "🎉 Deployment completed successfully!"
echo "================================================="
echo ""
echo "📊 Deployment Summary:"
echo "   Frontend: $WEB_ROOT"
echo "   Backend:  Running on port 3000"
echo "   Process:  marketplace-backend (PM2)"
echo ""
echo "🔧 Useful commands:"
echo "   Backend logs:   pm2 logs marketplace-backend"
echo "   Backend status: pm2 status"
echo "   Restart backend: pm2 restart marketplace-backend"
echo ""
echo "🌐 Your site should be live at:"
echo "   https://home-fixed.com"
echo ""

# Optional: Show recent git commits
echo "📝 Recent changes deployed:"
git log --oneline -5
echo ""