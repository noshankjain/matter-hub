import { useState, useEffect } from 'react';
import { Lock, ShieldAlert, FileText, Trash2, Upload, ChevronDown, ChevronUp, Folder } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  size: string;
  createdAt: string;
}

interface Matter {
  id: string;
  title: string;
  documents: Document[];
}

export default function Vault() {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [matters, setMatters] = useState<Matter[]>([]);
  const [expandedMatterId, setExpandedMatterId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const CORRECT_PIN = '12345678';

  //gets the documents once vault is unlocked
  useEffect(() => {
    if (!isLocked) {
      fetchMatters();
    }
  }, [isLocked]);

  const fetchMatters = async () => {
    try {
      const res = await fetch('https://matter-hub-backend.onrender.com/api/matters');
      const data = await res.json();
      setMatters(data);
    } catch (err) {
      console.error("Failed to fetch matters", err);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === CORRECT_PIN) {
      setIsLocked(false);
      setError('');
    } else {
      setError('Invalid PIN. Access denied.');
      setPin('');
    }
  };

 const handleFileUpload = async (matterId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    try {
      const response = await fetch('https://matter-hub-backend.onrender.com/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          size: sizeInMB,
          matterId: matterId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Server Error: ${errorData.error || 'Failed to upload'}`);
        return;
      }

      await fetchMatters();
    } catch (err) {
      console.error("Failed to upload document", err);
      alert("Network error: Could not connect to the server.");
    } finally {
      setIsUploading(false);
      e.target.value = ''; // Reset the input
    }
  };
  const handleDeleteDocument = async (documentId: string) => {
    try {
      await fetch(`https://matter-hub-backend.onrender.com/api/documents/${documentId}`, {
        method: 'DELETE'
      });
      
      await fetchMatters();
    } catch (err) {
      console.error("Failed to delete document", err);
    }
  };

  const toggleMatter = (id: string) => {
    setExpandedMatterId(expandedMatterId === id ? null : id);
  };

  // locked vault screen
  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full relative">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 max-w-sm w-full text-center z-10">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-slate-700" />
          </div>
          <h2 className="text-2xl font-semibold text-slate-800 mb-2">Restricted Access</h2>
          <p className="text-sm text-slate-500 mb-6">
            Please enter your 8-digit firm PIN to access confidential documents.
          </p>
          
          <form onSubmit={handleUnlock} className="flex flex-col gap-4">
            <div>
              <input
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-center tracking-[0.5em] text-lg font-mono"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={pin.length !== 8}
              className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white px-5 py-3 rounded-lg font-medium shadow-sm transition-colors w-full flex items-center justify-center gap-2"
            >
              <ShieldAlert size={18} />
              Unlock Vault
            </button>
          </form>
        </div>
      </div>
    );
  }

  //Unlocked Vault Screen
  return (
    <div className="h-full flex flex-col p-2 animate-in fade-in duration-500 overflow-hidden">
      <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm font-medium mb-6 flex items-center gap-2 border border-green-200 flex-shrink-0">
        <ShieldAlert size={18} /> Secure Session Active: Document Vault Unlocked
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">
        {matters.length === 0 ? (
          <p className="text-slate-500 text-center mt-10">No active matters found.</p>
        ) : (
          matters.map((matter) => (
            <div key={matter.id} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <button 
                onClick={() => toggleMatter(matter.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Folder className="text-blue-500" size={20} />
                  <span className="font-semibold text-slate-800">{matter.title}</span>
                  <span className="bg-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full">
                    {matter.documents?.length || 0} files
                  </span>
                </div>
                {expandedMatterId === matter.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
              </button>
              
              {/* Expandable Document List */}
              {expandedMatterId === matter.id && (
                <div className="p-6 border-t border-slate-200">
                  <div className="space-y-3 mb-4">
                    {!matter.documents || matter.documents.length === 0 ? (
                      <p className="text-sm text-slate-500 italic">No documents uploaded for this matter yet.</p>
                    ) : (
                      matter.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-slate-100 group">
                          <div className="flex items-center gap-3">
                            <FileText className="text-slate-400" size={18} />
                            <div>
                              <p className="text-sm font-medium text-slate-700">{doc.name}</p>
                              <p className="text-xs text-slate-500">{doc.size}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-md hover:bg-red-50"
                            title="Delete Document"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Upload Button */}
                  <div className="relative">
                    <input 
                      type="file" 
                      id={`file-upload-${matter.id}`}
                      className="hidden"
                      onChange={(e) => handleFileUpload(matter.id, e)}
                      disabled={isUploading}
                    />
                    <label 
                      htmlFor={`file-upload-${matter.id}`}
                      className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <Upload size={16} className="text-slate-500" />
                      {isUploading ? 'Uploading...' : 'Upload Document'}
                    </label>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}