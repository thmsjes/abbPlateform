import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, FolderPen, ArrowRight, ShieldCheck } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import LogoEmblem from "../assets/STRemblem.png"; 
// 1. Import your API call
import { login } from '../apiCalls'; 

const Login = () => {
  const [username, setUsername] = useState(''); // This acts as your 'Username'
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To display login failures
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const intendedPortal = searchParams.get('portal'); // Get portal from URL parameter 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 2. Map the fields to match your .NET LoginRequestDTO
      const credentials = {
        username: username, // Your backend expects 'Username'
        password: password
      };

      const data = await login(credentials);
      console.log('Login response:', data);
      
      // Handle different response structures
      const token = data.token || data.data?.token || data.accessToken;
      const propertyId = data.propertyId || data.PropertyId || data.data?.propertyId || data.data?.PropertyId;
      const propertyIds = data.propertyIds || data.PropertyIds || data.data?.propertyIds || data.data?.PropertyIds;
      
      if (data.isSuccess && token) {
        // 3. Store the real JWT and user data from the backend
        localStorage.setItem('token', token);
        
        // Store property IDs - handle both single and multiple
        let idsToStore = [];
        if (propertyIds && Array.isArray(propertyIds)) {
          idsToStore = propertyIds;
          localStorage.setItem('propertyIds', JSON.stringify(propertyIds));
          console.log('PropertyIds saved:', propertyIds);
        } else if (propertyId) {
          idsToStore = [propertyId];
          localStorage.setItem('propertyIds', JSON.stringify([propertyId]));
          localStorage.setItem('propertyId', propertyId);
          console.log('PropertyId saved:', propertyId);
        } else {
          console.warn('No propertyId or propertyIds found in login response');
          console.log('Full login response:', data);
        }
      
        // 4. Decode the JWT to get the user's access level
        try {
          const decoded = jwtDecode(token);
          console.log('Decoded token:', decoded);
          console.log('Intended portal:', intendedPortal);
          
          // Extract PropertyId from token
          const propertyIdFromToken = decoded["PropertyId"] || decoded["propertyId"];
          if (propertyIdFromToken) {
            localStorage.setItem('propertyIds', JSON.stringify([propertyIdFromToken]));
            localStorage.setItem('propertyId', propertyIdFromToken);
            console.log('PropertyId extracted from token:', propertyIdFromToken);
          }
          
          // Try different possible keys for access level
          const accessLevel = decoded["AccessLevel"] || decoded["accessLevel"] || decoded["role"] || decoded["Role"]; 
          console.log('Access level found:', accessLevel);

          // Map access level to portal route
          const accessLevelStr = String(accessLevel);
          let targetPortal;
          let userRole;
          
          if (accessLevelStr === '1') {
            targetPortal = '/owner';
            userRole = 'owner';
          } else if (accessLevelStr === '2') {
            targetPortal = '/cleaner';
            userRole = 'cleaner';
          } else if (accessLevelStr === '3') {
            targetPortal = '/maintenance';
            userRole = 'maintenance';
          } else {
            console.log('Unknown access level:', accessLevel, '- type:', typeof accessLevel);
            console.log('Full decoded JWT:', decoded);
            
            // If we can't find the access level but the user selected a portal, try using that
            if (intendedPortal && ['owner', 'cleaner', 'maintenance'].includes(intendedPortal)) {
              console.log('No AccessLevel found, using intended portal:', intendedPortal);
              userRole = intendedPortal;
              targetPortal = `/${intendedPortal}`;
            } else {
              navigate('/portals');
              return;
            }
          }

          // For owners (accessLevel 1), allow access to any portal
          // For others, validate they only access their assigned portal
          if (userRole !== 'owner' && intendedPortal && intendedPortal !== userRole) {
            setError(`Your account is not authorized for the ${intendedPortal} portal. You have been assigned as a ${userRole}.`);
            return;
          }

          // If owner is trying to access a specific portal (not their default), route to that portal
          if (userRole === 'owner' && intendedPortal && ['owner', 'cleaner', 'maintenance'].includes(intendedPortal)) {
            targetPortal = `/${intendedPortal}`;
          }

          console.log('Setting userRole to:', userRole);
          localStorage.setItem('userRole', userRole);
          console.log('Navigating to:', targetPortal);
          navigate(targetPortal);
          
        } catch (decodeError) {
          // If token decode fails, just go to portals page
          console.error('Error decoding token:', decodeError);
          navigate('/portals');
        }
      } else {
        setError(data.message || 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        // Server responded with error
        setError(error.response.data?.message || 'Login failed. Please try again.');
      } else if (error.request) {
        // Request made but no response
        setError('No response from server. Please check if the server is running.');
      } else {
        // Error in request setup
        setError('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-sans">
      {/* LEFT SIDE - Brand & Hero */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 text-white relative overflow-hidden">
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 -left-40 w-96 h-96 bg-slate-600/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <img src={LogoEmblem} alt="STRway" className="w-12 h-12" />
            <h1 className="text-3xl font-black tracking-tighter italic text-blue-400">STRway</h1>
          </div>
          
          <div className="mb-12">
            <h2 className="text-5xl font-black mb-4">Staff Portal</h2>
            <p className="text-xl text-slate-300 leading-relaxed">Manage your properties, track finances, and coordinate your team all in one place.</p>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 mt-1">
              <ShieldCheck size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="font-bold text-white">Secure & Reliable</p>
              <p className="text-sm text-slate-300">Enterprise-grade security for your business</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0 mt-1">
              <Lock size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="font-bold text-white">Role-Based Access</p>
              <p className="text-sm text-slate-300">Different tools for owners, cleaners, and maintenance</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 bg-white lg:bg-slate-50">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex items-center justify-center gap-2">
            <img src={LogoEmblem} alt="STRway" className="w-10 h-10" />
            <h1 className="text-2xl font-black tracking-tighter italic text-blue-600">STRway</h1>
          </div>

          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome</h1>
            <p className="text-slate-600">Enter your credentials to access your dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-left text-sm font-bold text-slate-700 ml-1">
                User Name
              </label>
              <div className="relative group">
                <FolderPen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  type="text"
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:ring-0 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder-slate-500"
                  placeholder="Enter your username"
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700">Password</label>
                <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  type="password" 
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:ring-0 focus:border-blue-500 outline-none transition-all text-slate-900 placeholder-slate-500"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 rounded-2xl font-black shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]"
              style={{
                backgroundColor: loading ? '#94a3b8' : '#0ea5e9',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#0284c7')}
              onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#0ea5e9')}
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'} <ArrowRight size={20} />
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-10 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex gap-4 items-start">
            <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm shrink-0">
              <ShieldCheck size={18} />
            </div>
            <p className="text-xs text-blue-900 leading-relaxed font-medium">
              Secure staff area. Unauthorized access is logged and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;