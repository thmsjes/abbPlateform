import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowRight, MapPin } from 'lucide-react';
import { getReservationByReference } from '../apiCalls';

const getInitialBookingReference = () => {
  const params = new URLSearchParams(window.location.search);
  const refFromQuery = params.get('ref') || params.get('bookingRef') || params.get('confirmationNumber');
  if (refFromQuery && refFromQuery.trim()) {
    return refFromQuery.trim();
  }

  const savedRef = localStorage.getItem('bookingRef');
  return savedRef ? savedRef.trim() : '';
};

const getQueryBookingReference = () => {
  const params = new URLSearchParams(window.location.search);
  const refFromQuery = params.get('ref') || params.get('bookingRef') || params.get('confirmationNumber');
  return refFromQuery && refFromQuery.trim() ? refFromQuery.trim() : '';
};

const normalizeReservationData = (rawData) => {
  const source = Array.isArray(rawData)
    ? rawData[0]
    : (rawData?.reservation || rawData?.data || rawData);

  if (!source || typeof source !== 'object') return null;

  const guest = source.guestUser || source.guest || source.customer || {};
  const property = source.propertyDetails || source.property || {};
  const hasDogs = source.dogs ?? source.hasDogs;

  return {
    ...source,
    confirmationNumber: source.confirmationNumber || source.confirmation || source.referenceNumber || '',
    checkInDate: source.checkInDate || source.checkIn || source.arrivalDate || '',
    checkoutDate: source.checkoutDate || source.checkOutDate || source.checkOut || source.departureDate || '',
    lockCode: source.lockCode || '',
    propertyId: source.propertyId || property.id || property.propertyId || '',
    customerId: source.customerId || source.userId || guest.id || guest.userId || '',
    firstName: source.firstName || guest.firstName || '',
    lastName: source.lastName || guest.lastName || '',
    email: source.email || guest.email || '',
    phoneNumber: source.phoneNumber || guest.phoneNumber || '',
    propertyName: source.propertyName || property.propertyName || property.name || '',
    address: source.address || property.address || '',
    city: source.city || property.city || '',
    state: source.state || property.state || '',
    zip: source.zip || property.zip || '',
    guestCount: source.guestCount ?? source.numberOfGuests ?? 0,
    dogs: typeof hasDogs === 'boolean' ? (hasDogs ? 'Yes' : 'No') : (hasDogs ?? 'No')
  };
};

const GuestLogin = () => {
  const [bookingRef, setBookingRef] = useState(getInitialBookingReference);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const hasAutoSubmittedRef = useRef(false);
  const navigate = useNavigate();

  const performGuestLogin = useCallback(async (referenceValue) => {
    setLoading(true);
    setError('');

    try {
      const reservationApiData = await getReservationByReference(referenceValue);
      const reservationData = normalizeReservationData(reservationApiData);
      
      // Validate that the response contains a confirmationNumber
      if (!reservationData?.confirmationNumber) {
        setError('Booking reference not found. Please check and try again.');
        setLoading(false);
        return;
      }
      
      // Store reservation data and role
      localStorage.setItem('userRole', 'guest');
      localStorage.setItem('bookingRef', referenceValue);
      localStorage.setItem('reservationData', JSON.stringify(reservationData));
      localStorage.setItem('guestName', `${reservationData.firstName} ${reservationData.lastName}`);
      
      navigate('/guest-dashboard');
    } catch (err) {
      console.error('Error fetching reservation:', err);
      if (err.response?.status === 404) {
        setError('Booking reference not found. Please check and try again.');
      } else {
        setError('Unable to connect to the server. Please try again.');
      }
      setLoading(false);
    }
  }, [navigate]);

  const handleGuestLogin = async (e) => {
    e.preventDefault();
    const referenceValue = bookingRef.trim();
    if (!referenceValue) return;
    await performGuestLogin(referenceValue);
  };

  useEffect(() => {
    if (hasAutoSubmittedRef.current || loading) return;

    const refFromQuery = getQueryBookingReference();
    if (!refFromQuery) return;

    hasAutoSubmittedRef.current = true;
    const timeoutId = window.setTimeout(() => {
      performGuestLogin(refFromQuery);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loading, performGuestLogin]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 border border-pink-50 text-center">
        <div className="bg-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-pink-600">
          <KeyRound size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Guest Access</h1>
        <p className="text-gray-500 mb-8">Enter your booking reference to unlock your stay guide.</p>

        <form onSubmit={handleGuestLogin} className="space-y-4">
          <input 
            type="text" 
            placeholder="Booking Reference (e.g. HM123)"
            className="w-full px-6 py-4 bg-gray-500 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-center font-bold tracking-widest uppercase"
            onChange={(e) => setBookingRef(e.target.value)}
            value={bookingRef}
            required
            disabled={loading}
          />
          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
          <button 
            className="w-full bg-pink-500 text-white py-4 rounded-2xl font-black hover:bg-pink-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-100 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Checking Booking...' : 'Enter Portal'} {!loading && <ArrowRight size={20} />}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-sm italic">
          <MapPin size={14} /> Serenity on Sylvan
        </div>
      </div>
    </div>
  );
};

export default GuestLogin;