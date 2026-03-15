import { useState } from 'react';
import { FolderOpen, Lock, ShieldAlert } from 'lucide-react';

export default function Vault() {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const CORRECT_PIN = '12345678';

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      setIsLocked(false);
      setError('');
    } else {
      setError('Invalid PIN. Access denied.');
      setPin('');
    }
  };

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full relative">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 max-w-sm w-full text-center z-10">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-slate-700" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Restricted Access</h2>
          <p className="text-sm text-slate-500 mb-6">
            Please enter your 8-digit firm PIN to access confidential documents.
          </p>
          
          <form onSubmit={handleUnlock} className="flex flex-col gap-4">
            <div>
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-center tracking-[0.5em] text-lg font-mono"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={pin.length !== 8}
              className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white px-5 py-3 rounded-lg font-medium shadow-sm transition-colors w-full flex items-center justify-center gap-2"
            >
              <ShieldAlert size={18} />
              Unlock Vault
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
      <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4 flex items-center gap-2 border border-green-200">
        <ShieldAlert size={16} /> Secure Session Active
      </div>
      <FolderOpen size={48} className="text-slate-300" />
      <h2 className="text-2xl font-semibold text-slate-700">Document Vault</h2>
      <p>Secure cloud storage and legal document generation coming soon.</p>
    </div>
  );
}