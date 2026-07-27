import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket } from 'lucide-react';

export default function EventCard({ event }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="card overflow-hidden group"
    >
      <Link to={`/events/${event.event_id}`}>
        <div className="p-5">
          <span className="badge bg-primary/10 text-primary mb-3">{event.event_type}</span>
          <h3 className="font-bold text-heading text-base mb-2 line-clamp-1">{event.event_name}</h3>
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