import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('/home');
  const navigate = useNavigate();

  // Router pages: navigate. Why Us is a Home section: go Home first, then scroll.
  const handleNavClick = (item) => {
    setIsOpen(false);
    if (item.path) {
      setActiveSection(item.path);
      navigate(item.path);
      return;
    }
    if (item.target === 'why-us') {
      setActiveSection('why-us');
      if (window.location.pathname !== '/home') {
        navigate('/home');
        setTimeout(() => scrollToSection('why-us'), 300);
      } else {
        scrollToSection('why-us');
      }
    }
  };

  const isArabic = i18n.language === 'ar';

  useEffect(() => {
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isArabic]);

  const toggleLanguage = () => {
    const newLang = isArabic ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  const scrollToSection = (targetId) => {
    setIsOpen(false);
    setActiveSection(targetId);
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -120; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99999,
        width: '100%',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        backgroundColor: '#ffffff'
      }}>
        <style>
          {`
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .ticker-wrap {
              overflow: hidden;
              white-space: nowrap;
              width: 100%;
            }
            .ticker-move {
              display: inline-block;
              animation: marquee 25s linear infinite;
            }
            .ticker-move span {
              display: inline-block;
              padding-right: 50px;
            }
            .mobile-hamburger {
              display: none;
              background: none;
              border: none;
              color: #ffffff;
              font-size: 22px;
              cursor: pointer;
            }
            .desktop-contact-btn {
              display: inline-block;
            }
            .nav-link-item {
              position: relative;
              text-decoration: none;
              color: #222;
              font-size: 13px;
              font-weight: 700;
              letter-spacing: 1px;
              text-transform: uppercase;
              padding-bottom: 4px;
              cursor: pointer;
              background: none;
              border: none;
              font-family: inherit;
            }
            .nav-link-item::after {
              content: '';
              position: absolute;
              width: 0;
              height: 3px;
              bottom: -6px;
              left: 0;
              background-color: #8b0b0b;
              transition: width 0.3s ease-in-out;
            }
            .nav-link-item:hover::after,
            .nav-link-item.active::after {
              width: 100%;
            }

            .action-btn {
              background-color: #8b0b0b;
              color: #fff;
              border: 2px solid #8b0b0b;
              padding: 8px 18px;
              border-radius: 4px;
              text-decoration: none;
              font-size: 13px;
              font-weight: 700;
              text-transform: uppercase;
              cursor: pointer;
              transition: all 0.3s ease;
            }
            .action-btn:hover {
              background-color: #ffffff;
              color: #8b0b0b;
              border-color: #8b0b0b;
            }

            .brand-logo {
              font-size: clamp(16px, 4vw, 24px);
              font-weight: 900;
              letter-spacing: 2px;
              background: linear-gradient(135deg, #ffffff 30%, #8b0b0b 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              text-transform: uppercase;
              text-shadow: 0 2px 10px rgba(139, 11, 11, 0.3);
              white-space: nowrap;
              flex-shrink: 0;
            }

            @media screen and (max-width: 960px) {
              .desktop-menu { display: none !important; }
              .mobile-hamburger { display: block !important; }
              .desktop-contact-btn { display: none !important; }
              .header-inner {
                padding: 10px 3% !important;
              }
              .social-icons-group {
                gap: 4px !important;
              }
              .social-icon-box {
                width: 28px !important;
                height: 28px !important;
                font-size: 12px !important;
              }
              .lang-btn {
                padding: 4px 8px !important;
                font-size: 11px !important;
              }
            }
          `}
        </style>

        {/* 1. Red Ticker Bar */}
        <div style={{
          backgroundColor: '#8b0b0b',
          color: '#ffffff',
          fontSize: '13px',
          fontWeight: '600',
          height: '34px',
          lineHeight: '34px',
          overflow: 'hidden',
          boxSizing: 'border-box',
          direction: isArabic ? 'rtl' : 'ltr',
          width: '100%'
        }}>
          <div className="ticker-wrap">
            <div className="ticker-move">
              <span>{t('welcomeText')}</span>
              <span>{t('welcomeText')}</span>
            </div>
          </div>
        </div>

        {/* 2. Black Header */}
        <div className="header-inner" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 5%',
          backgroundColor: '#111111',
          color: '#ffffff',
          borderBottom: '1px solid #222',
          flexWrap: 'nowrap',
          gap: '8px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div className="social-icons-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 1 }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-box" style={{ color: '#ffffff', background: '#222', width: '32px', height: '32px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FaFacebookF /></a>
            <a href="https://www.instagram.com/alsaqar_spare_parts?utm_source=qr&stkn=MXdicjBicnh6anJ5Mw==" target="_blank" rel="noopener noreferrer" className="social-icon-box" style={{ color: '#ffffff', background: '#222', width: '32px', height: '32px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FaInstagram /></a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="social-icon-box" style={{ color: '#ffffff', background: '#222', width: '32px', height: '32px', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FaTiktok /></a>
          </div>

          <div className="brand-logo" style={{ textAlign: 'center' }}>
            Al-Saqar
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 1 }}>
            <button 
              onClick={toggleLanguage} 
              className="action-btn lang-btn"
              style={{ padding: '6px 12px', fontSize: '12px' }}
            >
              {isArabic ? 'English' : 'العربية'}
            </button>
            
            <div className="desktop-contact-btn">
              <button onClick={() => navigate('/contact-us')} className="action-btn">
                {t('contact')}
              </button>
            </div>

            <button className="mobile-hamburger" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* 3. Navigation Links Bar */}
        <nav style={{ backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 5%', borderBottom: '2px solid #f0f0f0', position: 'relative', width: '100%', boxSizing: 'border-box' }}>
          <ul className="desktop-menu" style={{ listStyle: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', margin: 0, padding: '16px 0', direction: isArabic ? 'rtl' : 'ltr' }}>
            {[
              { name: t('home'), path: '/home' },
              { name: 'SHOP', path: '/shop' },
              { name: t('about'), path: '/about-us' },
              { name: t('whyUs'), target: 'why-us' },
              { name: t('location'), path: '/location' },
              { name: t('faq'), path: '/faq' },
              { name: t('contact'), path: '/contact-us' }
            ].map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => handleNavClick(item)}
                  className={`nav-link-item ${activeSection === (item.path || item.target) ? 'active' : ''}`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>

          {isOpen && (
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', position: 'absolute', top: '100%', left: 0, width: '100%', backgroundColor: '#111111', boxShadow: '0 10px 20px rgba(0,0,0,0.3)', padding: '20px 0', margin: 0, gap: '15px', zIndex: 1100, textAlign: 'center', boxSizing: 'border-box' }}>
              {[
                { name: t('home'), path: '/home' },
                { name: 'SHOP', path: '/shop' },
                { name: t('about'), path: '/about-us' },
                { name: t('whyUs'), target: 'why-us' },
                { name: t('location'), path: '/location' },
                { name: t('faq'), path: '/faq' },
                { name: t('contact'), path: '/contact-us' }
              ].map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleNavClick(item)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none', color: activeSection === (item.path || item.target) ? '#8b0b0b' : '#ffffff', fontSize: '14px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </header>

      <div style={{ height: '125px' }}></div>
    </>
  );
};

export default Navbar;
