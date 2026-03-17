import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Kanban, Users, FolderOpen, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const links = [
    { name: 'Dashboard', path: '/', icon: <Kanban size={20} /> },
    { name: 'Clients Directory', path: '/clients', icon: <Users size={20} /> },
    { name: 'Document Vault', path: '/vault', icon: <FolderOpen size={20} /> },
    { name: 'Billing & Time', path: '/billing', icon: <Clock size={20} /> },
  ];

  return (
    <div 
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-slate-900 text-slate-300 flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-in-out relative`}
    >
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-slate-800 text-slate-300 hover:text-white rounded-full p-1.5 border border-slate-700 shadow-md z-10 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Logo Area */}
      <div className={`p-6 border-b border-slate-800 flex items-center h-20 ${isCollapsed ? 'justify-center px-0' : 'justify-start'}`}>
        {isCollapsed ? (
          <span className="text-2xl" title="Matter Hub">⚖️</span>
        ) : (
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2 truncate overflow-hidden whitespace-nowrap">
            Matter Hub <span className="text-xl">⚖️</span>
          </h2>
        )}
      </div>
      
      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-hidden">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            title={isCollapsed ? link.name : undefined}
            className={({ isActive }) =>
              `flex items-center px-3 py-3 rounded-lg transition-colors font-medium ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
                  : 'hover:bg-slate-800 hover:text-white border border-transparent'
              } ${isCollapsed ? 'justify-center' : 'gap-3 justify-start'}`
            }
          >
            <div className="flex-shrink-0">{link.icon}</div>
            {/* We hide the text when collapsed to prevent awkward wrapping */}
            <span className={`truncate transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100'}`}>
              {link.name}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Profile */}
      <div className={`p-4 border-t border-slate-800 text-sm text-slate-500 flex ${isCollapsed ? 'justify-center' : 'justify-start'} truncate`}>
        {isCollapsed ? (
          <span title="Logged in as Partner">👤</span>
        ) : (
          'Logged in as Partner'
        )}
      </div>
    </div>
  );
}