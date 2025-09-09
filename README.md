# Home-Fixed - Professional Services Marketplace

[![Version](https://img.shields.io/badge/version-2.0.2-blue.svg)](https://github.com/home-fixed/marketplace)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.x-brightgreen.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D13.0-blue.svg)](https://www.postgresql.org/)

**Home-Fixed** es una plataforma moderna de marketplace que conecta usuarios con profesionales de servicios para el hogar. La aplicación permite a los usuarios encontrar y contratar profesionales verificados, mientras que los profesionales pueden gestionar sus servicios, disponibilidad y recibir pagos de forma segura.

## 🚀 Demo y Enlaces

- **Website**: [https://home-fixed.com](https://home-fixed.com)
- **API**: [https://home-fixed.com/api](https://home-fixed.com/api)
- **Admin Panel**: [https://home-fixed.com/admin](https://home-fixed.com/admin)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración de Entorno](#-configuración-de-entorno)
- [Desarrollo](#-desarrollo)
- [Producción](#-producción)
- [API Documentation](#-api-documentation)
- [Despliegue](#-despliegue)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## ✨ Características

### 🏠 **Para Usuarios**
- **Búsqueda Inteligente**: Encuentra profesionales por categoría, ubicación y disponibilidad
- **Sistema de Reservas**: Agenda servicios con fecha y hora específica
- **Reservas Urgentes**: Solicita servicios de emergencia (disponible 24/7)
- **Sistema de Reviews**: Califica y comenta sobre los servicios recibidos
- **Pagos Seguros**: Integración con MercadoPago para pagos seguros
- **Seguimiento en Tiempo Real**: Monitorea el estado de tus reservas
- **Notificaciones**: Recibe actualizaciones sobre tus servicios

### 👷 **Para Profesionales**
- **Perfil Profesional**: Crea y gestiona tu perfil con portfolio de trabajos
- **Gestión de Servicios**: Define tus servicios, precios y categorías
- **Calendario de Disponibilidad**: Configura tus horarios disponibles
- **Sistema de Verificación**: Proceso de verificación de identidad y certificaciones
- **Dashboard Analytics**: Estadísticas de rendimiento y ganancias
- **Planes de Suscripción**: Free, Premium y Pro con diferentes beneficios
- **Gestión de Leads**: Control de contactos mensuales según tu plan
- **Certificaciones**: Sube y gestiona tus certificaciones profesionales

### 🛡️ **Para Administradores**
- **Panel de Administración**: Dashboard completo para gestión de la plataforma
- **Gestión de Usuarios**: Administra usuarios, profesionales y verificaciones
- **Sistema de Pagos**: Monitorea transacciones y comisiones
- **Analytics Avanzados**: Métricas detalladas de uso y rendimiento
- **Gestión de Contenido**: Administra categorías, servicios y ubicaciones
- **Sistema de Feature Flags**: Habilita/deshabilita funcionalidades dinámicamente

### 🔧 **Características Técnicas**
- **SEO Optimizado**: Meta tags dinámicos y sitemap automático
- **Responsive Design**: Optimizado para móviles, tablets y desktop
- **PWA Ready**: Funcionalidades de Progressive Web App
- **Multi-idioma**: Soporte para múltiples idiomas (Español, Inglés)
- **Rate Limiting**: Protección contra abuso de API
- **CORS Configurado**: Seguridad entre dominios
- **Logging Avanzado**: Sistema de logs para monitoreo y debugging

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React +      │◄──►│   (Node.js +    │◄──►│  (PostgreSQL +  │
│   TypeScript)   │    │   Express)      │    │   Prisma ORM)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Assets    │    │   MercadoPago   │    │   File Storage  │
│   (Images/      │    │   (Payments)    │    │   (Uploads)     │
│   Documents)    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Flujo de Datos Principal

1. **Cliente** → **Frontend (React)** → **Backend API (Express)** → **Database (PostgreSQL)**
2. **Pagos** → **MercadoPago API** → **Webhooks** → **Backend** → **Database**
3. **Archivos** → **Upload Middleware** → **File Storage** → **CDN/Public Access**

## 🛠️ Tecnologías

### Frontend
- **React 19** - Biblioteca de interfaces de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Build tool y dev server ultra-rápido
- **Tailwind CSS 4** - Framework CSS utility-first
- **React Router 7** - Navegación del lado del cliente
- **TanStack Query** - Gestión de estado del servidor
- **Axios** - Cliente HTTP
- **React Hook Form** - Gestión de formularios
- **Recharts & ApexCharts** - Visualización de datos
- **Lucide React** - Iconos SVG
- **React DnD** - Drag and drop

### Backend
- **Node.js 18+** - Runtime de JavaScript
- **Express 5** - Framework web minimalista
- **Prisma 6** - ORM de próxima generación
- **PostgreSQL 13+** - Base de datos relacional
- **JWT** - Autenticación basada en tokens
- **Bcrypt** - Hash de contraseñas
- **Morgan** - Logger HTTP
- **CORS** - Cross-Origin Resource Sharing
- **Joi** - Validación de esquemas
- **Dotenv** - Variables de entorno
- **MercadoPago SDK** - Procesamiento de pagos

### DevOps & Deployment
- **Docker** - Contenedorización
- **Nginx** - Servidor web y proxy reverso
- **PM2** - Process manager para Node.js
- **Let's Encrypt** - Certificados SSL gratuitos
- **GitHub Actions** - CI/CD pipeline
- **DigitalOcean/VPS** - Hosting y deployment

## 📦 Instalación

### Requisitos Previos

Asegúrate de tener instalado:

- **Node.js 18.x o superior** (recomendado Node.js 20.x)
- **npm 9.x o superior** (incluido con Node.js)
- **PostgreSQL 13.x o superior**
- **Git** para clonar el repositorio

### Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/up-professional.git
cd up-professional
```

### Instalación de Dependencias

**Frontend:**
```bash
cd marketplace-frontend
npm install
```

**Backend:**
```bash
cd marketplace-backend
npm install
```

## ⚙️ Configuración de Entorno

El proyecto está configurado con dos entornos principales:

### Development (Desarrollo Local)

**Frontend (.env.development)**
```bash
# API Configuration - Localhost Backend
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME="Home-Fixed (Dev)"
VITE_APP_URL=http://localhost:5173

# MercadoPago Test
VITE_MERCADOPAGO_PUBLIC_KEY=TEST-your-test-key-here

# Development Features
VITE_DEV_TOOLS=true
VITE_DEBUG_MODE=true
```

**Backend (.env.development)**
```bash
# Database - Local PostgreSQL
DATABASE_URL="postgresql://localhost:5432/marketplace_dev?schema=public"

# Server Configuration
PORT=3000
NODE_ENV=development
HOST=localhost

# CORS - Allow localhost frontend
CORS_ORIGIN=http://localhost:5173

# MercadoPago Test
MERCADOPAGO_ACCESS_TOKEN="TEST-your-test-token-here"
MERCADOPAGO_PUBLIC_KEY="TEST-your-test-key-here"
```

### Production (Producción)

**Frontend (.env.production)**
```bash
# API Configuration - Production Backend
VITE_API_URL=https://home-fixed.com/api
VITE_APP_NAME="Home-Fixed"
VITE_APP_URL=https://home-fixed.com

# MercadoPago Production
VITE_MERCADOPAGO_PUBLIC_KEY=APP_USR-your-production-key-here

# Production Features
VITE_DEV_TOOLS=false
VITE_DEBUG_MODE=false
```

**Backend (.env.production)**
```bash
# Database - Production PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/marketplace?schema=public"

# Server Configuration
PORT=3000
NODE_ENV=production
HOST=0.0.0.0

# Security
JWT_SECRET="your-super-secret-jwt-key"
BCRYPT_ROUNDS=12

# CORS - Production domain
CORS_ORIGIN=https://home-fixed.com

# MercadoPago Production
MERCADOPAGO_ACCESS_TOKEN="APP_USR-your-production-token-here"
```

### Configuración de Base de Datos

1. **Crear la base de datos:**
```bash
# Desarrollo
createdb marketplace_dev

# Producción  
createdb marketplace
```

2. **Ejecutar migraciones:**
```bash
cd marketplace-backend
npx prisma db push
npx prisma generate
```

3. **Poblar con datos de ejemplo (opcional):**
```bash
npx prisma db seed
```

## 🔧 Desarrollo

### Levantar el Entorno de Desarrollo

**Terminal 1 - Backend:**
```bash
cd marketplace-backend
npm run dev
# Servidor corriendo en http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd marketplace-frontend  
npm run dev
# Aplicación corriendo en http://localhost:5173
```

### Scripts de Desarrollo Disponibles

**Frontend:**
```bash
npm run dev          # Inicia dev server con hot-reload
npm run build:dev    # Build para desarrollo
npm run preview      # Preview del build
npm run lint         # Ejecuta ESLint
```

**Backend:**
```bash
npm run dev          # Inicia servidor con nodemon
npm run start:dev    # Inicia servidor sin hot-reload
npm run build        # Ejecuta migraciones de Prisma
```

### Debugging

**Frontend Debug:**
```bash
# Las dev tools están habilitadas en desarrollo
# Revisa la consola del navegador para logs
```

**Backend Debug:**
```bash
# Los logs se muestran en la consola
# Para debugging detallado:
DEBUG=* npm run dev
```

## 🚀 Producción

### Build para Producción

**Frontend:**
```bash
cd marketplace-frontend
npm run build
# Los archivos se generan en ./dist/
```

**Backend:**
```bash
cd marketplace-backend
npm run build  # Genera cliente de Prisma y ejecuta migraciones
```

### Ejecutar en Producción

**Frontend (Servir archivos estáticos):**
```bash
# Con un servidor web como Nginx, Apache, o servir con Node.js:
cd marketplace-frontend
npm run preview
```

**Backend:**
```bash
cd marketplace-backend
npm start
# Servidor corriendo en el puerto especificado en .env.production
```

### Variables de Entorno de Producción

Asegúrate de configurar estas variables críticas en producción:

```bash
# Backend
DATABASE_URL="postgresql://..."
JWT_SECRET="your-strong-secret"
MERCADOPAGO_ACCESS_TOKEN="APP_USR-..."
CORS_ORIGIN="https://your-domain.com"

# Frontend
VITE_API_URL="https://your-api-domain.com/api"
VITE_MERCADOPAGO_PUBLIC_KEY="APP_USR-..."
```

## 📚 API Documentation

### Endpoints Principales

**Authentication:**
```
POST /api/auth/register    # Registro de usuario
POST /api/auth/login       # Inicio de sesión  
POST /api/auth/logout      # Cerrar sesión
GET  /api/auth/me          # Obtener perfil actual
```

**Users:**
```
GET    /api/users          # Listar usuarios
GET    /api/users/:id      # Obtener usuario por ID
PUT    /api/users/:id      # Actualizar usuario
DELETE /api/users/:id      # Eliminar usuario
```

**Professionals:**
```
GET    /api/professionals           # Listar profesionales
POST   /api/professionals           # Crear perfil profesional
GET    /api/professionals/:id       # Obtener profesional por ID
PUT    /api/professionals/:id       # Actualizar profesional
POST   /api/professionals/:id/verify # Verificar profesional
```

**Services:**
```
GET    /api/services          # Listar servicios
POST   /api/services          # Crear servicio
GET    /api/services/:id      # Obtener servicio por ID
PUT    /api/services/:id      # Actualizar servicio
DELETE /api/services/:id      # Eliminar servicio
```

**Bookings:**
```
GET    /api/bookings              # Listar reservas
POST   /api/bookings              # Crear reserva
GET    /api/bookings/:id          # Obtener reserva por ID
PUT    /api/bookings/:id          # Actualizar reserva
POST   /api/bookings/:id/confirm  # Confirmar reserva
POST   /api/bookings/:id/cancel   # Cancelar reserva
```

**Search:**
```
GET /api/search                    # Búsqueda básica
GET /api/intelligent-search        # Búsqueda inteligente con filtros
```

**Payments:**
```
POST /api/payments/create-payment   # Crear pago con MercadoPago
POST /api/payments/webhook          # Webhook de MercadoPago
GET  /api/payments/:id/status       # Estado del pago
```

### Autenticación

La API usa JWT para autenticación. Incluye el token en el header:

```javascript
Authorization: Bearer <your-jwt-token>
```

### Códigos de Estado

- `200` - OK
- `201` - Created  
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

## 🚢 Despliegue

### Despliegue Manual

1. **Preparar servidor:**
```bash
# Instalar dependencias del sistema
sudo apt update
sudo apt install nodejs npm postgresql nginx

# Configurar PostgreSQL
sudo -u postgres createdb marketplace
```

2. **Clonar y configurar:**
```bash
git clone <your-repo>
cd up-professional

# Backend
cd marketplace-backend
npm install --production
cp .env.production.example .env.production
# Editar .env.production con tus valores
npx prisma db push

# Frontend  
cd ../marketplace-frontend
npm install
cp .env.production.example .env.production
# Editar .env.production con tus valores
npm run build
```

3. **Configurar Nginx:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /path/to/marketplace-frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **Configurar PM2:**
```bash
cd marketplace-backend
npm install -g pm2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

### Despliegue con Docker

1. **Dockerfile Backend:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
```

2. **Docker Compose:**
```yaml
version: '3.8'
services:
  backend:
    build: ./marketplace-backend
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/marketplace
      
  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: marketplace
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./marketplace-frontend/dist:/usr/share/nginx/html
    depends_on:
      - backend

volumes:
  postgres_data:
```

### CI/CD con GitHub Actions

```yaml
name: Deploy
on:
  push:
    branches: [main]
    
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install and build frontend
        run: |
          cd marketplace-frontend
          npm install
          npm run build
          
      - name: Install backend dependencies
        run: |
          cd marketplace-backend
          npm install --production
          
      - name: Deploy to server
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /var/www/up-professional
            git pull origin main
            # Restart services...
```

## 📝 Scripts Disponibles

### Frontend Scripts

```bash
# Desarrollo
npm run dev              # Vite dev server en modo development
npm run build           # Build para producción
npm run build:dev       # Build para desarrollo
npm run preview         # Preview del build local
npm run lint            # Ejecutar ESLint

# Utilidades
npm run type-check      # Verificar tipos TypeScript
```

### Backend Scripts

```bash
# Desarrollo
npm run dev             # Nodemon con NODE_ENV=development
npm run start           # Producción con NODE_ENV=production
npm run start:dev       # Desarrollo sin hot-reload

# Base de datos
npm run build           # Prisma generate + db push
npm run db:migrate      # Ejecutar migraciones
npm run db:seed         # Poblar con datos de ejemplo
npm run db:reset        # Reset completo de BD

# Utilidades
npm run lint            # ESLint (si está configurado)
npm test               # Ejecutar tests
```

### Comandos de Prisma

```bash
# Desarrollo de esquemas
npx prisma db push          # Sincronizar schema con BD
npx prisma db pull          # Extraer schema desde BD
npx prisma generate         # Generar cliente Prisma
npx prisma migrate dev      # Crear y aplicar migración
npx prisma migrate deploy   # Aplicar migraciones en producción

# Utilidades
npx prisma studio          # Abrir Prisma Studio (GUI)
npx prisma db seed         # Ejecutar seeds
npx prisma format          # Formatear schema.prisma
```

## 🗂️ Estructura del Proyecto

```
up-professional/
├── marketplace-frontend/          # Aplicación React
│   ├── src/
│   │   ├── components/           # Componentes reutilizables
│   │   │   ├── common/          # Componentes comunes
│   │   │   ├── forms/           # Formularios
│   │   │   └── ui/              # Componentes UI base
│   │   ├── pages/               # Páginas de la aplicación
│   │   │   ├── Auth/            # Autenticación
│   │   │   ├── Dashboard/       # Dashboards
│   │   │   ├── Professional/    # Páginas de profesional
│   │   │   └── Search/          # Búsqueda y resultados
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # Servicios API
│   │   ├── utils/               # Utilidades
│   │   ├── types/               # Definiciones TypeScript
│   │   └── styles/              # Estilos globales
│   ├── public/                  # Archivos públicos
│   ├── .env.development         # Variables desarrollo
│   ├── .env.production          # Variables producción
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── marketplace-backend/           # API Node.js
│   ├── src/
│   │   ├── controllers/         # Controladores de rutas
│   │   ├── middlewares/         # Middlewares Express
│   │   ├── routes/              # Definición de rutas
│   │   │   ├── auth.routes.js   # Autenticación
│   │   │   ├── user.routes.js   # Usuarios
│   │   │   ├── professional.routes.js # Profesionales
│   │   │   ├── service.routes.js     # Servicios
│   │   │   ├── booking.routes.js     # Reservas
│   │   │   ├── payment.routes.js     # Pagos
│   │   │   └── search.routes.js      # Búsquedas
│   │   ├── services/            # Lógica de negocio
│   │   ├── utils/               # Utilidades
│   │   ├── config/              # Configuraciones
│   │   └── index.js             # Punto de entrada
│   ├── prisma/
│   │   ├── schema.prisma        # Esquema de base de datos
│   │   ├── migrations/          # Migraciones
│   │   └── seed.js              # Datos de ejemplo
│   ├── uploads/                 # Archivos subidos
│   ├── .env.development         # Variables desarrollo
│   ├── .env.production          # Variables producción
│   ├── package.json
│   └── ecosystem.config.js      # Configuración PM2
│
├── docs/                        # Documentación adicional
├── scripts/                     # Scripts de deployment
├── docker-compose.yml           # Configuración Docker
├── nginx.conf                   # Configuración Nginx
├── deploy.sh                    # Script de despliegue
├── DEPLOYMENT_GUIDE.md          # Guía de despliegue
├── SERVER_SETUP.md              # Configuración de servidor
├── PRODUCTION_SETUP.md          # Setup de producción
└── README.md                    # Este archivo
```

### Arquitectura de Componentes Frontend

```
components/
├── common/                      # Componentes base
│   ├── Header/                  # Header navegación
│   ├── Footer/                  # Footer
│   ├── Sidebar/                 # Barra lateral
│   ├── Layout/                  # Layouts de página
│   └── Loading/                 # Componentes de carga
├── forms/                       # Formularios especializados
│   ├── LoginForm/               # Formulario login
│   ├── RegisterForm/            # Formulario registro
│   ├── BookingForm/             # Formulario reserva
│   └── ProfileForm/             # Formulario perfil
└── ui/                          # Componentes UI primitivos
    ├── Button/                  # Botones
    ├── Input/                   # Inputs
    ├── Modal/                   # Modales
    ├── Card/                    # Cards
    ├── Table/                   # Tablas
    └── Charts/                  # Gráficos
```

### Arquitectura Backend API

```
src/
├── controllers/                 # Lógica de controladores
│   ├── auth.controller.js       # Autenticación
│   ├── user.controller.js       # Gestión usuarios
│   ├── professional.controller.js # Gestión profesionales
│   ├── service.controller.js    # Gestión servicios
│   ├── booking.controller.js    # Gestión reservas
│   └── payment.controller.js    # Gestión pagos
├── middlewares/                 # Middlewares personalizados
│   ├── auth.js                  # Autenticación JWT
│   ├── validate.js              # Validación esquemas
│   ├── upload.js                # Subida archivos
│   └── rateLimit.js             # Rate limiting
├── routes/                      # Definición de rutas
├── services/                    # Servicios de negocio
│   ├── emailService.js          # Envío emails
│   ├── paymentService.js        # Lógica pagos
│   └── notificationService.js   # Notificaciones
└── utils/                       # Utilidades
    ├── jwt.js                   # Utilidades JWT
    ├── bcrypt.js                # Hash passwords
    └── validators.js            # Validadores custom
```

## 🤝 Contribución

### Proceso de Contribución

1. **Fork** del repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Estándares de Código

**Frontend:**
- Usa **TypeScript** para todo código nuevo
- Sigue las convenciones de **React Hooks**
- Usa **Tailwind CSS** para estilos
- Ejecuta `npm run lint` antes de commit

**Backend:**
- Usa **ES6+** syntax
- Sigue convenciones **RESTful** para APIs
- Documenta endpoints con comentarios
- Usa **Prisma** para interacciones con BD

### Commits

Usa [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add payment integration with MercadoPago
fix: resolve booking date validation issue
docs: update API documentation
style: format code according to ESLint rules
refactor: improve search algorithm performance
test: add unit tests for booking controller
```

### Testing

**Frontend:**
```bash
cd marketplace-frontend
npm run test        # Ejecutar tests unitarios
npm run test:e2e    # Tests end-to-end (si disponible)
```

**Backend:**
```bash
cd marketplace-backend
npm test           # Ejecutar tests unitarios
npm run test:api   # Tests de API (si disponible)
```

### Pull Request Template

```markdown
## Descripción
Breve descripción de los cambios realizados.

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change
- [ ] Documentación

## Testing
- [ ] Tests existentes pasan
- [ ] Se agregaron nuevos tests
- [ ] Se probó manualmente

## Screenshots
(Si aplica)
```

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:

- **Issues**: [GitHub Issues](https://github.com/tu-usuario/up-professional/issues)
- **Email**: support@home-fixed.com
- **Documentación**: Ver archivos en `/docs/`

## 🎯 Roadmap

### Q1 2025
- [ ] Sistema de chat en tiempo real
- [ ] Notificaciones push
- [ ] App móvil (React Native)
- [ ] Sistema de subscripciones mejorado

### Q2 2025
- [ ] Integración con Google Calendar
- [ ] Sistema de reputación avanzado
- [ ] Multi-idioma completo
- [ ] Analytics dashboard mejorado

### Q3 2025
- [ ] Inteligencia artificial para matching
- [ ] Sistema de recomendaciones
- [ ] Integración con redes sociales
- [ ] API pública para terceros

---

**¡Gracias por usar Home-Fixed! 🏠✨**

Para más información, revisa la documentación en la carpeta `/docs/` o visita nuestro sitio web.