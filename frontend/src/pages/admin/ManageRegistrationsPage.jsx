import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService, eventService, registrationService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { CategoryBadge, StatusBadge } from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  CalendarCheck,
  Search,
  Filter,
  Loader2,
  XCircle,
  FileSpreadsheet,
  CheckCircle,
} from 'lucide-react';

const ManageRegistrationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialEventId = searchParams.get('eventId') || 'All';

  const [registrations, setRegistrations] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [statusFilter, setStatusFilter] = useState('All');

  // Cancel modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [regToCancel, setRegToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const { showToast } = useToast();

  // Load events list for dropdown
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await eventService.getEvents({ limit: 100 });
        if (res.data.success) {
          setEventsList(res.data.events);
        }
      } catch (err) {
        console.error('Failed to load events dropdown:', err);
      }
    };
    fetchEvents();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const params = {
        search: search.trim() || undefined,
        eventId: selectedEventId !== 'All' ? selectedEventId : undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        limit: 100,
      };

      const res = await adminService.getAllRegistrations(params);
      if (res.data.success) {
        setRegistrations(res.data.registrations);
      }
    } catch (err) {
      console.error('Failed to load registrations:', err);
      showToast({ type: 'error', message: 'Failed to load registrations ledger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [selectedEventId, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRegistrations();
  };

  const handleAdminCancel = async () => {
    if (!regToCancel) return;
    setCancelling(true);
    try {
      const res = await registrationService.cancelRegistration(
        regToCancel._id,
        'Cancelled by campus administrator'
      );
      if (res.data.success) {
        showToast({ type: 'info', message: 'Registration cancelled and seat released.' });
        setCancelModalOpen(false);
        setRegToCancel(null);
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
            <span>Master Registration Ledger</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage Event Registrations
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Audit student attendance rosters, department enrollment numbers, and seat release status
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500">
          Total Entries: <span className="font-bold text-indigo-600">{registrations.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student, email, USN..."
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

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Event Filter */}
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden cursor-pointer max-w-xs truncate"
          >
            <option value="All">All Events ({eventsList.length})</option>
            {eventsList.map((ev) => (
              <option key={ev._id} value={ev._id}>
                {ev.title}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-hidden cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="registered">Registered / Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="attended">Attended</option>
          </select>
        </div>
      </div>

      {/* Registrations Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Student Details</th>
                <th className="py-3.5 px-6">Department</th>
                <th className="py-3.5 px-6">Event Enrolled</th>
                <th className="py-3.5 px-6">Date Registered</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-2" />
                    <span className="text-slate-400">Loading registrations ledger...</span>
                  </td>
                </tr>
              ) : registrations.length > 0 ? (
                registrations.map((reg) => {
                  const stu = reg.studentId;
                  const ev = reg.eventId;
                  const regDate = new Date(reg.registrationDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={reg._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6 font-bold text-slate-900">
                        <span className="block">{stu?.name || 'Unknown Student'}</span>
                        <span className="block text-[11px] font-normal text-slate-400">
                          {stu?.email} {stu?.phone && `• ${stu.phone}`}
                        </span>
                        {stu?.studentIdNumber && (
                          <span className="inline-block mt-0.5 text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                            {stu.studentIdNumber}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-slate-600 max-w-[150px] truncate">
                        {stu?.department || 'General'}
                      </td>

                      <td className="py-4 px-6 font-medium text-slate-900 max-w-xs">
                        <span className="block truncate font-bold">{ev?.title || 'Event'}</span>
                        <span className="block text-[11px] text-slate-400">
                          {ev?.category} • Venue: {ev?.venue}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-slate-500 whitespace-nowrap">
                        {regDate}
                      </td>

                      <td className="py-4 px-6">
                        <StatusBadge status={reg.status} />
                      </td>

                      <td className="py-4 px-6 text-right">
                        {reg.status === 'registered' ? (
                          <button
                            onClick={() => {
                              setRegToCancel(reg);
                              setCancelModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-lg text-rose-600 hover:bg-rose-50 font-semibold transition"
                          >
                            Cancel Seat
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px] italic">Seat released</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No registrations found matching the specified filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Cancel Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Administrative Seat Cancellation"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Are you sure you want to cancel the registration of{' '}
            <strong className="text-slate-900">{regToCancel?.studentId?.name}</strong> for{' '}
            <strong className="text-slate-900">{regToCancel?.eventId?.title}</strong>? The seat
            will immediately become available in the live event capacity pool.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Keep Registration
            </button>
            <button
              onClick={handleAdminCancel}
              disabled={cancelling}
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition flex items-center gap-1.5"
            >
              {cancelling && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Confirm Release</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageRegistrationsPage;
