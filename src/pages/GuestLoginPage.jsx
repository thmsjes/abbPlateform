import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowRight, MapPin } from 'lucide-react';

const GuestLogin = () => {
  const [bookingRef, setBookingRef] = useState('');
  const navigate = useNavigate();

  const handleGuestLogin = (e) => {
    e.preventDefault();
    // Simulate finding the booking in your .NET backend
    localStorage.setItem('userRole', 'guest');
    localStorage.setItem('bookingRef', bookingRef);
    navigate('/guest-dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-pink-50 text-center">
        <div className="bg-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-pink-600">
          <KeyRound size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest Access</h1>
        <p className="text-gray-500 mb-8">Enter your booking reference to unlock your stay guide.</p>

        <form onSubmit={handleGuestLogin} className="space-y-4">
          <input 
            type="text" 
            placeholder="Booking Reference (e.g. HM123)"
            className="w-full px-6 py-4 bg-gray-500 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-center font-bold tracking-widest uppercase"
            onChange={(e) => setBookingRef(e.target.value)}
            required
          />
          <button className="w-full bg-pink-500 text-white py-4 rounded-2xl font-black hover:bg-pink-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-100">
            Enter Portal <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-sm italic">
          <MapPin size={14} /> Serenity on Sylvan
        </div>
      </div>
    </div>
  );
};

export default GuestLogin;