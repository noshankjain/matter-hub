import { NavLink } from 'react-router-dom';
import { Kanban, Users, FolderOpen, Clock } from 'lucide-react';

export default function Sidebar() {
  const links = [
    { name: 'Kanban Board', path: '/', icon: <Kanban size={20} /> },
    { name: 'Clients Directory', path: '/clients', icon: <Users size={20} /> },
    { name: 'Document Vault', path: '/vault', icon: <FolderOpen size={20} /> },
    { name: 'Billing & Time', path: '/billing', icon: <Clock size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full flex-shrink-0">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          Matter Hub <span className="text-xl">⚖️</span>
        </h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                  : 'hover:bg-slate-800 hover:text-white border border-transparent'
              }`
            }
          >
            {link.icon}
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 text-sm text-slate-500">
        Logged in as Partner
      </div>
    </div>
  );
}