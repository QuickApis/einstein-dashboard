# Comandos para subir a GitHub

## Paso 1: Configurar Git (solo la primera vez)

Ejecuta estos comandos reemplazando con tu información:

```bash
cd "C:\Users\Usuario\DEX - Project\deploy"

# Configurar tu nombre y email de GitHub
git config user.name "Tu Nombre"
git config user.email "tu-email@ejemplo.com"
```

**O configurarlo globalmente para todos tus repos:**

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

## Paso 2: Hacer el commit inicial

```bash
cd "C:\Users\Usuario\DEX - Project\deploy"
git commit -m "Initial commit: Einstein Dashboard"
```

## Paso 3: Crear repositorio en GitHub

1. Ve a https://github.com
2. Haz clic en **"+"** → **"New repository"**
3. Nombre: `einstein-dashboard`
4. **NO** marques "Initialize with README"
5. Haz clic en **"Create repository"**

## Paso 4: Conectar y subir

**Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub:**

```bash
cd "C:\Users\Usuario\DEX - Project\deploy"
git remote add origin https://github.com/TU_USUARIO/einstein-dashboard.git
git branch -M main
git push -u origin main
```

Si te pide autenticación:
- Puedes usar **GitHub CLI**: `gh auth login`
- O crea un **Personal Access Token** en GitHub

## Paso 5: Conectar con Railway

1. Ve a https://railway.app
2. **New Project** → **"Deploy from GitHub repo"**
3. Selecciona `einstein-dashboard`
4. Railway desplegará automáticamente

¡Listo! Cada vez que hagas `git push`, Railway actualizará automáticamente.
