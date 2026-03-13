export default function Sidebar() {
  return (
    <div className="w-64 bg-slate-900 text-slate-300 min-h-screen p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-8 text-blue-400 tracking-wide">Matter Hub</h2>
      
      <nav className="flex flex-col space-y-2">
        <a href="#" className="p-3 bg-blue-600/10 text-blue-400 rounded-md font-medium border border-blue-600/20">
          Kanban Board
        </a>
        <a href="#" className="p-3 hover:bg-slate-800 hover:text-white rounded-md transition-colors">
          Clients Directory
        </a>
        <a href="#" className="p-3 hover:bg-slate-800 hover:text-white rounded-md transition-colors">
          Document Vault
        </a>
        <a href="#" className="p-3 hover:bg-slate-800 hover:text-white rounded-md transition-colors">
          Billing & Time
        </a>
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-700">
        <p className="text-sm text-slate-500">Logged in as Partner</p>
      </div>
    </div>
  );
}