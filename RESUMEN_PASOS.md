# 🚀 Resumen: Cómo subir a GitHub y Railway

## ✅ Ya está hecho:

1. ✅ Repositorio Git inicializado
2. ✅ Archivos preparados y listos para commit
3. ✅ .gitignore configurado

## 📝 Lo que TÚ necesitas hacer:

### 1️⃣ Configurar Git (solo una vez)

Abre PowerShell/Terminal y ejecuta:

```bash
cd "C:\Users\Usuario\DEX - Project\deploy"
git config user.name "Tu Nombre de GitHub"
git config user.email "tu-email-de-github@ejemplo.com"
```

**Ejemplo:**
```bash
git config user.name "Usuario"
git config user.email "usuario@example.com"
```

### 2️⃣ Hacer el commit

```bash
git commit -m "Initial commit: Einstein Dashboard"
```

### 3️⃣ Crear repositorio en GitHub

1. Ve a https://github.com
2. Haz clic en **"+"** → **"New repository"**
3. Nombre: `einstein-dashboard`
4. **NO** marques "Initialize with README"
5. Haz clic en **"Create repository"**

### 4️⃣ Conectar y subir

**Reemplaza `TU_USUARIO` con tu nombre de usuario real de GitHub:**

```bash
git remote add origin https://github.com/TU_USUARIO/einstein-dashboard.git
git branch -M main
git push -u origin main
```

**Si te pide autenticación:**
- Opción 1: Usa GitHub CLI: `gh auth login`
- Opción 2: Usa un Personal Access Token (crea uno en GitHub → Settings → Developer settings)

### 5️⃣ Conectar con Railway

1. Ve a https://railway.app
2. **New Project** → **"Deploy from GitHub repo"**
3. Autoriza Railway (si es la primera vez)
4. Selecciona el repositorio `einstein-dashboard`
5. Railway detectará automáticamente Node.js y desplegará
6. Ve a **Settings** → **Networking** → **"Generate Domain"** para obtener tu URL pública

## 🎉 ¡Listo!

Ahora cada vez que hagas:
```bash
git add .
git commit -m "Descripción del cambio"
git push
```

Railway actualizará automáticamente tu web. 🚀
