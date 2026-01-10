import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import the components
import GuestLandingPage from './pages/GuestLandingPage';
import PortalPicker from './pages/PortalPicker';
import OwnerPortal from './pages/OwnerPortal';
import Login from './pages/LoginPage'; // Make sure to create this file!

// 1. Create the ProtectedRoute Wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // If no token, send to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If role doesn't match, send back to portal selection
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/portals" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<GuestLandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/portals" element={<PortalPicker />} />

        {/* Protected Owner Route */}
        <Route 
          path="/owner" 
          element={
            <ProtectedRoute allowedRole="owner">
              <OwnerPortal />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Cleaner Route */}
        <Route 
          path="/cleaner" 
          element={
            <ProtectedRoute allowedRole="cleaner">
              <div className="p-10 text-2xl font-bold">Cleaner Portal Coming Soon!</div>
            </ProtectedRoute>
          } 
        />

        {/* Protected Maintenance Route */}
        <Route 
          path="/maintenance" 
          element={
            <ProtectedRoute allowedRole="maintenance">
              <div className="p-10 text-2xl font-bold">Maintenance Ticket System Coming Soon!</div>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;