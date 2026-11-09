import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const brandsData = [
  { id: 1, name: 'ISUZU', logo: '/isuzu.jpg' },
  { id: 2, name: 'MITSUBISHI', logo: '/mitsubihi.jpg' },
  { id: 3, name: 'MG', logo: '/mg.jpg' },
  { id: 5, name: 'CHANGAN', logo: '/changan.jpg' },
];

const Deal = () => {
  const { t } = useTranslation();

  return (
    <section className="brands-bg-section" id="brands">
      {/* 1. Public Folder Image Background */}
      <div className="bg-image-layer"></div>

      {/* 2. Light Overlay + Blur Effect Layer */}
      <div className="bg-overlay-blur"></div>

      {/* 3. Main Content Container */}
      <div className="brands-container">
        
        {/* Section Header */}
        <motion.div 
          className="brands-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="brands-badge">{t('ourPartners') || 'Our Partners'}</span>
          <h2>
            BRANDS WE <span className="highlight-red">DEAL IN</span>
          </h2>
          <div className="red-accent-line"></div>
          <p>{t('brandsSubtitle') || 'Authentic supported OEM brands with high-performance parts'}</p>
        </motion.div>

        {/* Brands Cards Grid */}
        <div className="brands-grid">
          {brandsData.map((brand, index) => (
            <motion.div 
              key={brand.id} 
              className="brand-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              viewport={{ once: true }}
            >
              <div className="card-top-red-bar"></div>
              <div className="logo-box">
                <img src={brand.logo} alt={brand.name} />
              </div>
              <span className="brand-name-text">{brand.name}</span>
            </motion.div>
          ))}
        </div>

      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap');

        .brands-bg-section {
          position: relative;
          width: 100%;
          min-height: 480px;
          padding: 85px 20px;
          font-family: 'Montserrat', sans-serif;
          box-sizing: border-box;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: 1px solid #e2e8f0;
          border-bottom: 3px solid #D32F2F;
        }

        /* Public Folder Image Path */
        .bg-image-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('/hero1.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: 1;
        }

        /* Light White Overlay + Soft Blur Filter */
        .bg-overlay-blur {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          z-index: 2;
        }

        /* Content Layer */
        .brands-container {
          position: relative;
          max-width: 1150px;
          width: 100%;
          margin: 0 auto;
          text-align: center;
          z-index: 3;
        }

        .brands-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 48px;
        }

        .brands-badge {
          background-color: #D32F2F;
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          padding: 6px 18px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 12px;
          box-shadow: 0 4px 14px rgba(211, 47, 47, 0.3);
        }

        .brands-header h2 {
          font-size: clamp(26px, 3.5vw, 38px);
          font-weight: 900;
          color: #111111;
          letter-spacing: 0.8px;
          margin: 0 0 8px 0;
          text-transform: uppercase;
        }

        .highlight-red {
          color: #D32F2F;
        }

        .red-accent-line {
          width: 55px;
          height: 4px;
          background-color: #D32F2F;
          border-radius: 2px;
          margin-bottom: 14px;
        }

        .brands-header p {
          font-size: 14.5px;
          color: #333333;
          font-weight: 700;
          margin: 0;
        }

        .brands-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 24px;
          justify-content: center;
        }

        .brand-card {
          position: relative;
          background: rgba(255, 255, 255, 0.92);
          border: 1.5px solid rgba(211, 47, 47, 0.2);
          border-radius: 16px;
          padding: 26px 15px 20px 15px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(4px);
          transition: all 0.35s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
        }

        .card-top-red-bar {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background-color: #D32F2F;
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .brand-card:hover {
          border-color: #D32F2F;
          box-shadow: 0 12px 30px rgba(211, 47, 47, 0.25);
          background: #ffffff;
        }

        .brand-card:hover .card-top-red-bar {
          transform: scaleX(1);
        }

        .logo-box {
          height: 60px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }

        .logo-box img {
          max-width: 82%;
          max-height: 100%;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .brand-card:hover .logo-box img {
          transform: scale(1.08);
        }

        .brand-name-text {
          font-size: 13px;
          font-weight: 800;
          color: #111111;
          letter-spacing: 1px;
          transition: color 0.3s ease;
        }

        .brand-card:hover .brand-name-text {
          color: #D32F2F;
        }

        @media (max-width: 768px) {
          .brands-bg-section {
            padding: 55px 15px;
          }

          .brands-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }

          .brand-card {
            padding: 20px 10px 16px 10px;
          }

          .logo-box {
            height: 50px;
          }
        }
      `}</style>
    </section>
  );
};

export default Deal;