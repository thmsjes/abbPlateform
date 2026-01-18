import React, { useState } from 'react';
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
  Trash2 
} from 'lucide-react';
import Transactions from '../components/Transactions';

const OwnerDashboard = () => {
  // Views: 'dashboard', 'expenses', 'staff', 'reservations'
  const [activeView, setActiveView] = useState('dashboard'); 
  
  // Mock data for Staff
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'John Doe', role: 'Cleaner', email: 'john@strway.com' },
    { id: 2, name: 'Jane Smith', role: 'Maintenance', email: 'jane@strway.com' },
    { id: 3, name: 'Mike Ross', role: 'Property Manager', email: 'mike@strway.com' },
  ]);

  // NEW: Mock data for Reservations
  const [reservationsList, setReservationsList] = useState([
    { id: 1, guest: 'Sarah Connor', property: 'Sunset Suite', checkIn: '2026-01-20', checkOut: '2026-01-25', status: 'Confirmed' },
    { id: 2, guest: 'James Bond', property: 'Skyline Loft', checkIn: '2026-02-01', checkOut: '2026-02-05', status: 'Pending' },
  ]);

  // Mock data for Dashboard Stats
  const stats = [
    { label: 'Total Revenue', value: '$12,450', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Active Bookings', value: reservationsList.length.toString(), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Avg. Occupancy', value: '82%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Staff Active', value: staffList.length.toString(), icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  const deleteStaff = (id) => {
    if(window.confirm("Are you sure you want to remove this staff member?")) {
      setStaffList(staffList.filter(s => s.id !== id));
    }
  };

  const deleteReservation = (id) => {
    if(window.confirm("Are you sure you want to cancel this reservation?")) {
      setReservationsList(reservationsList.filter(r => r.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col shrink-0">
        <div className="p-8 font-black text-2xl tracking-tighter italic text-blue-400">STRway</div>
        
        <nav className="flex-1 px-4 space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeView === 'dashboard'}
            onClick={() => setActiveView('dashboard')} 
          />
          <NavItem 
            icon={<Home size={20} />} 
            label="Expenses" 
            active={activeView === 'expenses'}
            onClick={() => setActiveView('expenses')} 
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Staff" 
            active={activeView === 'staff'}
            onClick={() => setActiveView('staff')} 
          />
          {/* NEW RESERVATIONS MENU ITEM */}
          <NavItem 
            icon={<Calendar size={20} />} 
            label="Reservations" 
            active={activeView === 'reservations'}
            onClick={() => setActiveView('reservations')} 
          />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 text-slate-400 hover:text-pink-500 transition-colors w-full px-4 py-3">
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
                <p className="text-gray-500">Welcome back, here is what's happening today.</p>
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold mb-6">Revenue Growth</h3>
                <div className="h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                  [Chart Visualization Placeholder]
                </div>
              </div>

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
        )}

        {/* VIEW: EXPENSES */}
        {activeView === 'expenses' && (
          <div className="animate-in fade-in duration-500">
             <Transactions />
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
              <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
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
                      <td className="p-6 font-bold text-gray-900">{member.name}</td>
                      <td className="p-6 text-sm text-gray-500">{member.role}</td>
                      <td className="p-6">
                        <div className="flex justify-center gap-3">
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Pencil size={18} /></button>
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

        {/* VIEW: RESERVATIONS (NEW PAGE) */}
        {activeView === 'reservations' && (
          <div className="animate-in fade-in duration-500">
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-black text-gray-900">Reservations</h1>
                <p className="text-gray-500">View and manage all guest bookings.</p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
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
                          <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Pencil size={18} /></button>
                          <button onClick={() => deleteReservation(res.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const NavItem = ({ icon, label, active = false, onClick }) => (
  <div 
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all font-semibold
      ${active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
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

export default OwnerDashboard;