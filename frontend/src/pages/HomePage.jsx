import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import EventCard from '../components/events/EventCard';
import {
  Sparkles,
  Calendar,
  Users,
  Award,
  ArrowRight,
  Search,
  CheckCircle,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  Clock,
  Layers,
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Technical', icon: '💻', count: 'Coding & CTFs' },
  { name: 'Hackathon', icon: '🚀', count: '36-hr Sprints' },
  { name: 'Workshop', icon: '🛠️', count: 'Hands-on Labs' },
  { name: 'Cultural', icon: '🎭', count: 'Music & Arts' },
  { name: 'Sports', icon: '🏆', count: 'Tournaments' },
  { name: 'Seminar', icon: '🎤', count: 'Industry Talks' },
  { name: 'Management', icon: '📊', count: 'Startup Pitches' },
];

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await eventService.getEvents({ limit: 6, dateFilter: 'upcoming' });
        if (res.data.success) {
          setFeaturedEvents(res.data.events);
        }
      } catch (err) {
        console.error('Failed to load featured events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/events');
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-indigo-50/70 via-white to-white">
        {/* Subtle Background Glow Circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-200/40 via-purple-100/30 to-pink-100/30 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Project Academic Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>CampusConnect 2026 • MCA Final-Year Capstone Project</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Discover, Register & Excel in{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 bg-clip-text text-transparent">
              Campus Events
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The unified college event management platform connecting students, faculties,
            and organizers. Live capacity tracking, instant seat registration, and transparent administration.
          </p>

          {/* Search Bar Shortcut */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3 p-2 rounded-2xl bg-white shadow-xl shadow-slate-200/50 border border-slate-200/80"
          >
            <div className="flex items-center gap-2 px-3 w-full sm:flex-1">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search events by title, topic, organizer, or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden py-2"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 transition shrink-0 flex items-center justify-center gap-2"
            >
              <span>Find Events</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Metrics */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-white/80 backdrop-blur-xs border border-slate-200/60 shadow-xs">
              <div className="text-2xl lg:text-3xl font-extrabold text-indigo-600">8+</div>
              <div className="text-xs font-medium text-slate-500 mt-1">Active College Events</div>
            </div>
            <div className="p-4 rounded-xl bg-white/80 backdrop-blur-xs border border-slate-200/60 shadow-xs">
              <div className="text-2xl lg:text-3xl font-extrabold text-violet-600">100%</div>
              <div className="text-xs font-medium text-slate-500 mt-1">Concurrency Safe Seats</div>
            </div>
            <div className="p-4 rounded-xl bg-white/80 backdrop-blur-xs border border-slate-200/60 shadow-xs">
              <div className="text-2xl lg:text-3xl font-extrabold text-emerald-600">7+</div>
              <div className="text-xs font-medium text-slate-500 mt-1">Event Categories</div>
            </div>
            <div className="p-4 rounded-xl bg-white/80 backdrop-blur-xs border border-slate-200/60 shadow-xs">
              <div className="text-2xl lg:text-3xl font-extrabold text-amber-600">Real-Time</div>
              <div className="text-xs font-medium text-slate-500 mt-1">Live Registration DB</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Find technical hackathons, cultural festivals, career workshops and athletic tournaments
            </p>
          </div>
          <Link
            to="/events"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/events?category=${cat.name}`}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all text-center group flex flex-col items-center justify-center"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>Upcoming On Campus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Featured College Events
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Reserve your seat before capacity limits are reached
            </p>
          </div>

          <Link
            to="/events"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-xs transition"
          >
            <span>Explore All Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 rounded-2xl bg-slate-100 animate-pulse border border-slate-200"
              />
            ))}
          </div>
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-700">No upcoming events found</h3>
            <p className="text-sm text-slate-500 mt-1">
              Check back soon or explore past completed archives.
            </p>
          </div>
        )}
      </section>

      {/* System Highlights / Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">
              Engineered For Academic Excellence
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2 text-white">
              Why CampusConnect Powers Modern University Life
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
              Designed to eliminate fragmented WhatsApp groups, manual paper sign-up sheets, and
              untracked event capacities. A high-concurrency, role-based solution with full database integrity.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-xs">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Instant Seat Allocation</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Atomic database transactions prevent overbooking, guaranteeing every registered student a seat.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-xs">
                <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Strict Role-Based Security</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Secured with JWT and Bcrypt; strictly prevents unauthorized self-assignment of administrator roles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-xs">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">One-Click Cancellation</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Students can cancel registrations anytime, immediately restoring seat availability to peers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-xs">
                <TrendingUp className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Faculty Analytics Console</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Admins view real-time department participation metrics, student lists, and category performance.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold shadow-md transition"
              >
                Create Student Account
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition"
              >
                View System Specs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
