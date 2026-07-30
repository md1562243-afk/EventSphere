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

const GOLD = '#D4AF37';
const GOLD_HOVER = '#F5C542';
const CARD_BG = '#171717';
const BORDER = 'rgba(212,175,55,0.20)';

export default function EventCard({ event }) {
  const Icon = TYPE_ICONS[event.event_type] || TYPE_ICONS.Other;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="group relative"
    >
      <Link to={`/events/${event.event_id}`} className="block">
        <div
          className="relative rounded-xl overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: CARD_BG,
            border: `1px solid ${BORDER}`
          }}
        >
          {/* top hairline that brightens on hover */}
          <div
            className="h-[2px] w-full transition-opacity duration-300 opacity-60 group-hover:opacity-100"
            style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
          />

          <div className="p-6">
            {/* icon badge + type */}
            <div className="flex items-center justify-between mb-5">
              <div
                className="h-10 w-10 rounded-full grid place-items-center transition-colors duration-300"
                style={{ border: `1px solid ${BORDER}` }}
              >
                <Icon size={16} style={{ color: GOLD }} strokeWidth={1.75} />
              </div>
              <span
                className="text-[10px] font-bold uppercase tracking-[0.15em]"
                style={{ color: GOLD }}
              >
                {event.event_type}
              </span>
            </div>

            {/* name */}
            <h3 className="text-white font-bold text-lg leading-snug mb-5 line-clamp-2 tracking-tight">
              {event.event_name}
            </h3>

            {/* divider */}
            <div className="h-px w-full mb-5" style={{ backgroundColor: BORDER }} />

            {/* price + CTA */}
            <div className="flex items-end justify-between">
              <div>
                <p
                  className="text-[9px] uppercase tracking-[0.2em] font-semibold mb-1"
                  style={{ color: '#B8B8B8' }}
                >
                  Starting at
                </p>
                <p className="text-2xl font-black" style={{ color: GOLD }}>
                  ৳{Number(event.ticket_price).toLocaleString()}
                </p>
              </div>

              <span
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide rounded-full px-3.5 py-2 transition-colors duration-300"
                style={{ backgroundColor: GOLD, color: '#0A0A0A' }}
              >
                Request
                <ArrowUpRight size={13} strokeWidth={2.5} />
              </span>
            </div>
          </div>

          {/* hover glow */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
            style={{ boxShadow: `0 0 0 1px ${GOLD}, 0 8px 32px -8px rgba(212,175,55,0.35)` }}
          />
        </div>
      </Link>
    </motion.div>
  );
}