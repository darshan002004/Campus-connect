import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast({ type: 'error', message: 'Please provide both email and password' });
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      showToast({ type: 'success', message: `Welcome back, ${user.name}!` });

      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err) {
      showToast({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Login failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    showToast({ type: 'info', message: `Filled credentials for ${demoEmail}` });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 text-white items-center justify-center shadow-lg shadow-indigo-200 mb-2">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to CampusConnect
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Access your university event dashboard, registrations & seat management
          </p>
        </div>

        {/* Quick Demo Fill Buttons */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
            One-Click Demo Fill for Academic Evaluation
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('rahul@campusconnect.edu', 'Student@12345')}
              className="py-1.5 px-2.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:border-indigo-400 hover:text-indigo-600 text-slate-700 shadow-2xs transition flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Student (Rahul)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@campusconnect.edu', 'Admin@12345')}
              className="py-1.5 px-2.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 hover:border-violet-400 hover:text-violet-600 text-slate-700 shadow-2xs transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-violet-500" />
              <span>Admin (Dean)</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@campusconnect.edu"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          New to CampusConnect?{' '}
          <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-700">
            Register as a Student
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
