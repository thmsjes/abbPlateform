import React, { useState } from 'react';
import { Wifi, BookOpen, Map, LogOut, Info, ClipboardCheck, MessageSquare, AlertCircle, X, MapPin, Phone, Thermometer, Tv } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

const GuestDashboard = () => {
  const navigate = useNavigate();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showHouseManualModal, setShowHouseManualModal] = useState(false);
  const [showLocalGuideModal, setShowLocalGuideModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showContactHostModal, setShowContactHostModal] = useState(false);
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [showTemperatureModal, setShowTemperatureModal] = useState(false);
  const [showTvModal, setShowTvModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const emergencyContacts = [
    { name: 'Our House', type: 'House Address',phone:"1-518-935-8545", address:'1600 Harborview Drive, Blossvale, NY, 13308' },
    { name: 'Local Fire Department', phone: '1-315-762-5500', type: 'Fire', address: '908 Main St, Sylvan Beach, NY 13157' },
    { name: 'Oneida Health Hospital', phone: '1-315-363-6000', type: 'Hospital', address: '321 Genesee St, Oneida, NY 13421' },
    { name: 'Village Veterinary Hospital (not 24/7 and no Sundays)', phone: '1-315-363-8700', type: 'Veterinary', address: '230 Genesee St, Canastota, NY 13032' },
    { name: 'Veterinary Medical Center of CNY (24/7)', phone: '1-315-446-7933', type: 'Veterinary', address: 'Veterinary Medical Center of CNY' },
    { name: 'Upstate New York Poison Center', phone: '1-315-476-4766', type: 'Poison', address: '750 E Adams St, Syracuse, NY 13210' },
    { name: "Oneida County Sheriff's Office", phone: '1-315-245-0800', type: 'Police', address: '30 Fayette St, Camden, NY 13316' },
  ];

  const categories = ['Fire', 'Police', 'Hospital', 'Veterinary'];

  const filteredContacts = selectedCategory 
    ? emergencyContacts.filter(contact => contact.type === selectedCategory)
    : emergencyContacts;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      
      {/* 1. MATCHING HEADER: Uses same height/feel as landing */}
      <header className="relative h-[25vh] sm:h-[30vh] w-full bg-gray-900 overflow-hidden">
        {/* You can replace this with a subtle image of the house to match the landing hero */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-black/60 flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 md:px-20 gap-2 sm:gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1 sm:mb-2">Guest Dashboard</h1>
            <p className="text-xs sm:text-base text-pink-200 font-medium">Your stay at Serenity on Sylvan</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 sm:gap-2 bg-pink-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-semibold hover:bg-pink-700 transition-all shadow-lg whitespace-nowrap"
          >
            <LogOut size={16} className="sm:w-5 sm:h-5" /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* 2. MATCHING CONTAINER: max-w-6xl like landing page */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 -mt-8 sm:-mt-10 relative z-10">
        
        {/* 3. WIFI CARD: Styled like the AmenityItems on your landing page */}
        <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-xl border border-gray-100 mb-6 sm:mb-8 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="bg-pink-50 p-2 sm:p-4 rounded-xl text-pink-500">
              <Wifi size={24} className="sm:w-8 sm:h-8"/>
            </div>
            <div>
              <p className="text-[8px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">WiFi - Lake House Guest</p>
              <p className="font-bold text-base sm:text-xl text-gray-800">yourgetawayatsylvan.com</p>
            </div>
          </div>
          <button className="w-full md:w-auto bg-gray-900 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-bold hover:bg-pink-600 transition-all active:scale-95">
            Copy Password
          </button>
        </div>

        {/* 4. DASHBOARD GRID: Matches the 4-column layout of your gallery */}
        <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800 px-2">Guest Essentials</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <DashCard 
            icon={<BookOpen />} 
            title="House Manual" 
            subtitle="Rules & Instructions"
            onClick={() => setShowHouseManualModal(true)}
          />
          <DashCard 
            icon={<AlertCircle />} 
            title="Emergency Contacts" 
            subtitle="Emergency numbers & info"
            onClick={() => setShowEmergencyModal(true)}
          />
          <DashCard 
            icon={<Map />} 
            title="Local Guide" 
            subtitle="Where to eat & explore"
            onClick={() => setShowLocalGuideModal(true)}
          />
          <DashCard 
            icon={<ClipboardCheck />} 
            title="Check-out Info" 
            subtitle="Departure checklist"
            onClick={() => setShowCheckoutModal(true)}
          />
          <DashCard 
            icon={<MessageSquare />} 
            title="Contact Host" 
            subtitle="We're here to help"
            onClick={() => setShowContactHostModal(true)}
          />
          <DashCard 
            icon={<Wifi />} 
            title="WiFi Setup" 
            subtitle="Network & password info"
            onClick={() => setShowWifiModal(true)}
          />
          <DashCard 
            icon={<Thermometer />} 
            title="Temperature Control" 
            subtitle="Thermostat & AC settings"
            onClick={() => setShowTemperatureModal(true)}
          />
          <DashCard 
            icon={<Tv />} 
            title="TVs & Entertainment" 
            subtitle="TV guides & remotes"
            onClick={() => setShowTvModal(true)}
          />
        </div>

      </main>

      {/* Emergency Contacts Modal */}
      {showEmergencyModal && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-red-600 to-red-700 text-white p-4 sm:p-6 flex items-center justify-between border-b border-red-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <AlertCircle size={24} className="sm:w-7 sm:h-7" />
                <h2 className="text-xl sm:text-2xl font-bold">Emergency Contacts</h2>
              </div>
              <button 
                onClick={() => {
                  setShowEmergencyModal(false);
                  setSelectedCategory(null);
                }}
                className="text-white hover:bg-red-800 p-2 rounded-lg transition-all flex-shrink-0"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Category Buttons */}
            <div className="sticky top-0 bg-gray-100 border-b border-gray-200 p-3 sm:p-4">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-base transition-all min-h-[36px] ${
                      selectedCategory === category 
                        ? 'bg-red-600 text-white' 
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-red-400'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
              {/* Always show Our House contact first */}
              {emergencyContacts.find(c => c.type === 'House Address') && (
                <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-300 hover:border-red-400 transition-all">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-black">{emergencyContacts.find(c => c.type === 'House Address').name}</h3>
                      <p className="text-xs text-red-600 font-semibold uppercase tracking-wide">{emergencyContacts.find(c => c.type === 'House Address').type}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <a 
                      href={`tel:${emergencyContacts.find(c => c.type === 'House Address').phone}`}
                      className="!text-black !no-underline flex items-center gap-2 sm:gap-3 hover:text-red-600 transition-colors font-semibold text-sm sm:text-base"
                    >
                      <Phone size={16} className="sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                      <span>{emergencyContacts.find(c => c.type === 'House Address').phone}</span>
                    </a>
                    {emergencyContacts.find(c => c.type === 'House Address').address && (
                      <a 
                        href={`https://www.google.com/maps/search/${encodeURIComponent(emergencyContacts.find(c => c.type === 'House Address').address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="!text-black !no-underline flex items-center gap-2 sm:gap-3 hover:text-red-600 transition-colors font-semibold text-sm sm:text-base"
                      >
                        <MapPin size={16} className="sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                        <span>{emergencyContacts.find(c => c.type === 'House Address').address}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Show filtered contacts when a category is selected */}
              {selectedCategory && (
                filteredContacts.filter(c => c.type !== 'House Address').length > 0 ? (
                  filteredContacts.filter(c => c.type !== 'House Address').map((contact, index) => (
                    <div key={index} className="bg-white rounded-xl p-3 sm:p-4 border border-gray-300 hover:border-red-400 transition-all">
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div>
                          <h3 className="font-bold text-base sm:text-lg text-black">{contact.name}</h3>
                          <p className="text-xs text-red-600 font-semibold uppercase tracking-wide">{contact.type}</p>
                        </div>
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <a 
                          href={`tel:${contact.phone}`}
                          className="!text-black !no-underline flex items-center gap-2 sm:gap-3 hover:text-red-600 transition-colors font-semibold text-sm sm:text-base"
                        >
                          <Phone size={16} className="sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                          <span>{contact.phone}</span>
                        </a>
                        {contact.address && (
                          <a 
                            href={`https://www.google.com/maps/search/${encodeURIComponent(contact.address)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="!text-black !no-underline flex items-center gap-2 sm:gap-3 hover:text-red-600 transition-colors font-semibold text-sm sm:text-base"
                          >
                            <MapPin size={16} className="sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                            <span>{contact.address}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <p className="text-sm sm:text-base">No contacts found for {selectedCategory}</p>
                  </div>
                )
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
              <button
                onClick={() => {
                  setShowEmergencyModal(false);
                  setSelectedCategory(null);
                }}
                className="w-full bg-gray-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-bold hover:bg-gray-800 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* House Manual Modal */}
      {showHouseManualModal && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6 flex items-center justify-between border-b border-blue-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <BookOpen size={24} className="sm:w-7 sm:h-7" />
                <h2 className="text-xl sm:text-2xl font-bold">House Manual</h2>
              </div>
              <button 
                onClick={() => setShowHouseManualModal(false)}
                className="text-white hover:bg-blue-800 p-2 rounded-lg transition-all flex-shrink-0"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
              <div className="bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-200">
                <h3 className="font-bold text-base sm:text-lg text-black mb-2">House Rules & Instructions</h3>
                <p className="text-black text-sm sm:text-base">Welcome to our home! Please review the following guidelines to ensure a comfortable stay:</p>
                <ul className="list-disc list-inside mt-2 sm:mt-3 space-y-1 sm:space-y-2 text-black text-sm sm:text-base">
                  <li>Check-in: 3:00 PM | Check-out: 11:00 AM</li>
                  <li>Please keep noise levels low after 10:00 PM</li>
                  <li>No smoking inside the house</li>
                  <li>Pets must be declared and approved in advance</li>
                  <li>Respect all house amenities and furnishings</li>
                  <li>Lock all doors and windows when leaving</li>
                  <li>Return keys to the lockbox before departure</li>
                </ul>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
              <button
                onClick={() => setShowHouseManualModal(false)}
                className="w-full bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Local Guide Modal */}
      {showLocalGuideModal && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-4 sm:p-6 flex items-center justify-between border-b border-green-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <Map size={24} className="sm:w-7 sm:h-7" />
                <h2 className="text-xl sm:text-2xl font-bold">Local Guide</h2>
              </div>
              <button 
                onClick={() => setShowLocalGuideModal(false)}
                className="text-white hover:bg-green-800 p-2 rounded-lg transition-all flex-shrink-0"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
              <div className="bg-green-50 rounded-xl p-3 sm:p-4 border border-green-200">
                <h3 className="font-bold text-base sm:text-lg text-black mb-2 sm:mb-3">Nearby Attractions & Dining - click for info</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="font-semibold text-black text-sm sm:text-base">🍽️ Local Restaurants</p>
                    <a href="https://www.google.com/maps/search/Harpoon+Eddies+Sylvan+Beach+NY" target="_blank" rel="noopener noreferrer" className="!text-black !no-underline text-xs sm:text-sm hover:text-green-600 font-semibold">
                      Harpoon Eddies (5 min) - Lakeside dining
                    </a>
                    <br />
                    <a href="https://www.google.com/maps/search/Farmhouse+at+Verona+Beach+NY" target="_blank" rel="noopener noreferrer" className="!text-black !no-underline text-sm hover:text-green-600 font-semibold">
                      The Farmhouse at Verona Beach (7 min) - Good breakfast
                    </a>
                    <br />
                    <a href="https://www.google.com/maps/search/Captain+John's+Restaurant+Sylvan+Beach+NY" target="_blank" rel="noopener noreferrer" className="!text-black !no-underline text-sm hover:text-green-600 font-semibold">
                      Captain John's Restaurant (3 min) - Seafood and Prime Rib specialties
                    </a>
                    <br />
                    <a href="https://www.google.com/maps/search/Rickys+Island+Grill+Sylvan+Beach+NY" target="_blank" rel="noopener noreferrer" className="!text-black !no-underline text-sm hover:text-green-600 font-semibold">
                      Rickys Island Grill (4 min) - Caribbean cuisine
                    </a>
                    <br />
                    <a href="https://www.google.com/maps/search/The+Lake+House+at+Sylvan+Beach+NY" target="_blank" rel="noopener noreferrer" className="!text-black !no-underline text-sm hover:text-green-600 font-semibold">
                      The Lake House at Sylvan Beach (5 min) - 18 and older dining
                    </a>
                    <br />
                    <a href="https://www.google.com/maps/search/Oneida+Lake+Brew+Haus+at+Sylvan+Beach+NY" target="_blank" rel="noopener noreferrer" className="!text-black !no-underline text-sm hover:text-green-600 font-semibold">
                      Oneida Lake Brew Haus (6 min) - 18 and older dining
                    </a>
                    <br />
                    <a href="https://www.google.com/maps/search/Turning+Stone+Resort+Casino+NY" target="_blank" rel="noopener noreferrer" className="!text-black !no-underline text-sm hover:text-green-600 font-semibold">
                      Turning Stone (18 min) - Casino, Fine Dining, Shows
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold text-black">🏖️ Outdoor Activities</p>
                    <a href="https://www.google.com/maps/search/Sylvan+Beach+NY" target="_blank" rel="noopener noreferrer" className="!text-black !no-underline text-sm hover:text-green-600 font-semibold">
                      Sylvan Beach Amusement Park (5 min)- Public beach access nearby
                    </a>
                    <br />
                    <a href="https://www.google.com/maps/search/Verona+Beach+State+Park+Sylvan+Beach+NY" target="_blank" rel="noopener noreferrer" className="!text-black !no-underline text-sm hover:text-green-600 font-semibold">
                      Verona Beach State Park (10 min) - Admission required to enter the park
                    </a>
                    <br />
                    <a href="https://www.google.com/maps/search/Boat+Oneida+NY" target="_blank" rel="noopener noreferrer" className="!text-black !no-underline text-sm hover:text-green-600 font-semibold">
                      Boat Oneida (15 min) - Boat rentals, recommend to call in advance
                    </a>
                  </div>
                  <div>
                    <p className="font-semibold text-black text-sm sm:text-base">🛒 Shopping & Services</p>
                    <a href="https://www.google.com/maps/search/grocery+stores+Sylvan+Beach+NY" target="_blank" rel="noopener noreferrer" className="!text-black !no-underline text-xs sm:text-sm hover:text-green-600 font-semibold">
                       TOPS Friendly Markets (17 min) - Groceries
                    </a>
                    <br />
                    <a href="https://www.google.com/maps/search/Price+Chopper+Sylvan+Beach+NY" target="_blank" rel="noopener noreferrer" className="!text-black !no-underline text-xs sm:text-sm hover:text-green-600 font-semibold">
                      Price Chopper (18 min) - Groceries
                    </a>
                    <br />
                    <a href="https://www.google.com/maps/search/Maple+Leaf+Market+Sylvan+Beach+NY" target="_blank" rel="noopener noreferrer" className="!text-black !no-underline text-xs sm:text-sm hover:text-green-600 font-semibold">
                      Maple Leaf Market (18 min) - Munchies and snacks
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-3 sm:p-6">
              <button
                onClick={() => setShowLocalGuideModal(false)}
                className="w-full bg-gray-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-bold hover:bg-gray-800 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Check-out Info Modal */}
      {showCheckoutModal && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 sm:p-6 flex items-center justify-between border-b border-orange-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <ClipboardCheck size={24} className="sm:w-7 sm:h-7" />
                <h2 className="text-xl sm:text-2xl font-bold">Check-out Info</h2>
              </div>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="text-white hover:bg-orange-800 p-2 rounded-lg transition-all flex-shrink-0"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
              <div className="bg-orange-50 rounded-xl p-3 sm:p-4 border border-orange-200">
                <h3 className="font-bold text-base sm:text-lg text-black mb-2 sm:mb-3">Departure Checklist</h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="flex items-start gap-2 sm:gap-3 text-black cursor-pointer">
                    <input type="checkbox" className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-base">Strip beds and place linens on the floor. Please start a load of laundry.</span>
                  </label>
                  <label className="flex items-start gap-2 sm:gap-3 text-black cursor-pointer">
                    <input type="checkbox" className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-base">Please turn off all lights and appliances.</span>
                  </label>
                  <label className="flex items-start gap-2 sm:gap-3 text-black cursor-pointer">
                    <input type="checkbox" className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-base">Take out trash and recycling Sunday evening for early Monday pickup.</span>
                  </label>
                  <label className="flex items-start gap-2 sm:gap-3 text-black cursor-pointer">
                    <input type="checkbox" className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-base">Close all windows and lock doors.</span>
                  </label>
                  <label className="flex items-start gap-2 sm:gap-3 text-black cursor-pointer">
                    <input type="checkbox" className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-base">Please set the thermostat to 70°f and turn off the minisplit in the dining room.</span>
                  </label>
                  <label className="flex items-start gap-2 sm:gap-3 text-black cursor-pointer">
                    <input type="checkbox" className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-base">Leave feedback about your stay and safe travels back home!</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-3 sm:p-6">
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="w-full bg-gray-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-bold hover:bg-gray-800 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Contact Host Modal */}
      {showContactHostModal && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 sm:p-6 flex items-center justify-between border-b border-purple-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <MessageSquare size={24} className="sm:w-7 sm:h-7" />
                <h2 className="text-xl sm:text-2xl font-bold">Contact Host</h2>
              </div>
              <button 
                onClick={() => setShowContactHostModal(false)}
                className="text-white hover:bg-purple-800 p-2 rounded-lg transition-all flex-shrink-0"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
              <div className="bg-purple-50 rounded-xl p-3 sm:p-4 border border-purple-200">
                <h3 className="font-bold text-base sm:text-lg text-black mb-2 sm:mb-3">Get in Touch with your hosts, Tom and Erina</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-xs text-black font-semibold uppercase">Tom's Cell Phone</p>
                    <a href="tel:+1-518-935-8545" className="!text-black !no-underline text-base sm:text-lg font-bold hover:text-purple-600">
                      +1-518-935-8545 
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-black font-semibold uppercase">Erina's Cell Phone</p>
                    <a href="tel:+1-518-522-0546" className="!text-black !no-underline text-base sm:text-lg font-bold hover:text-purple-600">
                      +1-518-522-0546 
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-black font-semibold uppercase">Email</p>
                    <a href="mailto:thmsjes@gmail.com" className="!text-black !no-underline text-base sm:text-lg font-bold hover:text-purple-600">
                      thmsjes@gmail.com
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-black font-semibold uppercase">Response Time</p>
                    <p className="text-black text-sm sm:text-base">We try and response immediately, especially via text or call.</p>
                  </div>
                  <div>
                    <p className="text-xs text-black font-semibold uppercase">Message</p>
                    <p className="text-black text-sm">Please feel free to call or text anytime during your stay. We are happy to assist or answer any questions.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-3 sm:p-6">
              <button
                onClick={() => setShowContactHostModal(false)}
                className="w-full bg-gray-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-bold hover:bg-gray-800 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* WiFi Setup Modal */}
      {showWifiModal && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white p-4 sm:p-6 flex items-center justify-between border-b border-cyan-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <Wifi size={24} className="sm:w-7 sm:h-7" />
                <h2 className="text-xl sm:text-2xl font-bold">WiFi Setup</h2>
              </div>
              <button 
                onClick={() => setShowWifiModal(false)}
                className="text-white hover:bg-cyan-800 p-2 rounded-lg transition-all flex-shrink-0"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
              <div className="bg-cyan-50 rounded-xl p-3 sm:p-4 border border-cyan-200">
                <h3 className="font-bold text-base sm:text-lg text-black mb-2 sm:mb-3">Network Information</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-xs text-black font-semibold uppercase">Network Name (SSID)</p>
                    <p className="text-black text-sm sm:text-base font-bold">Lake House Guest</p>
                  </div>
                  <div>
                    <p className="text-xs text-black font-semibold uppercase">Password</p>
                    <p className="text-black text-sm sm:text-base font-bold">yourgetawayatsylvan.com!</p>
                  </div>
                  <div>
                    <p className="text-xs text-black font-semibold uppercase">Connection Tips</p>
                    <ul className="list-disc list-inside text-black text-xs sm:text-sm space-y-1">
                      <li>For Android users, there are "Tap to Connect" coasters throughout the house. Ensure NFC is enabled on your device and tap your phone to connect.</li>
                      <li>For Apple users, there are QR coasters throughout the house. Use your camera app to scan and connect.</li>
                      <li>Or, go to WiFi settings on your device</li>
                      <li>Select the network name above</li>
                      <li>Enter the password exactly as shown</li>
                      <li>If connection fails, restart your device and try again</li>
                      <li>Contact the host if issues persist</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-3 sm:p-6">
              <button
                onClick={() => setShowWifiModal(false)}
                className="w-full bg-gray-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-bold hover:bg-gray-800 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Temperature Control Modal */}
      {showTemperatureModal && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 sm:p-6 flex items-center justify-between border-b border-amber-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <Thermometer size={24} className="sm:w-7 sm:h-7" />
                <h2 className="text-xl sm:text-2xl font-bold">Temperature Control</h2>
              </div>
              <button 
                onClick={() => setShowTemperatureModal(false)}
                className="text-white hover:bg-amber-800 p-2 rounded-lg transition-all flex-shrink-0"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
              <div className="bg-amber-50 rounded-xl p-3 sm:p-4 border border-amber-200">
                <h3 className="font-bold text-base sm:text-lg text-black mb-2 sm:mb-3">Thermostat & Climate Control</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-xs text-black font-semibold uppercase">Main Thermostat</p>
                    <p className="text-black text-xs sm:text-sm">Located in the hallway near the kitchen. Set to your desired temperature. This operates the central heating and cooling system in all living spaces including the bedrooms and bathrooms.</p>
                  </div>
                  <div>
                    <p className="text-xs text-black font-semibold uppercase">Mini Split AC (Dining Room)</p>
                    <p className="text-black text-xs sm:text-sm">Remote control (white) is located on the back wall entering the back living room. Turn OFF before checkout as per checklist.</p>
                    <ul className="list-disc list-inside text-black text-xs mt-1 space-y-0.5">
                      <li>Power: Press the Power button to turn on/off</li>
                      <li>Temperature: Use +/- buttons to adjust</li>
                      <li>Mode: Choose Cool, Heat, or Fan mode</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-black font-semibold uppercase">Fire Place</p>
                    <ul className="list-disc list-inside text-black text-xs space-y-0.5">
                      <li>There is a remote (black) to turn the fireplace on and off</li>
                      <li>The fan will turn on and off on its own</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-black font-semibold uppercase">Winter Heating</p>
                    <p className="text-black text-xs sm:text-sm">If visiting in winter, set thermostat to maintain 70°F. Keep garage door closed to prevent heat loss.</p>
                  </div>
                  <div>
                    <p className="text-xs text-black font-semibold uppercase">Fans and additional heating</p>
                    <p className="text-black text-xs sm:text-sm">Each bedroom has its own oscillating fan and there a four space heaters in the garage.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-3 sm:p-6">
              <button
                onClick={() => setShowTemperatureModal(false)}
                className="w-full bg-gray-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-bold hover:bg-gray-800 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* TVs & Entertainment Modal */}
      {showTvModal && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 sm:p-6 flex items-center justify-between border-b border-indigo-200">
              <div className="flex items-center gap-2 sm:gap-3">
                <Tv size={24} className="sm:w-7 sm:h-7" />
                <h2 className="text-xl sm:text-2xl font-bold">TVs & Entertainment</h2>
              </div>
              <button 
                onClick={() => setShowTvModal(false)}
                className="text-white hover:bg-indigo-800 p-2 rounded-lg transition-all flex-shrink-0"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
              <div className="bg-indigo-50 rounded-xl p-3 sm:p-4 border border-indigo-200">
                <h3 className="font-bold text-base sm:text-lg text-black mb-2 sm:mb-3">TV Setup & Remote Controls</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-xs text-black font-semibold uppercase">All bedrooms and living room have their own TV</p>
                    <ul className="list-disc list-inside text-black text-xs mt-1 space-y-0.5">
                      <li>Use remote to power on/off</li>
                      <li>Apps provided free: Netflix, Prime, Paramount+, and Sling</li>
                      <li>Feel free to connect your own streaming accounts</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs text-black font-semibold uppercase">Remote Controls</p>
                    <p className="text-black text-xs sm:text-sm">Remotes are located:</p>
                    <ul className="list-disc list-inside text-black text-xs mt-1 space-y-0.5">
                      <li>Living Room: Coffee table</li>
                      <li>Bedrooms: Nightstand</li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-3 sm:p-6">
              <button
                onClick={() => setShowTvModal(false)}
                className="w-full bg-gray-900 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-sm sm:text-base font-bold hover:bg-gray-800 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// Internal component matching the "AmenityItem" feel but with more depth
const DashCard = ({ icon, title, subtitle, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white p-4 sm:p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-pink-200 transition-all cursor-pointer group text-center md:text-left"
  >
    <div className="text-pink-500 mb-3 sm:mb-4 flex justify-center md:justify-start group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1">{title}</h3>
    <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
  </div>
);

export default GuestDashboard;