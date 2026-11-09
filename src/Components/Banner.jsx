import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Banner() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <section className="slim-banner-section" id="banner">
      {/* Inner Red Lines (Inside Section Offset) */}
      <div className="banner-red-line top-line"></div>

      <div className={`slim-banner-container ${isRtl ? 'rtl' : 'ltr'}`}>
        
        <div className="slim-banner-content">
          <span className="slim-badge">{t('bannerBadge')}</span>
          <h2>{t('bannerImageTitle')}</h2>
          
          <div className="slim-btn-wrapper">
            <a 
              href="https://wa.me/966502748270?text=Hello%20Al-Saqar,%20I%20want%20to%20inquire%20about%20spare%20parts." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="slim-whatsapp-btn"
            >
              💬 {t('contactBtnText')}
            </a>
          </div>
        </div>

      </div>

      <div className="banner-red-line bottom-line"></div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800;900&display=swap');

        .slim-banner-section {
            position: relative;
            width: 100%;
            min-height: 340px; 
            background-color: #000000;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 60px 15px;
            font-family: 'Montserrat', sans-serif;
            box-sizing: border-box;
            overflow: hidden;
        }

        /* Inner Red Lines Placement */
        .banner-red-line {
            position: absolute;
            left: 0;
            width: 100%;
            height: 3px;
            background-color: #D32F2F;
            box-shadow: 0 0 10px rgba(211, 47, 47, 0.8);
            z-index: 2;
        }

        .top-line {
            top: 20px;
        }

        .bottom-line {
            bottom: 20px;
        }

        .slim-banner-container {
            max-width: 1050px;
            width: 100%;
            margin: 0 auto;
            text-align: center;
            box-sizing: border-box;
            padding: 0 50px; 
            position: relative;
            z-index: 1;
        }

        .slim-banner-container.rtl {
            direction: rtl;
        }

        .slim-banner-container.ltr {
            direction: ltr;
        }

        .slim-banner-content {
            background: transparent;
            padding: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            max-width: 780px;
        }

        .slim-badge {
            display: inline-block;
            background-color: #D32F2F;
            color: #ffffff;
            font-size: 11.5px;
            font-weight: 700;
            padding: 6px 16px;
            border-radius: 25px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            margin-bottom: 14px;
            box-shadow: 0 4px 15px rgba(211, 47, 47, 0.4);
        }

        .slim-banner-content h2 {
            font-size: clamp(22px, 3.2vw, 34px);
            font-weight: 900;
            color: #ffffff;
            line-height: 1.4;
            margin-bottom: 22px;
            letter-spacing: 0.5px;
            text-shadow: 0 3px 12px rgba(0, 0, 0, 0.85);
        }

        .slim-whatsapp-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: #D32F2F;
            color: #ffffff;
            padding: 12px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 800;
            font-size: 14.5px;
            letter-spacing: 0.4px;
            transition: all 0.3s ease;
            box-shadow: 0 6px 22px rgba(211, 47, 47, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .slim-whatsapp-btn:hover {
            background-color: #b71c1c;
            transform: translateY(-3px);
            box-shadow: 0 8px 28px rgba(211, 47, 47, 0.7);
        }

        @media (max-width: 768px) {
            .slim-banner-section {
                min-height: 270px;
                padding: 40px 10px;
            }

            .top-line {
                top: 12px;
            }

            .bottom-line {
                bottom: 12px;
            }

            .banner-red-line {
                height: 2px;
            }

            .slim-banner-container {
                padding: 0 25px;
            }

            .slim-banner-content h2 {
                font-size: 17.5px;
                margin-bottom: 16px;
            }

            .slim-whatsapp-btn {
                font-size: 12.5px;
                padding: 10px 22px;
            }
        }
      `}</style>
    </section>
  );
}