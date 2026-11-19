import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registrationService, eventService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { CategoryBadge, StatusBadge } from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  CalendarCheck,
  CalendarDays,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  User,
  GraduationCap,
  Building,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  Ticket,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [registrations, setRegistrations] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cancellation modal states
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [regRes, eventRes] = await Promise.all([
        registrationService.getMyRegistrations(),
        eventService.getEvents({ limit: 4, dateFilter: 'upcoming' }),
      ]);

      if (regRes.data.success) {
        setRegistrations(regRes.data.registrations);
      }
      if (eventRes.data.success) {
        setUpcomingEvents(eventRes.data.events);
      }
    } catch (err) {
      console.error('Failed to load student dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCancelRegistration = async () => {
    if (!selectedReg) return;
    setCancelling(true);
    try {
      const res = await registrationService.cancelRegistration(selectedReg._id, 'Cancelled via student dashboard');
      if (res.data.success) {
        showToast({ type: 'info', message: 'Registration cancelled and seat released.' });
        setCancelModalOpen(false);
        setSelectedReg(null);
        fetchDashboardData();
      }
    } catch (err) {
      showToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to cancel registration',
      });
    } finally {
      setCancelling(false);
    }
  };

  const activeRegistrations = registrations.filter((r) => r.status === 'registered');
  const cancelledRegistrations = registrations.filter((r) => r.status === 'cancelled');

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">Loading your student dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Student Greeting Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-violet-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-indigo-200">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Academic Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name}!
            </h1>
            <p className="text-sm text-indigo-200 max-w-xl">
              Department of {user?.department || 'Computer Applications'} • Roll No:{' '}
              {user?.studentIdNumber || 'MCA-2026'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/events"
              className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs rounded-xl shadow-xs transition"
            >
              Browse Campus Events
            </Link>
            <Link
              to="/student/registrations"
              className="px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl transition"
            >
              View Registration History
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Active Bookings
            </p>
            <h3 className="text-2xl font-extrabold text-indigo-600 mt-1">
              {activeRegistrations.length}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Confirmed event seats</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Ticket className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Upcoming Events
            </p>
            <h3 className="text-2xl font-extrabold text-violet-600 mt-1">
              {upcomingEvents.length}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Live on college calendar</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Cancelled
            </p>
            <h3 className="text-2xl font-extrabold text-slate-600 mt-1">
              {cancelledRegistrations.length}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Released seats</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Student Profile
            </p>
            <h3 className="text-sm font-bold text-slate-800 mt-1 truncate max-w-[130px]">
              {user?.department?.split('(')[0] || 'MCA'}
            </h3>
            <Link
              to="/student/profile"
              className="text-[11px] font-semibold text-indigo-600 hover:underline"
            >
              Edit details →
            </Link>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Active Registered Events Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              My Active Event Registrations
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirmed seats reserved under your student profile
            </p>
          </div>
          <Link
            to="/student/registrations"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeRegistrations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRegistrations.map((reg) => {
              const ev = reg.eventId;
              if (!ev) return null;
              const evDate = new Date(ev.eventDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={reg._id}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CategoryBadge category={ev.category} />
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Seat Confirmed
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 line-clamp-1">{ev.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{evDate} • {ev.eventTime}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{ev.venue}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <Link
                      to={`/events/${ev._id}`}
                      className="font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      View Event Page →
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedReg(reg);
                        setCancelModalOpen(true);
                      }}
                      className="font-medium text-rose-600 hover:text-rose-800 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition"
                    >
                      Cancel Booking
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
            <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No active event registrations</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't reserved seats for any upcoming events yet. Explore open workshops and fests!
            </p>
            <Link
              to="/events"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-xs hover:bg-indigo-700 transition"
            >
              <span>Explore Events Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Recommended Events */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Trending Events On Campus
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {upcomingEvents.map((ev) => (
            <Link
              key={ev._id}
              to={`/events/${ev._id}`}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-400 transition-all flex flex-col justify-between group"
            >
              <div>
                <CategoryBadge category={ev.category} className="mb-2" />
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {ev.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{ev.venue}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {Math.max(0, ev.capacity - ev.registeredCount)} seats left
                </span>
                <span className="font-bold text-indigo-600">Register →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Registration"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to cancel your seat for{' '}
            <strong className="text-slate-900">{selectedReg?.eventId?.title}</strong>? Your seat
            will be freed immediately.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Keep Booking
            </button>
            <button
              onClick={handleCancelRegistration}
              disabled={cancelling}
              className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition flex items-center gap-1.5"
            >
              {cancelling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Yes, Cancel Registration</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentDashboard;
