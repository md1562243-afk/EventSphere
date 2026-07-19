import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import api from '../api/axios';
import EventCard from '../components/EventCard';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'lowest_price', label: 'Lowest Price' },
  { value: 'highest_price', label: 'Highest Price' },
  { value: 'upcoming', label: 'Nearest Date' }
];

const EVENT_TYPES = [
  'Conference', 'Workshop', 'Seminar', 'Concert', 'Festival',
  'Wedding', 'Birthday Party', 'Corporate Event', 'Networking',
  'Sports', 'Exhibition', 'Charity', 'Other'
];

export default function BrowseEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ q: '', type: '', date: '', venue: '', minPrice: '', maxPrice: '', sort: 'newest' });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const res = await api.get('/events', { params });
      setEvents(res.data.events || []);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); /* eslint-disable-next-line */ }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="container-app py-12">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Browse Events</h1>
        <p className="text-body">Find your next experience from approved events across the platform.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 sm:p-5 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="input-field pl-11"
              placeholder="Search by event name or type..."
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />
          </div>
          <button type="button" onClick={() => setShowFilters(!showFilters)} className="btn-outline flex items-center gap-2 justify-center">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <button type="submit" className="btn-primary">Search</button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4 pt-4 border-t border-slate-100">
            <input className="input-field" placeholder="Venue" value={filters.venue} onChange={(e) => setFilters({ ...filters, venue: e.target.value })} />
            <input type="date" className="input-field" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
            <select className="input-field" value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
              <option value="">All event types</option>
              {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="number" className="input-field" placeholder="Min price" value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} />
            <input type="number" className="input-field" placeholder="Max price" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} />
          </div>
        )}

        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className="text-sm text-body">Sort by:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilters({ ...filters, sort: opt.value })}
              className={`text-xs font-semibold rounded-full px-3 py-1.5 transition duration-250 ${
                filters.sort === opt.value ? 'bg-primary text-white' : 'bg-slate-100 text-body hover:bg-primary/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </form>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card h-72 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-body">No events match your search. Try adjusting your filters.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((e) => <EventCard key={e.event_id} event={e} />)}
        </div>
      )}
    </div>
  );
}
