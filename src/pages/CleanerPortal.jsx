import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ChevronRight
} from 'lucide-react';

const CleanerPortal = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('reservations');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 23)); // Jan 23, 2026
  const [selectedDateForScheduling, setSelectedDateForScheduling] = useState(null);
  const [schedulingTime, setSchedulingTime] = useState('09:00');
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  
  // Mock cleaning tasks data
  const [cleaningTasks, setCleaningTasks] = useState([
    { 
      id: 1, 
      propertyName: 'Beachfront Villa', 
      address: '123 Ocean Drive',
      guestName: 'Alice Johnson', 
      checkIn: '2026-01-25', 
      checkOut: '2026-01-27',
      status: 'pending', // pending, in-progress, completed
      startTime: null,
      endTime: null,
      notes: ''
    },
    { 
      id: 2, 
      propertyName: 'Mountain Cabin', 
      address: '456 Peak Lane',
      guestName: 'Bob Wilson', 
      checkIn: '2026-01-28', 
      checkOut: '2026-01-30',
      status: 'pending',
      startTime: null,
      endTime: null,
      notes: ''
    },
  ]);

  const [selectedTask, setSelectedTask] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editNotes, setEditNotes] = useState('');

  const handleStartCleaning = (taskId) => {
    setCleaningTasks(cleaningTasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'in-progress', startTime: new Date().toLocaleTimeString() }
        : task
    ));
  };

  const handleCompleteCleaning = (taskId) => {
    setCleaningTasks(cleaningTasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed', endTime: new Date().toLocaleTimeString() }
        : task
    ));
  };

  const handleResetCleaning = (taskId) => {
    setCleaningTasks(cleaningTasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'pending', startTime: null, endTime: null }
        : task
    ));
  };

  const handleOpenNotes = (task) => {
    setSelectedTask(task);
    setEditNotes(task.notes);
    setShowModal(true);
  };

  const handleSaveNotes = () => {
    setCleaningTasks(cleaningTasks.map(task => 
      task.id === selectedTask.id 
        ? { ...task, notes: editNotes }
        : task
    ));
    setShowModal(false);
  };

  const handleDateClick = (day) => {
    setSelectedDateForScheduling(day);
    setSchedulingTime('09:00');
    setShowSchedulingModal(true);
  };

  const handleScheduleTime = () => {
    if (!selectedDateForScheduling) return;
    
    // Find tasks on this date that are still pending
    const tasksOnDate = cleaningTasks.filter(task => 
      isDateInRange(selectedDateForScheduling, task) && task.status === 'pending'
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
    const taskStartDate = new Date(task.checkIn);
    const taskEndDate = new Date(task.checkOut);
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    return checkDate >= taskStartDate && checkDate <= taskEndDate;
  };

  const getTasksForDate = (day) => {
    return cleaningTasks.filter(task => isDateInRange(day, task));
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
      const colorClass = getDateStatusColor(day);
      const hasPendingTasks = tasksOnDay.some(t => t.status === 'pending');

      days.push(
        <div 
          key={day} 
          onClick={() => hasPendingTasks && handleDateClick(day)}
          className={`bg-white border border-gray-100 rounded-lg p-2 min-h-16 transition-all
            ${hasPendingTasks ? 'hover:shadow-lg hover:border-green-300 cursor-pointer' : 'hover:shadow-md'}
          `}
        >
          <div className="flex items-start justify-between mb-1">
            <span className="text-sm font-bold text-gray-700">{day}</span>
            {colorClass && (
              <div className={`w-2 h-2 rounded-full ${colorClass}`}></div>
            )}
          </div>
          {tasksOnDay.length > 0 && (
            <div className="space-y-1">
              {tasksOnDay.slice(0, 2).map(task => (
                <div key={task.id} className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap overflow-hidden text-ellipsis
                  ${task.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                  ${task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : ''}
                  ${task.status === 'completed' ? 'bg-green-100 text-green-700' : ''}
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
        return (
          <div className="animate-in fade-in duration-300">
            <div className="mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-900">Cleaning Schedule</h1>
                <p className="text-gray-500 font-medium">Manage your cleaning tasks and reservations</p>
              </div>
            </div>

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

                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(task.status)}`}>
                        {getStatusLabel(task.status)}
                      </span>
                    </div>

                    {task.status === 'in-progress' && task.startTime && (
                      <div className="bg-blue-50 p-3 rounded-xl">
                        <p className="text-xs font-bold text-blue-600">Started: {task.startTime}</p>
                      </div>
                    )}

                    {task.status === 'completed' && task.endTime && (
                      <div className="bg-green-50 p-3 rounded-xl space-y-1">
                        <p className="text-xs font-bold text-green-600">Started: {task.startTime}</p>
                        <p className="text-xs font-bold text-green-600">Completed: {task.endTime}</p>
                      </div>
                    )}

                    {task.notes && (
                      <div className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-xs font-bold text-gray-600 mb-1">Notes:</p>
                        <p className="text-sm text-gray-700">{task.notes}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      {task.status === 'pending' && (
                        <button
                          onClick={() => handleStartCleaning(task.id)}
                          style={{
                            backgroundColor: '#10b981',
                            color: 'white'
                          }}
                          className="flex-1 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                          <Clock size={16} /> Start Cleaning
                        </button>
                      )}

                      {task.status === 'in-progress' && (
                        <button
                          onClick={() => handleCompleteCleaning(task.id)}
                          style={{
                            backgroundColor: '#059669',
                            color: 'white'
                          }}
                          className="flex-1 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} /> Complete
                        </button>
                      )}

                      {task.status === 'completed' && (
                        <button
                          onClick={() => handleResetCleaning(task.id)}
                          style={{
                            backgroundColor: '#fca5a5',
                            color: '#991b1b'
                          }}
                          className="flex-1 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                        >
                          ↺ Reset
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenNotes(task)}
                        style={{
                          backgroundColor: '#d1fae5',
                          color: '#059669'
                        }}
                        className="flex-1 py-3 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                      >
                        <FileText size={16} /> Notes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
                <h3 className="text-xl font-black text-gray-900">{cleaningTasks.filter(t => t.status === 'in-progress' || t.startTime !== null).length}</h3>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div style={{ backgroundColor: '#10b981' }} className="w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                  <Clock className="text-white" size={20} />
                </div>
                <p className="text-xs font-medium text-gray-500">Need to be Scheduled</p>
                <h3 className="text-xl font-black text-gray-900">{cleaningTasks.filter(t => t.status === 'pending' && t.startTime === null).length}</h3>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div style={{ backgroundColor: '#10b981' }} className="w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                  <CheckCircle className="text-white" size={20} />
                </div>
                <p className="text-xs font-medium text-gray-500">Completed</p>
                <h3 className="text-xl font-black text-gray-900">{cleaningTasks.filter(t => t.status === 'completed').length}</h3>
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
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm text-gray-600">Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm text-gray-600">In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-gray-600">Completed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Today's Tasks */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Today's Tasks</h2>
                <div className="space-y-3">
                  {cleaningTasks.slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{task.propertyName}</p>
                        <p className="text-sm text-gray-500">{task.guestName} • {task.checkIn}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(task.status)}`}>
                        {getStatusLabel(task.status)}
                      </span>
                    </div>
                  ))}
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
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-200 resize-none"
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
