import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import {
  FaShoppingCart,
  FaWhatsapp,
  FaTimes,
  FaPlus,
  FaMinus,
  FaTrash,
  FaFilter,
  FaRedo,
  FaCog,
  FaTh,
  FaList,
} from 'react-icons/fa';

// ---------------------------------------------------------------------------
// AL-SAQAR SHOP — screenshot-style cards, sidebar unchanged
// ---------------------------------------------------------------------------
// How to use:
//  1. Save this file as src/Components/Shop.jsx
//  2. In App.jsx:  import Shop from './Components/Shop';
//     and a route:  <Route path="/shop" element={<><Navbar /><Shop /><Footer /></>} />
//  3. In Navbar.jsx add a Shop link:  { name: 'SHOP', path: '/shop' }
//     (in both the desktop and mobile menu arrays)
//  4. Replace the sample products below with your real products when ready.
//     For a real photo, put its URL in the `image` field, e.g. "/parts/brake-pad.jpg".
//     If `image` is empty, the card shows a clean empty photo area
//     (no logo, no watermark, no "REAL PHOTOS ON REQUEST" text).
//  NOTE: Prices/stock below are SAMPLE values — replace with real Excel data
//  before taking real orders. Checkout is WhatsApp only (no gateway key needed).
// ---------------------------------------------------------------------------

const WHATSAPP_NUMBER = '966502748270';

// Products now come from Supabase, not from a hardcoded list.
// Admin adds a product -> it is saved in Supabase -> Shop reads it here.
const FALLBACK_PRODUCTS = [];

const YEARS = ['2025', '2024', '2023', '2022', '2021', '2020'];
const BRANDS = ['Isuzu', 'Mitsubishi', 'Changan', 'MG'];

// Screenshot feature: dashes and spaces are ignored in part-number search,
// so "8-97941501-0" is found by "8979415010" and vice versa.
const normalize = (s) => (s || '').toLowerCase().replace(/[-\s]/g, '');
// FIX 1 — FIELD NAME MISMATCH: Admin/Supabase save snake_case
// (part_number, image_url, vehicle_year, oem_number, alternate_names).
// Shop used to read camelCase p.partNumber / p.image, which are always
// undefined on Supabase rows, so cards showed no part number and no photo.
// Every read below goes through these helpers (snake_case first,
// camelCase as fallback for any old hardcoded rows).
const partNo = (p) => p.part_number || p.partNumber || p.oem_number || p.oemNumber || '';
const oemNo = (p) => p.oem_number || p.oemNumber || p.part_number || p.partNumber || '';
const imgOf = (p) => p.image_url || (typeof p.images === 'string' && p.images ? p.images.split(',')[0].trim() : '') || p.image || '';
const yearOf = (p) => p.vehicle_year || p.year || '';
const altNamesOf = (p) => Array.isArray(p.alternate_names) ? p.alternate_names.join(' ') : (p.alternate_names || '');
// Detail popup: all photos for the gallery (image_url + images list, deduped).
const imagesOf = (p) => {
  const list = [];
  if (Array.isArray(p.images)) list.push(...p.images);
  else if (typeof p.images === 'string' && p.images.trim()) list.push(...p.images.split(',').map((x) => x.trim()).filter(Boolean));
  if (p.image_url) list.push(p.image_url);
  if (p.image) list.push(p.image);
  return [...new Set(list.filter(Boolean))];
};
const discountOf = (p) => {
  const price = Number(p.price) || 0, old = Number(p.old_price) || 0;
  if (old > price && old > 0) return Math.round(((old - price) / old) * 100);
  return Number(p.discount_percent) || 0;
};

const Shop = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isArabic = i18n.language === 'ar';
  const [search, setSearch] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchBM, setSearchBM] = useState('');
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState('all');
  // Home se aaye to uske filters pehle se lagao: category (Shop by
  // Category), ya Shop Preview sidebar se search / category / brand
  useEffect(() => {
    const st = location.state || {};
    if (st.category) setSelectedCats([st.category]);
    if (st.searchNum) setSearch(st.searchNum);
    else if (st.search) setSearch(st.search);
    if (st.searchName) setSearchName(st.searchName);
    if (st.searchBM) setSearchBM(st.searchBM);
    if (st.model) { setVehicleModel(st.model); setVehicleApplied((prev) => ({ year: (prev && prev.year) || '', brand: (prev && prev.brand) || st.brand || '', model: st.model })); }
    if (st.priceMin !== undefined && st.priceMin !== null) { setPriceMin(Number(st.priceMin)); setMinInput(String(st.priceMin)); }
    if (st.priceMax !== undefined && st.priceMax !== null) { setPriceMax(Number(st.priceMax)); setMaxInput(String(st.priceMax)); }
    if (st.brand) { setVehicleBrand(st.brand); setVehicleApplied({ year: '', brand: st.brand, model: '' }); }
  }, []);
  const [minInput, setMinInput] = useState('');
  const [maxInput, setMaxInput] = useState('');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1500);
  // FIX 2 — dynamic price ceiling (see loadProducts): defaults to 1500
  // only until products load, then becomes the max price in the data.
  const [priceCeil, setPriceCeil] = useState(1500);
  const [stockFilter, setStockFilter] = useState('available');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleApplied, setVehicleApplied] = useState(null);
  const [sort, setSort] = useState('latest');
  const [pageSize, setPageSize] = useState(12);
  const [viewMode, setViewMode] = useState('grid');
  const [cart, setCart] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('alsaqr_cart') || '[]');
      return Array.isArray(saved) ? saved : [];
    } catch (e) { return []; }
  });
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  // Cart item names: truncated to 1 line by default, expandable per item.
  const [expandedCartNames, setExpandedCartNames] = useState({});
  const [mobileFilters, setMobileFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Detail popup: selected product, quantity, gallery photo index.
  const [detail, setDetail] = useState(null);
  const [detailQty, setDetailQty] = useState(1);
  const [detailImg, setDetailImg] = useState(0);
  // Detail popup scroll refs: on open, scroll the OVERLAY back to the
  // top (the modal box itself has NO scroller) and lock the page behind
  // it (body overflow hidden) so the navbar cannot cover the popup.
  const detailOverlayRef = useRef(null);
  const detailModalRef = useRef(null);
  useEffect(() => {
    if (!detail) return;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => {
      if (detailOverlayRef.current) detailOverlayRef.current.scrollTop = 0;
      window.scrollTo(0, 0);
    }, 0);
    return () => { clearTimeout(t); document.body.style.overflow = ''; };
  }, [detail]);

  // Cart drawer: lock the page behind it while open, Escape closes it.
  useEffect(() => {
    if (!cartOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') setCartOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [cartOpen]);

  const openDetail = (p) => { setDetail(p); setDetailQty(1); setDetailImg(0); };
  const closeDetail = () => setDetail(null);
  // Escape key closes the detail popup.
  useEffect(() => {
    if (!detail) return;
    const onKey = (e) => { if (e.key === 'Escape') setDetail(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [detail]);

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) {
        console.error('Supabase products error:', error.message);
        setProducts(FALLBACK_PRODUCTS);
      } else {
        // Normalise once at load so the rest of the file can use the
        // camelCase fields it already expects, and drop trashed rows
        // (Admin "Remove" sets is_trashed=true but leaves is_active=true,
        // so the Supabase .eq('is_active', true) above does NOT hide them).
        const rows = (data || [])
          .filter((r) => !r.is_trashed)
          .map((r) => ({ ...r, partNumber: partNo(r), image: imgOf(r), vehicle_year: yearOf(r), year: yearOf(r) }));
        setProducts(rows);
        // FIX 2: priceMax used to stay at 1500 forever, so any Admin
        // product over SAR 1500 (e.g. SAR 43278) was filtered out and
        // never shown. Now the ceiling follows the loaded data.
        const maxPrice = rows.reduce((m, r) => Math.max(m, Number(r.price) || 0), 0);
        const ceil = Math.max(1500, Math.ceil(maxPrice / 10) * 10);
        setPriceCeil(ceil);
        setPriceMax((prev) => (prev === 1500 ? ceil : prev));
      }
      setLoading(false);
    };
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const map = {};
    products.forEach((p) => { map[p.category] = (map[p.category] || 0) + 1; });
    return Object.keys(map).map((name) => ({ name, count: map[name] }));
  }, [products]);

  const SHOP_BRANDS = ['Isuzu', 'Mitsubishi', 'Changan', 'MG', 'Hyundai'];
  const brandCounts = useMemo(() => {
    const map = {};
    products.forEach((p) => { if (p.brand) map[p.brand] = (map[p.brand] || 0) + 1; });
    return map;
  }, [products]);

  const modelsForBrand = useMemo(() => {
    const list = products.filter((p) => !vehicleBrand || p.brand === vehicleBrand).map((p) => p.model);
    return [...new Set(list)];
  }, [vehicleBrand, products]);

  const filtered = useMemo(() => {
    const q = normalize(search.trim());
    let list = products.filter((p) => {
      // FIX 5 — search also checks alternate_names, part_number and
      // oem_number (all snake_case in Supabase), not just name/brand/model.
      if (q && !(normalize(p.name).includes(q) || normalize(partNo(p)).includes(q) || normalize(oemNo(p)).includes(q) || normalize(altNamesOf(p)).includes(q) || normalize(p.brand).includes(q) || normalize(p.model).includes(q) || normalize(yearOf(p)).includes(q))) return false;
      if (selectedCats.length > 0 && !selectedCats.includes(p.category)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
      if (searchName.trim() && !(normalize(p.name).includes(normalize(searchName.trim())) || normalize(altNamesOf(p)).includes(normalize(searchName.trim())))) return false;
      if (searchBM.trim() && !(normalize(p.brand).includes(normalize(searchBM.trim())) || normalize(p.model).includes(normalize(searchBM.trim())))) return false;
      if ((Number(p.price) || 0) < priceMin || (Number(p.price) || 0) > priceMax) return false;
      if (stockFilter === 'available' && p.stock <= 0) return false;
      // Year is kept for the WhatsApp order note only — sample products
      // have no year-fitment data yet, so Year does not filter products.
      if (vehicleApplied && vehicleApplied.brand && p.brand !== vehicleApplied.brand) return false;
      if (vehicleApplied && vehicleApplied.model && p.model !== vehicleApplied.model) return false;
      return true;
    });
    if (sort === 'latest') list = [...list].sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [search, searchName, searchBM, selectedCats, selectedBrands, priceMin, priceMax, stockFilter, vehicleApplied, sort, products]);

  // Screenshot top bar: "Show: 12 / 24 / 48 Items" — only that many shown.
  const visible = useMemo(() => filtered.slice(0, pageSize), [filtered, pageSize]);

  const filtersActive = search.trim() !== '' || searchName.trim() !== '' || searchBM.trim() !== '' || selectedCats.length > 0 || selectedBrands.length > 0 || priceMin !== 0 || priceMax !== priceCeil || stockFilter !== 'available' || vehicleApplied !== null;

  // FIX 3 — explain an empty result instead of a bare "No products".
  // stockFilter='available' (default) hides stock-0 products and the
  // price ceiling hides expensive ones; tell the user exactly how many.
  const hiddenByPrice = products.filter((p) => (Number(p.price) || 0) > priceMax).length;
  const hiddenOutOfStock = products.filter((p) => (Number(p.stock) || 0) <= 0).length;
  const hiddenByStockFilter = stockFilter === 'available' ? hiddenOutOfStock : 0;

  // Persist the cart so /order-place can read it (key 'alsaqr_cart').
  // Enriched snapshot (name / part_number / price) so OrderPlace does not
  // depend on the products list being loaded there.
  useEffect(() => {
    try {
      const snapshot = cart.map((item) => {
        const p = products.find((x) => x.id === item.id);
        return p
          ? { id: item.id, qty: item.qty, name: p.name, part_number: partNo(p), brand: p.brand, model: p.model, price: Number(p.price) || 0, image: p.image || '' }
          : { id: item.id, qty: item.qty };
      });
      localStorage.setItem('alsaqr_cart', JSON.stringify(snapshot));
    } catch (e) {}
  }, [cart, products]);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => {
    const p = products.find((x) => x.id === item.id);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);

  const toggleCat = (cat) => {
    setSelectedCats((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  };

  const toggleBrand = (b) => {
    setSelectedBrands((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);
  };

  // Price range quick options: SAR 100 se kam, 100-500, 500-1000, 1000 se zyada
  const applyPriceRange = (r) => {
    setPriceRange(r);
    const ranges = { all: [0, priceCeil], under100: [0, 100], r100_500: [100, 500], r500_1000: [500, 1000], over1000: [1000, priceCeil] };
    const [mn, mx] = ranges[r] || ranges.all;
    setMinInput(mn === 0 ? '' : String(mn));
    setMaxInput(mx === priceCeil ? '' : String(mx));
    setPriceMin(mn);
    setPriceMax(mx);
  };

  const applyPrice = () => {
    const min = minInput === '' ? 0 : Number(minInput);
    const max = maxInput === '' ? priceCeil : Number(maxInput);
    setPriceMin(min);
    setPriceMax(max);
  };

  const applyVehicle = () => {
    if (!vehicleBrand && !vehicleModel && !vehicleYear) return;
    setVehicleApplied({ year: vehicleYear, brand: vehicleBrand, model: vehicleModel });
  };

  const clearVehicle = () => {
    setVehicleYear(''); setVehicleBrand(''); setVehicleModel(''); setVehicleApplied(null);
  };

  const clearAll = () => {
    setSearch(''); setSearchName(''); setSearchBM(''); setSelectedCats([]); setSelectedBrands([]); setPriceRange('all'); setMinInput(''); setMaxInput('');
    setPriceMin(0); setPriceMax(priceCeil); setStockFilter('available'); clearVehicle(); setSort('latest'); setPageSize(12);
  };

  const addToCart = (id) => {
    setCart((prev) => {
      const found = prev.find((i) => i.id === id);
      if (found) return prev.map((i) => i.id === id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id, qty: 1 }];
    });
    setCartOpen(true);
  };

  // Detail popup: add the chosen quantity, then open the cart drawer.
  const addDetailToCart = () => {
    if (!detail) return;
    const qty = Math.max(1, detailQty);
    setCart((prev) => {
      const found = prev.find((i) => i.id === detail.id);
      if (found) return prev.map((i) => i.id === detail.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { id: detail.id, qty }];
    });
    setDetail(null);
    setCartOpen(true);
  };
  // Detail popup "Place Order": add the chosen qty to the cart, save the
  // cart to localStorage SYNCHRONOUSLY (so /order-place reads the new item
  // on mount), then go straight to /order-place where the customer chooses
  // payment (COD / Bank Transfer) and places the order. Ordering is NOT on
  // WhatsApp — WhatsApp below is only for asking detail about the part.
  const buyNowDetail = () => {
    if (!detail) return;
    const qty = Math.max(1, detailQty);
    const found = cart.find((i) => i.id === detail.id);
    const newCart = found
      ? cart.map((i) => i.id === detail.id ? { ...i, qty: i.qty + qty } : i)
      : [...cart, { id: detail.id, qty }];
    setCart(newCart);
    try {
      const snapshot = newCart.map((item) => {
        const p = item.id === detail.id ? detail : products.find((x) => x.id === item.id);
        return p
          ? { id: item.id, qty: item.qty, name: p.name, part_number: partNo(p), brand: p.brand, model: p.model, price: Number(p.price) || 0, image: p.image || '' }
          : { id: item.id, qty: item.qty };
      });
      localStorage.setItem('alsaqr_cart', JSON.stringify(snapshot));
    } catch (e) {}
    setDetail(null);
    navigate('/order-place');
  };
  // Detail popup WhatsApp: customer asks for more information, in English only.
  const detailWhatsApp = () => {
    if (!detail) return;
    const msg = `Hello, I want more information about this part: ${detail.name} (Part No: ${partNo(detail)}, Brand: ${detail.brand || ''} ${detail.model || ''}). Price: SAR ${detail.price}. Please share details.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const changeQty = (id, delta) => {
    setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };
  // FIX: cart "Show more" called toggleCartName but it was never defined,
  // so clicking it crashed. Now it toggles the expanded name.
  const toggleCartName = (id) => {
    setExpandedCartNames((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  // Place Order now NAVIGATES to the separate /order-place page
  // (OrderPlace.jsx) — the order form + payment live there, not in the drawer.
  const closeCart = () => { setCartOpen(false); };
  const goToOrderPlace = () => { setCartOpen(false); navigate('/order-place'); };
  // Note: ordering is NOT WhatsApp — Place Order saves to Supabase (see
  // on /order-place (OrderPlace.jsx). WhatsApp is only "Ask on WhatsApp" in the detail
  // popup, for asking detail about a part.

  return (
    <div className="shop-page" dir={isArabic ? 'rtl' : 'ltr'}>
      <style>{`
        .shop-page { background: #fff; color: #111; font-family: 'Segoe UI', Tahoma, sans-serif; padding: 30px 5% 60px; box-sizing: border-box; }
        .shop-top h2 { margin: 0 0 6px; font-size: 28px; font-weight: 900; text-transform: uppercase; }
        .shop-top p { margin: 0 0 18px; color: #555; }
        .shop-search { width: 100%; max-width: 520px; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; box-sizing: border-box; margin-bottom: 6px; }
        .shop-search:focus { outline: none; border-color: #8b0b0b; }
        .shop-search-note { font-size: 12px; color: #888; margin-bottom: 18px; }
        .shop-vehicle { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; display: flex; flex-wrap: wrap; gap: 10px; align-items: end; margin-bottom: 20px; }
        .shop-vehicle h3 { width: 100%; margin: 0; font-size: 16px; }
        .shop-vehicle label { font-size: 12px; font-weight: 700; color: #555; display: block; margin-bottom: 4px; }
        .shop-vehicle select { padding: 10px; border: 2px solid #e5e7eb; border-radius: 8px; min-width: 150px; font-size: 14px; background: #fff; }
        .shop-btn-red { background: #8b0b0b; color: #fff; border: 2px solid #8b0b0b; padding: 10px 22px; border-radius: 8px; font-weight: 800; cursor: pointer; text-transform: uppercase; font-size: 13px; }
        .shop-btn-red:hover { background: #fff; color: #8b0b0b; }
        .shop-btn-ghost { background: #fff; color: #111; border: 2px solid #e5e7eb; padding: 10px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; }
        .shop-applied { width: 100%; font-size: 13px; color: #555; }
        .shop-layout { display: flex; gap: 24px; align-items: flex-start; }
        .shop-sidebar { width: 250px; flex-shrink: 0; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px; position: sticky; top: 140px; }
        .shop-sidebar h4 { margin: 20px 0 10px; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; }
        .shop-sidebar h4:first-child { margin-top: 0; }
        .shop-check { display: flex; justify-content: space-between; font-size: 14px; padding: 5px 0; cursor: pointer; }
        .shop-check input { margin-right: 8px; accent-color: #8b0b0b; }
        .shop-price-row { display: flex; gap: 8px; align-items: center; margin-top: 8px; }
        .shop-price-row input { width: 100%; padding: 8px; border: 2px solid #e5e7eb; border-radius: 6px; box-sizing: border-box; }
        .shop-price-row input[type="range"] { padding: 0; }
        .shop-main { flex: 1; min-width: 0; }
        .shop-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; padding: 14px 4px; margin-bottom: 18px; border-bottom: 1px solid #eee; }
        .shop-toolbar-left { font-size: 15px; color: #333; }
        .shop-toolbar-right { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
        .shop-toolbar-right label { font-size: 14px; color: #666; display: flex; align-items: center; gap: 6px; }
        .shop-toolbar-right select { padding: 8px 10px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; font-size: 14px; font-weight: 600; color: #111; cursor: pointer; }
        .shop-view-toggle { display: flex; gap: 6px; }
        .shop-view-toggle button { width: 38px; height: 38px; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; color: #666; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 15px; }
        .shop-view-toggle button.active { background: #f3f4f6; color: #111; border-color: #d1d5db; }
        .shop-clear-btn { background: #fff; border: 1px solid #e5e7eb; border-radius: 20px; padding: 6px 14px; font-size: 13px; font-weight: 700; cursor: pointer; }
        .shop-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .shop-grid.list { grid-template-columns: 1fr; }
        /* NEW reference style (simple, clean): white card, thin light-grey
           border, almost-square 4px corners, no big shadow. Photo on top,
           centred on white, whole product visible. Name small grey-black,
           2 lines. Bottom row: price left, black "Add to cart" right. */
        .shop-card { background: #fff; border: 1px solid #e5e5e5; border-radius: 4px; overflow: hidden; display: flex; flex-direction: column; }
        .shop-card-photo { position: relative; background: #fff; overflow: hidden; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; }
        .shop-card-photo img { width: 100%; height: 100%; object-fit: contain; display: block; padding: 12px; box-sizing: border-box; }
        .shop-card-photo .no-photo { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 40px; color: #e5e7eb; }
        .shop-card-info { padding: 10px 12px 0; display: flex; flex-direction: column; gap: 4px; flex: 1; }
        .shop-card-name { margin: 0; font-size: 13px; line-height: 1.4; font-weight: 400; color: #333; text-align: left; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 36px; }
        .shop-card-meta { font-size: 11px; color: #999; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .shop-card-bottom { display: flex; justify-content: space-between; align-items: center; gap: 8px; background: #f2f2f2; margin: 10px -12px 0; padding: 8px 10px; }
        .shop-card-price { font-size: 14px; font-weight: 800; color: #111; white-space: nowrap; }
        .shop-add-btn { background: #000; color: #fff; border: none; padding: 7px 12px; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 12px; white-space: nowrap; }
        .shop-add-btn:hover { background: #8b0b0b; color: #fff; }
        .shop-add-btn:disabled { background: #ccc; color: #666; cursor: not-allowed; }
        .shop-grid.list .shop-card { flex-direction: row; gap: 0; align-items: stretch; }
        .shop-grid.list .shop-card-photo { width: 220px; min-width: 220px; border-right: 1px solid #e5e5e5; }
        .shop-grid.list .shop-card-info { padding-top: 10px; flex: 1; }
        .shop-grid.list .shop-card-name { min-height: 0; }
        .shop-empty { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 40px; text-align: center; color: #555; }
        .shop-filters-btn { display: none; margin-bottom: 14px; }
        /* Product Detail Popup — CORRECTION: NO inner scroller on the
           popup itself. The real cause was the site navbar covering the
           popup, so the overlay sits ABOVE the navbar (z-index 99999)
           and the box starts BELOW it (70px top padding). The overlay
           is the only scroll container (whole-page scroll if content
           is long); the modal box itself has NO overflow / NO max-height
           scroller. Content is a 2-column grid (photo left, details
           right) so it fits on screen. */
        .shop-detail-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 99999; display: flex; align-items: flex-start; justify-content: center; padding: 40px 16px 20px; box-sizing: border-box; overflow-y: auto; }
        .shop-detail-modal { background-image: linear-gradient(rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.98)), url("/faq.jpg"); background-size: cover; background-position: center; width: min(900px, 94vw); max-width: 94vw; height: auto; border-radius: 12px; padding: 12px 20px 16px; box-sizing: border-box; margin: 0 auto; position: relative; text-align: left; flex-shrink: 0; display: flex; flex-direction: column; }
        .shop-detail-closebar { display: flex; justify-content: flex-end; background: rgba(255,255,255,0.97); padding: 0 0 8px; flex-shrink: 0; }
        .shop-detail-body { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; flex: 1; min-height: 0; align-items: stretch; }
        .shop-detail-left { display: flex; flex-direction: column; min-height: 0; }
        .shop-detail-close { position: sticky; top: 12px; width: 36px; height: 36px; border-radius: 50%; border: 1px solid #e5e7eb; background: #fff; color: #111; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 11; flex-shrink: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
        .shop-detail-close:hover { background: #8b0b0b; color: #fff; border-color: #8b0b0b; }
        .shop-detail-photo { width: 100%; flex: 1; min-height: 0; background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .shop-detail-photo img { width: 100%; height: 100%; object-fit: contain; padding: 12px; box-sizing: border-box; }
        .shop-detail-photo .no-photo { font-size: 48px; color: #e5e7eb; }
        .shop-detail-thumbs { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; flex-shrink: 0; }
        .shop-detail-thumbs img { width: 64px; height: 64px; object-fit: contain; border: 2px solid #e5e7eb; border-radius: 8px; padding: 4px; box-sizing: border-box; cursor: pointer; background: #fff; }
        .shop-detail-thumbs img.active { border-color: #8b0b0b; }
        .shop-detail-info { display: flex; flex-direction: column; min-height: 0; }
        .shop-detail-info h2 { margin: 0 0 4px; font-size: 20px; line-height: 1.3; }
        .shop-detail-alt { font-size: 13px; color: #666; margin: 0 0 8px; }
        .shop-detail-stars { color: #f59e0b; font-size: 15px; margin: 0 0 10px; letter-spacing: 2px; }
        .shop-detail-specs { font-size: 13px; color: #333; margin: 0 0 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 4px 12px; }
        .shop-detail-specs b { color: #666; font-weight: 600; }
        .shop-detail-stock { font-size: 13px; font-weight: 700; color: #16a34a; margin: 0 0 6px; }
        .shop-detail-stock.out { color: #dc2626; }
        /* FIXED description slot: exactly 72px (3 lines) whether the
           description is 1 line, 5 lines, or empty — longer text is
           clamped to 3 lines so it can never push the buttons down. */
        .shop-detail-desc { font-size: 14px; color: #444; line-height: 1.6; margin: 0 0 10px; height: 44px; min-height: 44px; max-height: 44px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; flex-shrink: 0; }
        .shop-detail-price { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; margin: 0 0 10px; flex-shrink: 0; }
        /* Buttons pinned at the bottom of the fixed-height popup:
           margin-top auto absorbs any slack, so they sit at the exact
           same vertical position for every product. */
        .shop-detail-actions { margin-top: auto; flex-shrink: 0; }
        .shop-detail-price b { font-size: 24px; color: #111; }
        .shop-detail-price .old { font-size: 16px; color: #999; text-decoration: line-through; }
        .shop-detail-price .off { background: #16a34a; color: #fff; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 20px; }
        .shop-detail-buy { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 8px; }
        .shop-detail-qty { display: flex; align-items: center; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
        .shop-detail-qty button { width: 38px; height: 40px; border: none; background: #fff; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .shop-detail-qty span { min-width: 36px; text-align: center; font-weight: 800; }
        .shop-detail-add { flex: 1; min-width: 180px; background: #8b0b0b; color: #fff; border: 2px solid #8b0b0b; padding: 11px 18px; border-radius: 8px; font-weight: 800; cursor: pointer; font-size: 14px; text-transform: uppercase; }
        .shop-detail-add:hover { background: #fff; color: #8b0b0b; }
        .shop-detail-add:disabled { background: #ccc; border-color: #ccc; color: #666; cursor: not-allowed; }
        .shop-detail-wa { flex: 1; background: #25D366; color: #fff; border: none; padding: 12px 8px; border-radius: 10px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; text-transform: uppercase; font-size: 13px; white-space: nowrap; }
        .shop-detail-place { width: 100%; background: #000; color: #fff; border: 2px solid #000; padding: 12px 18px; border-radius: 10px; font-weight: 900; cursor: pointer; font-size: 14px; text-transform: uppercase; margin-bottom: 4px; }
        .shop-detail-place:hover { background: #8b0b0b; border-color: #8b0b0b; }
        .shop-detail-place:disabled { background: #ccc; border-color: #ccc; color: #666; cursor: not-allowed; }
        .shop-detail-paynote { font-size: 11px; color: #666; text-align: center; margin: 0 0 8px; }
        .shop-detail-row2 { display: flex; gap: 8px; }
        .shop-detail-continue { flex: 1; background: #fff; color: #111; border: 2px solid #e5e7eb; padding: 12px 8px; border-radius: 10px; font-weight: 800; cursor: pointer; font-size: 13px; text-transform: uppercase; white-space: nowrap; }
        .shop-detail-continue:hover { border-color: #8b0b0b; color: #8b0b0b; }
        .shop-cart-fab { position: fixed; right: 20px; bottom: 20px; z-index: 1000; background: #8b0b0b; color: #fff; border: none; border-radius: 50px; padding: 14px 20px; font-weight: 800; cursor: pointer; display: flex; gap: 8px; align-items: center; box-shadow: 0 10px 25px rgba(0,0,0,0.25); }
        /* Cart Drawer — CORRECTION: its top was also hidden behind the
           site navbar, like the detail popup. Overlay sits ABOVE the
           navbar (z-index 99999) and the panel starts BELOW it
           (70px top on desktop). Panel is a flex column: sticky header
           on top, scrollable items in the middle, sticky footer at the
           bottom (Total + WhatsApp + note + Continue) always visible. */
        .shop-drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 99999; display: flex; justify-content: flex-end; align-items: flex-start; }
        .shop-drawer { background: #fff; width: 380px; max-width: 92vw; margin-top: 70px; height: calc(100vh - 70px); height: calc(100dvh - 70px); box-sizing: border-box; display: flex; flex-direction: column; overflow: hidden; }
        .shop-drawer-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 20px 12px; border-bottom: 1px solid #eee; flex-shrink: 0; background: #fff; }
        .shop-drawer-header h3 { margin: 0; font-size: 18px; }
        .shop-drawer-body { flex: 1; min-height: 0; overflow-y: auto; padding: 4px 20px; }
        .shop-drawer-body > p { margin: 16px 0; }
        .shop-drawer-footer { flex-shrink: 0; background: #fff; border-top: 1px solid #eee; padding: 14px 20px 20px; }
        .shop-drawer-item { display: flex; gap: 10px; border-bottom: 1px solid #eee; padding: 12px 0; }
        .shop-drawer-item b { font-size: 14px; }
        .shop-drawer-item small { color: #666; }
        .shop-qty { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
        .shop-qty button { width: 28px; height: 28px; border: 1px solid #ddd; background: #fff; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .shop-drawer-total { display: flex; justify-content: space-between; font-weight: 900; font-size: 18px; margin: 0 0 12px; }
        .shop-wa-btn { width: 100%; background: #25D366; color: #fff; border: none; padding: 14px; border-radius: 10px; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; text-transform: uppercase; }
        /* Cart item name: 1 line truncated by default, expandable. */
        .shop-cart-name { font-size: 14px; font-weight: 700; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4; }
        .shop-cart-name.expanded { display: block; -webkit-line-clamp: unset; }
        .shop-cart-more { background: none; border: none; color: #8b0b0b; font-size: 12px; font-weight: 700; cursor: pointer; padding: 2px 0 0; }
        /* Cart footer: two clear options side by side. */
        .shop-checkout-btns { display: flex; gap: 10px; }
        .shop-checkout-btns .shop-btn-ghost { flex: 1; }
        .shop-place-btn { flex: 1; background: #8b0b0b; color: #fff; border: 2px solid #8b0b0b; padding: 12px 10px; border-radius: 8px; font-weight: 800; cursor: pointer; font-size: 13px; text-transform: uppercase; }
        .shop-place-btn:hover { background: #fff; color: #8b0b0b; }
        .shop-place-btn:disabled { background: #ccc; border-color: #ccc; color: #666; cursor: not-allowed; }
        @media (max-width: 1100px) { .shop-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 900px) {
          .shop-layout { flex-direction: column; }
          .shop-sidebar { display: none; width: 100%; position: static; }
          .shop-sidebar.open { display: block; }
          .shop-filters-btn { display: inline-flex; }
          .shop-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 700px) {
          /* Mobile detail popup: stacked, full width, starts below the
             navbar, NO inner scroller — long content scrolls with the
             overlay (whole page), not inside the box. */
          .shop-detail-overlay { padding: 70px 0 0; align-items: flex-start; }
          .shop-detail-modal { width: 100vw; max-width: 100vw; border-radius: 0; padding: 0 16px 20px; height: auto; max-height: calc(100dvh - 70px); overflow-y: auto; }
          .shop-detail-closebar { margin: 0 -16px; padding-right: 16px; padding-left: 16px; }
          .shop-detail-body { grid-template-columns: 1fr; flex: none; }
          .shop-detail-photo { flex: none; aspect-ratio: 1 / 1; }
          .shop-detail-desc { height: auto; max-height: none; -webkit-line-clamp: unset; }
          /* Mobile cart drawer: full screen from the very top, footer
             still pinned at the bottom. */
          .shop-drawer { width: 100vw; max-width: 100vw; margin-top: 0; height: 100vh; height: 100dvh; }
        }
        @media (max-width: 560px) { .shop-grid { grid-template-columns: 1fr; } .shop-vehicle select { min-width: 0; width: 100%; } .shop-grid.list .shop-card { flex-direction: column; } .shop-grid.list .shop-card-photo { width: 100%; min-width: 0; } }
        /* --- RTL (Arabic) fixes: LTR-hardcoded alignments flipped --- */
        .shop-page[dir="rtl"] .shop-top { text-align: right; }
        .shop-page[dir="rtl"] .shop-search { text-align: right; }
        .shop-page[dir="rtl"] .shop-search-note { text-align: right; }
        .shop-page[dir="rtl"] .shop-card-name { text-align: right; }
        .shop-page[dir="rtl"] .shop-card-meta { text-align: right; }
        .shop-page[dir="rtl"] .shop-detail-modal { text-align: right; }
        .shop-page[dir="rtl"] .shop-detail-info { text-align: right; }
        .shop-page[dir="rtl"] .shop-detail-specs { text-align: right; }
        .shop-page[dir="rtl"] .shop-help { text-align: right; }
        .shop-page[dir="rtl"] .shop-check input { margin-right: 0; margin-left: 8px; }
        .shop-page[dir="rtl"] .shop-grid.list .shop-card-photo { border-right: none; border-left: 1px solid #e5e5e5; }
        .shop-page[dir="rtl"] .shop-detail-closebar { justify-content: flex-start; }
        .shop-page[dir="rtl"] .shop-cart-fab { right: auto; left: 20px; }
        .shop-page[dir="rtl"] .shop-drawer-overlay { justify-content: flex-start; }
      `}</style>

      <div className="shop-top">
        <h2>{t('shopTitle', 'Shop Spare Parts')}</h2>
        <p>{t('shopSubtitle', 'Genuine parts for Isuzu, Mitsubishi, Changan and MG — Makkah, Saudi Arabia')}</p>
        <input
          className="shop-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('shopSearchPlaceholder', 'Part number, OEM number or vehicle')}
        />
        <div className="shop-search-note">{t('shopSearchNote', 'Search by part number, OEM or cross-reference number, part name, brand or vehicle. Dashes and spaces are ignored.')}</div>
      </div>

      <div className="shop-vehicle">
        <h3>{t('shopSelectVehicle', 'Select Your Vehicle')}</h3>
        <div>
          <label>{t('shopYear', 'Year')}</label>
          <select value={vehicleYear} onChange={(e) => setVehicleYear(e.target.value)}>
            <option value="">{t('shopYear', 'Year')}</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label>{t('shopMake', 'Make')}</label>
          <select value={vehicleBrand} onChange={(e) => { setVehicleBrand(e.target.value); setVehicleModel(''); }}>
            <option value="">{t('shopMake', 'Make')}</option>
            {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label>{t('shopModel', 'Model')}</label>
          <select value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)}>
            <option value="">{t('shopModel', 'Model')}</option>
            {modelsForBrand.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <button className="shop-btn-red" onClick={applyVehicle}>{t('shopGo', 'GO')}</button>
        <button className="shop-btn-ghost" onClick={clearVehicle} title="Reset vehicle"><FaRedo /></button>
        {vehicleApplied && (
          <div className="shop-applied">
            {t('shopShowingFor', 'Showing for:')} {vehicleApplied.year || ''} {vehicleApplied.brand || ''} {vehicleApplied.model || ''} — {t('shopShowingForNote', 'Year is only added to the order note, filtering is by Brand/Model.')}
          </div>
        )}
      </div>

      {/* Brand names — Shop se upar: click karo to us brand ke parts dikhenge */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ fontSize: '13px', fontWeight: '800', color: '#111' }}>Shop by Brand:</span>
        <button onClick={() => setSelectedBrands([])} style={{ padding: '8px 16px', borderRadius: '20px', border: selectedBrands.length === 0 ? '2px solid #8b0b0b' : '2px solid #e5e7eb', background: selectedBrands.length === 0 ? '#8b0b0b' : '#fff', color: selectedBrands.length === 0 ? '#fff' : '#111', fontWeight: '800', cursor: 'pointer', fontSize: '13px' }}>All Brands</button>
        {SHOP_BRANDS.map((b) => (
          <button key={b} onClick={() => setSelectedBrands((prev) => prev.includes(b) && prev.length === 1 ? [] : [b])} style={{ padding: '8px 16px', borderRadius: '20px', border: selectedBrands.includes(b) ? '2px solid #8b0b0b' : '2px solid #e5e7eb', background: selectedBrands.includes(b) ? '#8b0b0b' : '#fff', color: selectedBrands.includes(b) ? '#fff' : '#111', fontWeight: '800', cursor: 'pointer', fontSize: '13px' }}>
            {b} ({brandCounts[b] || 0})
          </button>
        ))}
      </div>

      <div className="shop-layout">
        <aside className={mobileFilters ? 'shop-sidebar open' : 'shop-sidebar'}>
          <h4>{t('shopCollections', 'Collections')}</h4>
          {categories.map((c) => (
            <label key={c.name} className="shop-check">
              <span><input type="checkbox" checked={selectedCats.includes(c.name)} onChange={() => toggleCat(c.name)} />{c.name}</span>
              <span>{c.count}</span>
            </label>
          ))}

          <h4>Brands</h4>
          {SHOP_BRANDS.map((b) => (
            <label key={b} className="shop-check">
              <span><input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} />{b}</span>
              <span>{brandCounts[b] || 0}</span>
            </label>
          ))}

          <h4>{t('shopPrice', 'Price')}</h4>
          <div style={{ fontSize: '13px', fontWeight: '800', color: '#111', marginBottom: '10px' }}>SAR {priceMin} <span style={{ color: '#999', fontWeight: '400' }}>to</span> SAR {priceMax}</div>
          <input type="range" min="0" max={priceCeil} step="10" value={maxInput === '' ? priceCeil : Number(maxInput)} onChange={(e) => setMaxInput(e.target.value)} style={{ width: '100%', accentColor: '#8b0b0b' }} />
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '10px' }}>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', border: '2px solid #e5e7eb', borderRadius: '8px', padding: '0 8px', background: '#fff' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#888' }}>SAR</span>
              <input type="number" placeholder="Min" value={minInput} onChange={(e) => setMinInput(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', padding: '10px 6px', fontSize: '13px' }} />
            </label>
            <span style={{ color: '#999' }}>—</span>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', border: '2px solid #e5e7eb', borderRadius: '8px', padding: '0 8px', background: '#fff' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#888' }}>SAR</span>
              <input type="number" placeholder="Max" value={maxInput} onChange={(e) => setMaxInput(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%', padding: '10px 6px', fontSize: '13px' }} />
            </label>
            <button className="shop-btn-red" onClick={applyPrice} style={{ padding: '10px 14px' }}>APPLY</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px' }}>
            {[
              { v: 'all', label: 'All Prices' },
              { v: 'under100', label: 'Under 100' },
              { v: 'r100_500', label: '100 – 500' },
              { v: 'r500_1000', label: '500 – 1000' },
              { v: 'over1000', label: '1000+' },
            ].map((r) => (
              <button key={r.v} onClick={() => applyPriceRange(r.v)} style={{ padding: '8px 6px', borderRadius: '20px', border: priceRange === r.v ? '2px solid #8b0b0b' : '1px solid #e5e7eb', background: priceRange === r.v ? '#8b0b0b' : '#fff', color: priceRange === r.v ? '#fff' : '#333', fontWeight: '700', cursor: 'pointer', fontSize: '12px' }}>
                {r.v === 'all' ? r.label : `SAR ${r.label}`}
              </button>
            ))}
          </div>

          <h4>{t('shopStock', 'Stock')}</h4>
          <label className="shop-check">
            <span><input type="radio" name="stock" checked={stockFilter === 'available'} onChange={() => setStockFilter('available')} />{t('shopAvailable', 'Available')}</span>
            <span>{products.filter((p) => p.stock > 0).length}</span>
          </label>
          <label className="shop-check">
            <span><input type="radio" name="stock" checked={stockFilter === 'all'} onChange={() => setStockFilter('all')} />{t('shopAll', 'All')}</span>
            <span>{products.length}</span>
          </label>

          <button className="shop-btn-ghost" style={{ marginTop: '18px', width: '100%' }} onClick={clearAll}>{t('shopClearAll', 'Clear all filters')}</button>
        </aside>

        <main className="shop-main">
          <button className="shop-btn-ghost shop-filters-btn" onClick={() => setMobileFilters(!mobileFilters)}>
            <FaFilter /> {t('shopFilters', 'Filters')}
          </button>

          <div className="shop-toolbar">
            <span className="shop-toolbar-left">{t('shopShowingAll', 'Showing all')} {filtered.length} {t('shopResults', 'results')}</span>
            <span className="shop-toolbar-right">
              {searchName.trim() !== '' && <button className="shop-clear-btn" onClick={() => setSearchName('')} title="Clear name search">Name: “{searchName.trim()}” ×</button>}
              {searchBM.trim() !== '' && <button className="shop-clear-btn" onClick={() => setSearchBM('')} title="Clear brand/model search">Brand/Model: “{searchBM.trim()}” ×</button>}
              {filtersActive && <button className="shop-clear-btn" onClick={clearAll}>× {t('shopClearFilters', 'Clear filters')}</button>}
              <label>{t('shopSort', 'Sort')}
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="latest">{t('shopSortLatest', 'Sort by latest')}</option>
                  <option value="best">{t('shopSortBest', 'Best Match')}</option>
                  <option value="price-asc">{t('shopSortPriceAsc', 'Price: Low to High')}</option>
                  <option value="price-desc">{t('shopSortPriceDesc', 'Price: High to Low')}</option>
                  <option value="name">{t('shopSortName', 'Name A–Z')}</option>
                </select>
              </label>
              <label>{t('shopShow', 'Show')}
                <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                  <option value={12}>12 {t('shopItems', 'Items')}</option>
                  <option value={24}>24 {t('shopItems', 'Items')}</option>
                  <option value={48}>48 {t('shopItems', 'Items')}</option>
                </select>
              </label>
              <span className="shop-view-toggle">
                <button type="button" className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')} title="Grid view"><FaTh /></button>
                <button type="button" className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')} title="List view"><FaList /></button>
              </span>
            </span>
          </div>

          <div className="shop-help">
            <div>
              <strong>{t('shopNeedHelp', 'Need help?')}</strong>
              <p>{t('shopNeedHelpText', 'Our team is ready to help! Reach out anytime — we are here to make your shopping experience truly easy.')}</p>
            </div>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="shop-btn-red" style={{ textDecoration: 'none' }}>{t('shopGetInTouch', 'Get in touch')}</a>
          </div>

          {loading ? (
            <div className="shop-empty"><p>{t('shopLoading', 'Loading products...')}</p></div>
          ) : filtered.length === 0 ? (
            <div className="shop-empty">
              <p>{t('shopNoMatch', 'No products match your filters.')}</p>
              {products.length === 0 ? (
                <p>{t('shopNoProductsSupabase', 'No products are saved in Supabase yet — add one in Admin and it will appear here.')}</p>
              ) : (
                <p style={{ fontSize: 13 }}>
                  {products.length} product(s) loaded.
                  {hiddenByPrice > 0 ? ` ${hiddenByPrice} hidden because price is over SAR ${priceMax}.` : ''}
                  {hiddenByStockFilter > 0 ? ` ${hiddenByStockFilter} hidden because stock is 0 (Available filter).` : ''}
                  {search.trim() ? ` Search "${search.trim()}" matched nothing — try a part number, OEM number or alternate name.` : ''}
                </p>
              )}
              <button className="shop-btn-red" onClick={clearAll}>{t('shopClearFilters', 'Clear filters')}</button>
            </div>
          ) : (
            <>
            <div className={viewMode === 'list' ? 'shop-grid list' : 'shop-grid'}>
              {visible.map((p) => {
                const inCart = cart.find((i) => i.id === p.id);
                return (
                  <div key={p.id} className="shop-card" onClick={() => openDetail(p)} style={{ cursor: 'pointer' }} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') openDetail(p); }}>
                    <div className="shop-card-photo">
                      {p.image ? (
                        <img src={p.image} alt={p.name} />
                      ) : (
                        <div className="no-photo"><FaCog /></div>
                      )}
                    </div>
                    <div className="shop-card-info">
                      <h3 className="shop-card-name">{p.name}</h3>
                      <div className="shop-card-meta">{p.brand}{p.model ? ` ${p.model}` : ''}{partNo(p) ? ` • ${partNo(p)}` : ''} • {p.stock > 0 ? `${t('shopInStock', 'In stock')} (${p.stock})` : t('shopOutOfStock', 'Out of stock')}</div>
                      <div className="shop-card-bottom">
                        <span className="shop-card-price">SAR {p.price}</span>
                        {inCart ? (
                          <button className="shop-add-btn" onClick={(e) => { e.stopPropagation(); setCartOpen(true); }}>
                            {t('shopInCart', 'In Cart')} ({inCart.qty})
                          </button>
                        ) : (
                          <button className="shop-add-btn" onClick={(e) => { e.stopPropagation(); addToCart(p.id); }} disabled={p.stock <= 0}>
                            {t('shopAddToCart', 'Add to cart')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filtered.length > visible.length && (
              <p style={{ textAlign: 'center', color: '#666', fontSize: 13, marginTop: 16 }}>
                Showing {visible.length} of {filtered.length} results — choose a larger "Show" value above to see more.
              </p>
            )}
            </>
          )}
        </main>
      </div>

      {/* Product Detail Popup — opens when a card is clicked (photo/name/
          price area). Add to Cart on the card does NOT open it. */}
      {detail && (() => {
        const photos = imagesOf(detail);
        const mainPhoto = photos[detailImg] || photos[0] || '';
        const off = discountOf(detail);
        const rating = Number(detail.rating || detail.stars || detail.average_rating) || 0;
        const altNames = Array.isArray(detail.alternate_names) ? detail.alternate_names.filter(Boolean) : (detail.alternate_names ? String(detail.alternate_names).split(',').map((x) => x.trim()).filter(Boolean) : []);
        return (
          <div className="shop-detail-overlay" ref={detailOverlayRef} onClick={closeDetail}>
            <div className="shop-detail-modal" ref={detailModalRef} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={detail.name}>
              <div className="shop-detail-closebar">
                <button className="shop-detail-close" onClick={closeDetail} title="Close"><FaTimes /></button>
              </div>
              <div className="shop-detail-body">
              <div className="shop-detail-left">
                <div className="shop-detail-photo">
                  {mainPhoto ? <img src={mainPhoto} alt={detail.name} /> : <div className="no-photo"><FaCog /></div>}
                </div>
                {photos.length > 1 && (
                  <div className="shop-detail-thumbs">
                    {photos.map((src, i) => (
                      <img key={i} src={src} alt={`${detail.name} photo ${i + 1}`} className={i === detailImg ? 'active' : ''} onClick={() => setDetailImg(i)} />
                    ))}
                  </div>
                )}
              </div>
              <div className="shop-detail-info">
                <h2>{detail.name}</h2>
                {altNames.length > 0 && <p className="shop-detail-alt">{t('shopAlsoKnownAs', 'Also known as:')} {altNames.join(', ')}</p>}
                {rating > 0 && <p className="shop-detail-stars">{'★'.repeat(Math.round(rating))}{'☆'.repeat(Math.max(0, 5 - Math.round(rating)))} {rating} / 5</p>}
                <div className="shop-detail-specs">
                  <div><b>{t('shopPartNumber', 'Part Number:')}</b> {partNo(detail) || '-'}</div>
                  <div><b>{t('shopOemNumber', 'OEM Number:')}</b> {oemNo(detail) || '-'}</div>
                  <div><b>{t('shopBrand', 'Brand:')}</b> {detail.brand || '-'}</div>
                  <div><b>{t('shopModelLabel', 'Model:')}</b> {detail.model || '-'}</div>
                  <div><b>{t('shopYearLabel', 'Year:')}</b> {yearOf(detail) || '-'}</div>
                  <div><b>{t('shopVin', 'VIN / Chassis:')}</b> {detail.vin || '-'}</div>
                  <div><b>{t('shopCategory', 'Category:')}</b> {detail.category || '-'}</div>
                  <div><b>{t('shopQuality', 'Quality:')}</b> {detail.quality || '-'}</div>
                </div>
                <p className={detail.stock > 0 ? 'shop-detail-stock' : 'shop-detail-stock out'}>
                  {detail.stock > 0 ? `${t('shopInStock', 'In stock')} (${detail.stock})` : t('shopOutOfStock', 'Out of stock')}
                </p>
                <p className="shop-detail-desc">{detail.description || ''}</p>
                <div className="shop-detail-price">
                  <b>SAR {detail.price}</b>
                  {Number(detail.old_price) > Number(detail.price) && <span className="old">SAR {detail.old_price}</span>}
                  {off > 0 && <span className="off">{off}% OFF</span>}
                </div>
                <div className="shop-detail-actions">
                <div className="shop-detail-buy">
                  <div className="shop-detail-qty">
                    <button type="button" onClick={() => setDetailQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><FaMinus /></button>
                    <span>{detailQty}</span>
                    <button type="button" onClick={() => setDetailQty((q) => Math.min(Number(detail.stock) || 99, q + 1))} aria-label="Increase quantity"><FaPlus /></button>
                  </div>
                  <button className="shop-detail-add" onClick={addDetailToCart} disabled={detail.stock <= 0}>
                    {detail.stock > 0 ? t('shopAddToCartCap', 'Add to Cart') : t('shopOutOfStock', 'Out of stock')}
                  </button>
                </div>
                <button className="shop-detail-place" onClick={buyNowDetail} disabled={detail.stock <= 0}>
                  {t('shopPlaceOrderPayment', 'Place Order — Payment')}
                </button>
                <p className="shop-detail-paynote">{t('shopPayNote', 'Payment: COD or Bank Transfer — choose on the next page')}</p>
                <div className="shop-detail-row2">
                  <button className="shop-detail-wa" onClick={detailWhatsApp}>
                    <FaWhatsapp size={20} /> {t('shopAskWhatsApp', 'Ask on WhatsApp')}
                  </button>
                  <button className="shop-detail-continue" onClick={closeDetail}>
                    {t('shopContinueShopping', 'Continue Shopping')}
                  </button>
                </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        );
      })()}

      <button className="shop-cart-fab" onClick={() => { setCartOpen(true); }}>
        <FaShoppingCart /> {t('shopCart', 'Cart')} ({cartCount}) — SAR {cartTotal}
      </button>

      {cartOpen && (
        <div className="shop-drawer-overlay" onClick={closeCart}>
          <div className="shop-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="shop-drawer-header">
              <h3>{t('shopYourCart', 'Your Cart')}</h3>
              <button className="shop-btn-ghost" onClick={closeCart}><FaTimes /></button>
            </div>
            <>
                <div className="shop-drawer-body">
                  {cart.length === 0 ? (
                    <p>{t('shopCartEmpty', 'Cart is empty. Add a part to get started.')}</p>
                  ) : (
                    <>
                      {cart.map((item) => {
                        const p = products.find((x) => x.id === item.id);
                        if (!p) return null;
                        const expanded = !!expandedCartNames[item.id];
                        return (
                          <div key={item.id} className="shop-drawer-item">
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className={expanded ? 'shop-cart-name expanded' : 'shop-cart-name'}>{p.name}</div>
                              <button type="button" className="shop-cart-more" onClick={() => toggleCartName(item.id)}>
                                {expanded ? t('shopShowLess', 'Show less') : t('shopShowMore', 'Show more')}
                              </button>
                              <br />
                              <small>{partNo(p)} • {p.brand} {p.model}{yearOf(p) ? ` ${yearOf(p)}` : ''}</small>
                              <div className="shop-qty">
                                <button onClick={() => changeQty(item.id, -1)}><FaMinus /></button>
                                <span>{item.qty}</span>
                                <button onClick={() => changeQty(item.id, 1)}><FaPlus /></button>
                                <button onClick={() => removeFromCart(item.id)} style={{ width: 'auto', padding: '0 8px', color: '#dc2626' }}><FaTrash /></button>
                              </div>
                            </div>
                            <div><b>SAR {p.price * item.qty}</b></div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
                <div className="shop-drawer-footer">
                  {cart.length > 0 && (
                    <>
                      <div className="shop-drawer-total"><span>{t('shopTotal', 'Total')}</span><span>SAR {cartTotal}</span></div>
                      <div className="shop-checkout-btns">
                        <button className="shop-btn-ghost" onClick={closeCart}>{t('shopContinueShopping', 'Continue Shopping')}</button>
                        <button className="shop-place-btn" onClick={goToOrderPlace}>{t('shopPlaceOrder', 'Place Order')}</button>
                      </div>
                      <p style={{ fontSize: '12px', color: '#666', textAlign: 'center', margin: '10px 0 0' }}>{t('shopPlaceOrderNote', 'Place your order — pay in cash on delivery or by bank transfer.')}</p>
                    </>
                  )}
                  {cart.length === 0 && (
                    <button className="shop-btn-ghost" style={{ width: '100%' }} onClick={closeCart}>{t('shopContinueShopping', 'Continue Shopping')}</button>
                  )}
                </div>
              </>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
