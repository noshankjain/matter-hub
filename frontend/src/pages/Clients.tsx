import { Users } from 'lucide-react';

export default function Clients() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
      <Users size={48} className="text-slate-300" />
      <h2 className="text-2xl font-semibold text-slate-700">Clients Directory</h2>
      <p>The client management module is currently under construction.</p>
    </div>
  );
}