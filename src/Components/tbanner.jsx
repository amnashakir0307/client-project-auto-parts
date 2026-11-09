import React from 'react';
import { useTranslation } from 'react-i18next';

export default function TrustBanner() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <section className="trust-banner-section" id="trust-banner">
      <div className={`trust-banner-container ${isRtl ? 'rtl' : 'ltr'}`}>
        <div className="trust-banner-content">
          <span className="trust-badge">{t('trustBannerBadge')}</span>
          <h2>{t('trustBannerTitle')}</h2>
          
          <div className="trust-btn-wrapper">
            <a 
              href="https://wa.me/966502748270?text=Hello%20Al-Saqar,%20I%20want%20to%20inquire%20about%20spare%20parts." 
              target="_blank" 
              rel="noopener noreferrer" 
              className="trust-whatsapp-btn"
            >
              💬 {t('contactBtnText')}
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .trust-banner-section {
            position: relative;
            width: 100%;
            min-height: 280px;
            background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/bnr2.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            font-family: 'Inter', sans-serif;
            box-sizing: border-box;
            margin: 30px 0;
        }

        .trust-banner-container {
            max-width: 1100px;
            width: 100%;
            margin: 0 auto;
            text-align: center;
            box-sizing: border-box;
        }

        .trust-banner-container.rtl {
            direction: rtl;
        }

        .trust-banner-container.ltr {
            direction: ltr;
        }

        .trust-banner-content {
            background: rgba(15, 15, 15, 0.65);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            padding: 35px 30px;
            border-radius: 14px;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .trust-badge {
            display: inline-block;
            background-color: #e60000;
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
            padding: 5px 14px;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-bottom: 12px;
            box-shadow: 0 3px 10px rgba(230, 0, 0, 0.4);
        }

        .trust-banner-content h2 {
            font-size: 26px;
            font-weight: 800;
            color: #ffffff;
            line-height: 1.4;
            margin-bottom: 20px;
            max-width: 850px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .trust-whatsapp-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: #e60000;
            color: #ffffff;
            padding: 11px 26px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 700;
            font-size: 14px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(230, 0, 0, 0.4);
        }

        .trust-whatsapp-btn:hover {
            background-color: #cc0000;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(230, 0, 0, 0.6);
        }

        @media (max-width: 768px) {
            .trust-banner-section {
                min-height: 220px;
                padding: 25px 15px;
                margin: 20px 0;
            }

            .trust-banner-content {
                padding: 25px 18px;
            }

            .trust-banner-content h2 {
                font-size: 17px;
                margin-bottom: 16px;
                line-height: 1.35;
            }

            .trust-badge {
                font-size: 10px;
                padding: 4px 10px;
                margin-bottom: 10px;
            }

            .trust-whatsapp-btn {
                font-size: 12px;
                padding: 9px 20px;
            }
        }
      `}</style>
    </section>
  );
}