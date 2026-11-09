import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaShoppingCart, FaSearch, FaTimes, FaArrowLeft, FaShieldAlt, FaTruck } from 'react-icons/fa';

// Professional Auto Spare Parts Database
const sparePartsDatabase = [
  {
    id: 1,
    name: 'Isuzu NPR / D-Max Genuine Oil Filter',
    brand: 'Isuzu',
    oemNo: '8-98018858-0',
    chassisNo: 'JALNPR75G...',
    category: 'Engine Parts',
    type: 'OEM Genuine',
    price: 120.00,
    vat: 15,
    stock: 'In Stock',
    inStock: true,
    image: '/isuzu.jpg'
  },
  {
    id: 2,
    name: 'Mitsubishi Canter Front Brake Pads Set',
    brand: 'Mitsubishi',
    oemNo: 'MK585933',
    chassisNo: 'FE84-BRAKE',
    category: 'Brake System',
    type: 'OEM Genuine',
    price: 350.00,
    vat: 15,
    stock: 'In Stock',
    inStock: true,
    image: '/mitsubihi.jpg'
  },
  {
    id: 3,
    name: 'MG HS / ZS Headlight Assembly OEM',
    brand: 'MG',
    oemNo: 'MG-77011',
    chassisNo: 'MGSV-LIGHT',
    category: 'Body & Lights',
    type: 'Aftermarket',
    price: 890.00,
    vat: 15,
    stock: 'Low Stock',
    inStock: true,
    image: '/mg.jpg'
  },
  {
    id: 4,
    name: 'Hyundai Mighty Fuel Filter Element',
    brand: 'Hyundai',
    oemNo: '31922-4H001',
    chassisNo: 'HD78-FUEL',
    category: 'Filters',
    type: 'OEM Genuine',
    price: 95.00,
    vat: 15,
    stock: 'In Stock',
    inStock: true,
    image: '/hundai.jpg'
  }
];

export default function ProductListing({ onBackToHome }) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Hide top welcome banner / ticker on this products page
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    const tickerEls = document.querySelectorAll('[id*="ticker"], [class*="ticker"], [class*="banner-top"]');
    tickerEls.forEach(el => el.style.display = 'none');
    return () => {
      tickerEls.forEach(el => el.style.display = '');
    };
  }, []);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPartType, setSelectedPartType] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Cart States
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const brands = ['All', 'Isuzu', 'Mitsubishi', 'MG', 'Hyundai', 'Changan', 'Toyota', 'BMW', 'Audi'];
  const categories = ['All', 'Engine Parts', 'Brake System', 'Body & Lights', 'Filters', 'Suspension'];
  const partTypes = ['All', 'OEM Genuine', 'Aftermarket'];

  // Filtering Engine
  const filteredProducts = sparePartsDatabase.filter((item) => {
    const matchesBrand = selectedBrand === 'All' || item.brand === selectedBrand;
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType = selectedPartType === 'All' || item.type === selectedPartType;
    const matchesPrice = item.price <= maxPrice;
    const matchesStock = !onlyInStock || item.inStock;

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = query === '' ||
      item.name.toLowerCase().includes(query) ||
      item.oemNo.toLowerCase().includes(query) ||
      item.chassisNo.toLowerCase().includes(query) ||
      item.brand.toLowerCase().includes(query);

    return matchesBrand && matchesCategory && matchesType && matchesPrice && matchesStock && matchesSearch;
  });

  const addToCart = (product) => {
    const existing = cart.find(c => c.id === product.id);
    if (existing) {
      setCart(cart.map(c => c.id === product.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const vatAmount = subtotal * 0.15; // 15% Saudi VAT
  const grandTotal = subtotal + vatAmount;

  return (
    <div style={{
      backgroundColor: '#f8f9fa',
      color: '#111111',
      minHeight: '100vh',
      fontFamily: "'Poppins', sans-serif",
      direction: isRTL ? 'rtl' : 'ltr',
      paddingTop: '25px',
      paddingBottom: '80px',
      boxSizing: 'border-box'
    }}>
      <style>{`
        .product-card-item {
          transition: all 0.25s ease;
        }
        .product-card-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          border-color: #ff0000 !important;
        }
        .filter-label-text {
          font-size: 12.5px;
          font-weight: 700;
          color: #333333;
          margin-bottom: 6px;
          display: block;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>

      {/* Top Search & Navigation Control Bar */}
      <div style={{
        maxWidth: '1350px',
        margin: '0 auto 25px auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <button
          onClick={onBackToHome}
          style={{
            backgroundColor: '#111111',
            color: '#ffffff',
            border: 'none',
            padding: '9px 18px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ff0000'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#111111'}
        >
          <FaArrowLeft /> Back to Main Site
        </button>

        {/* Search Bar (Part Name, OEM No, Chassis / VIN) */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '520px', minWidth: '280px' }}>
          <input 
            type="text"
            placeholder="🔍 Search by Part Name, OEM Number, or Chassis/VIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 45px 11px 16px',
              borderRadius: '6px',
              border: '1px solid #dcdcdc',
              fontSize: '13.5px',
              outline: 'none',
              backgroundColor: '#ffffff',
              boxSizing: 'border-box'
            }}
          />
          <FaSearch style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#ff0000' }} />
        </div>

        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          style={{
            backgroundColor: '#ff0000',
            color: '#ffffff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontSize: '13.5px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <FaShoppingCart /> Cart ({cart.reduce((a, b) => a + b.qty, 0)})
        </button>
      </div>

      {/* Main Body Grid */}
      <div style={{
        maxWidth: '1350px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        gap: '30px',
        flexWrap: 'wrap'
      }}>

        {/* LEFT SIDEBAR: Professional Filters */}
        <aside style={{
          width: '270px',
          flexShrink: 0,
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          height: 'fit-content'
        }}>
          
          <h3 style={{ fontSize: '14px', fontWeight: '800', borderBottom: '2px solid #ff0000', paddingBottom: '8px', marginBottom: '18px', textTransform: 'uppercase' }}>
            Catalog Filters
          </h3>

          {/* Category Filter */}
          <div style={{ marginBottom: '18px' }}>
            <span className="filter-label-text">Category</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: '100%', padding: '9px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '13px', backgroundColor: '#fafafa', outline: 'none' }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Vehicle Make Filter */}
          <div style={{ marginBottom: '18px' }}>
            <span className="filter-label-text">Vehicle Make</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              style={{ width: '100%', padding: '9px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '13px', backgroundColor: '#fafafa', outline: 'none' }}
            >
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Part Quality Filter */}
          <div style={{ marginBottom: '18px' }}>
            <span className="filter-label-text">Part Quality</span>
            <select
              value={selectedPartType}
              onChange={(e) => setSelectedPartType(e.target.value)}
              style={{ width: '100%', padding: '9px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '13px', backgroundColor: '#fafafa', outline: 'none' }}
            >
              {partTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Price Range Slider */}
          <div style={{ marginBottom: '18px' }}>
            <span className="filter-label-text">Max Price: SAR {maxPrice}</span>
            <input 
              type="range"
              min="50"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ff0000', cursor: 'pointer' }}
            />
          </div>

          {/* Stock Checkbox */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#333', cursor: 'pointer', fontWeight: '500' }}>
              <input 
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                style={{ accentColor: '#ff0000', width: '16px', height: '16px' }}
              />
              In Stock Only
            </label>
          </div>

          <button
            onClick={() => { setSearchTerm(''); setSelectedBrand('All'); setSelectedCategory('All'); setSelectedPartType('All'); setMaxPrice(2000); setOnlyInStock(false); }}
            style={{ width: '100%', backgroundColor: '#ffffff', color: '#ff0000', border: '1px solid #ff0000', padding: '9px', borderRadius: '5px', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}
          >
            Reset Filters
          </button>
        </aside>

        {/* RIGHT SIDE: PRODUCT GRID */}
        <main style={{ flex: 1, minWidth: '280px' }}>
          
          {/* Info Banner */}
          <div style={{
            backgroundColor: '#111111',
            color: '#ffffff',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '25px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px',
            borderLeft: '4px solid #ff0000'
          }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '800' }}>Need exact part verification?</h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#aaaaaa' }}>Provide your VIN / Chassis number for 100% accurate parts matching in KSA.</p>
            </div>
            <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#ffffff', fontWeight: '700' }}>
              <span><FaShieldAlt style={{ color: '#ff0000' }} /> 100% Genuine</span>
              <span><FaTruck style={{ color: '#ff0000' }} /> Fast KSA Delivery</span>
            </div>
          </div>

          {/* Product Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '20px' }}>
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="product-card-item"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative'
                }}
              >
                <div>
                  {/* Quality Badge */}
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(255, 0, 0, 0.08)',
                    color: '#ff0000',
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255,0,0,0.2)'
                  }}>
                    {product.type}
                  </span>

                  {/* Image */}
                  <div style={{ height: '140px', backgroundColor: '#fafafa', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px', marginBottom: '12px' }}>
                    <img src={product.image} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>

                  <div style={{ fontSize: '10.5px', color: '#888', textTransform: 'uppercase', marginBottom: '3px', fontWeight: '600' }}>
                    {product.brand} • {product.category}
                  </div>
                  <h3 style={{ fontSize: '13.5px', fontWeight: '700', color: '#111', margin: '0 0 6px 0', lineHeight: '1.3' }}>
                    {product.name}
                  </h3>

                  <div style={{ fontSize: '11.5px', color: '#555', marginBottom: '8px' }}>
                    <strong>OEM No:</strong> <span style={{ fontFamily: 'monospace', color: '#ff0000', fontWeight: '600' }}>{product.oemNo}</span>
                  </div>
                  
                  {/* Price */}
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#111', margin: '10px 0' }}>
                    SAR {product.price.toFixed(2)} <span style={{ fontSize: '10px', fontWeight: '400', color: '#777' }}>(Excl. VAT)</span>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(product)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#111111',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '700',
                    fontSize: '12.5px',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ff0000'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#111111'}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div style={{ backgroundColor: '#fff', padding: '50px', textAlign: 'center', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
              <h3 style={{ fontSize: '16px', color: '#111', marginBottom: '6px' }}>No matching spare parts found</h3>
              <p style={{ color: '#666', fontSize: '13px' }}>Try searching with a different OEM part number or reset filters.</p>
            </div>
          )}
        </main>
      </div>

      {/* CART DRAWER WITH OUTSIDE CLICK CLOSE */}
      {isCartOpen && (
        <div 
          onClick={() => setIsCartOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'flex-end' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            style={{ width: '380px', backgroundColor: '#fff', height: '100%', padding: '25px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '-5px 0 25px rgba(0,0,0,0.2)' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Shopping Cart ({cart.reduce((a,b)=>a+b.qty,0)})</h3>
                <FaTimes style={{ cursor: 'pointer', fontSize: '18px', color: '#333' }} onClick={() => setIsCartOpen(false)} />
              </div>

              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '12px', marginBottom: '15px', borderBottom: '1px solid #f5f5f5', paddingBottom: '12px', alignItems: 'center' }}>
                  <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'contain', border: '1px solid #eee', borderRadius: '4px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: '700' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: '#666' }}>SAR {item.price} x {item.qty}</div>
                  </div>
                  <FaTimes style={{ cursor: 'pointer', color: '#ff0000', fontSize: '12px' }} onClick={() => removeFromCart(item.id)} />
                </div>
              ))}

              {cart.length === 0 && <p style={{ color: '#888', fontSize: '13px' }}>Your cart is empty.</p>}
            </div>

            {/* Calculations & Checkout */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555', marginBottom: '6px' }}>
                <span>Subtotal:</span>
                <span>SAR {subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555', marginBottom: '10px' }}>
                <span>VAT (15% KSA):</span>
                <span>SAR {vatAmount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '16px', marginBottom: '20px', color: '#111' }}>
                <span>Grand Total:</span>
                <span style={{ color: '#ff0000' }}>SAR {grandTotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => alert('Proceeding to Secure Checkout Gateway (KSA Payment Integration)...')}
                style={{ width: '100%', backgroundColor: '#ff0000', color: '#fff', border: 'none', padding: '13px', borderRadius: '6px', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}
              >
                Proceed to Checkout
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}