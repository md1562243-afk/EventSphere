import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-heading text-slate-300 mt-24">
      <div className="container-app py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 font-extrabold text-xl text-white mb-3">
            <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
              <Calendar size={18} />
            </span>
            EventSphere
          </div>
          <p className="text-sm text-slate-400">Discover • Book • Organize — one platform for every event.</p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">Platform</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/events" className="hover:text-secondary">Browse Events</Link></li>
            <li><Link to="/request-event" className="hover:text-secondary">Request Custom Event</Link></li>
            <li><Link to="/register" className="hover:text-secondary">Become an Organizer</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-secondary">About</Link></li>
            <li><Link to="/contact" className="hover:text-secondary">Contact</Link></li>
            <li><Link to="/login/admin" className="hover:text-secondary">Admin Portal</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm tracking-wide">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2"><Mail size={14} /> support@eventsphere.com</li>
            <li className="flex items-center gap-2"><Phone size={14} /> +880 1XXX-XXXXXX</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> Chattogram, Bangladesh</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} EventSphere. All rights reserved.
      </div>
    </footer>
  );
}
