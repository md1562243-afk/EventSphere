import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar } from 'lucide-react';

export default function RegisterPortal() {
  return (
    <div className="container-app py-20">
      <div className="text-center mb-12">
        <h1 className="text-3xl mb-2">Create your account</h1>
        <p className="text-body">Join EventSphere as a user or an organizer</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <Link to="/register/user" className="card p-8 text-center hover:-translate-y-1 transition duration-250">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 text-primary grid place-items-center mb-5">
            <User size={28} />
          </div>
          <h3 className="font-bold text-lg mb-1">User</h3>
          <p className="text-sm text-body">Browse & book events instantly</p>
        </Link>
        <Link to="/register/organizer" className="card p-8 text-center hover:-translate-y-1 transition duration-250">
          <div className="h-16 w-16 mx-auto rounded-2xl bg-primary/10 text-primary grid place-items-center mb-5">
            <Calendar size={28} />
          </div>
          <h3 className="font-bold text-lg mb-1">Organizer</h3>
          <p className="text-sm text-body">Create & manage events (requires admin approval)</p>
        </Link>
      </div>
    </div>
  );
}
