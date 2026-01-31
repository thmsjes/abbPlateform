import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut, 
  Plus, 
  Pencil, 
  Trash2,
  Home,
  Wrench,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { getInvoicesByProperty, getUsersByPropertyId } from '../apiCalls';

const MaintenancePortal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeView, setActiveView] = useState('workOrders');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 26)); // Jan 26, 2026
  const [selectedDateForScheduling, setSelectedDateForScheduling] = useState(null);
  const [schedulingTime, setSchedulingTime] = useState('09:00');
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [invoicesList, setInvoicesList] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  
  // Get propertyId from navigation state or localStorage
  const propertyId = location.state?.propertyId || localStorage.getItem('propertyId') || '1';
  
  // Mock maintenance work orders data
  const [workOrders, setWorkOrders] = useState([
    { 
      id: 1, 
      propertyName: 'Beachfront Villa', 
      address: '123 Ocean Drive',
      issueType: 'Plumbing',
      description: 'Fix leaky kitchen faucet',
      priority: 'high',
      status: 'pending', // pending, in-progress, completed
      reportedDate: '2026-01-23',
      scheduledDate: null,
      startTime: null,
      endTime: null,
      notes: ''
    },
    { 
      id: 2, 
      propertyName: 'Mountain Cabin', 
      address: '456 Peak Lane',
      issueType: 'HVAC',
      description: 'Furnace not heating properly',
      priority: 'medium',
      status: 'pending',
      reportedDate: '2026-01-24',
      scheduledDate: null,
      startTime: null,
      endTime: null,
      notes: ''
    },
    { 
      id: 3, 
      propertyName: 'City Apartment', 
      address: '789 Downtown St',
      issueType: 'Electrical',
      description: 'Replace light switch in master bedroom',
      priority: 'low',
      status: 'completed',
      reportedDate: '2026-01-20',
      scheduledDate: '2026-01-25',
      startTime: '10:00',
      endTime: '10:30',
      notes: 'Completed successfully'
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editNotes, setEditNotes] = useState('');

  // Compute unpaid invoices list (all fetched invoices are considered unpaid)
  const unpaidInvoicesList = invoicesList;

  // Debug log
  useEffect(() => {
    console.log('Unpaid invoices count:', unpaidInvoicesList.length);
    console.log('Button color should be:', unpaidInvoicesList.length > 0 ? 'RED (#dc2626)' : 'GREEN (#10b981)');
  }, [unpaidInvoicesList]);

  const handleStartWork = (orderId) => {
    setWorkOrders(workOrders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'in-progress', startTime: new Date().toLocaleTimeString() }
        : order
    ));
  };

  const handleCompleteWork = (orderId) => {
    setWorkOrders(workOrders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'completed', endTime: new Date().toLocaleTimeString() }
        : order
    ));
  };

  const handleResetWork = (orderId) => {
    setWorkOrders(workOrders.map(order => 
      order.id === orderId 
        ? { ...order, status: 'pending', startTime: null, endTime: null }
        : order
    ));
  };

  const handleOpenNotes = (order) => {
    setSelectedOrder(order);
    setEditNotes(order.notes);
    setShowModal(true);
  };

  const handleSaveNotes = () => {
    setWorkOrders(workOrders.map(order => 
      order.id === selectedOrder.id 
        ? { ...order, notes: editNotes }
        : order
    ));
    setShowModal(false);
  };

  const handleDateClick = (day) => {
    setSelectedDateForScheduling(day);
    setSchedulingTime('09:00');
    setShowSchedulingModal(true);
  };

  const handleScheduleWork = () => {
    if (!selectedOrder || !selectedDateForScheduling) return;
    setWorkOrders(workOrders.map(order => 
      order.id === selectedOrder.id 
        ? { ...order, scheduledDate: selectedDateForScheduling.toISOString().split('T')[0] }
        : order
    ));
    setShowSchedulingModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  // Fetch invoices and staff on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token && propertyId) {
          // Fetch invoices
          const invoicesData = await getInvoicesByProperty({ token, propertyId: parseInt(propertyId) });
          if (invoicesData && Array.isArray(invoicesData) && invoicesData.length > 0) {
            setInvoicesList(invoicesData);
          } else {
            // Mock invoices for testing
            setInvoicesList([
              { id: 1, invoiceNumber: 'INV-001', company: 'Test Company', staffId: 1, amount: 150, type: 'Labor', dateCreated: '2026-01-28' },
              { id: 2, invoiceNumber: 'INV-002', company: 'Test Company 2', staffId: 2, amount: 200, type: 'Materials', dateCreated: '2026-01-29' }
            ]);
          }
          
          // Fetch staff
          const staffData = await getUsersByPropertyId({ token, propertyId: parseInt(propertyId) });
          if (staffData && Array.isArray(staffData)) {
            setStaffList(staffData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set mock data on error
        setInvoicesList([
          { id: 1, invoiceNumber: 'INV-001', company: 'Test Company', staffId: 1, amount: 150, type: 'Labor', dateCreated: '2026-01-28' },
          { id: 2, invoiceNumber: 'INV-002', company: 'Test Company 2', staffId: 2, amount: 200, type: 'Materials', dateCreated: '2026-01-29' }
        ]);
      }
    };
    fetchData();
  }, [propertyId]);

  // Helper function to get staff info by ID
  const getStaffInfo = (staffId) => {
    const staff = staffList.find(s => s.id === staffId);
    
    // Try to get name from various possible fields
    let name = 'Unknown';
    if (staff) {
      if (staff.name) {
        name = staff.name;
      } else if (staff.firstName && staff.lastName) {
        name = `${staff.firstName} ${staff.lastName}`.trim();
      } else if (staff.firstName) {
        name = staff.firstName;
      }
    }
    
    return {
      name: name,
      company: staff ? (staff.company || 'N/A') : 'N/A'
    };
  };

  const handleCompanyClick = (invoice) => {
    setSelectedCompany(invoice);
    setShowCompanyModal(true);
  };

  // Generate calendar days
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const calendarDays = [];
  
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const isDateBlocked = (day) => {
    if (!day) return false;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return workOrders.some(order => 
      (order.checkIn === dateStr || order.checkOut === dateStr || 
       (order.checkIn && order.checkOut && dateStr >= order.checkIn && dateStr <= order.checkOut))
    );
  };

  const getDateStatus = (day) => {
    if (!day) return null;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const order = workOrders.find(o => o.scheduledDate === dateStr);
    if (order?.status === 'pending') return 'pending';
    if (order?.status === 'in-progress') return 'in-progress';
    if (order?.status === 'completed') return 'completed';
    return null;
  };

  const stats = [
    { label: 'Pending', count: workOrders.filter(o => o.status === 'pending').length, color: 'text-red-600', bg: 'bg-red-100' },
    { label: 'In Progress', count: workOrders.filter(o => o.status === 'in-progress').length, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { label: 'Completed', count: workOrders.filter(o => o.status === 'completed').length, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const todayOrders = workOrders.filter(o => o.scheduledDate === todayStr);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex flex-col">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-red-600 to-orange-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Wrench size={32} className="text-white" />
            <div>
              <h1 className="text-3xl font-black text-white">Maintenance Portal</h1>
              <p className="text-red-100 text-sm">Manage work orders and maintenance tasks</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{backgroundColor: '#ffffff', color: '#dc2626'}}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold hover:opacity-80 transition-all shadow-md"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-10">
        {/* STATS */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-md border border-orange-100">
              <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-2xl font-black`}>
                {stat.count}
              </div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* LEFT SIDEBAR - CALENDAR */}
          <div className="bg-white p-8 rounded-3xl shadow-md border border-orange-100 h-fit">
            <h3 className="text-xl font-black text-gray-900 mb-6">Scheduled Work</h3>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <button 
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                  style={{backgroundColor: '#fed7aa', color: '#92400e'}}
                  className="p-2 rounded-xl transition-all hover:opacity-80"
                >
                  <ChevronLeft size={20} />
                </button>
                <h4 className="font-bold text-gray-900">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h4>
                <button 
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                  style={{backgroundColor: '#fed7aa', color: '#92400e'}}
                  className="p-2 rounded-xl transition-all hover:opacity-80"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="text-xs font-bold text-gray-500 py-2">{day}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  const status = getDateStatus(day);
                  const blocked = isDateBlocked(day);
                  return (
                    <button
                      key={idx}
                      onClick={() => day && handleDateClick(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                      className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                        !day ? 'invisible' :
                        status === 'pending' ? 'bg-yellow-200 text-yellow-900 hover:bg-yellow-300' :
                        status === 'in-progress' ? 'bg-blue-200 text-blue-900 hover:bg-blue-300' :
                        status === 'completed' ? 'bg-green-200 text-green-900 hover:bg-green-300' :
                        blocked ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' :
                        'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TODAY'S ORDERS */}
            <div className="border-t border-orange-100 pt-6">
              <h4 className="font-bold text-gray-900 mb-3">Today's Orders</h4>
              {todayOrders.length > 0 ? (
                <div className="space-y-2">
                  {todayOrders.map(order => (
                    <div key={order.id} className="text-xs bg-orange-50 p-3 rounded-xl border border-orange-100">
                      <p className="font-semibold text-gray-900">{order.propertyName}</p>
                      <p className="text-gray-600 text-xs">{order.issueType}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No orders scheduled for today</p>
              )}
            </div>
          </div>

          {/* RIGHT CONTENT - WORK ORDERS */}
          <div className="col-span-2">
            <div className="flex gap-3 mb-6">
              <button 
                onClick={() => setActiveView('workOrders')}
                className={`px-6 py-3 rounded-2xl font-bold transition-all ${activeView === 'workOrders' ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-700 border border-orange-100'}`}
              >
                All Work Orders
              </button>
              <button 
                onClick={() => setActiveView('pending')}
                className={`px-6 py-3 rounded-2xl font-bold transition-all ${activeView === 'pending' ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-700 border border-orange-100'}`}
              >
                Pending
              </button>
              <button 
                onClick={() => setActiveView('invoices')}
                className={`px-6 py-3 rounded-2xl font-bold transition-all ${activeView === 'invoices' ? 'bg-red-600 text-white shadow-lg' : 'bg-white text-gray-700 border border-orange-100'}`}
              >
                Invoices
              </button>
            </div>

            <div className="space-y-4">
              {(activeView === 'workOrders' ? workOrders : workOrders.filter(o => o.status === 'pending')).map(order => (
                <div key={order.id} className="bg-white p-6 rounded-3xl shadow-md border border-orange-100 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-black text-gray-900">{order.propertyName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.priority === 'high' ? 'bg-red-100 text-red-700' :
                          order.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {order.priority.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{order.address}</p>
                      <p className="text-sm font-semibold text-gray-900 mb-1">{order.issueType}: {order.description}</p>
                      <p className="text-xs text-gray-500">Reported: {order.reportedDate}</p>
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex flex-wrap gap-2">
                    {order.status === 'pending' && (
                      <button 
                        onClick={() => handleStartWork(order.id)}
                        style={{backgroundColor: '#fca5a5', color: '#7f1d1d'}}
                        className="px-4 py-2 rounded-xl font-bold hover:opacity-80 transition-all text-sm"
                      >
                        Start Work
                      </button>
                    )}
                    {order.status === 'in-progress' && (
                      <button 
                        onClick={() => handleCompleteWork(order.id)}
                        style={{backgroundColor: '#86efac', color: '#15803d'}}
                        className="px-4 py-2 rounded-xl font-bold hover:opacity-80 transition-all text-sm"
                      >
                        Complete
                      </button>
                    )}
                    {order.status !== 'pending' && (
                      <button 
                        onClick={() => handleResetWork(order.id)}
                        style={{backgroundColor: '#fcd34d', color: '#78350f'}}
                        className="px-4 py-2 rounded-xl font-bold hover:opacity-80 transition-all text-sm"
                      >
                        Reset
                      </button>
                    )}
                    <button 
                      onClick={() => handleOpenNotes(order)}
                      style={{backgroundColor: '#dbeafe', color: '#1e40af'}}
                      className="px-4 py-2 rounded-xl font-bold hover:opacity-80 transition-all text-sm flex items-center gap-2"
                    >
                      <Pencil size={16} /> Notes
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* INVOICES TABLE */}
            {activeView === 'invoices' && (
              <div>
                <div className="mb-6 flex gap-3">
                  <button 
                    key={`unpaid-${unpaidInvoicesList.length}`}
                    style={{
                      backgroundColor: '#2563eb', 
                      color: '#ffffff', 
                      border: 'none', 
                      padding: '12px 24px', 
                      display: 'inline-block', 
                      minWidth: '100px',
                      borderRadius: '1rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'opacity 0.25s'
                    }}
                  >
                    Unpaid ({unpaidInvoicesList.length})
                  </button>
                  <button style={{backgroundColor: '#dc2626', color: '#ffffff', border: 'none', padding: '12px 24px', cursor: 'pointer'}} className="rounded-2xl font-bold hover:opacity-90 transition-all flex items-center gap-2">
                    <Plus size={20} /> Report Issue
                  </button>
                </div>
                {invoicesList.length > 0 ? (
                  <div className="bg-white rounded-3xl shadow-md border border-orange-100 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Invoice #</th>
                          <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Company</th>
                          <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Staff Name</th>
                          <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                          <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                          <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Created</th>
                          <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {invoicesList.map((invoice, index) => {
                          const staffInfo = getStaffInfo(invoice.staffId);
                          return (
                            <tr key={invoice.id || `invoice-${index}`} className="hover:bg-gray-50/50 transition-colors">
                              <td className="p-6 font-bold text-gray-900">{invoice.invoiceNumber || '-'}</td>
                              <td className="p-6 text-sm">
                                <button 
                                  onClick={() => handleCompanyClick(invoice)}
                                  className="text-blue-600 hover:underline font-semibold"
                                >
                                  {staffInfo.company}
                                </button>
                              </td>
                              <td className="p-6 text-sm text-gray-600">{staffInfo.name}</td>
                              <td className="p-6 text-sm text-gray-600">{invoice.type}</td>
                              <td className="p-6 font-semibold text-gray-900">${parseFloat(invoice.amount).toFixed(2)}</td>
                              <td className="p-6 text-sm text-gray-600">{new Date(invoice.dateCreated).toLocaleDateString()}</td>
                              <td className="p-6">
                                <div className="flex justify-center gap-3">
                                  <button style={{backgroundColor: '#dbeafe', color: '#000000', border: 'none', padding: '8px'}} className="rounded-xl transition-all hover:opacity-80" title="Edit invoice"><Pencil size={18} /></button>
                                  <button style={{backgroundColor: '#fee2e2', color: '#000000', border: 'none', padding: '8px'}} className="rounded-xl transition-all hover:opacity-80" title="Delete invoice"><Trash2 size={18} /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-3xl shadow-md border border-orange-100 text-center">
                    <Wrench size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">No invoices found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* COMPANY DETAILS MODAL */}
      {showCompanyModal && selectedCompany && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-8 py-6 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white">Company Details</h2>
              <button onClick={() => setShowCompanyModal(false)} style={{backgroundColor: 'transparent'}} className="text-white hover:opacity-80 transition-all text-2xl">
                ×
              </button>
            </div>
            <div className="p-8 space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Company Name</p>
                <p className="text-lg font-bold text-gray-900">{getStaffInfo(selectedCompany.staffId).company}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Staff Name</p>
                <p className="text-lg font-bold text-gray-900">{getStaffInfo(selectedCompany.staffId).name}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Invoice Number</p>
                <p className="text-lg font-bold text-gray-900">{selectedCompany.invoiceNumber || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Type</p>
                <p className="text-lg font-bold text-gray-900">{selectedCompany.type}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</p>
                <p className="text-lg font-bold text-gray-900">${parseFloat(selectedCompany.amount).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Date Created</p>
                <p className="text-lg font-bold text-gray-900">{new Date(selectedCompany.dateCreated).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Description</p>
                <p className="text-sm text-gray-700">{selectedCompany.repairDescription || 'N/A'}</p>
              </div>
              <button 
                onClick={() => setShowCompanyModal(false)}
                style={{backgroundColor: '#dc2626', color: 'white'}}
                className="w-full py-3 rounded-2xl font-bold hover:opacity-90 transition-all mt-6"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* NOTES MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-8 py-6 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white">Work Order Notes</h2>
              <button onClick={() => setShowModal(false)} style={{backgroundColor: 'transparent'}} className="text-white hover:opacity-80 transition-all text-2xl">
                ×
              </button>
            </div>
            <div className="p-8">
              <p className="text-sm font-semibold text-gray-600 mb-3">{selectedOrder?.propertyName}</p>
              <textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Add notes about the work completed..."
                className="w-full h-32 p-4 border border-orange-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-400 resize-none text-gray-900"
              />
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowModal(false)}
                  style={{backgroundColor: '#fed7aa', color: '#92400e'}}
                  className="flex-1 py-3 rounded-2xl font-bold hover:opacity-80 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveNotes}
                  style={{backgroundColor: '#dc2626', color: 'white'}}
                  className="flex-1 py-3 rounded-2xl font-bold hover:opacity-90 transition-all"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULING MODAL */}
      {showSchedulingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 px-8 py-6 flex justify-between items-center">
              <h2 className="text-2xl font-black text-white">Schedule Work</h2>
              <button onClick={() => setShowSchedulingModal(false)} className="text-white hover:opacity-80 transition-all text-2xl">
                ×
              </button>
            </div>
            <div className="p-8">
              <p className="text-sm font-semibold text-gray-600 mb-6">
                Scheduling for: <span className="text-gray-900 font-black">{selectedDateForScheduling?.toLocaleDateString()}</span>
              </p>
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Work Order</label>
                <select value={selectedOrder?.id || ''} onChange={(e) => setSelectedOrder(workOrders.find(o => o.id === parseInt(e.target.value)))} className="w-full p-3 border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400">
                  <option value="">Select work order</option>
                  {workOrders.map(o => <option key={o.id} value={o.id}>{o.propertyName}</option>)}
                </select>
              </div>
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-600 uppercase mb-3 block">Preferred Time</label>
                <div className="grid grid-cols-4 gap-2">
                  {['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'].map(time => (
                    <button
                      key={time}
                      onClick={() => setSchedulingTime(time)}
                      style={{
                        backgroundColor: schedulingTime === time ? '#dc2626' : '#fed7aa',
                        color: schedulingTime === time ? 'white' : '#92400e'
                      }}
                      className="py-2 rounded-lg font-bold hover:opacity-80 transition-all text-sm"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowSchedulingModal(false)}
                  style={{backgroundColor: '#fed7aa', color: '#92400e'}}
                  className="flex-1 py-3 rounded-2xl font-bold hover:opacity-80 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleScheduleWork}
                  style={{backgroundColor: '#dc2626', color: 'white'}}
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

export default MaintenancePortal;
