import React, { useState } from 'react';
import { X, Upload, DollarSign, FileText } from 'lucide-react';

const AddExpenseModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'Supplies',
    receipt: null
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // In the future, this will be a FormData object sent to your .NET controller
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Card */}
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-slate-100">
          <h2 className="text-xl font-bold text-gray-900">New Expense</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-900">Description</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="text" 
                required
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-gray-900"
                placeholder="e.g., Professional Cleaning"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-900">Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="number" 
                  step="0.01"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-gray-900"
                  placeholder="0.00"
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-900">Date</label>
              <input 
                type="date" 
                value={formData.date}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-gray-900"
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          {/* Receipt Upload */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-900">Receipt Image</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:bg-slate-50 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="text-slate-400 mb-2" />
                <p className="text-xs text-slate-500">Click to upload photo of receipt</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => setFormData({...formData, receipt: e.target.files[0]})}
              />
            </label>
            {formData.receipt && (
               <p className="mt-2 text-xs text-green-600 font-medium italic">✓ {formData.receipt.name} selected</p>
            )}
          </div>

          <button 
            type="submit" 
            className="w-full text-white py-3 rounded-xl font-bold transition shadow-lg"
            style={{ backgroundColor: '#dc2626' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
          >
            Save Expense
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;