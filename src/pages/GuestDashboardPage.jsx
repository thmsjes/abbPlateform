import React from 'react';
import { Wifi, BookOpen, Map, LogOut, Info, ClipboardCheck, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GuestDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      
      {/* 1. MATCHING HEADER: Uses same height/feel as landing */}
      <header className="relative h-[30vh] w-full bg-gray-900 overflow-hidden">
        {/* You can replace this with a subtle image of the house to match the landing hero */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-black/60 flex items-center justify-between px-8 md:px-20">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Guest Dashboard</h1>
            <p className="text-pink-200 font-medium">Your stay at Serenity on Sylvan</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-pink-700 transition-all shadow-lg"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </header>

      {/* 2. MATCHING CONTAINER: max-w-6xl like landing page */}
      <main className="max-w-6xl mx-auto px-4 -mt-10 relative z-10">
        
        {/* 3. WIFI CARD: Styled like the AmenityItems on your landing page */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="bg-pink-50 p-4 rounded-xl text-pink-500">
              <Wifi size={32}/>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">High-Speed WiFi</p>
              <p className="font-bold text-xl text-gray-800">Sylvan_Oasis_Guest</p>
            </div>
          </div>
          <button className="w-full md:w-auto bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-600 transition-all active:scale-95">
            Copy Password
          </button>
        </div>

        {/* 4. DASHBOARD GRID: Matches the 4-column layout of your gallery */}
        <h2 className="text-xl font-bold mb-6 text-gray-800 px-2">Guest Essentials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashCard icon={<BookOpen />} title="House Manual" subtitle="Rules & Instructions" />
          <DashCard icon={<Map />} title="Local Guide" subtitle="Where to eat & explore" />
          <DashCard icon={<ClipboardCheck />} title="Check-out Info" subtitle="Departure checklist" />
          <DashCard icon={<MessageSquare />} title="Contact Host" subtitle="We're here to help" />
        </div>

      </main>
    </div>
  );
};

// Internal component matching the "AmenityItem" feel but with more depth
const DashCard = ({ icon, title, subtitle }) => (
  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-pink-200 transition-all cursor-pointer group text-center md:text-left">
    <div className="text-pink-500 mb-4 flex justify-center md:justify-start group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-bold text-lg text-gray-900 mb-1">{title}</h3>
    <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
  </div>
);

export default GuestDashboard;