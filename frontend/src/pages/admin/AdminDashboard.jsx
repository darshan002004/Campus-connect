import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/api';
import { CategoryBadge, StatusBadge } from '../../components/common/Badge';
import EventFormModal from '../../components/admin/EventFormModal';
import {
  Users,
  Calendar,
  CalendarCheck,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  BarChart3,
  Loader2,
  Clock,
  Layers,
  Award,
} from 'lucide-react';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await adminService.getDashboardStats();
      if (res.data.success) {
        setDashboardData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">Loading administrative metrics...</p>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentRegistrations = dashboardData?.recentRegistrations || [];
  const popularEvents = dashboardData?.popularEvents || [];
  const categoryStats = dashboardData?.categoryStats || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Administrative Command Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Event Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time tracking of student registrations, department participation, and seat capacities
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
          <Link
            to="/admin/events"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition"
          >
            Manage Events
          </Link>
          <Link
            to="/admin/registrations"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition"
          >
            All Registrations
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Students
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {stats.totalStudents || 0}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Enrolled student accounts</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Events
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {stats.totalEvents || 0}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Campus event catalog</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Upcoming Events
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
              {stats.upcomingEvents || 0}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Active registration open</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Registrations
            </p>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
              {stats.totalRegistrations || 0}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Confirmed attendee seats</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Middle Grid: Category Distribution & Popular Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Breakdown (1 col) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Events by Category</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">Distribution</span>
          </div>

          <div className="space-y-3 pt-1">
            {categoryStats.map((item) => (
              <div key={item._id} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{item._id}</span>
                  <span className="text-slate-500">
                    {item.count} events ({item.totalRegistrations} registered)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{
                      width: `${Math.min(100, (item.count / (stats.totalEvents || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Events Leaderboard (2 cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Top Booked Events</span>
            </h3>
            <Link
              to="/admin/events"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View All Events →
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {popularEvents.map((ev) => {
              const cap = ev.capacity || 1;
              const reg = ev.registeredCount || 0;
              const pct = Math.min(100, Math.round((reg / cap) * 100));

              return (
                <div
                  key={ev._id}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <CategoryBadge category={ev.category} />
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{ev.title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Venue: {ev.venue} • {new Date(ev.eventDate).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="sm:w-48 space-y-1 shrink-0">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                      <span>{reg} filled</span>
                      <span>{cap} cap ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          pct >= 100 ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Registrations Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Student Registrations</h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest registrations received by the portal</p>
          </div>
          <Link
            to="/admin/registrations"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All Registrations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-6">Student Name</th>
                <th className="py-3 px-6">Department</th>
                <th className="py-3 px-6">Event</th>
                <th className="py-3 px-6">Registration Date</th>
                <th className="py-3 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentRegistrations.length > 0 ? (
                recentRegistrations.map((reg) => (
                  <tr key={reg._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-6 font-bold text-slate-900">
                      {reg.studentId?.name || 'Student'}
                      <span className="block text-[11px] font-normal text-slate-400">
                        {reg.studentId?.email}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      {reg.studentId?.department || 'General'}
                    </td>
                    <td className="py-3.5 px-6 font-medium text-slate-900">
                      {reg.eventId?.title || 'Event'}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500">
                      {new Date(reg.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-6">
                      <StatusBadge status={reg.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No registrations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Event Modal */}
      <EventFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchDashboard}
      />
    </div>
  );
};

export default AdminDashboard;
