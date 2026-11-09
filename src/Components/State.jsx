import React, { useState, useEffect, useRef } from 'react';
import { FaShieldAlt, FaBoxes, FaSmile, FaCheckCircle } from 'react-icons/fa';

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
      `}</style>
    </div>
  );
}

const styles = {
  section: {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), url('/faq.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '60px 20px',
    width: '100%',
    display: 'flex',
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