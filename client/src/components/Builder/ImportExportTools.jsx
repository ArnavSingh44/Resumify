import React, { useRef } from 'react';
import { Download, Upload, FileJson } from 'lucide-react';
import { useResume } from '../../hooks/useResume';

const ImportExportTools = () => {
  const { resumeData, setResumeData } = useResume();
  const fileInputRef = useRef(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `resume-${resumeData.personalInfo?.name || 'data'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!window.confirm('Importing will overwrite your current resume data. Are you sure?')) {
      e.target.value = ''; // Reset input
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        // Basic validation: check for a key indicator
        if (json.personalInfo) {
          setResumeData(json);
          alert('Resume data imported successfully!');
        } else {
          alert('Invalid resume data format.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <div className="flex items-center space-x-3">
      <button
        onClick={handleExport}
        className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 hover:border-white/10 shadow-xl shadow-black/20 group"
        title="Download raw data as JSON"
      >
        <Download className="w-3.5 h-3.5 mr-2 group-hover:-translate-y-0.5 transition-transform" /> Export
      </button>
      
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all bg-white/5 px-4 py-2.5 rounded-xl border border-white/5 hover:border-white/10 shadow-xl shadow-black/20 group"
        title="Upload raw data JSON"
      >
        <Upload className="w-3.5 h-3.5 mr-2 group-hover:translate-y-0.5 transition-transform" /> Import
      </button>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImport} 
        className="hidden" 
        accept=".json"
      />
    </div>
  );
};

export default ImportExportTools;
