import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaWhatsapp } from 'react-icons/fa';

const LocationContactSection = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <section className="location-section" id="contact">
      <div className={`location-container ${isRtl ? 'rtl' : 'ltr'}`}>
        
        {/* Section Heading */}
        <div className="location-header">
          <div className="location-badge-wrapper">
            <div className="location-badge">
              <span className="badge-dot"></span>
              {t('contactBadge') || 'Get In Touch'}
            </div>
          </div>
          <h2>{t('getInTouchTitlePart1')} <span>{t('getInTouchTitlePart2')}</span></h2>
          <p className="location-header-subtitle">Visit our office or reach out to us instantly through our channels.</p>
        </div>

        {/* Main Grid Container */}
        <div className="location-grid">
          
          {/* Left Side: Interactive Map Card */}
          <div className="map-card">
            <div className="card-bg-overlay"></div>
            <div className="map-card-inner-content">
              <div className="map-frame-wrapper">
                <iframe 
                  title="Al-Saqar Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3715.5!2d39.82!3d21.42!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDI1JzEyLjAiTiAz!5e0!3m2!1sen!2s!4v1650000000000!5m2!1sen!2s" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0, display: 'block', minHeight: '380px' }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Right Side: Company Details & Contact Info Card */}
          <div className="info-card">
            <div className="card-bg-overlay"></div>
            <div className="info-card-inner-content">
              <div>
                <h3>{t('visitOurOffice')}</h3>

                {/* Info Items */}
                <div className="info-items-list">
                  
                  {/* Address */}
                  <div className="info-item">
                    <div className="icon-box">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="info-text">
                      <strong>{t('addressLabel')}</strong>
                      <span>{t('addressValue')}</span>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="info-item">
                    <div className="icon-box">
                      <FaPhoneAlt />
                    </div>
                    <div className="info-text">
                      <strong>{t('phoneLabel')}</strong>
                      <span className="ltr-text">+966 50 274 8270</span>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="info-item">
                    <div className="icon-box">
                      <FaEnvelope />
                    </div>
                    <div className="info-text">
                      <strong>{t('emailLabel')}</strong>
                      <span className="ltr-text">saqrcompany4@gmail.com</span>
                    </div>
                  </div>

                  {/* Timings */}
                  <div className="info-item">
                    <div className="icon-box">
                      <FaClock />
                    </div>
                    <div className="info-text">
                      <strong>{t('storeTimingsLabel')}</strong>
                      <span className="timing-val">{t('storeTimingsValue')}</span>
                      <span className="off-day">{t('fridayOff')}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Quick Action Button for WhatsApp */}
              <div className="whatsapp-action-wrap">
                <a 
                  href="https://wa.me/966502748270" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="whatsapp-connect-btn"
                >
                  <span className="wa-ico"><FaWhatsapp /></span> 
                  <span>{t('connectWhatsApp')}</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap');

        .location-section {
            position: relative;
            background: linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url('/faq.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            padding: 80px 20px;
            font-family: 'Montserrat', sans-serif;
            width: 100%;
            box-sizing: border-box;
            border-bottom: 2px solid #eaeaea;
        }

        .location-container {
            max-width: 1200px;
            margin: 0 auto;
            box-sizing: border-box;
            position: relative;
            z-index: 2;
        }

        .location-container.rtl {
            direction: rtl;
            text-align: right;
        }

        .location-container.ltr {
            direction: ltr;
            text-align: left;
        }

        .location-header {
            text-align: center;
            margin-bottom: 45px;
        }

        .location-badge-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            margin-bottom: 12px;
        }

        .location-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #fff5f5;
            color: #d32f2f;
            padding: 6px 16px;
            border-radius: 30px;
            font-size: 11.5px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            border: 1.5px solid rgba(211, 47, 47, 0.2);
            box-shadow: 0 4px 12px rgba(211, 47, 47, 0.06);
        }

        .badge-dot {
            width: 6px;
            height: 6px;
            background-color: #d32f2f;
            border-radius: 50%;
            animation: pulse-dot 1.5s infinite;
        }

        @keyframes pulse-dot {
            0% { transform: scale(0.95); opacity: 0.8; }
            50% { transform: scale(1.3); opacity: 1; box-shadow: 0 0 8px #d32f2f; }
            100% { transform: scale(0.95); opacity: 0.8; }
        }

        .location-header h2 {
            font-size: clamp(26px, 3.5vw, 34px);
            font-weight: 900;
            color: #111111;
            letter-spacing: -0.02em;
            margin: 0 0 10px 0;
            text-transform: uppercase;
        }

        .location-header h2 span {
            color: #d32f2f;
        }

        .location-header-subtitle {
            font-size: 14px;
            color: #666666;
            font-weight: 500;
            margin: 0;
        }

        .location-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            align-items: stretch;
        }

        .map-card,
        .info-card {
            position: relative;
            background: url('/location.jpg');
            background-size: cover;
            background-position: center;
            border: 2px solid #e5e7eb;
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.04);
            box-sizing: border-box;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .card-bg-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.95);
            z-index: 1;
        }

        .map-card-inner-content,
        .info-card-inner-content {
            position: relative;
            z-index: 2;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
        }

        .map-card {
            padding: 16px;
        }

        .map-frame-wrapper {
            width: 100%;
            flex: 1;
            min-height: 400px;
            border-radius: 12px;
            overflow: hidden;
            background: #f8f9fa;
        }

        .info-card {
            padding: 30px;
        }

        .info-card h3 {
            font-size: 19px;
            font-weight: 800;
            color: #111111;
            margin: 0 0 20px 0;
            text-transform: uppercase;
            border-bottom: 2px solid #f1f3f5;
            padding-bottom: 12px;
        }

        .info-items-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .info-item {
            display: flex;
            align-items: flex-start;
            gap: 14px;
        }

        .rtl .info-item {
            flex-direction: row-reverse;
            text-align: right;
        }

        .icon-box {
            width: 40px;
            height: 40px;
            min-width: 40px;
            border-radius: 10px;
            background: #fff5f5;
            border: 1.5px solid rgba(211, 47, 47, 0.2);
            color: #d32f2f;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            flex-shrink: 0;
            margin-top: 2px;
            box-shadow: 0 4px 10px rgba(211, 47, 47, 0.06);
        }

        .info-text {
            display: flex;
            flex-direction: column;
        }

        .info-text strong {
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 3px;
            font-weight: 800;
        }

        .info-text span {
            font-size: 13.5px;
            color: #111111;
            font-weight: 700;
            line-height: 1.4;
        }

        .ltr-text {
            direction: ltr;
            unicode-bidi: embed;
        }

        .rtl .ltr-text {
            text-align: right;
        }

        .timing-val {
            display: block;
            margin-bottom: 2px;
        }

        .off-day {
            font-size: 12px !important;
            color: #d32f2f !important;
            font-weight: 800 !important;
        }

        .whatsapp-action-wrap {
            margin-top: 20px;
            border-top: 2px solid #f1f3f5;
            padding-top: 18px;
        }

        .whatsapp-connect-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            background: #111111;
            color: #ffffff;
            width: 100%;
            padding: 14px;
            border-radius: 10px;
            border: none;
            font-weight: 900;
            font-size: 13.5px;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .wa-ico {
            font-size: 17px;
            display: flex;
            align-items: center;
            color: #25D366;
        }

        .whatsapp-connect-btn:hover {
            background: #d32f2f;
            transform: translateY(-2px);
            box-shadow: 0 10px 24px rgba(211, 47, 47, 0.3);
        }

        .whatsapp-connect-btn:hover .wa-ico {
            color: #ffffff;
        }

        @media (max-width: 992px) {
            .location-grid {
                grid-template-columns: 1fr;
            }

            .location-section {
                padding: 50px 15px;
            }

            .map-frame-wrapper {
                min-height: 320px;
            }
        }
      `}</style>
    </section>
  );
};

export default LocationContactSection;