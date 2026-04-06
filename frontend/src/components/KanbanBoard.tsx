import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { GripVertical, Briefcase, Trash2, AlertTriangle, X } from 'lucide-react';

type ColumnId = 'Intake' | 'Discovery' | 'Trial' | 'Closed';

interface Matter {
  id: string;
  title: string;
  status: string;
  client: { name: string };
}

interface ColumnData {
  id: ColumnId;
  title: string;
  matters: Matter[];
}

const emptyColumns: Record<ColumnId, ColumnData> = {
  Intake: { id: 'Intake', title: 'Intake', matters: [] },
  Discovery: { id: 'Discovery', title: 'Discovery', matters: [] },
  Trial: { id: 'Trial', title: 'Trial / Hearing', matters: [] },
  Closed: { id: 'Closed', title: 'Closed', matters: [] }
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState(emptyColumns);
  
  const [deleteTarget, setDeleteTarget] = useState<{ id: string, sourceColId: ColumnId, sourceIndex: number, title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetch('https://matter-hub-backend.onrender.com/api/matters')
      .then(res => res.json())
      .then((data: Matter[]) => {
        const newCols = {
          Intake: { ...emptyColumns.Intake, matters: [] as Matter[] },
          Discovery: { ...emptyColumns.Discovery, matters: [] as Matter[] },
          Trial: { ...emptyColumns.Trial, matters: [] as Matter[] },
          Closed: { ...emptyColumns.Closed, matters: [] as Matter[] }
        };
        
        data.forEach(matter => {
          const status = matter.status as ColumnId;
          if (newCols[status]) newCols[status].matters.push(matter);
        });
        setColumns(newCols);
      })
      .catch(err => console.error("Failed to fetch data:", err));
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return; 

    const sourceCol = columns[source.droppableId as ColumnId];
    
    if (destination.droppableId === 'Trash') {
      const matterToDelete = sourceCol.matters[source.index];
      setDeleteTarget({
        id: draggableId,
        sourceColId: sourceCol.id,
        sourceIndex: source.index,
        title: matterToDelete.title
      });
      return; // Stop here, wait for confirmation
    }

    const destCol = columns[destination.droppableId as ColumnId];
    const sourceMatters = [...sourceCol.matters];
    const destMatters = [...destCol.matters];
    const [movedMatter] = sourceMatters.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceMatters.splice(destination.index, 0, movedMatter);
      setColumns({ ...columns, [sourceCol.id]: { ...sourceCol, matters: sourceMatters } });
    } else {
      movedMatter.status = destCol.id; 
      destMatters.splice(destination.index, 0, movedMatter);
      
      setColumns({
        ...columns,
        [sourceCol.id]: { ...sourceCol, matters: sourceMatters },
        [destCol.id]: { ...destCol, matters: destMatters }
      });

      try {
        await fetch(`https://matter-hub-backend.onrender.com/api/matters/${draggableId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: destCol.id })
        });
      } catch (error) {
        console.error("Failed to update database", error);
      }
    }
  };

  // Function to permanently delete the matter after confirmation
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      await fetch(`https://matter-hub-backend.onrender.com/api/matters/${deleteTarget.id}`, {
        method: 'DELETE'
      });

      const sourceCol = columns[deleteTarget.sourceColId];
      const updatedMatters = [...sourceCol.matters];
      updatedMatters.splice(deleteTarget.sourceIndex, 1);
      
      setColumns({
        ...columns,
        [sourceCol.id]: { ...sourceCol, matters: updatedMatters }
      });
      
      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed to delete matter", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 h-full overflow-x-auto pb-4 items-start">
          {Object.values(columns).map((col) => (
            <div key={col.id} className="w-80 flex-shrink-0 bg-slate-200/50 rounded-lg flex flex-col border border-slate-200">
              <div className="p-4 font-semibold text-slate-700 border-b border-slate-200 flex justify-between items-center bg-slate-100 rounded-t-lg">
                {col.title}
                <span className="bg-white border border-slate-300 text-slate-600 text-xs px-2.5 py-0.5 rounded-full shadow-sm">
                  {col.matters.length}
                </span>
              </div>
              
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div 
                    ref={provided.innerRef} 
                    {...provided.droppableProps}
                    className={`flex-1 p-4 space-y-3 min-h-[200px] transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''} ${col.id === 'Closed' ? '' : 'rounded-b-lg'}`}
                  >
                    {col.matters.map((matter, index) => (
                      <Draggable key={matter.id} draggableId={matter.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`bg-white p-4 rounded-md border ${snapshot.isDragging ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-slate-200 shadow-sm'} flex gap-3 group hover:border-blue-300 transition-all`}
                          >
                            <div {...provided.dragHandleProps} className="text-slate-300 mt-1 cursor-grab active:cursor-grabbing group-hover:text-slate-500 transition-colors">
                              <GripVertical size={16} />
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-800 text-sm mb-1.5">{matter.title}</h4>
                              <div className="flex items-center text-xs text-slate-500 gap-1.5">
                                <Briefcase size={12} className="text-blue-500" /> {matter.client.name}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {/* The Trash Drop Zone (Only inside the Closed column) */}
              {col.id === 'Closed' && (
                <Droppable droppableId="Trash">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`m-4 mt-0 p-4 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors ${
                        snapshot.isDraggingOver 
                          ? 'bg-red-50 border-red-400 text-red-600' 
                          : 'bg-slate-100 border-slate-300 text-slate-400 hover:border-red-200 hover:text-red-400'
                      }`}
                    >
                      <Trash2 size={24} />
                      <span className="text-sm font-medium">Drag here to delete</span>
                      <div className="hidden">{provided.placeholder}</div>
                    </div>
                  )}
                </Droppable>
              )}
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden transition-all">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-red-50/50">
              <div className="flex items-center gap-2 text-red-600 font-semibold text-lg">
                <AlertTriangle size={20} />
                Confirm Deletion
              </div>
              <button 
                onClick={() => setDeleteTarget(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-slate-600 mb-6">
                Are you sure you want to permanently delete the matter <strong className="text-slate-800">"{deleteTarget.title}"</strong>? This action cannot be undone.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Matter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}