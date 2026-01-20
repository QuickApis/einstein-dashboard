# Einstein The Trenchor - Dashboard

Web dashboard para trackear el progreso del bot de trading Einstein.

## Instalación

```bash
npm install
```

## Configuración

### Variables de entorno

Configura las siguientes variables de entorno (opcional, ya tienen valores por defecto):

- `SOLANATRACKER_API_KEY`: API key de SolanaTracker (por defecto: ya configurada)
- `BOT_PUBLIC_KEY`: Dirección pública de la wallet del bot (por defecto: ya configurada)
- `PORT`: Puerto del servidor (por defecto: 3000)

**Para desarrollo local:**
Crea un archivo `.env` en esta carpeta con:
```
SOLANATRACKER_API_KEY=tu_api_key
BOT_PUBLIC_KEY=tu_wallet_publica
PORT=3000
```

**Para servicios de hosting (Railway, Render, etc.):**
Configura estas variables en el dashboard del servicio, no en un archivo `.env`.

## Ejecutar localmente

```bash
npm start
```

La web estará disponible en: http://localhost:3000

## Desplegar

### Railway (Recomendado)

```bash
railway login
railway init
railway up
```

Luego configura las variables de entorno en el dashboard de Railway.

### Render

1. Conecta tu repositorio
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Configura las variables de entorno en el dashboard de Render

### Vercel

```bash
vercel deploy
```

## Estructura

- `dashboard.js` - Servidor Express
- `public/` - Archivos estáticos (HTML, CSS, JS, imágenes)
- `package.json` - Dependencias del proyecto

## Contenido

Esta carpeta contiene SOLO los archivos necesarios para desplegar la web:
- ✅ Dashboard web (Einstein)
- ✅ API endpoints (PnL, bot wallet)
- ✅ Archivos estáticos (HTML, CSS, JS, imágenes)

**NO incluye:**
- ❌ Archivos de feature engineering
- ❌ Scripts de trading (trader.js, einstein_bot.js)
- ❌ Datos históricos (data/, data_enriched/)
- ❌ Configuraciones locales
