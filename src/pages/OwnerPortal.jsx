import React, { useState } from 'react';
import { Plus, Receipt, DollarSign, Calendar as CalIcon } from 'lucide-react';
import AddExpenseModal from '../components/AddExpenseModal';

const OwnerPortal = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, desc: 'New Bed Sheets', amount: 45.00, date: '2026-01-05', category: 'Supplies' },
    { id: 2, desc: 'AC Repair', amount: 150.00, date: '2026-01-08', category: 'Maintenance' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-500">Manage your property financials</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          <Plus size={20} /> Add Expense
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Revenue" value="$4,200" color="text-green-600" />
        <StatCard title="Total Expenses" value={`$${expenses.reduce((acc, curr) => acc + curr.amount, 0)}`} color="text-red-600" />
        <StatCard title="Net Profit" value="$4,005" color="text-blue-600" />
      </div>

      {/* EXPENSE TABLE */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Description</th>
              <th className="p-4 font-semibold text-gray-600">Date</th>
              <th className="p-4 font-semibold text-gray-600">Category</th>
              <th className="p-4 font-semibold text-gray-600 text-right">Amount</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Receipt</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="p-4 font-medium">{exp.desc}</td>
                <td className="p-4 text-gray-500">{exp.date}</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold uppercase text-gray-600">
                    {exp.category}
                  </span>
                </td>
                <td className="p-4 text-right font-bold text-gray-900">${exp.amount.toFixed(2)}</td>
                <td className="p-4 text-center">
                  <button className="text-blue-500 hover:text-blue-700">
                    <Receipt size={18} className="mx-auto" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={yourFunction} />
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
    <p className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">{title}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

export default OwnerPortal;