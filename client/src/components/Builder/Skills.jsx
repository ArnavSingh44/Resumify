import React from 'react';
import { useResume } from '../../hooks/useResume';
import { Zap, Trash2, Plus } from 'lucide-react';

const Skills = () => {
  const { resumeData, updateResumeData } = useResume();
  const skills = Array.isArray(resumeData.skills) ? resumeData.skills : [];

  const handleAddCategory = () => {
    const newSkills = [...skills, { category: '', items: [] }];
    updateResumeData('skills', newSkills);
  };

  const handleRemoveCategory = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    updateResumeData('skills', newSkills);
  };

  const handleChange = (index, field, value) => {
    const newSkills = [...skills];
    if (field === 'items') {
      newSkills[index][field] = value.split(',').map(s => s.trimStart());
    } else {
      newSkills[index][field] = value;
    }
    updateResumeData('skills', newSkills);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 relative overflow-hidden mb-10">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600/20 p-2 rounded-xl">
            <Zap className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Skills & Expertise</h3>
        </div>
        <button 
          onClick={handleAddCategory}
          className="flex items-center text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors bg-white/5 px-4 py-2 rounded-xl border border-white/5 shadow-xl shadow-black/20"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Category
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-16 bg-white/5 border border-dashed border-white/10 rounded-3xl backdrop-blur-sm">
          <p className="text-gray-500 text-sm font-medium">No skill categories added yet.</p>
          <button 
            onClick={handleAddCategory}
            className="mt-6 text-blue-400 font-black text-xs uppercase tracking-widest hover:text-blue-300 transition-colors"
          >
            Create First Category &rarr;
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {skills.map((skillGroup, index) => (
            <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-[1.5rem] relative group hover:bg-white/10 transition-all">
              <button 
                onClick={() => handleRemoveCategory(index)}
                className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                title="Remove category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Category Name</label>
                  <input 
                    type="text"
                    value={skillGroup.category}
                    onChange={(e) => handleChange(index, 'category', e.target.value)}
                    placeholder="e.g. Frontend Architecture"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Skills (comma separated)</label>
                  <textarea 
                    value={skillGroup.items.join(', ')}
                    onChange={(e) => handleChange(index, 'items', e.target.value)}
                    placeholder="React, Vue, Webpack, Vite..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 text-sm font-medium leading-relaxed resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Skills;
