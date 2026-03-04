# PartFind — MVP Prototype

AI-powered auto parts search engine. Frontend-only prototype with mock data.

## How to run

### Option 1 — Simplest (Python, no install)
```bash
cd partfind
python3 -m http.server 8080
```
Open: http://localhost:8080

### Option 2 — Node (if Python not available)
```bash
cd partfind
npx serve .
```
Open the URL shown in terminal.

### Option 3 — Direct browser
> ⚠️ Won't work if you just double-click `index.html` — browser blocks local JS modules.
> Use one of the server options above.

---

## What's inside

```
partfind/
├── index.html   — Shell, fonts, all CSS
├── app.jsx      — All React components, mock data, logic
└── README.md
```

No build step. No npm install. No backend.

---

## Screens

### Buyer flow
| Screen | How to reach |
|--------|-------------|
| Search home | Default view (Search tab) |
| Results | Type a query and press Enter, or tap a preset chip |
| Product detail | Tap any result row → bottom sheet slides up |

**Try these queries:**
- `Radiator Peugeot 308 2016`
- `Alternator Lada Granta`
- `Brake pads Toyota Camry`
- `радиатор пежо` (Russian works too)
- `xyz` → shows zero-results state

### Seller flow
| Screen | How to reach |
|--------|-------------|
| Dashboard | "My Shop" tab |
| Add product | "Add product" button |
| Edit product | Tap any row in the table |
| Upload file | "Upload file" button |
| AI review | Upload a file → "Analyze with AI" |

**CSV upload:**
- Click "Download sample CSV" to get a test file
- Upload it, click "Analyze with AI"
- Review the mapping + row status
- Publish or save as draft

---

## Mock data notes
- 14 products across 5 mock sellers
- Intentionally includes: missing prices, null years, mixed Russian/English names
- Query parser handles: brand aliases, Russian terms, year extraction, engine type
- CSV parser uses PapaParse (loaded from CDN)
- XLS upload uses hardcoded mock rows (no real XLS parsing in browser without a build step)
