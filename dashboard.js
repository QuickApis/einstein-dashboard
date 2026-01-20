import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const SOLANATRACKER_API_KEY = process.env.SOLANATRACKER_API_KEY || 'c25af2e8-3f91-4eb3-9f19-5d2801a9de6b';
const SOLANATRACKER_PNL_URL = 'https://data.solanatracker.io/pnl';
const BOT_PUBLIC_KEY = process.env.BOT_PUBLIC_KEY || '3DDpUew2p66iXDkShAE5T6QLK7sqqK67rUsYiMsUtBCi';

app.use(express.json());

// API endpoint para obtener la wallet del bot
app.get('/api/bot-wallet', (_req, res) => {
  if (BOT_PUBLIC_KEY.startsWith('PUT_') || !BOT_PUBLIC_KEY) {
    return res.status(500).json({ error: 'Bot Public Key not configured on server' });
  }
  res.json({ publicKey: BOT_PUBLIC_KEY });
});

// API endpoint para obtener PnL de una wallet (proxy a SolanaTracker)
app.get('/api/pnl/:wallet', async (req, res) => {
  const { wallet } = req.params;
  if (!wallet) {
    return res.status(400).json({ error: 'Wallet required' });
  }

  if (!SOLANATRACKER_API_KEY || SOLANATRACKER_API_KEY.startsWith('PUT_')) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const query = new URLSearchParams();
  if (req.query.showHistoricPnL !== undefined) query.set('showHistoricPnL', req.query.showHistoricPnL);
  if (req.query.holdingCheck !== undefined) query.set('holdingCheck', req.query.holdingCheck);
  if (req.query.hideDetails !== undefined) query.set('hideDetails', req.query.hideDetails);

  const url = `${SOLANATRACKER_PNL_URL}/${wallet}?${query.toString()}`;

  try {
    const response = await fetch(url, {
      headers: { 'x-api-key': SOLANATRACKER_API_KEY }
    });
    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).send(errorText);
    }
    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('Error fetching PnL:', error);
    return res.status(500).json({ error: 'Error fetching SolanaTracker data' });
  }
});

// Servir la página principal - redirige a Einstein
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'einstein.html'));
});

// Servir archivos estáticos (CSS, JS, imágenes) pero NO index.html
app.use(express.static(path.join(__dirname, 'public'), {
  index: false // Evita que Express sirva index.html por defecto
}));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Einstein Dashboard running on http://localhost:${PORT}`);
});
