import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { CategoryBadge, StatusBadge } from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  CalendarCheck,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Loader2,
  XCircle,
  CheckCircle2,
  Ticket,
  Filter,
} from 'lucide-react';

const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const { showToast } = useToast();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await registrationService.getMyRegistrations({
        status: statusFilter !== 'All' ? statusFilter : undefined,
      });
      if (res.data.success) {
        setRegistrations(res.data.registrations);
      }
    } catch (err) {
      console.error('Error fetching registrations:', err);
      showToast({ type: 'error', message: 'Failed to load your event registrations' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [statusFilter]);

  const handleCancelRegistration = async () => {
    if (!selectedReg) return;
    setCancelling(true);
    try {
      const res = await registrationService.cancelRegistration(
        selectedReg._id,
        'Cancelled by student'
      );
      if (res.data.success) {
        showToast({
          type: 'info',
          message: 'Your registration has been cancelled and seat returned.',
        });
        setCancelModalOpen(false);
        setSelectedReg(null);
        fetchRegistrations();
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <CalendarCheck className="w-4 h-4" />
            <span>Student Registration Ledger</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Event Registrations
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review your confirmed seats, past attendance, and cancel bookings if your schedule changes
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {['All', 'registered', 'cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                statusFilter === tab
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'registered' ? 'Active Bookings' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Registrations List */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
          <p className="text-xs text-slate-500 font-medium">Loading registrations...</p>
        </div>
      ) : registrations.length > 0 ? (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const ev = reg.eventId;
            if (!ev) return null;

            const isCancelled = reg.status === 'cancelled';
            const regDate = new Date(reg.registrationDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const eventDate = new Date(ev.eventDate).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={reg._id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-slate-300 p-5 sm:p-6 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left Info */}
                <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                  <img
                    src={
                      ev.image ||
                      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format&fit=crop&q=80'
                    }
                    alt={ev.title}
                    className="w-full sm:w-28 h-28 object-cover rounded-xl bg-slate-100 shrink-0"
                  />

                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <CategoryBadge category={ev.category} />
                      <StatusBadge status={reg.status} />
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {ev.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {eventDate} ({ev.eventTime})
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {ev.venue}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 pt-1">
                      Registered on {regDate} • Reference: #{reg._id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                  <Link
                    to={`/events/${ev._id}`}
                    className="px-4 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-xl transition inline-flex items-center gap-1"
                  >
                    <span>View Event Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {!isCancelled && (
                    <button
                      onClick={() => {
                        setSelectedReg(reg);
                        setCancelModalOpen(true);
                      }}
                      className="px-4 py-2 text-xs font-medium text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-xl transition"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
          <Ticket className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">
            No registrations found under "{statusFilter}"
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Discover upcoming college hackathons, fests and symposiums in the catalog.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-xs hover:bg-indigo-700 transition"
          >
            <span>Browse All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Confirm Registration Cancellation"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to cancel your seat for{' '}
            <strong className="text-slate-900 font-bold">{selectedReg?.eventId?.title}</strong>?
            This will release the seat count in the system immediately for fellow students.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Keep My Registration
            </button>
            <button
              onClick={handleCancelRegistration}
              disabled={cancelling}
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition flex items-center gap-1.5"
            >
              {cancelling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Confirm Cancellation</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyRegistrationsPage;
