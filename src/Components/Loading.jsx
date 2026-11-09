import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 5 یا 20 سیکنڈ کا ٹائمر (یہاں آپ سیکنڈز اپنے حساب سے کم یا زیادہ کر سکتے ہیں)
    const timer = setTimeout(() => {
      navigate('/home');
    }, 5000); // مثال کے طور پر 5 سیکنڈ

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loader-wrapper" role="status" aria-label="Loading Al-Saqar Spare Parts">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;800;900&family=Montserrat:wght@400;600&display=swap"
      />

      <style>{`
        .loader-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background-color: #000000;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          text-align: center;
          padding: 20px;
          box-sizing: border-box;
        }

        .brand-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .title-primary {
          font-family: 'Cinzel', serif;
          color: #8B0000;
          font-size: clamp(2.2rem, 6vw, 4.5rem);
          font-weight: 900;
          letter-spacing: 6px;
          text-transform: uppercase;
          text-shadow: 0 0 15px rgba(139, 0, 0, 0.6);
          margin: 0;
          animation: fadeInGlow 2s ease-in-out infinite alternate;
        }

        .subtitle {
          font-family: 'Montserrat', sans-serif;
          color: #aaaaaa;
          font-size: clamp(0.9rem, 2vw, 1.3rem);
          letter-spacing: 8px;
          text-transform: uppercase;
          margin-top: 10px;
          border-top: 1px solid #222222;
          border-bottom: 1px solid #222222;
          padding: 6px 20px;
        }

        .dots-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 40px;
        }

        .dot {
          width: 14px;
          height: 14px;
          background-color: #8B0000;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(139, 0, 0, 0.8);
          animation: dotBounce 1.4s infinite ease-in-out both;
        }

        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        .dot:nth-child(3) { animation-delay: 0s; }

        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.3); opacity: 0.3; }
          40% { transform: scale(1.2); opacity: 1; background-color: #B22222; }
        }

        @keyframes fadeInGlow {
          from { text-shadow: 0 0 8px rgba(139, 0, 0, 0.4); }
          to { text-shadow: 0 0 20px rgba(139, 0, 0, 0.9), 0 0 30px rgba(139, 0, 0, 0.5); }
        }
      `}</style>

      <div className="brand-container">
        <h1 className="title-primary">AL-SAQAR</h1>
        <div className="subtitle">SPARE PARTS</div>
      </div>

      <div className="dots-container" aria-hidden="true">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default LoadingPage;