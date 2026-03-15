import { FolderOpen } from 'lucide-react';

export default function Vault() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
      <FolderOpen size={48} className="text-slate-300" />
      <h2 className="text-2xl font-semibold text-slate-700">Document Vault</h2>
      <p>Secure cloud storage and legal document generation coming soon.</p>
    </div>
  );
}