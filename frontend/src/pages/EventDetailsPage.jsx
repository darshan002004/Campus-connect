import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventService, registrationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CategoryBadge, StatusBadge } from '../components/common/Badge';
import Modal from '../components/common/Modal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Share2,
  ArrowLeft,
  Loader2,
  ShieldAlert,
  Sparkles,
  Ticket,
} from 'lucide-react';

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [userRegistration, setUserRegistration] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Load Event and check student registration status
  const loadEventData = async () => {
    try {
      const res = await eventService.getEventById(id);
      if (res.data.success) {
        setEvent(res.data.event);
      }

      // If student is logged in, check if they are already registered
      if (isAuthenticated && isStudent) {
        const regRes = await registrationService.getMyRegistrations();
        if (regRes.data.success) {
          const matching = regRes.data.registrations.find(
            (r) => r.eventId?._id === id || r.eventId === id
          );
          if (matching && matching.status === 'registered') {
            setUserRegistration(matching);
          } else {
            setUserRegistration(null);
          }
        }
      }
    } catch (err) {
      console.error('Error loading event:', err);
      showToast({ type: 'error', message: 'Failed to load event details' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventData();
  }, [id, isAuthenticated, isStudent]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    if (!isStudent) {
      showToast({ type: 'warning', message: 'Only registered students can enroll for events' });
      return;
    }

    setRegistering(true);
    try {
      const res = await registrationService.registerForEvent(id);
      if (res.data.success) {
        showToast({
          type: 'success',
          message: res.data.message || 'Seat confirmed! You are successfully registered.',
        });
        setUserRegistration(res.data.registration);
        // Refresh event data to update seat counter
        loadEventData();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to complete registration';
      showToast({ type: 'error', message: msg });
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!userRegistration) return;
    setCancelling(true);
    try {
      const res = await registrationService.cancelRegistration(
        userRegistration._id,
        cancelReason || 'Cancelled by student'
      );
      if (res.data.success) {
        showToast({
          type: 'info',
          message: 'Registration cancelled. Your reserved seat has been released.',
        });
        setUserRegistration(null);
        setCancelModalOpen(false);
        setCancelReason('');
        loadEventData();
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast({ type: 'info', message: 'Event link copied to clipboard!' });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
        <p className="text-sm text-slate-500 font-medium">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800">Event Not Found</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">
          The requested event may have been removed or does not exist.
        </p>
        <Link
          to="/events"
          className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition"
        >
          Back to Events Catalog
        </Link>
      </div>
    );
  }

  const capacity = event.capacity || 0;
  const registeredCount = event.registeredCount || 0;
  const seatsLeft = Math.max(0, capacity - registeredCount);
  const percentFilled = capacity > 0 ? Math.min(100, Math.round((registeredCount / capacity) * 100)) : 0;
  const isFull = seatsLeft === 0;

  const eventDateObj = new Date(event.eventDate);
  const formattedDate = eventDateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button and Share */}
      <div className="flex items-center justify-between">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </Link>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs transition"
        >
          <Share2 className="w-3.5 h-3.5 text-slate-500" />
          <span>Share Event</span>
        </button>
      </div>

      {/* Main Grid: Left Details & Right Action Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Banner, Info, Description (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Banner */}
          <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden bg-slate-900 shadow-md">
            <img
              src={
                event.image ||
                'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80'
              }
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

            <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3 text-white">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={event.category} />
                <StatusBadge status={event.status} />
              </div>
            </div>
          </div>

          {/* Title & Metadata Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {event.title}
              </h1>
              <p className="text-xs text-indigo-600 font-semibold mt-1">
                Organized by: {event.organizer}
              </p>
            </div>

            {/* Key Logistics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-100">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Event Date</p>
                  <p className="text-sm font-bold text-slate-800">{formattedDate}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Timing</p>
                  <p className="text-sm font-bold text-slate-800">{event.eventTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Location Venue</p>
                  <p className="text-sm font-bold text-slate-800">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Available Seats</p>
                  <p className="text-sm font-bold text-slate-800">
                    {seatsLeft} remaining of {capacity}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">About This Event</h3>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </div>

            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Tags:</span>
                {event.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Registration Card (1 col) */}
        <div className="space-y-6">
          <div className="sticky top-24 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-md space-y-6">
            <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">
              Registration Status
            </h3>

            {/* Capacity Progress Meter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Live Seat Allocation</span>
                <span className={isFull ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                  {registeredCount} / {capacity} Seats Filled ({percentFilled}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isFull
                      ? 'bg-rose-500'
                      : percentFilled > 80
                      ? 'bg-amber-500'
                      : 'bg-indigo-600'
                  }`}
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 text-right">
                {seatsLeft > 0 ? `${seatsLeft} seats currently open` : 'Venue at maximum capacity'}
              </p>
            </div>

            {/* Interactive Registration Button Logic */}
            {!isAuthenticated ? (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>College Credentials Required</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Please sign in with your student account to register for this event.
                </p>
                <Link
                  to="/login"
                  state={{ from: { pathname: `/events/${id}` } }}
                  className="w-full inline-flex items-center justify-center py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
                >
                  Sign In to Register
                </Link>
              </div>
            ) : isStudent ? (
              userRegistration ? (
                /* Already Registered View */
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>You Are Registered!</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Your seat is reserved. Please show your student ID card at the venue entrance.
                  </p>
                  <button
                    onClick={() => setCancelModalOpen(true)}
                    className="w-full py-2.5 px-4 bg-white hover:bg-rose-50 text-rose-600 text-xs font-bold rounded-xl border border-rose-200 transition"
                  >
                    Cancel Registration
                  </button>
                </div>
              ) : isFull ? (
                /* Event Full View */
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-2">
                  <ShieldAlert className="w-6 h-6 text-rose-500 mx-auto" />
                  <h4 className="text-sm font-bold text-rose-800">Registration Closed</h4>
                  <p className="text-xs text-rose-600">
                    This event has reached full seating capacity. Check back in case a seat is cancelled.
                  </p>
                </div>
              ) : event.status === 'cancelled' ? (
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-600 font-medium">
                  This event has been cancelled by the organizers.
                </div>
              ) : (
                /* Open for Registration */
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white text-sm font-bold rounded-2xl shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2"
                >
                  {registering ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming Seat...</span>
                    </>
                  ) : (
                    <>
                      <Ticket className="w-4 h-4" />
                      <span>Register for Event</span>
                    </>
                  )}
                </button>
              )
            ) : isAdmin ? (
              /* Admin View */
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Admin Actions
                </span>
                <p className="text-xs text-slate-600">
                  You are viewing this event as an Administrator.
                </p>
                <div className="space-y-2">
                  <Link
                    to={`/admin/registrations?eventId=${event._id}`}
                    className="w-full inline-flex items-center justify-center py-2 px-3 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition"
                  >
                    View Registered Students ({registeredCount})
                  </Link>
                  <Link
                    to="/admin/events"
                    className="w-full inline-flex items-center justify-center py-2 px-3 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition"
                  >
                    Edit in Event Manager
                  </Link>
                </div>
              </div>
            ) : null}

            {/* Quick Policies */}
            <div className="text-[11px] text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
              <p>• Free entry for enrolled college students.</p>
              <p>• Instant atomic seat reservation.</p>
              <p>• Cancellation permits seat release to waitlist peers.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Cancel Event Registration"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to cancel your registration for{' '}
            <strong className="text-slate-900 font-bold">{event.title}</strong>? Your reserved
            seat will immediately be released to other students.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reason for cancellation (optional):
            </label>
            <textarea
              rows={2}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g., Class schedule clash, personal emergency..."
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>

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

export default EventDetailsPage;
