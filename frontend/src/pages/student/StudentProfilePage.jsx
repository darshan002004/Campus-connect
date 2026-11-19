import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  User,
  Mail,
  Phone,
  Building,
  IdCard,
  Lock,
  ShieldCheck,
  Save,
  Loader2,
  KeyRound,
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

const StudentProfilePage = () => {
  const { user, updateProfileState } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || 'Master of Computer Applications (MCA)',
    studentIdNumber: user?.studentIdNumber || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await authService.updateProfile(formData);
      if (res.data.success) {
        updateProfileState(res.data.user);
        showToast({ type: 'success', message: 'Profile information updated successfully' });
      }
    } catch (err) {
      showToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      showToast({ type: 'error', message: 'New passwords do not match' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast({ type: 'error', message: 'New password must be at least 6 characters' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.data.success) {
        showToast({ type: 'success', message: 'Password changed successfully' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      }
    } catch (err) {
      showToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to change password',
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Profile & Account Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your personal university profile, department affiliation, and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card Left Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center space-y-3 h-fit">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white font-bold text-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{user?.name}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wider">
            {user?.role} Account
          </span>

          <div className="w-full pt-4 border-t border-slate-100 text-left text-xs space-y-2 text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                Department
              </span>
              <span className="font-semibold">{user?.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                Student ID / USN
              </span>
              <span className="font-semibold">{user?.studentIdNumber || 'Not specified'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-semibold uppercase">
                Phone
              </span>
              <span className="font-semibold">{user?.phone || 'Not specified'}</span>
            </div>
          </div>
        </div>

        {/* Profile Edit & Password Forms Right (2 cols) */}
        <div className="md:col-span-2 space-y-8">
          {/* Personal Info Form */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" />
              <span>Personal Details</span>
            </h3>

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (University Locked)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleProfileChange}
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student ID / Roll No
                  </label>
                  <input
                    type="text"
                    name="studentIdNumber"
                    value={formData.studentIdNumber}
                    onChange={handleProfileChange}
                    placeholder="MCA2024018"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleProfileChange}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                {profileLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>

          {/* Security & Password Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-indigo-600" />
              <span>Change Security Password</span>
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    placeholder="Min 6 characters"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmNewPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })
                    }
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                {passwordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Update Password</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
