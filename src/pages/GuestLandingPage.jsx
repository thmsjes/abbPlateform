import React, { useState } from 'react';
 import { Link } from 'react-router-dom';

import { Wifi, Car, Coffee, Wind, Star, Camera, X } from 'lucide-react';
import Dock from '../assets/Dock.jpg';
import BackYard from '../assets/BackYard.jpg';
import BackYard2 from '../assets/BackYard2.jpg';
import DinningRoom from '../assets/DinningRoom.jpg';
import Sunset from '../assets/Sunset.jpg';

const GuestLandingPage = () => {
  const [selectedImg, setSelectedImg] = useState(null); // Track image for modal

  const propertyImages = [
    { url: BackYard },
    { url: BackYard2 },
    { url: DinningRoom },
    { url: Sunset },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      
      {/* 1. HERO SECTION */}
      <header className="relative h-[60vh] w-full overflow-hidden">
        <img 
          src={Dock}
          alt="Property Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-2">Serenity on Sylvan</h1>
            <p className="text-xl">Relax and unwind like never before</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* 2. AMENITIES SECTION */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">What our home offers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AmenityItem icon={<Wifi />} label="Fast WiFi" />
            <AmenityItem icon={<Car />} label="Free Parking" />
            <AmenityItem icon={<Coffee />} label="Coffee Station" />
            <AmenityItem icon={<Wind />} label="Air Conditioning" />
          </div>
        </section>

        {/* 3. GALLERY SECTION (With Modal Trigger) */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Property Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {propertyImages.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedImg(img.url)}
                className="h-64 rounded-2xl overflow-hidden cursor-pointer hover:ring-4 hover:ring-pink-200 transition-all"
              >
                <img src={img.url} className="w-full h-full object-cover" alt="Gallery" />
              </div>
            ))}
          </div>
        </section>

        {/* 4. PHOTO MODAL / LIGHTBOX */}
        {selectedImg && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <button 
              onClick={() => setSelectedImg(null)}
              className="absolute top-6 right-6 text-white hover:text-gray-300"
            >
              <X size={40} />
            </button>
            <img 
              src={selectedImg} 
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" 
              alt="Enlarged view" 
            />
          </div>
        )}

        {/* Review sections remain here as built before... */}
      </main>
     
      <footer className="border-t border-gray-200 mt-20 py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center text-sm text-gray-500">
          <p>© 2026 STRway Management Systems</p>
          <Link to="/portals" className="hover:text-pink-500 transition-colors font-medium">
      Staff Portal
    </Link>
  </div>
</footer>
    </div>
  );
};

const AmenityItem = ({ icon, label }) => (
  <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
    <span className="text-pink-500">{icon}</span>
    <span className="font-medium">{label}</span>
  </div>
);

export default GuestLandingPage;