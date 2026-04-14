import React from 'react';
import { useResume } from '../../hooks/useResume';
import { Palette, Type } from 'lucide-react';

const COLORS = [
  { id: 'blue', value: '#2563eb', name: 'Modern Blue' },
  { id: 'emerald', value: '#10b981', name: 'Emerald' },
  { id: 'rose', value: '#e11d48', name: 'Bordeaux' },
  { id: 'slate', value: '#475569', name: 'Slate' },
  { id: 'indigo', value: '#4f46e5', name: 'Indigo' },
  { id: 'amber', value: '#d97706', name: 'Gold' },
];

const FONTS = [
  { id: 'sans', name: 'Sans (Modern)', value: 'font-sans' },
  { id: 'serif', name: 'Serif (Classic)', value: 'font-serif' },
  { id: 'mono', name: 'Mono (Technical)', value: 'font-mono' },
];

const StyleControls = () => {
  const { resumeData, updateResumeData } = useResume();

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 relative overflow-hidden h-full">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-blue-600/20 p-2 rounded-xl">
          <Palette className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">Design System</h3>
      </div>
      
      <div className="space-y-8">
        {/* Color Section */}
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 ml-1">Brand Identity</label>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => {
              const isSelected = resumeData.themeColor === color.value;
              return (
                <button
                  key={color.id}
                  onClick={() => updateResumeData('themeColor', color.value)}
                  className={`w-10 h-10 rounded-2xl border-2 transition-all flex items-center justify-center relative group ${
                    isSelected ? 'border-white/50 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {isSelected && (
                    <div className="absolute inset-0 border-2 border-white/20 rounded-2xl"></div>
                  )}
                  <div className={`w-1.5 h-1.5 bg-white rounded-full transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                </button>
              );
            })}
            <div className="relative group">
              <input 
                type="color" 
                value={resumeData.themeColor || '#2563eb'}
                onChange={(e) => updateResumeData('themeColor', e.target.value)}
                className="w-10 h-10 rounded-2xl border-2 border-white/10 bg-white/5 cursor-pointer p-0 overflow-hidden"
                title="Custom Color"
              />
            </div>
          </div>
        </div>

        {/* Font Section */}
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 ml-1">Typography</label>
          <div className="grid grid-cols-3 gap-3">
            {FONTS.map((font) => {
              const isSelected = resumeData.fontFamily === font.id;
              return (
                <button
                  key={font.id}
                  onClick={() => updateResumeData('fontFamily', font.id)}
                  className={`py-3 px-2 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400 shadow-lg shadow-blue-500/10' 
                      : 'border-white/5 bg-white/5 text-gray-500 hover:border-white/20 hover:text-white'
                  } ${font.value}`}
                >
                  {font.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleControls;
