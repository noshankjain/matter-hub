import { useState } from 'react';
import { Clock, DollarSign, FileText, Plus, CheckCircle2 } from 'lucide-react';

export default function Billing() {
  // Using some mock data to make the UI look alive
  const [entries] = useState([
    { id: 1, date: 'Mar 18, 2026', matter: 'TechCorp Merger', description: 'Contract review and revisions', hours: 2.5, rate: 350, status: 'Unbilled' },
    { id: 2, date: 'Mar 17, 2026', matter: 'Alpha Patent Dispute', description: 'Client meeting and strategy formulation', hours: 1.5, rate: 350, status: 'Invoiced' },
    { id: 3, date: 'Mar 15, 2026', matter: 'Smith vs. City', description: 'Deposition preparation', hours: 4.0, rate: 350, status: 'Paid' },
    { id: 4, date: 'Mar 14, 2026', matter: 'TechCorp Merger', description: 'Drafting initial term sheet', hours: 3.0, rate: 350, status: 'Unbilled' },
  ]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Billing & Time</h1>
          <p className="text-slate-500 mt-1">Track billable hours and manage client invoices.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
          <Clock size={18} /> Log Time
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 flex-shrink-0">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Unbilled Time</p>
            <h4 className="text-2xl font-bold text-slate-800">$1,925.00</h4>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Draft Invoices</p>
            <h4 className="text-2xl font-bold text-slate-800">$525.00</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-lg text-green-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Paid (This Month)</p>
            <h4 className="text-2xl font-bold text-slate-800">$1,400.00</h4>
          </div>
        </div>
      </div>

      {/* Time Entries Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Recent Time Entries</h3>
        </div>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500 bg-white">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Matter</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium text-right">Hours</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                <th className="px-6 py-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors text-sm text-slate-700">
                  <td className="px-6 py-4 whitespace-nowrap">{entry.date}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{entry.matter}</td>
                  <td className="px-6 py-4">{entry.description}</td>
                  <td className="px-6 py-4 text-right">{entry.hours}h</td>
                  <td className="px-6 py-4 text-right font-medium">${(entry.hours * entry.rate).toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      entry.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' :
                      entry.status === 'Invoiced' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      {entry.status === 'Paid' && <CheckCircle2 size={12} />}
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}