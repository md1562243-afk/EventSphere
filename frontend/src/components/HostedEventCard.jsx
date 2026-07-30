import React from 'react';
import { CalendarDays, MapPin, Clock } from 'lucide-react';
import { formatTime12hr } from '../utils/formatTime';

const GOLD = '#D4AF37';
const CARD_BG = '#171717';
const BORDER = 'rgba(212,175,55,0.20)';
const SECONDARY = '#B8B8B8';

export default function HostedEventCard({ event }) {
  return (
    <div
      className="relative rounded-xl overflow-hidden"
      style={{ backgroundColor: CARD_BG, border: `1px solid ${BORDER}` }}
    >
      <div
        className="h-[2px] w-full opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
      />

      <div className="p-6">
        {/* type + custom tag */}
        <div className="flex items-center justify-between mb-5">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.15em]"
            style={{ color: GOLD }}
          >
            {event.event_type}
          </span>
          <span
            className="text-[9px] font-bold uppercase tracking-[0.15em] rounded-full px-2.5 py-1"
            style={{ border: `1px solid ${BORDER}`, color: SECONDARY }}
          >
            Custom
          </span>
        </div>

        {/* name */}
        <h3 className="text-white font-bold text-lg leading-snug mb-5 line-clamp-2 tracking-tight">
          {event.event_name}
        </h3>

        {/* divider */}
        <div className="h-px w-full mb-5" style={{ backgroundColor: BORDER }} />

        {/* details */}
        <div className="space-y-2.5 mb-5 text-sm" style={{ color: SECONDARY }}>
          {event.hosted_date && (
            <div className="flex items-center gap-2.5">
              <CalendarDays size={14} style={{ color: GOLD }} />
              {event.hosted_date}
            </div>
          )}
          {event.hosted_time && (
            <div className="flex items-center gap-2.5">
              <Clock size={14} style={{ color: GOLD }} />
              {formatTime12hr(event.hosted_time)}
            </div>
          )}
          {event.hosted_venue && (
            <div className="flex items-center gap-2.5">
              <MapPin size={14} style={{ color: GOLD }} />
              <span className="line-clamp-1">{event.hosted_venue}</span>
            </div>
          )}
        </div>

        {/* divider */}
        <div className="h-px w-full mb-5" style={{ backgroundColor: BORDER }} />

        {/* price */}
        <div>
          <p
            className="text-[9px] uppercase tracking-[0.2em] font-semibold mb-1"
            style={{ color: SECONDARY }}
          >
            Price
          </p>
          <p className="text-2xl font-black" style={{ color: GOLD }}>
            ৳{Number(event.ticket_price).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}