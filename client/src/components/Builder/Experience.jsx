import React from 'react';
import { useResume } from '../../hooks/useResume';
import { Building2, Plus, Trash2, Calendar } from 'lucide-react';

const Experience = () => {
  const { resumeData, updateResumeData } = useResume();
  const experience = Array.isArray(resumeData.experience) ? resumeData.experience : [];

  const handleAdd = () => {
    updateResumeData('experience', prev => [...(Array.isArray(prev) ? prev : []), { company: '', role: '', startDate: '', endDate: '', current: false, description: '' }]);
  };

  const handleRemove = (index) => {
    updateResumeData('experience', prev => {
      const newItems = [...(prev || [])];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const handleChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    updateResumeData('experience', prev => {
      const newItems = [...(prev || [])];
      newItems[index] = { ...newItems[index], [name]: type === 'checkbox' ? checked : value };
      return newItems;
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 relative overflow-hidden mb-10">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-blue-600/20 p-2 rounded-xl">
          <Building2 className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Professional History</h3>
      </div>

      <div className="space-y-6">
        {experience.map((exp, index) => (
          <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-[1.5rem] relative group hover:bg-white/10 transition-all">
            <button 
              type="button" 
              onClick={() => handleRemove(index)}
              className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
              title="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Company</label>
                <input 
                  type="text" name="company" value={exp.company} onChange={(e) => handleChange(index, e)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 text-sm font-medium" 
                  placeholder="e.g. Acme Corp"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Role / Title</label>
                <input 
                  type="text" name="role" value={exp.role} onChange={(e) => handleChange(index, e)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 text-sm font-medium" 
                  placeholder="e.g. Lead Engineer"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Start Date</label>
                <input 
                  type="month" name="startDate" value={exp.startDate} onChange={(e) => handleChange(index, e)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-sm uppercase"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1 flex justify-between items-center px-1">
                  <span>End Date</span>
                  <label className="flex items-center space-x-2 cursor-pointer group/label">
                    <input type="checkbox" name="current" checked={exp.current} onChange={(e) => handleChange(index, e)} className="w-4 h-4 rounded-lg bg-white/5 border-white/10 text-blue-600 focus:ring-offset-0"/>
                    <span className="text-[10px] font-bold text-gray-600 group-hover/label:text-blue-400 transition-colors">CURRENT</span>
                  </label>
                </label>
                <input 
                  type="month" name="endDate" value={exp.endDate} onChange={(e) => handleChange(index, e)}
                  disabled={exp.current}
                  className={`w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-sm uppercase ${exp.current ? 'opacity-30' : ''}`}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Responsibilities</label>
                <textarea 
                  name="description" value={exp.description || ''} onChange={(e) => handleChange(index, e)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 text-sm font-medium leading-relaxed" 
                  placeholder="Describe your achievements..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        type="button"
        onClick={handleAdd}
        className="w-full mt-6 bg-blue-600/10 hover:bg-blue-600 border border-blue-600/20 text-blue-400 hover:text-white font-black py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center group"
      >
        <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> ADD EXPERIENCE
      </button>
    </div>
  );
};

export default Experience;
