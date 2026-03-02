import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, ArrowUpRight, ArrowDownLeft, Trash2, X, Calendar } from 'lucide-react';
import * as XLSX from 'xlsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createExpense, addMileage, getMileage, deleteTransaction, deleteMileage } from '../apiCalls';

const TransactionModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    description: '',
    vendor: '',
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
        <div style={{ backgroundColor: '#2563eb', margin: '-32px -32px 24px -32px', padding: '24px 32px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
          <h3 className="text-2xl font-black text-white">New Transaction</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
         {/* Toggle Type */}
<div className="flex bg-slate-100 p-1 rounded-2xl gap-1">
  {['Expense', 'Payment'].map((t) => {
    const isActive = formData.type === t;
    
    return (
      <button
        key={t}
        type="button"
        onClick={() => setFormData({ ...formData, type: t })}
        style={{
          flex: 1,
          padding: '12px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '900',
          transition: 'all 200ms',
          border: 'none',
          cursor: 'pointer',
          ...(isActive 
            ? (t === 'Expense' 
              ? { backgroundColor: '#dc2626', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' } 
              : { backgroundColor: '#16a34a', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' })
            : { backgroundColor: '#e2e8f0', color: '#64748b' }
          )
        }}
      >
        {t}
      </button>
    );
  })}
</div>


          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Description</label>
            <input 
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-200 text-gray-900"
              placeholder="e.g. Unit 3 Plumbing"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Vendor</label>
            <input 
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-200 text-gray-900"
              placeholder="e.g. ABC Plumbing Co."
              onChange={(e) => setFormData({...formData, vendor: e.target.value})}
            />
          </div>

          {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Category</label>
              <select
                required
                value={formData.category}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-200 text-gray-900"
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Cleaning">Cleaning</option>
                <option value="Rent">Rent</option>
                <option value="Supplies">Supplies</option>
                <option value="Utilities">Utilities</option>
                <option value="Insurance">Insurance</option>
                <option value="Property Maintenance">Property Maintenance</option>
                <option value="Home Maintenance">Home Maintenance</option>
                <option value="Repair">Repair</option>
                  <option value="Other">Other</option>
              </select>
            </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Amount ($)</label>
              <input 
                type="number" step="0.01" required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-200 text-gray-900"
                placeholder="0.00"
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            {/* Date */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Date</label>
              <input 
                type="date" required
                value={formData.date}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-200 text-gray-900"
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          {/* Payment Type */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Payment Type</label>
            <select
              value={formData.paymentType || 'Credit Card'}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-red-200 text-gray-900"
              onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
            >
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Check">Check</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 font-bold rounded-2xl transition-all" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>Cancel</button>
            <button type="submit" className="flex-1 py-4 text-white font-bold rounded-2xl shadow-lg transition-all" style={{ backgroundColor: '#0ea5e9' }}>Save Entry</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MileageModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    description: '',
    mileage: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ 
      description: formData.description, 
      mileage: parseFloat(formData.mileage), 
      date: formData.date,
      type: 'Mileage',
      id: Date.now() 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 transform transition-all animate-in fade-in zoom-in duration-200">
        <div style={{ backgroundColor: '#2563eb', margin: '-32px -32px 24px -32px', padding: '24px 32px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
          <h3 className="text-2xl font-black text-white">New Mileage Entry</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Description</label>
            <input 
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
              placeholder="e.g. Property inspection, material run"
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Mileage (Miles)</label>
              <input 
                type="number" step="0.1" required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
                placeholder="0.0"
                value={formData.mileage}
                onChange={(e) => setFormData({...formData, mileage: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 ml-1">Date</label>
              <DatePicker
                selected={formData.date ? new Date(formData.date) : null}
                onChange={(date) => setFormData({ ...formData, date: date ? date.toISOString().split('T')[0] : '' })}
                dateFormat="MMM dd, yyyy"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-200 text-gray-900"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 font-bold rounded-2xl transition-all" style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>Cancel</button>
            <button type="submit" className="flex-1 py-4 text-white font-bold rounded-2xl shadow-lg transition-all" style={{ backgroundColor: '#2563eb' }}>Save Mileage</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Transactions = ({ initialData = [], propertyDetails = null, filters: passedFilters = null, isMileageOnly = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [showMileageModal, setShowMileageModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showMileageFilters, setShowMileageFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    category: ''
  });
  const [mileageFilters, setMileageFilters] = useState({
    dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    dateTo: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
  });

  // PDF Export Function
  const exportToPDF = (data) => {
    if (data.length === 0) {
      alert('No transactions to export');
      return;
    }

    const activeFilters = passedFilters || filters;
    const dateRangeText = activeFilters.dateFrom && activeFilters.dateTo 
      ? `${new Date(activeFilters.dateFrom).toLocaleDateString()} - ${new Date(activeFilters.dateTo).toLocaleDateString()}`
      : 'All Dates';

    // Create a simple HTML representation and use browser print-to-PDF
    const tableHTML = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; background: white; }
            h1 { color: #1e293b; margin-bottom: 5px; }
            .header { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #2563eb; }
            .header-info { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .property-info { font-size: 14px; margin-bottom: 5px; }
            .date-range { color: #666; font-size: 12px; }
            .date { color: #666; font-size: 12px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background-color: #2563eb; color: white; padding: 12px; text-align: left; font-weight: bold; }
            td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .total-row { background-color: #f3f4f6; font-weight: bold; }
            .expense { color: #dc2626; }
            .payment { color: #16a34a; }
            .summary { margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 8px; }
            .summary-item { display: flex; justify-content: space-between; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Financial Ledger Report</h1>
            <div class="header-info">
              <div>
                ${propertyDetails ? `<div class="property-info"><strong>Property:</strong> ${propertyDetails.propertyName || 'N/A'}</div>
                <div class="property-info"><strong>Address:</strong> ${propertyDetails.address || 'N/A'}</div>` : ''}
                <div class="date-range"><strong>Period:</strong> ${dateRangeText}</div>
              </div>
              <div class="date">Generated on ${new Date().toLocaleDateString()}</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${data.map(t => `
                <tr>
                  <td>${new Date(t.date).toLocaleDateString()}</td>
                  <td>${t.description}</td>
                  <td>${t.category}</td>
                  <td>${t.type}</td>
                  <td class="${t.type === 'Expense' ? 'expense' : 'payment'}">$${Math.abs(t.amount).toFixed(2)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="4" style="text-align: right;">TOTAL:</td>
                <td class="${data.reduce((sum, t) => sum + t.amount, 0) >= 0 ? 'payment' : 'expense'}">$${Math.abs(data.reduce((sum, t) => sum + t.amount, 0)).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="summary">
            <div class="summary-item">
              <span>Total Expenses:</span>
              <span class="expense">$${Math.abs(data.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)).toFixed(2)}</span>
            </div>
            <div class="summary-item">
              <span>Total Payments:</span>
              <span class="payment">$${data.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</span>
            </div>
            <div class="summary-item">
              <span>Net:</span>
              <span class="${data.reduce((sum, t) => sum + t.amount, 0) >= 0 ? 'payment' : 'expense'}">$${data.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</span>
            </div>
          </div>
        </body>
      </html>
    `;

    // Open in new window and print to PDF
    const printWindow = window.open('', '', 'width=900,height=600');
    printWindow.document.write(tableHTML);
    printWindow.document.close();
    
    // Trigger print dialog
    setTimeout(() => {
      printWindow.print();
      // Close window after a short delay to let print dialog open
      setTimeout(() => {
        printWindow.close();
      }, 100);
    }, 250);
  };

  // Excel Export Function
  const exportToExcel = (data) => {
    if (data.length === 0) {
      alert('No transactions to export');
      return;
    }

    // Prepare data for Excel
    const excelData = data.map(t => ({
      'Date': new Date(t.date).toLocaleDateString(),
      'Description': t.description,
      'Category': t.category,
      'Type': t.type,
      'Amount': Math.abs(t.amount).toFixed(2)
    }));

    // Add summary rows
    const totalExpenses = Math.abs(data.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)).toFixed(2);
    const totalPayments = data.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0).toFixed(2);
    const netAmount = data.reduce((sum, t) => sum + t.amount, 0).toFixed(2);

    excelData.push({});
    excelData.push({
      'Date': 'SUMMARY',
      'Description': '',
      'Category': '',
      'Type': '',
      'Amount': ''
    });
    excelData.push({
      'Date': 'Total Expenses',
      'Description': totalExpenses,
      'Category': '',
      'Type': '',
      'Amount': ''
    });
    excelData.push({
      'Date': 'Total Payments',
      'Description': totalPayments,
      'Category': '',
      'Type': '',
      'Amount': ''
    });
    excelData.push({
      'Date': 'Net Balance',
      'Description': netAmount,
      'Category': '',
      'Type': '',
      'Amount': ''
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 25 },
      { wch: 15 },
      { wch: 12 },
      { wch: 15 }
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

    // Generate filename with property name and date range
    const propertyName = propertyDetails?.propertyName || 'Transactions';
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `${propertyName}_${dateStr}.xlsx`;

    // Write the file
    XLSX.writeFile(workbook, filename);
  };
  
  const [transactions, setTransactions] = useState(Array.isArray(initialData) ? initialData : []);
  const [mileageData, setMileageData] = useState([]);

  // Get unique categories
  const categories = [...new Set(transactions.map(t => t.category))];

  // Apply filters - EXCLUDE mileage entries
  const filteredTransactions = transactions.filter(t => {
    if (t.type === 'Mileage') return false; // Exclude mileage from transactions table
    if (filters.dateFrom && t.date < filters.dateFrom) return false;
    if (filters.dateTo && t.date > filters.dateTo) return false;
    if (filters.category && t.category !== filters.category) return false;
    
    return true;
  });

  // Filter mileage entries by date range
  const filteredMileage = mileageData.filter(t => {
    // Handle placeholder dates (0001-01-01) - always show them
    if (t.date === '0001-01-01') return true;
    
    if (mileageFilters.dateFrom && t.date < mileageFilters.dateFrom) return false;
    if (mileageFilters.dateTo && t.date > mileageFilters.dateTo) return false;
    
    return true;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      category: ''
    });
  };

  const handleMileageFilterChange = (e) => {
    const { name, value } = e.target;
    setMileageFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearMileageFilters = () => {
    setMileageFilters({
      dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      dateTo: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
    });
  };

  const getMileageRecordId = (record) => {
    return (
      record?.id ??
      record?.mileageId ??
      record?.mileageID ??
      record?.mileageRecordId ??
      record?.MileageRecordId ??
      record?.Id
    );
  };

  const fetchMileageData = async () => {
    if (!propertyDetails?.id) return;

    try {
      const token = localStorage.getItem('token');
      const mileages = await getMileage({ token, propertyId: propertyDetails.id });

      const mileageTransactions = (mileages || []).map((m, index) => ({
        id: getMileageRecordId(m) ?? `mileage_${index}`,
        date: m.date,
        description: m.description,
        mileage: m.mileage,
        type: 'Mileage',
        category: 'Mileage',
        amount: 0
      }));

      setMileageData(mileageTransactions);
    } catch (error) {
      console.error('Error fetching mileage:', error);
    }
  };

  // Handle delete transaction
  const handleDeleteTransaction = async (transactionId) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        const token = localStorage.getItem('token');
        await deleteTransaction({ token, id: transactionId });
        
        // Remove from transactions state
        setTransactions(transactions.filter(t => t.id !== transactionId));
        alert('Transaction deleted successfully');
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction');
      }
    }
  };

  const handleDeleteMileage = async (mileageId) => {
    try {
      const parsedMileageId = parseInt(mileageId, 10);
      if (Number.isNaN(parsedMileageId) || parsedMileageId <= 0) {
        console.warn('Mileage entry does not have a valid server ID yet. Refresh mileage data and try again.');
        return;
      }

      const token = localStorage.getItem('token');
      await deleteMileage({ token, mileageId: parsedMileageId });

      setMileageData((prev) => prev.filter((m) => parseInt(m.id, 10) !== parsedMileageId));
    } catch (error) {
      console.error('Error deleting mileage:', error);
    }
  };

  // Handle saving new transaction
  const handleSaveTransaction = async (newTx) => {
    try {
      const token = localStorage.getItem('token');
      
      // Save expense/payment to API
      const expenseData = {
        description: newTx.description,
        amount: Math.abs(newTx.amount),
        date: newTx.date,
        category: newTx.category,
        propertyId: parseInt(propertyDetails?.id || propertyDetails?.propertyId || 0, 10)
      };
      
      await createExpense({ token, expenseData });
      
      // Add to transactions state
      setTransactions([newTx, ...transactions]);
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Failed to save transaction');
    }
  };

  const handleSaveMileage = async (newMileage) => {
    try {
      const token = localStorage.getItem('token');
      
      const mileageEntry = {
        date: newMileage.date,
        mileage: parseFloat(newMileage.mileage),
        description: newMileage.description,
        propertyId: parseInt(propertyDetails?.id || 0)
      };
      
      await addMileage({ token, mileageData: mileageEntry });
      await fetchMileageData();
    } catch (error) {
      console.error('Error saving mileage:', error);
      alert('Failed to save mileage entry');
    }
  };

  // Fetch mileage when component mounts or property changes
  useEffect(() => {
    fetchMileageData();
  }, [propertyDetails?.id]);

  return (
    <div>
      {!isMileageOnly && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          {/* HEADER SECTION */}
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Financial Ledger</h2>
              <p className="text-gray-500 text-sm">Track every dollar flowing through your properties.</p>
                </div>
            <button 
              onClick={() => setShowModal(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '16px',
            fontWeight: 'bold',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              <Plus size={20} /> Add Transaction
            </button>
          </div>

          {/* FILTER BAR */}
          <div className="px-8 py-4 bg-gray-50/50">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h3 className="text-sm font-bold text-gray-700">Filters</h3>
              <div className="flex items-center gap-2 flex-wrap">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              <Filter size={14} /> {showFilters ? 'Hide' : 'Show'}
            </button>

            <button 
              onClick={() => exportToPDF(filteredTransactions)}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            >
              PDF
            </button>

            <button 
              onClick={() => exportToExcel(filteredTransactions)}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              Excel
            </button>

            <button 
              style={{
                backgroundColor: '#8b5cf6',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
            >
              Taxes
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Date From */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">From Date</label>
              <div className="relative">
                <DatePicker
                  selected={filters.dateFrom ? new Date(filters.dateFrom) : null}
                  onChange={(date) => handleFilterChange({ 
                    target: { name: 'dateFrom', value: date ? date.toISOString().split('T')[0] : '' }
                  })}
                  dateFormat="MMM dd, yyyy"
                  placeholderText="Select start date"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-900"
                />
              </div>
            </div>

            {/* Date To */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">To Date</label>
              <div className="relative">
                <DatePicker
                  selected={filters.dateTo ? new Date(filters.dateTo) : null}
                  onChange={(date) => handleFilterChange({ 
                    target: { name: 'dateTo', value: date ? date.toISOString().split('T')[0] : '' }
                  })}
                  dateFormat="MMM dd, yyyy"
                  placeholderText="Select end date"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-900"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">Category</label>
              <select 
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-900"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {(filters.dateFrom || filters.dateTo || filters.category) && (
          <button 
            onClick={clearFilters}
            className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-700 underline"
          >
            Clear All Filters
          </button>
        )}
        </div>

        {/* TABLE - DESKTOP VIEW */}
        <div className="hidden md:block overflow-x-auto">
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
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-4 text-sm text-gray-600">{t.date}</td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${t.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {t.amount > 0 ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
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
                    <button 
                      onClick={() => handleDeleteTransaction(t.id)}
                      style={{
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-8 py-12 text-center text-gray-500">
                  No transactions found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>

        {/* CARD VIEW - MOBILE */}
        <div className="md:hidden p-4 space-y-3">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((t) => (
            <div key={t.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg flex-shrink-0 ${t.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {t.amount > 0 ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{t.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{t.date}</p>
                  </div>
                </div>
                <button 
                  style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-white text-gray-600 rounded-full text-xs font-bold border border-gray-200">
                  {t.category}
                </span>
                <span className={`text-right font-bold text-sm ${t.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                  {t.amount > 0 ? `+ $${t.amount.toFixed(2)}` : `- $${Math.abs(t.amount).toFixed(2)}`}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-gray-500">
            No transactions found matching your filters
          </div>
        )}
        </div>
        </div>
      )}

      {/* MILEAGE TABLE - DESKTOP VIEW */}
      {isMileageOnly && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* HEADER SECTION */}
          <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900">Mileage Log</h2>
              <p className="text-gray-500 text-sm">Track vehicle mileage for tax deductions.</p>
            </div>
            <button 
              onClick={() => setShowMileageModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '16px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              <Plus size={20} /> Add Mileage
            </button>
          </div>

          {/* FILTER BAR */}
          <div className="px-8 py-4 bg-gray-50/50">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h3 className="text-sm font-bold text-gray-700">Filters</h3>
            <div className="flex items-center gap-3">
              {(mileageFilters.dateFrom !== new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0] || 
                mileageFilters.dateTo !== new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]) && (
                <button 
                  onClick={clearMileageFilters}
                  style={{
                    backgroundColor: '#6366f1',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#4f46e5'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#6366f1'}
                >
                  Reset to Current Month
                </button>
              )}
              <button
                onClick={() => setShowMileageFilters(!showMileageFilters)}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
              >
                <Filter size={14} /> {showMileageFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>
          </div>

          {showMileageFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mileage Date From */}
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">From Date</label>
                <DatePicker
                  selected={mileageFilters.dateFrom ? new Date(mileageFilters.dateFrom) : null}
                  onChange={(date) => handleMileageFilterChange({ 
                    target: { name: 'dateFrom', value: date ? date.toISOString().split('T')[0] : '' }
                  })}
                  dateFormat="MMM dd, yyyy"
                  placeholderText="Select start date"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-900"
                />
              </div>

              {/* Mileage Date To */}
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">To Date</label>
                <DatePicker
                  selected={mileageFilters.dateTo ? new Date(mileageFilters.dateTo) : null}
                  onChange={(date) => handleMileageFilterChange({ 
                    target: { name: 'dateTo', value: date ? date.toISOString().split('T')[0] : '' }
                  })}
                  dateFormat="MMM dd, yyyy"
                  placeholderText="Select end date"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm text-gray-900"
                />
              </div>
            </div>
          )}
        </div>

        {/* MILEAGE TABLE */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="px-8 py-4 font-bold">Date</th>
                <th className="px-8 py-4 font-bold">Description</th>
                <th className="px-8 py-4 font-bold text-right">Mileage (Miles)</th>
                <th className="px-8 py-4 font-bold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredMileage.length > 0 ? (
                filteredMileage.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-8 py-4 text-sm text-gray-600">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="px-8 py-4">
                      <span className="font-bold text-gray-900">{t.description}</span>
                    </td>
                    <td className="px-8 py-4 text-right font-bold text-blue-600">{t.mileage || '0'} miles</td>
                    <td className="px-8 py-4 text-center">
                      <button 
                        onClick={() => handleDeleteMileage(t.id)}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-12 text-center text-gray-500">
                    No mileage entries recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MILEAGE TABLE - MOBILE VIEW */}
        <div className="md:hidden space-y-3">
          {filteredMileage.length > 0 ? (
            filteredMileage.map((t) => (
              <div key={t.id} className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">{t.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                    {t.mileage || '0'} miles
                  </span>
                  <button 
                    onClick={() => handleDeleteMileage(t.id)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100">
              No mileage entries recorded yet
            </div>
          )}
        </div>
        </div>
      )}

      {/* ADD TRANSACTION MODAL */}
      {showModal && (
        <TransactionModal 
          onClose={() => setShowModal(false)} 
          onSave={handleSaveTransaction}
        />
      )}

      {showMileageModal && (
        <MileageModal 
          onClose={() => setShowMileageModal(false)} 
          onSave={handleSaveMileage}
        />
      )}
    </div>
  );
  
};


export default Transactions;