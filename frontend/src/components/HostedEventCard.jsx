import React from 'react';
import { CalendarDays, MapPin, Clock, Ticket } from 'lucide-react';
import {
  Presentation, Wrench, BookOpen, Music, PartyPopper,
  Heart, Cake, Briefcase, Users, Trophy, Image as ImageIcon, HeartHandshake, Sparkles
} from 'lucide-react';
import { formatTime12hr } from '../utils/formatTime';

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

export default function HostedEventCard({ event }) {
  const style = TYPE_STYLES[event.event_type] || TYPE_STYLES.Other;
  const Icon = style.icon;

  return (
    <div className="card overflow-hidden">
      <div
        className="relative h-36 flex items-center justify-center overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${style.from}, ${style.to})` }}
      >
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
        <span className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-badgetext">
          Custom
        </span>

        <Icon size={44} className="text-white drop-shadow-md relative z-10" strokeWidth={1.75} />
      </div>

      <div className="p-5">
        <h3 className="font-bold text-heading text-base mb-4 line-clamp-1">{event.event_name}</h3>

        <div className="space-y-1.5 text-sm text-body mb-4">
          {event.hosted_date && (
            <div className="flex items-center gap-2">
              <CalendarDays size={14} className="text-iconc" /> {event.hosted_date}
            </div>
          )}
          {event.hosted_time && (
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-iconc" /> {formatTime12hr(event.hosted_time)}
            </div>
          )}
          {event.hosted_venue && (
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-iconc" /> <span className="line-clamp-1">{event.hosted_venue}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 font-extrabold text-price pt-3 border-t border-divider">
          <Ticket size={14} /> ৳{Number(event.ticket_price).toLocaleString()}
        </div>
      </div>
    </div>
  );
}