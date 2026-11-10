import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import {
  FaCompactDisc, FaFilter, FaCog, FaCogs, FaWind, FaLightbulb, FaCarBattery, FaLifeRing, FaTint,
  FaWhatsapp, FaTimes, FaPlus, FaMinus, FaArrowRight
} from 'react-icons/fa';

// ---------------------------------------------------------------------------
// AL-SAQAR HOME — SHOP BY CATEGORY + BEST SELLERS
// Save as src/Components/HomeShopSections.jsx
// In App.jsx Home, after <div id="state"><State /></div> add:
//   <HomeShopSections />
// ---------------------------------------------------------------------------
// Best Sellers = Admin me jin products par "Show on Home / Landing Page"
// (★ button ya form checkbox, is_featured) lagaya hai. Admin ka full
// ikhtiyar hai: ★ lagao to Home par aayega, hatao to nahi aayega.
// Agar 6 se kam featured hain to baaki latest products se poora hota hai.
// Category click -> /shop khulta hai us category ke saath (Shop.jsx
// location.state.category parhta hai). Card click -> detail popup
// (Shop jaisa: photo, specs, qty, Add to Cart, Place Order, WhatsApp).
// ---------------------------------------------------------------------------

const WHATSAPP_NUMBER = '966502748270';

// Cloudinary photo ko chota + compress karke do (f_auto, q_auto) taake
// image jaldi load ho. Non-Cloudinary URL waisi hi rehti hai.
const optImg = (url, w = 800) => {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  if (url.includes('/upload/f_auto')) return url;
  return String(url).replace('/upload/', `/upload/f_auto,q_auto,w_${w}/`);
};

const partNo = (p) => p.part_number || p.partNumber || p.oem_number || p.oemNumber || '';
const oemNo = (p) => p.oem_number || p.oemNumber || p.part_number || p.partNumber || '';
const imgOf = (p) => p.image_url || (typeof p.images === 'string' && p.images ? p.images.split(',')[0].trim() : '') || p.image || '';
const yearOf = (p) => p.vehicle_year || p.year || '';
const imagesOf = (p) => {
  const list = [];
  if (p.image_url) list.push(p.image_url);
  if (typeof p.images === 'string' && p.images) p.images.split(',').map((s) => s.trim()).filter(Boolean).forEach((u) => { if (!list.includes(u)) list.push(u); });
  if (p.image && !list.includes(p.image)) list.push(p.image);
  return list;
};

const CATEGORIES = [
  { value: 'Brake', label: 'BRAKES', icon: <FaCompactDisc />, image: '/categories/brakes.jpg' },
  { value: 'Wiper', label: 'WIPERS', icon: <FaTint />, image: '/categories/wiper.webp' },
  { value: 'Filter', label: 'FILTERS', icon: <FaFilter />, image: '/categories/filters.webp' },
  { value: 'Suspension', label: 'SUSPENSION', icon: <FaCog />, image: '/categories/suspension.jpg' },
  { value: 'Engine', label: 'ENGINE PARTS', icon: <FaCogs />, image: '/categories/engine.jpg' },
  { value: 'Exhaust', label: 'EXHAUST', icon: <FaWind />, image: '/categories/exhaust.jpg' },
];

const HomeShopSections = ({ only } = {}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [detailQty, setDetailQty] = useState(1);
  const [detailImg, setDetailImg] = useState(0);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('alsaqr_cart') || '[]'); } catch (e) { return []; }
  });

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.from('products').select('*').eq('is_active', true).order('name');
      if (!error) {
        const rows = (data || []).filter((r) => !r.is_trashed).map((r) => ({ ...r, partNumber: partNo(r), image: imgOf(r) }));
        setProducts(rows);
      }
      setLoading(false);
    };
    load();
  }, []);

  // Escape closes the detail popup
  useEffect(() => {
    if (!detail) return;
    const onKey = (e) => { if (e.key === 'Escape') setDetail(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [detail]);

  const counts = useMemo(() => {
    const map = {};
    products.forEach((p) => { map[p.category] = (map[p.category] || 0) + 1; });
    return map;
  }, [products]);

  // Best Sellers: featured first, then latest to fill 12 (2 lines x 6)
  const bestSellers = useMemo(() => {
    const featured = products.filter((p) => p.is_featured);
    if (featured.length >= 12) return featured.slice(0, 12);
    const rest = [...products].sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')))
      .filter((p) => !p.is_featured);
    return [...featured, ...rest].slice(0, 12);
  }, [products]);

  const cartQty = (id) => (cart.find((i) => i.id === id) || {}).qty || 0;

  const saveCart = (newCart) => {
    setCart(newCart);
    try {
      const snapshot = newCart.map((item) => {
        const p = products.find((x) => x.id === item.id);
        return p
          ? { id: item.id, qty: item.qty, name: p.name, part_number: partNo(p), brand: p.brand, model: p.model, price: Number(p.price) || 0, image: p.image || '' }
          : { id: item.id, qty: item.qty };
      });
      localStorage.setItem('alsaqr_cart', JSON.stringify(snapshot));
    } catch (e) {}
  };

  const addToCart = (id, qty = 1) => {
    const prev = cart.find((i) => i.id === id);
    saveCart(prev ? cart.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i)) : [...cart, { id, qty }]);
  };

  const openDetail = (p) => { setDetail(p); setDetailQty(1); setDetailImg(0); };

  const buyNowDetail = () => {
    if (!detail) return;
    addToCart(detail.id, detailQty);
    setDetail(null);
    navigate('/order-place');
  };

  const detailWhatsApp = () => {
    if (!detail) return;
    const msg = `Hello Al-Saqar, I need more details about this part: ${detail.name} (Part: ${partNo(detail)}, OEM: ${oemNo(detail)}, Brand: ${detail.brand || '-'}, Model: ${detail.model || '-'}) — SAR ${detail.price}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const goCategory = (cat) => navigate('/shop', { state: { category: cat } });

  // ---------- SHOP PREVIEW (sidebar search + 6 cards) ----------
  const [pvNum, setPvNum] = useState('');
  const [pvName, setPvName] = useState('');
  const [pvBM, setPvBM] = useState('');
  const [pvModel, setPvModel] = useState('');
  const [pvMin, setPvMin] = useState('');
  const [pvMax, setPvMax] = useState('');
  const [pvStock, setPvStock] = useState('all');
  const [pvCat, setPvCat] = useState('');
  const [pvBrand, setPvBrand] = useState('');
  const PV_BRANDS = ['Isuzu', 'Mitsubishi', 'Changan', 'MG'];
  const pvModels = useMemo(() => {
    const list = products.filter((prod) => !pvBrand || prod.brand === pvBrand).map((prod) => prod.model).filter(Boolean);
    return [...new Set(list)].sort();
  }, [products, pvBrand]);
  // Sidebar fields filter the 6 preview cards live; GO takes the same
  // filters to the full Shop page.
  const previewProducts = useMemo(() => {
    const qn = pvNum.trim().toLowerCase();
    const qm = pvName.trim().toLowerCase();
    const qb = pvBM.trim().toLowerCase();
    const mn = pvMin === '' ? 0 : Number(pvMin);
    const mx = pvMax === '' ? Infinity : Number(pvMax);
    return bestSellers.filter((prod) => {
      if (qn && !(String(partNo(prod)).toLowerCase().includes(qn) || String(oemNo(prod)).toLowerCase().includes(qn))) return false;
      if (qm && !(String(prod.name || '').toLowerCase().includes(qm) || String(prod.alternate_names || '').toLowerCase().includes(qm))) return false;
      if (qb && !(String(prod.brand || '').toLowerCase().includes(qb) || String(prod.model || '').toLowerCase().includes(qb))) return false;
      if (pvCat && prod.category !== pvCat) return false;
      if (pvBrand && prod.brand !== pvBrand) return false;
      if (pvModel && prod.model !== pvModel) return false;
      const pr = Number(prod.price) || 0;
      if (pr < mn || pr > mx) return false;
      if (pvStock === 'available' && prod.stock <= 0) return false;
      return true;
    }).slice(0, 6);
  }, [bestSellers, pvNum, pvName, pvBM, pvCat, pvBrand, pvModel, pvMin, pvMax, pvStock]);
  const resetPreview = () => { setPvNum(''); setPvName(''); setPvBM(''); setPvCat(''); setPvBrand(''); setPvModel(''); setPvMin(''); setPvMax(''); setPvStock('all'); };
  const goShopWithFilters = () => navigate('/shop', { state: { searchNum: pvNum.trim(), searchName: pvName.trim(), searchBM: pvBM.trim(), search: pvNum.trim(), category: pvCat || undefined, brand: pvBrand || undefined, model: pvModel || undefined, priceMin: pvMin === '' ? undefined : Number(pvMin), priceMax: pvMax === '' ? undefined : Number(pvMax) } });

  return (
    <section style={{ width: '100%', background: '#fff', color: '#111111', fontFamily: "'Segoe UI', Tahoma, sans-serif", boxSizing: 'border-box' }}>
      <style>{`
        .hs-cat-circle { width: 120px; height: 120px; border-radius: 50%; background: #f5f5f5; display: flex; align-items: center; justify-content: center; font-size: 44px; color: #111; margin: 0 auto 12px; cursor: pointer; transition: all 0.2s ease; overflow: hidden; }
        @media (max-width: 700px) { .hs-cat-grid { display: flex !important; overflow-x: auto !important; gap: 14px !important; padding-bottom: 8px !important; } .hs-cat-grid > div { flex: 0 0 auto !important; width: 92px !important; } .hs-cat-circle { width: 88px !important; height: 88px !important; } .hs-best-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        .hs-cat-circle:hover { background: #8b0b0b; color: #fff; transform: translateY(-3px); }
        .hs-pv-layout { display: flex; gap: 20px; align-items: flex-start; }
        .hs-pv-sidebar { width: 260px; flex-shrink: 0; background: #fff; border: 1px solid #e5e5e5; border-radius: 12px; padding: 18px; box-sizing: border-box; position: sticky; top: 20px; }
        .hs-pv-field { width: 100%; padding: 10px 12px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 13px; box-sizing: border-box; margin-bottom: 10px; background: #fff; }
        .hs-pv-field:focus { outline: none; border-color: #8b0b0b; }
        .hs-pv-grid { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; min-width: 0; }
        .hs-pv-topsearch { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
        .hs-pv-topsearch input { width: 100%; padding: 12px 14px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
        .hs-pv-topsearch input:focus { outline: none; border-color: #8b0b0b; }
        @media (max-width: 700px) { .hs-pv-layout { flex-direction: column; } .hs-pv-sidebar { width: 100%; position: static; } .hs-pv-grid { grid-template-columns: repeat(2, 1fr) !important; width: 100%; } .hs-pv-topsearch { grid-template-columns: 1fr !important; } }
        .hs-card { background: #fff; border: 1px solid #e5e5e5; border-radius: 4px; overflow: hidden; display: flex; flex-direction: column; cursor: pointer; }
        .hs-card-photo { background: #fff; overflow: hidden; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; }
        .hs-card-photo img { width: 100%; height: 100%; object-fit: contain; display: block; padding: 12px; box-sizing: border-box; }
        .hs-card-name { margin: 0; font-size: 13px; line-height: 1.4; font-weight: 400; color: #333; text-align: left; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 36px; }
        .hs-card-meta { font-size: 11px; color: #999; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hs-card-bottom { display: flex; justify-content: space-between; align-items: center; gap: 8px; background: #f2f2f2; margin: 10px -12px 0; padding: 8px 10px; }
        .hs-add-btn { background: #000; color: #fff; border: none; padding: 7px 12px; border-radius: 4px; font-weight: 700; cursor: pointer; font-size: 12px; white-space: nowrap; }
        .hs-add-btn:hover { background: #8b0b0b; }
        .hs-add-btn:disabled { background: #ccc; color: #666; cursor: not-allowed; }
        .hs-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 99999; display: flex; align-items: flex-start; justify-content: center; padding: 40px 16px 20px; box-sizing: border-box; overflow-y: auto; }
        .hs-detail-body { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .hs-modal { background-image: linear-gradient(rgba(255,255,255,0.96), rgba(255,255,255,0.98)), url("/faq.jpg"); background-size: cover; background-position: center; width: min(900px, 94vw); height: auto; border-radius: 12px; padding: 12px 20px 16px; box-sizing: border-box; margin: 0 auto; position: relative; text-align: left; display: flex; flex-direction: column; }
        @media (max-width: 700px) { .hs-modal { width: 100vw; max-width: 100vw; border-radius: 0; padding: 12px 16px 20px; max-height: calc(100dvh - 70px); overflow-y: auto; } .hs-detail-body { grid-template-columns: 1fr !important; } }
      `}</style>

      {(!only || only === 'preview') && (
      <>
      {/* ---------- SHOP PREVIEW: sidebar search + 6 cards ---------- */}
      <div style={{ padding: '40px 5% 10px', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#111' }}>SHOP SPARE PARTS</h2>
          <button onClick={() => navigate('/shop')} style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#8b0b0b' }}>
            VIEW ALL <FaArrowRight />
          </button>
        </div>
        <div className="hs-pv-topsearch">
          <input value={pvNum} onChange={(e) => setPvNum(e.target.value)} placeholder="Search by Part Number / OEM" />
          <input value={pvName} onChange={(e) => setPvName(e.target.value)} placeholder="Search by Name" />
          <input value={pvBM} onChange={(e) => setPvBM(e.target.value)} placeholder="Search by Brand / Model" />
        </div>
        <div className="hs-pv-layout">
          <aside className="hs-pv-sidebar">
            <h4 style={{ margin: '0 0 12px', fontSize: '15px', fontWeight: '800', color: '#111' }}>Filters</h4>
            <select className="hs-pv-field" value={pvCat} onChange={(e) => setPvCat(e.target.value)}>
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <select className="hs-pv-field" value={pvBrand} onChange={(e) => { setPvBrand(e.target.value); setPvModel(''); }}>
              <option value="">All Brands</option>
              {PV_BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <select className="hs-pv-field" value={pvModel} onChange={(e) => setPvModel(e.target.value)}>
              <option value="">All Models</option>
              {pvModels.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <input className="hs-pv-field" style={{ marginBottom: 0 }} type="number" min="0" value={pvMin} onChange={(e) => setPvMin(e.target.value)} placeholder="Min SAR" />
              <input className="hs-pv-field" style={{ marginBottom: 0 }} type="number" min="0" value={pvMax} onChange={(e) => setPvMax(e.target.value)} placeholder="Max SAR" />
            </div>
            <select className="hs-pv-field" value={pvStock} onChange={(e) => setPvStock(e.target.value)}>
              <option value="all">All Stock</option>
              <option value="available">Available Only</option>
            </select>
            <button onClick={goShopWithFilters} style={{ width: '100%', background: '#8b0b0b', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '14px', textTransform: 'uppercase' }}>
              Search in Shop
            </button>
            <button onClick={resetPreview} style={{ width: '100%', background: '#fff', color: '#111', border: '2px solid #e5e7eb', padding: '10px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '13px', textTransform: 'uppercase', marginTop: '8px' }}>
              ✕ Reset Filters
            </button>
            <p style={{ fontSize: '12px', color: '#888', margin: '10px 0 0', lineHeight: 1.5 }}>Tip: upar search likho ya sidebar filters lagao — neeche wale 6 cards turant filter ho jayenge.</p>
          </aside>
          <div className="hs-pv-grid">
            {loading ? (
              <p style={{ color: '#666' }}>Loading products...</p>
            ) : previewProducts.length === 0 ? (
              <p style={{ color: '#666', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '30px', gridColumn: '1 / -1', textAlign: 'center' }}>
                No products match — Admin me product add karo ya search saaf karo.
              </p>
            ) : previewProducts.map((prod) => (
              <div key={prod.id} className="hs-card" onClick={() => openDetail(prod)}>
                <div className="hs-card-photo">
                  {prod.image ? <img src={optImg(prod.image, 600)} alt={prod.name} loading="lazy" /> : <span style={{ fontSize: '40px', color: '#e5e7eb' }}>⚙️</span>}
                </div>
                <div style={{ padding: '10px 12px 0', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <h3 className="hs-card-name">{prod.name}</h3>
                  <div className="hs-card-meta">{prod.brand}{prod.model ? ` ${prod.model}` : ''}{partNo(prod) ? ` • ${partNo(prod)}` : ''} • {prod.stock > 0 ? `In stock (${prod.stock})` : 'Out of stock'}</div>
                  <div className="hs-card-bottom">
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#111', whiteSpace: 'nowrap' }}>SAR {prod.price}</span>
                    <button className="hs-add-btn" disabled={prod.stock <= 0} onClick={(e) => { e.stopPropagation(); addToCart(prod.id, 1); }}>
                      {cartQty(prod.id) > 0 ? `In Cart (${cartQty(prod.id)})` : 'Add to cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      </>
      )}
      {(!only || only === 'best') && (
      <>
      {/* ---------- BEST SELLERS ---------- */}
      <div style={{ padding: '30px 5% 50px', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#111' }}>BEST SELLERS</h2>
          <button onClick={() => navigate('/shop')} style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#111' }}>
            VIEW ALL <FaArrowRight />
          </button>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Loading products...</p>
        ) : bestSellers.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '30px' }}>
            No products yet — Admin me product add karo, aur ★ (Show on Home) se Best Sellers choose karo.
          </p>
        ) : (
          <div className="hs-best-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '16px' }}>
            {bestSellers.map((p) => (
              <div key={p.id} className="hs-card" onClick={() => openDetail(p)}>
                <div className="hs-card-photo">
                  {p.image ? <img src={optImg(p.image, 600)} alt={p.name} loading="lazy" /> : <span style={{ fontSize: '40px', color: '#e5e7eb' }}>⚙️</span>}
                </div>
                <div style={{ padding: '10px 12px 0', display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                  <h3 className="hs-card-name">{p.name}</h3>
                  <div className="hs-card-meta">{p.brand}{p.model ? ` ${p.model}` : ''}{partNo(p) ? ` • ${partNo(p)}` : ''} • {p.stock > 0 ? `In stock (${p.stock})` : 'Out of stock'}</div>
                  <div className="hs-card-bottom">
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#111', whiteSpace: 'nowrap' }}>SAR {p.price}</span>
                    <button className="hs-add-btn" disabled={p.stock <= 0} onClick={(e) => { e.stopPropagation(); addToCart(p.id, 1); }}>
                      {cartQty(p.id) > 0 ? `In Cart (${cartQty(p.id)})` : 'Add to cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      </>
      )}
      {/* ---------- DETAIL POPUP (Shop jaisa) ---------- */}
      {detail && (
        <div className="hs-overlay" onClick={() => setDetail(null)}>
          <div className="hs-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 0 8px' }}>
              <button onClick={() => setDetail(null)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaTimes /></button>
            </div>
            <div className="hs-detail-body">
              <div>
                <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '8px', aspectRatio: '4 / 3', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {imagesOf(detail)[detailImg] ? <img src={optImg(imagesOf(detail)[detailImg], 900)} alt={detail.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px', boxSizing: 'border-box' }} /> : <span style={{ fontSize: '48px', color: '#e5e7eb' }}>⚙️</span>}
                </div>
                {imagesOf(detail).length > 1 && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                    {imagesOf(detail).map((u, i) => (
                      <img key={i} src={optImg(u, 150)} alt="" loading="lazy" onClick={() => setDetailImg(i)} style={{ width: '64px', height: '64px', objectFit: 'contain', border: i === detailImg ? '2px solid #8b0b0b' : '2px solid #e5e7eb', borderRadius: '8px', padding: '4px', cursor: 'pointer', background: '#fff' }} />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <h2 style={{ margin: '0 0 4px', fontSize: '20px', lineHeight: 1.3, color: '#111111' }}>{detail.name}</h2>
                {detail.alternate_names && <p style={{ fontSize: '13px', color: '#666', margin: '0 0 8px' }}>Also known as: {detail.alternate_names}</p>}
                <div style={{ fontSize: '13px', color: '#333', margin: '0 0 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
                  <div><b style={{ color: '#666' }}>Part Number:</b> {partNo(detail) || '-'}</div>
                  <div><b style={{ color: '#666' }}>OEM Number:</b> {oemNo(detail) || '-'}</div>
                  <div><b style={{ color: '#666' }}>Brand:</b> {detail.brand || '-'}</div>
                  <div><b style={{ color: '#666' }}>Model:</b> {detail.model || '-'}</div>
                  <div><b style={{ color: '#666' }}>Year:</b> {yearOf(detail) || '-'}</div>
                  <div><b style={{ color: '#666' }}>VIN / Chassis:</b> {detail.vin || '-'}</div>
                  <div><b style={{ color: '#666' }}>Category:</b> {detail.category || '-'}</div>
                  <div><b style={{ color: '#666' }}>Quality:</b> {detail.quality || '-'}</div>
                </div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: detail.stock > 0 ? '#16a34a' : '#dc2626', margin: '0 0 6px' }}>
                  {detail.stock > 0 ? `In stock (${detail.stock})` : 'Out of stock'}
                </p>
                {detail.description && <p style={{ fontSize: '14px', color: '#444', lineHeight: 1.6, margin: '0 0 10px' }}>{detail.description}</p>}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', margin: '0 0 10px', flexWrap: 'wrap' }}>
                  <b style={{ fontSize: '24px' }}>SAR {detail.price}</b>
                  {detail.old_price > detail.price && <span style={{ fontSize: '16px', color: '#999', textDecoration: 'line-through' }}>SAR {detail.old_price}</span>}
                  {detail.discount_percent > 0 && <span style={{ background: '#16a34a', color: '#fff', fontSize: '12px', fontWeight: 800, padding: '4px 10px', borderRadius: '20px' }}>{detail.discount_percent}% OFF</span>}
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                    <button onClick={() => setDetailQty((q) => Math.max(1, q - 1))} style={{ width: '38px', height: '40px', border: 'none', background: '#fff', cursor: 'pointer' }}><FaMinus /></button>
                    <span style={{ minWidth: '36px', textAlign: 'center', fontWeight: 800 }}>{detailQty}</span>
                    <button onClick={() => setDetailQty((q) => Math.min(detail.stock || 99, q + 1))} style={{ width: '38px', height: '40px', border: 'none', background: '#fff', cursor: 'pointer' }}><FaPlus /></button>
                  </div>
                  <button onClick={() => addToCart(detail.id, detailQty)} disabled={detail.stock <= 0} style={{ flex: 1, minWidth: '180px', background: '#8b0b0b', color: '#fff', border: '2px solid #8b0b0b', padding: '11px 18px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer', fontSize: '14px', textTransform: 'uppercase' }}>
                    {detail.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
                <button onClick={buyNowDetail} disabled={detail.stock <= 0} style={{ width: '100%', background: '#000', color: '#fff', border: '2px solid #000', padding: '12px 18px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', fontSize: '14px', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Place Order — Payment
                </button>
                <p style={{ fontSize: '11px', color: '#666', textAlign: 'center', margin: '0 0 8px' }}>Payment: COD or Bank Transfer — choose on the next page</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={detailWhatsApp} style={{ flex: 1, background: '#25D366', color: '#fff', border: 'none', padding: '12px 8px', borderRadius: '10px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', textTransform: 'uppercase' }}>
                    <FaWhatsapp size={20} /> Ask on WhatsApp
                  </button>
                  <button onClick={() => setDetail(null)} style={{ flex: 1, background: '#fff', color: '#111', border: '2px solid #e5e7eb', padding: '12px 8px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '13px', textTransform: 'uppercase' }}>
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export const ShopPreview = () => <HomeShopSections only="preview" />;
export const BestSellers = () => <HomeShopSections only="best" />;

export default HomeShopSections;
