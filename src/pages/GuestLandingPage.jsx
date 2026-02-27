import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wifi, Car, Coffee, Wind, Dog, Waves, X, Kayak, KeyRound, BedDouble, 
  Bath, Bike, Flame, Fence, Lock, WashingMachine, Star, Quote 
} from 'lucide-react';
import { Camera, Instagram } from 'lucide-react'; // New icons for this section
import { getReviewsByPropertyId } from '../apiCalls';
// Local Assets
import Dock from '../assets/Dock.jpg';
import BackYard from '../assets/BackYard.jpg';
import BackYard2 from '../assets/BackYard2.jpg';
import DinningRoom from '../assets/DinningRoom.jpg';
import Sunset from '../assets/Sunset.jpg';
import Fish from '../assets/fish.jpg'
import Fish1 from '../assets/fish1.jpg'
import Fish2 from '../assets/fish2.jpg'
import Ladyo from '../assets/ladyo.jpg'
import Baby from '../assets/baby.jpg'
import BeachSunset from '../assets/beachSunset.jpg'

const GuestLandingPage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      reviewerName: "Sarah Jenkins",
      date: "October 2025",
      reviewText: "Absolutely stunning property. The attention to detail in the decor made it feel like a boutique hotel. We loved the sunset views from the dock!",
      score: 5
    },
    {
      id: 2,
      reviewerName: "Michael Chen",
      date: "December 2025",
      reviewText: "The perfect getaway. Super clean, modern amenities, and the kayaks were a huge plus. Will definitely be coming back!",
      score: 5
    },
    {
      id: 3,
      reviewerName: "Emma Thompson",
      date: "January 2026",
      reviewText: "Great location and very responsive host. The kitchen had everything we needed for our family of 10. Highly recommend!",
      score: 5
    }
  ]);
  const [_loadingReviews, _setLoadingReviews] = useState(false);

  // Fetch reviews on component mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        _setLoadingReviews(true);
        // Assuming propertyId = 2 for Serenity on Sylvan
        // You can change this to a dynamic propertyId if needed
        const propertyId = 2;
        const reviewsData = await getReviewsByPropertyId({ token: '', propertyId });
        
        if (reviewsData?.reviews && Array.isArray(reviewsData.reviews)) {
          // Transform API response to match display format
          const transformedReviews = reviewsData.reviews.map(review => ({
            id: review.id,
            reviewerName: review.reviewerName,
            date: review.reviewDate ? new Date(review.reviewDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '',
            reviewText: review.reviewText,
            score: parseInt(review.score) || 5
          }));
          setReviews(transformedReviews);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Keep default reviews on error
      } finally {
        _setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, []);

  const propertyImages = [
    { url: BackYard },
    { url: BackYard2 },
    { url: DinningRoom },
    { url: Sunset },
  ];

  //Property Ammenities Data
  const amenitiesList = [
    { icon: <Waves />, label: "Waterfront", desc: "Private access to Fish Creek, Erie Canal, and Lake Oneida. Perfect for morning swims or watching the sunrise." },
    { icon: <Lock />, label: "Private Dock", desc: "Our 23 x 23 wooden dock is available for your boat, or just for lounging. Offering mooring poles and deep water access to the Erie Canal and Lake Oneida." },
    { icon: <Wind />, label: "Air Conditioning", desc: "Central cooling throughout the home to keep you comfortable in the summer heat." },
    { icon: <Dog />, label: "Pet Friendly", desc: "We welcome up to 2 well-behaved dogs. The yard is fully prepared for them!" },
    { icon: <Fence />, label: "Fully Fenced Yard", desc: "A safe, enclosed space for children and pets to play safely outdoors." },
    { icon: <WashingMachine />, label: "On-Site Laundry", desc: "Full-sized washer and dryer available. We provide detergent and dryer sheets." },
    { icon: <Wifi />, label: "Fast WiFi", desc: "High-speed Verizon internet—reliable enough for video calls or streaming movies." },
    { icon: <Coffee />, label: "Coffee Station", desc: "Fully stocked with a Keurig, local ground coffee, creamers, and various teas." },
    { icon: <KeyRound />, label: "Self Check-in", desc: "Check yourself in with our secure smart lock. Your code will be sent 24 hours before arrival." },
    { icon: <Kayak />, label: "3 Kayaks", desc: "We provide 3 adult kayaks and life jackets for guest use at no extra charge." },
    { icon: <Bike />, label: "2 Bicycles", desc: "Two cruiser bikes available to explore the local trails and neighborhood." },
    { icon: <BedDouble />, label: "Sleeps 11", desc: "4 bedrooms featuring 1 King, 2 Queens, 2 Twins, 1 Twin trundle, and two pull out couches. All linens and pillows provided" },
  ];

  // Guest Photos Data
  const guestPhotos = [
    { url: Fish, caption: "Bass right off the dock." },
    { url: Fish1, caption: "PB Drum" },
    { url: BeachSunset, caption: "Sunset was unreal tonight." },
    { url: Fish2, caption: "Finally caught a fish! 🎣" },
    { url: Baby, caption: "Just hanging out!" },
    { url: Ladyo, caption: "Lady O was so peaceful today" },
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
            {amenitiesList.map((item, idx) => (
              <div key={idx} onClick={() => setSelectedAmenity(item)} className="cursor-pointer">
                <AmenityItem icon={item.icon} label={item.label} />
              </div>
            ))}
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-2">
                <div className="flex text-pink-500">
                  <Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" />
                </div>
                <span className="font-bold">5.0 / 5</span>
                <span className="text-gray-400 text-sm">(21 Verified Reviews)</span>
              </div>
            </div>
            <button className="hidden md:flex items-center justify-center mt-4 md:mt-0 bg-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-600 transition-colors shadow-lg shadow-pink-100">
              Book Your Stay
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                <Quote className="absolute -right-2 -top-2 w-16 h-16 text-gray-50 group-hover:text-pink-50 transition-colors" />
                <div className="relative z-10">
                  <div className="flex text-pink-500 mb-4">
                    {[...Array(review.score)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6 italic">"{review.reviewText}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-bold">
                      {review.reviewerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-none">{review.reviewerName}</h4>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

       {/* AMENITY DESCRIPTION MODAL */} 
        {selectedAmenity && (
          <div 
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center overflow-y-auto p-2 sm:p-4"
            onClick={() => setSelectedAmenity(null)}
          >
            <div 
              className="bg-white rounded-[2rem] p-8 max-w-sm w-full h-[calc(100dvh-1rem)] sm:h-auto sm:max-h-[calc(100dvh-2rem)] shadow-2xl relative animate-in fade-in zoom-in duration-200 overflow-y-auto overscroll-contain"
              onClick={(e) => e.stopPropagation()} 
            >
              {/* Icon with specialized pink styling */}
              <div className="text-pink-500 mb-6 flex justify-center">
                <div className="p-4 bg-pink-50 rounded-2xl scale-[1.5]">
                  {selectedAmenity.icon}
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {selectedAmenity.label}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-8">
                  {selectedAmenity.desc}
                </p>

               <button 
          onClick={() => setSelectedAmenity(null)}
          className="w-full bg-gray-900 text-pink-500 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg active:scale-95 border-none outline-none focus:outline-none focus:ring-0 hover:!bg-blue-600 hover:!text-white"
        >
          Got it
        </button>
              </div>
            </div>
          </div>
        )}
        
        {/* 5. PHOTO MODAL */}
        {selectedImg && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedImg(null)}>
            <button className="absolute top-6 right-6 text-white"><X size={40} /></button>
            <img src={selectedImg} className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" alt="Enlarged" />
          </div>
        )}
      </main>

      {/* 5. EXTERNAL BOOKING SECTION */}

      <section className="mb-24 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl sm:rounded-[3rem] p-6 sm:p-8 md:p-12 text-center shadow-xl border border-pink-50 relative overflow-hidden">
          {/* Subtle decorative background glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-tight">
              Ready to visit Serenity on Sylvan?
            </h2>
            <p className="text-gray-500 mb-8 sm:mb-10 max-w-lg mx-auto font-medium text-sm sm:text-base">
              Book directly with us for the best rates, or use your favorite booking platform.
            </p>

            <div className="flex flex-col gap-4 sm:gap-6 items-center justify-center">
              {/* PRIMARY: DIRECT BOOKING */}
              <button 
                onClick={() => window.location.href = 'mailto:your-email@example.com?subject=Booking Inquiry for Serenity on Sylvan'}
                className="
                  flex items-center justify-center gap-1 sm:gap-2
                  text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-[0.1em] sm:tracking-[0.15em] md:tracking-[0.25em] 
                  text-pink-500 hover:!text-blue-500 
                  transition-colors duration-300
                  bg-transparent border-none p-0 
                  outline-none focus:outline-none focus:ring-0
                  cursor-pointer no-underline
                "
                style={{ outline: 'none', background: 'none', border: 'none', boxShadow: 'none' }}
      >       
                <Camera size={14} strokeWidth={2.5} />
                <span className="hidden sm:inline">Book Directly with Host</span>
                <span className="sm:hidden">Book</span>
              </button>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full justify-center items-center">
                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">Or find us on:</span>

                {/* SECONDARY: Airbnb */}
                <a 
                  href="https://airbnb.com/h/your-property-link" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all"
                >
                  Airbnb
                </a>

                {/* SECONDARY: VRBO */}
                <a 
                  href="https://vrbo.com/your-property-id" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all"
                >
                  VRBO
                </a>
              </div>
            </div>

            <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-100 flex flex-wrap justify-center gap-2 sm:gap-6 text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">
              <span>No Service Fees</span>
              <span className="hidden sm:inline">•</span>
              <span>Best Price Guaranteed</span>
              <span className="hidden sm:inline">•</span>
              <span>Personalized Service</span>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="border-t border-gray-200 py-10 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-500 gap-3 sm:gap-0">
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