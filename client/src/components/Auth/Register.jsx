import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import api from '../../utils/axios';
import { FileText, Sparkles, UserPlus, CheckCircle } from 'lucide-react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', { email, password });
      setSuccess(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.msg ||
        err.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-blue-600 p-3 rounded-2xl mb-4 shadow-xl shadow-blue-600/20">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">RESUMIFY</h1>
          <p className="text-gray-400 font-medium">Join the next generation of builders.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">

          {/* ── Loading progress bar ── */}
          {loading && (
            <div className="absolute top-0 left-0 right-0 h-[3px] z-20 overflow-hidden rounded-t-[2.5rem]">
              <div
                className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 rounded-full"
                style={{
                  animation: 'progress-sweep 1.6s ease-in-out infinite',
                  width: '45%',
                }}
              />
            </div>
          )}

          <div className="p-8 md:p-10">
            <div className="absolute top-0 left-0 p-4 opacity-10">
              <Sparkles className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-bold mb-8 text-white">Create Account</h2>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Success flash */}
            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm font-medium flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                Account created! Taking you to your dashboard…
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center group
                  ${loading ? 'opacity-80 cursor-not-allowed scale-[0.99]' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                    CREATING ACCOUNT…
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                    CREATE ACCOUNT
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-500 font-medium">
              Already have an account?{' '}
              <a href="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-bold underline underline-offset-4">
                Sign in
              </a>
            </p>
          </div>
        </div>

        {/* Status message below the card */}
        <div className={`mt-4 text-center text-sm font-medium transition-all duration-300 ${loading ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
          <span className="text-blue-400">⏳ Setting up your account, please wait…</span>
        </div>
      </div>

      {/* Progress bar keyframe */}
      <style>{`
        @keyframes progress-sweep {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(120%); }
          100% { transform: translateX(280%); }
        }
      `}</style>
    </div>
  );
};

export default Register;
