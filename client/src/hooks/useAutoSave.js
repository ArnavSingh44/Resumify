// c:\Arnav\Coding\web development\Resume Builder\client\src\hooks\useAutoSave.js
import { useEffect, useRef } from 'react';
import { useResume } from './useResume';
import api from '../utils/axios';

export const useAutoSave = (resumeId, delay = 2000) => {
  const { resumeData, setIsSaving } = useResume();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!resumeId) return;

    const handler = setTimeout(async () => {
      try {
        setIsSaving(true);
        await api.put(`/resumes/${resumeId}`, { data: resumeData });
      } catch (error) {
        console.error('AutoSave failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [resumeData, resumeId, delay, setIsSaving]);

  return null;
};
