import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="container-app py-16 grid lg:grid-cols-2 gap-12">
      <div>
        <h1 className="text-3xl mb-4">Get in touch</h1>
        <p className="text-body mb-8">Questions about a booking or becoming an organizer? Reach out.</p>
        <div className="space-y-4 text-sm text-body">
          <p className="flex items-center gap-3"><Mail size={16} className="text-primary" /> support@eventsphere.com</p>
          <p className="flex items-center gap-3"><Phone size={16} className="text-primary" /> +880 1XXX-XXXXXX</p>
          <p className="flex items-center gap-3"><MapPin size={16} className="text-primary" /> Chattogram, Bangladesh</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-5">
        {sent ? (
          <p className="text-success font-medium">Thanks! We'll get back to you soon.</p>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Name</label>
              <input required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Email</label>
              <input type="email" required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Message</label>
              <textarea rows={4} required className="input-field" />
            </div>
            <button type="submit" className="btn-primary w-full">Send Message</button>
          </>
        )}
      </form>
    </div>
  );
}
