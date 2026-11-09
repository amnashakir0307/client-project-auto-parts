import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp, FaShieldAlt, FaClock, FaCheckCircle, FaCarSide } from 'react-icons/fa';

export default function OrderSection() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicle: '',
    chassis: '',
    partDetails: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, phone, vehicle, chassis, partDetails } = formData;
    
    const whatsappMessage = `*New Part Request - Al-Saqar*\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Vehicle:* ${vehicle}\n*Chassis/VIN:* ${chassis || 'N/A'}\n*Required Parts:* ${partDetails}`;
    
    const encodedMessage = encodeURIComponent(whatsappMessage);
    window.open(`https://wa.me/966502748270?text=${encodedMessage}`, '_blank');
  };

  return (
    <section className="order-section" id="order">
      <div className={`order-container ${isRtl ? 'rtl' : 'ltr'}`}>
        
        {/* Section Header */}
        <div className="order-header">
          <div className="order-logo-center-wrapper">
            <div className="order-badge">
              <span className="badge-dot"></span>
              {t('orderSectionBadge')}
            </div>
          </div>
          <h2>{t('orderSectionTitle')} <span>{t('orderSectionTitleSpan')}</span></h2>
          <p className="order-header-subtitle">Fast, reliable, and direct spare parts inquiry via WhatsApp.</p>
        </div>

        {/* Main Grid Wrapper */}
        <div className="order-content-grid">
          
          {/* Left Info Box - Centered & Modern Solid Light Theme */}
          <div className="order-info-box">
            <div className="info-top-centered">
              <div className="info-icon-wrapper">
                <FaCarSide className="info-main-icon" />
              </div>
              <h3>{t('orderBoxHeading')}</h3>
              <p>{t('orderBoxDesc')}</p>
            </div>

            <div className="info-highlights">
              <div className="highlight-item">
                <div className="check-icon"><FaCheckCircle /></div> 
                <span>{t('highlight1')}</span>
              </div>
              <div className="highlight-item">
                <div className="check-icon"><FaCheckCircle /></div> 
                <span>{t('highlight2')}</span>
              </div>
              <div className="highlight-item">
                <div className="check-icon"><FaCheckCircle /></div> 
                <span>{t('highlight3')}</span>
              </div>
            </div>

            <div className="info-footer">
              <div className="footer-clock-icon"><FaClock /></div>
              <p>{t('workingHoursText')}</p>
            </div>
          </div>

          {/* Right Form Box - Solid Clean Theme with Floating Labels */}
          <div className="order-form-box">
            <div className="form-box-header">
              <h3>{t('formHeading')}</h3>
              <span className="secure-badge"><FaShieldAlt /> Secure Request</span>
            </div>

            <form onSubmit={handleSubmit}>
              
              <div className="form-row">
                <div className={`floating-group ${formData.name ? 'has-value' : ''}`}>
                  <input 
                    type="text" 
                    name="name" 
                    required 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder=" "
                  />
                  <label>{t('labelName')}</label>
                </div>

                <div className={`floating-group ${formData.phone ? 'has-value' : ''}`}>
                  <input 
                    type="text" 
                    name="phone" 
                    required 
                    value={formData.phone} 
                    onChange={handleChange} 
                    placeholder=" "
                  />
                  <label>{t('labelPhone')}</label>
                </div>
              </div>

              <div className="form-row">
                <div className={`floating-group ${formData.vehicle ? 'has-value' : ''}`}>
                  <input 
                    type="text" 
                    name="vehicle" 
                    required 
                    value={formData.vehicle} 
                    onChange={handleChange} 
                    placeholder=" "
                  />
                  <label>{t('labelVehicle')}</label>
                </div>

                <div className={`floating-group ${formData.chassis ? 'has-value' : ''}`}>
                  <input 
                    type="text" 
                    name="chassis" 
                    value={formData.chassis} 
                    onChange={handleChange} 
                    placeholder=" "
                  />
                  <label>{t('labelChassis')} <span className="optional">({t('optionalText')})</span></label>
                </div>
              </div>

              <div className={`floating-group full-width ${formData.partDetails ? 'has-value' : ''}`}>
                <textarea 
                  name="partDetails" 
                  rows="3" 
                  required 
                  value={formData.partDetails} 
                  onChange={handleChange}
                  placeholder=" "
                ></textarea>
                <label>{t('labelPartDetails')}</label>
              </div>

              <button type="submit" className="whatsapp-submit-btn">
                <span className="wa-icon-wrap"><FaWhatsapp /></span> 
                <span>{t('whatsappButtonText')}</span>
              </button>

            </form>
          </div>

        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800;900&display=swap');

        /* Main Section Background with Light faq.jpg */
        .order-section {
            position: relative;
            background: linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url('/faq.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            padding: 90px 20px;
            font-family: 'Montserrat', sans-serif;
            width: 100%;
            box-sizing: border-box;
            border-bottom: 2px solid #eaeaea;
        }

        .order-container {
            max-width: 1200px;
            margin: 0 auto;
            box-sizing: border-box;
            position: relative;
            z-index: 2;
        }

        .order-container.rtl {
            direction: rtl;
            text-align: right;
        }

        .order-container.ltr {
            direction: ltr;
            text-align: left;
        }

        .order-header {
            text-align: center;
            margin-bottom: 50px;
        }

        .order-logo-center-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            margin-bottom: 14px;
        }

        .order-badge {
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

        .order-header h2 {
            font-size: clamp(26px, 3.5vw, 36px);
            font-weight: 900;
            color: #111111;
            letter-spacing: -0.02em;
            margin: 0 0 10px 0;
            text-transform: uppercase;
        }

        .order-header h2 span {
            color: #d32f2f;
        }

        .order-header-subtitle {
            font-size: 14px;
            color: #666666;
            font-weight: 500;
            margin: 0;
        }

        .order-content-grid {
            display: flex;
            gap: 30px;
            align-items: stretch;
            justify-content: center;
        }

        .rtl .order-content-grid {
            flex-direction: row-reverse;
        }

        /* Left Info Box - Solid Clean Aesthetic (No Image) & Centered Logo */
        .order-info-box {
            flex: 1;
            background: #ffffff;
            border: 2px solid #e5e7eb;
            border-left: 6px solid #d32f2f;
            border-radius: 20px;
            padding: 40px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.04);
            box-sizing: border-box;
            transition: all 0.3s ease;
        }

        .rtl .order-info-box {
            border-left: 2px solid #e5e7eb;
            border-right: 6px solid #d32f2f;
        }

        .order-info-box:hover {
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
            border-color: #d32f2f;
        }

        .info-top-centered {
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .info-icon-wrapper {
            width: 60px;
            height: 60px;
            background: #fff5f5;
            border: 2px solid #d32f2f;
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #d32f2f;
            font-size: 26px;
            margin-bottom: 20px;
            box-shadow: 0 6px 15px rgba(211, 47, 47, 0.12);
        }

        .info-top-centered h3 {
            font-size: 22px;
            font-weight: 800;
            color: #111111;
            margin-bottom: 14px;
            line-height: 1.3;
        }

        .info-top-centered p {
            font-size: 14px;
            color: #555555;
            line-height: 1.7;
            margin-bottom: 30px;
            font-weight: 500;
        }

        .info-highlights {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 35px;
        }

        .highlight-item {
            display: flex;
            align-items: center;
            gap: 14px;
            font-size: 14px;
            color: #222222;
            font-weight: 700;
        }

        .rtl .highlight-item {
            flex-direction: row-reverse;
        }

        .check-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #25D366;
            font-size: 18px;
            flex-shrink: 0;
        }

        .info-footer {
            border-top: 2px solid #f1f3f5;
            padding-top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .footer-clock-icon {
            color: #d32f2f;
            font-size: 16px;
        }

        .info-footer p {
            font-size: 12.5px;
            color: #666666;
            margin: 0;
            font-weight: 700;
        }

        /* Right Form Box - Solid Clean Aesthetic (No Image) */
        .order-form-box {
            flex: 1.1;
            background: #ffffff;
            border: 2px solid #e5e7eb;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.04);
            box-sizing: border-box;
            transition: all 0.3s ease;
        }

        .order-form-box:hover {
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
            border-color: #d32f2f;
        }

        .form-box-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            border-bottom: 2px solid #f1f3f5;
            padding-bottom: 15px;
        }

        .order-form-box h3 {
            font-size: 20px;
            font-weight: 800;
            color: #111111;
            margin: 0;
            text-transform: uppercase;
        }

        .secure-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-weight: 700;
            color: #16a34a;
            background: #f0fdf4;
            padding: 4px 10px;
            border-radius: 20px;
            border: 1px solid #bbf7d0;
        }

        .form-row {
            display: flex;
            gap: 15px;
        }

        /* Modern Floating Label Input System */
        .floating-group {
            position: relative;
            margin-bottom: 20px;
            flex: 1;
        }

        .floating-group.full-width {
            width: 100%;
        }

        .floating-group input,
        .floating-group textarea {
            width: 100%;
            background-color: #fafbfc;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 16px 16px 12px 16px;
            color: #111111;
            font-size: 14px;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
            outline: none;
            box-sizing: border-box;
            transition: all 0.25s ease;
        }

        .rtl .floating-group input,
        .rtl .floating-group textarea {
            padding: 16px 16px 12px 16px;
            text-align: right;
        }

        .floating-group textarea {
            resize: vertical;
            min-height: 95px;
        }

        .floating-group label {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: transparent;
            color: #6b7280;
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            pointer-events: none;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .floating-group textarea ~ label {
            top: 22px;
            transform: none;
        }

        .rtl .floating-group label {
            left: auto;
            right: 16px;
        }

        /* Floating Animation when focused or has value */
        .floating-group input:focus ~ label,
        .floating-group input:not(:placeholder-shown) ~ label,
        .floating-group.has-value input ~ label,
        .floating-group textarea:focus ~ label,
        .floating-group textarea:not(:placeholder-shown) ~ label,
        .floating-group.has-value textarea ~ label {
            top: 0px;
            transform: translateY(-50%) scale(0.85);
            background: #ffffff;
            padding: 0 6px;
            color: #d32f2f;
            font-weight: 800;
        }

        .floating-group input:focus,
        .floating-group textarea:focus {
            border-color: #d32f2f;
            background-color: #ffffff;
            box-shadow: 0 0 0 4px rgba(211, 47, 47, 0.08);
        }

        .optional {
            color: #9ca3af;
            font-weight: 600;
            font-size: 10px;
            text-transform: none;
        }

        .whatsapp-submit-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            background: #25D366;
            color: #ffffff;
            width: 100%;
            padding: 16px;
            border-radius: 12px;
            border: none;
            font-weight: 900;
            font-size: 15px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 8px 22px rgba(37, 211, 102, 0.3);
            margin-top: 5px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .wa-icon-wrap {
            font-size: 22px;
            display: flex;
            align-items: center;
        }

        .whatsapp-submit-btn:hover {
            background: #22bf5b;
            transform: translateY(-2px);
            box-shadow: 0 12px 28px rgba(37, 211, 102, 0.45);
        }

        @media (max-width: 992px) {
            .order-content-grid, .rtl .order-content-grid {
                flex-direction: column;
            }

            .order-section {
                padding: 60px 15px;
            }

            .order-info-box,
            .order-form-box {
                padding: 30px 20px;
            }

            .form-row {
                flex-direction: column;
                gap: 0;
            }
        }
      `}</style>
    </section>
  );
}