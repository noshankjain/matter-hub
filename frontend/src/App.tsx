import Sidebar from './components/Sidebar';
import KanbanBoard from './components/KanbanBoard';

function App() {
  const handleNewMatter = async () => {
    // A simple browser prompt to get the matter name
    const title = window.prompt("Enter the title for the new legal matter:");
    if (!title) return;

    try {
      await fetch('https://matter-hub-backend.onrender.com/api/matters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      // Refresh the page to fetch the newly created matter from the cloud
      window.location.reload(); 
    } catch (error) {
      console.error("Failed to create matter", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center mb-8 flex-shrink-0">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Active Matters</h1>
            <p className="text-slate-500 mt-1">Manage and track ongoing case progress.</p>
          </div>
          <button 
            onClick={handleNewMatter}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
          >
            <span>+</span> New Matter
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <KanbanBoard />
        </div>
      </main>
    </div>
  );
}

export default App;