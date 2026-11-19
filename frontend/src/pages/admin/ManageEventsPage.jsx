import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { CategoryBadge, StatusBadge } from '../../components/common/Badge';
import EventFormModal from '../../components/admin/EventFormModal';
import Modal from '../../components/common/Modal';
import {
  CalendarDays,
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  Eye,
  Loader2,
  AlertTriangle,
} from 'lucide-react';

const CATEGORIES = [
  'All',
  'Technical',
  'Hackathon',
  'Workshop',
  'Cultural',
  'Sports',
  'Seminar',
  'Management',
];

const ManageEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Modal states
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { showToast } = useToast();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventService.getEvents({
        limit: 100,
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
      });
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (err) {
      console.error('Error fetching admin events:', err);
      showToast({ type: 'error', message: 'Failed to load events list' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleOpenEdit = (event) => {
    setSelectedEvent(event);
    setFormModalOpen(true);
  };

  const handleOpenCreate = () => {
    setSelectedEvent(null);
    setFormModalOpen(true);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    setDeleting(true);
    try {
      const res = await eventService.deleteEvent(eventToDelete._id);
      if (res.data.success) {
        showToast({ type: 'success', message: 'Event deleted successfully' });
        setDeleteModalOpen(false);
        setEventToDelete(null);
        fetchEvents();
      }
    } catch (err) {
      showToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to delete event',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Event Coordination</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Manage College Events
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Create new events, modify details, manage seat allocations, or cancel events
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Event</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, venue..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
          >
            Filter
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                category === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Event Title</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Date & Time</th>
                <th className="py-3.5 px-6">Venue</th>
                <th className="py-3.5 px-6">Capacity</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Loader2 className="w-6 h-6 text-indigo-600 animate-spin mx-auto mb-2" />
                    <span className="text-slate-400">Loading events directory...</span>
                  </td>
                </tr>
              ) : events.length > 0 ? (
                events.map((ev) => {
                  const evDate = new Date(ev.eventDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr key={ev._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-4 px-6 font-bold text-slate-900 max-w-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              ev.image ||
                              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=100&auto=format&fit=crop&q=80'
                            }
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div className="truncate">
                            <span className="truncate block font-bold text-slate-900">{ev.title}</span>
                            <span className="text-[11px] font-normal text-slate-400 block truncate">
                              {ev.organizer}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <CategoryBadge category={ev.category} />
                      </td>

                      <td className="py-4 px-6 text-slate-600">
                        <span className="font-semibold block">{evDate}</span>
                        <span className="text-[11px] text-slate-400">{ev.eventTime}</span>
                      </td>

                      <td className="py-4 px-6 text-slate-600 truncate max-w-[140px]">
                        {ev.venue}
                      </td>

                      <td className="py-4 px-6 font-semibold">
                        <span className={ev.registeredCount >= ev.capacity ? 'text-rose-600' : 'text-slate-800'}>
                          {ev.registeredCount} / {ev.capacity}
                        </span>
                        <span className="block text-[10px] text-slate-400">
                          {Math.max(0, ev.capacity - ev.registeredCount)} seats left
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <StatusBadge status={ev.status} />
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Registrations */}
                          <Link
                            to={`/admin/registrations?eventId=${ev._id}`}
                            title="View Registrations"
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition"
                          >
                            <Users className="w-4 h-4" />
                          </Link>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(ev)}
                            title="Edit Event"
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => {
                              setEventToDelete(ev);
                              setDeleteModalOpen(true);
                            }}
                            title="Delete Event"
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No events found matching your filter criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Event Modal */}
      <EventFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        event={selectedEvent}
        onSuccess={fetchEvents}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete College Event"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Permanent Deletion Warning</p>
              <p className="mt-0.5">
                Deleting this event will automatically cascade and cancel all{' '}
                <strong>{eventToDelete?.registeredCount || 0} student registrations</strong>{' '}
                associated with it.
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-600">
            Are you sure you want to delete{' '}
            <strong className="text-slate-900">{eventToDelete?.title}</strong>?
          </p>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteEvent}
              disabled={deleting}
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition flex items-center gap-1.5"
            >
              {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Yes, Delete Event</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageEventsPage;
