import { Clock } from 'lucide-react';

export default function Billing() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
      <Clock size={48} className="text-slate-300" />
      <h2 className="text-2xl font-semibold text-slate-700">Billing & Time</h2>
      <p>Time tracking and automated invoice generation will be available here.</p>
    </div>
  );
}