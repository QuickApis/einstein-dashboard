# Variables de Entorno para Railway

## Variables Opcionales (Ya tienen valores por defecto)

En Railway, ve a **"Variables"** en tu proyecto y añade estas variables si quieres sobrescribir los valores por defecto:

### 1. SOLANATRACKER_API_KEY
- **Nombre**: `SOLANATRACKER_API_KEY`
- **Valor**: `c25af2e8-3f91-4eb3-9f19-5d2801a9de6b`
- **Descripción**: API key para SolanaTracker (ya tiene valor por defecto)
- **Opcional**: ✅ Sí (si no la pones, usa el valor por defecto)

### 2. BOT_PUBLIC_KEY
- **Nombre**: `BOT_PUBLIC_KEY`
- **Valor**: `3RvkCPH7FSz3JxXbvPkNbHqgZEm6J3oWAEmaduqduzyT`
- **Descripción**: Dirección pública de la wallet del bot (ya tiene valor por defecto)
- **Opcional**: ✅ Sí (si no la pones, usa el valor por defecto)

### 3. PORT
- **Nombre**: `PORT`
- **Valor**: (dejar vacío o no ponerla)
- **Descripción**: Puerto del servidor
- **Opcional**: ✅ Sí - **Railway lo asigna automáticamente**
- **Nota**: NO necesitas poner esta variable, Railway la gestiona automáticamente

---

## 🎯 Resumen Rápido:

**¿Necesito añadir algo?**

**Respuesta corta: NO es necesario**, el código ya tiene valores por defecto y funcionará sin configurar nada.

**Pero si quieres personalizarlos**, añade en Railway:

```
SOLANATRACKER_API_KEY = c25af2e8-3f91-4eb3-9f19-5d2801a9de6b
BOT_PUBLIC_KEY = 3RvkCPH7FSz3JxXbvPkNbHqgZEm6J3oWAEmaduqduzyT
```

**NO añadas `PORT`** - Railway lo maneja automáticamente.

---

## 📝 Cómo añadir variables en Railway:

1. Ve a tu proyecto en Railway
2. Haz clic en **"Variables"** en el menú lateral
3. Haz clic en **"+ New Variable"**
4. Añade el **Nombre** (ej: `SOLANATRACKER_API_KEY`)
5. Añade el **Valor** (ej: `c25af2e8-3f91-4eb3-9f19-5d2801a9de6b`)
6. Haz clic en **"Add"**

Repite para cada variable que quieras añadir.

---

## ✅ Verificar que funciona:

Después de añadir variables (o si no añades ninguna), Railway redeplegará automáticamente. Puedes verificar en los logs que el servidor está corriendo correctamente.
