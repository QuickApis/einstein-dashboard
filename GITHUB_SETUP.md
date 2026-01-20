# Cómo subir a GitHub y conectar con Railway

## Paso 1: Crear repositorio en GitHub

1. Ve a https://github.com
2. Haz clic en el **"+"** en la esquina superior derecha → **"New repository"**
3. Nombre del repositorio: `einstein-dashboard` (o el que prefieras)
4. Descripción: "Einstein The Trenchor - Trading Dashboard"
5. **NO** marques "Initialize with README" (ya tenemos archivos)
6. Haz clic en **"Create repository"**

## Paso 2: Conectar tu repositorio local

Git ya está inicializado y los archivos están preparados. Ahora conecta con GitHub:

```bash
cd "C:\Users\Usuario\DEX - Project\deploy"
git remote add origin https://github.com/TU_USUARIO/einstein-dashboard.git
```

**Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub**

## Paso 3: Subir los archivos

```bash
git branch -M main
git push -u origin main
```

Si GitHub te pide autenticación:
- Puedes usar un **Personal Access Token** en lugar de contraseña
- O usa GitHub CLI: `gh auth login`

## Paso 4: Conectar con Railway

1. Ve a https://railway.app
2. Haz clic en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Autoriza Railway a acceder a tu GitHub (si es la primera vez)
5. Selecciona el repositorio `einstein-dashboard`
6. Railway detectará automáticamente que es Node.js

## Paso 5: Configurar Railway

Railway detectará automáticamente:
- **Root Directory**: `.` (raíz del repo)
- **Build Command**: `npm install` (automático)
- **Start Command**: `npm start` (desde package.json)

Si necesitas cambiar algo:
1. Ve a **Settings** → **Deploy**
2. Ajusta las configuraciones si es necesario

## Paso 6: Variables de entorno (Opcional)

En Railway, ve a **Variables** y añade (opcionales, ya tienen valores por defecto):

```
SOLANATRACKER_API_KEY=c25af2e8-3f91-4eb3-9f19-5d2801a9de6b
BOT_PUBLIC_KEY=3RvkCPH7FSz3JxXbvPkNbHqgZEm6J3oWAEmaduqduzyT
```

## Paso 7: Obtener tu URL

1. Ve a **Settings** → **Networking**
2. Haz clic en **"Generate Domain"**
3. Copia la URL que te da (ejemplo: `https://einstein-dashboard-production.up.railway.app`)

## ✅ Listo!

Ahora cada vez que hagas `git push` a GitHub, Railway desplegará automáticamente tus cambios.

---

## Comandos útiles para el futuro

### Hacer cambios y actualizar

```bash
cd "C:\Users\Usuario\DEX - Project\deploy"
git add .
git commit -m "Descripción de los cambios"
git push
```

### Ver estado del repositorio

```bash
git status
```

### Ver logs de Railway

```bash
railway logs
```

---

## Si tienes problemas

### Error: "Authentication failed"
- Usa GitHub CLI: `gh auth login`
- O crea un Personal Access Token en GitHub → Settings → Developer settings → Personal access tokens

### Error: "Repository not found"
- Verifica que el nombre del repositorio sea correcto
- Verifica que hayas dado permisos a Railway para acceder al repo

### Cambios no se reflejan
- Railway despliega automáticamente cuando haces push
- Puede tardar 1-2 minutos en deployar
- Revisa los logs en Railway para ver si hay errores
