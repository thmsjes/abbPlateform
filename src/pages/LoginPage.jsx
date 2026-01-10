import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
// Import the logo image
import LogoEmblem from "../assets/STRemblem.png"; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate API logic
    localStorage.setItem('userRole', 'owner'); 
    localStorage.setItem('token', 'valid-session-token');
    navigate('/owner');
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* LEFT SIDE: Visual Brand Area */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Use /assets/ if the folder is in 'public', or use an import if in 'src' */}
        <img 
          src="/assets/STRlogin.jpg" 
          alt="Modern Home" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px]" />
        
        <div className="relative z-10 p-12 flex flex-col justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md">
              {/* FIXED: Using img tag instead of calling PNG as a component */}
              <img src={LogoEmblem} alt="STRway Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight">STRway</span>
          </div>
          
          <div>
            <h2 className="text-5xl font-extrabold mb-6 leading-tight">
              Manage your <br /> property with <br /> confidence.
            </h2>
            <p className="text-blue-50 max-w-md text-lg">
              The all-in-one portal for owners, maintenance teams, and cleaning staff.
            </p>
          </div>
          <p className="text-sm opacity-70 italic">© 2026 STRway Management Systems</p>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-500">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Work Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  type="email" 
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  placeholder="name@property.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-700">Password</label>
                <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  type="password" 
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-blue-600 shadow-xl shadow-gray-200 hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]">
              Sign In to Portal <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-12 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4 items-center">
            <div className="bg-white p-2 rounded-xl text-blue-600 shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <p className="text-xs text-blue-800 leading-relaxed font-medium">
              Secure staff area. Unauthorized access is logged and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;