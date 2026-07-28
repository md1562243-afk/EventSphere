import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Presentation, Wrench, BookOpen, Music, PartyPopper,
  Heart, Cake, Briefcase, Users, Trophy, Image, HeartHandshake, Sparkles
} from 'lucide-react';

const TYPE_STYLES = {
  Conference: { icon: Presentation, gradient: 'from-blue-500 to-indigo-600' },
  Workshop: { icon: Wrench, gradient: 'from-amber-500 to-orange-600' },
  Seminar: { icon: BookOpen, gradient: 'from-teal-500 to-cyan-600' },
  Concert: { icon: Music, gradient: 'from-purple-500 to-pink-600' },
  Festival: { icon: PartyPopper, gradient: 'from-pink-500 to-rose-600' },
  Wedding: { icon: Heart, gradient: 'from-rose-400 to-red-500' },
  'Birthday Party': { icon: Cake, gradient: 'from-yellow-400 to-orange-500' },
  'Corporate Event': { icon: Briefcase, gradient: 'from-slate-600 to-slate-800' },
  Networking: { icon: Users, gradient: 'from-sky-500 to-blue-600' },
  Sports: { icon: Trophy, gradient: 'from-green-500 to-emerald-600' },
  Exhibition: { icon: Image, gradient: 'from-fuchsia-500 to-purple-600' },
  Charity: { icon: HeartHandshake, gradient: 'from-red-400 to-pink-500' },
  Other: { icon: Sparkles, gradient: 'from-gray-500 to-gray-700' }
};

export default function EventCard({ event }) {
  const style = TYPE_STYLES[event.event_type] || TYPE_STYLES.Other;
  const Icon = style.icon;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      className="card overflow-hidden group"
    >
      <Link to={`/events/${event.event_id}`}>
        <div className={`relative h-28 bg-gradient-to-br ${style.gradient} flex items-center justify-center overflow-hidden`}>
          <div className="absolute -right-4 -bottom-4 opacity-20">
            <Icon size={90} className="text-white" />
          </div>
          <Icon size={38} className="text-white drop-shadow-sm" />
          <span className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur px-2.5 py-0.5 text-[11px] font-bold text-heading">
            {event.event_type}
          </span>
        </div>
        <div className="p-5">
          <h3 className="font-bold text-heading text-base mb-4 line-clamp-1">{event.event_name}</h3>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-body font-semibold">Starting at</p>
              <p className="text-lg font-extrabold text-heading">৳{Number(event.ticket_price).toLocaleString()}</p>
            </div>
            <span className="inline-flex items-center gap-1 text-primary text-xs font-bold group-hover:gap-2 transition-all">
              Request <ArrowRight size={13} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}