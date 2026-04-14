import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axios';
import { 
    ModernTemplate, 
    ClassicTemplate, 
    MinimalistTemplate, 
    ExecutiveTemplate 
} from '../components/Preview/ResumePreview';
import { Download, Share2, Loader2, AlertCircle } from 'lucide-react';

const PublicResume = () => {
  const { publicId } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicResume = async () => {
      try {
        const response = await axios.get(`/resumes/public/${publicId}`);
        // The backend returns the whole resume object
        setResumeData(response.data);
      } catch (err) {
        setError(err.response?.data?.msg || 'Could not find this resume.');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicResume();
  }, [publicId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-center">
           <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
           <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Verifying Elite Link...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl">
           <AlertCircle className="w-16 h-16 text-red-500/50 mx-auto mb-6" />
           <h1 className="text-2xl font-black text-white mb-2 tracking-tighter uppercase">Access Denied</h1>
           <p className="text-gray-500 font-bold mb-8 uppercase tracking-widest text-xs leading-relaxed">{error}</p>
           <a href="/" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">Return Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] selection:bg-blue-500 selection:text-white pb-20">
      <div className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-center pointer-events-none">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 px-8 py-4 rounded-[2rem] flex items-center space-x-6 shadow-2xl pointer-events-auto">
           <div className="flex items-center space-x-3 border-r border-white/10 pr-6">
             <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center rotate-12 group hover:rotate-0 transition-transform">
               <Share2 className="w-4 h-4 text-white" />
             </div>
             <span className="text-white font-black tracking-tighter text-xl italic uppercase">Resumify<span className="text-blue-500">.</span></span>
           </div>
           
           <div className="flex items-center space-x-2">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Public View</span>
             <button 
                onClick={() => window.print()}
                className="flex items-center space-x-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white px-4 py-2 rounded-xl transition-all font-black uppercase tracking-widest text-[9px] border border-blue-500/20 hover:border-blue-500"
             >
               <Download className="w-3 h-3" />
               <span>Save PDF</span>
             </button>
           </div>
        </div>
      </div>

      <div className="pt-32 px-4 flex justify-center">
        <div className="shadow-[0_0_100px_rgba(59,130,246,0.15)] rounded-[2mm] overflow-hidden transform scale-90 sm:scale-100 origin-top bg-white print:scale-100 print:m-0 print:shadow-none">
          <StaticResumeViewer resume={resumeData} />
        </div>
      </div>

      <div className="mt-12 text-center">
         <p className="text-gray-600 font-black uppercase tracking-[0.4em] text-[8px] opacity-40">Elite Placement Infrastructure by Resumify</p>
      </div>
    </div>
  );
};

const StaticResumeViewer = ({ resume }) => {
    if (!resume || !resume.data) return null;
    
    // Ensure template information is passed down correctly
    const data = {
        ...resume.data,
        template: resume.data.template || 'modern'
    };
    
    const templateId = data.template;
    
    switch(templateId) {
        case 'classic': return <ClassicTemplate data={data} />;
        case 'minimalist': return <MinimalistTemplate data={data} />;
        case 'executive': return <ExecutiveTemplate data={data} />;
        default: return <ModernTemplate data={data} />;
    }
}

export default PublicResume;
