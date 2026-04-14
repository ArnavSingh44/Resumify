import React from 'react';
import { useResume } from '../../hooks/useResume';
import { Layout, Plus, Trash2 } from 'lucide-react';

const Projects = () => {
  const { resumeData, updateResumeData } = useResume();
  const projects = Array.isArray(resumeData.projects) ? resumeData.projects : [];

  const handleAdd = () => {
    updateResumeData('projects', prev => [...(Array.isArray(prev) ? prev : []), { name: '', description: '', tech: [], link: '' }]);
  };

  const handleRemove = (index) => {
    updateResumeData('projects', prev => {
      const newItems = [...(prev || [])];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    updateResumeData('projects', prev => {
      const newItems = [...(prev || [])];
      if (name === 'tech') {
        newItems[index] = { ...newItems[index], [name]: value.split(',').map(item => item.trimStart()) };
      } else {
        newItems[index] = { ...newItems[index], [name]: value };
      }
      return newItems;
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 relative overflow-hidden mb-10">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-blue-600/20 p-2 rounded-xl">
          <Layout className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Featured Projects</h3>
      </div>

      <div className="space-y-6">
        {projects.map((proj, index) => (
          <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-[1.5rem] relative group hover:bg-white/10 transition-all">
            <button 
              type="button" 
              onClick={() => handleRemove(index)}
              className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Project Name</label>
                <input 
                  type="text" name="name" value={proj.name} onChange={(e) => handleChange(index, e)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 text-sm font-medium" placeholder="e.g. E-Commerce Engine"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Project link</label>
                <input 
                  type="text" name="link" value={proj.link} onChange={(e) => handleChange(index, e)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 text-sm font-medium" placeholder="e.g. github.com/username/project"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Technologies</label>
                <input 
                  type="text" name="tech" value={(proj.tech || []).join(', ')} onChange={(e) => handleChange(index, e)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 text-sm font-medium" placeholder="React, Node.js, GraphQL..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Description</label>
                <textarea 
                  name="description" value={proj.description} onChange={(e) => handleChange(index, e)} rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 text-sm font-medium leading-relaxed" placeholder="Describe the project and your role..."
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
        <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> ADD PROJECT
      </button>
    </div>
  );
};
export default Projects;
