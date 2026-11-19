import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../services/api';
import EventCard from '../components/events/EventCard';
import {
  Search,
  Filter,
  Calendar,
  Layers,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
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

const DATE_FILTERS = [
  { label: 'All Dates', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'Past Events', value: 'past' },
];

const SORT_OPTIONS = [
  { label: 'Upcoming First', value: 'date-asc' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Latest Added', value: 'newest' },
  { label: 'Title (A-Z)', value: 'title' },
];

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter States from URL or defaults
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [dateFilter, setDateFilter] = useState(searchParams.get('dateFilter') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || 'date-asc');

  useEffect(() => {
    // Sync URL when category or search changes from outside
    const cat = searchParams.get('category');
    if (cat && cat !== category) setCategory(cat);
    const q = searchParams.get('search');
    if (q && q !== search) setSearch(q);
  }, [searchParams]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {
        search: search.trim() || undefined,
        category: category !== 'All' ? category : undefined,
        dateFilter: dateFilter !== 'all' ? dateFilter : undefined,
        sort,
        page: currentPage,
        limit: 9,
      };

      const res = await eventService.getEvents(params);
      if (res.data.success) {
        setEvents(res.data.events);
        setTotalEvents(res.data.totalEvents);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category, dateFilter, sort, currentPage]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchEvents();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setDateFilter('all');
    setSort('date-asc');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            College Events Directory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Browse, search and register for live hackathons, cultural festivals, workshops and seminars
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="text-indigo-600 font-bold">{events.length}</span> of{' '}
          <span className="text-slate-800 font-bold">{totalEvents}</span> events
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, description, venue, or department organizer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-xs transition shrink-0"
          >
            Search
          </button>
          {(search || category !== 'All' || dateFilter !== 'all' || sort !== 'date-asc') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition flex items-center justify-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </form>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  category === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Date & Sort Dropdowns */}
          <div className="flex items-center gap-2">
            {/* Date Filter Dropdown */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none pl-8 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 focus:outline-hidden cursor-pointer"
              >
                {DATE_FILTERS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none pl-8 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 focus:outline-hidden cursor-pointer"
              >
                {SORT_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-96 rounded-2xl bg-white border border-slate-200 p-4 space-y-4 animate-pulse"
            >
              <div className="h-44 bg-slate-100 rounded-xl"></div>
              <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
              <div className="h-3 bg-slate-100 rounded-md w-full"></div>
              <div className="h-3 bg-slate-100 rounded-md w-5/6"></div>
            </div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">No events found matching your criteria</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, changing the category, or resetting the date filter.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 px-5 py-2.5 bg-indigo-50 text-indigo-700 font-semibold text-xs rounded-xl hover:bg-indigo-100 transition"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <div className="text-xs font-semibold text-slate-600 px-3">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
