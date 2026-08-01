import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, Presentation, Wrench, BookOpen, Music, PartyPopper,
  Heart, Cake, Briefcase, Users, Trophy, Image as ImageIcon, HeartHandshake, Sparkles
} from 'lucide-react';

const TYPE_STYLES = {
  Conference: { icon: Presentation, from: '#6366F1', to: '#8B5CF6' },
  Workshop: { icon: Wrench, from: '#F59E0B', to: '#EA580C' },
  Seminar: { icon: BookOpen, from: '#0891B2', to: '#0E7490' },
  Concert: { icon: Music, from: '#A855F7', to: '#DB2777' },
  Festival: { icon: PartyPopper, from: '#EC4899', to: '#F43F5E' },
  Wedding: { icon: Heart, from: '#FB7185', to: '#E11D48' },
  'Birthday Party': { icon: Cake, from: '#FBBF24', to: '#F472B6' },
  'Corporate Event': { icon: Briefcase, from: '#334155', to: '#0F172A' },
  Networking: { icon: Users, from: '#0EA5E9', to: '#2563EB' },
  Sports: { icon: Trophy, from: '#22C55E', to: '#15803D' },
  Exhibition: { icon: ImageIcon, from: '#D946EF', to: '#7C3AED' },
  Charity: { icon: HeartHandshake, from: '#F87171', to: '#DC2626' },
  Other: { icon: Sparkles, from: '#64748B', to: '#334155' }
};

export default function EventCard({ event }) {
  const style = TYPE_STYLES[event.event_type] || TYPE_STYLES.Other;
  const Icon = style.icon;

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }} className="group">
      <Link to={`/events/${event.event_id}`} className="block">
        <div className="card overflow-hidden group-hover:shadow-glow">
          <div
            className="relative h-36 flex items-center justify-center overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${style.from}, ${style.to})` }}
          >
            {/* decorative pattern layer */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)',
              backgroundSize: '18px 18px'
            }} />
            <div className="absolute -right-6 -bottom-6 opacity-25">
              <Icon size={110} className="text-white" strokeWidth={1.2} />
            </div>
            <div className="absolute -left-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-xl" />

            <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-bold text-heading shadow-sm">
              {event.event_type}
            </span>
            <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Active
            </span>

            <Icon size={44} className="text-white drop-shadow-md relative z-10" strokeWidth={1.75} />
          </div>

          <div className="p-5">
            <h3 className="font-bold text-heading text-base mb-4 line-clamp-1">{event.event_name}</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-muted font-semibold mb-0.5">Starting at</p>
                <p className="text-lg font-extrabold text-price">৳{Number(event.ticket_price).toLocaleString()}</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                Book <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}