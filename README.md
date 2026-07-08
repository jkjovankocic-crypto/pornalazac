# 🎯 Pronalazač Klijenata

Besplatna web aplikacija za pronalaženje firmi **bez veb sajta** — potencijalnih klijenata kojima možete ponuditi izradu sajta.

## 🌐 Live verzija

👉 **[Otvori aplikaciju](https://ihatespeed.github.io/pronalazac)**

---

## ✨ Funkcionalnosti

- 🌍 **OpenStreetMap** — besplatno, bez API ključa
- 17 predefinisanih kategorija firmi (frizer, restoran, zubar...)
- Filteri: bez sajta, sa telefonom, sa adresom
- Prikaz na interaktivnoj mapi (Leaflet)
- Export u CSV
- Metrike: ukupno / sa telefonom / sa adresom / bez sajta / sa emailom

### Lokalna verzija (sa `npm start`) dodatno nudi:
- 🔎 **SerpAPI** — Google Maps pretraga
- 🛰️ **Outscraper** — Google Maps pretraga
- 📸 **Instagram pretraga** po firmi

---

## 🚀 Pokretanje lokalno (sa svim funkcijama)

### Preduslovi
- [Node.js](https://nodejs.org/) v16+
- SerpAPI ili Outscraper nalog (opciono)

### Instalacija

```bash
git clone https://github.com/Ihatespeed/pronalazac.git
cd pronalazac
npm install
```

### Konfiguracija API ključeva

Kreiraj `.env` fajl u root folderu:

```env
SERPAPI_KEY=tvoj_serpapi_kljuc
OUTSCRAPER_KEY=tvoj_outscraper_kljuc
PORT=3000
```

### Pokretanje

```bash
npm start
```

Otvori [http://localhost:3000](http://localhost:3000)

---

## 📁 Struktura projekta

```
pronalazac/
├── index.html       # Frontend (radi i kao GitHub Pages)
├── server.js        # Lokalni proxy (SerpAPI, Outscraper, Instagram)
├── package.json
├── .env             # API ključevi (ne commitovati!)
└── .gitignore
```

---

## 🛠️ Tehnologije

- Vanilla HTML/CSS/JavaScript
- [OpenStreetMap](https://www.openstreetmap.org/) + [Overpass API](https://overpass-api.de/)
- [Leaflet.js](https://leafletjs.com/) — interaktivna mapa
- [Express.js](https://expressjs.com/) — lokalni proxy server
- [SerpAPI](https://serpapi.com/) (opciono)
- [Outscraper](https://outscraper.com/) (opciono)

---

Napravljeno sa ❤️
