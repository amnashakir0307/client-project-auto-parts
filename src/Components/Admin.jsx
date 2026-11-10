import React, { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

// Password .env me rakho: VITE_ADMIN_PASSWORD=tumhara-password
// Default: admin123
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
const RED = '#8b0b0b';

// --- CLOUDINARY SETUP DETAILS ---
// .env me dalo: VITE_CLOUDINARY_CLOUD_NAME aur VITE_CLOUDINARY_UPLOAD_PRESET
// Cloudinary Dashboard > Settings > Upload > Add upload preset (Unsigned)
// API secret kabhi frontend code ya .env me public repo me mat dalo.
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
// --------------------------------

// Human-readable names used in the "Please fix: ..." save error message,
// so the user can see exactly which fields are wrong.
const FIELD_LABELS = {
  name: 'Product Name', part_number: 'Part Number / OEM Number', brand: 'Brand',
  model: 'Model', price: 'Price', stock: 'Stock', old_price: 'Old Price',
  discount_percent: 'Discount %', cost_price: 'Cost Price',
  description: 'Description (25 words max)', image_url: 'Photo URL', oem_number: 'OEM Number',
};

const emptyForm = {
  name: '', alternate_names: '', part_number: '', oem_number: '', brand: 'Isuzu', model: '',
  vehicle_year: '', vin: '', category: 'Engine', quality: 'Genuine',
  price: '', old_price: '', discount_percent: '', cost_price: '',
  stock: '', image_url: '', images: '', description: '', is_active: true, is_featured: false
};

// NOTE: Al-Saqar customer records in Supabase have name + phone only.
// There is NO email or role field, so the User Management table shows
// Contact = phone instead of inventing an email / role. Do not fake them.

const MAIN_MENU = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'users', label: 'User Management', icon: '👥' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'activity', label: 'Activity Logs', icon: '🕘' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
  { id: 'health', label: 'System Health', icon: '❤️' },
  { id: 'help', label: 'Help & Support', icon: '?' },
];
const SHOP_MENU = [
  { id: 'products', label: 'Products', icon: '📦' },
  { id: 'orders', label: 'Orders', icon: '🧾' },
  { id: 'requests', label: 'Part Request', icon: '🔍' },
  { id: 'reviews', label: 'Reviews', icon: '⭐' },
  { id: 'coupons', label: 'Coupons', icon: '🎟️' },
  { id: 'carts', label: 'Abandoned Cart', icon: '🛒' },
  { id: 'banners', label: 'Banners', icon: '🖼️' },
  { id: 'profit', label: 'Profit Report', icon: '💰' },
];

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pw, setPw] = useState('');
  const [tab, setTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState('card');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [banners, setBanners] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [names, setNames] = useState(['']);
  const [editingId, setEditingId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterQuality, setFilterQuality] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [showTrash, setShowTrash] = useState(false);
  const [msg, setMsg] = useState('');
  const [couponForm, setCouponForm] = useState({ code: '', discount_percent: '', valid_from: '', valid_until: '', max_uses: '' });
  const [bannerForm, setBannerForm] = useState({ title: '', subtitle: '', image_url: '', coupon_code: '' });
  const [reviews, setReviews] = useState([]);
  const [preview, setPreview] = useState(null); // { kind: 'product'|'review'|'banner'|'coupon'|'order', data }
  const [formErrors, setFormErrors] = useState({});
  const [lowStockThreshold, setLowStockThreshold] = useState(() => { try { return Number(localStorage.getItem('alsaqr_low_stock_threshold')) || 10; } catch (e) { return 10; } });
  const [thresholdInput, setThresholdInput] = useState('');
  const [pwChange, setPwChange] = useState({ current: '', next: '', confirm: '' });
  const [pwChangeMsg, setPwChangeMsg] = useState('');
  const BULK_HEADER = 'name,alternate_names,part_number,oem_number,vin,brand,model,year,category,quality,description,price,old_price,discount_percent,cost_price,stock,image_url,is_featured';
  const descWordCount = (form.description || '').trim() ? (form.description || '').trim().split(/\s+/).length : 0;

  // Fetch one Supabase table tolerantly: a missing table (PostgREST
  // PGRST205 / HTTP 404, e.g. `reviews` not created yet) is treated as an
  // empty list, not an error, and nothing is logged to the console for it.
  // The table is remembered as missing, so later reloads do not keep
  // requesting it (and re-logging a 404) until the page is refreshed.
  const missingTables = useRef(new Set());
  const fetchTable = async (table, orderBy, ascending = false) => {
    if (missingTables.current.has(table)) return [];
    try {
      let q = supabase.from(table).select('*');
      if (orderBy) q = q.order(orderBy, { ascending });
      const res = await q;
      if (res.error) {
        const code = res.error.code || '';
        const status = res.error.status || 0;
        const msgText = String(res.error.message || '');
        if (code === 'PGRST205' || status === 404 || /could not find the table/i.test(msgText) || /relation .* does not exist/i.test(msgText)) {
          missingTables.current.add(table);
          return [];
        }
        setMsg('Error loading ' + table + ': ' + res.error.message);
        return [];
      }
      return res.data || [];
    } catch (e) { return []; }
  };
  const loadAll = async () => {
    setProducts(await fetchTable('products', 'created_at', false));
    setOrders(await fetchTable('orders', 'created_at', false));
    setBanners(await fetchTable('banners', 'sort_order', true));
    setCoupons(await fetchTable('coupons', 'created_at', false));
    setReviews(await fetchTable('reviews', 'created_at', false));
    // Part requests are stored in the messages table (name / phone / message)
    setRequests(await fetchTable('messages', 'created_at', false));
  };
  useEffect(() => { if (loggedIn) loadAll(); }, [loggedIn]);

  const login = (e) => { e.preventDefault(); if (pw === ADMIN_PASSWORD) setLoggedIn(true); else setMsg('Galat password'); };
  // Number fields: digits only (decimals allowed for prices). Letters are rejected.
  const onlyNum = (v, dec) => dec ? v.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1') : v.replace(/[^0-9]/g, '');
  const numField = (key, dec) => (e) => setForm({ ...form, [key]: onlyNum(e.target.value, dec) });
  const onDesc = (e) => { const words = e.target.value.trim() ? e.target.value.trim().split(/\s+/) : []; if (words.length > 25) setForm({ ...form, description: words.slice(0, 25).join(' ') }); else setForm({ ...form, description: e.target.value }); };
  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Product Name is required.';
    if (!form.part_number.trim()) errs.part_number = 'Part Number / OEM Number is required.';
    if (!form.brand.trim()) errs.brand = 'Brand is required.';
    if (!form.model.trim()) errs.model = 'Model is required.';
    // 0 is a valid value: only an empty field (or a negative / non-number) fails.
    if (form.price === '' || form.price === null || isNaN(Number(form.price)) || Number(form.price) < 0) errs.price = 'Price is required and must be a number (0 or more).';
    if (form.stock === '' || form.stock === null || isNaN(Number(form.stock)) || Number(form.stock) < 0) errs.stock = 'Stock is required and must be a number (0 or more).';
    if (form.old_price !== '' && (isNaN(Number(form.old_price)) || Number(form.old_price) < 0)) errs.old_price = 'Old Price must be a number.';
    if (form.discount_percent !== '' && (isNaN(Number(form.discount_percent)) || Number(form.discount_percent) < 0 || Number(form.discount_percent) > 100)) errs.discount_percent = 'Discount % must be a number from 0 to 100.';
    if (form.cost_price !== '' && (isNaN(Number(form.cost_price)) || Number(form.cost_price) < 0)) errs.cost_price = 'Cost Price must be a number.';
    // Description is truncated to 25 words while typing (see onDesc), so a
    // short description is always valid — this only fires if it is over 25.
    if (descWordCount > 25) errs.description = 'Description must be 25 words or less.';
    if (form.image_url && !/^https?:\/\//.test(form.image_url)) errs.image_url = 'Photo URL must start with http:// or https://';
    setFormErrors(errs);
    return errs;
  };
  const downloadTemplate = () => {
    const example = 'Brake Pad Set,Brake Pad; Brake Pads,8-97941501-0,8-97941501-0,JTDBR32E862012345,Isuzu,D-Max,2019,Brake,Genuine,High quality brake pads for daily driving,285,400,29,200,15,https://example.com/brake-pad.jpg,true';
    const blob = new Blob([BULK_HEADER + '\n' + example + '\n'], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'al-saqar-bulk-template.csv'; a.click(); URL.revokeObjectURL(a.href);
  };
  const saveThreshold = () => { const n = Number(thresholdInput); if (!n || n < 1) { setMsg('Low Stock Alert At must be a number of 1 or more.'); return; } try { localStorage.setItem('alsaqr_low_stock_threshold', String(n)); } catch (e) {} setLowStockThreshold(n); setMsg('Low Stock Alert At saved: ' + n + ' (alert shows at ' + n + ' or below).'); };
  const submitPasswordChange = (e) => {
    e.preventDefault();
    if (pwChange.current !== ADMIN_PASSWORD) { setPwChangeMsg('Current Password is wrong.'); return; }
    if (!pwChange.next || pwChange.next.length < 4) { setPwChangeMsg('New Password must be at least 4 characters.'); return; }
    if (pwChange.next !== pwChange.confirm) { setPwChangeMsg('New Password and Confirm New Password do not match.'); return; }
    setPwChangeMsg('Password checked OK. This Vite site reads its password from .env — set VITE_ADMIN_PASSWORD=' + pwChange.next + ' in your .env file (do NOT share it in chat), then restart with npm run dev. The password in this browser session cannot be changed from the panel itself.');
  };
  const changePassword = () => { alert('Password change karne ke liye .env me VITE_ADMIN_PASSWORD badlo, phir npm run dev restart karo.'); };

  // ---- derived real data only, no invented numbers ----
  const customers = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const key = o.customer_phone || o.customer_name || 'unknown';
      if (!map[key]) map[key] = { phone: o.customer_phone || '', name: o.customer_name || 'Customer', orders: 0, total: 0, first: o.created_at, last: o.created_at, status: o.status };
      map[key].orders += 1;
      map[key].total += Number(o.total) || 0;
      if (o.created_at < map[key].first) map[key].first = o.created_at;
      if (o.created_at > map[key].last) map[key].last = o.created_at;
    });
    return Object.values(map).sort((a, b) => String(b.last).localeCompare(String(a.last)));
  }, [orders]);

  const totalSale = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === 'new');
  const delivered = orders.filter((o) => o.status === 'delivered').length;
  const growthRate = orders.length ? Math.round((delivered / orders.length) * 100) : 0;
  const lowStock = products.filter((p) => Number(p.stock) <= lowStockThreshold && !p.is_trashed);
  const topProducts = useMemo(() => {
    const sold = {};
    orders.forEach((o) => {
      const items = Array.isArray(o.items) ? o.items : [];
      items.forEach((it) => { const k = it.product_id || it.name || it.part_number; if (k) sold[k] = (sold[k] || 0) + (Number(it.qty) || 1); });
    });
    return products.map((p) => ({ ...p, sold: sold[p.id] || sold[p.name] || 0 })).sort((a, b) => b.sold - a.sold).slice(0, 10);
  }, [products, orders]);

  // Analytics: cumulative order totals, red line, real data only
  const chartPoints = useMemo(() => {
    const vals = [...orders].reverse().map((o) => Number(o.total) || 0);
    if (!vals.length) return '';
    let cum = 0; const pts = vals.map((v, i) => { cum += v; return [i, cum]; });
    const max = Math.max(...pts.map((p) => p[1]), 1);
    const w = 560, h = 140;
    return pts.map(([i, v], idx) => `${idx === 0 ? 0 : (i / Math.max(pts.length - 1, 1)) * w},${h - (v / max) * (h - 20) - 10}`).join(' ');
  }, [orders]);

  const notifications = useMemo(() => [
    ...pendingOrders.map((o) => ({ id: 'o-' + o.id, text: `New order ${o.order_no || ''} — ${o.customer_name || ''} (SAR ${o.total || 0})`, time: o.created_at })),
    ...lowStock.map((p) => ({ id: 's-' + p.id, text: `Low stock: ${p.name} — only ${p.stock} left`, time: p.updated_at || p.created_at })),
  ].slice(0, 10), [pendingOrders, lowStock]);

  const activity = useMemo(() => [
    ...orders.slice(0, 8).map((o) => ({ id: 'a-o-' + o.id, text: `Order ${o.order_no || ''} — ${o.customer_name || ''} — ${o.status}`, time: o.created_at })),
    ...products.slice(0, 8).map((p) => ({ id: 'a-p-' + p.id, text: `Product ${p.is_active === false ? 'hidden' : 'listed'}: ${p.name}`, time: p.created_at })),
  ].sort((a, b) => String(b.time).localeCompare(String(a.time))).slice(0, 10), [orders, products]);

  if (!loggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: '#f6f6f7', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, fontFamily: 'Poppins, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: 400, background: '#fff', padding: 28, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ color: RED, fontWeight: 900, fontSize: 22, marginBottom: 4 }}>AL-SAQR</div>
          <div style={{ color: '#000', fontWeight: 700, marginBottom: 4 }}>SPARE PARTS</div>
          <p style={{ color: '#666', marginTop: 0 }}>Admin Login</p>
          <form onSubmit={login}>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Admin password" style={{ width: '100%', padding: 12, marginBottom: 12, borderRadius: 10, border: '1px solid #ddd', boxSizing: 'border-box' }} />
            <button style={{ width: '100%', padding: 12, background: RED, color: '#fff', border: 'none', borderRadius: 10, fontWeight: 800, cursor: 'pointer' }}>Login</button>
          </form>
          {msg && <p style={{ color: 'red' }}>{msg}</p>}
          <p style={{ fontSize: 12, color: '#888' }}>Default password: admin123</p>
        </div>
      </div>
    );
  }

  // --- NAYA CLOUDINARY UPLOAD FUNCTION ---
  const onGallery = async (e) => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setMsg('Cloudinary set nahi hai. .env me VITE_CLOUDINARY_CLOUD_NAME aur VITE_CLOUDINARY_UPLOAD_PRESET dalo, phir npm run dev restart karo.');
      return;
    }
    const files = [...e.target.files].slice(0, 5);
    const urls = [];
    
    setMsg('Images upload ho rahi hain, baraye meharbani intazar karein...');

    for (const f of files) {
      const formData = new FormData();
      formData.append('file', f);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();
        if (data.secure_url) {
          urls.push(data.secure_url);
        } else {
            console.error("Cloudinary error:", data);
            setMsg('Ek image upload fail ho gayi.');
        }
      } catch (error) {
        console.error("Upload error:", error);
        setMsg('Image upload karte waqt error aagaya.');
      }
    }

    if(urls.length > 0) {
        setForm({ ...form, images: urls.join(','), image_url: urls[0] || form.image_url });
        setMsg('Images successfully upload ho gayin!');
    }
  };
  // ---------------------------------------

  const calcDiscount = () => {
    const price = Number(form.price) || 0, old = Number(form.old_price) || 0;
    if (old > price && old > 0) return Math.round(((old - price) / old) * 100);
    return Number(form.discount_percent) || 0;
  };
  // FIX 4 — ADMIN SAVE FAILURE RISK: saveProduct used to send the whole
  // form (images, alternate_names, old_price, discount_percent, cost_price,
  // vin, vehicle_year, quality, is_featured, is_trashed, oem_number). If
  // ANY of those columns does not exist in Supabase (003 migration not
  // run — and note 003 does NOT add oem_number), the whole insert/update
  // fails and NOTHING saves. Now: try the full payload, and on a
  // missing-column error retry with core columns only, naming the column.
  const CORE_PRODUCT_FIELDS = ['name', 'part_number', 'brand', 'model', 'category', 'price', 'stock', 'image_url', 'description', 'is_active'];
  const missingColumnName = (err) => {
    const m = String((err && err.message) || '');
    const hit = m.match(/column\s+"?([a-z_0-9]+)"?\s+does not exist/i) || m.match(/Could not find the '([a-z_0-9]+)' column/i) || m.match(/column\s+'([a-z_0-9]+)'/i);
    return hit ? hit[1] : null;
  };
  const isMissingColumnError = (err) => {
    const m = String((err && err.message) || '') + ' ' + String((err && err.code) || '');
    return /does not exist/i.test(m) || /Could not find the/i.test(m) || err?.code === 'PGRST204' || err?.code === '42703';
  };
  const coreOnly = (payload) => { const o = {}; CORE_PRODUCT_FIELDS.forEach((k) => { if (payload[k] !== undefined) o[k] = payload[k]; }); return o; };
  // Runs an insert/update; on missing-column error retries core-only.
  // Returns { res, retriedWithCore, missingColumn }.
  const saveProductsTolerant = async (rows, isUpdate, id) => {
    let res;
    if (isUpdate) res = await supabase.from('products').update(rows[0]).eq('id', id);
    else res = await supabase.from('products').insert(rows);
    if (!res.error || !isMissingColumnError(res.error)) return { res, retriedWithCore: false, missingColumn: null };
    const col = missingColumnName(res.error);
    const coreRows = rows.map(coreOnly);
    let res2;
    if (isUpdate) res2 = await supabase.from('products').update(coreRows[0]).eq('id', id);
    else res2 = await supabase.from('products').insert(coreRows);
    return { res: res2, retriedWithCore: true, missingColumn: col };
  };
  const saveProduct = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      // Name the exact wrong fields, e.g. "Please fix: Price, Stock, Description (25 words max)"
      const badNames = Object.keys(errs).map((k) => FIELD_LABELS[k] || k);
      setMsg('Please fix: ' + badNames.join(', '));
      // Scroll to the first wrong field and focus it so the user can see it.
      const firstKey = Object.keys(errs)[0];
      setTimeout(() => {
        const el = document.querySelector('[data-field="' + firstKey + '"]');
        if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus({ preventScroll: true }); }
      }, 50);
      return;
    }
    const allNames = [form.name, ...names.filter(Boolean)].join(', ');
    // oem_number has NO column in 001/003 — it is sent in the full payload
    // and stripped by the core-only retry if Supabase rejects it.
    const payload = { ...form, name: form.name, alternate_names: allNames, oem_number: form.oem_number || form.part_number, price: Number(form.price) || 0, old_price: Number(form.old_price) || 0, discount_percent: calcDiscount(), cost_price: Number(form.cost_price) || 0, stock: Number(form.stock) || 0 };
    const { res, retriedWithCore, missingColumn } = await saveProductsTolerant([payload], !!editingId, editingId);
    if (res.error) setMsg('Error: ' + res.error.message);
    else {
      setMsg(retriedWithCore
        ? 'Saved (core fields only)! Column "' + (missingColumn || 'unknown') + '" does not exist in Supabase — run the 003 migration (and add oem_number) so that field saves too.'
        : 'Saved! Shop par dikhega.');
      setForm(emptyForm); setNames(['']); setEditingId(null); loadAll();
    }
  };
  const editProduct = (p) => {
    setForm({ ...emptyForm, ...p, price: String(p.price ?? ''), old_price: String(p.old_price ?? ''), stock: String(p.stock ?? '') });
    setNames((p.alternate_names || '').split(',').map((x) => x.trim()).filter(Boolean).slice(1));
    setEditingId(p.id); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const toggleHide = async (p) => { await supabase.from('products').update({ is_active: !p.is_active }).eq('id', p.id); loadAll(); };
  const toggleFeatured = async (p) => { await supabase.from('products').update({ is_featured: !p.is_featured }).eq('id', p.id); loadAll(); };
  const removeToTrash = async (p) => { await supabase.from('products').update({ is_trashed: true }).eq('id', p.id); loadAll(); };
  const restoreTrash = async (p) => { await supabase.from('products').update({ is_trashed: false }).eq('id', p.id); loadAll(); };
  const deleteProduct = async (id) => {
    if (!window.confirm('Pakka Delete karna hai? Ye main database se bhi khatam ho jayega.')) return;
    const res = await supabase.from('products').delete().eq('id', id);
    if (res.error) setMsg('Error: ' + res.error.message); else loadAll();
  };
  const duplicateProduct = async (p) => {
    const { id, created_at, updated_at, ...rest } = p;
    const { res, retriedWithCore, missingColumn } = await saveProductsTolerant([{ ...rest, part_number: rest.part_number + '-COPY', name: rest.name + ' (Copy)' }], false);
    if (res.error) setMsg('Duplicate Error: ' + res.error.message);
    else if (retriedWithCore) setMsg('Duplicated (core fields only) — column "' + (missingColumn || 'unknown') + '" is missing in Supabase, run the 003 migration.');
    loadAll();
  };
  const importCSV = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (!lines.length) { setMsg('CSV file is empty.'); return; }
    const header = lines[0].split(',').map((x) => x.trim().toLowerCase());
    const idx = (name) => header.indexOf(name);
    if (idx('name') < 0 || idx('part_number') < 0) { setMsg('CSV header is wrong. Download Template and use its exact columns: ' + BULK_HEADER); return; }
    const get = (c, name) => (idx(name) >= 0 ? (c[idx(name)] || '').trim() : '');
    const validBrands = ['Isuzu', 'Mitsubishi', 'Changan', 'MG', 'Hyundai'];
    const validCats = ['Engine', 'Brake', 'Wiper', 'Light', 'Filter', 'Suspension', 'Exhaust', 'Battery', 'Wheels', 'Clutch', 'Steering', 'Cooling'];
    const validQual = ['Genuine', 'OEM', 'China', 'Kabli'];
    const rows = []; const failed = [];
    lines.slice(1).forEach((line, i) => {
      const c = line.split(',').map((x) => x.trim());
      // oem_number: no column in 001/003 yet — sent in the full row and
      // stripped by the core-only retry if Supabase rejects it.
      // is_active/is_trashed are set explicitly: bulk rows used to omit
      // them, relying on DB defaults; explicit values are safer.
      const row = { name: get(c, 'name'), alternate_names: get(c, 'alternate_names'), part_number: get(c, 'part_number'), oem_number: get(c, 'oem_number') || get(c, 'part_number'), brand: get(c, 'brand') || 'Isuzu', model: get(c, 'model'), vehicle_year: get(c, 'year'), vin: get(c, 'vin'), category: get(c, 'category') || 'Engine', quality: get(c, 'quality') || 'Genuine', description: get(c, 'description'), price: Number(get(c, 'price')) || 0, old_price: Number(get(c, 'old_price')) || 0, discount_percent: Number(get(c, 'discount_percent')) || 0, cost_price: Number(get(c, 'cost_price')) || 0, stock: Number(get(c, 'stock')) || 0, image_url: get(c, 'image_url'), is_featured: /^(true|1|yes)$/i.test(get(c, 'is_featured')), is_active: true, is_trashed: false };
      const bad = !row.name || !row.part_number || isNaN(Number(get(c, 'price'))) || isNaN(Number(get(c, 'stock'))) || (row.brand && !validBrands.includes(row.brand)) || (row.category && !validCats.includes(row.category)) || (row.quality && !validQual.includes(row.quality));
      if (bad) failed.push(i + 2); else rows.push(row);
    });
    if (!rows.length) { setMsg('No valid rows. Failed rows: ' + (failed.join(', ') || 'all') + '. Check name, part_number, price, stock, brand, category, quality.'); return; }
    const { res, retriedWithCore, missingColumn } = await saveProductsTolerant(rows, false);
    if (res.error) setMsg('CSV Error: ' + res.error.message);
    else { setMsg(rows.length + ' products add ho gaye.' + (retriedWithCore ? ' Core fields only — column "' + (missingColumn || 'unknown') + '" is missing in Supabase, run the 003 migration.' : '') + (failed.length ? ' Failed rows: ' + failed.join(', ') + '.' : '')); loadAll(); }
  };
  const updateOrderStatus = async (id, status) => { await supabase.from('orders').update({ status }).eq('id', id); loadAll(); };
  const deleteOrder = async (id) => { if (!window.confirm('Pakka Delete karna hai? Ye main database se bhi khatam ho jayega.')) return; const res = await supabase.from('orders').delete().eq('id', id); if (res.error) setMsg('Error: ' + res.error.message); else { setMsg('Order deleted from the database.'); loadAll(); } };
  const deleteCoupon = async (id) => { if (!window.confirm('Pakka Delete karna hai? Ye main database se bhi khatam ho jayega.')) return; const res = await supabase.from('coupons').delete().eq('id', id); if (res.error) setMsg('Error: ' + res.error.message); else { setMsg('Coupon deleted from the database.'); loadAll(); } };
  const deleteBanner = async (id) => { if (!window.confirm('Pakka Delete karna hai? Ye main database se bhi khatam ho jayega.')) return; const res = await supabase.from('banners').delete().eq('id', id); if (res.error) setMsg('Error: ' + res.error.message); else { setMsg('Banner deleted from the database.'); loadAll(); } };
  const updateReview = async (id, patch) => { const res = await supabase.from('reviews').update(patch).eq('id', id); if (res.error) setMsg('Error: ' + res.error.message); else loadAll(); };
  const deleteReview = async (id) => { if (!window.confirm('Pakka Delete karna hai? Ye main database se bhi khatam ho jayega.')) return; const res = await supabase.from('reviews').delete().eq('id', id); if (res.error) setMsg('Error: ' + res.error.message); else { setMsg('Review deleted from the database.'); loadAll(); } };
  const waLink = (phone, text) => `https://wa.me/${String(phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  const saveCoupon = async (e) => {
    e.preventDefault();
    const res = await supabase.from('coupons').insert([{ code: couponForm.code, discount_percent: Number(couponForm.discount_percent) || 0, valid_from: couponForm.valid_from || null, valid_until: couponForm.valid_until || null, max_uses: Number(couponForm.max_uses) || null, is_active: true }]);
    if (res.error) setMsg('Coupon Error: ' + res.error.message); else { setMsg('Coupon saved.'); setCouponForm({ code: '', discount_percent: '', valid_from: '', valid_until: '', max_uses: '' }); loadAll(); }
  };
  const saveBanner = async (e) => {
    e.preventDefault();
    const res = await supabase.from('banners').insert([{ ...bannerForm, sort_order: banners.length, is_visible: true }]);
    if (res.error) setMsg('Banner Error: ' + res.error.message); else { setMsg('Banner saved.'); setBannerForm({ title: '', subtitle: '', image_url: '', coupon_code: '' }); loadAll(); }
  };

  const filtered = products.filter((p) => {
    if (showTrash ? !p.is_trashed : p.is_trashed) return false;
    const q = search.toLowerCase();
    const hay = [p.name, p.alternate_names, p.part_number, p.brand, p.model, p.vehicle_year, p.vin, p.category, p.quality].join(' ').toLowerCase();
    if (q && !hay.includes(q)) return false;
    if (filterCat && p.category !== filterCat) return false;
    if (filterQuality && p.quality !== filterQuality) return false;
    if (filterStock === 'in' && p.stock <= 0) return false;
    if (filterStock === 'out' && p.stock > 0) return false;
    if (filterStock === 'low' && Number(p.stock) > lowStockThreshold) return false;
    return true;
  });

  const inputStyle = { width: '100%', padding: 10, marginBottom: 8, borderRadius: 10, border: '1px solid #ddd', boxSizing: 'border-box', background: '#fff', color: '#000' };
  const btnRed = { padding: '10px 16px', background: RED, color: '#fff', border: 'none', borderRadius: 20, fontWeight: 800, cursor: 'pointer' };
  const btnLight = { padding: '10px 16px', background: '#f0f0f0', color: '#000', border: '1px solid #ddd', borderRadius: 20, fontWeight: 700, cursor: 'pointer' };
  const card = { background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' };
  // Modern product card: one row of small icon buttons (Daraz/Amazon style)
  const iconBtn = { width: 34, height: 34, minWidth: 34, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, background: '#f0f0f0', color: '#000', border: '1px solid #e5e5e5', borderRadius: 10, cursor: 'pointer' };
  const iconBtnRed = { ...iconBtn, background: '#c00', color: '#fff', border: '1px solid #c00' };
  const iconBtnGold = { ...iconBtn, background: '#d4a017', color: '#000', border: '1px solid #d4a017' };
  const statCards = [
    { label: 'Total Users', value: customers.length, icon: '👥', sub: 'customers from orders' },
    { label: 'Active Users', value: customers.filter((c) => c.status !== 'cancelled').length, icon: '✅', sub: 'with orders' },
    { label: 'Total Posts', value: products.filter((p) => !p.is_trashed).length, icon: '📦', sub: 'products listed' },
    { label: 'Growth Rate', value: growthRate + '%', icon: '📈', sub: 'orders delivered' },
  ];

  const menuBtn = (item) => (
    <button key={item.id} onClick={() => { setTab(item.id); setSidebarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '10px 12px', marginBottom: 4, borderRadius: 10, border: 'none', cursor: 'pointer', background: tab === item.id ? '#fdecec' : 'transparent', color: tab === item.id ? RED : '#000', fontWeight: tab === item.id ? 800 : 500 }}>
      <span style={{ width: 22, textAlign: 'center' }}>{item.icon}</span>{item.label}
    </button>
  );

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', background: '#f6f6f7', color: '#000', minHeight: '100vh' }}>
      <style>{`
        .admin-shell { display: flex; min-height: 100vh; }
        .admin-sidebar { width: 240px; background: #fff; border-right: 1px solid #eee; padding: 16px 12px; position: sticky; top: 0; height: 100vh; overflow-y: auto; flex-shrink: 0; }
        .admin-main { flex: 1; min-width: 0; }
        .admin-topbar { background: #fff; border-bottom: 1px solid #eee; padding: 12px 20px; display: flex; align-items: center; gap: 12px; position: sticky; top: 0; z-index: 10; }
        .admin-content { padding: 20px; }
        .dash-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .dash-row { display: grid; grid-template-columns: 2fr 1fr; gap: 12px; margin-top: 12px; }
        .dash-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
        .product-card { background: #fff; border-radius: 16px; padding: 0; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.06); transition: transform .18s ease, box-shadow .18s ease; display: flex; flex-direction: column; }
        .product-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
        .product-photo { position: relative; width: 100%; aspect-ratio: 4 / 3; background: #f6f6f7; overflow: hidden; }
        .product-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .product-photo .no-photo { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 40px; color: #ccc; }
        .badge-off { position: absolute; top: 10px; left: 10px; background: #16a34a; color: #fff; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 20px; }
        .badge-flag { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.75); color: #fff; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
        .badge-flag.low { background: #c00; }
        .product-body { padding: 12px 14px 14px; display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .product-name { font-weight: 800; font-size: 15px; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .product-alt { font-size: 12px; color: #888; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .product-meta { font-size: 12px; color: #888; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .product-price { margin: 6px 0 0; display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
        .product-price b { font-size: 18px; }
        .product-price .old { font-size: 13px; color: #999; text-decoration: line-through; }
        .product-price .off { background: #16a34a; color: #fff; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 20px; }
        .product-stock { font-size: 12px; margin: 0; color: #16a34a; font-weight: 700; }
        .product-stock.low { color: #c00; }
        .product-actions { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; padding-top: 10px; border-top: 1px solid #f0f0f0; }
        .product-line { display: flex; gap: 14px; align-items: center; }
        .product-line .product-photo { width: 96px; min-width: 96px; aspect-ratio: 1 / 1; border-radius: 12px; }
        .product-line .product-body { padding: 0; }
        @media (max-width: 900px) {
          .dash-grid { grid-template-columns: repeat(2, 1fr); }
          .dash-row, .dash-row2 { grid-template-columns: 1fr; }
          .admin-sidebar { position: fixed; left: 0; top: 0; z-index: 50; transform: translateX(-100%); transition: transform .2s; box-shadow: 0 0 30px rgba(0,0,0,.2); }
          .admin-sidebar.open { transform: translateX(0); }
        }
        @media (min-width: 901px) { .menu-toggle { display: none; } }
      `}</style>

      <div className="admin-shell">
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div style={{ fontWeight: 900, color: RED, fontSize: 20, padding: '4px 8px' }}>AL-SAQR</div>
          <div style={{ fontWeight: 700, padding: '0 8px 12px', fontSize: 13, color: '#666' }}>SPARE PARTS • Admin</div>
          {MAIN_MENU.map(menuBtn)}
          <div style={{ fontSize: 11, color: '#999', padding: '14px 8px 6px', fontWeight: 800 }}>STORE</div>
          {SHOP_MENU.map(menuBtn)}
          <div style={{ marginTop: 16, background: '#f6f6f7', borderRadius: 12, padding: 12 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: RED, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>A</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: 13 }}>Main Admin</div>
                <div style={{ fontSize: 11, color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>saqrcompany4@gmail.com</div>
              </div>
            </div>
            <button onClick={() => { setTab('settings'); setSidebarOpen(false); }} style={{ ...btnLight, width: '100%', marginTop: 8 }}>Change Password</button>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={() => { setLoggedIn(false); setPw(''); setSidebarOpen(false); }} style={{ ...btnRed, flex: 1, padding: '9px 10px' }}>Logout</button>
              <button onClick={() => { window.location.href = '/home'; }} style={{ ...btnLight, flex: 1, padding: '9px 10px' }}>Back to Home</button>
            </div>
          </div>
        </aside>

        <div className="admin-main">
          <div className="admin-topbar">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} style={btnLight}>☰</button>
            <input value={search} onChange={(e) => { setSearch(e.target.value); if (tab !== 'products') setTab('products'); }} placeholder="Search products, part number, VIN…" style={{ flex: 1, maxWidth: 480, margin: '0 auto', padding: '10px 14px', borderRadius: 20, border: '1px solid #ddd', background: '#f6f6f7' }} />
            <button onClick={() => setTab('notifications')} style={{ ...btnLight, borderRadius: '50%', padding: '8px 12px' }} title="Notifications">🔔{pendingOrders.length > 0 && <span style={{ color: RED, fontWeight: 900 }}> •</span>}</button>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>A</div>
          </div>

          <div className="admin-content">
            {msg && <p style={{ background: msg.startsWith('Please fix:') ? '#ffe6e6' : '#e6ffe6', color: msg.startsWith('Please fix:') ? '#8b0b0b' : '#000', padding: 10, borderRadius: 10, fontWeight: msg.startsWith('Please fix:') ? 700 : 400 }}>{msg}</p>}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h1 style={{ margin: 0, fontSize: 22 }}>{[...MAIN_MENU, ...SHOP_MENU].find((m) => m.id === tab)?.label || 'Dashboard'}</h1>
              <button onClick={changePassword} style={btnLight}>Change Password</button>
            </div>

            {tab === 'dashboard' && (
              <div>
                <div className="dash-grid">
                  {statCards.map((s) => (
                    <div key={s.label} style={card}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ fontSize: 22, background: '#fdecec', borderRadius: 10, padding: 8 }}>{s.icon}</span>
                        <div><div style={{ fontSize: 12, color: '#666' }}>{s.label}</div><div style={{ fontSize: 24, fontWeight: 900 }}>{s.value}</div><div style={{ fontSize: 11, color: '#999' }}>{s.sub}</div></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="dash-row">
                  <div style={card}>
                    <h3 style={{ marginTop: 0 }}>User Management</h3>
                    <p style={{ fontSize: 12, color: '#666', marginTop: -8 }}>Contact shows phone — customer records have no email / role in Supabase.</p>
                    {customers.length === 0 ? <p>No customers yet — customers appear here from orders.</p> : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                          <thead><tr style={{ textAlign: 'left', color: '#666' }}><th>User</th><th>Contact</th><th>Orders</th><th>Status</th><th>Joined</th></tr></thead>
                          <tbody>
                            {customers.slice(0, 10).map((c) => (
                              <tr key={c.phone || c.name} style={{ borderTop: '1px solid #eee' }}>
                                <td style={{ padding: '8px 0' }}><b>{c.name}</b></td>
                                <td>{c.phone}</td>
                                <td>{c.orders}</td>
                                <td><span style={{ background: '#fdecec', color: RED, padding: '3px 10px', borderRadius: 20, fontSize: 12 }}>Active</span></td>
                                <td>{String(c.first || '').slice(0, 10)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                  <div style={card}>
                    <h3 style={{ marginTop: 0 }}>Analytics Overview</h3>
                    <div style={{ color: RED, fontWeight: 900 }}>+{growthRate}%</div>
                    <div style={{ fontSize: 12, color: '#666' }}>Total sales SAR {totalSale} • {orders.length} orders</div>
                    {chartPoints ? (
                      <svg viewBox="0 0 560 140" style={{ width: '100%', height: 140, marginTop: 8 }}><polyline points={chartPoints} fill="none" stroke={RED} strokeWidth="3" strokeLinejoin="round" /></svg>
                    ) : <p style={{ color: '#999' }}>No sales yet — the red graph appears when orders arrive.</p>}
                  </div>
                </div>

                <div className="dash-row2">
                  <div style={card}>
                    <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
                    {activity.length === 0 ? <p>No activity yet.</p> : activity.map((a) => <div key={a.id} style={{ padding: '8px 0', borderTop: '1px solid #eee', fontSize: 13 }}>{a.text}<div style={{ fontSize: 11, color: '#999' }}>{String(a.time || '').slice(0, 10)}</div></div>)}
                    <h3 style={{ color: RED, marginTop: 16 }}>Low Stock Alert <span style={{ fontSize: 12, color: '#666' }}>(alert at {lowStockThreshold} or below — change in Settings)</span></h3>
                    {lowStock.length === 0 ? <p>All products in stock.</p> : lowStock.map((p) => <div key={p.id} style={{ background: '#ffe6e6', padding: 10, marginBottom: 8, borderRadius: 10, fontSize: 13 }}>{p.name} — Stock: {p.stock}</div>)}
                    <h3 style={{ marginTop: 16 }}>Top 10 Selling Parts</h3>
                    {topProducts.filter((p) => p.sold > 0).length === 0 ? <p>No sales yet.</p> : topProducts.filter((p) => p.sold > 0).map((p, i) => <div key={p.id} style={{ padding: '6px 0', borderTop: '1px solid #eee', fontSize: 13 }}>{i + 1}. {p.name} — {p.sold} sold</div>)}
                  </div>
                  <div>
                    <div style={{ ...card, marginBottom: 12 }}>
                      <h3 style={{ marginTop: 0 }}>Notifications</h3>
                      {notifications.length === 0 ? <p>No notifications.</p> : notifications.map((n) => <div key={n.id} style={{ padding: '8px 0', borderTop: '1px solid #eee', fontSize: 13 }}>{n.text}</div>)}
                    </div>
                    <div style={card}>
                      <h3 style={{ marginTop: 0 }}>Activity Logs</h3>
                      {activity.length === 0 ? <p>No logs yet.</p> : activity.map((a) => <div key={a.id} style={{ padding: '6px 0', borderTop: '1px solid #eee', fontSize: 12 }}>{a.text}</div>)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'users' && (
              <div style={card}>
                <h3 style={{ marginTop: 0 }}>User Management</h3>
                <p style={{ fontSize: 12, color: '#666' }}>Customers are built from real orders. Contact shows phone — no email / role is stored for customers in Supabase.</p>
                {customers.length === 0 ? <p>No customers yet.</p> : customers.map((c) => (
                  <div key={c.phone || c.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '10px 0', borderTop: '1px solid #eee', flexWrap: 'wrap' }}>
                    <div><b>{c.name}</b><div style={{ fontSize: 12, color: '#666' }}>{c.phone} • {c.orders} orders • SAR {c.total}</div></div>
                    <a href={waLink(c.phone, `Assalam-o-Alaikum ${c.name}, AL-SAQR SPARE PARTS`)} target="_blank" rel="noreferrer" style={{ ...btnRed, background: 'green', textDecoration: 'none' }}>WhatsApp</a>
                  </div>
                ))}
              </div>
            )}

            {tab === 'analytics' && (
              <div style={card}>
                <h3 style={{ marginTop: 0 }}>Analytics Overview</h3>
                <p>Total sales: <b>SAR {totalSale}</b> • Orders: {orders.length} • Products: {products.filter((p) => !p.is_trashed).length}</p>
                {chartPoints ? <svg viewBox="0 0 560 140" style={{ width: '100%', height: 180 }}><polyline points={chartPoints} fill="none" stroke={RED} strokeWidth="3" /></svg> : <p>No sales yet.</p>}
              </div>
            )}

            {tab === 'notifications' && (
              <div style={card}><h3 style={{ marginTop: 0 }}>Notifications</h3>{notifications.length === 0 ? <p>No notifications.</p> : notifications.map((n) => <div key={n.id} style={{ padding: '10px 0', borderTop: '1px solid #eee' }}>{n.text}</div>)}</div>
            )}
            {tab === 'activity' && (
              <div style={card}><h3 style={{ marginTop: 0 }}>Activity Logs</h3>{activity.length === 0 ? <p>No logs yet.</p> : activity.map((a) => <div key={a.id} style={{ padding: '8px 0', borderTop: '1px solid #eee', fontSize: 13 }}>{a.text} — {String(a.time || '').slice(0, 10)}</div>)}</div>
            )}
            {tab === 'settings' && (
              <div>
                <div style={{ ...card, marginBottom: 12 }}>
                  <h3 style={{ marginTop: 0 }}>Settings</h3>
                  <p><b>Shop:</b> AL-SAQR SPARE PARTS</p>
                  <p><b>Location:</b> Makkah, Al-Ukaishiyah New Industrial City</p>
                  <p><b>WhatsApp:</b> +966 50 274 8270</p>
                  <p><b>Email:</b> saqrcompany4@gmail.com</p>
                  <p style={{ fontSize: 12, color: '#666' }}>Bank details: add them here in your shop settings — they are not stored in this file.</p>
                  <p style={{ fontSize: 12, color: '#666', marginTop: 12 }}>Access: password-only login. Pending approvals are handled by the Main Admin in this panel (no Gmail email is sent).</p>
                </div>
                <div style={{ ...card, marginBottom: 12 }}>
                  <h3 style={{ marginTop: 0 }}>Stock Alerts</h3>
                  <label style={{ fontSize: 13, fontWeight: 700 }}>Low Stock Alert At</label>
                  <p style={{ fontSize: 12, color: '#666', margin: '4px 0 8px' }}>Alert shows when stock is at or below this number. Current: <b>{lowStockThreshold}</b></p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="number" inputMode="numeric" min="1" placeholder={String(lowStockThreshold)} value={thresholdInput} onChange={(e) => setThresholdInput(onlyNum(e.target.value, false))} style={{ ...inputStyle, maxWidth: 140, marginBottom: 0 }} />
                    <button onClick={saveThreshold} style={btnRed}>Save Threshold</button>
                  </div>
                </div>
                <div style={card}>
                  <h3 style={{ marginTop: 0 }}>Change Password</h3>
                  <p style={{ fontSize: 12, color: '#666' }}>This Vite site reads its password from the .env file. Enter the current password to check it, then set the new password in .env as VITE_ADMIN_PASSWORD and restart with npm run dev.</p>
                  <form onSubmit={submitPasswordChange}>
                    <input type="password" placeholder="Current Password" value={pwChange.current} onChange={(e) => setPwChange({ ...pwChange, current: e.target.value })} style={inputStyle} />
                    <input type="password" placeholder="New Password" value={pwChange.next} onChange={(e) => setPwChange({ ...pwChange, next: e.target.value })} style={inputStyle} />
                    <input type="password" placeholder="Confirm New Password" value={pwChange.confirm} onChange={(e) => setPwChange({ ...pwChange, confirm: e.target.value })} style={inputStyle} />
                    <button style={btnRed}>Save New Password</button>
                  </form>
                  {pwChangeMsg && <p style={{ fontSize: 13, background: '#fff3cd', padding: 10, borderRadius: 10 }}>{pwChangeMsg}</p>}
                </div>
              </div>
            )}
            {tab === 'health' && (
              <div style={card}><h3 style={{ marginTop: 0 }}>System Health</h3><p>Supabase: {products.length + orders.length + banners.length >= 0 ? 'Connected' : 'Unknown'}</p><p>Products: {products.length} • Orders: {orders.length} • Banners: {banners.length} • Coupons: {coupons.length}</p></div>
            )}
            {tab === 'help' && (
              <div style={card}><h3 style={{ marginTop: 0 }}>Help &amp; Support</h3><p>AL-SAQR SPARE PARTS — Makkah, Al-Ukaishiyah New Industrial City</p><p>WhatsApp: +966 50 274 8270 • Email: saqrcompany4@gmail.com</p><p>For product / order help, use the Products and Orders sections in the sidebar.</p></div>
            )}

            {tab === 'products' && (
              <div>
                <form onSubmit={saveProduct} style={{ ...card, marginBottom: 16 }}>
                  <h3 style={{ marginTop: 0 }}>{editingId ? 'Update Product' : 'Add New Product'}</h3>
                  <input data-field="name" placeholder="Product Name *" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: '' }); }} required style={{ ...inputStyle, border: formErrors.name ? '2px solid red' : '1px solid #ddd' }} />
                  {formErrors.name && <p style={{ color: 'red', fontSize: 12, marginTop: -4 }}>{formErrors.name}</p>}
                  <label style={{ fontSize: 13, fontWeight: 700 }}>Multiple Names (jo customer search kare):</label>
                  {names.map((n, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <input placeholder={'Alternate Name ' + (i + 1)} value={n} onChange={(e) => { const a = [...names]; a[i] = e.target.value; setNames(a); }} style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid #ddd' }} />
                      <button type="button" onClick={() => setNames(names.filter((_, j) => j !== i))} style={btnLight}>Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setNames([...names, ''])} style={btnRed}>+ Add Another Name</button>
                  <div style={{ height: 12 }} />
                  <input data-field="part_number" placeholder="Part Number / OEM Number *" value={form.part_number} onChange={(e) => setForm({ ...form, part_number: e.target.value })} style={{ ...inputStyle, border: formErrors.part_number ? '2px solid red' : '1px solid #ddd' }} />
                  {formErrors.part_number && <p style={{ color: 'red', fontSize: 12, marginTop: -4 }}>{formErrors.part_number}</p>}
                  <input data-field="oem_number" placeholder="OEM Number (optional — same as Part Number if blank)" value={form.oem_number} onChange={(e) => setForm({ ...form, oem_number: e.target.value })} style={inputStyle} />
                  <input placeholder="VIN / Chassis Number" value={form.vin} onChange={(e) => setForm({ ...form, vin: e.target.value })} style={inputStyle} />
                  <select data-field="brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} style={{ ...inputStyle, border: formErrors.brand ? '2px solid red' : '1px solid #ddd' }}>{['Isuzu', 'Mitsubishi', 'Changan', 'MG', 'Hyundai'].map((c) => <option key={c}>{c}</option>)}</select>
                  {formErrors.brand && <p style={{ color: 'red', fontSize: 12, marginTop: -4 }}>{formErrors.brand}</p>}
                  <input data-field="model" placeholder="Model — D-Max / L200 / Pajero / MG5" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} style={{ ...inputStyle, border: formErrors.model ? '2px solid red' : '1px solid #ddd' }} />
                  {formErrors.model && <p style={{ color: 'red', fontSize: 12, marginTop: -4 }}>{formErrors.model}</p>}
                  <input placeholder="Year — 2019 / 2020" type="number" inputMode="numeric" value={form.vehicle_year} onChange={numField('vehicle_year', false)} style={inputStyle} />
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={inputStyle}>{['Engine', 'Brake', 'Wiper', 'Light', 'Filter', 'Suspension', 'Exhaust', 'Battery', 'Wheels', 'Clutch', 'Steering', 'Cooling'].map((c) => <option key={c}>{c}</option>)}</select>
                  <select value={form.quality} onChange={(e) => setForm({ ...form, quality: e.target.value })} style={inputStyle}>{['Genuine', 'OEM', 'China', 'Kabli'].map((c) => <option key={c}>{c}</option>)}</select>
                  <input data-field="price" placeholder="Price (Real Price) SAR *" type="number" inputMode="numeric" value={form.price} onChange={numField('price', true)} style={{ ...inputStyle, border: formErrors.price ? '2px solid red' : '1px solid #ddd' }} />
                  {formErrors.price && <p style={{ color: 'red', fontSize: 12, marginTop: -4 }}>{formErrors.price}</p>}
                  <input data-field="old_price" placeholder="Old Price (kati hui dikhegi) SAR" type="number" inputMode="numeric" value={form.old_price} onChange={numField('old_price', true)} style={{ ...inputStyle, border: formErrors.old_price ? '2px solid red' : '1px solid #ddd' }} />
                  {formErrors.old_price && <p style={{ color: 'red', fontSize: 12, marginTop: -4 }}>{formErrors.old_price}</p>}
                  <input data-field="discount_percent" placeholder="Discount % — jaise 50" type="number" inputMode="numeric" value={form.discount_percent} onChange={numField('discount_percent', true)} style={{ ...inputStyle, border: formErrors.discount_percent ? '2px solid red' : '1px solid #ddd' }} />
                  {formErrors.discount_percent && <p style={{ color: 'red', fontSize: 12, marginTop: -4 }}>{formErrors.discount_percent}</p>}
                  <input data-field="cost_price" placeholder="Cost Price (Profit ke liye)" type="number" inputMode="numeric" value={form.cost_price} onChange={numField('cost_price', true)} style={{ ...inputStyle, border: formErrors.cost_price ? '2px solid red' : '1px solid #ddd' }} />
                  {formErrors.cost_price && <p style={{ color: 'red', fontSize: 12, marginTop: -4 }}>{formErrors.cost_price}</p>}
                  <input data-field="stock" placeholder="Stock *" type="number" inputMode="numeric" value={form.stock} onChange={numField('stock', false)} style={{ ...inputStyle, border: formErrors.stock ? '2px solid red' : '1px solid #ddd' }} />
                  {formErrors.stock && <p style={{ color: 'red', fontSize: 12, marginTop: -4 }}>{formErrors.stock}</p>}
                  <label style={{ fontSize: 13, fontWeight: 700 }}>Photos — Gallery se upload (4-5) ya URL:</label>
                  <input type="file" accept="image/*" multiple onChange={onGallery} style={{ width: '100%', marginBottom: 8 }} />
                  <input data-field="image_url" placeholder="Photo URL (optional)" type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} style={{ ...inputStyle, border: formErrors.image_url ? '2px solid red' : '1px solid #ddd' }} />
                  {formErrors.image_url && <p style={{ color: 'red', fontSize: 12, marginTop: -4 }}>{formErrors.image_url}</p>}
                  <textarea data-field="description" placeholder="Detail / Description (max 25 words)" value={form.description} onChange={onDesc} style={{ ...inputStyle, border: formErrors.description ? '2px solid red' : '1px solid #ddd' }} />
                  <p style={{ fontSize: 12, color: descWordCount >= 25 ? 'red' : '#666', marginTop: -4 }}>{descWordCount} / 25 words</p>
                  {formErrors.description && <p style={{ color: 'red', fontSize: 12, marginTop: -4 }}>{formErrors.description}</p>}
                  <label><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Show on Home / Landing Page</label>
                  <div style={{ height: 10 }} />
                  <button style={btnRed}>{editingId ? 'Update Product' : 'Add Product'}</button>
                  {editingId && <button type="button" onClick={() => { setForm(emptyForm); setNames(['']); setEditingId(null); }} style={{ ...btnLight, marginLeft: 8 }}>Cancel</button>}
                </form>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
                  <button onClick={() => setView('card')} style={view === 'card' ? btnRed : btnLight}>Card View</button>
                  <button onClick={() => setView('line')} style={view === 'line' ? btnRed : btnLight}>Line View</button>
                  <button onClick={() => setShowTrash(!showTrash)} style={btnLight}>{showTrash ? 'Back to Products' : 'Trash'}</button>
                  <button onClick={() => { setSearch(''); setFilterCat(''); setFilterQuality(''); setFilterStock(''); }} style={btnLight}>Reset Filter</button>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
                  <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} style={{ padding: 10, borderRadius: 10, border: '1px solid #ddd' }}><option value="">All Category</option>{['Engine', 'Brake', 'Wiper', 'Light', 'Filter', 'Suspension', 'Exhaust', 'Battery', 'Wheels', 'Clutch', 'Steering', 'Cooling'].map((c) => <option key={c}>{c}</option>)}</select>
                  <select value={filterQuality} onChange={(e) => setFilterQuality(e.target.value)} style={{ padding: 10, borderRadius: 10, border: '1px solid #ddd' }}><option value="">All Quality</option>{['Genuine', 'OEM', 'China', 'Kabli'].map((c) => <option key={c}>{c}</option>)}</select>
                  <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)} style={{ padding: 10, borderRadius: 10, border: '1px solid #ddd' }}><option value="">All Stock</option><option value="in">In Stock</option><option value="out">Out of Stock</option><option value="low">Low Stock</option></select>
                  <button type="button" onClick={downloadTemplate} style={btnLight}>Download Template</button>
                  <label style={{ fontSize: 13 }}>Bulk Upload (Excel CSV, 500 tak): <input type="file" accept=".csv" onChange={importCSV} /></label>
                  <p style={{ fontSize: 11, color: '#666', width: '100%', margin: 0 }}>CSV header must be exactly: {BULK_HEADER}</p>
                </div>

                <div className={view === 'card' ? 'product-grid' : ''}>
                  {filtered.map((p) => {
                    const isLow = Number(p.stock) <= lowStockThreshold;
                    const actions = (
                      <div className="product-actions">
                        <button type="button" title="Preview" aria-label="Preview" onClick={() => setPreview({ kind: 'product', data: p })} style={iconBtn}>👁</button>
                        <button type="button" title="View Detail" aria-label="View Detail" onClick={() => setDetail(p)} style={iconBtn}>🔎</button>
                        <button type="button" title="Update" aria-label="Update" onClick={() => editProduct(p)} style={{ ...iconBtn, background: '#1a1a1a', color: '#fff', border: '1px solid #1a1a1a' }}>✏️</button>
                        <button type="button" title={p.is_active ? 'Hide' : 'Show'} aria-label={p.is_active ? 'Hide' : 'Show'} onClick={() => toggleHide(p)} style={iconBtnGold}>{p.is_active ? '👁‍🗨' : '👁'}</button>
                        <button type="button" title={p.is_featured ? 'Remove from Home' : 'Show on Home Page'} aria-label={p.is_featured ? 'Remove from Home' : 'Show on Home Page'} onClick={() => toggleFeatured(p)} style={{ ...iconBtn, background: p.is_featured ? RED : '#f0f0f0', color: p.is_featured ? '#fff' : '#000', border: p.is_featured ? `1px solid ${RED}` : '1px solid #e5e5e5' }}>★</button>
                        {showTrash ? <button type="button" title="Restore" aria-label="Restore" onClick={() => restoreTrash(p)} style={iconBtn}>↩️</button> : <button type="button" title="Remove" aria-label="Remove" onClick={() => removeToTrash(p)} style={{ ...iconBtn, background: '#e67e22', color: '#fff', border: '1px solid #e67e22' }}>✕</button>}
                        <button type="button" title="Duplicate" aria-label="Duplicate" onClick={() => duplicateProduct(p)} style={iconBtn}>⧉</button>
                        <button type="button" title="Delete" aria-label="Delete" onClick={() => deleteProduct(p.id)} style={iconBtnRed}>🗑</button>
                      </div>
                    );
                    const photo = (
                      <div className="product-photo">
                        {p.image_url ? <img src={p.image_url} alt={p.name} loading="lazy" /> : <div className="no-photo">📦</div>}
                        {p.discount_percent > 0 && <span className="badge-off">{p.discount_percent}% OFF</span>}
                        {(!p.is_active || isLow) && <span className={`badge-flag ${isLow ? 'low' : ''}`}>{!p.is_active ? 'Hidden' : 'LOW STOCK'}</span>}
                      </div>
                    );
                    const body = (
                      <div className="product-body">
                        <h3 className="product-name" title={p.name}>{p.name}</h3>
                        {p.alternate_names && <p className="product-alt" title={p.alternate_names}>{p.alternate_names}</p>}
                        <p className="product-meta" title={`Part: ${p.part_number} | ${p.brand} ${p.model} ${p.vehicle_year} | VIN: ${p.vin}`}>Part: {p.part_number} | {p.brand} {p.model} {p.vehicle_year}{p.vin ? ` | VIN: ${p.vin}` : ''}</p>
                        <p className="product-price"><b>SAR {p.price}</b>{p.old_price > p.price && <span className="old">SAR {p.old_price}</span>}{p.discount_percent > 0 && <span className="off">{p.discount_percent}% OFF</span>}</p>
                        <p className={`product-stock ${isLow ? 'low' : ''}`}>{isLow ? `Stock: ${p.stock} — LOW STOCK!` : `Stock: ${p.stock} — In Stock`}{p.is_featured ? ' ★ On Home' : ''}</p>
                        {actions}
                      </div>
                    );
                    if (view === 'line') {
                      return (
                        <div key={p.id} className="product-card product-line" style={{ marginBottom: 12, padding: 12 }}>
                          {photo}
                          {body}
                        </div>
                      );
                    }
                    return (
                      <div key={p.id} className="product-card">
                        {photo}
                        {body}
                      </div>
                    );
                  })}
                </div>
                {filtered.length === 0 && <p>No products found.</p>}
              </div>
            )}

            {tab === 'orders' && (
              <div>
                <h3>Orders</h3>
                {orders.length === 0 && <p>Abhi koi order nahi hai.</p>}
                {orders.map((o) => (
                  <div key={o.id} style={{ ...card, marginBottom: 10 }}>
                    <b>{o.order_no}</b> — {o.customer_name} — {o.customer_phone} — Total SAR {o.total}
                    <div style={{ fontSize: 12, color: '#666' }}>{JSON.stringify(o.items)}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      <button onClick={() => setPreview({ kind: 'order', data: o })} style={btnLight}>👁 Preview</button>
                      <a href={waLink(o.customer_phone, `Assalam-o-Alaikum ${o.customer_name}, apka order ${o.order_no} mil gaya hai. Total SAR ${o.total}. Shukriya - AL-SAQR`)} target="_blank" rel="noreferrer" style={{ ...btnRed, background: 'green', textDecoration: 'none' }}>WhatsApp</a>
                      <button onClick={() => deleteOrder(o.id)} style={{ ...btnRed, background: '#c00' }}>🗑 Delete</button>
                      <select value={o.status} onChange={(e) => updateOrderStatus(o.id, e.target.value)} style={{ padding: 10, borderRadius: 10, border: '1px solid #ddd' }}>
                        <option value="new">new</option><option value="confirmed">confirmed</option><option value="packed">packed</option><option value="delivered">delivered</option><option value="cancelled">cancelled</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'requests' && (
              <div style={card}><h3 style={{ marginTop: 0 }}>Part Requests</h3><p style={{ fontSize: 12, color: '#666' }}>Requests come from the messages table (customer name / phone / message). Give a price and make it an order from Orders.</p>{requests.length === 0 ? <p>No part requests yet.</p> : requests.map((r) => <div key={r.id} style={{ padding: '10px 0', borderTop: '1px solid #eee' }}><b>{r.name || r.customer_name}</b> — {r.phone || r.customer_phone}<div style={{ fontSize: 13 }}>{r.message}</div></div>)}</div>
            )}
            {tab === 'reviews' && (
              <div>
                <div style={{ ...card, marginBottom: 12 }}><h3 style={{ marginTop: 0 }}>Reviews — Pin / Approve / Delete</h3><p style={{ fontSize: 12, color: '#666' }}>Only verified buyers. Approve to show on the website. Pinned review shows first and on the Home Page.</p></div>
                {reviews.length === 0 ? <div style={card}><p>No reviews yet. Reviews are loaded from the Supabase reviews table (name, stars, message, photo, approved, pinned, featured).</p></div> : reviews.map((r) => (
                  <div key={r.id} style={{ ...card, marginBottom: 10, borderLeft: r.pinned ? '4px solid #d4af37' : '4px solid #eee' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <div><b>{r.customer_name || r.name}</b> <span style={{ color: '#d4af37' }}>{'★'.repeat(Number(r.stars || r.rating) || 0)}{'☆'.repeat(5 - (Number(r.stars || r.rating) || 0))}</span></div>
                      <div style={{ fontSize: 12 }}>{r.approved ? '✓ Approved' : 'Pending'} {r.pinned ? '• 📌 Pinned' : ''} {r.featured ? '• On Home Page' : ''} {r.verified_purchase ? '• ✓ Verified Purchase' : ''}</div>
                    </div>
                    <p style={{ fontSize: 13 }}>{r.message}</p>
                    {r.photo_url && <img src={r.photo_url} alt="review" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10 }} />}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                      <button onClick={() => setPreview({ kind: 'review', data: r })} style={btnLight}>👁 Preview</button>
                      <button onClick={() => updateReview(r.id, { approved: !r.approved })} style={btnRed}>{r.approved ? 'Hide' : 'Approve'}</button>
                      <button onClick={() => updateReview(r.id, { pinned: !r.pinned })} style={btnRed}>{r.pinned ? 'Unpin' : '📌 Pin'}</button>
                      <button onClick={() => updateReview(r.id, { featured: !r.featured })} style={btnLight}>{r.featured ? 'Remove from Home' : 'Show on Home'}</button>
                      <button onClick={() => deleteReview(r.id)} style={{ ...btnRed, background: '#c00' }}>🗑 Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {tab === 'coupons' && (
              <div>
                <form onSubmit={saveCoupon} style={{ ...card, marginBottom: 12 }}>
                  <h3 style={{ marginTop: 0 }}>Add Coupon</h3>
                  <input placeholder="Code — jaise ALSAQR10" value={couponForm.code} onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })} required style={inputStyle} />
                  <input placeholder="Discount %" type="number" value={couponForm.discount_percent} onChange={(e) => setCouponForm({ ...couponForm, discount_percent: e.target.value })} style={inputStyle} />
                  <input placeholder="Max uses" type="number" value={couponForm.max_uses} onChange={(e) => setCouponForm({ ...couponForm, max_uses: e.target.value })} style={inputStyle} />
                  <button style={btnRed}>Add Coupon</button>
                </form>
                {coupons.length === 0 ? <p>No coupons yet.</p> : coupons.map((c) => <div key={c.id} style={{ ...card, marginBottom: 8, display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}><span><b>{c.code}</b> — {c.discount_percent}% OFF</span><span style={{ display: 'flex', gap: 6 }}><button onClick={() => setPreview({ kind: 'coupon', data: c })} style={btnLight}>👁 Preview</button><button onClick={() => deleteCoupon(c.id)} style={{ ...btnRed, background: '#c00' }}>🗑 Delete</button></span></div>)}
              </div>
            )}
            {tab === 'carts' && (
              <div style={card}><h3 style={{ marginTop: 0 }}>Abandoned Cart</h3><p>No abandoned carts are saved in Supabase yet. When a cart is saved, it will appear here with a WhatsApp button and the message: “Aapne ye part cart me chora tha, abhi order karein” — button-only, admin sends it manually.</p></div>
            )}
            {tab === 'banners' && (
              <div>
                <form onSubmit={saveBanner} style={{ ...card, marginBottom: 12 }}>
                  <h3 style={{ marginTop: 0 }}>Add Banner</h3>
                  <input placeholder="Title" value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} required style={inputStyle} />
                  <input placeholder="Subtitle / Offer" value={bannerForm.subtitle} onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })} style={inputStyle} />
                  <input placeholder="Image URL" value={bannerForm.image_url} onChange={(e) => setBannerForm({ ...bannerForm, image_url: e.target.value })} style={inputStyle} />
                  <button style={btnRed}>Add Banner</button>
                </form>
                {banners.map((b) => <div key={b.id} style={{ ...card, marginBottom: 8, display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}><span><b>{b.title}</b> — {b.subtitle}</span><span style={{ display: 'flex', gap: 6 }}><button onClick={() => setPreview({ kind: 'banner', data: b })} style={btnLight}>👁 Preview</button><button onClick={() => deleteBanner(b.id)} style={{ ...btnRed, background: '#c00' }}>🗑 Delete</button></span></div>)}
              </div>
            )}
            {tab === 'profit' && (
              <div style={card}>
                <h3 style={{ marginTop: 0 }}>Profit Report</h3>
                <p>Total sales: <b>SAR {totalSale}</b> • Orders: {orders.length}</p>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead><tr style={{ textAlign: 'left', color: '#666' }}><th>Product</th><th>Price</th><th>Cost</th><th>Profit / unit</th></tr></thead>
                  <tbody>{products.filter((p) => !p.is_trashed).slice(0, 20).map((p) => <tr key={p.id} style={{ borderTop: '1px solid #eee' }}><td>{p.name}</td><td>SAR {p.price}</td><td>SAR {p.cost_price || 0}</td><td>SAR {(Number(p.price) || 0) - (Number(p.cost_price) || 0)}</td></tr>)}</tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      </div>

      {preview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16, zIndex: 100 }}>
          <div style={{ background: '#fff', color: '#000', maxWidth: 560, width: '100%', maxHeight: '90vh', overflow: 'auto', padding: 20, borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h3 style={{ margin: 0 }}>Website Preview</h3><button onClick={() => setPreview(null)} style={btnRed}>Close ✕</button></div>
            <p style={{ fontSize: 12, color: '#666' }}>This is how customers will see it on the website.</p>
            {preview.kind === 'product' && (() => { const p = preview.data; return (<div>
              {p.image_url && <img src={p.image_url} alt={p.name} style={{ width: '100%', borderRadius: 12 }} />}
              <h2>{p.name}</h2><p style={{ fontSize: 12, color: '#666' }}>{p.alternate_names}</p>
              <p><b>SAR {p.price}</b>{p.old_price > p.price && <span style={{ textDecoration: 'line-through', marginLeft: 8, color: '#999' }}>SAR {p.old_price}</span>}{p.discount_percent > 0 && <span style={{ background: 'green', color: '#fff', padding: '4px 10px', borderRadius: 20, marginLeft: 8 }}>{p.discount_percent}% OFF</span>}</p>
              <p>Stock: {p.stock} • {p.brand} {p.model} {p.vehicle_year} • {p.category} • {p.quality}</p><p>{p.description}</p>
            </div>); })()}
            {preview.kind === 'review' && (() => { const r = preview.data; const stars = Number(r.stars || r.rating) || 0; return (<div>
              <p><b>{r.customer_name || r.name}</b> <span style={{ color: '#d4af37' }}>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span></p>
              <p>{r.verified_purchase ? '✓ Verified Purchase' : ''} {r.pinned ? '• 📌 Pinned' : ''} {r.featured ? '• On Home Page' : ''} {r.approved ? '' : '• Pending — not live yet'}</p>
              {r.photo_url && <img src={r.photo_url} alt="review" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12 }} />}
              <p>{r.message}</p>
            </div>); })()}
            {preview.kind === 'banner' && (() => { const b = preview.data; return (<div>
              {b.image_url && <img src={b.image_url} alt={b.title} style={{ width: '100%', borderRadius: 12 }} />}
              <h2>{b.title}</h2><p>{b.subtitle}</p>{b.coupon_code && <p>Coupon: <b>{b.coupon_code}</b></p>}<p style={{ fontSize: 12, color: '#666' }}>{b.is_visible === false ? 'Banner is OFF — hidden on the home page.' : 'Banner is ON — shown on the home page.'}</p>
            </div>); })()}
            {preview.kind === 'coupon' && (() => { const c = preview.data; return (<div style={{ border: '2px dashed #8b0b0b', borderRadius: 16, padding: 20, textAlign: 'center' }}>
              <h2 style={{ color: '#8b0b0b', margin: 0 }}>{c.code}</h2><p style={{ fontSize: 24, fontWeight: 900 }}>{c.discount_percent}% OFF</p>
              <p>{c.valid_from || ''} {c.valid_until ? '— ' + c.valid_until : ''} {c.max_uses ? '• Max uses: ' + c.max_uses : ''}</p>
            </div>); })()}
            {preview.kind === 'order' && (() => { const o = preview.data; const items = Array.isArray(o.items) ? o.items : []; return (<div>
              <h2>Order {o.order_no}</h2><p><b>{o.customer_name}</b> — {o.customer_phone}</p><p>{o.customer_address || ''}</p>
              <p>Status: <b>{o.status}</b> • Date: {String(o.created_at || '').slice(0, 10)}</p>
              {items.map((it, i) => <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '1px solid #eee' }}><span>{it.name} × {it.qty || 1}</span><span>SAR {(Number(it.price) || 0) * (Number(it.qty) || 1)}</span></div>)}
              <p><b>Total: SAR {o.total}</b></p>
            </div>); })()}
          </div>
        </div>
      )}
      {detail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16, zIndex: 99 }}>
          <div style={{ background: '#fff', color: '#000', maxWidth: 600, width: '100%', maxHeight: '90vh', overflow: 'auto', padding: 20, borderRadius: 16 }}>
            <button onClick={() => setDetail(null)} style={btnRed}>Close ✕</button>
            <h2>{detail.name}</h2>
            {detail.image_url && <img src={detail.image_url} alt={detail.name} style={{ width: '100%', borderRadius: 12 }} />}
            <p><b>Names:</b> {detail.alternate_names}</p>
            <p><b>Part Number:</b> {detail.part_number} | <b>VIN:</b> {detail.vin}</p>
            <p><b>Vehicle:</b> {detail.brand} {detail.model} {detail.vehicle_year}</p>
            <p><b>Category:</b> {detail.category} | <b>Quality:</b> {detail.quality}</p>
            <p><b>Price:</b> SAR {detail.price} {detail.old_price > detail.price && <span style={{ textDecoration: 'line-through' }}>SAR {detail.old_price}</span>} {detail.discount_percent > 0 && <span style={{ background: 'green', color: '#fff', padding: '4px 10px', borderRadius: 20 }}>{detail.discount_percent}% OFF</span>}</p>
            <p><b>Stock:</b> {detail.stock} | <b>Cost:</b> SAR {detail.cost_price}</p>
            <p><b>Detail:</b> {detail.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}