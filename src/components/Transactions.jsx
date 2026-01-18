import React, { useState } from 'react';
import { Plus, Search, Filter, ArrowUpRight, ArrowDownLeft, Trash2 } from 'lucide-react';

const TransactionModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'Expense',
    category: 'Maintenance',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = formData.type === 'Expense' ? -Math.abs(formData.amount) : Math.abs(formData.amount);
    onSave({ ...formData, amount: parseFloat(finalAmount), id: Date.now() });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 transform transition-all animate-in fade-in zoom-in duration-200">
        <h3 className="text-2xl font-black mb-6">New Transaction</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Toggle Type */}
          <div className="flex bg-gray-100 p-1 rounded-2xl">
            {['Expense', 'Payment'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, type: t })}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${formData.type === t ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Description</label>
            <input 
              required
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="e.g. Unit 3 Plumbing"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Amount ($)</label>
              <input 
                type="number" step="0.01" required
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="0.00"
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">Date</label>
              <input 
                type="date" required
                value={formData.date}
                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-100"
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-50 rounded-2xl transition-all">Cancel</button>
            <button type="submit" className="flex-1 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-blue-600 shadow-lg transition-all">Save Entry</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Transactions = () => {
  const [showModal, setShowModal] = useState(false);
  
  // Mock data - You'll eventually fetch this from your [ABB].[dbo].[Transactions] table
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2026-01-10', description: 'Unit 4B Cleaning Fee', amount: -150.00, type: 'Expense', category: 'Maintenance' },
    { id: 2, date: '2026-01-09', description: 'Monthly Rent - Unit 2A', amount: 2400.00, type: 'Payment', category: 'Rent' },
    { id: 3, date: '2026-01-08', description: 'Plumbing Repair - Unit 1C', amount: -320.50, type: 'Expense', category: 'Repair' },
  ]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* HEADER SECTION */}
      <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900">Financial Ledger</h2>
          <p className="text-gray-500 text-sm">Track every dollar flowing through your properties.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} /> Add Transaction
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="px-8 py-4 bg-gray-50/50 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search descriptions..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-white">
          <Filter size={16} /> Filter
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-8 py-4 font-bold">Date</th>
              <th className="px-8 py-4 font-bold">Description</th>
              <th className="px-8 py-4 font-bold">Category</th>
              <th className="px-8 py-4 font-bold text-right">Amount</th>
              <th className="px-8 py-4 font-bold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-8 py-4 text-sm text-gray-600">{t.date}</td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${t.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {t.amount > 0 ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <span className="font-bold text-gray-900">{t.description}</span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                    {t.category}
                  </span>
                </td>
                <td className={`px-8 py-4 text-right font-black ${t.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {t.amount > 0 ? `+ $${t.amount.toFixed(2)}` : `- $${Math.abs(t.amount).toFixed(2)}`}
                </td>
                <td className="px-8 py-4 text-center">
                  <button className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD TRANSACTION MODAL */}
      {showModal && (
        <TransactionModal 
          onClose={() => setShowModal(false)} 
          onSave={(newTx) => setTransactions([newTx, ...transactions])}
        />
      )}
    </div>
  );
  
};


export default Transactions;