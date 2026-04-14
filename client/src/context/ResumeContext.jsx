import React, { createContext, useState } from 'react';

export const ResumeContext = createContext();

const initialResumeData = {
  personalInfo: { name: '', email: '', phone: '', linkedin: '', github: '', location: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  template: 'modern',
  themeColor: '#2563eb', // Default Blue-600
  fontFamily: 'sans',    // Default to Sans-Serif
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects']
};

export const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [isSaving, setIsSaving] = useState(false);

  const updateResumeData = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: typeof data === 'function' ? data(prev[section]) : data
    }));
  };

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData, updateResumeData, isSaving, setIsSaving }}>
      {children}
    </ResumeContext.Provider>
  );
};
