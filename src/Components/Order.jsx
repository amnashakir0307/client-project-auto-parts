import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCamera, FaWhatsapp, FaFileInvoiceDollar } from 'react-icons/fa';

const Order = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const steps = [
    {
      step: "01",
      title: t('orderStep1Title', { defaultValue: "CAPTURE & SHARE" }),
      desc: t('orderStep1Desc', { defaultValue: "Send photo, model number, or Chassis / VIN." }),
      icon: <FaCamera style={{ color: '#d32f2f', fontSize: '26px' }} />,
      borderColor: "#d32f2f"
    },
    {
      step: "02",
      title: t('orderStep2Title', { defaultValue: "WHATSAPP EXPERTS" }),
      desc: t('orderStep2Desc', { defaultValue: "Connect directly with our sales team." }),
      icon: <FaWhatsapp style={{ color: '#25D366', fontSize: '30px' }} />,
      borderColor: "#25D366"
    },
    {
      step: "03",
      title: t('orderStep3Title', { defaultValue: "CONFIRM & DISPATCH" }),
      desc: t('orderStep3Desc', { defaultValue: "Verify price & stock, then collect or ship." }),
      icon: <FaFileInvoiceDollar style={{ color: '#d32f2f', fontSize: '28px' }} />,
      borderColor: "#d32f2f"
    }
  ];

  return (
    <section style={{
      position: 'relative',
      width: '100%',
      backgroundColor: '#ffffff',
      padding: '80px 20px',
      fontFamily: "'Montserrat', sans-serif",
      boxSizing: 'border-box',
      borderBottom: '2px solid #eaeaea',
      direction: isArabic ? 'rtl' : 'ltr',
      overflow: 'hidden'
    }}>
      {/* 1. Public Folder Background Image */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: "url('/hero1.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 1
      }}></div>

      {/* 2. Light White Overlay + Soft Blur Filter */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.78)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        zIndex: 2
      }}></div>

      {/* 3. Main Content Layer */}
      <div style={{ maxWidth: '1150px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 3 }}>
        
        {/* Modern Tagline */}
        <div style={{
          display: 'inline-block',
          backgroundColor: '#D32F2F',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '1.2px',
          textTransform: 'uppercase',
          padding: '6px 16px',
          borderRadius: '30px',
          marginBottom: '14px',
          boxShadow: '0 4px 15px rgba(211, 47, 47, 0.3)'
        }}>
          {t('orderTagline', { defaultValue: "SIMPLE & FAST PROCESS" })}
        </div>

        {/* Modern Enhanced Heading */}
        <h2 style={{
          fontSize: 'clamp(24px, 3.2vw, 34px)',
          fontWeight: '900',
          color: '#111111',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          marginBottom: '50px'
        }}>
          {t('orderHeadingPrefix', { defaultValue: "HOW TO" })} <span style={{ color: '#d32f2f' }}>{t('orderHeadingHighlight', { defaultValue: "ORDER YOUR PARTS" })}</span>
        </h2>

        {/* Responsive Grid Container with proper gap */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '30px'
        }}>
          {steps.map((item, index) => (
            <div key={index} className="flip-card" style={{
              width: '300px',
              height: '200px',
              perspective: '1000px',
              cursor: 'pointer',
              flexShrink: 0
            }}>
              <div className="flip-card-inner" style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                textAlign: 'center',
                transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
                transformStyle: 'preserve-3d',
                borderRadius: '16px'
              }}>
                
                {/* Front Side (Light Grey Background with Thick Aesthetic Border) */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  backgroundColor: 'rgba(248, 249, 250, 0.92)',
                  backdropFilter: 'blur(4px)',
                  WebkitBackdropFilter: 'blur(4px)',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '20px',
                  border: '2px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  boxSizing: 'border-box',
                  zIndex: 2
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: `2px solid ${item.borderColor}`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                    marginBottom: '10px'
                  }}>
                    {item.icon}
                  </div>

                  {/* Font size bara aur wazeh kiya gaya hai */}
                  <span style={{
                    fontSize: '13.5px',
                    fontWeight: '900',
                    color: '#111111',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '6px'
                  }}>
                    {item.title}
                  </span>
                  <p style={{
                    fontSize: '12.5px',
                    color: '#444444',
                    lineHeight: '1.45',
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    {item.desc}
                  </p>
                </div>

                {/* Back Side (Red Background, Black Heading, White Text with bigger font) */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  backgroundColor: '#D32F2F',
                  color: '#ffffff',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '20px',
                  boxShadow: '0 8px 22px rgba(211, 47, 47, 0.25)',
                  boxSizing: 'border-box',
                  transform: 'rotateY(180deg)',
                  WebkitTransform: 'rotateY(180deg)',
                  textAlign: 'center',
                  zIndex: 1
                }}>
                  <span style={{
                    fontSize: '13.5px',
                    fontWeight: '900',
                    letterSpacing: '1px',
                    marginBottom: '8px',
                    color: '#111111',
                    textTransform: 'uppercase'
                  }}>
                    {isArabic ? `تفاصيل الخطوة ${item.step}` : `Step ${item.step} Details`}
                  </span>
                  <p style={{
                    fontSize: '12.5px',
                    lineHeight: '1.5',
                    margin: 0,
                    color: '#ffffff',
                    fontWeight: '600'
                  }}>
                    {item.desc} - {isArabic ? 'عملية سريعة، موثوقة وآمنة مضمونة.' : 'Fast, reliable & secure process guaranteed.'}
                  </p>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Flip Animation CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&display=swap');
        
        .flip-card:hover .flip-card-inner {
          transform: rotateY(${isArabic ? '-180deg' : '180deg'});
        }
      `}</style>
    </section>
  );
};

export default Order;