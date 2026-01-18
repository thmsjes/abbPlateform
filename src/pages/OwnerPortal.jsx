import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  LogOut, 
  Plus, 
  Pencil, 
  Trash2, 
  DollarSign,
  TrendingUp,
  Calendar
} from 'lucide-react';

const OwnerPortal = () => {
  const [activeView, setActiveView] = useState('dashboard');

  // Mock Data
  const [expenses] = useState([
    { id: 1, desc: 'New Bed Sheets', amount: 45.00, date: '2026-01-05', category: 'Supplies' },
    { id: 2, desc: 'AC Repair', amount: 150.00, date: '2026-01-08', category: 'Maintenance' },
  ]);

  const [staff, setStaff] = useState([
    { id: 1, name: 'John Doe', role: 'Cleaner', email: 'john@strway.com' },
    { id: 2, name: 'Jane Smith', role: 'Maintenance', email: 'jane@strway.com' },
  ]);

  const [reservations, setReservations] = useState([
    { id: 1, guest: 'Alice Johnson', property: 'Beachfront Villa', checkIn: '2026-02-10', status: 'Confirmed' },
    { id: 2, guest: 'Bob Wilson', property: 'Mountain Cabin', checkIn: '2026-02-15', status: 'Pending' },
  ]);

  // --- RENDERING LOGIC ---
  const renderContent = () => {
    switch (activeView) {
      case 'staff':
        return (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-900">Staff Management</h1>
                <p className="text-gray-500 font-medium">Manage employees and records</p>
              </div>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg transition-all">
                <Plus size={20} /> Add User
              </button>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Employee</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {staff.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-6">
                        <p className="font-bold text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.role}</p>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex justify-center gap-3">
                          <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                          <button onClick={() => setStaff(staff.filter(s => s.id !== member.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'reservations':
        return (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-900">Reservations</h1>
                <p className="text-gray-500 font-medium">Add, update, or cancel bookings</p>
              </div>
              <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg transition-all">
                <Plus size={20} /> New Reservation
              </button>
            </div>
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Guest</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Property</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider">Check-in</th>
                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-6 font-bold text-gray-900">{res.guest}</td>
                      <td className="p-6 text-gray-500 font-medium">{res.property}</td>
                      <td className="p-6 text-gray-500 font-medium">{res.checkIn}</td>
                      <td className="p-6 text-center">
                        <div className="flex justify-center gap-3">
                          <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={18} /></button>
                          <button onClick={() => setReservations(reservations.filter(r => r.id !== res.id))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-900">Owner Dashboard</h1>
                <p className="text-gray-500 font-medium">Financial performance</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <StatCard title="Total Revenue" value="$4,200" color="text-green-600" icon={<TrendingUp size={20}/>} />
              <StatCard title="Total Expenses" value={`$${expenses.reduce((acc, curr) => acc + curr.amount, 0)}`} color="text-red-600" icon={<Receipt size={20}/>} />
              <StatCard title="Net Profit" value="$4,005" color="text-blue-600" icon={<DollarSign size={20}/>} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col shrink-0">
        <div className="p-8 font-black text-2xl tracking-tighter italic text-blue-400">STRway</div>
        <nav className="flex-1 px-4 space-y-2">
          <SidebarButton 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')} 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
          />
          <SidebarButton 
            active={activeView === 'staff'} 
            onClick={() => setActiveView('staff')} 
            icon={<Users size={20} />} 
            label="Staff" 
          />
          <SidebarButton 
            active={activeView === 'reservations'} 
            onClick={() => setActiveView('reservations')} 
            icon={<Calendar size={20} />} 
            label="Reservations" 
          />
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors w-full">
            <LogOut size={20} /> <span className="font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN --- */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

// --- SMALLER COMPONENTS FOR CLARITY ---

const SidebarButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold outline-none
      ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const StatCard = ({ title, value, color, icon }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center">
    <div>
      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">{title}</p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
    </div>
    <div className={`p-3 rounded-2xl bg-gray-50 ${color}`}>{icon}</div>
  </div>
);

export default OwnerPortal;