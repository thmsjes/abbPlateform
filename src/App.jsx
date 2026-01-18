import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import the components
import GuestLandingPage from './pages/GuestLandingPage';
import PortalPicker from './pages/PortalPicker';
import OwnerDashboard from './pages/OwnersDashboard';
import Login from './pages/LoginPage'; 
import GuestLogin from './pages/GuestLoginPage';
import GuestDashboard from './pages/GuestDashboardPage';
import Navbar from './pages/Navbar';

// 1. Create the ProtectedRoute Wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/portals" replace />;
  }

  return children;
};

// 2. NEW: Wrapper component to handle conditional Navbar rendering
const AppContent = () => {
  const location = useLocation();
  
  // Define all paths where the Navbar should NOT appear
  const hideNavbarPaths = ['/guest-login', '/guest-dashboard', '/login', '/portals', '/owner', '/cleaner', '/maintenance'];
  
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {/* Navbar only renders if the current path isn't in our "hide" list */}
      {shouldShowNavbar && <Navbar />}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<GuestLandingPage />} />
        <Route path="/guest-login" element={<GuestLogin />} />
        <Route path="/guest-dashboard" element={<GuestDashboard />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/portals" element={<PortalPicker />} />

        {/* Protected Owner Route */}
        <Route 
          path="/owner" 
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Cleaner Route */}
        <Route 
          path="/cleaner" 
          element={
            <ProtectedRoute allowedRole="cleaner">
              <div className="p-10 text-2xl font-bold text-center">Cleaner Portal Coming Soon!</div>
            </ProtectedRoute>
          } 
        />

        {/* Protected Maintenance Route */}
        <Route 
          path="/maintenance" 
          element={
            <ProtectedRoute allowedRole="maintenance">
              <div className="p-10 text-2xl font-bold text-center">Maintenance Ticket System Coming Soon!</div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
};

// 3. Main App Component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;