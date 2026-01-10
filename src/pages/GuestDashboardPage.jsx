import React from 'react';
import { Wifi, BookOpen, Map, LogOut, Info } from 'lucide-react';

const GuestDashboard = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      {/* Header */}
      <div className="bg-pink-500 p-8 rounded-b-[3rem] text-white shadow-lg">
        <h1 className="text-3xl font-bold">Welcome Home!</h1>
        <p className="opacity-90 mt-1">Everything you need for your stay at Sylvan.</p>
      </div>

      <div className="max-w-xl mx-auto px-6 -mt-6">
        {/* Quick Action: WIFI (Most Important) */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-pink-50 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-pink-100 p-3 rounded-2xl text-pink-600"><Wifi size={24}/></div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">WiFi Network</p>
              <p className="font-bold text-lg leading-none">Sylvan_Oasis_Guest</p>
            </div>
          </div>
          <button className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-xs font-black">COPY PW</button>
        </div>

        {/* Grid of Info */}
        <div className="grid grid-cols-2 gap-4">
          <InfoCard icon={<BookOpen />} title="House Manual" color="bg-blue-500" />
          <InfoCard icon={<Map />} title="Local Guide" color="bg-green-500" />
          <InfoCard icon={<Info />} title="Check-out Info" color="bg-orange-500" />
          <InfoCard icon={<LogOut />} title="Need Help?" color="bg-purple-500" />
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, color }) => (
  <div className="bg-gray-50 p-6 rounded-[2rem] hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-gray-100 cursor-pointer text-center">
    <div className={`w-12 h-12 ${color} text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
      {icon}
    </div>
    <span className="font-bold text-sm text-gray-700">{title}</span>
  </div>
);

export default GuestDashboard;