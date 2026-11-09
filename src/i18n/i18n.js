import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      home: "HOME",
      about: "ABOUT US",
      whyUs: "WHY CHOOSE US",
      location: "LOCATION",
      faq: "FAQ",
      contact: "CONTACT US",
      welcomeText: "Welcome to Al-Saqar spare parts your trusted destination for genuine car and truck components. Specializing in high-quality parts for 4-wheelers and 6-wheelers, backed by our 100% durability and performance. Drive with confidence, drive with Al-Saqar!..",
      
      bannerBadge: "Quality Spare Parts",
      bannerImageTitle: "From nuts and bolts to peak performance – We have the parts you need.",
      bannerTagline: "From nuts and bolts to peak performance – We have the parts you need.",

      bannerPromoTitleEn: "Fuel your ride, find your fit – The ultimate destination for auto parts.",
      bannerPromoSubEn: "Trust in quality, rely on us – Your partner for long-lasting vehicle performance.",

      aboutTitle: "About",
      aboutTitleHighlight: "Al Saqar",
      aboutText1: "Located in the heart of Saudi Arabia, Al Saqar is a trusted and reliable hub for genuine auto parts catering to 4-wheel and 6-wheel vehicles. We supply a comprehensive inventory of body parts, engine parts, and suspension components for top international brands including Isuzu, Mitsubishi, MG, and Changan.",
      aboutText2: "Our goal is to provide parts with optimal performance and seamless compatibility. To maintain the highest standards of authenticity and customer trust, we do not offer online delivery. All our parts are exclusively available at our physical store so you can visit the counter directly and get exactly what your vehicle requires.",
      locationLabel: "Location",
      phoneLabel: "Phone / WhatsApp",
      contactBtnText: "Contact Us / Visit Store",

      heroSlide1Title: "HIGH-QUALITY PARTS FOR 4-WHEELERS & 6-WHEELERS",
      heroSlide1Desc: "Your trusted destination in Makkah for durable car and truck spare parts.",
      
      heroSlide2Title: "GENUINE ENGINE & TRUCK COMPONENTS",
      heroSlide2Desc: "Specialized heavy-duty truck parts and engine assemblies designed for maximum performance.",
      
      heroSlide3Title: "PRECISION SPARE PARTS & ACCESSORIES",
      heroSlide3Desc: "Extensive inventory of automotive components, gears, and precision tools.",
      
      heroSlide4Title: "EXPERT AUTO CONSULTATION & SUPPORT",
      heroSlide4Desc: "Professional assistance to find the exact component you need.",
      
      getQuote: "Get Quote Now",
      quickWhatsApp: "Quick WhatsApp",

      whyChooseUsTitle: "WHY DRIVERS",
      whyChooseUsTitleSpan: "CHOOSE US",
      feature1Title: "100% GENUINE PARTS",
      feature1Desc: "Certified high-durability components.",
      feature2Title: "BRAND SPECIALISTS",
      feature2Desc: "Expertise in Isuzu, Mitsubishi & MG.",
      feature3Title: "CHASSIS VERIFIED",
      feature3Desc: "Accurate matching to avoid errors.",
      feature4Title: "TRANSPARENT PRICING",
      feature4Desc: "Fair rates with zero hidden costs.",

      orderSectionBadge: "Quick Order & Inquiry",
      orderSectionTitle: "FIND YOUR",
      orderSectionTitleSpan: "AUTO PARTS INSTANTLY",
      orderBoxHeading: "Need Genuine Parts Fast?",
      orderBoxDesc: "Fill out the form with your vehicle details and required spare parts. Our experts will check inventory instantly and connect with you directly on WhatsApp.",
      brandNameText: "Saqr Company Spare Parts",
      customImageText: "(Place your custom image here)",
      highlight1: "100% Genuine & Verified Auto Components",
      highlight2: "Instant Response via WhatsApp Support",
      highlight3: "Support Helpline: +966 50 274 8270",
      workingHoursText: "Working Hours: Mon - Sun (Friday Off) | 8:00 AM – 10:00 PM",
      formHeading: "Submit Part Request",
      labelName: "Your Full Name *",
      placeholderName: "e.g. Ahmed Ali",
      labelPhone: "Phone Number *",
      placeholderPhone: "e.g. +966 50 XXX XXXX",
      labelVehicle: "Vehicle Model / Make *",
      placeholderVehicle: "e.g. Toyota Corolla 2022",
      labelChassis: "Chassis Number / VIN",
      optionalText: "(Optional)",
      placeholderChassis: "For exact part matching",
      labelPartDetails: "Required Part Details *",
      placeholderPartDetails: "Describe the spare part you need (e.g., front brake pads, radiator assembly)...",
      whatsappButtonText: "Send Order To WhatsApp",

      trustBannerBadge: "Al-Saqar Guarantee",
      trustBannerTitle: "Trust in quality, rely on us – Your partner for long-lasting vehicle performance.",

      orderTagline: "SIMPLE & FAST PROCESS",
      orderHeadingPrefix: "HOW TO",
      orderHeadingHighlight: "ORDER YOUR PARTS",
      orderStep1Title: "CAPTURE & SHARE",
      orderStep1Desc: "Send photo, model number, or Chassis / VIN.",
      orderStep2Title: "WHATSAPP EXPERTS",
      orderStep2Desc: "Connect directly with our sales team.",
      orderStep3Title: "CONFIRM & DISPATCH",
      orderStep3Desc: "Verify price & stock, then collect or ship.",
      orderBackSubtitle: "Fast, reliable & secure process guaranteed.",

      brandSubtitle: "Makkah's Premier Auto Parts Dealer",
      brandDesc: "Specialized in Isuzu, Mitsubishi, Changan, MG & Hyundai.",
      quickLinks: "Quick Links",
      booking: "Booking Form",
      contactUs: "Contact Us",
      faqs: "FAQs",
      contactTitle: "Contact Info",
      newsletter: "Newsletter",
      emailPlaceholder: "Enter your Email",
      subscribe: "Subscribe",
      subscribed: "Subscribed successfully!",
      invalidEmail: "Please enter a valid email address!",
      rights: "2026 © Al Saqar Auto Parts. All Rights Reserved.",

      badge: "Got Questions?",
      titlePart1: "Frequently Asked",
      titlePart2: "Questions",
      subtitle: "Find clear answers regarding our genuine auto parts for Isuzu, Mitsubishi, MG, and Changan.",
      faqItems: [
        {
          question: "Are all spare parts available at Al-Saqar 100% genuine?",
          answer: "Yes, we deal exclusively in 100% genuine and high-durability components sourced directly from trusted manufacturers."
        },
        {
          question: "Which vehicle brands do you provide spare parts for?",
          answer: "We specialize in complete spare parts inventory for Isuzu, Mitsubishi, MG, and Changan vehicles."
        },
        {
          question: "Do you provide spare parts for both light and heavy commercial vehicles?",
          answer: "Yes, we provide high-quality spare parts for both light commercial vehicles/cars and heavy trucks."
        },
        {
          question: "How can I check the availability and price of a specific part?",
          answer: "You can easily check availability and pricing by contacting us via WhatsApp or submitting your vehicle's chassis number through our Order page."
        },
        {
          question: "Do you offer any replacement policy if a part doesn't match?",
          answer: "Yes, our support team assists with verification using chassis numbers, and we handle replacements for verified issues as per our policy."
        }
      ],

      getInTouchTitlePart1: "GET IN",
      getInTouchTitlePart2: "TOUCH & LOCATION",
      visitOurOffice: "Visit Our Office",
      addressLabel: "Address",
      addressValue: "Makkah / Saudi Arabia (As per provided location map)",
      emailLabel: "Email Address",
      storeTimingsLabel: "Store Timings (Saudi Time)",
      storeTimingsValue: "Monday to Sunday: 8:00 AM – 10:00 PM",
      fridayOff: "Friday: OFF",
      connectWhatsApp: "Connect Instantly on WhatsApp"
    }
  },
  ar: {
    translation: {
      home: "الرئيسية",
      about: "من نحن",
      whyUs: "لماذا تختارنا",
      location: "موقعنا",
      faq: "الأسئلة الشائعة",
      contact: "اتصل بنا",
      welcomeText: "أهلاً بكم في قطع غيار الصقر، وجهتكم الموثوقة لقطع غيار السيارات والشاحنات الأصلية. متخصصون في قطع غيار عالية الجودة للسيارات الرباعية والشاحنات، مع ضمان الجودة والمتانة بنسبة 100%. إحفظ وثوقك في السواق، وسوق مع الصقر!...",

      bannerBadge: "قطع غيار عالية الجودة",
      bannerImageTitle: "من الصواميل والمسامير إلى الأداء الأقصى – لدينا القطع التي تحتاجها.",
      bannerTagline: "من الصواميل والمسامير إلى الأداء الأقصى – لدينا القطع التي تحتاجها.",

      bannerPromoTitleAr: "وزّع القوة لسيارتك، وابحث عن القطعة المناسبة – الوجهة النهائية لقطع غيار السيارات.",
      bannerPromoSubAr: "ثق في الجودة واعتمد علينا – شريكك لأداء طويل الأمد للسيارات.",

      aboutTitle: "نبذة عن",
      aboutTitleHighlight: "الصقر",
      aboutText1: "يقع الصقر في قلب المملكة العربية السعودية، وهو مركز موثوق ومعتمد لقطع الغيار الأصلية للسيارات ذات 4 و 6 عجلات. نحن نوفر مخزوناً شاملاً من أجزاء هياكل السيارات، قطع المحركات، ومكونات نظام التعليق لأبرز العلامات التجارية العالمية بما في ذلك إيسوزو، ميتسوبيشي، إم جي، وتشانجان.",
      aboutText2: "هدفنا هو توفير قطع غيار ذات أداء أمثل وتوافق تام. وللحفاظ على أعلى معايير الأصالة وثقة العملاء، فإننا لا نقدم خدمة التوصيل عبر الإنترنت. جميع قطع الغيار متوفرة حصرياً في متجرنا الفعلي حيث يمكنك زيارة المعرض مباشرة والحصول على ما يحتاجه ويدك بدقة.",
      locationLabel: "الموقع",
      phoneLabel: "الهاتف / واتساب",
      contactBtnText: "اتصل بنا / زيارة المتجر",

      heroSlide1Title: "قطع غيار عالية الجودة للسيارات والشاحنات",
      heroSlide1Desc: "وجهتك الموثوقة في مكة المكرمة لقطع غيار السيارات والشاحنات المتينة.",
      
      heroSlide2Title: "مكونات المحركات والشاحنات الأصلية",
      heroSlide2Desc: "قطع غيار شاحنات ثقيلة وتجميعات محركات مصممة لأقصى أداء.",
      
      heroSlide3Title: "قطع غيار واكسسوارات دقيقة",
      heroSlide3Desc: "مخزون واسع من مكونات السيارات والتروس والأدوات الدقيقة.",
      
      heroSlide4Title: "استشارة ودعم فني متخصص للسيارات",
      heroSlide4Desc: "مساعدة احترافية للعثور على القطعة الدقيقة التي تحتاجها.",
      
      getQuote: "اطلب عرض سعر",
      quickWhatsApp: "واتساب سريع",

      whyChooseUsTitle: "لماذا يختارنا",
      whyChooseUsTitleSpan: "السائقون",
      feature1Title: "قطع أصلية ١٠٠٪",
      feature1Desc: "مكونات معتمدة عالية المتانة.",
      feature2Title: "متخصصو العلامات التجارية",
      feature2Desc: "خبرة في إيسوزو، ميتسوبيشي وإم جي.",
      feature3Title: "التحقق من الهيكل",
      feature3Desc: "مطابقة دقيقة لتجنب الأخطاء.",
      feature4Title: "أسعار شفافة",
      feature4Desc: "أسعار عادلة بدون رسوم مخفية.",

      orderSectionBadge: "طلب سريع واستفسار",
      orderSectionTitle: "اعثر على",
      orderSectionTitleSpan: "قطع غيار سيارتك فوراً",
      orderBoxHeading: "تحتاج إلى قطع أصلية بسرعة؟",
      orderBoxDesc: "املأ النموذج بتفاصيل سيارتك وقطع الغيار المطلوبة. سيقوم خبراءنا فحص المخزون فوراً والتواصل معك مباشرة عبر واتساب.",
      brandNameText: "شركة الصقر لقطع الغيار",
      customImageText: "(ضع صورتك المخصصة هنا)",
      highlight1: "قطع غيار أصلية وموثوقة ١٠٠٪",
      highlight2: "استجابة فورية عبر دعم واتساب",
      highlight3: "خط المساعدة للدعم: ٩٦٦٥٠٢٧٤٨٢٧٠+",
      workingHoursText: "ساعات العمل: من الإثنين إلى الأحد (الجمعة إجازة) | ٨:00 صباحاً – ١٠:00 مساءً",
      formHeading: "إرسال طلب القطعة",
      labelName: "الاسم الكامل *",
      placeholderName: "مثال: أحمد علي",
      labelPhone: "رقم الهاتف *",
      placeholderPhone: "مثال: +966 50 XXX XXXX",
      labelVehicle: "موديل / صانع المركبة *",
      placeholderVehicle: "مثال: تويوتا كورولا 2022",
      labelChassis: "رقم الهيكل / VIN",
      optionalText: "(اختياري)",
      placeholderChassis: "لمطابقة القطعة بدقة",
      labelPartDetails: "تفاصيل القطعة المطلوبة *",
      placeholderPartDetails: "صف قطعة الغيار التي تحتاجها (مثل: تيل بريك أمامي، ردياتير)...",
      whatsappButtonText: "إرسال الطلب إلى واتساب",

      trustBannerBadge: "ضمان الصقر",
      trustBannerTitle: "ثق في الجودة واعتمد علينا – شريكك لأداء طويل الأمد للسيارات.",

      orderTagline: "عملية بسيطة وسريعة",
      orderHeadingPrefix: "كيفية",
      orderHeadingHighlight: "طلب قطع الغيار",
      orderStep1Title: "التقاط وشارك",
      orderStep1Desc: "أرسل الصورة أو رقم الموديل أو رقم الشاصي.",
      orderStep2Title: "تواصل عبر الواتساب",
      orderStep2Desc: "تواصل مباشرة مع فريق المبيعات لدينا.",
      orderStep3Title: "التأكيد والاستلام",
      orderStep3Desc: "تحقق من السعر والمخزون، ثم استلم أو اشحن.",
      orderBackSubtitle: "عملية سريعة، موثوقة وآمنة مضمونة.",

      brandSubtitle: "وكيل قطع الغيار الأول في مكة المكرمة",
      brandDesc: "متخصصون في قطع غيار إيسوزو، ميتسوبيشي، شانجان، إم جي وهيونداي.",
      quickLinks: "روابط سريعة",
      booking: "نموذج الحجز",
      contactUs: "اتصل بنا",
      faqs: "الأسئلة الشائعة",
      contactTitle: "معلومات الاتصال",
      newsletter: "النشرة البريدية",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      subscribe: "اشتراك",
      subscribed: "تم الاشتراك بنجاح!",
      invalidEmail: "الرجاء إدخال بريد إلكتروني صحيح!",
      rights: "جميع الحقوق محفوظة © 2026 شركة الصقر لقطع الغيار.",

      badge: "لديك استفسار؟",
      titlePart1: "الأسئلة",
      titlePart2: "الشائعة",
      subtitle: "اعثر على إجابات واضحة حول قطع الغيار الأصلية الخاصة بنا لسيارات إيسوزو، ميتسوبيشي، إم جي، وشانجان.",
      faqItems: [
        {
          question: "هل جميع قطع الغيار المتوفرة في الصقر أصلية 100%؟",
          answer: "نعم، نحن نتعامل حصرياً في قطع غيار أصلية وعالية التحمل يتم توريدها مباشرة من الشركات المصنعة المعتمدة."
        },
        {
          question: "ما هي ماركات السيارات التي توفرون لها قطع الغيار؟",
          answer: "نحن متخصصون في توفير مخزون متكامل لقطع غيار سيارات إيسوزو، ميتسوبيشي، إم جي، وشانجان."
        },
        {
          question: "هل توفرون قطع غيار للسيارات الخفيفة والشاحنات الثقيلة؟",
          answer: "نعم، توفر مؤسستنا قطع غيار عالية الجودة لكل من المركبات التجارية الخفيفة والشاحنات الثقيلة."
        },
        {
          question: "كيف يمكنني التحقق من توفر السعر والقطعة المطلوبة؟",
          answer: "يمكنك بسهولة التحقق من الأسعار والتوفر عبر التواصل معنا مباشرة عن طريق الواتساب أو إرسال رقم الهيكل (الشاصيه) الخاص بسيارتك."
        },
        {
          question: "هل توفرون سياسة استبدال في حال لم تتطابق القطعة؟",
          answer: "نعم، فريق الدعم لدينا يساعدك في مطابقة القطع باستخدام رقم الهيكل، ونتعامل مع حالات الاستبدال للمشكلات المثبتة وفقاً لسياسة المؤسسة."
        }
      ],

      getInTouchTitlePart1: "ابق على",
      getInTouchTitlePart2: "اتصال وموقعنا",
      visitOurOffice: "زوروا مكتبنا",
      addressLabel: "العنوان",
      addressValue: "مكة المكرمة / المملكة العربية السعودية",
      emailLabel: "البريد الإلكتروني",
      storeTimingsLabel: "أوقات العمل (بتوقيت السعودية)",
      storeTimingsValue: "من الإثنين إلى الأحد: 8:00 صباحاً – 10:00 مساءً",
      fridayOff: "الجمعة: إجازة",
      connectWhatsApp: "تواصل معنا فوراً عبر واتساب"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;
