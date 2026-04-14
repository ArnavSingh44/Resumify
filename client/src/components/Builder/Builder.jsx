import React from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import TemplateSelector from './TemplateSelector';
import StyleControls from './StyleControls';
import PersonalInfo from './PersonalInfo';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import Projects from './Projects';
import SortableSection from './SortableSection';
import ATSScanner from './ATSScanner';
import ImportExportTools from './ImportExportTools';
import { useAutoSave } from '../../hooks/useAutoSave';
import { useResume } from '../../hooks/useResume';
import { Sparkles, Plus, Layout } from 'lucide-react';

const Builder = ({ resumeId }) => {
  useAutoSave(resumeId);
  const { resumeData, updateResumeData } = useResume();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = resumeData.sectionOrder.indexOf(active.id);
      const newIndex = resumeData.sectionOrder.indexOf(over.id);
      updateResumeData('sectionOrder', arrayMove(resumeData.sectionOrder, oldIndex, newIndex));
    }
  };

  const handleAddCustomSection = () => {
    const sectionName = window.prompt('Enter section name (e.g., Certifications, Languages):');
    if (!sectionName) return;
    
    const sectionId = sectionName.toLowerCase().replace(/\s+/g, '_');
    if (resumeData.sectionOrder.includes(sectionId)) {
        alert('Section already exists');
        return;
    }

    updateResumeData('sectionOrder', [...resumeData.sectionOrder, sectionId]);
    updateResumeData(sectionId, { title: sectionName, items: [] });
  };

  const handleRemoveSection = (sectionId) => {
    if (!window.confirm(`Are you sure you want to remove the "${sectionId}" section?`)) return;
    updateResumeData('sectionOrder', resumeData.sectionOrder.filter(id => id !== sectionId));
  };

  const renderCustomSection = (sectionId) => {
    const section = resumeData[sectionId] || { title: sectionId, items: [] };
    
    const addItem = () => {
        updateResumeData(sectionId, {
            ...section,
            items: [...(section.items || []), { title: '', detail: '' }]
        });
    };

    const updateItem = (index, field, value) => {
        const newItems = [...section.items];
        newItems[index] = { ...newItems[index], [field]: value };
        updateResumeData(sectionId, { ...section, items: newItems });
    };

    const removeItem = (index) => {
        const newItems = section.items.filter((_, i) => i !== index);
        updateResumeData(sectionId, { ...section, items: newItems });
    };

    return (
      <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-gray-400">{section.title}</h3>
        <div className="space-y-4">
            {section.items.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <input 
                        type="text" value={item.title} onChange={(e) => updateItem(idx, 'title', e.target.value)}
                        placeholder="Title (e.g. AWS Certified)"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-blue-500"
                    />
                    <input 
                        type="text" value={item.detail} onChange={(e) => updateItem(idx, 'detail', e.target.value)}
                        placeholder="Detail (e.g. Oct 2023)"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-blue-500"
                    />
                    <button onClick={() => removeItem(idx)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Plus className="w-4 h-4 rotate-45" />
                    </button>
                </div>
            ))}
            <button 
                onClick={addItem}
                className="w-full py-3 border border-dashed border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-400 hover:border-blue-400/50 transition-all"
            >
                + Add Item to {section.title}
            </button>
        </div>
      </div>
    );
  };

  const sectionComponents = {
    summary: (
      <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-gray-400">Professional Summary</h3>
        <textarea 
          value={resumeData.summary || ''} 
          onChange={(e) => updateResumeData('summary', e.target.value)}
          rows={5}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-600 font-medium leading-relaxed"
          placeholder="A brief overview of your professional background and goals..."
        />
      </div>
    ),
    experience: <Experience />,
    education: <Education />,
    skills: <Skills />,
    projects: <Projects />,
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 lg:p-8 space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">RESUME EDITOR</h1>
          <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-[10px]">Crafting Your Elite Narrative</p>
        </div>
        <ImportExportTools />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TemplateSelector />
        <StyleControls />
      </div>
      
      <PersonalInfo />
      
      <ATSScanner />

      <div className="space-y-10">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={resumeData.sectionOrder}
            strategy={verticalListSortingStrategy}
          >
            {resumeData.sectionOrder.map((sectionId) => (
              <SortableSection 
                key={sectionId} 
                id={sectionId} 
                content={sectionComponents[sectionId] || renderCustomSection(sectionId)}
                onRemove={['summary', 'experience', 'education', 'skills', 'projects'].includes(sectionId) ? null : handleRemoveSection}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="flex justify-center pt-10">
        <button 
           onClick={handleAddCustomSection}
           className="group flex items-center space-x-3 bg-white/5 border border-dashed border-white/20 px-8 py-5 rounded-[2rem] hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all duration-500 active:scale-95"
        >
           <div className="bg-blue-600/20 p-2 rounded-xl group-hover:bg-white/20">
             <Layout className="w-5 h-5 text-blue-400 group-hover:text-white" />
           </div>
           <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors">Add Custom Section</span>
        </button>
      </div>
      
      <div className="mt-16 bg-blue-600/10 p-6 rounded-[2rem] border border-blue-600/20 flex items-center justify-center">
         <div className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] flex items-center">
           <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
           Real-time auto-save active
         </div>
      </div>
    </div>
  );
};

export default Builder;
