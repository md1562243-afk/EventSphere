import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Browse Events' },
  { to: '/request-event', label: 'Request Custom Event' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, role, profile, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = role === 'Admin' ? '/admin/dashboard' : role === 'Organizer' ? '/organizer/dashboard' : '/user/dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="container-app flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-heading">
          <span className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
            <Calendar size={18} />
          </span>
          Event<span className="text-primary">Sphere</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition duration-250 hover:text-primary ${isActive ? 'text-primary' : 'text-body'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} className="flex items-center gap-2 text-sm font-semibold text-heading hover:text-primary">
                <LayoutDashboard size={16} />
                {profile?.first_name || role}
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-1 btn-outline !px-4 !py-2 text-sm">
                <LogOut size={14} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-heading hover:text-primary">
                Login
              </Link>
              <Link to="/register" className="btn-primary !px-5 !py-2.5 text-sm">
                Register
              </Link>
            </>
          )}
        </div>

        <button className="lg:hidden text-heading" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden border-t border-slate-100 bg-white"
          >
            <div className="container-app py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="text-sm font-medium text-body hover:text-primary">
                  {link.label}
                </NavLink>
              ))}
              <div className="h-px bg-slate-100" />
              {isAuthenticated ? (
                <>
                  <Link to={dashboardPath} onClick={() => setOpen(false)} className="text-sm font-semibold text-heading">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="btn-outline text-sm text-left">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-semibold text-heading">
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-center text-sm">
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
