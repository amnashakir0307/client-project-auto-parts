import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaCarSide, FaSearch, FaTags } from 'react-icons/fa';
import { motion } from 'framer-motion';

const WhyChooseUs = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const features = [
    { 
      icon: <FaCheckCircle />, 
      title: t('feature1Title'), 
      desc: t('feature1Desc') 
    },
    { 
      icon: <FaCarSide />, 
      title: t('feature2Title'), 
      desc: t('feature2Desc') 
    },
    { 
      icon: <FaSearch />, 
      title: t('feature3Title'), 
      desc: t('feature3Desc') 
    },
    { 
      icon: <FaTags />, 
      title: t('feature4Title'), 
      desc: t('feature4Desc') 
    }
  ];

  return (
    <section style={{
      backgroundImage: 'linear-gradient(rgba(10, 10, 10, 0.88), rgba(10, 10, 10, 0.88)), url(https://i.pinimg.com/1200x/11/ba/73/11ba736bb6d67ee595bfd4483a620a39.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      color: '#ffffff',
      padding: '70px 3%',
      fontFamily: "'Outfit', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      borderBottom: '1px solid #1f1f1f',
      overflow: 'hidden',
      direction: isRTL ? 'rtl' : 'ltr'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Section Heading with Animation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '45px' }}
        >
          <h2 style={{
            fontSize: 'clamp(24px, 3.5vw, 32px)',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#ffffff',
            margin: 0
          }}>
            {t('whyChooseUsTitle')} <span style={{ color: '#D32F2F' }}>{t('whyChooseUsTitleSpan')}</span>
          </h2>
          <div style={{
            width: '50px',
            height: '3px',
            backgroundColor: '#D32F2F',
            margin: '10px auto 0 auto',
            borderRadius: '2px'
          }}></div>
        </motion.div>

        {/* 4 Cards Grid - Responsive (1 div per line on mobile) */}
        <div className="why-us-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          alignItems: 'stretch'
        }}>
          {features.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ 
                y: -6, 
                backgroundColor: 'rgba(22, 22, 22, 0.95)',
                borderColor: '#D32F2F',
                boxShadow: '0 12px 25px rgba(211, 47, 47, 0.25)' 
              }}
              style={{
                backgroundColor: 'rgba(18, 18, 18, 0.85)',
                backdropFilter: 'blur(8px)',
                borderRadius: '14px',
                padding: '30px 20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Accent Line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '3px',
                backgroundColor: '#D32F2F'
              }}></div>

              {/* Icon Box */}
              <div style={{
                width: '55px',
                height: '55px',
                borderRadius: '50%',
                backgroundColor: 'rgba(211, 47, 47, 0.15)',
                border: '1px solid rgba(211, 47, 47, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D32F2F',
                fontSize: '22px',
                marginBottom: '18px'
              }}>
                {item.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '14px',
                fontWeight: '800',
                textTransform: 'uppercase',
                color: '#ffffff',
                margin: '0 0 10px 0',
                letterSpacing: '0.4px',
                lineHeight: '1.4'
              }}>
                {item.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '13px',
                color: '#b3b3b3',
                margin: 0,
                lineHeight: '1.6'
              }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Media query styling to ensure 1 div per line on mobile screens */}
      <style>{`
        @media (max-width: 900px) {
          .why-us-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 580px) {
          .why-us-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;