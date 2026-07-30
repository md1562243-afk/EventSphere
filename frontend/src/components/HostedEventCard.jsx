import React from 'react';
import { CalendarDays, MapPin, Clock, Ticket } from 'lucide-react';
import { formatTime12hr } from '../utils/formatTime';

export default function HostedEventCard({ event }) {
  return (
    <div className="card overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="rounded-full bg-secondary/10 px-3 py-1 text-[11px] font-semibold text-secondary">
            {event.event_type}
          </span>
          <span className="rounded-full bg-badgebg px-2.5 py-1 text-[10px] font-semibold text-badgetext">
            Custom
          </span>
        </div>
        <h3 className="font-bold text-heading text-base mb-3 line-clamp-1">{event.event_name}</h3>
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
        <div className="flex items-center gap-1 font-bold text-price pt-3 border-t border-divider">
          <Ticket size={14} /> ৳{Number(event.ticket_price).toLocaleString()}
        </div>
      </div>
    </div>
  );
}