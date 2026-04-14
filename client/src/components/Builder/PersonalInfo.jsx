import React from 'react';
import { useResume } from '../../hooks/useResume';
import { User } from 'lucide-react';

const PersonalInfo = () => {
  const { resumeData, updateResumeData } = useResume();
  const { personalInfo } = resumeData;

  const handleChange = (e) => {
    updateResumeData('personalInfo', { ...personalInfo, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 relative overflow-hidden mb-10">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-blue-600/20 p-2 rounded-xl">
          <User className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Personal Information</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[
          { label: 'Full Name', name: 'name', placeholder: 'John Doe', type: 'text' },
          { label: 'Email', name: 'email', placeholder: 'john@example.com', type: 'email' },
          { label: 'Phone', name: 'phone', placeholder: '(555) 000-0000', type: 'text' },
          { label: 'Location', name: 'location', placeholder: 'City, Country', type: 'text' },
          { label: 'LinkedIn', name: 'linkedin', placeholder: 'linkedin.com/in/username', type: 'text' },
          { label: 'GitHub', name: 'github', placeholder: 'github.com/username', type: 'text' },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 ml-1">{field.label}</label>
            <input 
              type={field.type}
              name={field.name}
              value={personalInfo[field.name] || ''}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-700 text-sm font-medium"
              placeholder={field.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalInfo;
