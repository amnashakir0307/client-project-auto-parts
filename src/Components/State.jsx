import React, { useState, useEffect, useRef } from 'react';
import { FaShieldAlt, FaBoxes, FaSmile, FaCheckCircle, FaMedal, FaLock, FaStore, FaHeadset, FaCog, FaStar } from 'react-icons/fa';

// Custom Hook for Animated Counter effect triggered on scroll/view
function useCounter(target, duration = 3500) {
  const [count, setCount] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.2 }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 1;
    const incrementTime = Math.max(Math.floor(duration / target), 30);
    
    const timer = setInterval(() => {
      start += Math.ceil(target / 50);
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  return [count, elementRef];
}

export default function Stats() {
  const [guaranteeCount, guaranteeRef] = useCounter(100, 3000); 
  const [partsCount, partsRef] = useCounter(5000, 3500);    
  const [reviewsCount, reviewsRef] = useCounter(500, 3500);   
  const [brandsCount, brandsRef] = useCounter(4, 2500); // برانڈز کی تعداد 4 کر دی گئی ہے     

  return (
    <div style={styles.section}>
      {/* Black strip — Hero ke neeche, State ke top par */}
      <div className="state-black-strip" style={styles.blackStrip}>
        {[
          { icon: <FaMedal />, title: 'PREMIUM QUALITY', desc: 'Built to Last' },
          { icon: <FaCheckCircle />, title: '100% GENUINE PARTS', desc: 'Certified Authentic' },
          { icon: <FaLock />, title: 'SECURE PAYMENT', desc: 'COD & Bank Transfer' },
          { icon: <FaStore />, title: 'STORE PICKUP', desc: 'Visit Our Makkah Store' },
          { icon: <FaHeadset />, title: 'EXPERT SUPPORT', desc: "We're Here to Help" },
        ].map((f) => (
          <div key={f.title} className="state-strip-item" style={styles.stripItem}>
            <span className="state-strip-icon" style={styles.stripIcon}>{f.icon}</span>
            <span>
              <span className="state-strip-title" style={styles.stripTitle}>{f.title}</span>
              <span className="state-strip-desc" style={styles.stripDesc}>{f.desc}</span>
            </span>
          </div>
        ))}
      </div>

      <div style={styles.grid}>
        
        {/* Card 1 */}
        <div style={styles.card} className="stats-card" ref={guaranteeRef}>
          <div style={styles.iconWrapper}>
            <FaShieldAlt style={styles.icon} />
          </div>
          <h2 style={styles.number}>{guaranteeCount}<span style={styles.accent}>%</span></h2>
          <p style={styles.text}>Authentic Guarantee & Quality</p>
        </div>
        
        {/* Card 2 */}
        <div style={styles.card} className="stats-card" ref={partsRef}>
          <div style={styles.iconWrapper}>
            <FaBoxes style={styles.icon} />
          </div>
          <h2 style={styles.number}>{partsCount.toLocaleString()}<span style={styles.accent}>+</span></h2>
          <p style={styles.text}>Available Spare Parts</p>
        </div>
        
        {/* Card 3 */}
        <div style={styles.card} className="stats-card" ref={reviewsRef}>
          <div style={styles.iconWrapper}>
            <FaSmile style={styles.icon} />
          </div>
          <h2 style={styles.number}>{reviewsCount}<span style={styles.accent}>+</span></h2>
          <p style={styles.text}>Satisfied Customer Reviews</p>
        </div>
        
        {/* Card 4 */}
        <div style={styles.card} className="stats-card" ref={brandsRef}>
          <div style={styles.iconWrapper}>
            <FaCheckCircle style={styles.icon} />
          </div>
          <h2 style={styles.number}>{brandsCount}<span style={styles.accent}>+</span></h2>
          <p style={styles.text}>Major Genuine Brands Covered</p>
        </div>

      </div>

      {/* Embedded CSS Styles for Clean Look and Outfit font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;700;800&display=swap');
        
        .stats-card {
          font-family: 'Outfit', sans-serif;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .stats-card:hover {
          transform: translateY(-5px);
          border-color: #D32F2F !important;
          box-shadow: 0 10px 20px rgba(211, 47, 47, 0.12) !important;
        }
        @media (max-width: 700px) {
          .state-black-strip { grid-template-columns: repeat(2, 1fr) !important; padding: 16px 4% !important; gap: 14px 8px !important; }
          .state-strip-item { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 6px !important; }
          .state-strip-item:last-child { grid-column: 1 / -1 !important; }
          .state-strip-icon { font-size: 24px !important; }
          .state-strip-title { font-size: 12px !important; }
          .state-strip-desc { font-size: 11px !important; }
        }
      `}</style>
    </div>
  );
}

// Promo section — Footer se pehle: 2 cards + features strip.
// App.jsx me <PromoBeforeFooter /> ke zariye BestSellers ke baad lagta hai.
export function PromoBeforeFooter() {
  return (
    <>
{/* Promo section — Footer se pehle: 2 cards + features strip */}
      <style>{`
        @media (max-width: 700px) {
          .app-promo-strip { grid-template-columns: repeat(2, 1fr) !important; padding: 18px 4% !important; gap: 14px 8px !important; }
          .app-promo-item { flex-direction: column !important; align-items: center !important; text-align: center !important; gap: 6px !important; padding: 4px !important; }
          .app-promo-icon { font-size: 24px !important; }
          .app-promo-title { font-size: 12px !important; }
          .app-promo-desc { font-size: 11px !important; }
        }
      `}</style>
      <div style={{ width: '100%', backgroundColor: '#000000', padding: '20px 5%', boxSizing: 'border-box', fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
        {/* Features strip */}
        <div className="app-promo-strip" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '20px 0', gap: '12px', boxSizing: 'border-box' }}>
          {[
            { icon: <FaShieldAlt />, title: 'FITMENT GUARANTEE', desc: 'Parts That Fit Your Vehicle' },
            { icon: <FaCog />, title: 'THOUSANDS OF PRODUCTS', desc: 'Top Brands, One Destination' },
            { icon: <FaHeadset />, title: 'DEDICATED SUPPORT', desc: 'Expert Advice & Help' },
            { icon: <FaStar />, title: 'LOYALTY REWARDS', desc: 'Earn Points & Save More' },
          ].map((f) => (
            <div key={f.title} className="app-promo-item" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '6px 14px' }}>
              <span className="app-promo-icon" style={{ fontSize: '30px', color: '#ffffff', flexShrink: 0, display: 'flex' }}>{f.icon}</span>
              <span>
                <span className="app-promo-title" style={{ display: 'block', fontSize: '13px', fontWeight: '800', letterSpacing: '0.5px', color: '#ffffff' }}>{f.title}</span>
                <span className="app-promo-desc" style={{ display: 'block', fontSize: '12px', color: '#bbbbbb', marginTop: '2px' }}>{f.desc}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const styles = {
  section: {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), url('/faq.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '0 20px 60px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Outfit', sans-serif",
    boxSizing: 'border-box',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    backgroundColor: '#ffffff',
    padding: '35px 25px',
    gap: '20px',
    textAlign: 'center',
    width: '100%',
    maxWidth: '1200px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
    boxSizing: 'border-box',
    marginTop: '20px',
  },
  blackStrip: {
    backgroundColor: '#111111',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    padding: '16px 4%',
    gap: '16px',
    width: 'calc(100% + 40px)',
    margin: '0 -20px',
    borderRadius: '0',
    boxSizing: 'border-box',
  },
  stripItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    justifyContent: 'center',
  },
  stripIcon: {
    fontSize: '26px',
    color: '#ffffff',
    flexShrink: 0,
    display: 'flex',
  },
  stripTitle: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '0.5px',
    color: '#ffffff',
  },
  stripDesc: {
    display: 'block',
    fontSize: '11px',
    color: '#aaaaaa',
    marginTop: '2px',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #edf2f7',
    borderRadius: '12px',
    padding: '25px 15px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconWrapper: {
    width: '55px', // ڈبہ کا سائز بڑا کیا گیا ہے
    height: '55px',
    borderRadius: '50%',
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '15px',
  },
  icon: {
    fontSize: '24px', // آئکن کا سائز بڑا کر دیا گیا ہے
    color: '#D32F2F',
  },
  number: {
    fontSize: '36px',
    color: '#0f172a',
    marginBottom: '6px',
    fontWeight: '800',
    letterSpacing: '-1px',
    lineHeight: '1',
  },
  accent: {
    color: '#D32F2F',
  },
  text: {
    color: '#64748b',
    fontSize: '13px',
    fontWeight: '600',
    margin: 0,
  },
};