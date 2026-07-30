import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, Presentation, Wrench, BookOpen, Music, PartyPopper,
  Heart, Cake, Briefcase, Users, Trophy, Image, HeartHandshake, Sparkles
} from 'lucide-react';

const TYPE_ICONS = {
  Conference: Presentation,
  Workshop: Wrench,
  Seminar: BookOpen,
  Concert: Music,
  Festival: PartyPopper,
  Wedding: Heart,
  'Birthday Party': Cake,
  'Corporate Event': Briefcase,
  Networking: Users,
  Sports: Trophy,
  Exhibition: Image,
  Charity: HeartHandshake,
  Other: Sparkles
};

export default function EventCard({ event }) {
  const Icon = TYPE_ICONS[event.event_type] || TYPE_ICONS.Other;

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }} className="group">
      <Link to={`/events/${event.event_id}`} className="block">
        <div className="card overflow-hidden group-hover:shadow-glow">
          <div className="relative h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-semibold text-heading shadow-sm">
              {event.event_type}
            </span>
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-badgebg px-2.5 py-1 text-[10px] font-semibold text-badgetext">
              <span className="h-1.5 w-1.5 rounded-full bg-badgetext" /> Active
            </span>
            <Icon size={40} className="text-primary/50" strokeWidth={1.5} />
          </div>

          <div className="p-5">
            <h3 className="font-bold text-heading text-base mb-4 line-clamp-1">{event.event_name}</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted font-semibold mb-0.5">Starting at</p>
                <p className="text-lg font-extrabold text-price">৳{Number(event.ticket_price).toLocaleString()}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                Request <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}