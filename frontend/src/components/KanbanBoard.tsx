import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { GripVertical, Briefcase } from 'lucide-react';

type ColumnId = 'Intake' | 'Discovery' | 'Trial' | 'Closed';

// 1. Updated to match exactly what your Neon database sends
interface Matter {
  id: string;
  title: string;
  status: string;
  client: {
    name: string; // The backend now joins the Client table!
  };
}

interface ColumnData {
  id: ColumnId;
  title: string;
  matters: Matter[];
}

// 2. We start with empty columns instead of dummy data
const emptyColumns: Record<ColumnId, ColumnData> = {
  Intake: { id: 'Intake', title: 'Intake', matters: [] },
  Discovery: { id: 'Discovery', title: 'Discovery', matters: [] },
  Trial: { id: 'Trial', title: 'Trial / Hearing', matters: [] },
  Closed: { id: 'Closed', title: 'Closed', matters: [] }
};

export default function KanbanBoard() {
  const [columns, setColumns] = useState(emptyColumns);

  // 3. NEW: Fetch the real data from your backend when the page loads
  useEffect(() => {
    fetch('https://matter-hub-backend.onrender.com/api/matters')
      .then(res => res.json())
      .then((data: Matter[]) => {
        // Create a fresh copy of empty columns
        const newCols = {
          Intake: { ...emptyColumns.Intake, matters: [] as Matter[] },
          Discovery: { ...emptyColumns.Discovery, matters: [] as Matter[] },
          Trial: { ...emptyColumns.Trial, matters: [] as Matter[] },
          Closed: { ...emptyColumns.Closed, matters: [] as Matter[] }
        };
        
        // Sort the database records into their correct columns
        data.forEach(matter => {
          const status = matter.status as ColumnId;
          if (newCols[status]) {
            newCols[status].matters.push(matter);
          }
        });
        
        setColumns(newCols);
      })
      .catch(err => console.error("Failed to fetch data:", err));
  }, []);

  // 4. NEW: Update the database when you drop a card
  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return; 

    const sourceCol = columns[source.droppableId as ColumnId];
    const destCol = columns[destination.droppableId as ColumnId];

    const sourceMatters = [...sourceCol.matters];
    const destMatters = [...destCol.matters];
    const [movedMatter] = sourceMatters.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      // Reordering in the same column
      sourceMatters.splice(destination.index, 0, movedMatter);
      setColumns({ ...columns, [sourceCol.id]: { ...sourceCol, matters: sourceMatters } });
    } else {
      // Moving to a new column
      movedMatter.status = destCol.id; // Update local status
      destMatters.splice(destination.index, 0, movedMatter);
      
      // Update the UI instantly so it feels perfectly smooth
      setColumns({
        ...columns,
        [sourceCol.id]: { ...sourceCol, matters: sourceMatters },
        [destCol.id]: { ...destCol, matters: destMatters }
      });

      // Background task: Tell the database to save this new status
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

  return (
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
                  className={`flex-1 p-4 space-y-3 min-h-[200px] transition-colors rounded-b-lg ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''}`}
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
                              {/* Displaying the linked Client name from the DB */}
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
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}