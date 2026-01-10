import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wifi, Car, Coffee, Wind, Dog, Waves, X, Kayak, KeyRound, BedDouble, 
  Bath, Bike, Flame, Fence, Lock, WashingMachine, Star, Quote 
} from 'lucide-react';
import { Camera, Instagram } from 'lucide-react'; // New icons for this section
// Local Assets
import Dock from '../assets/Dock.jpg';
import BackYard from '../assets/BackYard.jpg';
import BackYard2 from '../assets/BackYard2.jpg';
import DinningRoom from '../assets/DinningRoom.jpg';
import Sunset from '../assets/Sunset.jpg';

const GuestLandingPage = () => {
  const [selectedImg, setSelectedImg] = useState(null);

  const propertyImages = [
    { url: BackYard },
    { url: BackYard2 },
    { url: DinningRoom },
    { url: Sunset },
  ];

  // Review Data
  const reviews = [
    {
      id: 1,
      name: "Sarah Jenkins",
      date: "October 2025",
      text: "Absolutely stunning property. The attention to detail in the decor made it feel like a boutique hotel. We loved the sunset views from the dock!",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      date: "December 2025",
      text: "The perfect getaway. Super clean, modern amenities, and the kayaks were a huge plus. Will definitely be coming back!",
      rating: 5
    },
    {
      id: 3,
      name: "Emma Thompson",
      date: "January 2026",
      text: "Great location and very responsive host. The kitchen had everything we needed for our family of 10. Highly recommend!",
      rating: 5
    }
  ];

  const guestPhotos = [
    { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=600', caption: "Morning coffee on the dock ☕" },
    { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=600', caption: "Kids loved the kayaks!" },
    { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600', caption: "Sunset was unreal tonight." },
    { url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=600', caption: "Finally caught a fish! 🎣" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      
      {/* 1. HERO SECTION */}
      <header className="relative h-[60vh] w-full overflow-hidden">
        <img src={Dock} alt="Property Hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-center text-white">
          <div>
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
            <AmenityItem icon={<Waves />} label="Waterfront" /> 
            <AmenityItem icon={<Lock />} label="Private Dock" /> 
            <AmenityItem icon={<Wind />} label="Air Conditioning" />
            <AmenityItem icon={<Dog />} label="Pet Friendly" />            
            <AmenityItem icon={<Fence />} label="Fully Fenced Yard" />            
            <AmenityItem icon={<WashingMachine />} label="On-Site Laundry" />
            <AmenityItem icon={<Wifi />} label="Fast WiFi" />
            <AmenityItem icon={<Coffee />} label="Coffee Station" />
            <AmenityItem icon={<KeyRound />} label="Self Check-in" />
            <AmenityItem icon={<Kayak />} label="3 Kayaks" />
            <AmenityItem icon={<Bike />} label="2 Bicycles" />
            <AmenityItem icon={<BedDouble />} label="Sleeps 11" />
          </div>
        </section>

        {/* 3. GALLERY SECTION */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Property Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {propertyImages.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedImg(img.url)}
                className="h-64 rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-300 shadow-md"
              >
                <img src={img.url} className="w-full h-full object-cover" alt="Gallery" />
              </div>
            ))}
          </div>
        </section>

        {/* 4. GUEST PHOTOS SECTION (NEW) */}
      <section className="mb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Guest Memories</h2>
              <p className="text-gray-500 mt-2 flex items-center gap-2">
                <Camera size={18} className="text-pink-500" /> 
                Photos shared by our wonderful guests
              </p>
            </div>
            <a href="https://instagram.com" target="_blank" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-pink-500 transition-colors">
              <Instagram size={20} /> @SerenityOnSylvan
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {guestPhotos.map((photo, idx) => (
              <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <img 
                  src={photo.url} 
                  alt="Guest shared memory" 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500" 
                />
                {/* Caption Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  <p className="text-white text-xs font-medium italic">"{photo.caption}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

        {/* 4. REVIEWS SECTION (NEW) */}
        <section className="mb-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Guest Reviews</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-pink-500">
                  <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
                </div>
                <span className="font-bold">4.9 / 5</span>
                <span className="text-gray-400 text-sm">(85 Verified Reviews)</span>
              </div>
            </div>
            <button className="mt-4 md:mt-0 bg-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-100">
              Book Your Stay
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                <Quote className="absolute -right-2 -top-2 w-16 h-16 text-gray-50 group-hover:text-pink-50 transition-colors" />
                <div className="relative z-10">
                  <div className="flex text-pink-500 mb-4">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6 italic">"{review.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-none">{review.name}</h4>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. PHOTO MODAL */}
        {selectedImg && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedImg(null)}>
            <button className="absolute top-6 right-6 text-white"><X size={40} /></button>
            <img src={selectedImg} className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" alt="Enlarged" />
          </div>
        )}
      </main>

      {/* 5. EXTERNAL BOOKING SECTION */}
{/* 5. THEMED BOOKING SECTION */}
<section className="mb-24 px-4">
  <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-8 md:p-12 text-center shadow-xl border border-pink-50 relative overflow-hidden">
    {/* Subtle decorative background glow */}
    <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl" />
    
    <div className="relative z-10">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-tight">
        Ready to visit Serenity on Sylvan?
      </h2>
      <p className="text-gray-500 mb-10 max-w-lg mx-auto font-medium">
        Book directly with us for the best rates, or use your favorite booking platform.
      </p>

      <div className="flex flex-col gap-6 items-center justify-center">
        {/* PRIMARY: DIRECT BOOKING */}
        <button 
          onClick={() => window.location.href = 'mailto:your-email@example.com?subject=Booking Inquiry for Serenity on Sylvan'}
          className="
            flex items-center justify-center gap-2
            text-sm font-black uppercase tracking-[0.25em] 
            text-pink-500 hover:!text-blue-500 
            transition-colors duration-300 whitespace-nowrap
            bg-transparent border-none p-0 
            outline-none focus:outline-none focus:ring-0
            cursor-pointer no-underline
          "
          style={{ outline: 'none', background: 'none', border: 'none', boxShadow: 'none' }}
>       
          <Camera size={18} strokeWidth={2.5} />
          Book Directly with Host
        </button>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Or find us on:</span>
          
          {/* SECONDARY: Airbnb */}
          <a 
            href="https://airbnb.com/h/your-property-link" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm transition-all"
          >
            Airbnb
          </a>

          {/* SECONDARY: VRBO */}
          <a 
            href="https://vrbo.com/your-property-id" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold text-sm transition-all"
          >
            VRBO
          </a>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t border-gray-100 flex flex-wrap justify-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
        <span>No Service Fees</span>
        <span>•</span>
        <span>Best Price Guaranteed</span>
        <span>•</span>
        <span>Personalized Service</span>
      </div>
    </div>
  </div>
</section>
      
      <footer className="border-t border-gray-200 py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center text-sm text-gray-500">
          <p>© 2026 STRway Management Systems</p>
          <Link to="/portals" className="hover:text-pink-500 transition-colors font-medium">Staff Portal</Link>
        </div>
      </footer>
    </div>
  );
};

const AmenityItem = ({ icon, label }) => (
  <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:border-pink-100 transition-colors">
    <span className="text-pink-500">{icon}</span>
    <span className="font-medium text-sm">{label}</span>
  </div>
);

export default GuestLandingPage;