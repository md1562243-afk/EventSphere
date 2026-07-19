import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ title, links, children }) {
  const { profile, logout, role } = useAuth();
  const navigate = useNavigate();
  const id = profile?.user_id ?? profile?.organizer_id ?? profile?.admin_id;

  return (
    <div className="min-h-screen bg-bgapp">
      <div className="flex">
        <aside className="hidden md:flex flex-col w-64 shrink-0 min-h-screen bg-white border-r border-slate-100 p-6">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wide text-body">{role} Portal</p>
            <h2 className="font-bold text-heading text-lg">{profile?.first_name} {profile?.last_name}</h2>
            {id !== undefined && <p className="text-xs text-body mt-0.5">ID: #{id}</p>}
          </div>
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `rounded-btn px-4 py-2.5 text-sm font-medium transition duration-250 ${
                    isActive ? 'bg-primary text-white' : 'text-body hover:bg-primary/10 hover:text-primary'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="mt-auto flex items-center gap-2 text-sm font-medium text-errorc hover:opacity-80"
          >
            <LogOut size={16} /> Logout
          </button>
        </aside>

        <main className="flex-1 p-5 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-heading mb-6">{title}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}
