import React, { useState, useEffect, useRef } from 'react';

const translations = {
  en: {
    title: "Al-Saqr Company",
    subtitle: "Genuine Spare Parts AI",
    placeholder: "Type your message here...",
    send: "Send",
    selectLang: "Please select your preferred language / الرجاء اختيار لغتك المفضلة:",
    welcome: "Hello! I'm your AI assistant for Al-Saqr Company. How can I help you find genuine spare parts today?",
    suggestions: "💡 You can ask me about:\n• Available Brands & Genuine Parts\n• Order Process & Store Pickup\n• Working Hours & Schedule\n• Payment Methods (Cash/Online)\n• Contact, Email & Location",
    contactInfo: "📍 Address: Al-Ukaishiyah - New Industrial City, Makkah, KSA. (You can check our location path directly on the website).\n📧 Email: saqrcompany4@gmail.com\n📱 WhatsApp: +966 50 274 8270",
    brandsInfo: "We specialize in genuine parts imported from Thailand, China, and Japan specifically for Mitsubishi, Isuzu, Changan, and MG. We cover cars, trucks, 4-wheelers, and 6-wheelers (body parts, engine, suspension, etc.) with a guarantee at very reasonable prices.",
    orderProcess: "🛒 Order Process: Please note that we do not provide delivery services. Customers can pick up orders directly from our store or send their own transport. To confirm your order, send a picture of the required part or its part number via WhatsApp: +966 50 274 8270",
    timingInfo: "⏰ Working Hours & Schedule: Open Monday to Sunday from 8:00 AM to 10:00 PM (Saudi Time). Weekly Off: Friday is closed.",
    paymentInfo: "💳 Payment Methods: Both Cash and Online Bank Transfer options are fully available.",
    fallback: "I want to make sure you get the exact right part! For this specific inquiry or further details, please chat directly with our team on WhatsApp: +966 50 274 8270"
  },
  ar: {
    title: "شركة الصقر",
    subtitle: "مساعد قطع الغيار الذكي",
    placeholder: "اكتب رسالتك هنا...",
    send: "إرسال",
    selectLang: "Please select your preferred language / الرجاء اختيار لغتك المفضلة:",
    welcome: "مرحباً! أنا المساعد الذكي لشركة الصقر. كيف يمكنني مساعدتك في العثور على قطع الغيار الأصلية اليوم؟",
    suggestions: "💡 يمكنك أن تسألني عن:\n• العلامات التجارية وقطع الغيار الأصلية\n• عملية الطلب والاستلام من المعرض\n• أوقات وساعات العمل\n• طرق الدفع (كاش / تحويل)\n• الاتصال، البريد والموقع",
    contactInfo: "📍 العنوان: العقيصية - الصناعية الجديدة، مكة المكرمة، السعودية. (يمكنك التحقق من مسار الموقع مباشرة على الموقع الإلكتروني).\n📧 البريد الإلكتروني: saqrcompany4@gmail.com\n📱 واتساب: 966502748270+",
    brandsInfo: "نتخصص في قطع الغيار الأصلية المستوردة من تايلاند والصين واليابان خصيصاً لماركات: ميتسوبيشي، إيسوزو، تشانجان، وإم جي (سيارات، شاحنات، دفع رباعي وسداسي - هيكل، محرك، تعليق). جميع القطع مضمونة وبأسعار معقولة جداً.",
    orderProcess: "🛒 عملية الطلب: يجدر الإشارة إلى أننا لا نقدم خدمة التوصيل. يمكن للعملاء استلام الطلبات بأنفسهم من المعرض أو إرسال مندوبهم. لتأكيد طلبك، أرسل صورة القطعة أو رقمها عبر الواتساب: 966502748270+",
    timingInfo: "⏰ أوقات وساعات العمل: من الإثنين إلى الأحد من الساعة 8:00 صباحاً حتى 10:00 مساءً (بتوقيت السعودية). الإجازة الأسبوعية: الجمعة مغلق.",
    paymentInfo: "💳 طرق الدفع: متوفر لدينا الدفع النقدي (كاش) والتحويل البنكي الإلكتروني.",
    fallback: "أريد التأكد من حصولك على القطعة الصحيحة بدقة! لهذا الاستفسار المخصص أو لمزيد من التفاصيل، يرجى التحدث مباشرة مع فريقنا عبر الواتساب: 966502748270+"
  }
};

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleLanguageSelect = (selectedLang) => {
    setLang(selectedLang);
    const t = translations[selectedLang];
    setMessages([
      { sender: 'bot', text: t.selectLang },
      { sender: 'user', text: selectedLang === 'en' ? 'English' : 'العربية' },
      { sender: 'bot', text: t.welcome },
      { sender: 'bot', text: t.suggestions }
    ]);
  };

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    setMessages(prev => [
      ...prev, 
      { sender: 'bot', text: newLang === 'en' ? "Language successfully switched to English." : "تم تغيير اللغة بنجاح إلى العربية." }
    ]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !lang) return;

    const userText = input.trim();
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');

    setTimeout(() => {
      const t = translations[lang];
      let botReply = t.fallback;

      const lowerText = userText.toLowerCase();

      const isBrandQuery = /brand|car|truck|mitsubishi|isuzu|mg|changan|part|genuine|quality|warranty|price|قطع|سيارات|شاحنات|ميتسوبيشي|إيسوزو|تشانجان|إم جي|ضمان|سعر|أصلي/i.test(lowerText);
      const isOrderQuery = /order|buy|purchase|delivery|pickup|collect|whatsapp|send|طلب|شراء|توصيل|استلام|مستودع|واتساب|إرسال/i.test(lowerText);
      const isTimingQuery = /time|hour|schedule|timing|open|close|day|working|operation|friday|وقت|ساعات|دوام|فتح|إغلاق|يوم|عمل|جمعة|أوقات/i.test(lowerText);
      const isPaymentQuery = /pay|payment|cash|online|bank|transfer|دفع|كاش|تحويل|بنك|نقدي/i.test(lowerText);
      const isContactQuery = /contact|email|address|location|map|phone|Number|موقع|عنوان|إيميل|بريد|اتصال|هاتف|تواصل/i.test(lowerText);

      if (isBrandQuery) {
        botReply = t.brandsInfo;
      } else if (isOrderQuery) {
        botReply = t.orderProcess;
      } else if (isTimingQuery) {
        botReply = t.timingInfo;
      } else if (isPaymentQuery) {
        botReply = t.paymentInfo;
      } else if (isContactQuery) {
        botReply = t.contactInfo;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          style={styles.floatingBtn}
          aria-label="Open Chat"
        >
          💬
        </button>
      )}

      {/* Chat Window Popup */}
      {isOpen && (
        <div style={styles.chatContainer}>
          {/* Header */}
          <div style={styles.header}>
            <div>
              <h3 style={styles.headerTitle}>🦅 {translations[lang || 'en'].title}</h3>
              <span style={styles.headerSub}>{translations[lang || 'en'].subtitle}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {lang && (
                <button onClick={toggleLanguage} style={styles.langSwitchBtn}>
                  {lang === 'en' ? 'العربية' : 'English'}
                </button>
              )}
              <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>✕</button>
            </div>
          </div>

          {/* Body Content */}
          {!lang ? (
            <div style={styles.langSelectScreen}>
              <h4 style={{ color: '#fff', marginBottom: '20px', textAlign: 'center', fontSize: '15px' }}>Choose Language / اختر اللغة</h4>
              <div style={{ display: 'flex', gap: '12px', width: '100%', justifyContent: 'center' }}>
                <button style={styles.langOptionBtn} onClick={() => handleLanguageSelect('en')}>English</button>
                <button style={styles.langOptionBtn} onClick={() => handleLanguageSelect('ar')}>العربية</button>
              </div>
            </div>
          ) : (
            <div style={styles.chatBody}>
              <div style={styles.messagesList}>
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    style={{
                      ...styles.bubble,
                      alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      backgroundColor: msg.sender === 'user' ? '#D32F2F' : '#1a1a1a',
                      color: '#FFFFFF',
                      border: msg.sender === 'bot' ? '1px solid #333333' : 'none',
                      textAlign: lang === 'ar' && msg.sender === 'bot' ? 'right' : 'left'
                    }}
                  >
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i} style={{ margin: '4px 0' }}>{line}</p>
                    ))}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input Footer */}
              <form onSubmit={handleSend} style={styles.form}>
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={translations[lang].placeholder}
                  style={styles.input}
                  dir={lang === 'ar' ? 'rtl' : 'ltr'}
                />
                <button type="submit" style={styles.sendBtn}>
                  {translations[lang].send}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  floatingBtn: {
    position: 'fixed',
    bottom: '25px',
    right: '25px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#D32F2F',
    color: '#FFFFFF',
    border: '2px solid #FFFFFF',
    fontSize: '26px',
    cursor: 'pointer',
    boxShadow: '0px 6px 20px rgba(0,0,0,0.6)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease'
  },
  chatContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '380px',
    maxWidth: 'calc(100vw - 30px)',
    height: '520px',
    maxHeight: 'calc(100vh - 40px)',
    backgroundColor: '#000000',
    border: '1px solid #333333',
    borderRadius: '16px',
    boxShadow: '0px 8px 30px rgba(0,0,0,0.8)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 1000
  },
  header: {
    backgroundColor: '#111111',
    color: '#FFFFFF',
    padding: '14px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #D32F2F'
  },
  headerTitle: {
    fontSize: '15px',
    fontWeight: '700',
    margin: 0,
    color: '#FFFFFF',
    letterSpacing: '0.5px'
  },
  headerSub: {
    fontSize: '11px',
    color: '#aaaaaa'
  },
  closeBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#FFFFFF',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '4px 8px'
  },
  langSwitchBtn: {
    backgroundColor: '#222222',
    color: '#FFFFFF',
    border: '1px solid #444444',
    padding: '5px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  langSelectScreen: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: '24px'
  },
  langOptionBtn: {
    padding: '12px 24px',
    backgroundColor: '#D32F2F',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
    transition: 'background 0.2s'
  },
  chatBody: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#000000',
    overflow: 'hidden'
  },
  messagesList: {
    flex: 1,
    padding: '16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  bubble: {
    maxWidth: '85%',
    padding: '12px 16px',
    borderRadius: '12px',
    fontSize: '13px',
    lineHeight: '1.5',
    wordBreak: 'break-word',
    whiteSpace: 'pre-line',
    boxShadow: '0px 2px 8px rgba(0,0,0,0.3)'
  },
  form: {
    display: 'flex',
    padding: '12px',
    backgroundColor: '#111111',
    borderTop: '1px solid #222222',
    gap: '8px'
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    border: '1px solid #444444',
    borderRadius: '8px',
    outline: 'none',
    fontSize: '13px',
    boxSizing: 'border-box'
  },
  sendBtn: {
    padding: '10px 18px',
    backgroundColor: '#D32F2F',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '13px',
    boxShadow: '0 2px 8px rgba(211, 47, 47, 0.3)',
    transition: 'background 0.2s'
  }
};