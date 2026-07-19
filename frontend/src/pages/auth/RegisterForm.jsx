import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const CONFIG = {
  User: { endpoint: '/users/register', dashboard: '/user/dashboard', loginPath: '/login/user', profileKey: 'user', immediateLogin: true },
  Organizer: { endpoint: '/organizers/register', dashboard: null, loginPath: '/login/organizer', profileKey: 'organizer', immediateLogin: false }
};

export default function RegisterForm({ role, title, subtitle }) {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', password: '', phone_no: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const cfg = CONFIG[role];

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(cfg.endpoint, form);
      if (cfg.immediateLogin) {
        login(res.data.token, role, res.data[cfg.profileKey]);
        navigate(cfg.dashboard);
      } else {
        setSuccess('Registration successful! Your account is pending admin approval — you can log in once approved.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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

      {success ? (
        <div className="card p-8 text-center">
          <p className="text-success font-medium mb-4">{success}</p>
          <Link to={cfg.loginPath} className="btn-primary inline-block">Go to Login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card p-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-heading mb-1">First name</label>
              <input required className="input-field" value={form.first_name} onChange={update('first_name')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-heading mb-1">Last name</label>
              <input required className="input-field" value={form.last_name} onChange={update('last_name')} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Email</label>
            <input type="email" required className="input-field" value={form.email} onChange={update('email')} placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Phone number</label>
            <input className="input-field" value={form.phone_no} onChange={update('phone_no')} placeholder="+8801XXXXXXXXX" />
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-1">Password</label>
            <input type="password" required minLength={8} className="input-field" value={form.password} onChange={update('password')} placeholder="At least 8 characters" />
          </div>

          {error && <p className="text-errorc text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Creating account...' : 'Register'}
          </button>

          <p className="text-sm text-center text-body">
            Already have an account? <Link to={cfg.loginPath} className="text-primary font-semibold">Login</Link>
          </p>
        </form>
      )}
    </div>
  );
}
