import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Phone,
  Building,
  IdCard,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

const DEPARTMENTS = [
  'Master of Computer Applications (MCA)',
  'Computer Science & Engineering (CSE)',
  'Information Science & Engineering (ISE)',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication (ECE)',
  'Mechanical Engineering',
  'Master of Business Administration (MBA)',
  'Civil Engineering',
];

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Master of Computer Applications (MCA)',
    phone: '',
    studentIdNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast({ type: 'error', message: 'Passwords do not match' });
      return;
    }

    if (formData.password.length < 6) {
      showToast({ type: 'error', message: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    try {
      const user = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        phone: formData.phone,
        studentIdNumber: formData.studentIdNumber,
      });

      showToast({
        type: 'success',
        message: `Welcome to CampusConnect, ${user.name}! Account created.`,
      });
      navigate('/student/dashboard', { replace: true });
    } catch (err) {
      showToast({
        type: 'error',
        message: err.response?.data?.message || err.message || 'Registration failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 text-white items-center justify-center shadow-lg shadow-indigo-200 mb-2">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Registration
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Create your student profile to register for campus fests, hackathons and tech seminars
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                College Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@campusconnect.edu"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Department & Student Roll No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department / Program <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Student ID / USN Roll No
              </label>
              <div className="relative">
                <IdCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="studentIdNumber"
                  value={formData.studentIdNumber}
                  onChange={handleChange}
                  placeholder="e.g. MCA2024045"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-type password"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-1">
            Note: By policy, students register with standard student privileges. Administrative accounts
            are provisioned exclusively through authorized campus directory configuration.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-bold rounded-xl shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Student Account...</span>
              </>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-700">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
