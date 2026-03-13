import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard'; // <-- We import it here

function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center mb-8 flex-shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Active Matters</h1>
            <p className="text-slate-500 mt-1">Manage and track ongoing case progress.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2">
            <span>+</span> New Matter
          </button>
        </div>

        {/* The Kanban Board takes up the rest of the height */}
        <div className="flex-1 overflow-hidden">
          <KanbanBoard />
        </div>
      </main>
    </div>
  );
}

export default App;