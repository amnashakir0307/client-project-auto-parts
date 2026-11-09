import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp, FaSearch, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

const featuredProducts = [
  {
    id: 1,
    name: 'Engine Oil Filter',
    brand: 'Isuzu',
    model: 'NPR / D-Max 2020-2024',
    partNumber: '8-98018858-0',
    image: '/isuzu.jpg',
    category: 'Engine Parts'
  },
  {
    id: 2,
    name: 'Front Brake Pad Set',
    brand: 'Mitsubishi',
    model: 'Canter / L200 2018-2023',
    partNumber: 'MK585933',
    image: '/mitsubihi.jpg',
    category: 'Brake System'
  },
  {
    id: 3,
    name: 'Clutch Disc Assembly',
    brand: 'MG',
    model: 'MG HS / ZS 2021-2025',
    partNumber: '10234590',
    image: '/mg.jpg',
    category: 'Transmission'
  },
  {
    id: 4,
    name: 'Fuel Filter Element',
    brand: 'Hyundai',
    model: 'Mighty / H100 2019-2024',
    partNumber: '31922-4H001',
    image: '/hundai.jpg',
    category: 'Filters'
  }
];

export default function Products() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleInquiry = (productName, partNo, brand) => {
    const whatsappNum = "966502748270";
    const message = `Hello Al-Saqar Team, I am interested in inquiring about:%0A*Part Name:* ${productName}%0A*Brand:* ${brand}%0A*Part Number:* ${partNo}`;
    window.open(`https://wa.me/${whatsappNum}?text=${message}`, '_blank');
  };

  return (
    <section 
      id="products" 
      style={{
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        padding: '80px 20px',
        fontFamily: "'Poppins', sans-serif",
        direction: isRTL ? 'rtl' : 'ltr',
        textAlign: isRTL ? 'right' : 'left',
        borderTop: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{
            color: '#ff2222',
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            backgroundColor: 'rgba(255, 34, 34, 0.1)',
            padding: '6px 16px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 34, 34, 0.25)'
          }}>
            Genuine Spare Parts Showcase
          </span>
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)',
            fontWeight: '900',
            marginTop: '15px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            FEATURED <span style={{ color: '#ff2222' }}>AUTO COMPONENTS</span>
          </h2>
          <p style={{ color: '#888888', fontSize: '14px', marginTop: '8px' }}>
            Verify part numbers, models, and specifications directly with our team
          </p>
        </div>

        {/* Featured Products Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '25px',
          marginBottom: '50px'
        }}>
          {featuredProducts.map((product) => (
            <div 
              key={product.id}
              style={{
                backgroundColor: 'rgba(18, 18, 18, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#ff2222';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 34, 34, 0.2)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                {/* Genuine Tag & Image */}
                <div style={{
                  position: 'relative',
                  backgroundColor: '#ffffff',
                  borderRadius: '10px',
                  height: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '15px',
                  marginBottom: '18px'
                }}>
                  <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(37, 211, 102, 0.15)',
                    color: '#25D366',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <FaCheckCircle size={10} /> OEM Verified
                  </span>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
                  />
                </div>

                {/* Info */}
                <span style={{ fontSize: '11px', color: '#ff2222', fontWeight: '800', textTransform: 'uppercase' }}>
                  {product.brand} • {product.category}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', margin: '6px 0' }}>
                  {product.name}
                </h3>
                <div style={{ fontSize: '12px', color: '#aaaaaa', marginBottom: '4px' }}>
                  <strong>Part No:</strong> <span style={{ color: '#ffffff', fontFamily: 'monospace' }}>{product.partNumber}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#888888', marginBottom: '20px' }}>
                  <strong>Model:</strong> {product.model}
                </div>
              </div>

              <button
                onClick={() => handleInquiry(product.name, product.partNumber, product.brand)}
                style={{
                  width: '100%',
                  padding: '11px',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'background 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1eb853'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#25D366'}
              >
                <FaWhatsapp size={16} /> Quick Inquiry
              </button>
            </div>
          ))}
        </div>

        {/* Redirect CTA Button for Full Catalog */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/products')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#ff2222',
              color: '#ffffff',
              padding: '14px 32px',
              borderRadius: '30px',
              fontWeight: '800',
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(255, 34, 34, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#d31111';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ff2222';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <FaSearch size={15} /> Open Full Auto Parts Catalog & Filter <FaArrowRight size={14} />
          </button>
        </div>

      </div>
    </section>
  );
}