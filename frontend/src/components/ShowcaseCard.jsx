import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ticket, ArrowRight } from 'lucide-react';

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
        <div className="mt-4 mb-4">
          <div className="flex items-center gap-1 font-bold text-heading">
            <Ticket size={14} className="text-accent" /> Starting ৳{Number(event.ticket_price).toLocaleString()}
          </div>
        </div>
        <Link
          to={`/events/${event.event_id}`}
          className="btn-outline w-full text-center text-xs flex items-center justify-center gap-1 py-2"
        >
          Request This Type <ArrowRight size={12} />
        </Link>
      </div>
    </motion.div>
  );
}