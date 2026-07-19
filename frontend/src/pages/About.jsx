import React from 'react';
import { Sparkles, ShieldCheck, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="container-app py-16 max-w-3xl">
      <h1 className="text-3xl mb-4">About EventSphere</h1>
      <p className="text-body leading-relaxed mb-8">
        EventSphere is a premium event management platform connecting people who want great experiences
        with the organizers who create them. Whether you're booking a seat at a public event or
        requesting something entirely custom, our verification-first workflow keeps every booking and
        payment transparent.
      </p>
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <Sparkles className="mx-auto text-primary mb-3" size={22} />
          <h3 className="font-bold mb-1">Curated Events</h3>
          <p className="text-sm text-body">Every event is reviewed before it goes live.</p>
        </div>
        <div className="card p-6 text-center">
          <ShieldCheck className="mx-auto text-secondary mb-3" size={22} />
          <h3 className="font-bold mb-1">Verified Payments</h3>
          <p className="text-sm text-body">Admin verification on every transaction.</p>
        </div>
        <div className="card p-6 text-center">
          <Users className="mx-auto text-accent mb-3" size={22} />
          <h3 className="font-bold mb-1">Trusted Organizers</h3>
          <p className="text-sm text-body">Only approved organizers can publish events.</p>
        </div>
      </div>
    </div>
  );
}
