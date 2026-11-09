import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';

const FAQ = () => {
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);
  const isRtl = i18n.language === 'ar';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = t('faqItems', { returnObjects: true });
  const faqItems = Array.isArray(faqData) ? faqData : [];

  return (
    <section style={{
      padding: '80px 20px',
      backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.95)), url("/faq.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      color: '#111111',
      fontFamily: 'sans-serif',
      direction: isRtl ? 'rtl' : 'ltr'
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#dc2626',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            <FaQuestionCircle /> {t('badge')}
          </div>
          <h2 style={{
            fontSize: '36px',
            fontWeight: '800',
            marginTop: '15px',
            marginBottom: '15px',
            color: '#111111'
          }}>
            {t('titlePart1')} <span style={{ color: '#dc2626' }}>{t('titlePart2')}</span>
          </h2>
          <p style={{ color: '#555555', fontSize: '16px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            {t('subtitle')}
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {faqItems.map((item, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                style={{
                  background: '#ffffff',
                  border: isOpen ? '1px solid #dc2626' : '1px solid #e5e7eb',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  boxShadow: isOpen ? '0 4px 20px rgba(220, 38, 38, 0.1)' : '0 2px 8px rgba(0,0,0,0.04)'
                }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleFAQ(index)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'transparent',
                    border: 'none',
                    color: '#111111',
                    fontSize: '17px',
                    fontWeight: '600',
                    textAlign: isRtl ? 'right' : 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '15px'
                  }}
                >
                  <span style={{ color: isOpen ? '#dc2626' : '#111111' }}>{item.question}</span>
                  <FaChevronDown style={{
                    fontSize: '14px',
                    color: '#dc2626',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    flexShrink: 0
                  }} />
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 24px 20px 24px',
                    color: '#4b5563',
                    fontSize: '15px',
                    lineHeight: '1.7',
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '15px',
                    textAlign: isRtl ? 'right' : 'left'
                  }}>
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
