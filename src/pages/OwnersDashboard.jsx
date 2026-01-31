import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { createPortal } from 'react-dom';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  LayoutDashboard, 
  Home, 
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Building,
  Zap,
  ChevronLeft,
  ChevronRight,
  Wrench,
  Sparkles
} from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import Transactions from '../components/Transactions';
import { getExpenses, getPropertyById, createReservation, updateReservation, deleteReservation, getUsersByPropertyId, getAllReservationsByPropertyId, getAllEventsByProperty, createNewInvoice, getInvoicesByProperty, getNotPaidInvoicesByProperty, updateInvoice, deleteInvoice, createExpense } from '../apiCalls';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  // Views: 'dashboard', 'expenses', 'staff', 'reservations', 'properties', 'calendar'
  const [activeView, setActiveView] = useState('properties');
  const [expensesData, setExpensesData] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [propertiesList, setPropertiesList] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [selectedPropertyDetails, setSelectedPropertyDetails] = useState(null);
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({ dateFrom: '', dateTo: '' });
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(0); // 0 = January
  
  // Reservation Modal States
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);
  const [datePickerKey, setDatePickerKey] = useState(0);
  const [cleanersList, setCleanersList] = useState([]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
    cleaner: false,
    maintenance: false
  });

  const resetStaffForm = () => {
    setStaffForm({
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      company: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      notes: '',
      cleaner: false,
      maintenance: false
    });
  };
  const [reservationForm, setReservationForm] = useState({
    confirmationNumber: '',
    customerId: '',
    propertyId: '',
    checkInDate: '',
    checkoutDate: '',
    lockCode: '',
    staffId: '',
    cleaningDateTime: ''
  });
  
  // Mock data for Staff
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'John Doe', role: 'Cleaner', email: 'john@strway.com' },
    { id: 2, name: 'Jane Smith', role: 'Maintenance', email: 'jane@strway.com' },
    { id: 3, name: 'Mike Ross', role: 'Property Manager', email: 'mike@strway.com' },
  ]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEmployeeDetailsModal, setShowEmployeeDetailsModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [editStaffForm, setEditStaffForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    notes: '',
    cleaner: false,
    maintenance: false
  });
  const [showReportIssueModal, setShowReportIssueModal] = useState(false);
  const [reportIssueForm, setReportIssueForm] = useState({
    company: '',
    staffName: '',
    issueCreatedDate: new Date().toISOString().split('T')[0],
    description: '',
    addressDate: '',
    invoiceNumber: '',
    invoiceDescription: '',
    amount: '',
    type: '',
    paid: false,
    datePaid: '',
    pending: true,
    completed: false
  });

  // NEW: Mock data for Reservations
  const [reservationsList, setReservationsList] = useState([
    { id: 1, guest: 'Sarah Connor', property: 'Sunset Suite', checkIn: '2026-01-20', checkOut: '2026-01-25', status: 'Confirmed' },
    { id: 2, guest: 'James Bond', property: 'Skyline Loft', checkIn: '2026-02-01', checkOut: '2026-02-05', status: 'Pending' },
  ]);

  // NEW: State for events
  const [eventsList, setEventsList] = useState([]);

  // State for invoices
  const [invoicesList, setInvoicesList] = useState([]);
  const [unpaidInvoicesList, setUnpaidInvoicesList] = useState([]);
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false);
  
  // State for staff details modal from invoices
  const [selectedStaffForDetails, setSelectedStaffForDetails] = useState(null);
  const [showStaffDetailsModal, setShowStaffDetailsModal] = useState(false);
  
  // State for invoice editing
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false);
  const [editInvoiceForm, setEditInvoiceForm] = useState({
    company: '',
    staffName: '',
    issueCreatedDate: '',
    addressDate: '',
    description: '',
    invoiceNumber: '',
    invoiceDescription: '',
    amount: '',
    type: '',
    status: ''
  });

  // State for payment modal
  const [invoiceToPayFor, setInvoiceToPayFor] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    datePaid: new Date().toISOString().split('T')[0],
    howPaid: 'Credit Card'
  });

  // Mock data for Dashboard Stats
  const stats = [
    { label: 'Total Revenue', value: '$12,450', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Active Bookings', value: reservationsList.length.toString(), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Avg. Occupancy', value: '82%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Staff Active', value: staffList.length.toString(), icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const deleteStaff = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL_BASE}/api/User?id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 200 || response.status === 204) {
        alert('Staff member deleted successfully!');
        // Refresh staff list
        if (selectedPropertyId) {
          const staffData = await getUsersByPropertyId({ token, propertyId: selectedPropertyId });
          if (staffData && Array.isArray(staffData)) {
            const mappedStaff = staffData
              .filter(user => {
                const access = parseInt(user.access);
                return access !== 1 && access !== 4;
              })
              .map(user => ({
                id: user.id,
                username: user.username || '',
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
                email: user.email || '',
                role: parseInt(user.access) === 2 ? 'Cleaner' : 'Maintenance',
                access: user.access,
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phoneNumber: user.phoneNumber || '',
                company: user.company || '',
                address: user.address || '',
                city: user.city || '',
                state: user.state || '',
                zip: user.zip || '',
                notes: user.notes || ''
              }));
            setStaffList(mappedStaff);
          }
        }
      }
    } catch (error) {
      console.error('Error deleting staff member:', error);
      alert('Failed to delete staff member: ' + (error.response?.data?.message || error.message));
    }
  };

  // Staff form handlers
  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    console.log('Add staff form submitted');
    try {
      const token = localStorage.getItem('token');
      
      const staffData = {
        propertyId: selectedPropertyId,
        username: staffForm.username,
        password: staffForm.password,
        admin: false,
        cleaner: staffForm.cleaner,
        maintenance: staffForm.maintenance,
        firstName: staffForm.firstName,
        lastName: staffForm.lastName,
        email: staffForm.email,
        phoneNumber: staffForm.phoneNumber,
        confirmationNumber: '',
        company: staffForm.company,
        address: staffForm.address,
        city: staffForm.city,
        state: staffForm.state,
        zip: staffForm.zip,
        notes: staffForm.notes
      };

      console.log('Sending staff data:', staffData);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL_BASE}/api/register`,
        staffData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Response:', response);

      if (response.status === 200 || response.status === 201) {
        alert('Staff member added successfully!');
        setShowAddStaffModal(false);
        setStaffForm({
          username: '',
          password: '',
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          company: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          notes: '',
          cleaner: false,
          maintenance: false
        });
        // Refresh staff list
        if (selectedPropertyId) {
          const staffData = await getUsersByPropertyId({ token, propertyId: selectedPropertyId });
          if (staffData && Array.isArray(staffData)) {
            const mappedStaff = staffData
              .filter(user => {
                const access = parseInt(user.access);
                return access !== 1 && access !== 4;
              })
              .map(user => {
                const access = parseInt(user.access);
                let role = 'Staff';
                if (access === 2) role = 'Cleaner';
                else if (access === 3) role = 'Maintenance';
                return { id: user.id, username: user.username || '', name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown', email: user.email || '', role, access, firstName: user.firstName || '', lastName: user.lastName || '', phoneNumber: user.phoneNumber || '', company: user.company || '', address: user.address || '', city: user.city || '', state: user.state || '', zip: user.zip || '', notes: user.notes || '' };
              });
            setStaffList(mappedStaff);
          }
        }
      }
    } catch (error) {
      console.error('Error adding staff member:', error);
      alert('Failed to add staff member: ' + (error.response?.data?.message || error.message));
    }
  };

  // Update staff member
  const handleUpdateStaffSubmit = async (e) => {
    e.preventDefault();
    if (!editingEmployee) return;
    
    try {
      const token = localStorage.getItem('token');
      
      const staffData = {
        id: editingEmployee.id,
        username: editingEmployee.username || '',
        access: editingEmployee.access.toString(),
        firstName: editStaffForm.firstName,
        lastName: editStaffForm.lastName,
        email: editStaffForm.email,
        phoneNumber: editStaffForm.phoneNumber,
        company: editStaffForm.company,
        address: editStaffForm.address,
        city: editStaffForm.city,
        state: editStaffForm.state,
        zip: editStaffForm.zip,
        notes: editStaffForm.notes,
        cleaner: editStaffForm.cleaner,
        maintenance: editStaffForm.maintenance
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL_BASE}/api/User?id=${editingEmployee.id}`,
        staffData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.isSuccess) {
        alert('Staff member updated successfully!');
        setShowEditStaffModal(false);
        setEditingEmployee(null);
        setEditStaffForm({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          company: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          notes: '',
          cleaner: false,
          maintenance: false
        });
        // Refresh staff list
        if (selectedPropertyId) {
          const staffData = await getUsersByPropertyId({ token, propertyId: selectedPropertyId });
          if (staffData && Array.isArray(staffData)) {
            const mappedStaff = staffData
              .filter(user => {
                const access = parseInt(user.access);
                return access !== 1 && access !== 4;
              })
              .map(user => {
                const access = parseInt(user.access);
                let role = 'Staff';
                if (access === 2) role = 'Cleaner';
                else if (access === 3) role = 'Maintenance';
                return { id: user.id, username: user.username || '', name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown', email: user.email || '', role, access, firstName: user.firstName || '', lastName: user.lastName || '', phoneNumber: user.phoneNumber || '', company: user.company || '', address: user.address || '', city: user.city || '', state: user.state || '', zip: user.zip || '', notes: user.notes || '' };
              });
            setStaffList(mappedStaff);
          }
        }
      } else {
        alert('Failed to update staff member: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error updating staff member:', error);
      alert('Failed to update staff member: ' + (error.response?.data?.message || error.message));
    }
  };

  // Reservation handlers
  const openNewReservationModal = () => {
    setEditingReservation(null);
    setReservationForm({
      confirmationNumber: '',
      customerId: '',
      propertyId: selectedPropertyId || '',
      checkInDate: '',
      checkoutDate: '',
      lockCode: '',
      staffId: '',
      cleaningDateTime: ''
    });
    setDatePickerKey(prev => prev + 1);
    setShowReservationModal(true);
  };

  const openEditReservationModal = (reservation) => {
    setEditingReservation(reservation);
    setReservationForm({
      confirmationNumber: reservation.confirmationNumber || '',
      customerId: reservation.customerId || '',
      propertyId: reservation.propertyId || selectedPropertyId || '',
      checkInDate: reservation.checkIn || '',
      checkoutDate: reservation.checkOut || '',
      lockCode: reservation.lockCode || '',
      staffId: reservation.staffId || '',
      cleaningDateTime: reservation.cleaningDateTime || ''
    });
    setDatePickerKey(prev => prev + 1);
    setShowReservationModal(true);
  };

  const closeReservationModal = () => {
    setShowReservationModal(false);
    setEditingReservation(null);
  };

  const handleSaveReservation = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (editingReservation) {
        // Update reservation
        const updateData = {
          id: editingReservation.id,
          confirmationNumber: reservationForm.confirmationNumber,
          customerId: reservationForm.customerId,
          propertyId: reservationForm.propertyId || selectedPropertyId,
          checkInDate: reservationForm.checkInDate,
          checkoutDate: reservationForm.checkoutDate,
          lockCode: reservationForm.lockCode,
          staffId: reservationForm.staffId,
          cleaningDateTime: reservationForm.cleaningDateTime
        };
        await updateReservation({ token, reservationData: updateData });
        
        setReservationsList(reservationsList.map(r => 
          r.id === editingReservation.id 
            ? { 
                ...r, 
                confirmationNumber: reservationForm.confirmationNumber,
                customerId: reservationForm.customerId,
                checkIn: reservationForm.checkInDate, 
                checkOut: reservationForm.checkoutDate,
                lockCode: reservationForm.lockCode,
                staffId: reservationForm.staffId,
                cleaningDateTime: reservationForm.cleaningDateTime
              }
            : r
        ));
      } else {
        // Create new reservation
        const createData = {
          confirmationNumber: reservationForm.confirmationNumber,
          customerId: reservationForm.customerId,
          propertyId: reservationForm.propertyId || selectedPropertyId,
          checkInDate: reservationForm.checkInDate,
          checkoutDate: reservationForm.checkoutDate,
          lockCode: reservationForm.lockCode,
          staffId: reservationForm.staffId,
          cleaningDateTime: reservationForm.cleaningDateTime
        };
        const response = await createReservation({ token, reservationData: createData });
        
        setReservationsList([...reservationsList, {
          id: response.id || Math.max(...reservationsList.map(r => r.id), 0) + 1,
          guest: reservationForm.customerId,
          property: selectedPropertyDetails?.propertyName || 'Property',
          checkIn: reservationForm.checkInDate,
          checkOut: reservationForm.checkoutDate,
          confirmationNumber: reservationForm.confirmationNumber,
          customerId: reservationForm.customerId,
          lockCode: reservationForm.lockCode,
          staffId: reservationForm.staffId,
          cleaningDateTime: reservationForm.cleaningDateTime,
          status: 'Pending'
        }]);
      }
      
      closeReservationModal();
    } catch (error) {
      console.error('Error saving reservation:', error);
      alert('Error saving reservation');
    }
  };

  const handleDeleteReservation = async (id) => {
    if(window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        const token = localStorage.getItem('token');
        await deleteReservation({ token, reservationId: id });
        setReservationsList(reservationsList.filter(r => r.id !== id));
      } catch (error) {
        console.error('Error deleting reservation:', error);
        alert('Error deleting reservation');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  // Function to get first and last day of current month
  const getMonthDateRange = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    return { firstDay, lastDay };
  };

  const handleSelectProperty = (property) => {
    console.log('Property selected:', property);
    // Use id field if propertyId is null
    const propId = property.id || property.propertyId;
    setSelectedPropertyId(propId);
    setSelectedPropertyDetails(property);
    // Store propertyId in localStorage for child components/portals
    localStorage.setItem('propertyId', propId);
  };

  const handleViewOwner = (owner) => {
    setSelectedOwner(owner);
    setShowOwnerModal(true);
  };

  const closeOwnerModal = () => {
    setShowOwnerModal(false);
    setSelectedOwner(null);
  };

  // Fetch expenses when activeView changes to 'expenses' or selectedPropertyId changes
  useEffect(() => {
    if (activeView === 'expenses' && selectedPropertyId) {
      const fetchExpenses = async () => {
        setLoadingExpenses(true);
        try {
          const token = localStorage.getItem('token');
          const { firstDay, lastDay } = getMonthDateRange();
          
          const attributes = {
            startDate: firstDay,
            endDate: lastDay,
            propertyId: selectedPropertyId
          };

          const data = await getExpenses({ token, attributes });
          setExpensesData(data || []);
          setCurrentFilters({ dateFrom: firstDay, dateTo: lastDay });
        } catch (error) {
          console.error('Failed to fetch expenses:', error);
          setExpensesData([]);
        } finally {
          setLoadingExpenses(false);
        }
      };

      fetchExpenses();
    }
  }, [activeView, selectedPropertyId]);

  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      setLoadingProperties(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Decode JWT to get property IDs
        const decoded = jwtDecode(token);
        const propertyIds = decoded['PropertyId']; // Adjust this key based on your JWT structure

        if (propertyIds && Array.isArray(propertyIds)) {
          // Fetch each property - convert string IDs to integers and preserve the ID
          const properties = await Promise.all(
            propertyIds.map(async (id) => {
              const property = await getPropertyById({ token, propertyId: parseInt(id, 10) });
              return {
                ...property,
                id: parseInt(id, 10) // Store the original ID that came from JWT
              };
            })
          );
          setPropertiesList(properties);
        } else if (propertyIds && typeof propertyIds === 'string') {
          // If single property ID - convert to integer
          const propertyId = parseInt(propertyIds, 10);
          const property = await getPropertyById({ token, propertyId });
          setPropertiesList([{
            ...property,
            id: propertyId
          }]);
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        setPropertiesList([]);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchProperties();
  }, []);

  // Fetch cleaners when modal opens and property is selected
  useEffect(() => {
    if (showReservationModal && selectedPropertyId) {
      const fetchCleaners = async () => {
        try {
          const token = localStorage.getItem('token');
          const users = await getUsersByPropertyId({ token, propertyId: selectedPropertyId });
          
          // Get current user info
          const currentUser = jwtDecode(token);
          
          console.log('API Users:', users);
          console.log('Current User from JWT:', currentUser);
          
          // Filter for access code 2 (cleaners) - note: API returns 'access' as string
          const cleaners = users.filter(user => user.access === "2");
          
          // Add owner to the list (using current user info from JWT)
          const ownerObj = {
            id: currentUser['UserId'] || currentUser['id'] || currentUser['sub'],
            firstName: currentUser['FirstName'] || currentUser['firstName'] || 'Owner',
            lastName: currentUser['LastName'] || currentUser['lastName'] || '',
            name: `${currentUser['FirstName'] || currentUser['firstName'] || 'Owner'} ${currentUser['LastName'] || currentUser['lastName'] || ''}`.trim(),
            access: currentUser['AccessLevel'] || currentUser['access'] || "1"
          };
          
          console.log('Owner object:', ownerObj);
          
          // Combine owner first, then cleaners
          const allCleaners = [ownerObj, ...cleaners];
          
          // Remove duplicates by id
          const uniqueCleaners = allCleaners.filter((value, index, self) =>
            index === self.findIndex((t) => (t.id === value.id))
          );
          
          console.log('Final cleaners list:', uniqueCleaners);
          setCleanersList(uniqueCleaners);
        } catch (error) {
          console.error('Failed to fetch cleaners:', error);
          setCleanersList([]);
        }
      };

      fetchCleaners();
    }
  }, [showReservationModal, selectedPropertyId]);

  // Fetch reservations and events when property is selected
  useEffect(() => {
    if (selectedPropertyId) {
      const fetchReservationsAndEvents = async () => {
        try {
          const token = localStorage.getItem('token');
          
          // Fetch reservations
          const reservations = await getAllReservationsByPropertyId({ token, propertyId: selectedPropertyId });
          if (reservations && Array.isArray(reservations)) {
            // Map API response to expected format
            const mappedReservations = reservations.map(res => {
              // Extract just the date portion (YYYY-MM-DD) ignoring time and timezone
              const checkInDate = res.checkInDate ? res.checkInDate.split('T')[0] : '';
              const checkOutDate = res.checkoutDate ? res.checkoutDate.split('T')[0] : '';
              
              return {
                id: res.id,
                confirmationNumber: res.confirmationNumber,
                customerId: res.customerId,
                guest: res.guestName || res.customerId,
                property: selectedPropertyDetails?.propertyName,
                checkIn: checkInDate,
                checkOut: checkOutDate,
                lockCode: res.lockCode,
                staffId: res.staffId,
                status: res.status || 'Pending'
              };
            });
            setReservationsList(mappedReservations);
          }
          
          // Fetch events
          const events = await getAllEventsByProperty({ token, propertyId: selectedPropertyId });
          if (events && Array.isArray(events)) {
            // Normalize event dates to YYYY-MM-DD format
            const normalizedEvents = events.map(event => ({
              ...event,
              eventDate: event.eventDate ? event.eventDate.split('T')[0] : event.eventDate
            }));
            setEventsList(normalizedEvents);
          }

          // Fetch staff by property
          const staffData = await getUsersByPropertyId({ token, propertyId: selectedPropertyId });
          if (staffData && Array.isArray(staffData)) {
            // Map staff by access level: 2 = Cleaner, 3 = Maintenance
            // Filter out access 1 (owner) and 4 (customer)
            const mappedStaff = staffData
              .filter(user => {
                const access = parseInt(user.access);
                return access !== 1 && access !== 4;
              })
              .map(user => {
                const access = parseInt(user.access);
                let role = 'Staff';
                if (access === 2) role = 'Cleaner';
                else if (access === 3) role = 'Maintenance';
                
                return {
                  id: user.id,
                  username: user.username || '',
                  name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown',
                  email: user.email || '',
                  role: role,
                  access: access,
                  firstName: user.firstName || '',
                  lastName: user.lastName || '',
                  phoneNumber: user.phoneNumber || '',
                  company: user.company || '',
                  address: user.address || '',
                  city: user.city || '',
                  state: user.state || '',
                  zip: user.zip || '',
                  notes: user.notes || ''
                };
              });
            setStaffList(mappedStaff);
          }
        } catch (error) {
          console.error('Failed to fetch reservations, events, and staff:', error);
          // Keep using mock data if API fails
        }
      };

      fetchReservationsAndEvents();
    }
  }, [selectedPropertyId, selectedPropertyDetails]);

  // Fetch invoices when maintenance view is active or property changes
  useEffect(() => {
    if (selectedPropertyId) {
      const fetchInvoices = async () => {
        try {
          const token = localStorage.getItem('token');
          
          // Fetch all invoices
          const data = await getInvoicesByProperty({ token, propertyId: selectedPropertyId });
          if (data && Array.isArray(data)) {
            setInvoicesList(data);
          }
          
          // Fetch unpaid invoices
          const unpaidData = await getNotPaidInvoicesByProperty({ token, propertyId: selectedPropertyId });
          if (unpaidData && Array.isArray(unpaidData)) {
            setUnpaidInvoicesList(unpaidData);
          }
        } catch (error) {
          console.error('Error fetching invoices:', error);
          setInvoicesList([]);
          setUnpaidInvoicesList([]);
        }
      };
      fetchInvoices();
    }
  }, [selectedPropertyId]);

  // Helper function to get staff info by ID
  const getStaffInfoById = (staffId) => {
    const staff = staffList.find(s => s.id === staffId);
    return {
      name: staff ? staff.name : 'Unknown',
      company: staff ? staff.company : 'N/A'
    };
  };

  // Handle edit invoice - open modal with invoice data
  const handleEditInvoice = (invoice) => {
    const staffInfo = staffList.find(s => s.id === invoice.staffId);
    setSelectedInvoice(invoice);
    setEditInvoiceForm({
      company: staffInfo?.company || '',
      staffName: invoice.staffId.toString() || '',
      issueCreatedDate: invoice.dateCreated ? invoice.dateCreated.split('T')[0] : '',
      addressDate: invoice.dateCompleted ? invoice.dateCompleted.split('T')[0] : '',
      description: invoice.repairDescription || '',
      invoiceNumber: invoice.invoiceNumber || '',
      invoiceDescription: invoice.invoiceDescription || '',
      amount: invoice.amount?.toString() || '',
      type: invoice.type || '',
      status: invoice.paid ? 'paid' : invoice.completed ? 'completed' : 'open'
    });
    setShowEditInvoiceModal(true);
  };

  // Handle save invoice changes
  const handleSaveInvoice = async () => {
    try {
      const token = localStorage.getItem('token');
      const staffId = parseInt(editInvoiceForm.staffName);
      const invoiceId = selectedInvoice?.id;
      
      if (!invoiceId) {
        alert('Error: Invoice ID not found');
        return;
      }
      
      const invoiceData = {
        id: invoiceId,
        request: '',
        invoiceNumber: editInvoiceForm.invoiceNumber || '',
        invoiceDescription: editInvoiceForm.invoiceDescription || '',
        propertyId: selectedPropertyId,
        staffId: staffId,
        dateCreated: editInvoiceForm.issueCreatedDate + 'T00:00:00.000Z',
        dateCompleted: editInvoiceForm.addressDate + 'T00:00:00.000Z',
        amount: editInvoiceForm.amount?.toString() || '0',
        repairDescription: editInvoiceForm.description,
        createdBy: 0,
        paid: editInvoiceForm.status === 'paid',
        datePaid: editInvoiceForm.status === 'paid' ? new Date().toISOString() : null,
        type: editInvoiceForm.type,
        dateToBeAddressed: editInvoiceForm.addressDate + 'T00:00:00.000Z',
        pending: editInvoiceForm.status === 'open',
        completed: editInvoiceForm.status === 'completed'
      };
      
      await updateInvoice({ token, invoiceId: invoiceId, invoiceData });
      
      // Refresh invoice lists
      if (selectedPropertyId) {
        const allInvoices = await getInvoicesByProperty({ token, propertyId: selectedPropertyId });
        setInvoicesList(allInvoices || []);
        
        const unpaidInvoices = await getNotPaidInvoicesByProperty({ token, propertyId: selectedPropertyId });
        setUnpaidInvoicesList(unpaidInvoices || []);
      }
      
      setShowEditInvoiceModal(false);
      alert('Invoice updated successfully');
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert('Failed to update invoice');
    }
  };

  // Handle delete invoice
  const handleDeleteInvoice = async (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        const token = localStorage.getItem('token');
        await deleteInvoice({ token, invoiceId });
        
        // Refresh invoice lists
        if (selectedPropertyId) {
          const allInvoices = await getInvoicesByProperty({ token, propertyId: selectedPropertyId });
          setInvoicesList(allInvoices || []);
          
          const unpaidInvoices = await getNotPaidInvoicesByProperty({ token, propertyId: selectedPropertyId });
          setUnpaidInvoicesList(unpaidInvoices || []);
        }
        
        alert('Invoice deleted successfully');
      } catch (error) {
        console.error('Error deleting invoice:', error);
        alert('Failed to delete invoice');
      }
    }
  };

  // Handle pay invoice - open payment modal
  const handlePayInvoice = (invoice) => {
    setInvoiceToPayFor(invoice);
    setPaymentForm({
      datePaid: new Date().toISOString().split('T')[0],
      howPaid: 'Credit Card'
    });
    setShowPaymentModal(true);
  };

  // Handle submit payment
  const handleSubmitPayment = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Get staff info to get company name
      const staffInfo = staffList.find(s => s.id === invoiceToPayFor.staffId);
      const companyName = staffInfo?.company || 'Unknown Vendor';
      
      // First API call: Update invoice to mark as paid
      const invoiceData = {
        id: invoiceToPayFor.id,
        request: '',
        invoiceNumber: invoiceToPayFor.invoiceNumber || '',
        invoiceDescription: invoiceToPayFor.invoiceDescription || '',
        propertyId: invoiceToPayFor.propertyId,
        staffId: invoiceToPayFor.staffId,
        dateCreated: invoiceToPayFor.dateCreated,
        dateCompleted: invoiceToPayFor.dateCompleted,
        amount: invoiceToPayFor.amount?.toString() || '0',
        repairDescription: invoiceToPayFor.repairDescription || '',
        createdBy: invoiceToPayFor.createdBy || 0,
        paid: true,
        datePaid: paymentForm.datePaid + 'T00:00:00.000Z',
        type: invoiceToPayFor.type,
        dateToBeAddressed: invoiceToPayFor.dateToBeAddressed,
        pending: false,
        completed: invoiceToPayFor.completed || false
      };
      
      await updateInvoice({ token, invoiceId: invoiceToPayFor.id, invoiceData });
      
      // Second API call: Create expense record
      const expenseData = {
        description: invoiceToPayFor.invoiceDescription || invoiceToPayFor.repairDescription || 'Invoice Payment',
        amount: parseFloat(invoiceToPayFor.amount) || 0,
        date: paymentForm.datePaid,
        category: invoiceToPayFor.type || 'Maintenance',
        propertyId: invoiceToPayFor.propertyId,
        paymentType: paymentForm.howPaid,
        vendor: companyName
      };
      
      await createExpense({ token, expenseData });
      
      // Refresh invoice lists
      if (selectedPropertyId) {
        const allInvoices = await getInvoicesByProperty({ token, propertyId: selectedPropertyId });
        setInvoicesList(allInvoices || []);
        
        const unpaidInvoices = await getNotPaidInvoicesByProperty({ token, propertyId: selectedPropertyId });
        setUnpaidInvoicesList(unpaidInvoices || []);
      }
      
      setShowPaymentModal(false);
      alert(`Payment recorded successfully via ${paymentForm.howPaid}`);
    } catch (error) {
      console.error('Error submitting payment:', error);
      alert('Failed to record payment');
    }
  };

  const portalRootRef = useRef(null);

  // Setup portal root on mount
  useEffect(() => {
    if (!portalRootRef.current) {
      portalRootRef.current = document.createElement('div');
      portalRootRef.current.id = 'staff-modal-root';
      document.body.appendChild(portalRootRef.current);
    }
    return () => {
      if (portalRootRef.current && document.body.contains(portalRootRef.current)) {
        document.body.removeChild(portalRootRef.current);
        portalRootRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {showAddStaffModal && portalRootRef.current && createPortal(
        <div onClick={(e) => {if (e.target === e.currentTarget) {resetStaffForm(); setShowAddStaffModal(false);}}} className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto">
          <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 my-8 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white">Add Staff Member</h2>
              </div>
            </div>
            
            {/* Content */}
            <form onSubmit={handleAddStaffSubmit} className="p-8 space-y-6">
              {/* Row 1: Username and Password */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Username</label>
                  <input type="text" value={staffForm.username} onChange={(e) => setStaffForm({...staffForm, username: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Password</label>
                  <input type="password" value={staffForm.password} onChange={(e) => setStaffForm({...staffForm, password: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400" />
                </div>
              </div>

              {/* Row 2: First and Last Name */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">First Name</label>
                  <input type="text" value={staffForm.firstName} onChange={(e) => setStaffForm({...staffForm, firstName: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Last Name</label>
                  <input type="text" value={staffForm.lastName} onChange={(e) => setStaffForm({...staffForm, lastName: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400" />
                </div>
              </div>

              {/* Row 3: Email and Phone */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Email</label>
                  <input type="email" value={staffForm.email} onChange={(e) => setStaffForm({...staffForm, email: e.target.value})} required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Phone Number</label>
                  <input type="tel" value={staffForm.phoneNumber} onChange={(e) => setStaffForm({...staffForm, phoneNumber: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400" />
                </div>
              </div>

              {/* Row 4: Company and Address */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Company</label>
                  <input type="text" value={staffForm.company} onChange={(e) => setStaffForm({...staffForm, company: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Address</label>
                  <input type="text" value={staffForm.address} onChange={(e) => setStaffForm({...staffForm, address: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400" />
                </div>
              </div>

              {/* Row 5: City, State, Zip */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">City</label>
                  <input type="text" value={staffForm.city} onChange={(e) => setStaffForm({...staffForm, city: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">State</label>
                  <input type="text" value={staffForm.state} onChange={(e) => setStaffForm({...staffForm, state: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400" />
                </div>
                <div>
                  <label className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Zip</label>
                  <input type="text" value={staffForm.zip} onChange={(e) => setStaffForm({...staffForm, zip: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400" />
                </div>
              </div>

              {/* Row 6: Notes */}
              <div>
                <label className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Notes</label>
                <textarea value={staffForm.notes} onChange={(e) => setStaffForm({...staffForm, notes: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24 text-slate-900 placeholder-slate-400" />
              </div>

              {/* Row 7: Roles (Colored Checkboxes with Icons) */}
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setStaffForm({...staffForm, cleaner: !staffForm.cleaner, maintenance: false})}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${staffForm.cleaner ? 'border-green-500 bg-green-50' : 'border-slate-200 bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${staffForm.cleaner ? 'bg-green-500' : 'bg-slate-300'}`}>
                      {staffForm.cleaner && <Sparkles size={16} className="text-white" />}
                    </div>
                    <span className={`font-semibold ${staffForm.cleaner ? 'text-green-700' : 'text-slate-600'}`}>Cleaner</span>
                  </div>
                </div>
                <div 
                  onClick={() => setStaffForm({...staffForm, maintenance: !staffForm.maintenance, cleaner: false})}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${staffForm.maintenance ? 'border-red-500 bg-red-50' : 'border-slate-200 bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded flex items-center justify-center ${staffForm.maintenance ? 'bg-red-500' : 'bg-slate-300'}`}>
                      {staffForm.maintenance && <Wrench size={16} className="text-white" />}
                    </div>
                    <span className={`font-semibold ${staffForm.maintenance ? 'text-red-700' : 'text-slate-600'}`}>Maintenance</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-200">
                <button type="button" onClick={() => {resetStaffForm(); setShowAddStaffModal(false);}} className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Add Staff Member</button>
              </div>
            </form>
          </div>
        </div>,
        portalRootRef.current
      )}

      {/* EDIT STAFF MODAL */}
      {showEditStaffModal && editingEmployee && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6 rounded-t-3xl">
              <h2 className="text-2xl font-black text-white">Edit Staff Member</h2>
            </div>
            <form onSubmit={handleUpdateStaffSubmit} className="p-8">
              {/* Row 1: First Name & Last Name */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">First Name</label>
                  <input
                    type="text"
                    value={editStaffForm.firstName}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={editStaffForm.lastName}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Email</label>
                  <input
                    type="email"
                    value={editStaffForm.email}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={editStaffForm.phoneNumber}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, phoneNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              {/* Row 3: Company & Address */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Company</label>
                  <input
                    type="text"
                    value={editStaffForm.company}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, company: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Address</label>
                  <input
                    type="text"
                    value={editStaffForm.address}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, address: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Address"
                  />
                </div>
              </div>

              {/* Row 4: City, State & Zip */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">City</label>
                  <input
                    type="text"
                    value={editStaffForm.city}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, city: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">State</label>
                  <input
                    type="text"
                    value={editStaffForm.state}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, state: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Zip</label>
                  <input
                    type="text"
                    value={editStaffForm.zip}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, zip: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Zip"
                  />
                </div>
              </div>

              {/* Row 5: Notes */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-900 mb-2">Notes</label>
                <textarea
                  value={editStaffForm.notes}
                  onChange={(e) => setEditStaffForm({ ...editStaffForm, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Notes"
                  rows="3"
                />
              </div>

              {/* Row 6: Role Selection */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-slate-900 mb-4">Role</label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setEditStaffForm({ ...editStaffForm, cleaner: !editStaffForm.cleaner, maintenance: false })}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3 ${editStaffForm.cleaner ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <Sparkles size={24} className={editStaffForm.cleaner ? 'text-green-700' : 'text-gray-400'} />
                    <span className={`font-bold ${editStaffForm.cleaner ? 'text-green-700' : 'text-gray-600'}`}>Cleaner</span>
                  </div>
                  <div
                    onClick={() => setEditStaffForm({ ...editStaffForm, maintenance: !editStaffForm.maintenance, cleaner: false })}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3 ${editStaffForm.maintenance ? 'bg-red-50 border-red-500' : 'bg-gray-50 border-gray-200'}`}
                  >
                    <Wrench size={24} className={editStaffForm.maintenance ? 'text-red-700' : 'text-gray-400'} />
                    <span className={`font-bold ${editStaffForm.maintenance ? 'text-red-700' : 'text-gray-600'}`}>Maintenance</span>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-200">
                <button type="button" onClick={() => { setShowEditStaffModal(false); setEditingEmployee(null); }} className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Update Staff Member</button>
              </div>
            </form>
          </div>
        </div>,
        portalRootRef.current
      )}

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col shrink-0">
        <div className="p-8 font-black text-2xl tracking-tighter italic text-blue-400">STRway</div>
        
        <nav className="flex-1 px-4 space-y-2">
          <NavItem 
            icon={<Building size={20} />} 
            label="Properties" 
            active={activeView === 'properties'}
            onClick={() => setActiveView('properties')} 
          />
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeView === 'dashboard'}
            onClick={() => setActiveView('dashboard')}
            disabled={!selectedPropertyId}
          />
          {/* RESERVATIONS MENU ITEM */}
          <NavItem 
            icon={<Calendar size={20} />} 
            label="Reservations" 
            active={activeView === 'reservations'}
            onClick={() => setActiveView('reservations')}
            disabled={!selectedPropertyId}
          />
          {/* CALENDAR MENU ITEM */}
          <NavItem 
            icon={<Calendar size={20} />} 
            label="Calendar" 
            active={activeView === 'calendar'}
            onClick={() => setActiveView('calendar')}
            disabled={!selectedPropertyId}
          />
          <NavItem 
            icon={<Home size={20} />} 
            label="Expenses" 
            active={activeView === 'expenses'}
            onClick={() => setActiveView('expenses')}
            disabled={!selectedPropertyId}
          />
          {/* MILEAGE MENU ITEM */}
          <NavItem 
            icon={<Zap size={20} />} 
            label="Mileage" 
            active={activeView === 'mileage'}
            onClick={() => setActiveView('mileage')}
            disabled={!selectedPropertyId}
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Staff" 
            active={activeView === 'staff'}
            onClick={() => setActiveView('staff')}
            disabled={!selectedPropertyId}
          />
          {/* MAINTENANCE & REPAIR MENU ITEM */}
          <NavItem 
            icon={<Wrench size={20} />} 
            label="Maintenance & Repair" 
            active={activeView === 'maintenance'}
            onClick={() => setActiveView('maintenance')}
            disabled={!selectedPropertyId}
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="flex items-center gap-3 text-slate-400 hover:text-pink-500 transition-colors w-full px-4 py-3">
            <LogOut size={20} /> <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-y-auto">
        
        {/* VIEW: DASHBOARD */}
        {activeView === 'dashboard' && (
          <div className="animate-in fade-in duration-500">
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-black text-gray-900">Owner Overview</h1>
                <p className="text-gray-500">{selectedPropertyDetails?.propertyName ? `${selectedPropertyDetails.propertyName} - here is what's happening today.` : 'Welcome back, here is what\'s happening today.'}</p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                + Add Property
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
                    <stat.icon size={24} />
                  </div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <h3 className="text-2xl font-black text-gray-900">{stat.value}</h3>
                </div>
              ))}
            </div>

            {selectedPropertyId ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT SIDE - RESERVATIONS */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold mb-6">Current Reservations</h3>
                  {reservationsList.length > 0 ? (
                    <div className="space-y-4">
                      {reservationsList.map(res => (
                        <div key={res.id} className="p-4 border border-blue-200 rounded-2xl bg-blue-50 hover:shadow-md transition-all">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-bold text-gray-900">{res.guest}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {new Date(res.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(res.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                            <span className={`px-3 py-1 text-xs font-bold rounded-md ${res.status === 'Confirmed' ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100'}`}>
                              {res.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">No reservations for this property</p>
                  )}
                </div>

                {/* RIGHT SIDE - EVENTS & ALERTS */}
                <div className="space-y-6">
                  {eventsList.length > 0 && (
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                      <h3 className="text-xl font-bold mb-6">Events</h3>
                      <div className="space-y-3">
                        {eventsList.map(event => (
                          <div key={event.id} className="p-4 border border-green-200 rounded-2xl bg-green-50">
                            <p className="font-bold text-gray-900 text-sm">{event.eventName}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-6">Recent Alerts</h3>
                    <div className="space-y-4">
                      <AlertItem title="Maintenance Request" time="2h ago" type="maintenance" />
                      <AlertItem title="New Booking: Unit 4B" time="5h ago" type="booking" />
                      <AlertItem title="Cleaning Completed" time="Yesterday" type="cleaning" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500 text-lg">Select a property to view reservations and events</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW: PROPERTIES */}
        {activeView === 'properties' && (
          <div className="animate-in fade-in duration-500">
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-black text-gray-900">My Properties</h1>
                <p className="text-gray-500">View and manage your rental properties.</p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
                <Plus size={20} /> Add Property
              </button>
            </header>

            {loadingProperties ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading properties...</p>
              </div>
            ) : propertiesList.length > 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Property Name</th>
                      <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Address</th>
                      <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">City, State</th>
                      <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {propertiesList.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-6 font-bold text-gray-900">{property.propertyName || 'Unnamed Property'}</td>
                        <td className="p-6 text-sm text-gray-500">{property.address || 'N/A'}</td>
                        <td className="p-6 text-sm text-gray-500">{property.city ? `${property.city}, ${property.state}` : 'N/A'}</td>
                        <td className="p-6">
                          <div className="flex justify-center gap-3">
                            <button 
                              type="button"
                              onClick={() => handleSelectProperty(property)}
                              className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all ${selectedPropertyId === property.id ? 'bg-blue-600 text-white' : 'text-blue-600 bg-blue-50 hover:bg-blue-100'}`}
                            >
                              Select
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleViewOwner(property.owner)}
                              className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                            >
                              Owner
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
                <p className="text-gray-500">No properties found. Add your first property to get started.</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW: EXPENSES */}
        {activeView === 'expenses' && (
          <div className="animate-in fade-in duration-500">
            {loadingExpenses ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading expenses...</p>
              </div>
            ) : (
              <Transactions initialData={expensesData} propertyDetails={selectedPropertyDetails} filters={currentFilters} />
            )}
          </div>
        )}

        {/* VIEW: STAFF MANAGEMENT */}
        {activeView === 'staff' && (
          <div className="animate-in fade-in duration-500">
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-black text-gray-900">Staff Management</h1>
                <p className="text-gray-500">Monitor and manage your property service team.</p>
              </div>
              <button 
                onClick={() => {
                  console.log('Button clicked! Current state:', showAddStaffModal);
                  setShowAddStaffModal(true);
                }} 
                className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
              >
                <Plus size={20} /> Add Staff Member
              </button>
            </header>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Employee</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {staffList.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-6 font-bold text-gray-900 cursor-pointer text-blue-600 hover:underline" onClick={() => { setSelectedEmployee(member); setShowEmployeeDetailsModal(true); }}>{member.name}</td>
                      <td className="p-6 text-sm text-gray-500">{member.role}</td>
                      <td className="p-6">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => { setEditingEmployee(member); setEditStaffForm({ firstName: member.name.split(' ')[0] || '', lastName: member.name.split(' ').slice(1).join(' ') || '', email: member.email || '', phoneNumber: member.phoneNumber || '', company: member.company || '', address: member.address || '', city: member.city || '', state: member.state || '', zip: member.zip || '', notes: member.notes || '', cleaner: member.role === 'Cleaner', maintenance: member.role === 'Maintenance' }); setShowEditStaffModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Pencil size={18} /></button>
                          <button onClick={() => deleteStaff(member.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EMPLOYEE DETAILS MODAL */}
        {showEmployeeDetailsModal && selectedEmployee && createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6 rounded-t-3xl">
                <h2 className="text-2xl font-black text-white">{selectedEmployee.name}</h2>
              </div>
              <div className="p-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Role</label>
                    <p className="text-gray-900 font-semibold">{selectedEmployee.role}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Email</label>
                    <p className="text-gray-900 font-semibold">{selectedEmployee.email || 'N/A'}</p>
                  </div>
                  {selectedEmployee.phoneNumber && (
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.phoneNumber}</p>
                    </div>
                  )}
                  {selectedEmployee.company && (
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Company</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.company}</p>
                    </div>
                  )}
                  {selectedEmployee.address && (
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Address</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.address}</p>
                    </div>
                  )}
                  {(selectedEmployee.city || selectedEmployee.state || selectedEmployee.zip) && (
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City, State, Zip</label>
                      <p className="text-gray-900 font-semibold">{[selectedEmployee.city, selectedEmployee.state, selectedEmployee.zip].filter(Boolean).join(', ')}</p>
                    </div>
                  )}
                  {selectedEmployee.notes && (
                    <div>
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Notes</label>
                      <p className="text-gray-900 font-semibold">{selectedEmployee.notes}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowEmployeeDetailsModal(false)}
                  className="w-full mt-6 bg-red-600 text-white px-4 py-3 rounded-2xl font-bold hover:bg-red-700 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* VIEW: RESERVATIONS (NEW PAGE) */}
        {activeView === 'reservations' && (
          <div className="animate-in fade-in duration-500">
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-black text-gray-900">Reservations</h1>
                <p className="text-gray-500">View and manage all guest bookings.</p>
              </div>
              <button onClick={openNewReservationModal} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
                <Plus size={20} /> New Reservation
              </button>
            </header>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Guest</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Property</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Dates</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reservationsList.map((res) => (
                    <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-6 font-bold text-gray-900">{res.guest}</td>
                      <td className="p-6 text-sm text-gray-500">{res.property}</td>
                      <td className="p-6 text-sm text-gray-500">{res.checkIn} - {res.checkOut}</td>
                      <td className="p-6 text-sm">
                        <span className={`px-2 py-1 rounded-md font-bold ${res.status === 'Confirmed' ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'}`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => openEditReservationModal(res)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Pencil size={18} /></button>
                          <button onClick={() => handleDeleteReservation(res.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: MILEAGE */}
        {activeView === 'mileage' && (
          <div className="animate-in fade-in duration-500">
            {loadingExpenses ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading mileage...</p>
              </div>
            ) : (
              <Transactions initialData={expensesData} propertyDetails={selectedPropertyDetails} filters={currentFilters} isMileageOnly={true} />
            )}
          </div>
        )}

        {/* VIEW: MAINTENANCE & REPAIR */}
        {activeView === 'maintenance' && (
          <div className="animate-in fade-in duration-500">
            <header className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-900">Maintenance & Repair</h1>
                <p className="text-gray-500">{selectedPropertyDetails?.propertyName} - Track maintenance issues and repairs</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowUnpaidOnly(!showUnpaidOnly)}
                  style={{
                    backgroundColor: unpaidInvoicesList.length > 0 ? '#dc2626' : '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                  }}
                >
                  Unpaid ({unpaidInvoicesList.length})
                </button>
                <button onClick={() => setShowReportIssueModal(true)} style={{backgroundColor: '#2563eb', color: '#ffffff', padding: '12px 24px', borderRadius: '1rem', fontWeight: '700', cursor: 'pointer', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} className="flex items-center gap-2 transition-all hover:opacity-90">
                  <Plus size={20} /> Report Issue
                </button>
              </div>
            </header>

            {/* INVOICES TABLE */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50">
                <h2 className="text-xl font-black text-gray-900">{showUnpaidOnly ? 'Unpaid Invoices' : 'Invoices'} for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
              </div>
              {(showUnpaidOnly ? unpaidInvoicesList : invoicesList).length > 0 ? (
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Invoice #</th>
                      <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Company</th>
                      <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Staff Name</th>
                      <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                      <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Description</th>
                      <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                      <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Created</th>
                      <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(showUnpaidOnly ? unpaidInvoicesList : invoicesList).map((invoice, index) => {
                      const staffInfo = getStaffInfoById(invoice.staffId);
                      const staff = staffList.find(s => s.id === invoice.staffId);
                      return (
                        <tr key={invoice.id || `invoice-${index}`} className="hover:bg-gray-50/50 transition-colors">
                          <td className="p-6 font-bold text-gray-900">{invoice.invoiceNumber || '-'}</td>
                          <td className="p-6 text-sm text-gray-600">{staffInfo.company}</td>
                          <td className="p-6 text-sm">
                            <span 
                              onClick={() => {
                                setSelectedStaffForDetails(staff);
                                setShowStaffDetailsModal(true);
                              }}
                              className="text-gray-900 font-semibold cursor-pointer"
                            >
                              {staffInfo.name}
                            </span>
                          </td>
                          <td className="p-6 text-sm text-gray-600">{invoice.type}</td>
                          <td className="p-6 text-sm text-gray-600">{invoice.repairDescription}</td>
                          <td className="p-6 font-semibold text-gray-900">${parseFloat(invoice.amount).toFixed(2)}</td>
                          <td className="p-6 text-sm text-gray-600">{new Date(invoice.dateCreated).toLocaleDateString()}</td>
                          <td className="p-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${invoice.paid ? 'bg-blue-100 text-blue-700' : invoice.completed ? 'bg-green-100 text-green-700' : invoice.pending ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                              {invoice.paid ? 'Paid' : invoice.completed ? 'Completed' : invoice.pending ? 'Pending' : 'Open'}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className="flex justify-center gap-3">
                              {showUnpaidOnly && !invoice.paid && (
                                <button onClick={() => handlePayInvoice(invoice)} className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-xl transition-all" title="Mark as paid"><DollarSign size={18} /></button>
                              )}
                              <button onClick={() => handleEditInvoice(invoice)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all" title="Edit invoice"><Pencil size={18} /></button>
                              <button onClick={() => handleDeleteInvoice(invoice.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all" title="Delete invoice"><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center">
                  <Wrench size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">No maintenance issues reported yet</p>
                  <p className="text-sm text-gray-400">Click "Report Issue" to add a maintenance request</p>
                </div>
              )}
            </div>

            {/* STAFF DETAILS MODAL */}
            {showStaffDetailsModal && selectedStaffForDetails && createPortal(
              <div onClick={(e) => {if (e.target === e.currentTarget) setShowStaffDetailsModal(false);}} className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto">
                <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 my-8 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6">
                    <h2 className="text-2xl font-black text-white">Staff Member Details</h2>
                  </div>
                  
                  {/* Content */}
                  <div className="p-8 space-y-4">
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Name</p>
                      <p className="text-lg font-black text-gray-900">{selectedStaffForDetails.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Role</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedStaffForDetails.role}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Company</p>
                      <p className="text-lg font-semibold text-gray-900">{selectedStaffForDetails.company || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Email</p>
                      <p className="text-gray-700">{selectedStaffForDetails.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Phone</p>
                      <p className="text-gray-700">{selectedStaffForDetails.phoneNumber || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Address</p>
                      <p className="text-gray-700">{selectedStaffForDetails.address || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">City, State ZIP</p>
                      <p className="text-gray-700">{selectedStaffForDetails.city || ''} {selectedStaffForDetails.state || ''} {selectedStaffForDetails.zip || ''}</p>
                    </div>
                    {selectedStaffForDetails.notes && (
                      <div>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Notes</p>
                        <p className="text-gray-700">{selectedStaffForDetails.notes}</p>
                      </div>
                    )}
                    <button 
                      onClick={() => setShowStaffDetailsModal(false)}
                      className="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>,
              portalRootRef.current || document.body
            )}

            {/* REPORT ISSUE MODAL */}
            {showReportIssueModal && createPortal(
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-8">
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6 rounded-t-3xl">
                    <h2 className="text-2xl font-black text-white">Report Maintenance Issue</h2>
                  </div>
                  <form onSubmit={async (e) => { 
                    e.preventDefault(); 
                    try {
                      const token = localStorage.getItem('token');
                      const staffId = parseInt(reportIssueForm.staffName);
                      
                      const invoiceData = {
                        request: '',
                        invoiceNumber: reportIssueForm.invoiceNumber || '',
                        invoiceDescription: reportIssueForm.invoiceDescription || '',
                        propertyId: selectedPropertyId,
                        staffId: staffId,
                        dateCreated: reportIssueForm.issueCreatedDate + 'T00:00:00.000Z',
                        dateCompleted: reportIssueForm.addressDate + 'T00:00:00.000Z',
                        amount: reportIssueForm.amount || '0',
                        repairDescription: reportIssueForm.description,
                        createdBy: 0,
                        paid: false,
                        datePaid: null,
                        type: reportIssueForm.type,
                        dateToBeAddressed: reportIssueForm.addressDate + 'T00:00:00.000Z',
                        pending: true,
                        completed: false
                      };
                      const response = await createNewInvoice({ token, invoiceData });
                      if (response.isSuccess) {
                        alert('Maintenance issue reported successfully!');
                        setShowReportIssueModal(false);
                        setReportIssueForm({
                          company: '',
                          staffName: '',
                          issueCreatedDate: new Date().toISOString().split('T')[0],
                          description: '',
                          addressDate: '',
                          invoiceNumber: '',
                          invoiceDescription: '',
                          amount: '',
                          type: ''
                        });
                      } else {
                        alert('Failed to report issue: ' + response.message);
                      }
                    } catch (error) {
                      console.error('Error reporting issue:', error);
                      alert('Failed to report issue: ' + error.message);
                    }
                  }} className="p-8">
                    {/* Row 1: Company & Staff Name */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Company</label>
                        <select
                          value={reportIssueForm.company}
                          onChange={(e) => setReportIssueForm({ ...reportIssueForm, company: e.target.value, staffName: '' })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          {staffList.reduce((companies, staff) => {
                            const companyName = staff.company || 'Other';
                            if (!companies.some(c => c.value === companyName)) {
                              companies.push({ value: companyName, label: companyName });
                            }
                            return companies;
                          }, []).map(company => (
                            <option key={company.value} value={company.value}>{company.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Staff Name</label>
                        <select
                          value={reportIssueForm.staffName}
                          onChange={(e) => setReportIssueForm({ ...reportIssueForm, staffName: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">-- Select Staff Member --</option>
                          {staffList
                            .filter(staff => (reportIssueForm.company ? staff.company === reportIssueForm.company : true))
                            .map(staff => (
                              <option key={staff.id} value={staff.id}>{staff.name}</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Date Issue Created & Date to Address */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Date Issue Created</label>
                        <DatePicker
                          selected={reportIssueForm.issueCreatedDate ? new Date(reportIssueForm.issueCreatedDate) : null}
                          onChange={(date) => setReportIssueForm({ ...reportIssueForm, issueCreatedDate: date ? date.toISOString().split('T')[0] : '' })}
                          dateFormat="MMM dd, yyyy"
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Date to Address Issue</label>
                        <DatePicker
                          selected={reportIssueForm.addressDate ? new Date(reportIssueForm.addressDate) : null}
                          onChange={(date) => setReportIssueForm({ ...reportIssueForm, addressDate: date ? date.toISOString().split('T')[0] : '' })}
                          dateFormat="MMM dd, yyyy"
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Row 3: Description */}
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-slate-900 mb-2">Issue Description</label>
                      <textarea
                        value={reportIssueForm.description}
                        onChange={(e) => setReportIssueForm({ ...reportIssueForm, description: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe the issue in detail"
                        rows="4"
                        required
                      />
                    </div>

                    {/* Row 4: Invoice Number & Invoice Description */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Invoice Number</label>
                        <input
                          type="text"
                          value={reportIssueForm.invoiceNumber}
                          onChange={(e) => setReportIssueForm({ ...reportIssueForm, invoiceNumber: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Invoice number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Invoice Description</label>
                        <input
                          type="text"
                          value={reportIssueForm.invoiceDescription}
                          onChange={(e) => setReportIssueForm({ ...reportIssueForm, invoiceDescription: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Invoice description"
                        />
                      </div>
                    </div>

                    {/* Row 5: Amount & Type */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={reportIssueForm.amount}
                          onChange={(e) => setReportIssueForm({ ...reportIssueForm, amount: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Amount"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Type</label>
                        <select
                          value={reportIssueForm.type}
                          onChange={(e) => setReportIssueForm({ ...reportIssueForm, type: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="Repair">Repair</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Cleaning">Cleaning</option>
                        </select>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-slate-200">
                      <button type="button" onClick={() => setShowReportIssueModal(false)} className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">Cancel</button>
                      <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Report Issue</button>
                    </div>
                  </form>
                </div>
              </div>,
              document.body
            )}

            {/* EDIT INVOICE MODAL */}
            {showEditInvoiceModal && selectedInvoice && createPortal(
              <div onClick={(e) => {if (e.target === e.currentTarget) setShowEditInvoiceModal(false);}} className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto">
                <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 my-8 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6">
                    <h2 className="text-2xl font-black text-white">Edit Invoice</h2>
                  </div>

                  {/* Content */}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveInvoice();
                  }} className="p-8 space-y-6">
                    {/* Row 1: Company & Staff Name */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Company</label>
                        <select
                          value={editInvoiceForm.company}
                          onChange={(e) => setEditInvoiceForm({ ...editInvoiceForm, company: e.target.value, staffName: '' })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">-- Select Company --</option>
                          {staffList.reduce((companies, staff) => {
                            const companyName = staff.company || 'Other';
                            if (!companies.some(c => c.value === companyName)) {
                              companies.push({ value: companyName, label: companyName });
                            }
                            return companies;
                          }, []).map(company => (
                            <option key={company.value} value={company.value}>{company.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Staff Name</label>
                        <select
                          value={editInvoiceForm.staffName}
                          onChange={(e) => setEditInvoiceForm({ ...editInvoiceForm, staffName: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">-- Select Staff Member --</option>
                          {staffList
                            .filter(staff => (editInvoiceForm.company ? staff.company === editInvoiceForm.company : true))
                            .map(staff => (
                              <option key={staff.id} value={staff.id}>{staff.name}</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Date Issue Created & Date to Address */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Date Issue Created</label>
                        <DatePicker
                          selected={editInvoiceForm.issueCreatedDate ? new Date(editInvoiceForm.issueCreatedDate) : null}
                          onChange={(date) => setEditInvoiceForm({ ...editInvoiceForm, issueCreatedDate: date ? date.toISOString().split('T')[0] : '' })}
                          dateFormat="MMM dd, yyyy"
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Date to Address Issue</label>
                        <DatePicker
                          selected={editInvoiceForm.addressDate ? new Date(editInvoiceForm.addressDate) : null}
                          onChange={(date) => setEditInvoiceForm({ ...editInvoiceForm, addressDate: date ? date.toISOString().split('T')[0] : '' })}
                          dateFormat="MMM dd, yyyy"
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Row 3: Description */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Issue Description</label>
                      <textarea
                        value={editInvoiceForm.description}
                        onChange={(e) => setEditInvoiceForm({ ...editInvoiceForm, description: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe the issue in detail"
                        rows="4"
                        required
                      />
                    </div>

                    {/* Row 4: Invoice Number & Invoice Description */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Invoice Number</label>
                        <input
                          type="text"
                          value={editInvoiceForm.invoiceNumber}
                          onChange={(e) => setEditInvoiceForm({ ...editInvoiceForm, invoiceNumber: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Invoice number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Invoice Description</label>
                        <input
                          type="text"
                          value={editInvoiceForm.invoiceDescription}
                          onChange={(e) => setEditInvoiceForm({ ...editInvoiceForm, invoiceDescription: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Invoice description"
                        />
                      </div>
                    </div>

                    {/* Row 5: Amount & Type */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editInvoiceForm.amount}
                          onChange={(e) => setEditInvoiceForm({ ...editInvoiceForm, amount: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Amount"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Type</label>
                        <select
                          value={editInvoiceForm.type}
                          onChange={(e) => setEditInvoiceForm({ ...editInvoiceForm, type: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="Repair">Repair</option>
                          <option value="Maintenance">Maintenance</option>
                          <option value="Cleaning">Cleaning</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 6: Status */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Status</label>
                      <select
                        value={editInvoiceForm.status}
                        onChange={(e) => setEditInvoiceForm({ ...editInvoiceForm, status: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="open">Open</option>
                        <option value="completed">Completed</option>
                        <option value="paid">Paid</option>
                      </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-slate-200">
                      <button type="button" onClick={() => setShowEditInvoiceModal(false)} className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">Cancel</button>
                      <button type="submit" className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>,
              document.body
            )}

            {/* PAYMENT MODAL */}
            {showPaymentModal && invoiceToPayFor && createPortal(
              <div onClick={(e) => {if (e.target === e.currentTarget) setShowPaymentModal(false);}} className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto">
                <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 my-8 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6">
                    <h2 className="text-2xl font-black text-white">Record Payment</h2>
                  </div>

                  {/* Content */}
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitPayment();
                  }} className="p-8 space-y-6">
                    {/* Amount Display */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Amount</label>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                        <p className="text-2xl font-black text-gray-900">${parseFloat(invoiceToPayFor.amount).toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Date Paid */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Date Paid</label>
                      <DatePicker
                        selected={paymentForm.datePaid ? new Date(paymentForm.datePaid) : null}
                        onChange={(date) => setPaymentForm({ ...paymentForm, datePaid: date ? date.toISOString().split('T')[0] : '' })}
                        dateFormat="MMM dd, yyyy"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* How Paid */}
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">Payment Method</label>
                      <select
                        value={paymentForm.howPaid}
                        onChange={(e) => setPaymentForm({ ...paymentForm, howPaid: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="Credit Card">Credit Card</option>
                        <option value="Debit Card">Debit Card</option>
                        <option value="Check">Check</option>
                        <option value="Cash">Cash</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-slate-200">
                      <button type="button" onClick={() => setShowPaymentModal(false)} className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">Cancel</button>
                      <button type="submit" className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">Confirm Payment</button>
                    </div>
                  </form>
                </div>
              </div>,
              document.body
            )}
          </div>
        )}

        {/* VIEW: CALENDAR */}
        {activeView === 'calendar' && selectedPropertyId && (
          <div className="animate-in fade-in duration-500">
            <header className="mb-10">
              <div>
                <h1 className="text-3xl font-black text-gray-900">Property Calendar</h1>
                <p className="text-gray-500">{selectedPropertyDetails?.propertyName} - Reservations & Events</p>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* CALENDAR SECTION */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-8">
                    <button 
                      onClick={() => {
                        if (calendarMonth === 0) {
                          setCalendarMonth(11);
                          setCalendarYear(calendarYear - 1);
                        } else {
                          setCalendarMonth(calendarMonth - 1);
                        }
                      }}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                    >
                      <ChevronLeft size={24} className="text-blue-600" />
                    </button>
                    <h2 className="text-2xl font-black text-gray-900">
                      {new Date(calendarYear, calendarMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button 
                      onClick={() => {
                        if (calendarMonth === 11) {
                          setCalendarMonth(0);
                          setCalendarYear(calendarYear + 1);
                        } else {
                          setCalendarMonth(calendarMonth + 1);
                        }
                      }}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                    >
                      <ChevronRight size={24} className="text-blue-600" />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center font-bold text-gray-500 text-sm py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-2 auto-rows-fr min-h-96">
                    {(() => {
                      const year = calendarYear;
                      const month = calendarMonth;
                      // Zeller's congruence algorithm - gets day of week without timezone issues
                      const q = 1;
                      const m = month === 0 ? 13 : month === 1 ? 14 : month + 1;
                      const k = year % 100;
                      const j = Math.floor(year / 100);
                      const h = (q + Math.floor((13 * (m + 1)) / 5) + k + Math.floor(k / 4) + Math.floor(j / 4) - 2 * j) % 7;
                      const firstDay = (h + 5) % 7; // Convert to 0=Sunday, 1=Monday, etc
                      // Get days in month using pure calculation
                      const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                      const daysInMonths = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                      const daysInMonth = daysInMonths[month];
                      const days = [];
                      
                      for (let i = 0; i < firstDay; i++) days.push(null);
                      for (let i = 1; i <= daysInMonth; i++) days.push(i);
                      
                      return days.map((day, idx) => {
                        if (!day) return <div key={`empty-${idx}`} className="aspect-square"></div>;
                        
                        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const reservation = reservationsList.find(r => 
                          r.checkIn <= dateStr && r.checkOut > dateStr
                        );
                        const event = eventsList.find(e => 
                          e.eventDate === dateStr
                        );
                        
                        return (
                          <div
                            key={dateStr}
                            className={`aspect-square rounded-lg flex items-center justify-center font-semibold transition-all ${
                              reservation 
                                ? 'bg-blue-200 text-blue-900 border-2 border-blue-400' 
                                : event
                                ? 'bg-green-200 text-green-900 border-2 border-green-400'
                                : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {day}
                          </div>
                        );
                      });
                    })()}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-200 border-2 border-blue-400 rounded"></div>
                      <span className="text-sm text-gray-600">Reservation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-200 border-2 border-green-400 rounded"></div>
                      <span className="text-sm text-gray-600">Event</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
                      <span className="text-sm text-gray-600">Available</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RESERVATIONS LIST SECTION */}
              <div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 mb-6">Reservations & Events</h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {reservationsList.length > 0 || eventsList.length > 0 ? (
                      <>
                        {/* Reservations */}
                        {reservationsList.map(res => (
                          <div key={`res-${res.id}`} className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                            <p className="font-bold text-gray-900 text-sm">{res.guest}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {new Date(res.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(res.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                            <span className={`inline-block mt-2 px-2 py-1 text-xs font-bold rounded-md ${res.status === 'Confirmed' ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100'}`}>
                              {res.status}
                            </span>
                          </div>
                        ))}
                        
                        {/* Events */}
                        {eventsList.map(event => (
                          <div key={`event-${event.id}`} className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                            <p className="font-bold text-gray-900 text-sm">{event.eventName}</p>
                            <p className="text-xs text-gray-600 mt-1">
                              {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{event.description}</p>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="text-gray-400 text-sm">No reservations or events for this property</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* RESERVATION MODAL */}
      <ReservationModal 
        key={datePickerKey}
        show={showReservationModal}
        isEditing={editingReservation !== null}
        formData={reservationForm}
        onFormChange={(field, value) => setReservationForm({...reservationForm, [field]: value})}
        onSave={handleSaveReservation}
        onCancel={closeReservationModal}
        cleaners={cleanersList}
      />

      {/* OWNER DETAILS MODAL */}
      {showOwnerModal && selectedOwner && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white">Owner Details</h2>
                <button 
                  onClick={closeOwnerModal}
                  className="text-slate-400 hover:text-white text-2xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8 space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Full Name</p>
                <p className="text-xl font-bold text-slate-900">{selectedOwner.firstName} {selectedOwner.lastName}</p>
              </div>
              
              <div className="border-b border-slate-200 pb-4">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Email</p>
                <p className="text-lg text-slate-700">{selectedOwner.email || 'Not provided'}</p>
              </div>
              
              <div className="border-b border-slate-200 pb-4">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Phone</p>
                <p className="text-lg text-slate-700">{selectedOwner.phoneNumber || 'Not provided'}</p>
              </div>
              
              <div className="border-b border-slate-200 pb-4">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Address</p>
                <p className="text-lg text-slate-700">{selectedOwner.address || 'Not provided'}</p>
              </div>

              <div className="border-b border-slate-200 pb-4">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">City, State, Zip</p>
                <p className="text-lg text-slate-700">
                  {selectedOwner.city ? `${selectedOwner.city}, ${selectedOwner.state} ${selectedOwner.zip}` : 'Not provided'}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-lg text-slate-700">{selectedOwner.notes || 'No notes'}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
              <button 
                onClick={closeOwnerModal}
                className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- HELPER COMPONENTS ---

const NavItem = ({ icon, label, active = false, onClick, disabled = false }) => (
  <div 
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold whitespace-nowrap
      ${disabled 
        ? 'text-slate-600 cursor-not-allowed opacity-50' 
        : 'cursor-pointer'} 
      ${active && !disabled
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
        : !disabled ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : ''}`}
    onClick={() => !disabled && onClick()}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

const AlertItem = ({ title, time, type }) => (
  <div className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-xl transition-colors">
    <div className={`w-2 h-2 rounded-full mt-2 ${type === 'maintenance' ? 'bg-orange-500' : 'bg-green-500'}`} />
    <div>
      <p className="text-sm font-bold text-gray-800">{title}</p>
      <p className="text-xs text-gray-400">{time}</p>
    </div>
  </div>
);

// Reservation Modal Component (inside OwnerDashboard but before export)
function ReservationModal({ show, isEditing, formData, onFormChange, onSave, onCancel, cleaners = [] }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto py-8">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-8 py-6">
          <h2 className="text-2xl font-black text-white">
            {isEditing ? 'Edit Reservation' : 'New Reservation'}
          </h2>
        </div>
        
        {/* Content */}
        <div className="p-8 space-y-4 max-h-96 overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Confirmation Number</label>
            <input 
              type="text"
              value={formData.confirmationNumber}
              onChange={(e) => onFormChange('confirmationNumber', e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
              placeholder="Confirmation #"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Customer ID</label>
            <input 
              type="text"
              value={formData.customerId}
              onChange={(e) => onFormChange('customerId', e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
              placeholder="Customer ID"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Check-in to Check-out Dates</label>
            <div className="flex gap-2 items-center">
              <div className="react-datepicker-wrapper flex-1" style={{color: '#111827', fontSize: '0.95rem'}}>
                <DatePicker
                  selectsRange
                  startDate={formData.checkInDate ? (() => {
                    const parts = formData.checkInDate.split('-');
                    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                  })() : null}
                  endDate={formData.checkoutDate ? (() => {
                    const parts = formData.checkoutDate.split('-');
                    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                  })() : null}
                  onChange={(dates) => {
                    const [start, end] = dates;
                    if (start) {
                      const year = start.getFullYear();
                      const month = String(start.getMonth() + 1).padStart(2, '0');
                      const day = String(start.getDate()).padStart(2, '0');
                      onFormChange('checkInDate', `${year}-${month}-${day}`);
                    }
                    if (end) {
                      const year = end.getFullYear();
                      const month = String(end.getMonth() + 1).padStart(2, '0');
                      const day = String(end.getDate()).padStart(2, '0');
                      onFormChange('checkoutDate', `${year}-${month}-${day}`);
                    }
                  }}
                  dateFormat="MM/dd/yyyy"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                  placeholderText="Select check-in to check-out"
                />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Clear the form state for both dates
                  onFormChange('checkInDate', '');
                  onFormChange('checkoutDate', '');
                  // Force clear the input field
                  setTimeout(() => {
                    const clearInput = document.querySelector('[placeholder="Select check-in to check-out"]');
                    if (clearInput) {
                      clearInput.value = '';
                    }
                  }, 0);
                }}
                style={{backgroundColor: '#e0e7ff', color: '#3730a3'}}
                className="px-3 py-3 rounded-xl font-bold hover:opacity-80 transition-all whitespace-nowrap"
                title="Clear dates"
              >
                Clear
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Lock Code</label>
            <input 
              type="text"
              value={formData.lockCode}
              onChange={(e) => onFormChange('lockCode', e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
              placeholder="Lock code"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Cleaner</label>
            <select 
              value={formData.staffId}
              onChange={(e) => onFormChange('staffId', e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
            >
              <option value="">Select a cleaner (optional)</option>
              {cleaners.map(cleaner => (
                <option key={cleaner.id} value={cleaner.id}>
                  {cleaner.name || `${cleaner.firstName} ${cleaner.lastName}`.trim()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 mt-4">
          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              style={{backgroundColor: '#dbeafe', color: '#1d4ed8'}}
              className="flex-1 py-3 rounded-2xl font-bold hover:opacity-80 transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={onSave}
              style={{backgroundColor: '#2563eb', color: 'white'}}
              className="flex-1 py-3 rounded-2xl font-bold hover:opacity-90 transition-all"
            >
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;