import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AboutUs() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <section className="about-us-section" id="about">
      <div className={`about-container ${isRtl ? 'rtl' : 'ltr'}`}>
        
        {/* Left Side: Image Box with background wallpaper and image */}
        <div className="about-image-box">
     
        </div>

        {/* Right Side: Text Box */}
        <div className="about-text-box">
          <div className="about-text-content">
            <h2>{t('aboutTitle')} <span>{t('aboutTitleHighlight')}</span></h2>
            <p>{t('aboutText1')}</p>
            <p>{t('aboutText2')}</p>
          </div>

          <div className="about-contact-info">
            <div className="contact-details">
              <span>📍 <strong>{t('locationLabel')}:</strong> Kingdom of Saudi Arabia - Makkah - Al-Ukaishiyah - New Industrial City</span>
            </div>
            <a 
              href="https://wa.me/966502748270?text=Hello%20Al-Saqar,%20I%20want%20to%20inquire%20about%20spare%20parts." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="contact-btn"
              aria-label="Contact Al-Saqar via WhatsApp"
            >
              💬 {t('contactBtnText')}
            </a>
          </div>
        </div>

      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');

        .about-us-section {
            background-image: linear-gradient(rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), url('/faq.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            padding: 70px 20px;
            font-family: 'Outfit', sans-serif;
            width: 100%;
            box-sizing: border-box;
            scroll-margin-top: 30px;
        }

        .about-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            gap: 30px;
            align-items: stretch;
            box-sizing: border-box;
        }

        .about-container.rtl {
            direction: rtl;
            text-align: right;
        }

        .about-container.ltr {
            direction: ltr;
            text-align: left;
        }

        .about-image-box {
            flex: 1;
            width: 100%;
            max-width: 580px;
            background-color: #ffffff;
            background-image: url('/about.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 16px;
            display: flex;
            align-items: stretch;
            justify-content: stretch;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            border: 1px solid #edf2f7;
            box-sizing: border-box;
            overflow: hidden;
            padding: 0;
            margin: 0;
            min-height: 420px;
        }

        .about-image-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 15px;
            display: block;
            margin: 0;
            padding: 0;
        }

        .about-text-box {
            flex: 1;
            width: 100%;
            max-width: 580px;
            background-color: #ffffff;
            padding: 35px 30px;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            border: 1px solid #edf2f7;
            border-left: 6px solid #D32F2F;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-sizing: border-box;
            text-align: center;
            align-items: center;
        }

        .rtl .about-text-box {
            border-left: 1px solid #edf2f7;
            border-right: 6px solid #D32F2F;
        }

        .about-text-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }

        .about-text-box h2 {
            font-size: 30px;
            font-weight: 800;
            margin-bottom: 15px;
            color: #0f172a;
            letter-spacing: -0.03em;
            text-align: center;
            width: 100%;
        }

        .about-text-box h2 span {
            color: #D32F2F;
        }

        .about-text-box p {
            font-size: 14.5px;
            line-height: 1.7;
            margin-bottom: 14px;
            color: #64748b;
            font-weight: 500;
            text-align: center;
            max-width: 95%;
        }

        .about-text-box strong {
            color: #0f172a;
            font-weight: 600;
        }

        .about-contact-info {
            margin-top: 20px;
            padding-top: 18px;
            border-top: 1px solid #f1f5f9;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 15px;
            width: 100%;
        }

        .contact-details {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 6px;
            font-size: 13.5px;
            color: #475569;
            font-weight: 500;
            width: 100%;
        }

        .contact-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: #D32F2F;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 0.02em;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(211, 47, 47, 0.25);
            width: 100%;
            max-width: 280px;
            box-sizing: border-box;
        }

        .contact-btn:hover {
            background-color: #b71c1c;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(211, 47, 47, 0.35);
        }

        @media (max-width: 768px) {
            .about-us-section {
                padding: 40px 15px;
            }

            .about-container {
                flex-direction: column;
                gap: 25px;
            }

            .about-image-box {
                max-width: 100%;
                min-height: 260px;
                max-height: 300px;
            }

            .about-text-box {
                max-width: 100%;
                padding: 25px 20px;
                border-left: none;
                border-top: 5px solid #D32F2F;
            }

            .rtl .about-text-box {
                border-right: none;
                border-top: 5px solid #D32F2F;
            }

            .about-text-box h2 {
                font-size: 24px;
            }

            .about-text-box p {
                font-size: 13.5px;
                max-width: 100%;
            }

            .contact-btn {
                max-width: 100%;
                padding: 12px 20px;
            }
        }
      `}</style>
    </section>
  );
}