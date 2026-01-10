import React from 'react';
import { ShieldCheck, Brush, Wrench, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PortalPicker = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Management Portals</h1>
          <p className="text-gray-600">Please select your access level to continue</p>
        </div>

        {/* Updated grid from md:grid-cols-2 to md:grid-cols-3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* OWNER CARD */}
          <Link to="/owner" className="group bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-blue-500 transition-all text-left block">
            <div className="bg-blue-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Owner</h2>
            <p className="text-gray-500 mb-6">Manage finances, view receipts, and track profits.</p>
            <div className="flex items-center text-blue-600 font-semibold">
              Enter Portal <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={18} />
            </div>
          </Link>

          {/* CLEANER CARD */}
          <Link to="/cleaner" className="group bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-green-500 transition-all text-left block">
            <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
              <Brush size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Cleaner</h2>
            <p className="text-gray-500 mb-6">View schedule and upload cleaning completion photos.</p>
            <div className="flex items-center text-green-600 font-semibold">
              Enter Portal <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={18} />
            </div>
          </Link>

          {/* MAINTENANCE CARD (NEW) */}
          <Link to="/maintenance" className="group bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-orange-500 transition-all text-left block">
            <div className="bg-orange-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-orange-600 group-hover:scale-110 transition-transform">
              <Wrench size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Maintenance</h2>
            <p className="text-gray-500 mb-6">Report issues, track repairs, and upload fix-it photos.</p>
            <div className="flex items-center text-orange-600 font-semibold">
              Enter Portal <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" size={18} />
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default PortalPicker;