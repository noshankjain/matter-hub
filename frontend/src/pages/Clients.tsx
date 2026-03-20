import { useState, useEffect } from 'react';
import { Users, Mail, Phone, Briefcase, X, Plus } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  matters: any[];
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const fetchClients = async () => {
    try {
      const res = await fetch('https://matter-hub-backend.onrender.com/api/clients');
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('https://matter-hub-backend.onrender.com/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone })
      });
      await fetchClients();
      setIsModalOpen(false);
      setName(''); setEmail(''); setPhone('');
    } catch (error) {
      console.error("Failed to create client", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header matching the dashboard */}
      <div className="flex justify-between items-center mb-8 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Clients Directory</h1>
          <p className="text-slate-500 mt-1">Manage your firm's contacts and client relationships.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
        >
          <Plus size={18} /> New Client
        </button>
      </div>

      {/* Client Grid */}
      <div className="flex-1 overflow-y-auto">
        {clients.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <Users size={48} className="text-slate-300 mb-4" />
            <p>No clients found. Add your first client to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
            {clients.map(client => (
              <div key={client.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
                  <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-semibold text-slate-800 text-lg truncate">{client.name}</h3>
                </div>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-slate-400" />
                    <span className="truncate">{client.email || 'No email provided'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} className="text-slate-400" />
                    <span>{client.phone || 'No phone provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 pt-2 mt-2 border-t border-slate-50">
                    <Briefcase size={16} className="text-slate-400" />
                    <span className="font-medium text-slate-700">{client.matters?.length || 0} Active Matters</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transition-all">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-800 font-semibold text-lg">
                <Users className="text-blue-600" size={20} /> Add New Client
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company / Full Name *</label>
                  <input type="text" autoFocus required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800" placeholder="e.g., TechCorp Inc." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800" placeholder="legal@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-slate-800" placeholder="(555) 123-4567" />
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors" disabled={isSubmitting}>Cancel</button>
                <button type="submit" disabled={!name.trim() || isSubmitting} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
                  {isSubmitting ? 'Saving...' : 'Save Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}