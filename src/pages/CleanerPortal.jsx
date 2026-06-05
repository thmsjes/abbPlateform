import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckCircle,
  Clock,
  LogOut, 
  Plus, 
  Pencil, 
  Trash2,
  Home,
  FileText,
  ChevronLeft,
  ChevronRight,
  Brush,
  Wrench,
  Flame
} from 'lucide-react';
import { getAllReservationsByPropertyId, getUsersByPropertyId, getPropertyById, updateReservation } from '../apiCalls';

// Custom DatePicker styling for inline calendar
const datePickerStyles = `
  .react-datepicker__calendar--inline {
    border: 2px solid rgb(217, 119, 6);
    border-radius: 0.75rem;
    padding: 1rem;
    width: 100%;
    background-color: white;
    font-size: 0.875rem;
  }
  
  .react-datepicker__month-container {
    width: 100%;
  }
  
  .react-datepicker__day {
    padding: 0.5rem;
  }
  
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: rgb(217, 119, 6);
    color: white;
  }
  
  .react-datepicker__day--selected:hover {
    background-color: rgb(180, 83, 9);
  }
`;

// Inject styles
if (typeof window !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.innerHTML = datePickerStyles;
  document.head.appendChild(styleEl);
}

// Helper function to parse date strings in YYYY-MM-DD format as local time
const parseLocalDate = (dateString) => {
  if (!dateString) return '';
  
  // If it's already a Date object, return as is
  if (dateString instanceof Date) return dateString;
  
  // Handle YYYY-MM-DD format specifically
  const parts = String(dateString).split('T')[0].split('-');
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  
  // Fallback for other formats
  return new Date(dateString);
};

const CleanerPortal = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('reservations');
  const [currentDate, setCurrentDate] = useState(new Date()); // Default to today
  const [selectedDateForScheduling, setSelectedDateForScheduling] = useState(null);
  const [schedulingTime, setSchedulingTime] = useState('09:00');
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [cleaningTasks, setCleaningTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch active reservations on component mount
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        const propertyIdsJson = localStorage.getItem('propertyIds');
        const propertyIds = propertyIdsJson ? JSON.parse(propertyIdsJson) : [];
        
        console.log('CleanerPortal useEffect - token:', !!token, 'propertyIds:', propertyIds);
        
        if (token && propertyIds.length > 0) {
          // Fetch all reservations for all properties
          let allReservations = [];
          let allPropertyDetails = {};
          
          for (const propertyId of propertyIds) {
            try {
              console.log('Fetching reservations for propertyId:', propertyId);
              const reservations = await getAllReservationsByPropertyId({ token, propertyId });
              console.log(`Reservations for property ${propertyId}:`, reservations);
              
              // Fetch property details
              const propertyDetails = await getPropertyById({ token, propertyId });
              console.log(`Property ${propertyId} details:`, propertyDetails);
              
              allPropertyDetails[propertyId] = propertyDetails;
              allReservations = [...allReservations, ...reservations.map(r => ({ ...r, propertyId }))];
            } catch (error) {
              console.error(`Error fetching for property ${propertyId}:`, error);
            }
          }
          
          console.log('All reservations:', allReservations);
          
          // Fetch users to map customer ID to guest name (use first property's users as they should be the same)
          const users = await getUsersByPropertyId({ token, propertyId: propertyIds[0] });
          console.log('Users fetched:', users);
          
          // Create a map of userId to user name
          const userMap = {};
          if (users && Array.isArray(users)) {
            users.forEach(user => {
              userMap[user.id] = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown Guest';
            });
          }
          console.log('User map:', userMap);
          
          // Filter to active reservations (today or later) and map to cleaning tasks
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          console.log('Today:', today);
          
          const activeTasks = allReservations
            .filter(res => {
              const checkOut = parseLocalDate(res.checkoutDate);
              return checkOut >= today;
            })
            .map(res => {
              const propertyDetails = allPropertyDetails[res.propertyId];
              const propertyName = propertyDetails?.propertyName || propertyDetails?.name || `Property ${res.propertyId}`;
              
              return {
                // Original reservation fields needed for API update
                id: res.id,
                confirmationNumber: res.confirmationNumber,
                customerId: res.customerId,
                propertyId: res.propertyId,
                checkInDate: res.checkInDate,
                checkoutDate: res.checkoutDate,
                cleaningDateTime: res.cleaningDateTime,
                notes: res.notes,
                
                // Display fields
                propertyName: propertyName,
                address: propertyDetails?.address || 'No address provided',
                guestName: userMap[res.customerId] || 'Unknown Guest',
                checkIn: res.checkInDate,
                checkOut: res.checkoutDate,
                numberOfGuests: res.guestCount,
                hasDogs: res.dogs
              };
            });
          
          console.log('Active tasks:', activeTasks);
          setCleaningTasks(activeTasks);
          
          // Initialize cleaningStatus from existing reservation data
          const initialStatus = {};
          activeTasks.forEach(task => {
            if (task.cleaningDateTime) {
              // If a cleaning datetime was already set, mark it as a completed action
              initialStatus[task.id] = {
                status: 'pending', // Still pending unless explicitly marked otherwise
                startTime: null,
                endTime: null
              };
            }
          });
          setCleaningStatus(initialStatus);
        } else {
          console.log('Missing token or propertyIds - token:', !!token, 'propertyIds:', propertyIds);
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReservations();
  }, []);
  

  // Local state to track cleaning workflow status (not part of reservation data)
  const [cleaningStatus, setCleaningStatus] = useState({}); // { taskId: { status, startTime, endTime } }
  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [showCleaningDateModal, setShowCleaningDateModal] = useState(false);
  const [cleaningDate, setCleaningDate] = useState(null);
  const [cleaningTime, setCleaningTime] = useState('09:00');
  const [showReservationDetailsModal, setShowReservationDetailsModal] = useState(false);
  const [selectedReservationForDetails, setSelectedReservationForDetails] = useState(null);

  // Helper function to get task status from cleaningStatus state
  const getTaskStatus = (taskId) => {
    return cleaningStatus[taskId]?.status || 'pending';
  };

  // Helper function to get task start time
  const getTaskStartTime = (taskId) => {
    return cleaningStatus[taskId]?.startTime || null;
  };

  // Helper function to get task end time
  const getTaskEndTime = (taskId) => {
    return cleaningStatus[taskId]?.endTime || null;
  };

  const handleStartCleaning = (taskId) => {
    setCleaningStatus({
      ...cleaningStatus,
      [taskId]: {
        status: 'in-progress',
        startTime: new Date().toLocaleTimeString(),
        endTime: null
      }
    });
  };

  const handleCompleteCleaning = (taskId) => {
    setCleaningStatus({
      ...cleaningStatus,
      [taskId]: {
        status: 'completed',
        startTime: cleaningStatus[taskId]?.startTime || null,
        endTime: new Date().toLocaleTimeString()
      }
    });
  };

  const handleResetCleaning = (taskId) => {
    setCleaningStatus({
      ...cleaningStatus,
      [taskId]: {
        status: 'pending',
        startTime: null,
        endTime: null
      }
    });
  };

  const handleOpenNotes = (task) => {
    setSelectedTask(task);
    setEditNotes(task.notes);
    setShowModal(true);
  };

  const handleSaveNotes = async () => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Create the updated reservation object with new notes
      const updatedReservation = {
        ...selectedTask,
        notes: editNotes
      };
      
      // Call API to update the reservation with notes
      await updateReservation({
        token,
        reservationData: updatedReservation
      });
      
      // Update local state
      setCleaningTasks(cleaningTasks.map(task => 
        task.id === selectedTask.id 
          ? { ...task, notes: editNotes }
          : task
      ));
      setShowModal(false);
    } catch (error) {
      console.error("Error saving notes:", error);
      alert("Failed to save notes. Please try again.");
    }
  };

  const handleOpenCleaningDateModal = (task) => {
    setSelectedTask(task);
    // Set default date to check-in date if available
    if (task.checkIn) {
      setCleaningDate(new Date(task.checkIn));
    } else {
      setCleaningDate(new Date());
    }
    setCleaningTime('09:00');
    setShowCleaningDateModal(true);
  };

  const handleSetCleaningDateTime = async () => {
    if (!cleaningDate || !selectedTask) return;
    
    try {
      // Format the date as YYYY-MM-DD
      const dateStr = cleaningDate.toISOString().split('T')[0];
      const dateTime = `${dateStr}T${cleaningTime}:00`;
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Create the updated reservation object with cleaning date/time
      const updatedReservation = {
        ...selectedTask,
        cleaningDateTime: dateTime
      };
      
      // Call API to update the reservation with cleaning date/time
      await updateReservation({
        token,
        reservationData: updatedReservation
      });
      
      // Update local state
      setCleaningTasks(cleaningTasks.map(task =>
        task.id === selectedTask.id
          ? { ...task, cleaningDateTime: dateTime }
          : task
      ));
      setShowCleaningDateModal(false);
    } catch (error) {
      console.error("Error setting cleaning date/time:", error);
      alert("Failed to save cleaning date and time. Please try again.");
    }
  };

  const handleDateClick = (day) => {
    setSelectedDateForScheduling(day);
    setSchedulingTime('09:00');
    setShowSchedulingModal(true);
  };

  const handleViewReservationDetails = (task) => {
    setSelectedReservationForDetails(task);
    setShowReservationDetailsModal(true);
  };

  const handleScheduleTime = () => {
    if (!selectedDateForScheduling) return;
    
    // Find tasks on this date that are still pending
    const tasksOnDate = cleaningTasks.filter(task => 
      isDateInRange(selectedDateForScheduling, task) && getTaskStatus(task.id) === 'pending'
    );

    if (tasksOnDate.length === 0) {
      alert('No pending tasks on this date');
      return;
    }

    // Update all pending tasks on this date with the scheduled time
    setCleaningTasks(cleaningTasks.map(task => {
      if (tasksOnDate.find(t => t.id === task.id)) {
        return { ...task, scheduledTime: schedulingTime };
      }
      return task;
    }));

    setShowSchedulingModal(false);
    setSelectedDateForScheduling(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const isCleaningDateTimeSet = (cleaningDateTime) => {
    if (!cleaningDateTime) return false;
    // Check if it's the default/null datetime
    return cleaningDateTime !== '0001-01-01T00:00:00' && cleaningDateTime !== '';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      case 'in-progress': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'completed': return 'bg-green-50 text-green-600 border-green-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  // Calendar helper functions
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateInRange = (day, task) => {
    // Parse dates and normalize to midnight local time for proper comparison
    const taskStartDate = new Date(task.checkIn + 'T00:00:00');
    const taskEndDate = new Date(task.checkOut + 'T00:00:00');
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    return checkDate >= taskStartDate && checkDate <= taskEndDate;
  };

  const getTasksForDate = (day) => {
    return cleaningTasks.filter(task => isDateInRange(day, task));
  };

  const getTasksWithCleaningScheduledForDate = (day) => {
    return cleaningTasks.filter(task => {
      if (!task.cleaningDateTime) return false;
      const cleaningDate = new Date(task.cleaningDateTime);
      const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      return cleaningDate.getDate() === checkDate.getDate() &&
             cleaningDate.getMonth() === checkDate.getMonth() &&
             cleaningDate.getFullYear() === checkDate.getFullYear();
    });
  };

  const getDateStatusColor = (day) => {
    const tasks = getTasksForDate(day);
    if (tasks.length === 0) return '';
    
    // Priority: completed > in-progress > pending
    if (tasks.some(t => t.status === 'completed')) return 'bg-green-500';
    if (tasks.some(t => t.status === 'in-progress')) return 'bg-blue-500';
    if (tasks.some(t => t.status === 'pending')) return 'bg-yellow-500';
    return '';
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="bg-gray-50 p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const tasksOnDay = getTasksForDate(day);
      const tasksWithScheduledCleaning = getTasksWithCleaningScheduledForDate(day);
      const colorClass = getDateStatusColor(day);
      const hasPendingTasks = tasksOnDay.some(t => getTaskStatus(t.id) === 'pending');
      const hasScheduledCleaning = tasksWithScheduledCleaning.length > 0;

      days.push(
        <div 
          key={day} 
          onClick={(e) => {
            // Only trigger if clicking on empty space (not on a task)
            if (e.target.closest('.task-item')) return;
            hasPendingTasks && handleDateClick(day);
          }}
          className={`bg-white border border-gray-100 rounded-lg p-2 min-h-16 transition-all
            ${hasPendingTasks ? 'hover:shadow-lg hover:border-green-300 cursor-pointer' : 'hover:shadow-md'}
          `}
        >
          <div className="flex items-start justify-between mb-1">
            <span className="text-sm font-bold text-gray-700">{day}</span>
            {hasScheduledCleaning && (
              <Brush size={14} className="text-green-600" />
            )}
            {colorClass && !hasScheduledCleaning && (
              <div className={`w-2 h-2 rounded-full ${colorClass}`}></div>
            )}
          </div>
          {tasksOnDay.length > 0 && (
            <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
              {tasksOnDay.slice(0, 2).map(task => (
                <div 
                  key={task.id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleViewReservationDetails(task);
                  }}
                  className={`task-item text-xs font-bold px-2 py-1 rounded whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer hover:opacity-80 transition-opacity
                  ${getTaskStatus(task.id) === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${getTaskStatus(task.id) === 'in-progress' ? 'bg-blue-100 text-blue-700' : ''}
                  ${getTaskStatus(task.id) === 'completed' ? 'bg-green-100 text-green-700' : ''}
                `}>
                  {task.propertyName}
                </div>
              ))}
              {tasksOnDay.length > 2 && (
                <div className="text-xs font-bold text-gray-600 px-2">+{tasksOnDay.length - 2} more</div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const renderContent = () => {
    switch (activeView) {
      case 'reservations':
        if (loading) {
          return (
            <div className="animate-in fade-in duration-300">
              <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900">Cleaning Schedule</h1>
                <p className="text-gray-500 font-medium">Manage your cleaning tasks and reservations</p>
              </div>
              <div className="flex items-center justify-center p-12">
                <p className="text-gray-500 font-medium">Loading your cleaning tasks...</p>
              </div>
            </div>
          );
        }
        
        return (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-900">Cleaning Schedule</h1>
                <p className="text-gray-500 font-medium">Manage your cleaning tasks and reservations</p>
              </div>
            </div>

            {cleaningTasks.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-500 font-medium mb-2">No active reservations</p>
                <p className="text-gray-400 text-sm">You don't have any cleaning tasks to manage right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {cleaningTasks.map((task) => (
                  <div key={task.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div style={{ backgroundColor: '#10b981', padding: '20px' }} className="text-white">
                    <h3 className="text-xl font-black mb-1">{task.propertyName}</h3>
                    <p className="text-green-100 text-sm flex items-center gap-2">
                      <Home size={14} /> {task.address}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Guest</p>
                      <p className="text-lg font-bold text-gray-900">{task.guestName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Check-in</p>
                        <p className="text-sm font-bold text-gray-900">{task.checkIn}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Check-out</p>
                        <p className="text-sm font-bold text-gray-900">{task.checkOut}</p>
                      </div>
                    </div>

                    {getTaskStatus(task.id) === 'in-progress' && getTaskStartTime(task.id) && (
                      <div className="bg-blue-50 p-3 rounded-xl">
                        <p className="text-xs font-bold text-blue-600">Started: {getTaskStartTime(task.id)}</p>
                      </div>
                    )}

                    {getTaskStatus(task.id) === 'completed' && getTaskEndTime(task.id) && (
                      <div className="bg-green-50 p-3 rounded-xl space-y-1">
                        <p className="text-xs font-bold text-green-600">Started: {getTaskStartTime(task.id)}</p>
                        <p className="text-xs font-bold text-green-600">Completed: {getTaskEndTime(task.id)}</p>
                      </div>
                    )}

                    {task.notes && (
                      <div className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-xs font-bold text-gray-600 mb-1">Notes:</p>
                        <p className="text-sm text-gray-700">{task.notes}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                      {getTaskStatus(task.id) === 'pending' && (
                        <button
                          onClick={() => handleStartCleaning(task.id)}
                          style={{
                            backgroundColor: '#10b981',
                            color: 'white'
                          }}
                          className="px-3 py-2 text-xs rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1"
                        >
                          <Clock size={14} /> Start
                        </button>
                      )}

                      {getTaskStatus(task.id) === 'in-progress' && (
                        <button
                          onClick={() => handleCompleteCleaning(task.id)}
                          style={{
                            backgroundColor: '#059669',
                            color: 'white'
                          }}
                          className="px-3 py-2 text-xs rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1"
                        >
                          <CheckCircle size={14} /> Done
                        </button>
                      )}

                      {getTaskStatus(task.id) === 'completed' && (
                        <button
                          onClick={() => handleResetCleaning(task.id)}
                          style={{
                            backgroundColor: '#fca5a5',
                            color: '#991b1b'
                          }}
                          className="px-3 py-2 text-xs rounded-lg font-semibold hover:opacity-90 transition-all"
                        >
                          ↺ Reset
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenCleaningDateModal(task)}
                        style={
                          isCleaningDateTimeSet(task.cleaningDateTime)
                            ? {
                                backgroundColor: '#10b981',
                                color: 'white'
                              }
                            : {
                                backgroundColor: '#fbbf24',
                                color: '#78350f'
                              }
                        }
                        className="px-3 py-2 text-xs rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1"
                      >
                        <Clock size={14} /> {isCleaningDateTimeSet(task.cleaningDateTime) ? 'Update' : 'Set'} Time
                      </button>

                      <button
                        onClick={() => handleOpenNotes(task)}
                        style={{
                          backgroundColor: '#d1fae5',
                          color: '#059669'
                        }}
                        className="px-3 py-2 text-xs rounded-lg font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1"
                      >
                        <FileText size={14} /> Notes
                      </button>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'dashboard':
      default:
        return (
          <div className="animate-in fade-in duration-300">
            <header className="mb-10">
              <h1 className="text-3xl font-black text-gray-900">Welcome</h1>
              <p className="text-gray-500">Here's your cleaning dashboard overview</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div style={{ backgroundColor: '#10b981' }} className="w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                  <Calendar className="text-white" size={20} />
                </div>
                <p className="text-xs font-medium text-gray-500">Scheduled</p>
                <h3 className="text-xl font-black text-gray-900">{cleaningTasks.filter(t => t.cleaningDateTime).length}</h3>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div style={{ backgroundColor: '#10b981' }} className="w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                  <Clock className="text-white" size={20} />
                </div>
                <p className="text-xs font-medium text-gray-500">Need to be Scheduled</p>
                <h3 className="text-xl font-black text-gray-900">{cleaningTasks.filter(t => !t.cleaningDateTime).length}</h3>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div style={{ backgroundColor: '#10b981' }} className="w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                  <CheckCircle className="text-white" size={20} />
                </div>
                <p className="text-xs font-medium text-gray-500">Completed</p>
                <h3 className="text-xl font-black text-gray-900">{cleaningTasks.filter(t => getTaskStatus(t.id) === 'completed').length}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-gray-900">Reservation Calendar</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={previousMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft size={20} className="text-gray-600" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight size={20} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-700 mb-4">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>

                {/* Day names */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {dayNames.map(day => (
                    <div key={day} className="text-center font-bold text-gray-600 text-sm py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-2">
                  {renderCalendar()}
                </div>

                {/* Legend */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                  <p className="text-xs font-bold text-gray-600 uppercase">Legend:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Brush size={16} className="text-green-600" />
                      <span className="text-sm text-gray-600">Cleaning</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wrench size={16} className="text-red-600" />
                      <span className="text-sm text-gray-600">Repair</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Flame size={16} className="text-orange-500" />
                      <span className="text-sm text-gray-600">Maintenance</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Month's Reservations */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-6">This Month's Reservations</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {cleaningTasks
                    .filter(task => {
                      const taskDate = new Date(task.checkIn);
                      return taskDate.getMonth() === currentDate.getMonth() && 
                             taskDate.getFullYear() === currentDate.getFullYear();
                    })
                    .map(task => (
                      <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setActiveView('reservations')}>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate">{task.propertyName}</p>
                          <p className="text-sm text-gray-500 truncate">{task.guestName}</p>
                          <p className="text-xs text-gray-400 mt-1">{task.checkIn} → {task.checkOut}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ml-2 ${task.cleaningDateTime ? 'border-green-300 bg-green-50 text-green-700' : 'border-yellow-300 bg-yellow-50 text-yellow-700'}`}>
                          {task.cleaningDateTime ? 'Scheduled' : 'Unscheduled'}
                        </span>
                      </div>
                    ))
                    .length > 0 ? 
                    cleaningTasks
                      .filter(task => {
                        const taskDate = new Date(task.checkIn);
                        return taskDate.getMonth() === currentDate.getMonth() && 
                               taskDate.getFullYear() === currentDate.getFullYear();
                      })
                      .map(task => (
                        <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setActiveView('reservations')}>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate">{task.propertyName}</p>
                            <p className="text-sm text-gray-500 truncate">{task.guestName}</p>
                            <p className="text-xs text-gray-400 mt-1">{task.checkIn} → {task.checkOut}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ml-2 ${task.cleaningDateTime ? 'border-green-300 bg-green-50 text-green-700' : 'border-yellow-300 bg-yellow-50 text-yellow-700'}`}>
                            {task.cleaningDateTime ? 'Scheduled' : 'Unscheduled'}
                          </span>
                        </div>
                      ))
                    :
                    <div className="text-center py-8">
                      <p className="text-gray-500">No reservations this month</p>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f5c3d] text-white flex flex-col shrink-0">
        <div className="p-8 font-black text-2xl tracking-tighter italic text-green-300">STRway</div>
        <nav className="flex-1 px-4 space-y-2">
          <NavItem 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')} 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
          />
          <NavItem 
            active={activeView === 'reservations'} 
            onClick={() => setActiveView('reservations')} 
            icon={<Calendar size={20} />} 
            label="Schedule" 
          />
        </nav>
        <div className="p-4 border-t border-green-800">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-green-200 hover:text-white transition-colors w-full">
            <LogOut size={20} /> <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>

      {/* NOTES MODAL */}
      {showModal && selectedTask && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
            <div style={{ backgroundColor: '#10b981' }} className="px-8 py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white">Cleaning Notes</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-green-100 hover:text-white text-2xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8 space-y-6">
              <div>
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Property</p>
                <p className="text-xl font-bold text-slate-900">{selectedTask.propertyName}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Add or Edit Notes</label>
                <textarea 
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full p-4 text-gray-900 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-200 resize-none"
                  rows="6"
                  placeholder="Add any notes about the cleaning task here..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-2xl font-bold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveNotes}
                  style={{ backgroundColor: '#10b981', color: 'white' }}
                  className="flex-1 py-3 rounded-2xl font-bold hover:opacity-90 transition-all"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CLEANING DATE TIME MODAL */}
      {showCleaningDateModal && selectedTask && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
            <div style={{ backgroundColor: '#fbbf24' }} className="px-8 py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-900">Set Cleaning Date & Time</h2>
                <button 
                  onClick={() => setShowCleaningDateModal(false)}
                  className="text-gray-600 hover:text-gray-900 text-2xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8 space-y-6">
              <div>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Property</p>
                <p className="text-xl font-bold text-slate-900">{selectedTask.propertyName}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Cleaning Date</label>
                <DatePicker
                  selected={cleaningDate}
                  onChange={(date) => setCleaningDate(date)}
                  dateFormat="MMMM d, yyyy"
                  minDate={new Date(selectedTask.checkOut)}
                  inline
                  className="w-full p-4 text-lg text-gray-900 bg-white border-2 border-amber-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                  calendarClassName="react-datepicker__calendar--inline"
                  popperClassName="react-datepicker__popup--no-dropdown"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Cleaning Time</label>
                <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto p-2 bg-white border-2 border-amber-300 rounded-xl">
                  {Array.from({ length: 41 }, (_, i) => {
                    const hour = 8 + Math.floor(i / 4);
                    const minute = (i % 4) * 15;
                    const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                    const displayStr = new Date(`2000-01-01T${timeStr}`).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit', 
                      hour12: true 
                    });
                    const isSelected = cleaningTime === timeStr;
                    return (
                      <button
                        key={timeStr}
                        onClick={() => setCleaningTime(timeStr)}
                        className={`py-3 px-2 rounded-lg font-bold text-sm transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-900 hover:bg-amber-200'
                        }`}
                      >
                        {displayStr}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowCleaningDateModal(false)}
                  className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-2xl font-bold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSetCleaningDateTime}
                  style={{ backgroundColor: '#fbbf24', color: '#78350f' }}
                  className="flex-1 py-3 rounded-2xl font-bold hover:opacity-90 transition-all"
                >
                  Set Time
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULING MODAL */}
      {showSchedulingModal && selectedDateForScheduling !== null && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
            <div style={{ backgroundColor: '#10b981' }} className="px-8 py-6">
              <h2 className="text-2xl font-black text-white">Schedule Cleaning</h2>
            </div>
            
            {/* Content */}
            <div className="p-8 space-y-6">
              <div>
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Date</p>
                <p className="text-xl font-bold text-slate-900">
                  {monthNames[currentDate.getMonth()]} {selectedDateForScheduling}, {currentDate.getFullYear()}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Tasks on This Date</p>
                <div className="space-y-2">
                  {getTasksForDate(selectedDateForScheduling)
                    .filter(t => t.status === 'pending')
                    .map(task => (
                      <div key={task.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="font-bold text-gray-900">{task.propertyName}</p>
                        <p className="text-sm text-gray-600">{task.guestName}</p>
                      </div>
                    ))
                  }
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">Select Arrival Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'].map(time => (
                    <button
                      key={time}
                      onClick={() => setSchedulingTime(time)}
                      style={{
                        backgroundColor: schedulingTime === time ? '#10b981' : '#f0fdf4',
                        color: schedulingTime === time ? 'white' : '#059669',
                        border: `2px solid ${schedulingTime === time ? '#10b981' : '#d1fae5'}`
                      }}
                      className="py-2 rounded-lg font-bold transition-all hover:opacity-90"
                    >
                      {new Date(`2026-01-01T${time}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowSchedulingModal(false)}
                  style={{ backgroundColor: '#f0fdf4', color: '#4b5563', border: '2px solid #e5e7eb' }}
                  className="flex-1 py-3 rounded-2xl font-bold hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleScheduleTime}
                  style={{ backgroundColor: '#d1fae5', color: '#059669', border: '2px solid #86efac' }}
                  className="flex-1 py-3 rounded-2xl font-bold hover:opacity-90 transition-all"
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESERVATION DETAILS MODAL */}
      {showReservationDetailsModal && selectedReservationForDetails && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
            {/* Header */}
            <div style={{ backgroundColor: '#10b981' }} className="px-8 py-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white">Reservation Details</h2>
                <button 
                  onClick={() => setShowReservationDetailsModal(false)}
                  className="text-white hover:text-gray-100 text-2xl transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-8 space-y-6">
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Property</p>
                <p className="text-xl font-bold text-gray-900">{selectedReservationForDetails.propertyName}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedReservationForDetails.address}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Guest</p>
                <p className="text-lg font-bold text-gray-900">{selectedReservationForDetails.guestName}</p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Confirmation Number</p>
                <p className="text-sm font-mono text-gray-900">{selectedReservationForDetails.confirmationNumber}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Check-in</p>
                  <p className="text-sm font-bold text-gray-900">{selectedReservationForDetails.checkIn}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Check-out</p>
                  <p className="text-sm font-bold text-gray-900">{selectedReservationForDetails.checkOut}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Guest Count</p>
                  <p className="text-sm font-bold text-gray-900">{selectedReservationForDetails.numberOfGuests || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">Dogs</p>
                  <p className="text-sm font-bold text-gray-900">{selectedReservationForDetails.hasDogs ? 'Yes' : 'No'}</p>
                </div>
              </div>

              {selectedReservationForDetails.cleaningDateTime && (
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-1">Cleaning Scheduled</p>
                  <p className="text-sm font-bold text-green-700">{new Date(selectedReservationForDetails.cleaningDateTime).toLocaleString()}</p>
                </div>
              )}

              {selectedReservationForDetails.notes && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Notes</p>
                  <p className="text-sm text-gray-700">{selectedReservationForDetails.notes}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
              <button 
                onClick={() => setShowReservationDetailsModal(false)}
                className="w-full bg-gray-200 text-gray-900 py-3 rounded-2xl font-bold hover:bg-gray-300 transition-all"
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

// HELPER COMPONENTS
const NavItem = ({ active, onClick, icon, label }) => (
  <div 
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold cursor-pointer
      ${active ? 'bg-green-600 text-white shadow-lg' : 'text-green-200 hover:bg-green-900 hover:text-white'}`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </div>
);

export default CleanerPortal;
