import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';
import Clients from './pages/Clients';
import Vault from './pages/Vault';
import Billing from './pages/Billing';
import { Briefcase, X } from 'lucide-react';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMatterTitle, setNewMatterTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMatterTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('https://matter-hub-backend.onrender.com/api/matters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newMatterTitle })
      });
      window.location.reload(); 
    } catch (error) {
      console.error("Failed to create matter", error);
      setIsSubmitting(false);
    }
  };

  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar />

        <main className="flex-1 p-8 flex flex-col h-full overflow-hidden relative">
          <Routes>
            {/* Main Dashboard Route */}
            <Route path="/" element={
              <>
                <div className="flex justify-between items-center mb-8 flex-shrink-0">
                  <div>
                    <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Active Matters/Cases</h1>
                    <p className="text-slate-500 mt-1">Manage and track ongoing case progress.</p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                  >
                    <span>+</span> New Matter
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <KanbanBoard />
                </div>
              </>
            } />

            {/* Other Pages Routes */}
            <Route path="/clients" element={<Clients />} />
            <Route path="/vault" element={<Vault />} />
            <Route path="/billing" element={<Billing />} />
          </Routes>
          
          {/* The Custom Modal (Stays on top regardless of route) */}
          {isModalOpen && (
             <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transition-all">
               
               <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                 <div className="flex items-center gap-2 text-slate-800 font-semibold text-lg">
                   <Briefcase className="text-blue-600" size={20} />
                   Create New Legal Matter
                 </div>
                 <button 
                   onClick={() => setIsModalOpen(false)}
                   className="text-slate-400 hover:text-slate-600 transition-colors"
                 >
                   <X size={20} />
                 </button>
               </div>
               
               <form onSubmit={handleSubmit} className="p-6">
                 <p className="text-sm text-slate-600 mb-4">
                   Please enter a title for the new legal case. This matter will be automatically assigned to the default client.
                 </p>
                 <input
                   type="text"
                   autoFocus
                   placeholder="e.g., Contract Negotiation with Client"
                   value={newMatterTitle}
                   onChange={(e) => setNewMatterTitle(e.target.value)}
                   className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all mb-6 text-slate-800"
                   required
                 />
                 
                 <div className="flex justify-end gap-3">
                   <button
                     type="button"
                     onClick={() => setIsModalOpen(false)}
                     className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                     disabled={isSubmitting}
                   >
                     Cancel
                   </button>
                   <button
                     type="submit"
                     disabled={!newMatterTitle.trim() || isSubmitting}
                     className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                   >
                     {isSubmitting ? 'Creating...' : 'Create Matter'}
                   </button>
                 </div>
               </form>
             </div>
           </div>
          )}
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;