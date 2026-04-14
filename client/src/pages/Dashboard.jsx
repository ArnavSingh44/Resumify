import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { Plus, FileText, Trash2, Edit2, LogOut, Copy, Sparkles, Layout, Share2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resumes');
      setResumes(res.data);
    } catch (err) {
      console.error('Failed to fetch resumes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleCreate = async () => {
    try {
      const res = await api.post('/resumes', { 
        data: { 
          personalInfo: { name: user?.email ? user.email.split('@')[0] : 'New User' },
          experience: [],
          education: [],
          skills: [],
          projects: [],
          template: 'modern',
          themeColor: '#2563eb',
          fontFamily: 'sans',
          sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects']
        } 
      });
      navigate(`/builder/${res.data.id}`);
    } catch (err) {
      console.error('Failed to create resume', err);
      alert('Failed to create resume. Please check your connection or try again later.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.delete(`/resumes/${id}`);
      setResumes(resumes.filter(r => r.id !== id));
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const handleClone = async (id) => {
    try {
      const res = await api.post(`/resumes/${id}/clone`);
      setResumes([res.data, ...resumes]);
    } catch (err) {
      console.error('Failed to clone', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden relative">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center backdrop-blur-md bg-white/5 border border-white/10 px-4 md:px-6 py-3 rounded-full shadow-2xl">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-lg md:text-xl font-black tracking-tighter text-white">RESUMIFY</span>
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-6">
            <span className="text-xs md:text-sm text-gray-400 font-bold hidden sm:inline">{user?.email}</span>
            <button 
              onClick={logout}
              className="flex items-center text-[10px] md:text-sm font-black text-gray-400 hover:text-red-400 transition-colors uppercase tracking-widest"
            >
              <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2" /> <span className="hidden xs:inline">Log out</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="relative pt-24 md:pt-32 pb-10 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6 md:gap-8">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-3 md:mb-4">
              <Sparkles className="w-3 h-3 md:w-3.5 md:h-3.5 text-blue-400" />
              <span className="text-[9px] md:text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Dashboard</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">Your Resumes</h1>
            <p className="text-gray-400 mt-2 md:mt-4 text-base md:text-lg font-medium">Refine your professional narrative.</p>
          </div>
          <button 
            onClick={handleCreate}
            className="w-full md:w-auto group bg-blue-600 hover:bg-blue-700 text-white font-black px-6 md:px-8 py-3.5 md:py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center"
          >
            <Plus className="mr-2 w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform" /> CREATE NEW
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 md:py-40">
            <div className="relative w-12 h-12 md:w-16 md:h-16">
              <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
            </div>
          </div>
        ) : resumes.length === 0 ? (
          <div className="bg-white/5 border border-dashed border-white/20 rounded-[2rem] md:rounded-[3rem] p-12 md:p-24 text-center backdrop-blur-sm">
            <div className="bg-white/5 w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 border border-white/10">
              <Layout className="text-gray-500 w-6 h-6 md:w-10 md:h-10" />
            </div>
            <h3 className="text-xl md:text-3xl font-black mb-3 md:mb-4">No Resumes Found</h3>
            <p className="text-gray-400 max-w-xs md:max-w-sm mx-auto mb-8 md:mb-10 text-sm md:text-base font-medium">Start your journey by creating your first professional resume in seconds.</p>
            <button 
              onClick={handleCreate}
              className="text-blue-400 font-black hover:text-blue-300 transition-colors tracking-widest text-[10px] md:text-sm uppercase"
            >
              Start Building Now &rarr;
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {resumes.map((resume) => {
              const handleTogglePublic = async (e) => {
                e.stopPropagation();
                try {
                    const newPublicStatus = !resume.is_public;
                    const res = await api.patch(`/resumes/${resume.id}/visibility`, { isPublic: newPublicStatus });
                    setResumes(resumes.map(r => r.id === resume.id ? { ...r, is_public: res.data.is_public, public_id: res.data.public_id } : r));
                } catch (err) {
                    console.error('Failed to toggle visibility', err);
                }
              };

              const handleCopyLink = (e) => {
                e.stopPropagation();
                const shareUrl = `${window.location.origin}/share/${resume.public_id}`;
                navigator.clipboard.writeText(shareUrl);
                alert('Elite Link copied to clipboard!');
              };

              return (
                <div key={resume.id} className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden hover:bg-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-600/10">
                  <div className="p-6 md:p-8">
                    <div className="bg-white/5 h-36 md:h-44 rounded-2xl md:rounded-3xl mb-6 md:mb-8 flex items-center justify-center border border-white/5 group-hover:border-blue-500/30 transition-colors relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <FileText className="w-12 h-12 md:w-20 md:h-20 text-white/5 group-hover:text-blue-500/20 transition-all duration-700 group-hover:scale-110" />
                      
                      {/* Public Status Badge */}
                      <div className="absolute top-4 right-4">
                        <div className={`px-3 py-1.5 rounded-full backdrop-blur-md border text-[8px] font-black uppercase tracking-widest flex items-center space-x-2 ${resume.is_public ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${resume.is_public ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                           <span>{resume.is_public ? 'Public' : 'Private'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-black tracking-tight mb-2 truncate">
                      {resume.data?.personalInfo?.name || 'Untitled Resume'}
                    </h3>
                    <div className="flex justify-between items-center mb-6 md:mb-10">
                        <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">
                        Updated {new Date(resume.updated_at).toLocaleDateString()}
                        </p>
                        
                        <div className="flex items-center space-x-2">
                            {resume.is_public && (
                                <button 
                                    onClick={handleCopyLink}
                                    className="p-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                                    title="Copy Link"
                                >
                                    <Copy className="w-3.5 h-3.5" />
                                </button>
                            )}
                            <button 
                                onClick={handleTogglePublic}
                                className={`p-2 rounded-lg transition-all ${resume.is_public ? 'bg-green-600/10 text-green-400 hover:bg-green-600 hover:text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                                title={resume.is_public ? 'Make Private' : 'Make Public'}
                            >
                                <Share2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex space-x-2 md:space-x-3">
                      <button 
                        onClick={() => navigate(`/builder/${resume.id}`)}
                        className="flex-1 bg-white text-black font-black py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-blue-50 transition-all active:scale-95 text-[10px] md:text-xs tracking-widest uppercase"
                      >
                        <Edit2 className="w-3.5 h-3.5 mx-auto" />
                      </button>
                      <button 
                        onClick={() => handleClone(resume.id)}
                        className="px-4 md:px-5 bg-white/5 text-gray-400 border border-white/10 rounded-xl md:rounded-2xl hover:bg-white/10 transition-all active:scale-95 flex items-center"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(resume.id)}
                        className="px-4 md:px-5 bg-red-500/10 text-red-500 border border-red-500/10 rounded-xl md:rounded-2xl hover:bg-red-500/20 transition-all active:scale-95 flex items-center"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
