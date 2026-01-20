# Configuración DNS para Railway

## Problema: El registro CNAME con "@" no se acepta

Algunos proveedores de DNS no permiten registros CNAME en la raíz del dominio (@). Aquí tienes las soluciones:

---

## Solución 1: Usar registro A (Recomendado)

Si tu proveedor no permite CNAME en la raíz (@), necesitas obtener la IP de Railway:

### Paso 1: Obtener la IP de Railway
```bash
nslookup fycy6gsy.up.railway.app
```
O visita: https://www.whatsmydns.net/#A/fycy6gsy.up.railway.app

### Paso 2: Configurar en tu DNS
- **Tipo**: `A` (en lugar de CNAME)
- **Nombre**: `@` (o déjalo vacío si tu proveedor lo requiere)
- **Valor**: La IP que obtuviste (ejemplo: `35.186.228.47`)
- **TTL**: `1 hora` o `30 minutos`

**Nota**: Railway cambia IPs ocasionalmente, así que esta solución puede requerir actualizaciones manuales.

---

## Solución 2: Usar ALIAS (Si tu proveedor lo soporta)

Algunos proveedores tienen un tipo especial "ALIAS" o "ANAME" para la raíz:

- **Tipo**: `ALIAS` o `ANAME`
- **Nombre**: `@`
- **Valor**: `fycy6gsy.up.railway.app`
- **TTL**: `1 hora`

---

## Solución 3: Usar www (Más fácil)

Si solo necesitas que funcione en www:

- **Tipo**: `CNAME`
- **Nombre**: `www` (en lugar de @)
- **Valor**: `fycy6gsy.up.railway.app`
- **TTL**: `1 hora`

Luego en Railway, también configura el dominio como `www.einsteinthetrencher.com`

---

## Solución 4: Contactar soporte de tu proveedor DNS

Si necesitas que `einsteinthetrencher.com` (sin www) funcione con CNAME:
1. Contacta a tu proveedor DNS (Namecheap, Cloudflare, etc.)
2. Pregunta si soportan CNAME en la raíz o si tienen una alternativa tipo ALIAS

---

## Pasos según tu proveedor DNS:

### Cloudflare:
- Usa tipo **CNAME** con nombre `@` (soporta CNAME en la raíz)
- O usa **Proxy** para que Cloudflare maneje el CNAME

### Namecheap:
- **NO** permite CNAME en la raíz
- Usa **ALIAS Record** si está disponible
- O usa registro **A** con la IP

### GoDaddy:
- Usa tipo **A** con la IP
- O crea un **Forward** para el dominio

### Google Domains / Squarespace:
- Usa tipo **A** con la IP
- O **Synthetic Records** si está disponible

---

## Verificar que funciona:

Después de configurar, espera 5-10 minutos y verifica:

```bash
# Verifica el dominio
nslookup einsteinthetrencher.com

# O visita
https://www.whatsmydns.net/#CNAME/einsteinthetrencher.com
```

---

## ¿Puedo tener 2 CNAMEs?

**Sí, pero con limitaciones:**

### ✅ Lo que SÍ puedes hacer:
- **CNAME para `www`** → `fycy6gsy.up.railway.app`
- **CNAME para `api`** → `fycy6gsy.up.railway.app` (si quieres api.einsteinthetrencher.com)
- **CNAME para cualquier subdominio** → `fycy6gsy.up.railway.app`

### ❌ Lo que NO puedes hacer:
- **NO puedes tener CNAME y registro A para el mismo nombre**
- **NO puedes tener 2 CNAMEs diferentes para el mismo nombre** (ej: `www` apuntando a dos lugares distintos)

---

## Recomendación: Configuración Óptima

### Opción 1: Solo www (Más simple) ⭐ RECOMENDADO

**Solo 1 CNAME:**
- **Tipo**: `CNAME`
- **Nombre**: `www`
- **Valor**: `fycy6gsy.up.railway.app`

**En Railway:**
- Añade `www.einsteinthetrencher.com` como dominio personalizado
- Railway puede configurar redirect automático de `einsteinthetrencher.com` → `www.einsteinthetrencher.com`

**Resultado:**
- ✅ `www.einsteinthetrencher.com` funciona directamente
- ✅ `einsteinthetrencher.com` redirige a www (si Railway lo configura)

---

### Opción 2: www + raíz (Si tu proveedor lo permite)

**2 registros diferentes:**

1. **Para www:**
   - **Tipo**: `CNAME`
   - **Nombre**: `www`
   - **Valor**: `fycy6gsy.up.railway.app`

2. **Para la raíz (@):**
   - **Tipo**: `A` o `ALIAS` (NO CNAME si tu proveedor no lo permite)
   - **Nombre**: `@`
   - **Valor**: IP de Railway o `fycy6gsy.up.railway.app` (si es ALIAS)

**En Railway:**
- Añade ambos: `einsteinthetrencher.com` y `www.einsteinthetrencher.com`

---

## Mi Recomendación Final:

**Usa SOLO 1 CNAME para `www`** porque:
- ✅ Es más simple y funciona en todos los proveedores DNS
- ✅ Railway puede manejar el redirect automáticamente
- ✅ Evitas problemas de compatibilidad con CNAME en la raíz
- ✅ Es la práctica más común y estable

Si necesitas que funcione sin www, Railway puede configurar un redirect automático, o puedes usar un servicio de redirect externo.

---

¿Cuál es tu proveedor de DNS? (Namecheap, Cloudflare, GoDaddy, etc.) Te puedo dar instrucciones específicas.
