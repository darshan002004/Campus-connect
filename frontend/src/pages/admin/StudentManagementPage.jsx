import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Search,
  Building,
  Mail,
  Phone,
  Ticket,
  Calendar,
  Loader2,
  GraduationCap,
} from 'lucide-react';

const DEPARTMENTS = [
  'All',
  'Master of Computer Applications (MCA)',
  'Computer Science & Engineering (CSE)',
  'Information Science & Engineering (ISE)',
  'Artificial Intelligence & Data Science',
  'Electronics & Communication (ECE)',
  'Mechanical Engineering',
  'Master of Business Administration (MBA)',
];

const StudentManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const { showToast } = useToast();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {
        search: search.trim() || undefined,
        department: department !== 'All' ? department : undefined,
      };

      const res = await adminService.getStudents(params);
      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.error('Failed to load students directory:', err);
      showToast({ type: 'error', message: 'Failed to load students directory' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [department]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Academic Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Enrolled Student Directory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Browse all registered college students, departmental distribution, and engagement metrics
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Total Enrolled: <span className="font-bold text-indigo-600">{students.length}</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, roll no..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700"
          >
            Find
          </button>
        </form>

        <div className="w-full sm:w-auto">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full sm:w-auto text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden cursor-pointer"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'All' ? 'All Departments' : dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Student</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Roll No / USN</th>
                <th className="py-3.5 px-6">Contact Phone</th>
                <th className="py-3.5 px-6">Active Registrations</th>
                <th className="py-3.5 px-6">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-2" />
                    <span className="text-slate-400">Loading student directory...</span>
                  </td>
                </tr>
              ) : students.length > 0 ? (
                students.map((student) => {
                  const joinDate = new Date(student.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={student._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="block font-bold">{student.name}</span>
                            <span className="block text-[11px] font-normal text-slate-400">
                              {student.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-600 font-medium">
                        {student.department || 'Computer Applications'}
                      </td>

                      <td className="py-4 px-6 font-mono text-indigo-700">
                        {student.studentIdNumber || '—'}
                      </td>

                      <td className="py-4 px-6 text-slate-500">
                        {student.phone || '—'}
                      </td>

                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          <Ticket className="w-3 h-3 text-indigo-500" />
                          <span>{student.activeRegistrations} Events</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 text-slate-400">
                        {joinDate}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No students found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentManagementPage;
