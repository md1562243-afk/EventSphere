import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, CalendarCheck, Sparkles, ShieldCheck, Users, TrendingUp } from 'lucide-react';
import api from '../api/axios';
import EventCard from '../components/EventCard';

const steps = [
  { icon: Search, title: 'Browse', desc: 'Explore approved events by type, date, or venue near you.' },
  { icon: CalendarCheck, title: 'Book', desc: 'Reserve your seats or request a fully custom event in minutes.' },
  { icon: Sparkles, title: 'Organize', desc: 'Organizers bring your event to life, verified every step by our team.' }
];

const stats = [
  { icon: Users, label: 'Active Users', value: '12,400+' },
  { icon: CalendarCheck, label: 'Events Hosted', value: '3,150+' },
  { icon: ShieldCheck, label: 'Verified Organizers', value: '480+' },
  { icon: TrendingUp, label: 'Avg. Rating', value: '4.8/5' }
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/events', { params: { sort: 'newest', limit: 4 } })
      .then((res) => setFeatured(res.data.events || []))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-32 -right-16 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

        <div className="container-app relative py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge bg-white text-primary shadow-soft mb-5">✨ Premium Event Platform</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-5">
              Discover <span className="text-primary">•</span> Book <span className="text-secondary">•</span> Organize
            </h1>
            <p className="text-body text-lg mb-8 max-w-md">
              Browse exciting public events or request your own custom event — all in one platform.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/events" className="btn-primary flex items-center gap-2">
                Explore Events <ArrowRight size={16} />
              </Link>
              <Link to="/request-event" className="btn-accent">
                Request Custom Event
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative h-80 sm:h-96"
          >
            <div className="glass card absolute top-0 left-6 w-56 p-4 shadow-soft">
              <p className="text-xs text-body mb-1">Tech Summit 2026</p>
              <p className="font-bold text-heading text-sm">Dec 12 · Dhaka</p>
              <p className="text-xs text-success mt-2">128 seats left</p>
            </div>
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="glass card absolute top-24 right-2 w-52 p-4 shadow-soft"
            >
              <p className="text-xs text-body mb-1">Music Fest</p>
              <p className="font-bold text-heading text-sm">Jan 8 · Chattogram</p>
              <p className="text-xs text-pendingc mt-2">Selling fast</p>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="glass card absolute bottom-2 left-16 w-56 p-4 shadow-soft"
            >
              <p className="text-xs text-body mb-1">Startup Meetup</p>
              <p className="font-bold text-heading text-sm">Feb 2 · Sylhet</p>
              <p className="text-xs text-primary mt-2">Free entry</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20">
        <div className="container-app">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl mb-1">Featured Events</h2>
              <p className="text-body text-sm">Hand-picked events happening soon</p>
            </div>
            <Link to="/events" className="text-primary text-sm font-semibold flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.length > 0 ? (
              featured.map((e) => <EventCard key={e.event_id} event={e} />)
            ) : (
              <p className="text-body col-span-full text-center py-12">No events published yet — check back soon.</p>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
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
                <div className="h-14 w-14 mx-auto rounded-2xl bg-primary/10 text-primary grid place-items-center mb-5">
                  <s.icon size={24} />
                </div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-body">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container-app grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="card p-6 text-center">
              <s.icon className="mx-auto text-secondary mb-3" size={22} />
              <p className="text-2xl font-extrabold text-heading">{s.value}</p>
              <p className="text-sm text-body">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
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
