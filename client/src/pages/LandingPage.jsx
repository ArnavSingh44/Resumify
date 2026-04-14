import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FileText, Sparkles, Layout, Download, Zap, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-blue-500/30 font-sans overflow-x-hidden">
      {/* Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center backdrop-blur-md bg-white/5 border border-white/10 px-4 md:px-6 py-3 rounded-full shadow-2xl">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-lg md:text-xl font-black tracking-tighter">RESUMIFY</span>
          </div>
          
          <div className="flex items-center space-x-3 md:space-x-6">
            {user ? (
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-[10px] md:text-sm font-bold text-gray-400 hover:text-white transition-colors">Log In</button>
                <button 
                  onClick={() => navigate('/register')}
                  className="bg-white text-black hover:bg-blue-50 px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-bold transition-all hover:scale-105 active:scale-95"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 md:pt-48 pb-10 md:pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3 md:px-4 py-1.5 rounded-full mb-6 md:mb-8 animate-bounce">
            <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400" />
            <span className="text-[9px] md:text-xs font-bold text-blue-400 uppercase tracking-widest">Next-Gen Resume Platform</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-6 md:mb-8">
            CRAFT YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600">
              ELITE NARRATIVE
            </span>
          </h1>
          
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
            Revolutionize your career search with intelligent formatting, premium themes, and industrial-grade design controls.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg px-8 md:px-10 py-4 md:py-5 rounded-2xl font-black shadow-2xl shadow-blue-600/40 transition-all hover:-translate-y-1 hover:scale-105 whitespace-nowrap"
            >
              BUILD YOUR RESUME
            </button>
            <div className="flex items-center -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#020617] bg-gray-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="user" />
                </div>
              ))}
              <span className="ml-4 md:ml-6 text-xs font-bold text-gray-500 tracking-wide underline underline-offset-4 decoration-blue-500">10k+ users choice</span>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { 
              icon: <Layout className="w-5 h-5 md:w-6 md:h-6" />, 
              title: "Premium Themes", 
              desc: "Engineered templates that pass ATS scans and captivate recruiters instantly." 
            },
            { 
              icon: <Zap className="w-5 h-5 md:w-6 md:h-6" />, 
              title: "Auto-Save", 
              desc: "State-of-the-art persistence ensures you never lose progress while building." 
            },
            { 
              icon: <Download className="w-5 h-5 md:w-6 md:h-6" />, 
              title: "Export Control", 
              desc: "Generate high-fidelity, industrial-grade PDFs in one click." 
            }
          ].map((f, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-3xl hover:bg-white/10 transition-all group hover:-translate-y-2">
              <div className="bg-blue-600/20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl mb-6 group-hover:bg-blue-600 transition-colors">
                <div className="text-blue-500 group-hover:text-white transition-colors">{f.icon}</div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-4">{f.title}</h3>
              <p className="text-sm md:text-gray-400 leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-20 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600/80 to-purple-700/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <h2 className="text-3xl md:text-6xl font-black mb-6 md:mb-8 leading-tight">READY TO LAND <br /> THE DREAM ROLE?</h2>
          <button 
            onClick={() => navigate(user ? '/dashboard' : '/register')}
            className="w-full md:w-auto bg-white text-black text-lg md:text-xl px-10 md:px-12 py-4 md:py-5 rounded-full font-black hover:scale-105 transition-transform"
          >
            GET STARTED
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 md:py-12 px-6 border-t border-white/10 text-center">
        <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest">&copy; 2026 Resumify. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
