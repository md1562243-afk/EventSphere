import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, CalendarCheck, Sparkles } from 'lucide-react';
import EventCard from '../components/EventCard';
import api from '../api/axios';

const steps = [
  { icon: Search, title: 'Browse', desc: 'Explore approved event packages by type and price.' },
  { icon: CalendarCheck, title: 'Book', desc: 'Pick your date, time and venue — we handle the rest.' },
  { icon: Sparkles, title: 'Organize', desc: 'Verified organizers bring your event to life.' }
];

export default function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/events', { params: { limit: 12, sort: 'newest' } })
      .then((res) => {
        const all = res.data.events || [];
        // Only show bookable organizer templates on Home — hosted one-off
        // events belong on the full Browse page.
        setEvents(all.filter((e) => Number(e.booking_count) !== 1).slice(0, 8));
      })
      .catch(() => setEvents([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-32 -right-16 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

        <div className="container-app relative py-20 lg:py-28 flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge bg-surface text-primary shadow-soft mb-5">✨ Premium Event Platform</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
              Discover <span className="text-primary">•</span> Book <span className="text-secondary">•</span> Organize
            </h1>
            <p className="text-body text-lg mb-8 max-w-md mx-auto">
              Browse exciting event packages or request your own custom event — all in one platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/events" className="btn-primary flex items-center gap-2">
                Browse Events <ArrowRight size={16} />
              </Link>
              <Link to="/request-event" className="btn-accent">
                Request Custom Event
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20">
        <div className="container-app">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl mb-1">What We Offer</h2>
              <p className="text-body text-sm">Popular event packages you can request — starting prices shown</p>
            </div>
            <Link to="/events" className="text-primary text-sm font-semibold flex items-center gap-1">
              Browse all <ArrowRight size={14} />
            </Link>
          </div>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((e) => (
                <EventCard key={e.event_id} event={e} />
              ))}
            </div>
          ) : (
            <p className="text-body text-sm">No event packages available yet — check back soon.</p>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-surface">
        <div className="container-app">
          <h2 className="text-2xl sm:text-3xl text-center mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="card p-8 text-center"
              >
                <div className="h-14 w-14 mx-auto rounded-2xl bg-badgebg text-primary grid place-items-center mb-5">
                  <s.icon size={24} />
                </div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-body">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-surface">
        <div className="container-app">
          <div className="card p-10 sm:p-16 text-center bg-gradient-to-br from-primary to-secondary text-white">
            <h2 className="text-white text-2xl sm:text-3xl mb-3">Have an event in mind?</h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">Tell us the details and we'll match you with a verified organizer to bring it to life.</p>
            <Link to="/request-event" className="btn-accent inline-flex">Request Custom Event</Link>
          </div>
        </div>
      </section>
    </div>
  );
}