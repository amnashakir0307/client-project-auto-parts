import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Probnr2 from './Components/Probnr2';      // Import the new banner component
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Hero from './Components/Hero';
          import Admin from './Components/Admin';
import About from './Components/About';
import Order from './Components/Order';
import FAQ from './Components/FAQ';
import State, { PromoBeforeFooter } from './Components/State';
import Ai from './Components/Ai';
import LCS from './Components/LCS';
import Orderform from './Components/Orderform';
import Banner from './Components/Banner';
import PromoBanner from './Components/PromoBanner'; // <--- نیا بینر یہاں امپورٹ کیا گیا ہے
import LoadingPage from './Components/Loading';
import Shop from './Components/Shop';
import HomeShopSections, { ShopPreview, BestSellers } from './Components/HomeShopSections';
import WH from './Components/WHY';
import Deal from './Components/Deal';
import { FaShieldAlt, FaCog, FaHeadset, FaStar } from 'react-icons/fa';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <div id="hero"><Hero /></div>

      <div id="state"><State /></div>
      <ShopPreview />

      <div id="ai"><Ai /></div>
      <BestSellers />
      <PromoBeforeFooter />

    </div>
  );
};

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  return (
    <Router>
      <style>{`footer { border-top: none !important; } footer hr { display: none !important; }`}</style>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100vw',
        margin: 0,
        padding: 0,
        overflowX: 'hidden',
        backgroundColor: '#000000',
        color: '#ffffff',
        boxSizing: 'border-box'
      }}>
        <div style={{ flex: 1, width: '100%', boxSizing: 'border-box' }}>
          <Routes>
            <Route path="/" element={<LoadingPage />} />

            <Route
              path="/home"
              element={
                <>
                  <Navbar />
                  <Home />
                  <Footer />
                </>
              }
            />

            <Route
              path="/about-us"
              element={
                <>
                  <Navbar />
                  <About />
                  <Footer />
                </>
              }
            />

            <Route
              path="/faq"
              element={
                <>
                  <Navbar />
                  <FAQ />
                  <Footer />
                </>
              }
            />

            <Route
              path="/location"
              element={
                <>
                  <Navbar />
                  <LCS />
                  <Footer />
                </>
              }
            />

            <Route
              path="/contact-us"
              element={
                <>
                  <Navbar />
                  <Orderform />
                  <Footer />
                </>
              }
            />
  
<Route path="/admin" element={<Admin />} />  {/* Admin: NO Navbar, NO Footer — only Logout + Back to Home inside Admin */}


            <Route
              path="/shop"
              element={
                <>
                  <Navbar />
                  <Shop />
                  <Footer />
                </>
              }
            />

            <Route
              path="/why-us"
              element={
                <>
                  <Navbar />
                  <WH />
                  <Footer />
                </>
              }
            />

            <Route
              path="/deals"
              element={
                <>
                  <Navbar />
                  <Deal />
                  <Footer />
                </>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
