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
    flex items-center gap-1 md:gap-3 
    text-xs md:text-sm lg:text-base font-black uppercase tracking-[0.1em] md:tracking-[0.15em] lg:tracking-[0.25em] 
    transition-all duration-300
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
      <div className="w-full px-4 md:px-8 lg:px-16 flex justify-end items-center gap-3 md:gap-10 lg:gap-16">
        
        {/* GUEST PORTAL */}
        <Link 
          to="/guest-login" 
          className={`${navItemStyles} ${activeColor}`}
        >
          <UserCircle size={16} strokeWidth={2.5} className="md:w-6 md:h-6" />
          <span className="text-[10px] md:text-xs lg:text-sm">Guest Portal</span>
        </Link>

        {/* BOOK NOW */}
       <button 
    onClick={() => document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })}
        className={`${navItemStyles} ${activeColor}`}
        style={{ 
            background: 'none', 
            border: 'none', 
            boxShadow: 'none',
            outline: 'none',
            WebkitAppearance: 'none',
        }}
  onFocus={(e) => e.target.style.outline = 'none'}
>
  <CalendarDays size={16} strokeWidth={2.5} className="md:w-6 md:h-6" />
  <span className="text-[10px] md:text-xs lg:text-sm">Book</span>
</button>
      </div>
    </nav>
  );
};

export default Navbar;