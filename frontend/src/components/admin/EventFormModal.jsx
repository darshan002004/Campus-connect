import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { eventService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Loader2, Image, Sparkles } from 'lucide-react';

const CATEGORIES = [
  'Technical',
  'Hackathon',
  'Workshop',
  'Cultural',
  'Sports',
  'Seminar',
  'Management',
  'Other',
];

const PRESET_IMAGES = [
  { label: 'Hackathon', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1000&auto=format&fit=crop&q=80' },
  { label: 'AI Workshop', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Cultural Fest', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Sports Meet', url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Cloud Seminar', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80' },
  { label: 'Business Pitch', url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1000&auto=format&fit=crop&q=80' },
];

const EventFormModal = ({ isOpen, onClose, event = null, onSuccess }) => {
  const isEditing = !!event;
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Technical',
    eventDate: '',
    eventTime: '10:00 AM - 04:00 PM',
    venue: '',
    organizer: '',
    capacity: 100,
    image: '',
    status: 'upcoming',
    tags: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        category: event.category || 'Technical',
        eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '',
        eventTime: event.eventTime || '10:00 AM - 04:00 PM',
        venue: event.venue || '',
        organizer: event.organizer || '',
        capacity: event.capacity || 100,
        image: event.image || '',
        status: event.status || 'upcoming',
        tags: Array.isArray(event.tags) ? event.tags.join(', ') : '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Technical',
        eventDate: '',
        eventTime: '10:00 AM - 04:00 PM',
        venue: '',
        organizer: 'Department of Computer Applications',
        capacity: 100,
        image: PRESET_IMAGES[0].url,
        status: 'upcoming',
        tags: 'Tech, Campus',
      });
    }
  }, [event, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.eventDate || !formData.venue) {
      showToast({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        tags: formData.tags
          ? formData.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };

      if (isEditing) {
        const res = await eventService.updateEvent(event._id, payload);
        if (res.data.success) {
          showToast({ type: 'success', message: 'Event updated successfully' });
          onSuccess();
          onClose();
        }
      } else {
        const res = await eventService.createEvent(payload);
        if (res.data.success) {
          showToast({ type: 'success', message: 'Event created successfully' });
          onSuccess();
          onClose();
        }
      }
    } catch (err) {
      showToast({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save event',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit College Event' : 'Create New College Event'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto px-1">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Event Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. National Hackathon 2026"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Event Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              name="eventDate"
              required
              value={formData.eventDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Time (e.g. 10:00 AM - 04:00 PM) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="eventTime"
              required
              value={formData.eventTime}
              onChange={handleChange}
              placeholder="09:30 AM - 04:30 PM"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Venue & Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Venue / Location <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="venue"
              required
              value={formData.venue}
              onChange={handleChange}
              placeholder="Auditorium A, Block 3"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Max Seating Capacity <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              name="capacity"
              required
              value={formData.capacity}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Organizer */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Organizing Department / Club <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="organizer"
            required
            value={formData.organizer}
            onChange={handleChange}
            placeholder="Dept of Computer Applications & ACM Chapter"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        {/* Banner Image URL & Presets */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">Banner Image URL</label>
            <span className="text-[10px] text-slate-400">Select preset or paste custom URL</span>
          </div>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500 mb-2"
          />

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5">
            {PRESET_IMAGES.map((img) => (
              <button
                key={img.label}
                type="button"
                onClick={() => setFormData({ ...formData, image: img.url })}
                className="text-[10px] font-semibold px-2 py-1 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                + {img.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Event Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of schedule, prerequisites, registration criteria, and awards..."
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="AI, Coding, Hackathon, Prizes"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition flex items-center gap-1.5 shadow-xs"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{isEditing ? 'Save Event Changes' : 'Publish College Event'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EventFormModal;
