import React, { useMemo, useState } from 'react';
import { useResume } from '../../hooks/useResume';
import { 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  BarChart3, 
  FileSearch,
  Zap,
  Briefcase
} from 'lucide-react';

const ATSScanner = () => {
  const { resumeData } = useResume();
  const [jobDescription, setJobDescription] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const analysis = useMemo(() => {
    let score = 0;
    const tips = [];
    const missing = [];

    // 1. Personal Info Check (Max 20 pts)
    const pi = resumeData.personalInfo || {};
    if (pi.name) score += 5; else tips.push('Add your full name');
    if (pi.email) score += 5; else tips.push('Email is required for ATS contact');
    if (pi.phone) score += 5;
    if (pi.location) score += 5;

    // 2. Structural Health (Max 30 pts)
    const sections = resumeData.sectionOrder || [];
    if (sections.includes('summary')) score += 5;
    if (sections.includes('experience')) score += 10;
    if (sections.includes('skills')) score += 10;
    if (sections.includes('projects') || sections.includes('education')) score += 5;

    if (resumeData.experience?.length < 2) tips.push('Add at least 2 experience entries for better ranking');
    if (resumeData.skills?.length < 5) tips.push('Listing more specific skills helps ATS matching');

    // 3. Content Depth (Max 50 pts)
    let totalWords = 0;
    resumeData.experience?.forEach(exp => {
        totalWords += (exp.description || '').split(' ').length;
    });
    
    if (totalWords > 200) score += 30;
    else if (totalWords > 100) score += 15;
    else tips.push('Your experience descriptions are too short. Aim for at least 50 words per role.');

    if (resumeData.summary?.length > 100) score += 20;
    else tips.push('A stronger professional summary increases visibility.');

    // 4. Job Matching (Keywords)
    const foundKeywords = [];
    const missingKeywords = [];
    if (jobDescription) {
        // Simple keyword extraction (demo logic)
        const commonKeywords = ['React', 'Node.js', 'Python', 'Leadership', 'Management', 'Agile', 'SQL', 'AWS', 'Docker', 'API', 'Frontend', 'Backend', 'UI/UX', 'Cloud', 'Java', 'Git'];
        const jdLower = jobDescription.toLowerCase();
        const resumeText = JSON.stringify(resumeData).toLowerCase();

        commonKeywords.forEach(kw => {
            if (jdLower.includes(kw.toLowerCase())) {
                if (resumeText.includes(kw.toLowerCase())) {
                    foundKeywords.push(kw);
                } else {
                    missingKeywords.push(kw);
                }
            }
        });
    }

    return { score: Math.min(score, 100), tips, foundKeywords, missingKeywords };
  }, [resumeData, jobDescription]);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1500);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
            <div className="bg-purple-600/20 p-2 rounded-xl">
                <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">ATS Intelligence</h3>
        </div>
        
        <div className="flex items-center space-x-3">
            <div className="text-right">
                <div className="text-2xl font-black text-white leading-none">{analysis.score}%</div>
                <div className="text-[8px] font-black text-purple-400 uppercase tracking-widest mt-1">Score</div>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                <svg className="w-full h-full -rotate-90">
                    <circle 
                        cx="24" cy="24" r="20" 
                        fill="transparent" 
                        stroke="currentColor" 
                        strokeWidth="4"
                        className="text-purple-500"
                        strokeDasharray={126}
                        strokeDashoffset={126 - (126 * analysis.score) / 100}
                    />
                </svg>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tips & Healthy */}
        <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center">
                <Zap className="w-3 h-3 mr-2 text-yellow-400" /> Optimization Tips
            </h4>
            <div className="space-y-3">
                {analysis.tips.length === 0 ? (
                    <div className="flex items-center space-x-3 text-green-400 bg-green-400/5 p-4 rounded-2xl border border-green-400/10">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-wide">Resume structure is elite!</span>
                    </div>
                ) : (
                    analysis.tips.map((tip, i) => (
                        <div key={i} className="flex items-center space-x-3 text-gray-400 bg-white/5 p-4 rounded-2xl border border-white/5 group hover:border-purple-500/30 transition-all">
                            <AlertTriangle className="w-4 h-4 text-purple-400 shrink-0" />
                            <span className="text-[11px] font-medium leading-tight">{tip}</span>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* Job Matcher */}
        <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 flex items-center">
                <Briefcase className="w-3 h-3 mr-2 text-blue-400" /> Job Description Match
            </h4>
            <div className="relative group">
                <textarea 
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste job description here to find keyword gaps..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white h-40 outline-none focus:border-blue-500 transition-all placeholder:text-gray-600 font-medium resize-none"
                />
                <button 
                    onClick={handleScan}
                    className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-xl shadow-xl hover:bg-blue-500 transition-all active:scale-95"
                >
                    {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </button>
            </div>

            {jobDescription && (
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {analysis.foundKeywords.map(kw => (
                            <span key={kw} className="px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center">
                                <CheckCircle2 className="w-3 h-3 mr-1.5" /> {kw}
                            </span>
                        ))}
                        {analysis.missingKeywords.map(kw => (
                            <span key={kw} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center">
                                <XCircle className="w-3 h-3 mr-1.5" /> {kw}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
      
      <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
         <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest italic flex items-center">
            <FileSearch className="w-3 h-3 mr-2" /> Powered by Resumify ATS Engine v2.1
         </p>
         {jobDescription && (
             <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                Matches: <span className="text-green-400">{analysis.foundKeywords.length}</span> / {analysis.foundKeywords.length + analysis.missingKeywords.length}
             </div>
         )}
      </div>
    </div>
  );
};

const Loader2 = ({ className }) => <Zap className={className} />; // Fallback or imported

export default ATSScanner;
