# 🚀 Home-Fixed Auto-Deployment Guide

## 📁 Archivos Creados

1. **`deploy.sh`** - Script principal de despliegue
2. **`auto-deploy-webhook.js`** - Servidor webhook para auto-despliegue  
3. **`nginx-images.conf`** - Configuración nginx para imágenes
4. **`DEPLOYMENT_GUIDE.md`** - Esta guía

## 🛠️ Configuración en el Servidor

### 1. Subir archivos al servidor
```bash
# Copiar los archivos de deployment al servidor
scp deploy.sh auto-deploy-webhook.js nginx-images.conf user@your-server:/srv/homefixed/up-professional/
```

### 2. Configurar permisos
```bash
# En el servidor
cd /srv/homefixed/up-professional
chmod +x deploy.sh
chmod +x auto-deploy-webhook.js
```

### 3. Configurar Nginx (arreglar imágenes)
```bash
# Copiar configuración nginx
sudo cp nginx-images.conf /etc/nginx/sites-available/home-fixed

# Habilitar el sitio
sudo ln -sf /etc/nginx/sites-available/home-fixed /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Crear directorio para imágenes
sudo mkdir -p /var/www/home-fixed/uploads
sudo chown -R www-data:www-data /var/www/home-fixed
sudo chmod -R 755 /var/www/home-fixed

# Probar y recargar nginx
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Instalar PM2 globalmente (si no está)
```bash
sudo npm install -g pm2
```

## 🔄 Opción 1: Despliegue Manual

### Comando simple para desplegar:
```bash
cd /srv/homefixed/up-professional
./deploy.sh
```

Este script hace **TODO automáticamente**:
- ✅ Pull del código más reciente
- ✅ Instala dependencias backend/frontend  
- ✅ Actualiza base de datos (Prisma)
- ✅ Rebuilda el frontend
- ✅ Reinicia servicios PM2
- ✅ Copia archivos a nginx
- ✅ Arregla permisos de imágenes
- ✅ Health checks

## 🔄 Opción 2: Auto-Despliegue con Webhooks

### Configurar webhook server
```bash
# En el servidor
cd /srv/homefixed/up-professional

# Configurar variable de entorno para seguridad
echo "WEBHOOK_SECRET=tu-secret-super-seguro-123" >> .env

# Iniciar webhook server con PM2
pm2 start auto-deploy-webhook.js --name home-fixed-webhook
pm2 save
```

### Configurar webhook en GitHub
1. Ve a tu repositorio en GitHub
2. Settings → Webhooks → Add webhook
3. **Payload URL**: `http://your-server-ip:3001/webhook/deploy`
4. **Content type**: `application/json`
5. **Secret**: `tu-secret-super-seguro-123` (mismo del .env)
6. **Events**: Just the push event
7. **Active**: ✅

### Verificar webhook
```bash
# Ver logs del webhook
pm2 logs home-fixed-webhook

# Estado de todos los servicios
pm2 status
```

## 🖼️ Solución para Imágenes

La configuración nginx incluye:

### Ubicaciones de imágenes:
```bash
/var/www/home-fixed/uploads/    # Imágenes subidas por usuarios
/var/www/home-fixed/avatars/    # Avatares de usuarios  
/var/www/home-fixed/assets/     # Assets del frontend
```

### URLs de imágenes:
```bash
https://home-fixed.com/uploads/image.jpg    # ✅ Funciona
https://home-fixed.com/avatars/user1.png    # ✅ Funciona  
https://home-fixed.com/assets/logo.svg      # ✅ Funciona
```

## 📋 Comandos Útiles

### Despliegue manual:
```bash
cd /srv/homefixed/up-professional
./deploy.sh
```

### Ver logs:
```bash
pm2 logs marketplace-backend
pm2 logs home-fixed-webhook
tail -f /var/log/nginx/home-fixed.error.log
```

### Reiniciar servicios:
```bash
pm2 restart marketplace-backend
pm2 restart home-fixed-webhook
sudo systemctl reload nginx
```

### Debug:
```bash
# Test API
curl http://localhost:3000/api/health

# Test frontend
curl http://localhost/

# Test images
curl -I https://home-fixed.com/uploads/test.jpg
```

## 🎯 Flujo de Trabajo

### Con Auto-Deploy (Recomendado):
1. Haces cambios en el código localmente
2. `git add . && git commit -m "fix: arreglar imágenes"`  
3. `git push origin main`
4. **¡El servidor se actualiza automáticamente!** 🎉

### Con Deploy Manual:
1. Conectar al servidor: `ssh user@server`
2. Ejecutar: `./deploy.sh`
3. Listo ✅

## 🔧 Troubleshooting

### Si las imágenes no cargan:
```bash
# Verificar permisos
ls -la /var/www/home-fixed/uploads/

# Arreglar permisos
sudo chown -R www-data:www-data /var/www/home-fixed
sudo chmod -R 755 /var/www/home-fixed
```

### Si el webhook no funciona:
```bash
# Ver logs
pm2 logs home-fixed-webhook

# Reiniciar webhook
pm2 restart home-fixed-webhook

# Test manual del webhook
curl -X POST http://localhost:3001/webhook/deploy \
  -H "Content-Type: application/json" \
  -d '{"ref":"refs/heads/main","commits":[{"message":"test"}]}'
```

### Si el backend falla:
```bash
# Ver logs detallados
pm2 logs marketplace-backend --lines 50

# Verificar variables de entorno
pm2 show marketplace-backend
```

## 🎉 ¡Ya tienes deployment automático!

Ahora cada vez que hagas `git push`, tu servidor se actualizará automáticamente con:
- ✅ Código más reciente
- ✅ Frontend rebuildeado  
- ✅ Backend reiniciado
- ✅ Base de datos actualizada
- ✅ Imágenes funcionando
- ✅ Servicios health-checked

**¡Solo haz push y relájate!** 🚀