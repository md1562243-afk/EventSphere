import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, Presentation, Wrench, BookOpen, Music, PartyPopper,
  Heart, Cake, Briefcase, Users, Trophy, Image, HeartHandshake, Sparkles
} from 'lucide-react';

const TYPE_STYLES = {
  Conference: { icon: Presentation, gradient: 'from-blue-500 via-indigo-500 to-violet-600', glow: 'shadow-blue-500/30' },
  Workshop: { icon: Wrench, gradient: 'from-amber-400 via-orange-500 to-red-500', glow: 'shadow-orange-500/30' },
  Seminar: { icon: BookOpen, gradient: 'from-teal-400 via-cyan-500 to-blue-600', glow: 'shadow-cyan-500/30' },
  Concert: { icon: Music, gradient: 'from-fuchsia-500 via-purple-600 to-indigo-700', glow: 'shadow-purple-500/30' },
  Festival: { icon: PartyPopper, gradient: 'from-pink-500 via-rose-500 to-orange-500', glow: 'shadow-pink-500/30' },
  Wedding: { icon: Heart, gradient: 'from-rose-300 via-pink-400 to-red-400', glow: 'shadow-rose-500/30' },
  'Birthday Party': { icon: Cake, gradient: 'from-yellow-300 via-amber-400 to-pink-400', glow: 'shadow-amber-500/30' },
  'Corporate Event': { icon: Briefcase, gradient: 'from-slate-700 via-slate-800 to-slate-900', glow: 'shadow-slate-500/30' },
  Networking: { icon: Users, gradient: 'from-sky-400 via-blue-500 to-indigo-600', glow: 'shadow-sky-500/30' },
  Sports: { icon: Trophy, gradient: 'from-lime-400 via-green-500 to-emerald-600', glow: 'shadow-green-500/30' },
  Exhibition: { icon: Image, gradient: 'from-violet-400 via-fuchsia-500 to-pink-600', glow: 'shadow-fuchsia-500/30' },
  Charity: { icon: HeartHandshake, gradient: 'from-red-400 via-pink-500 to-rose-600', glow: 'shadow-red-500/30' },
  Other: { icon: Sparkles, gradient: 'from-gray-500 via-slate-600 to-gray-800', glow: 'shadow-gray-500/30' }
};

export default function EventCard({ event }) {
  const style = TYPE_STYLES[event.event_type] || TYPE_STYLES.Other;
  const Icon = style.icon;

  return (
    <motion.div
      whileHover={{ y: -10, rotate: -0.5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative"
    >
      <Link to={`/events/${event.event_id}`} className="block">
        <div className={`relative rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm group-hover:shadow-xl transition-shadow duration-300 ${style.glow}`}>

          {/* Header banner */}
          <div className={`relative h-32 bg-gradient-to-br ${style.gradient} overflow-hidden`}>
            {/* Decorative mesh shapes */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute -top-6 -left-6 h-24 w-24 rounded-full bg-white/40 blur-2xl" />
              <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-black/20 blur-2xl" />
            </div>
            <div className="absolute inset-0 opacity-[0.08]" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '14px 14px'
            }} />

            {/* Type badge */}
            <span className="absolute top-3 left-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              {event.event_type}
            </span>

            {/* Floating icon badge */}
            <div className="absolute -bottom-6 left-4 h-14 w-14 rounded-2xl bg-white shadow-lg grid place-items-center border-4 border-white group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
              <div className={`h-full w-full rounded-xl bg-gradient-to-br ${style.gradient} grid place-items-center`}>
                <Icon size={22} className="text-white" strokeWidth={2.2} />
              </div>
            </div>

            {/* Corner arrow */}
            <div className="absolute top-3 right-3 h-7 w-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 grid place-items-center group-hover:bg-white group-hover:text-heading text-white transition-colors duration-300">
              <ArrowUpRight size={14} />
            </div>
          </div>

          {/* Body */}
          <div className="pt-9 px-5 pb-5">
            <h3 className="font-extrabold text-heading text-base mb-3 line-clamp-1 group-hover:text-primary transition-colors">
              {event.event_name}
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Starting at</p>
                <p className="text-xl font-black text-heading">
                  ৳{Number(event.ticket_price).toLocaleString()}
                </p>
              </div>
              <span className="text-[11px] font-bold text-white bg-heading rounded-full px-3 py-1.5 group-hover:bg-primary transition-colors">
                Request
              </span>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className={`h-1 w-0 group-hover:w-full bg-gradient-to-r ${style.gradient} transition-all duration-500`} />
        </div>
      </Link>
    </motion.div>
  );
}