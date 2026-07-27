import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Ticket, ArrowRight } from 'lucide-react';

export const showcaseEvents = [
  { id: 'showcase-1', event_name: 'Grand Wedding', event_type: 'Wedding', event_venue: 'Premium Venues', ticket_price: 50000, event_date: 'On Request', event_time: 'Flexible' },
  { id: 'showcase-2', event_name: 'Live Concert Night', event_type: 'Concert', event_venue: 'Major Halls', ticket_price: 500, event_date: 'On Request', event_time: 'Evening' },
  { id: 'showcase-3', event_name: 'Corporate Summit', event_type: 'Conference', event_venue: 'Convention Centers', ticket_price: 5000, event_date: 'On Request', event_time: 'Daylong' },
  { id: 'showcase-4', event_name: 'Birthday Bash', event_type: 'Birthday Party', event_venue: 'Party Halls', ticket_price: 15000, event_date: 'On Request', event_time: 'Flexible' },
  { id: 'showcase-5', event_name: 'Charity Gala', event_type: 'Charity', event_venue: 'City Hall', ticket_price: 30000, event_date: 'On Request', event_time: 'Evening' },
  { id: 'showcase-6', event_name: 'Esports Tournament', event_type: 'Sports', event_venue: 'Arena Halls', ticket_price: 1000, event_date: 'On Request', event_time: 'Daylong' },
];

export default function ShowcaseCard({ event }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="card overflow-hidden group"
    >
      <div className="p-5">
        <span className="badge bg-primary/10 text-primary mb-3">{event.event_type}</span>
        <h3 className="font-bold text-heading text-base mb-2 line-clamp-1">{event.event_name}</h3>
        <div className="space-y-1.5 text-sm text-body">
          <div className="flex items-center gap-2">
            <CalendarDays size={14} /> {event.event_date} · {event.event_time}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} /> <span className="line-clamp-1">{event.event_venue}</span>
          </div>
        </div>
        <div className="mt-4 mb-4">
          <div className="flex items-center gap-1 font-bold text-heading">
            <Ticket size={14} className="text-accent" /> Starting ৳{Number(event.ticket_price).toLocaleString()}
          </div>
        </div>
        <Link
          to="/request-event"
          className="btn-outline w-full text-center text-xs flex items-center justify-center gap-1 py-2"
        >
          Request This Type <ArrowRight size={12} />
        </Link>
      </div>
    </motion.div>
  );
}