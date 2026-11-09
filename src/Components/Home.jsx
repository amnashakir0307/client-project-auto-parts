import React from 'react';

const Home = () => {
  return (
    <div>
      {/* آپ کا ہیرو سیکشن یا پچھلا کوڈ */}
      
      {/* یہاں نیچے نیا بینر پیسٹ کر دیں */}
      <div className="w-full bg-black py-12 px-4 sm:px-6 lg:px-8 border-t border-b border-red-600">
        <div className="max-w-5xl mx-auto space-y-6 text-center">
          
          {/* English Banner Card */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-200 transition-transform duration-300 hover:scale-[1.01]">
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-wide uppercase">
              Fuel your ride, find your fit
            </h2>
            <p className="mt-2 text-base sm:text-lg font-semibold text-red-600">
              The ultimate destination for auto parts.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 italic">
                Trust in quality, rely on us – Your partner for long-lasting vehicle performance.
              </p>
            </div>
          </div>

          {/* Arabic Banner Card */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-200 transition-transform duration-300 hover:scale-[1.01]" dir="rtl">
            <h2 className="text-2xl sm:text-3xl font-black text-black tracking-wide">
              وزّع القوة لسيارتك، وابحث عن القطعة المناسبة
            </h2>
            <p className="mt-2 text-base sm:text-lg font-semibold text-red-600">
              – الوجهة النهائية لقطع غيار السيارات.
            </p>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 italic">
                ثق في الجودة واعتمد علينا – شريكك لأداء طويل الأمد للسيارات.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* باقی ویب سائٹ کا کوڈ */}
    </div>
  );
};

export default Home;