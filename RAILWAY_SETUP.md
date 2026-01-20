# Guía para desplegar en Railway

## Opción 1: Dashboard Web (Más fácil) 🚀

### Paso 1: Crear cuenta
1. Ve a https://railway.app
2. Haz clic en "Login" y crea una cuenta (puedes usar GitHub, Google, etc.)

### Paso 2: Crear nuevo proyecto
1. En el dashboard, haz clic en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"** (si tienes Git) o **"Empty Project"**

### Opción A: Si usas Git/GitHub
1. Conecta tu repositorio de GitHub
2. Railway detectará automáticamente que es un proyecto Node.js
3. Si la carpeta `deploy` está en la raíz, configura:
   - **Root Directory**: `deploy`
   - **Build Command**: `npm install` (o lo deja vacío, Railway lo hace automático)
   - **Start Command**: `npm start`

### Opción B: Si NO usas Git (Directo)
1. Selecciona **"Empty Project"**
2. Haz clic en **"Settings"** → **"Source"**
3. Selecciona **"Upload from local"** y sube los archivos de la carpeta `deploy`

### Paso 3: Configurar variables de entorno
1. En tu proyecto de Railway, ve a **"Variables"**
2. Añade estas variables (opcionales, ya tienen valores por defecto en el código):
   - `SOLANATRACKER_API_KEY` = `c25af2e8-3f91-4eb3-9f19-5d2801a9de6b`
   - `BOT_PUBLIC_KEY` = `3RvkCPH7FSz3JxXbvPkNbHqgZEm6J3oWAEmaduqduzyT`
   - `PORT` = `3000` (opcional, Railway lo asigna automáticamente)

### Paso 4: Desplegar
1. Railway comenzará a desplegar automáticamente
2. Espera a que termine el deployment (verás los logs en tiempo real)
3. Una vez terminado, Railway te dará una URL pública tipo: `https://tu-proyecto.up.railway.app`

### Paso 5: Obtener tu URL pública
1. Ve a **"Settings"** → **"Networking"**
2. Haz clic en **"Generate Domain"**
3. Copia la URL que te da (algo como: `https://einstein-dashboard-production.up.railway.app`)

---

## Opción 2: Railway CLI (Para avanzados) 💻

### Paso 1: Instalar Railway CLI
```bash
npm install -g @railway/cli
```

### Paso 2: Login
```bash
railway login
```
Esto abrirá tu navegador para autenticarte.

### Paso 3: Inicializar proyecto
```bash
cd deploy
railway init
```
- Te preguntará si quieres crear un nuevo proyecto → **Sí**
- Te dará un nombre → Acepta o pon uno personalizado

### Paso 4: Añadir variables de entorno (opcional)
```bash
railway variables set SOLANATRACKER_API_KEY=c25af2e8-3f91-4eb3-9f19-5d2801a9de6b
railway variables set BOT_PUBLIC_KEY=3RvkCPH7FSz3JxXbvPkNbHqgZEm6J3oWAEmaduqduzyT
```

### Paso 5: Desplegar
```bash
railway up
```
Esto subirá tu código y lo desplegará automáticamente.

### Paso 6: Obtener URL
```bash
railway domain
```
O ve al dashboard web de Railway para ver tu URL.

---

## Comandos útiles

### Ver logs en tiempo real
```bash
railway logs
```

### Abrir en el navegador
```bash
railway open
```

### Ver estado del deployment
```bash
railway status
```

---

## Configurar dominio personalizado (Opcional)

1. Ve a **Settings** → **Networking** en Railway
2. Haz clic en **"Custom Domain"**
3. Añade tu dominio
4. Railway te dará instrucciones para configurar los DNS

---

## Troubleshooting

### Error: "Module not found"
- Asegúrate de que `package.json` tiene todas las dependencias
- Railway debería ejecutar `npm install` automáticamente

### Error: "Port already in use"
- Railway asigna el puerto automáticamente, usa `process.env.PORT` (ya está configurado)

### El sitio no carga
- Revisa los logs: `railway logs` o en el dashboard web
- Verifica que las variables de entorno estén configuradas correctamente

### Cambios no se reflejan
- Railway despliega automáticamente cuando haces push a Git
- Si subiste manualmente, haz clic en **"Redeploy"** en el dashboard

---

## Costos

Railway tiene un plan **gratis** generoso:
- $5 USD de crédito gratis al mes
- Suficiente para proyectos pequeños/medianos
- Si te quedas sin crédito, puedes añadir más

---

## ✅ Checklist antes de desplegar

- [x] Carpeta `deploy` contiene todos los archivos necesarios
- [x] `package.json` está correcto
- [x] Variables de entorno configuradas (opcional)
- [x] `dashboard.js` usa `process.env.PORT` (ya está)
- [x] Todas las dependencias en `package.json`
