import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Ticket } from 'lucide-react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=60';

export default function EventCard({ event }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="card overflow-hidden group"
    >
      <Link to={`/events/${event.event_id}`}>
        <div className="h-44 overflow-hidden">
          <img
            src={FALLBACK_IMG}
            alt={event.event_name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        </div>
        <div className="p-5">
          <span className="badge bg-primary/10 text-primary mb-3">{event.event_type}</span>
          <h3 className="font-bold text-heading text-base mb-2 line-clamp-1">{event.event_name}</h3>
          <div className="space-y-1.5 text-sm text-body">
            <div className="flex items-center gap-2"><CalendarDays size={14} /> {event.event_date} · {event.event_time}</div>
            <div className="flex items-center gap-2"><MapPin size={14} /> <span className="line-clamp-1">{event.event_venue}</span></div>
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-1 font-bold text-heading">
              <Ticket size={14} className="text-accent" /> ৳{Number(event.ticket_price).toLocaleString()}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
