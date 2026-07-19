import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, ShieldCheck } from 'lucide-react';

const portals = [
  { role: 'user', icon: User, title: 'User', desc: 'Browse & Book Events', path: '/login/user' },
  { role: 'organizer', icon: Calendar, title: 'Organizer', desc: 'Create & Manage Events', path: '/login/organizer' },
  { role: 'admin', icon: ShieldCheck, title: 'Admin', desc: 'Manage Platform', path: '/login/admin' }
];

export default function LoginPortal() {
  return (
    <div className="container-app py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl mb-2">Welcome back</h1>
        <p className="text-body">Choose your portal to continue</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {portals.map((p) => (
          <Link key={p.role} to={p.path} className="card p-8 text-center hover:-translate-y-1 transition duration-250">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 text-primary grid place-items-center mb-5">
              <p.icon size={28} />
            </div>
            <h3 className="font-bold text-lg mb-1">{p.title}</h3>
            <p className="text-sm text-body">{p.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
