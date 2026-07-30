import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api/axios';
import EventCard from '../components/EventCard';
import HostedEventCard from '../components/HostedEventCard';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'lowest_price', label: 'Lowest Price' },
  { value: 'highest_price', label: 'Highest Price' }
];

const EVENT_TYPES = [
  'Conference', 'Workshop', 'Seminar', 'Concert', 'Festival',
  'Wedding', 'Birthday Party', 'Corporate Event', 'Networking',
  'Sports', 'Exhibition', 'Charity', 'Other'
];

const PAGE_SIZE = 12;

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="h-8 w-8 rounded-full border border-borderc grid place-items-center text-body hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronLeft size={15} />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`h-8 w-8 rounded-full text-xs font-semibold transition duration-250 ${
            p === page ? 'bg-primary text-white' : 'text-body hover:bg-primary/10 hover:text-primary'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="h-8 w-8 rounded-full border border-borderc grid place-items-center text-body hover:bg-primary/10 hover:text-primary disabled:opacity-30 disabled:pointer-events-none"
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

export default function BrowseEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ q: '', type: '', minPrice: '', maxPrice: '', sort: 'newest' });
  const [offerPage, setOfferPage] = useState(1);
  const [hostedPage, setHostedPage] = useState(1);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      // Fetch every matching event in one go (both sections combined) so the
      // search/filter applies across both "What We Offer" and "Custom
      // Requests" — pagination below is then handled per-section on the
      // frontend, 12 per page each.
      const res = await api.get('/events', { params: { ...params, limit: 500, page: 1 } });
      setEvents(res.data.events || []);
      setOfferPage(1);
      setHostedPage(1);
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

  // An event with exactly 1 booking is treated as a one-off hosted event
  // (user-requested); 0 or 2+ bookings is treated as a bookable organizer
  // template. Best-effort split without a dedicated schema flag.
  const offerEvents = events.filter((e) => Number(e.booking_count) !== 1);
  const hostedEvents = events.filter((e) => Number(e.booking_count) === 1);

  const offerTotalPages = Math.max(1, Math.ceil(offerEvents.length / PAGE_SIZE));
  const hostedTotalPages = Math.max(1, Math.ceil(hostedEvents.length / PAGE_SIZE));

  const offerPageItems = offerEvents.slice((offerPage - 1) * PAGE_SIZE, offerPage * PAGE_SIZE);
  const hostedPageItems = hostedEvents.slice((hostedPage - 1) * PAGE_SIZE, hostedPage * PAGE_SIZE);

  return (
    <div className="container-app py-12">
      <div className="mb-8">
        <h1 className="text-3xl mb-2">Browse Events</h1>
        <p className="text-body">Find your next experience from approved event packages across the platform.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 sm:p-5 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" size={18} />
            <input
              className="input-field !pl-11"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t border-borderc">
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
                filters.sort === opt.value ? 'bg-primary text-white' : 'bg-searchbg text-body hover:bg-primary/10'
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
            <div key={i} className="card h-72 animate-pulse bg-searchbg" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-body">No events match your search. Try adjusting your filters.</div>
      ) : (
        <>
          <section className="mb-14">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-heading">What We Offer</h2>
              <span className="text-xs text-muted">{offerEvents.length} event{offerEvents.length !== 1 ? 's' : ''}</span>
            </div>
            {offerPageItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {offerPageItems.map((e) => <EventCard key={e.event_id} event={e} />)}
                </div>
                <Pagination page={offerPage} totalPages={offerTotalPages} onChange={setOfferPage} />
              </>
            ) : (
              <p className="text-body text-sm">No bookable event packages match your search.</p>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-heading">Custom Requests</h2>
              <span className="text-xs text-muted">{hostedEvents.length} event{hostedEvents.length !== 1 ? 's' : ''}</span>
            </div>
            {hostedPageItems.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {hostedPageItems.map((e) => <HostedEventCard key={e.event_id} event={e} />)}
                </div>
                <Pagination page={hostedPage} totalPages={hostedTotalPages} onChange={setHostedPage} />
              </>
            ) : (
              <p className="text-body text-sm">No custom requests match your search.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}