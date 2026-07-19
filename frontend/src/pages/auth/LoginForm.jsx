import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const CONFIG = {
  User: { endpoint: '/users/login', dashboard: '/user/dashboard', registerPath: '/register/user', profileKey: 'user' },
  Organizer: { endpoint: '/organizers/login', dashboard: '/organizer/dashboard', registerPath: '/register/organizer', profileKey: 'organizer' },
  Admin: { endpoint: '/admin/login', dashboard: '/admin/dashboard', registerPath: null, profileKey: 'admin' }
};

export default function LoginForm({ role, title, subtitle }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const cfg = CONFIG[role];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(cfg.endpoint, { email, password });
      login(res.data.token, role, res.data[cfg.profileKey]);
      navigate(cfg.dashboard);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-app py-16 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl mb-1">{title}</h1>
        <p className="text-body text-sm">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-5">
        <div>
          <label className="block text-sm font-medium text-heading mb-1">Email</label>
          <input type="email" required className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className="block text-sm font-medium text-heading mb-1">Password</label>
          <input type="password" required className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>

        {error && <p className="text-errorc text-sm">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {cfg.registerPath && (
          <p className="text-sm text-center text-body">
            No account? <Link to={cfg.registerPath} className="text-primary font-semibold">Register here</Link>
          </p>
        )}
        <p className="text-xs text-center text-body">
          <Link to="/login" className="hover:text-primary">Choose a different portal</Link>
        </p>
      </form>
    </div>
  );
}
