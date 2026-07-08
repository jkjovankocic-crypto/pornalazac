require('dotenv').config();
const express  = require('express');
const fetch    = require('node-fetch');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));  // servira index.html

// CORS za lokalni razvoj
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// ─────────────────────────────────────────────
// 1. NOMINATIM — geokodiranje (proxy da nema CORS problema)
// ─────────────────────────────────────────────
app.get('/api/nominatim', async (req, res) => {
  try {
    const url  = `https://nominatim.openstreetmap.org/search?${new URLSearchParams(req.query)}`;
    const resp = await fetch(url, { headers: { 'User-Agent': 'PronalazacKlijenata/3.0' } });
    const data = await resp.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────
// 2. OVERPASS — OSM pretraga
// ─────────────────────────────────────────────
const OVERPASS_SERVERS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
];

app.post('/api/overpass', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Nedostaje query.' });

  for (const url of OVERPASS_SERVERS) {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        body:   `data=${encodeURIComponent(query)}`,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'PronalazacKlijenata/3.0' },
      });
      if (resp.ok) { return res.json(await resp.json()); }
    } catch (_) { /* sledeći server */ }
  }
  res.status(502).json({ error: 'Svi Overpass serveri su nedostupni.' });
});

// ─────────────────────────────────────────────
// 3. SERPAPI — Google Maps pretraga
// ─────────────────────────────────────────────
app.post('/api/serpapi/maps', async (req, res) => {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return res.status(400).json({ error: 'SERPAPI_KEY nije postavljen u .env fajlu.' });

  const { q, start = 0 } = req.body;
  if (!q) return res.status(400).json({ error: 'Nedostaje parametar q.' });

  try {
    const params = new URLSearchParams({
      engine: 'google_maps', type: 'search',
      q, start: String(start), api_key: apiKey,
    });
    const resp = await fetch(`https://serpapi.com/search?${params}`, {
      headers: { 'User-Agent': 'PronalazacKlijenata/3.0' },
    });
    const data = await resp.json();
    if (data.error) return res.status(400).json({ error: data.error });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────
// 4. SERPAPI — Instagram pretraga za jednu firmu
// ─────────────────────────────────────────────
app.post('/api/serpapi/instagram', async (req, res) => {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return res.status(400).json({ error: 'SERPAPI_KEY nije postavljen u .env fajlu.' });

  const { firmName, location } = req.body;
  if (!firmName) return res.status(400).json({ error: 'Nedostaje firmName.' });

  try {
    const q = `"${firmName}" ${location || ''} site:instagram.com`;
    const params = new URLSearchParams({ engine: 'google', q, num: '3', api_key: apiKey });
    const resp = await fetch(`https://serpapi.com/search?${params}`, {
      headers: { 'User-Agent': 'PronalazacKlijenata/3.0' },
    });
    const data = await resp.json();
    const organic = data.organic_results || [];
    let igLink = '';
    for (const r of organic) {
      const link = r.link || '';
      if (!link.includes('instagram.com/')) continue;
      const path = link.replace('https://www.instagram.com/', '').replace('https://instagram.com/', '');
      if (path && !['explore/', 'p/', 'reel/', 'tags/', 'locations/'].some(x => path.startsWith(x))) {
        igLink = link; break;
      }
    }
    res.json({ instagram: igLink });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────
// 5. OUTSCRAPER — Google Maps pretraga
// ─────────────────────────────────────────────
app.post('/api/outscraper', async (req, res) => {
  const apiKey = process.env.OUTSCRAPER_KEY;
  if (!apiKey) return res.status(400).json({ error: 'OUTSCRAPER_KEY nije postavljen u .env fajlu.' });

  const { query, limit = 100 } = req.body;
  if (!query) return res.status(400).json({ error: 'Nedostaje query.' });

  try {
    const params = new URLSearchParams({
      query, limit: String(limit), async: 'false', language: 'sr',
    });
    const resp = await fetch(`https://api.outscraper.cloud/maps/search?${params}`, {
      headers: { 'User-Agent': 'PronalazacKlijenata/3.0', 'X-API-KEY': apiKey },
    });
    const data = await resp.json();
    if (data.status === 'Error') return res.status(400).json({ error: data.errorMessage });
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─────────────────────────────────────────────
// START
// ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎯 Pronalazač Klijenata pokrenut!`);
  console.log(`   Otvori browser: http://localhost:${PORT}\n`);
});
