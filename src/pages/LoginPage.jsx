import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      if (data.isSuccess) {
        // 3. Store the real JWT and user data from the backend
        localStorage.setItem('token', data.token);
      
        // 4. Decode the JWT to get the user's access level
        try {
          const decoded = jwtDecode(data.token);
          const accessLevel = decoded["AccessLevel"]; // Adjust this key based on your JWT structure

          
          // Map access level to role and store in localStorage for ProtectedRoute
          let userRole;
          switch (accessLevel) {
            case '1':
            case 1:
              userRole = 'owner';
              console.log('Setting userRole to owner');
              localStorage.setItem('userRole', userRole);
              navigate('/owner');
              break;
            case '2':
            case 2:
              userRole = 'cleaner';
              localStorage.setItem('userRole', userRole);
              navigate('/cleaner');
              break;
            case '3':
            case 3:
              userRole = 'maintenance';
              localStorage.setItem('userRole', userRole);
              navigate('/maintenance');
              break;
            default:
              console.log('Unknown access level, going to portals');
              // If access level is not recognized, go to portal picker
              navigate('/portals');
              return; // Exit early, don't set userRole
          }
          
          console.log('About to navigate to portal for userRole:', userRole);
          
        } catch (decodeError) {
          // If token decode fails, just go to portals page
          console.error('Error decoding token:', decodeError);
          navigate('/portals');
        }
      } else {
        setError('Invalid username or password.');
      }
    } catch (error) {
      setError('Connection failed. Please check if the server is running.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* ... LEFT SIDE remains the same ... */}

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-500">Enter your credentials to access your dashboard</p>
          </div>

          {/* 4. Display Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email/Username Input */}
            <div className="space-y-2">
              {/* Added 'block' to take full width and 'text-left' to align text */}
              <label className="block text-left text-sm font-bold text-gray-700 ml-1">
                User Name
              </label>
              <div className="relative group">
                <FolderPen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  type="text" // 'username' is not a standard HTML type, use 'text'
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                  placeholder="John Doe"
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Input */}
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
                  disabled={loading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full ${loading ? 'bg-pink-400' : 'bg-gray-900 hover:bg-blue-600'} text-white py-4 rounded-2xl font-black shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.98]`}
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'} <ArrowRight size={20} />
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