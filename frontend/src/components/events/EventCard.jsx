import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { CategoryBadge, StatusBadge } from '../common/Badge';

const EventCard = ({ event }) => {
  const eventDate = new Date(event.eventDate);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const capacity = event.capacity || 0;
  const registered = event.registeredCount || 0;
  const seatsLeft = Math.max(0, capacity - registered);
  const percentFilled = capacity > 0 ? Math.min(100, Math.round((registered / capacity) * 100)) : 0;
  const isFull = seatsLeft === 0;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1">
      {/* Event Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={
            event.image ||
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
          }
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <CategoryBadge category={event.category} />
        </div>
        <div className="absolute top-3 right-3 z-10">
          <StatusBadge status={event.status} />
        </div>

        {/* Date Tag */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-slate-900 px-3 py-1 rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 mb-2">
            {event.title}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {event.description}
          </p>

          {/* Details list */}
          <div className="space-y-1.5 text-xs text-slate-600 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.eventTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.organizer}</span>
            </div>
          </div>
        </div>

        {/* Capacity Progress Bar & Action */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-500">Seat Capacity</span>
            <span className={isFull ? 'text-rose-600 font-bold' : 'text-slate-700'}>
              {registered} / {capacity} {isFull ? '(Full)' : `(${seatsLeft} left)`}
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
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

          <Link
            to={`/events/${event._id}`}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50/80 hover:bg-indigo-600 hover:text-white transition-all shadow-xs"
          >
            <span>View Details & Register</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
