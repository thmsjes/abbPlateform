import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, CalendarDays } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 1. SHARED DESIGN: This ensures 100% identical size and font
 const navItemStyles = `
    flex items-center gap-3 
    text-sm md:text-base font-black uppercase tracking-[0.25em] 
    transition-all duration-300 whitespace-nowrap
    bg-transparent border-none p-0 
    outline-none focus:outline-none focus:ring-0 
    hover:outline-none hover:border-none hover:shadow-none
    cursor-pointer no-underline
  `;

  // 2. SHARED COLOR: Forced white logic to fix the purple/blue link issue
  const activeColor = isScrolled 
    ? '!text-pink-500 hover:!text-blue-500' 
    : '!text-white hover:!text-white/70';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-10'
    }`}>
      <div className="w-full px-8 md:px-16 flex justify-end items-center gap-10 md:gap-16">
        
        {/* GUEST PORTAL */}
        <Link 
          to="/guest-login" 
          className={`${navItemStyles} ${activeColor}`}
        >
          <UserCircle size={24} strokeWidth={2.5} />
          Guest Portal
        </Link>

        {/* BOOK NOW */}
       <button 
    onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
        className={`${navItemStyles} ${activeColor}`}
        style={{ 
            background: 'none', 
            border: 'none', 
            boxShadow: 'none',
            outline: 'none',       // Explicitly removes the line
            webkitAppearance: 'none',
          
        }}
  onFocus={(e) => e.target.style.outline = 'none'} // Double-check for focus
>
  <CalendarDays size={24} strokeWidth={2.5} />
  Book Now
</button>
      </div>
    </nav>
  );
};

export default Navbar;