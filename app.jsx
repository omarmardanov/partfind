// ─────────────────────────────────────────────
//  PartFind — MVP Prototype
//  All mock data, state, and screens in one file
// ─────────────────────────────────────────────

const { useState, useEffect, useRef, useCallback } = React;

// ═══════════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════════
const MOCK_PRODUCTS = [
  { id: 1, name: "Radiator (Original)", partType: "Radiator", brand: "Peugeot", model: "308", yearFrom: 2014, yearTo: 2018, engine: "1.6 petrol", condition: "New", price: 185, currency: "₾", availability: "in_stock", sellerId: 1, notes: "" },
  { id: 2, name: "Radiator cooling — used", partType: "Radiator", brand: "Peugeot", model: "308", yearFrom: 2013, yearTo: 2017, engine: null, condition: "Used", price: 90, currency: "₾", availability: "in_stock", sellerId: 2, notes: "Good condition, minor scratch" },
  { id: 3, name: "Radiator aftermarket", partType: "Radiator", brand: "Peugeot", model: "308", yearFrom: 2015, yearTo: 2020, engine: "1.6 petrol", condition: "New", price: 140, currency: "₾", availability: "on_order", sellerId: 3, notes: "" },
  { id: 4, name: "Радиатор охлаждения", partType: "Radiator", brand: "Peugeot", model: "308", yearFrom: null, yearTo: null, engine: "1.6", condition: "New", price: null, currency: "₾", availability: "in_stock", sellerId: 4, notes: "" },
  { id: 5, name: "Radiator + fan assembly", partType: "Radiator", brand: "Peugeot", model: "308", yearFrom: 2016, yearTo: 2019, engine: "1.6 petrol", condition: "New", price: 210, currency: "₾", availability: "in_stock", sellerId: 1, notes: "Includes fan motor" },
  { id: 6, name: "Alternator", partType: "Alternator", brand: "Lada", model: "Granta", yearFrom: 2018, yearTo: 2023, engine: "1.6", condition: "Used", price: 120, currency: "₾", availability: "in_stock", sellerId: 2, notes: "" },
  { id: 7, name: "Alternator (remanufactured)", partType: "Alternator", brand: "Lada", model: "Granta", yearFrom: 2015, yearTo: 2022, engine: null, condition: "Refurbished", price: 95, currency: "₾", availability: "in_stock", sellerId: 3, notes: "" },
  { id: 8, name: "Генератор LADA", partType: "Alternator", brand: "Lada", model: "Granta", yearFrom: null, yearTo: null, engine: null, condition: "Used", price: 80, currency: "₾", availability: "on_order", sellerId: 4, notes: "" },
  { id: 9, name: "Brake pads front", partType: "Brake pads", brand: "Toyota", model: "Camry", yearFrom: 2017, yearTo: 2022, engine: null, condition: "New", price: 55, currency: "₾", availability: "in_stock", sellerId: 1, notes: "" },
  { id: 10, name: "Brake pads — ceramic", partType: "Brake pads", brand: "Toyota", model: "Camry", yearFrom: 2018, yearTo: 2023, engine: "2.5 petrol", condition: "New", price: 78, currency: "₾", availability: "in_stock", sellerId: 5, notes: "OEM spec" },
  { id: 11, name: "Тормозные колодки пер.", partType: "Brake pads", brand: "Toyota", model: "Camry", yearFrom: 2016, yearTo: 2021, engine: null, condition: "New", price: 48, currency: "₾", availability: "on_order", sellerId: 2, notes: "" },
  { id: 12, name: "Oil filter", partType: "Oil filter", brand: "Toyota", model: "Camry", yearFrom: 2015, yearTo: 2023, engine: null, condition: "New", price: 18, currency: "₾", availability: "in_stock", sellerId: 3, notes: "" },
  { id: 13, name: "Shock absorber front L", partType: "Shock absorber", brand: "Hyundai", model: "Accent", yearFrom: 2014, yearTo: 2019, engine: null, condition: "New", price: 68, currency: "₾", availability: "in_stock", sellerId: 4, notes: "" },
  { id: 14, name: "Timing belt kit", partType: "Timing belt", brand: "Peugeot", model: "308", yearFrom: 2014, yearTo: 2018, engine: "1.6 petrol", condition: "New", price: 95, currency: "₾", availability: "in_stock", sellerId: 1, notes: "Complete kit with tensioner" },
];

const MOCK_SELLERS = [
  { id: 1, name: "AutoParts Vera",  city: "Tbilisi",  phone: "+995 555 123 456", whatsapp: "+995555123456", email: "vera@autoparts.ge" },
  { id: 2, name: "Sparex Motors",   city: "Tbilisi",  phone: "+995 555 234 567", whatsapp: "+995555234567", email: "sparex@motors.ge" },
  { id: 3, name: "GarageMax",       city: "Rustavi",  phone: "+995 555 345 678", whatsapp: null, email: "info@garagemax.ge" },
  { id: 4, name: "AvtoDepo",        city: "Tbilisi",  phone: "+995 555 456 789", whatsapp: "+995555456789", email: null },
  { id: 5, name: "TbilisiParts",    city: "Tbilisi",  phone: "+995 555 567 890", whatsapp: "+995555567890", email: "hello@tbilisiparts.ge" },
];

// Seller's own inventory (for admin panel)
const MY_SELLER_ID = 1;

const PART_TYPES = ["Radiator", "Alternator", "Brake pads", "Oil filter", "Shock absorber", "Timing belt", "Water pump", "Fuel pump", "Starter motor", "AC compressor", "Other"];
const CONDITIONS = ["New", "Used", "Refurbished"];
const AVAILABILITIES = [{ val: "in_stock", label: "In stock" }, { val: "on_order", label: "On order" }];
const CURRENCIES = ["₾", "USD", "EUR"];

// ═══════════════════════════════════════════
//  QUERY PARSER (mocked NLP)
// ═══════════════════════════════════════════
const BRAND_ALIASES = {
  "peugeot": "Peugeot", "pejo": "Peugeot", "пежо": "Peugeot",
  "lada": "Lada", "лада": "Lada", "vaz": "Lada",
  "toyota": "Toyota", "тойота": "Toyota",
  "hyundai": "Hyundai", "хюндай": "Hyundai",
  "bmw": "BMW", "бмв": "BMW",
  "mercedes": "Mercedes", "mersedes": "Mercedes", "мерседес": "Mercedes",
  "ford": "Ford", "форд": "Ford",
  "opel": "Opel", "опель": "Opel",
  "volkswagen": "Volkswagen", "vw": "Volkswagen",
  "kia": "KIA", "киа": "KIA",
  "honda": "Honda", "хонда": "Honda",
  "nissan": "Nissan", "ниссан": "Nissan",
};

const MODEL_ALIASES = {
  "308": "308", "207": "207", "206": "206", "301": "301",
  "granta": "Granta", "priora": "Priora", "калина": "Kalina", "kalina": "Kalina",
  "camry": "Camry", "corolla": "Corolla", "yaris": "Yaris",
  "accent": "Accent", "tucson": "Tucson", "elantra": "Elantra",
  "golf": "Golf", "passat": "Passat", "polo": "Polo",
  "focus": "Focus", "fiesta": "Fiesta",
};

const PART_ALIASES = {
  "radiator": "Radiator", "радиатор": "Radiator", "радиатори": "Radiator",
  "alternator": "Alternator", "generator": "Alternator", "генератор": "Alternator",
  "brake": "Brake pads", "brakes": "Brake pads", "brake pads": "Brake pads", "тормоз": "Brake pads", "колодки": "Brake pads",
  "oil filter": "Oil filter", "масляный фильтр": "Oil filter", "filter": "Oil filter",
  "shock": "Shock absorber", "shock absorber": "Shock absorber", "амортизатор": "Shock absorber",
  "timing belt": "Timing belt", "ремень": "Timing belt", "timing": "Timing belt",
  "water pump": "Water pump", "помпа": "Water pump",
  "starter": "Starter motor", "стартер": "Starter motor",
  "compressor": "AC compressor", "кондиционер": "AC compressor",
};

function parseQuery(raw) {
  const q = raw.toLowerCase().trim();
  const tokens = q.split(/[\s,\-\/]+/);
  const params = { brand: null, model: null, year: null, engine: null, partType: null };

  // Part type — try multi-word first
  for (const alias of Object.keys(PART_ALIASES).sort((a,b) => b.length - a.length)) {
    if (q.includes(alias)) { params.partType = PART_ALIASES[alias]; break; }
  }

  // Brand
  for (const t of tokens) {
    if (BRAND_ALIASES[t]) { params.brand = BRAND_ALIASES[t]; break; }
  }

  // Model
  for (const t of tokens) {
    if (MODEL_ALIASES[t]) { params.model = MODEL_ALIASES[t]; break; }
  }

  // Year — 4-digit number in range
  const yearMatch = q.match(/\b(19[5-9]\d|20[0-2]\d)\b/);
  if (yearMatch) params.year = parseInt(yearMatch[1]);

  // Engine
  const engineMatch = q.match(/\b(\d+\.\d+)\b/);
  if (engineMatch) params.engine = engineMatch[1];

  return params;
}

function matchProducts(products, params) {
  if (!params.brand && !params.model && !params.partType) return [];
  return products.filter(p => {
    let score = 0;
    if (params.partType && p.partType === params.partType) score += 3;
    if (params.brand && p.brand === params.brand) score += 2;
    if (params.model && p.model === params.model) score += 2;
    if (params.year && p.yearFrom && p.yearTo) {
      if (params.year >= p.yearFrom && params.year <= p.yearTo) score += 1;
    }
    if (params.engine && p.engine && p.engine.includes(params.engine)) score += 1;
    return score >= 2;
  }).sort((a, b) => {
    // in_stock first, then by price asc
    if (a.availability === b.availability) return (a.price || 9999) - (b.price || 9999);
    return a.availability === "in_stock" ? -1 : 1;
  });
}

// ═══════════════════════════════════════════
//  CSV MOCK PARSER
// ═══════════════════════════════════════════
const COLUMN_INFERENCE = {
  "наименование товара": "partName",
  "наименование": "partName",
  "название": "partName",
  "part name": "partName",
  "part": "partName",
  "name": "partName",
  "марка": "brand",
  "brand": "brand",
  "бренд": "brand",
  "модель": "model",
  "model": "model",
  "год": "year",
  "year": "year",
  "год выпуска": "year",
  "цена": "price",
  "цена gel": "price",
  "price": "price",
  "стоимость": "price",
  "engine": "engine",
  "двигатель": "engine",
  "объем": "engine",
  "состояние": "condition",
  "condition": "condition",
  "наличие": "availability",
  "availability": "availability",
  "остаток": "availability",
  "в наличии": "availability",
  "марка/модель/год": null, // ambiguous
  "примечания": "notes",
  "notes": "notes",
  "комментарий": "notes",
};

const CANONICAL_LABELS = {
  partName: "Part name",
  brand: "Brand",
  model: "Model",
  year: "Year",
  engine: "Engine",
  price: "Price",
  condition: "Condition",
  availability: "Availability",
  notes: "Notes",
};

function inferColumns(headers) {
  return headers.map(h => {
    const low = h.toLowerCase().trim();
    const inferred = COLUMN_INFERENCE[low];
    return {
      original: h,
      inferred: inferred !== undefined ? inferred : "ignore",
      confidence: inferred !== undefined ? (inferred === null ? "warn" : "ok") : "warn",
    };
  });
}

function normalizeRows(rows, mappings) {
  return rows.slice(0, 20).map((row, i) => { // limit preview to 20
    const obj = {};
    mappings.forEach(m => {
      if (m.inferred && m.inferred !== "ignore") {
        obj[m.inferred] = row[m.original] || null;
      }
    });

    // Derive status
    let status = "ok", issue = "All fields mapped";
    const criticalMissing = !obj.partName;
    const hasWarn = !obj.brand && !obj.model;
    const isEmpty = Object.values(obj).every(v => !v);

    if (isEmpty) { status = "err"; issue = "Empty row"; }
    else if (criticalMissing) { status = "err"; issue = "Part name missing"; }
    else if (hasWarn) { status = "warn"; issue = "Brand/model unclear"; }
    else if (!obj.price) { status = "warn"; issue = "Price not found"; }

    return { ...obj, _id: i, _status: status, _issue: issue };
  });
}

// ═══════════════════════════════════════════
//  ICONS (inline SVG)
// ═══════════════════════════════════════════
const Icon = ({ name, size = 16, color = "currentColor", strokeWidth = 1.8 }) => {
  const paths = {
    arrowRight: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    arrowLeft:  <><polyline points="15 18 9 12 15 6"/></>,
    phone:      <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z"/></>,
    whatsapp:   <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>,
    mail:       <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    upload:     <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
    plus:       <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    edit:       <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash:      <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    x:          <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    check:      <><polyline points="20 6 9 17 4 12"/></>,
    settings:   <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  };
  return (
    <svg width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
      {paths[name]}
    </svg>
  );
};

// ═══════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, []);
  return <div className="toast">{message}</div>;
}

// ═══════════════════════════════════════════
//  BUYER SCREENS
// ═══════════════════════════════════════════
function BuyerHome({ onSearch, onSellerMode }) {
  const [q, setQ] = useState("");
  const inputRef = useRef();

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = () => { if (q.trim()) onSearch(q.trim()); };
  const handleKey = e => { if (e.key === "Enter") submit(); };

  const presets = [
    "Radiator Peugeot 308 2016 1.6",
    "Alternator Lada Granta 2019",
    "Brake pads Toyota Camry 2020",
  ];

  return (
    <div className="home-wrap">
      <div className="home-label">Tbilisi · GE</div>
      <div className="home-headline">Find<br /><em>any</em><br />part.</div>

      <div className="search-box">
        <input
          ref={inputRef}
          className="search-input"
          placeholder="Radiator Peugeot 308 2016 1.6 petrol…"
          value={q}
          onChange={e => setQ(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className="search-go" onClick={submit} aria-label="Search">
          <Icon name="arrowRight" size={14} color="white" strokeWidth={2.5} />
        </button>
      </div>
      <div className="search-hint">Type naturally — brand, model, year, part name, engine type</div>

      <div className="recent-section">
        <div className="section-label">Try these</div>
        <div className="chip-row">
          {presets.map(p => (
            <button key={p} className="chip" onClick={() => onSearch(p)}>
              {p.length > 28 ? p.slice(0, 26) + "…" : p}
            </button>
          ))}
        </div>
      </div>

      <div className="home-footer">
        <button className="text-link" onClick={onSellerMode}>List your inventory →</button>
        <div className="online-badge">
          <div className="dot-live" />
          <span>47 sellers online</span>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ product, seller, onTap }) {
  const s = seller || {};
  return (
    <div className="result-item" onClick={() => onTap(product)}>
      <div className="result-left">
        <div className="result-name">{product.name}</div>
        <div className="result-sub">{s.name} · {s.city}</div>
      </div>
      <div className="result-right">
        {product.price
          ? <div className="result-price">{product.currency} {product.price}</div>
          : <div className="result-price no-price">Call for price</div>
        }
        <div className="avail">
          <div className={`avail-dot ${product.availability === "in_stock" ? "green" : "grey"}`} />
          {product.availability === "in_stock" ? "In stock" : "On order"}
        </div>
      </div>
    </div>
  );
}

function ParamChip({ label, value, onRemove }) {
  return (
    <button className="param-chip" onClick={onRemove}>
      {label && <span style={{color:"var(--g400, #9a9a92)", marginRight:3}}>{label}</span>}
      {value}
      <span className="chip-x">×</span>
    </button>
  );
}

function ResultsPage({ query, products, sellers, onBack, onProduct }) {
  const [params, setParams] = useState(() => parseQuery(query));
  const [results, setResults] = useState([]);

  useEffect(() => {
    setResults(matchProducts(products, params));
  }, [params]);

  const removeParam = key => setParams(p => ({ ...p, [key]: null }));

  const activeParams = Object.entries(params).filter(([, v]) => v !== null);
  const sellerMap = Object.fromEntries(sellers.map(s => [s.id, s]));

  const paramLabels = { brand: "Brand", model: "Model", year: "Year", engine: "Engine", partType: "Part" };

  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"calc(100dvh - 56px)"}}>
      <div className="results-header">
        <button className="back-btn" onClick={onBack}>
          <Icon name="arrowLeft" size={14} strokeWidth={2} />
          Back
        </button>
        <div className="results-title">
          {params.partType || "Parts"}{params.brand ? ` · ${params.brand}` : ""}{params.model ? ` ${params.model}` : ""}
        </div>
        <div className="param-chips">
          {activeParams.map(([k, v]) => (
            <ParamChip key={k} label={paramLabels[k]} value={String(v)} onRemove={() => removeParam(k)} />
          ))}
        </div>
      </div>

      <div className="results-meta">
        {results.length === 0
          ? "No listings found"
          : `${results.length} listing${results.length !== 1 ? "s" : ""} found`
        }
      </div>

      {results.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No results</h3>
          <p>Try removing a filter above,<br />or rephrase your search.</p>
        </div>
      ) : (
        results.map(p => (
          <ResultCard key={p.id} product={p} seller={sellerMap[p.sellerId]} onTap={onProduct} />
        ))
      )}
    </div>
  );
}

function ProductSheet({ product, seller, onClose }) {
  const [open, setOpen] = useState(false);
  useEffect(() => { setTimeout(() => setOpen(true), 10); }, []);
  const close = () => { setOpen(false); setTimeout(onClose, 360); };

  const fields = [
    product.price !== null && { label: "Price", value: `${product.currency} ${product.price}`, cls: "big" },
    { label: "Condition",    value: product.condition || "—" },
    { label: "Brand",        value: product.brand     || "—" },
    { label: "Model",        value: product.model     || "—" },
    (product.yearFrom || product.yearTo) && { label: "Year", value: product.yearFrom && product.yearTo ? `${product.yearFrom} – ${product.yearTo}` : product.yearFrom || product.yearTo },
    product.engine && { label: "Engine",  value: product.engine },
    { label: "Availability", value: product.availability === "in_stock" ? "In stock" : "On order", cls: product.availability === "in_stock" ? "green" : "" },
    product.notes && { label: "Notes", value: product.notes },
  ].filter(Boolean);

  return (
    <>
      <div className={`sheet-overlay ${open ? "open" : ""}`} onClick={close} />
      <div className={`sheet ${open ? "open" : ""}`}>
        <div className="sheet-handle" onClick={close} />
        <div className="sheet-body">
          <div className="sheet-cat">{product.partType}</div>
          <div className="sheet-title">{product.name}</div>

          <div className="field-table">
            {fields.map(f => (
              <div key={f.label} className="field-row">
                <span className="field-lbl">{f.label}</span>
                <span className={`field-val ${f.cls || ""}`}>{f.value}</span>
              </div>
            ))}
          </div>

          {seller && (
            <div className="seller-box">
              <div className="seller-box-name">
                <div className="dot-live" />
                {seller.name}
              </div>
              <div className="seller-box-meta">{seller.city} · Updated 2 days ago</div>
            </div>
          )}

          {seller?.whatsapp && (
            <a href={`https://wa.me/${seller.whatsapp.replace(/\D/g,"")}`} style={{textDecoration:"none"}}>
              <button className="cta-btn">
                <Icon name="whatsapp" size={18} color="white" />
                WhatsApp Seller
              </button>
            </a>
          )}
          {seller?.phone && (
            <a href={`tel:${seller.phone}`} style={{textDecoration:"none"}}>
              <button className="cta-btn secondary">
                <Icon name="phone" size={16} strokeWidth={2} />
                {seller.phone}
              </button>
            </a>
          )}
          {seller?.email && !seller?.whatsapp && (
            <a href={`mailto:${seller.email}`} style={{textDecoration:"none"}}>
              <button className="cta-btn secondary">
                <Icon name="mail" size={16} strokeWidth={2} />
                {seller.email}
              </button>
            </a>
          )}
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════
//  SELLER SCREENS
// ═══════════════════════════════════════════
function SellerDashboard({ products, sellers, onAdd, onEdit, onUpload }) {
  const myProducts = products.filter(p => p.sellerId === MY_SELLER_ID);
  const seller = sellers.find(s => s.id === MY_SELLER_ID);

  const live    = myProducts.filter(p => p._status !== "draft").length;
  const draft   = myProducts.filter(p => p._status === "draft").length;
  const total   = myProducts.length;

  const today = new Date().toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long" });

  return (
    <div className="dash-wrap">
      <div className="dash-toprow">
        <button className="icon-btn"><Icon name="settings" size={16} strokeWidth={1.6} /></button>
      </div>

      <div className="dash-hello">Hello</div>
      <div className="dash-seller-row">
        <div className="seller-name">
          <div className="dot-live" />
          {seller?.name}
        </div>
        <div className="last-update">
          <span style={{fontSize:10,textTransform:"uppercase",letterSpacing:".06em",color:"var(--g400, #9a9a92)"}}>Last Update</span>
          <strong>{today}</strong>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat"><div className="stat-num">{total}</div><div className="stat-lbl">Total</div></div>
        <div className="stat"><div className="stat-num">{live}</div><div className="stat-lbl">Live</div></div>
        <div className="stat"><div className="stat-num">{draft}</div><div className="stat-lbl">Draft</div></div>
      </div>

      <div className="action-row">
        <button className="act-btn primary" onClick={onAdd}>
          Add product
          <sub>Single item form</sub>
        </button>
        <button className="act-btn secondary" onClick={onUpload}>
          Upload file
          <sub>CSV, XLS, XLSX</sub>
        </button>
      </div>

      <div className="section-label" style={{marginBottom:14}}>Your listings</div>

      <div style={{border:"1px solid var(--g200)",borderRadius:"var(--r)",overflow:"hidden"}}>
        <div className="table-header">
          <div className="th">Part</div>
          <div className="th right">Price</div>
          <div className="th right">Status</div>
        </div>
        <div className="table-body">
          {myProducts.length === 0 && (
            <div className="empty-state"><p>No products yet.<br/>Add your first listing above.</p></div>
          )}
          {myProducts.map(p => (
            <div key={p.id} className="table-row" onClick={() => onEdit(p)}>
              <div>
                <div className="td-name">{p.name}</div>
                <div className="td-sub">{[p.brand, p.model, p.yearFrom].filter(Boolean).join(" · ") || "No details"}</div>
              </div>
              <div className={`td-price ${!p.price ? "na" : ""}`}>{p.price ? `${p.currency} ${p.price}` : "—"}</div>
              <div className="td-status">
                <span className={`badge ${p._status === "draft" ? "badge-draft" : "badge-live"}`}>
                  {p._status === "draft" ? "Draft" : "Live"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductForm({ product, onSave, onDelete, onBack }) {
  const isEdit = !!product?.id;
  const [form, setForm] = useState({
    name:         product?.name         || "",
    partType:     product?.partType     || "",
    brand:        product?.brand        || "",
    model:        product?.model        || "",
    yearFrom:     product?.yearFrom     || "",
    yearTo:       product?.yearTo       || "",
    engine:       product?.engine       || "",
    condition:    product?.condition    || "New",
    price:        product?.price        || "",
    currency:     product?.currency     || "₾",
    availability: product?.availability || "in_stock",
    notes:        product?.notes        || "",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    return e;
  };

  const handleSave = (asDraft = false) => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, price: form.price ? Number(form.price) : null, _status: asDraft ? "draft" : "live" });
  };

  return (
    <div className="form-screen">
      <div className="form-header">
        <button className="icon-btn" onClick={onBack}><Icon name="arrowLeft" size={16} strokeWidth={2} /></button>
        <div className="form-title">{isEdit ? "Edit product" : "Add product"}</div>
      </div>
      <div className="form-body">
        <div className="form-section-title">Product</div>
        <div className="field-group-form">
          <div className="field-wrap">
            <div className="field-label-form">Part name <span>*required</span></div>
            <input className="form-input" placeholder="e.g. Radiator cooling" value={form.name}
              onChange={e => set("name", e.target.value)} style={errors.name ? {borderColor:"var(--red)"} : {}} />
            {errors.name && <div style={{fontSize:12,color:"var(--red)"}}>{errors.name}</div>}
          </div>
          <div className="field-wrap">
            <div className="field-label-form">Part type</div>
            <select className="form-select" value={form.partType} onChange={e => set("partType", e.target.value)}>
              <option value="">— Select —</option>
              {PART_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="field-wrap">
            <div className="field-label-form">Condition</div>
            <select className="form-select" value={form.condition} onChange={e => set("condition", e.target.value)}>
              {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="form-section-title">Vehicle fit</div>
        <div className="field-group-form">
          <div className="form-row">
            <div className="field-wrap">
              <div className="field-label-form">Brand</div>
              <input className="form-input" placeholder="Peugeot" value={form.brand} onChange={e => set("brand", e.target.value)} />
            </div>
            <div className="field-wrap">
              <div className="field-label-form">Model</div>
              <input className="form-input" placeholder="308" value={form.model} onChange={e => set("model", e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="field-wrap">
              <div className="field-label-form">Year from</div>
              <input className="form-input" type="number" placeholder="2014" value={form.yearFrom} onChange={e => set("yearFrom", e.target.value)} />
            </div>
            <div className="field-wrap">
              <div className="field-label-form">Year to</div>
              <input className="form-input" type="number" placeholder="2018" value={form.yearTo} onChange={e => set("yearTo", e.target.value)} />
            </div>
          </div>
          <div className="field-wrap">
            <div className="field-label-form">Engine <span>optional</span></div>
            <input className="form-input" placeholder="1.6 petrol" value={form.engine} onChange={e => set("engine", e.target.value)} />
          </div>
        </div>

        <div className="form-section-title">Pricing & availability</div>
        <div className="field-group-form">
          <div className="form-row">
            <div className="field-wrap">
              <div className="field-label-form">Price <span>optional</span></div>
              <input className="form-input" type="number" placeholder="185" value={form.price} onChange={e => set("price", e.target.value)} />
            </div>
            <div className="field-wrap">
              <div className="field-label-form">Currency</div>
              <select className="form-select" value={form.currency} onChange={e => set("currency", e.target.value)}>
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="field-wrap">
            <div className="field-label-form">Availability</div>
            <select className="form-select" value={form.availability} onChange={e => set("availability", e.target.value)}>
              {AVAILABILITIES.map(a => <option key={a.val} value={a.val}>{a.label}</option>)}
            </select>
          </div>
        </div>

        <div className="form-section-title">Notes <span style={{textTransform:"none",fontWeight:300,fontSize:11,color:"var(--g400,#9a9a92)"}}>optional</span></div>
        <textarea className="form-input" rows={3} placeholder="Any additional details…" value={form.notes}
          onChange={e => set("notes", e.target.value)} style={{resize:"vertical"}} />

        <div className="form-footer">
          {isEdit && <button className="btn btn-danger" onClick={() => onDelete(product.id)}>Delete</button>}
          <button className="btn btn-secondary" onClick={() => handleSave(true)}>Save draft</button>
          <button className="btn btn-primary" onClick={() => handleSave(false)}>Publish</button>
        </div>
      </div>
    </div>
  );
}

// ─── UPLOAD ───
function UploadScreen({ onBack, onReview }) {
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [parsing, setParsing] = useState(false);

  const handleFile = f => {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["csv","xls","xlsx"].includes(ext)) { alert("Please upload a CSV, XLS, or XLSX file."); return; }
    setFile(f);
  };

  const handleDrop = e => {
    e.preventDefault(); setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const analyze = () => {
    setParsing(true);
    // Use PapaParse for CSV, mock for XLS
    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          setTimeout(() => { // artificial delay for UX
            const mappings = inferColumns(result.meta.fields || []);
            const rows = normalizeRows(result.data, mappings);
            setParsing(false);
            onReview({ mappings, rows, fileName: file.name, rowCount: result.data.length });
          }, 1200);
        }
      });
    } else {
      // Mock XLS data
      setTimeout(() => {
        const mockHeaders = ["Наименование товара", "Марка/Модель/год", "Цена GEL", "Остаток", "Примечания"];
        const mockRows = [
          {"Наименование товара":"Radiator Peugeot 308","Марка/Модель/год":"Peugeot 308 2016","Цена GEL":"185","Остаток":"есть","Примечания":""},
          {"Наименование товара":"Alternator Lada Granta","Марка/Модель/год":"Lada Granta 2019 1.6","Цена GEL":"120","Остаток":"есть","Примечания":"used"},
          {"Наименование товара":"Тормозные колодки","Марка/Модель/год":"","Цена GEL":"55","Остаток":"есть","Примечания":"mixed"},
          {"Наименование товара":"","Марка/Модель/год":"","Цена GEL":"","Остаток":"","Примечания":""},
          {"Наименование товара":"Oil filter Toyota Camry","Марка/Модель/год":"Toyota 2020","Цена GEL":"18","Остаток":"нет","Примечания":""},
          {"Наименование товара":"Shock absorber front","Марка/Модель/год":"Hyundai Accent 2017","Цена GEL":"","Остаток":"есть","Примечания":"new"},
        ];
        const mappings = inferColumns(mockHeaders);
        const rows = normalizeRows(mockRows, mappings);
        setParsing(false);
        onReview({ mappings, rows, fileName: file.name, rowCount: mockRows.length });
      }, 1400);
    }
  };

  return (
    <div className="upload-screen">
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
        <button className="icon-btn" onClick={onBack}><Icon name="arrowLeft" size={16} strokeWidth={2} /></button>
        <div style={{fontFamily:"var(--font-d)",fontSize:22}}>Upload inventory</div>
      </div>

      <div className={`upload-zone ${drag ? "drag" : ""}`}
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={handleDrop}
      >
        <input type="file" accept=".csv,.xls,.xlsx" className="upload-input"
          onChange={e => handleFile(e.target.files[0])} />
        <div className="upload-icon">📁</div>
        <div className="upload-main">Drop your file here</div>
        <div className="upload-sub">CSV, XLS or XLSX · Any column names<br />AI will figure out the structure</div>
      </div>

      {file && (
        <div className="file-info">
          <div className="file-icon">📄</div>
          <div>
            <div className="file-name">{file.name}</div>
            <div className="file-meta">{(file.size / 1024).toFixed(1)} KB · Ready to analyze</div>
          </div>
        </div>
      )}

      <button className="analyze-btn" disabled={!file || parsing} onClick={analyze}>
        {parsing ? <span className="loading-dots">Analyzing</span> : "Analyze with AI"}
      </button>

      <div style={{fontSize:12,color:"var(--g500)",lineHeight:1.6,textAlign:"center"}}>
        No reformatting needed. The system maps your columns automatically.<br />
        You review and approve before anything goes live.
      </div>

      {/* Demo CSV download */}
      <div style={{marginTop:24,textAlign:"center"}}>
        <button className="text-link" onClick={() => {
          const csv = `Part name,Brand,Model,Year,Price,Condition,Availability\nRadiator OEM,Peugeot,308,2016,185,New,in stock\nAlternator used,Lada,Granta,,120,Used,in stock\nBrake pads,,,,55,New,on order\nOil filter,Toyota,Camry,2020,18,New,in stock`;
          const blob = new Blob([csv], {type:"text/csv"});
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a"); a.href=url; a.download="sample_inventory.csv"; a.click();
        }}>Download sample CSV</button>
      </div>
    </div>
  );
}

function ReviewScreen({ data, onBack, onPublish }) {
  const [tab, setTab] = useState("all");
  const [mappings, setMappings] = useState(data.mappings);
  const [rows] = useState(data.rows);

  const okRows   = rows.filter(r => r._status === "ok");
  const warnRows = rows.filter(r => r._status === "warn");
  const errRows  = rows.filter(r => r._status === "err");

  const displayRows = tab === "all" ? rows : tab === "warn" ? warnRows : errRows;

  const updateMapping = (i, val) => {
    setMappings(m => m.map((item, idx) => idx === i ? { ...item, inferred: val, confidence: "ok" } : item));
  };

  const canonicalOptions = ["partName","brand","model","year","engine","price","condition","availability","notes","ignore"];

  return (
    <div style={{display:"flex",flexDirection:"column",minHeight:"calc(100dvh - 56px)"}}>
      <div className="review-header">
        <button className="back-btn" onClick={onBack}>
          <Icon name="arrowLeft" size={14} strokeWidth={2} /> Back
        </button>
        <div className="review-title">Review data</div>
        <div className="summary-pills">
          <span className="pill pill-ok">✓ {okRows.length} ready</span>
          {warnRows.length > 0 && <span className="pill pill-warn">⚠ {warnRows.length} uncertain</span>}
          {errRows.length > 0  && <span className="pill pill-err">✕ {errRows.length} failed</span>}
        </div>
      </div>

      <div className="mapping-section">
        <div className="section-label" style={{marginBottom:12}}>Column mapping — AI inferred</div>
        <div className="mapping-grid">
          {mappings.map((m, i) => (
            <div key={i} className="mapping-row">
              <div className="m-orig" title={m.original}>{m.original}</div>
              <div className="m-arrow">→</div>
              <select
                style={{
                  fontFamily:"var(--font-b)", fontSize:12, fontWeight:500,
                  background: m.confidence === "ok" ? "var(--green-bg)" : "var(--amber-bg)",
                  color: m.confidence === "ok" ? "var(--green)" : "var(--amber)",
                  border: "none", borderRadius: 6, padding: "5px 8px", cursor: "pointer",
                  width:"100%"
                }}
                value={m.inferred || "ignore"}
                onChange={e => updateMapping(i, e.target.value)}
              >
                {canonicalOptions.map(o => (
                  <option key={o} value={o}>{CANONICAL_LABELS[o] || (o === "ignore" ? "Ignore" : o)}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="review-tabs">
        <button className={`rtab ${tab==="all"?"active":""}`} onClick={() => setTab("all")}>All ({rows.length})</button>
        {warnRows.length > 0 && <button className={`rtab ${tab==="warn"?"active":""}`} onClick={() => setTab("warn")}>Uncertain ({warnRows.length})</button>}
        {errRows.length > 0  && <button className={`rtab ${tab==="err"?"active":""}`}  onClick={() => setTab("err")}>Failed ({errRows.length})</button>}
      </div>

      <div style={{flex:1,overflowY:"auto"}}>
        {displayRows.map((row, i) => (
          <div key={i} className={`review-row ${row._status !== "ok" ? row._status : ""}`}>
            <div>
              <div className="rr-name">{row.partName || <em style={{color:"var(--g400,#9a9a92)"}}>No name</em>}</div>
              <div className={`rr-issue ${row._status}`}>{row._issue}</div>
            </div>
            <div className="rr-price">
              {row.price ? `₾ ${row.price}` : <span style={{color:"var(--g400,#9a9a92)"}}>—</span>}
            </div>
            <div style={{display:"flex",justifyContent:"flex-end"}}>
              <div className={`status-circle sc-${row._status}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="review-footer">
        <button className="btn btn-secondary" style={{flex:1}} onClick={onBack}>Save drafts</button>
        <button className="btn btn-primary" style={{flex:2}} onClick={() => onPublish(okRows.length)}>
          Publish {okRows.length} rows →
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
//  ROOT APP
// ═══════════════════════════════════════════
function App() {
  const [mode, setMode] = useState("buyer"); // buyer | seller
  const [screen, setScreen] = useState("home"); // buyer: home | results | seller: dashboard | form | upload | review
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadData, setUploadData] = useState(null);
  const [products, setProducts] = useState(
    MOCK_PRODUCTS.map(p => ({ ...p, _status: "live" }))
  );
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); };
  const sellers = MOCK_SELLERS;

  const switchMode = (m) => {
    setMode(m);
    setScreen(m === "buyer" ? "home" : "dashboard");
    setSelectedProduct(null);
  };

  // ─── Buyer handlers ───
  const handleSearch = (q) => { setSearchQuery(q); setScreen("results"); };

  // ─── Seller handlers ───
  const handleSaveProduct = (form) => {
    if (editingProduct?.id) {
      setProducts(ps => ps.map(p => p.id === editingProduct.id ? { ...p, ...form } : p));
      showToast(form._status === "draft" ? "Saved as draft" : "Product updated ✓");
    } else {
      const newP = { ...form, id: Date.now(), sellerId: MY_SELLER_ID, yearFrom: form.yearFrom ? Number(form.yearFrom) : null, yearTo: form.yearTo ? Number(form.yearTo) : null };
      setProducts(ps => [...ps, newP]);
      showToast(form._status === "draft" ? "Saved as draft" : "Product published ✓");
    }
    setScreen("dashboard");
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (!window.confirm("Delete this product?")) return;
    setProducts(ps => ps.filter(p => p.id !== id));
    setScreen("dashboard");
    setEditingProduct(null);
    showToast("Product deleted");
  };

  const handlePublishUpload = (count) => {
    showToast(`${count} listings published ✓`);
    setScreen("dashboard");
    setUploadData(null);
  };

  // ─── Render ───
  const renderBuyer = () => {
    if (screen === "results") {
      return <ResultsPage query={searchQuery} products={products} sellers={sellers}
        onBack={() => setScreen("home")} onProduct={setSelectedProduct} />;
    }
    return <BuyerHome onSearch={handleSearch} onSellerMode={() => switchMode("seller")} />;
  };

  const renderSeller = () => {
    if (screen === "form") {
      return <ProductForm product={editingProduct} onSave={handleSaveProduct}
        onDelete={handleDeleteProduct} onBack={() => { setScreen("dashboard"); setEditingProduct(null); }} />;
    }
    if (screen === "upload") {
      return <UploadScreen onBack={() => setScreen("dashboard")} onReview={d => { setUploadData(d); setScreen("review"); }} />;
    }
    if (screen === "review" && uploadData) {
      return <ReviewScreen data={uploadData} onBack={() => setScreen("upload")}
        onPublish={handlePublishUpload} />;
    }
    return <SellerDashboard products={products} sellers={sellers}
      onAdd={() => { setEditingProduct(null); setScreen("form"); }}
      onEdit={p => { setEditingProduct(p); setScreen("form"); }}
      onUpload={() => setScreen("upload")} />;
  };

  return (
    <div className="app">
      <nav className="topnav">
        <div className="topnav-logo" onClick={() => switchMode(mode)}>
          Part<span>Find</span>
        </div>
        <div className="mode-toggle">
          <button className={`mode-btn ${mode==="buyer"?"active":""}`} onClick={() => switchMode("buyer")}>Search</button>
          <button className={`mode-btn ${mode==="seller"?"active":""}`} onClick={() => switchMode("seller")}>My Shop</button>
        </div>
      </nav>

      <main className="main">
        {mode === "buyer" ? renderBuyer() : renderSeller()}
      </main>

      {selectedProduct && (
        <ProductSheet
          product={selectedProduct}
          seller={sellers.find(s => s.id === selectedProduct.sellerId)}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
