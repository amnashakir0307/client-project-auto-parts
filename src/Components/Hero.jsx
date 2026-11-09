import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaWhatsapp, FaShieldAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { image: '/hero1.jpeg', titleKey: 'heroSlide1Title', descKey: 'heroSlide1Desc' },
    { image: '/hero2.jpeg', titleKey: 'heroSlide2Title', descKey: 'heroSlide2Desc' },
    { image: '/hero3.jpeg', titleKey: 'heroSlide3Title', descKey: 'heroSlide3Desc' },
    { image: '/hero4.jpeg', titleKey: 'heroSlide4Title', descKey: 'heroSlide4Desc' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  // Smooth Scroll Target Handler (Prevents Page Reload)
  const handleQuoteClick = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isRTL = i18n.language === 'ar';

  return (
    <section className="hero-main-section" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="hero-bg-slide"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${slides[currentSlide].image})`
          }}
        />
      </AnimatePresence>

      {/* Left Arrow */}
      <button 
        onClick={prevSlide} 
        className="hero-arrow-btn left-arrow"
        aria-label="Previous Slide"
      >
        {isRTL ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      {/* Right Arrow */}
      <button 
        onClick={nextSlide} 
        className="hero-arrow-btn right-arrow"
        aria-label="Next Slide"
      >
        {isRTL ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      {/* Content Box */}
      <div className="hero-content-wrapper">
        <motion.div
          key={`content-${currentSlide}`}
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ width: '100%' }}
        >
          {/* Badge */}
          <div className="hero-badge">
            <FaShieldAlt style={{ fontSize: '13px' }} /> 100% Genuine Auto Components
          </div>

          {/* Heading */}
          <h1 className="hero-heading">
            {t(slides[currentSlide].titleKey)}
          </h1>

          {/* Subtitle */}
          <p className="hero-desc">
            {t(slides[currentSlide].descKey)}
          </p>

          {/* Buttons */}
          <div className="hero-btn-container">
            {/* Get Quote / About Target Button */}
            <a 
              href="#about"
              onClick={handleQuoteClick}
              className="hero-btn quote-btn"
            >
              {t('getQuote')} <FaArrowRight style={{ fontSize: '11px' }} />
            </a>

            <a 
              href="https://wa.me/966502748270?text=Hello%20Al-Saqar%20Agent,%20I%20want%20to%20get%20details%20about%20auto%20parts." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hero-btn wa-btn"
            >
              <FaWhatsapp style={{ fontSize: '16px' }} /> {t('quickWhatsApp')}
            </a>
          </div>
        </motion.div>

        {/* Dots Indicator */}
        <div className="hero-dots-container">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`hero-dot ${currentSlide === index ? 'active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .hero-main-section {
          position: relative;
          width: 100%;
          min-height: 85vh;
          margin: 0;
          padding: 60px 20px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          box-sizing: border-box;
          background-color: #000000;
        }

        .hero-bg-slide {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          z-index: 1;
        }

        .hero-arrow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(0, 0, 0, 0.6);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 5;
          transition: background 0.3s;
        }

        .hero-arrow-btn:hover {
          background-color: #8b0b0b;
        }

        .left-arrow {
          left: ${isRTL ? 'auto' : '20px'};
          right: ${isRTL ? '20px' : 'auto'};
        }

        .right-arrow {
          right: ${isRTL ? 'auto' : '20px'};
          left: ${isRTL ? '15px' : 'auto'};
        }

        .hero-content-wrapper {
          max-width: 900px;
          width: 100%;
          text-align: center;
          color: #ffffff;
          z-index: 2;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-sizing: border-box;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background-color: rgba(139, 11, 11, 0.9);
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 30px;
          margin-bottom: 18px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
        }

        .hero-heading {
          font-size: clamp(24px, 4.5vw, 44px);
          font-weight: 900;
          text-transform: uppercase;
          line-height: 1.25;
          margin: 0 0 15px 0;
          color: #ffffff;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
        }

        .hero-desc {
          font-size: clamp(14px, 1.8vw, 16px);
          color: #e0e0e0;
          line-height: 1.5;
          max-width: 650px;
          margin: 0 auto 25px auto;
          font-weight: 400;
        }

        .hero-btn-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          margin-bottom: 20px;
          width: 100%;
        }

        .hero-btn {
          padding: 13px 26px;
          border-radius: 6px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.2s;
          cursor: pointer;
        }

        .hero-btn:hover {
          transform: translateY(-2px);
        }

        .quote-btn {
          background-color: #8b0b0b;
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(139, 11, 11, 0.4);
        }

        .wa-btn {
          background-color: #25D366;
          color: #ffffff;
          box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
        }

        .hero-dots-container {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 15px;
        }

        .hero-dot {
          height: 8px;
          width: 8px;
          border-radius: 4px;
          background-color: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }

        .hero-dot.active {
          width: 22px;
          background-color: #8b0b0b;
        }

        @media (max-width: 768px) {
          .hero-main-section {
            min-height: 80vh;
            padding: 50px 15px;
          }

          .hero-arrow-btn {
            width: 38px;
            height: 38px;
          }

          .left-arrow {
            left: 10px;
          }

          .right-arrow {
            right: 10px;
          }

          .hero-btn {
            width: 100%;
            max-width: 280px;
          }
        }
      `}</style>
    </section>
  );
}