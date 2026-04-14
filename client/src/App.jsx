// c:\Arnav\Coding\web development\Resume Builder\client\src\App.jsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ResumeProvider, ResumeContext } from './context/ResumeContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Builder from './components/Builder/Builder';
import ResumePreview from './components/Preview/ResumePreview';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import api from './utils/axios';
import { Download, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { useContext } from 'react';
import PublicResume from './pages/PublicResume';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const BuilderPageContent = () => {
  const { id } = useParams();
  const { setResumeData, isSaving } = useContext(ResumeContext);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false); // Mobile toggle

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get(`/resumes/${id}`);
        if (res.data && res.data.data) {
          const dbData = typeof res.data.data === 'string' ? JSON.parse(res.data.data) : res.data.data;
          setResumeData(prev => {
            const merged = { ...prev, ...dbData };
            return {
              ...merged,
              experience: Array.isArray(merged.experience) ? merged.experience : [],
              education: Array.isArray(merged.education) ? merged.education : [],
              projects: Array.isArray(merged.projects) ? merged.projects : [],
              skills: Array.isArray(merged.skills) ? merged.skills : [],
              themeColor: merged.themeColor || '#2563eb',
              fontFamily: merged.fontFamily || 'sans',
              sectionOrder: merged.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects']
            };
          });
        }
      } catch (err) {
        console.error('Failed to fetch resume', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id, setResumeData]);

  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await api.get(`/resumes/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download PDF.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#020617]">
      <div className="relative w-12 h-12 md:w-16 md:h-16">
        <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col md:flex-row h-screen overflow-hidden font-sans relative">
      {/* Sidebar / Form */}
      <div className={`w-full md:w-1/2 flex flex-col h-full bg-[#020617] border-r border-white/10 relative overflow-hidden transition-all duration-300 ${showPreview ? 'hidden md:flex' : 'flex'}`}>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-600/20 rounded-full blur-[100px]"></div>
        </div>

        <header className="backdrop-blur-md bg-white/5 border-b border-white/10 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center shrink-0 z-10">
          <div className="flex items-center space-x-3 md:space-x-6">
            <Link to="/dashboard" className="text-gray-400 hover:text-white flex items-center text-[10px] md:text-xs font-black uppercase tracking-widest transition-all hover:-translate-x-1">
              <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" /> <span className="hidden xs:inline">Back</span>
            </Link>
            
            <div className="hidden sm:flex items-center space-x-2">
              <div className="bg-blue-600 p-1 rounded-lg">
                <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
              </div>
              <span className="text-xs md:text-sm font-black tracking-tighter text-white">RESUMIFY</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
             <div className="flex items-center space-x-2 bg-white/5 px-2 md:px-3 py-1.5 rounded-full border border-white/5">
              <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isSaving ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">
                {isSaving ? 'Saving' : 'Synced'}
              </span>
            </div>

            <button 
              onClick={handleDownload}
              disabled={downloading}
              className={`flex items-center bg-blue-600 text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20 ${downloading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {downloading ? <Loader2 className="w-3 h-3 md:w-3.5 md:h-3.5 animate-spin" /> : <Download className="w-3 h-3 md:w-3.5 md:h-3.5 md:mr-2" />}
              <span className="hidden md:inline">{downloading ? 'Processing' : 'Export PDF'}</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 scroll-smooth relative z-10 custom-scrollbar">
          <Builder resumeId={id} />
        </div>
      </div>

      {/* Preview Section */}
      <div className={`fixed inset-0 z-40 bg-[#0f172a] md:relative md:flex md:w-1/2 items-start justify-center overflow-y-auto py-8 md:py-12 px-4 md:px-8 transition-all duration-300 ${showPreview ? 'flex' : 'hidden'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 pointer-events-none"></div>
        <div className="scale-[0.75] sm:scale-[0.8] lg:scale-[0.85] xl:scale-90 origin-top transition-all duration-500 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-sm mt-10 md:mt-0">
          <ResumePreview />
        </div>
        
        {/* Mobile Close Preview Button */}
        <button 
          onClick={() => setShowPreview(false)}
          className="md:hidden fixed top-6 right-6 z-50 bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-2xl shadow-2xl"
        >
           <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Floating Toggle Button (Mobile Only) */}
      {!showPreview && (
        <button 
          onClick={() => setShowPreview(true)}
          className="md:hidden fixed bottom-8 right-8 z-50 bg-blue-600 text-white flex items-center space-x-3 px-6 py-4 rounded-[2rem] shadow-2xl shadow-blue-600/40 font-black animate-bounce hover:animate-none"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-sm uppercase tracking-widest">LIVE PREVIEW</span>
        </button>
      )}
    </div>
  );
};

const BuilderPage = () => (
  <ResumeProvider>
      <BuilderPageContent />
  </ResumeProvider>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/share/:publicId" element={<PublicResume />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/builder/:id" 
            element={
              <ProtectedRoute>
                <BuilderPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
