import React from 'react';
import { useResume } from '../../hooks/useResume';
import { Layout, Check, Sparkles } from 'lucide-react';

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean & current' },
  { id: 'classic', name: 'Classic', description: 'Formal & balanced' },
  { id: 'minimalist', name: 'Minimalist', description: 'Simple & thin' },
  { id: 'executive', name: 'Executive', description: 'Premium & Formal' },
];

const TemplateSelector = () => {
  const { resumeData, updateResumeData } = useResume();

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 relative overflow-hidden h-full">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-blue-600/20 p-2 rounded-xl">
          <Layout className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Layout Engine</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {templates.map((template) => {
          const isSelected = resumeData.template === template.id;
          return (
            <button
              key={template.id}
              onClick={() => updateResumeData('template', template.id)}
              className={`relative p-5 rounded-2xl border transition-all group overflow-hidden ${
                isSelected 
                  ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                  : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 p-2">
                  <div className="bg-blue-500 text-white rounded-lg p-1 shadow-lg">
                    <Check className="w-3 h-3" />
                  </div>
                </div>
              )}
              
              <div className={`text-xs font-black uppercase tracking-widest mb-1 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`}>
                {template.name}
              </div>
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tight line-clamp-1">{template.description}</p>
              
              <div className={`absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-500 ${isSelected ? 'w-full' : 'w-0'}`}></div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
