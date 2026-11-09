import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

export default function AlSaqarFooter() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const isRTL = i18n.language === 'ar';

  const handleSubscribe = (e) => {
    e.preventDefault();
    const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (!email.match(emailPattern)) {
      setMessage({ text: t('invalidEmail') || 'Please enter a valid email address.', color: '#ff4d4d' });
      return;
    }

    setMessage({ text: 'You have successfully subscribed!', color: '#2ecc71' });
    setEmail('');

    setTimeout(() => {
      setMessage({ text: '', color: '' });
    }, 4000);
  };

  const scrollToSection = (targetId) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <style>{`
        .site-footer {
            position: relative;
            background: linear-gradient(rgba(0, 0, 0, 0.9), rgba(10, 10, 10, 0.95)), url('/FOOTR.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            color: #ffffff;
            padding: 60px 0 30px 0;
            border-top: 3px solid #8b0b0b;
            font-family: 'Poppins', sans-serif;
            width: 100%;
            box-sizing: border-box;
        }

        .footer-container {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 40px;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 40px;
            box-sizing: border-box;
        }

        .footer-col {
            width: 100%;
            box-sizing: border-box;
        }

        .footer-col h3 {
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 1px;
            position: relative;
            padding-bottom: 8px;
        }

        .footer-col h3::after {
            content: '';
            position: absolute;
            bottom: 0;
            width: 30px;
            height: 2px;
            background-color: #8b0b0b;
            border-radius: 2px;
        }

        .footer-col p {
            color: #b5b5b5;
            font-size: 14px;
            margin-bottom: 12px;
            line-height: 1.6;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }

        .footer-col p i {
            margin-top: 4px;
            flex-shrink: 0;
        }

        .footer-col ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .footer-col ul li {
            margin-bottom: 10px;
        }

        .footer-col ul li button {
            background: none;
            border: none;
            color: #b5b5b5;
            cursor: pointer;
            text-decoration: none;
            font-size: 14px;
            padding: 0;
            font-family: inherit;
            transition: all 0.3s ease;
            display: inline-block;
            position: relative;
        }

        .footer-col ul li button:hover {
            color: #ffffff;
        }

        .footer-col ul li button::after {
            content: '';
            position: absolute;
            bottom: -2px;
            width: 0;
            height: 2px;
            background-color: #8b0b0b;
            transition: width 0.3s ease;
        }

        .footer-col ul li button:hover::after {
            width: 100%;
        }

        .footer-form {
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 100%;
        }

        .footer-form input {
            padding: 12px 14px;
            background-color: rgba(20, 20, 20, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #ffffff;
            border-radius: 6px;
            font-family: 'Poppins', sans-serif;
            outline: none;
            font-size: 13.5px;
            transition: all 0.3s ease;
            width: 100%;
            box-sizing: border-box;
        }

        .footer-form input:focus {
            border-color: #8b0b0b;
            box-shadow: 0 0 8px rgba(139, 11, 11, 0.3);
            background-color: rgba(10, 10, 10, 0.95);
        }

        .footer-form button[type="submit"] {
            padding: 12px 14px;
            background-color: #8b0b0b;
            color: #ffffff;
            border: none;
            font-weight: 600;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
            width: 100%;
        }

        .footer-form button[type="submit"]:hover {
            background-color: #a30d0d;
            transform: translateY(-2px);
        }

        .form-message {
            font-size: 12px;
            margin-top: 2px;
            min-height: 16px;
            font-weight: 500;
        }

        .footer-bottom {
            width: 100%;
            max-width: 1400px;
            margin: 40px auto 0 auto;
            padding: 25px 40px 0 40px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-sizing: border-box;
        }

        .social-links {
            display: flex;
            gap: 12px;
        }

        .social-links a {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            background-color: rgba(255, 255, 255, 0.05);
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            text-decoration: none;
            font-size: 15px;
            transition: all 0.3s ease;
        }

        .social-links a:hover {
            background-color: #8b0b0b;
            color: #ffffff;
            border-color: #8b0b0b;
            transform: translateY(-2px);
        }

        .copyright {
            color: #999999;
            font-size: 13px;
            margin: 0;
        }

        /* Directional Control: LTR (English) vs RTL (Arabic) */
        .site-footer.ltr {
            direction: ltr;
            text-align: left;
        }
        .site-footer.ltr .footer-col h3::after {
            left: 0;
        }
        .site-footer.ltr .footer-col ul li button:hover {
            transform: translateX(4px);
        }
        .site-footer.ltr .social-links {
            justify-content: flex-start;
        }
        .site-footer.ltr .copyright {
            text-align: right;
        }

        .site-footer.rtl {
            direction: rtl;
            text-align: right;
        }
        .site-footer.rtl .footer-col h3::after {
            right: 0;
        }
        .site-footer.rtl .footer-col ul li button:hover {
            transform: translateX(-4px);
        }
        .site-footer.rtl .social-links {
            justify-content: flex-start;
        }
        .site-footer.rtl .copyright {
            text-align: left;
        }

        /* Large Screen Adjustments */
        @media (min-width: 1400px) {
            .footer-container, .footer-bottom {
                max-width: 1500px;
                padding: 0 60px;
            }
            .footer-col h3 {
                font-size: 18px;
            }
            .footer-col p, .footer-col ul li button, .copyright {
                font-size: 15px;
            }
        }

        /* Tablet Screens */
        @media (max-width: 1024px) {
            .footer-container {
                grid-template-columns: repeat(2, 1fr);
                gap: 30px;
                padding: 0 30px;
            }
        }

        /* Mobile View */
        @media (max-width: 768px) {
            .site-footer {
                padding: 40px 0 20px 0;
            }
            .footer-container {
                grid-template-columns: 1fr;
                padding: 0 20px;
                gap: 35px;
                text-align: center;
                justify-items: center;
            }
            .footer-col {
                text-align: center !important;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .footer-col h3 {
                text-align: center !important;
                width: 100%;
            }
            .footer-col h3::after {
                left: 50% !important;
                right: auto !important;
                transform: translateX(-50%);
            }
            .footer-col p {
                justify-content: center;
                text-align: center !important;
                width: 100%;
            }
            .footer-col ul {
                text-align: center !important;
                width: 100%;
            }
            .footer-col ul li {
                text-align: center !important;
            }
            .footer-col ul li button {
                text-align: center !important;
            }
            .footer-col ul li button::after {
                left: 50% !important;
                right: auto !important;
                transform: translateX(-50%);
            }
            .footer-col ul li button:hover {
                transform: translateY(-2px) !important;
            }
            .footer-form {
                align-items: center;
                width: 100%;
                max-width: 320px;
                margin: 0 auto;
            }
            .footer-form input, .footer-form button[type="submit"] {
                text-align: center;
            }
            .form-message {
                text-align: center !important;
                width: 100%;
            }
            .footer-bottom {
                padding: 20px 20px 0 20px;
                flex-direction: column;
                align-items: center;
                text-align: center;
                gap: 20px;
            }
            .social-links {
                justify-content: center;
                width: 100%;
            }
            .copyright {
                text-align: center !important;
                width: 100%;
            }
        }
      `}</style>

      <footer className={`site-footer ${isRTL ? 'rtl' : 'ltr'}`}>
        <div className="footer-container">
          
          {/* Column 1: Brand & Description */}
          <div className="footer-col">
            <h3>Al-Saqar</h3>
            <p>
              {t('brandDesc')}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h3>{t('quickLinks')}</h3>
            <ul>
              <li><button onClick={() => scrollToSection('hero')}>{t('home')}</button></li>
              <li><button onClick={() => scrollToSection('about')}>{t('about')}</button></li>
              <li><button onClick={() => scrollToSection('why-us')}>{t('whyUs')}</button></li>
              <li><button onClick={() => scrollToSection('location')}>{t('location')}</button></li>
              <li><button onClick={() => scrollToSection('faq')}>{t('faq')}</button></li>
              <li><button onClick={() => scrollToSection('contact')}>{t('contact')}</button></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="footer-col">
            <h3>{t('contactTitle')}</h3>
            <p><i className="fas fa-map-marker-alt"></i> Kingdom of Saudi Arabia - Makkah - Al-Ukaishiyah - New Industrial City</p>
            
            <p><i className="fab fa-whatsapp"></i> +966 50 274 8270</p>
            <p><i className="fas fa-envelope"></i> saqrcompany4@gmail.com</p>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-col">
            <h3>{t('newsletter')}</h3>
            <form className="footer-form" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder={t('emailPlaceholder')} 
                required 
              />
              <button type="submit">{t('subscribe')}</button>
              <div className="form-message" style={{ color: message.color }}>
                {message.text}
              </div>
            </form>
          </div>

        </div>

        {/* Bottom Bar with Social Media Icons & Copyright */}
        <div className="footer-bottom">
          <div className="social-links">
            <a href="https://www.facebook.com/share/19aaniz2no/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
            <a href="https://www.instagram.com/alsaqar_spare_parts?utm_source=qr&stkn=MXdicjBicnh6anJ5Mw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><FaTiktok /></a>
          </div>
          <p className="copyright">{t('rights')}</p>
        </div>
      </footer>
    </>
  );
}