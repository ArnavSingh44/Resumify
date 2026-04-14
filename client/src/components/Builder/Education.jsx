import React from 'react';
import { useResume } from '../../hooks/useResume';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

const Education = () => {
  const { resumeData, updateResumeData } = useResume();
  const education = Array.isArray(resumeData.education) ? resumeData.education : [];

  const handleAdd = () => {
    updateResumeData('education', prev => [...(Array.isArray(prev) ? prev : []), { school: '', degree: '', field: '', year: '', gpa: '' }]);
  };

  const handleRemove = (index) => {
    updateResumeData('education', prev => {
      const newItems = [...(prev || [])];
      newItems.splice(index, 1);
      return newItems;
    });
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    updateResumeData('education', prev => {
      const newItems = [...(prev || [])];
      newItems[index] = { ...newItems[index], [name]: value };
      return newItems;
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 relative overflow-hidden mb-10">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-blue-600/20 p-2 rounded-xl">
          <GraduationCap className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Academic Background</h3>
      </div>

      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-[1.5rem] relative group hover:bg-white/10 transition-all">
            <button 
              type="button" 
              onClick={() => handleRemove(index)}
              className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">School / University</label>
                <input 
                  type="text" name="school" value={edu.school} onChange={(e) => handleChange(index, e)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 text-sm font-medium" placeholder="e.g. State University"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Degree</label>
                <input 
                  type="text" name="degree" value={edu.degree} onChange={(e) => handleChange(index, e)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 text-sm font-medium" placeholder="e.g. Bachelor of Science"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Field of Study</label>
                <input 
                  type="text" name="field" value={edu.field} onChange={(e) => handleChange(index, e)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 text-sm font-medium" placeholder="e.g. Computer Science"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">Year</label>
                <input 
                  type="text" name="year" value={edu.year} onChange={(e) => handleChange(index, e)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 text-sm font-medium" placeholder="e.g. 2024"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">GPA</label>
                <input 
                  type="text" name="gpa" value={edu.gpa} onChange={(e) => handleChange(index, e)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 text-sm font-medium" placeholder="e.g. 3.8/4.0"
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
        <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> ADD EDUCATION
      </button>
    </div>
  );
};
export default Education;
