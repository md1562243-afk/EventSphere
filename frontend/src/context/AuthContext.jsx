import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('es_token'));
  const [role, setRole] = useState(() => localStorage.getItem('es_role'));
  const [profile, setProfile] = useState(() => {
    const raw = localStorage.getItem('es_profile');
    return raw ? JSON.parse(raw) : null;
  });

  const login = useCallback((newToken, newRole, newProfile) => {
    localStorage.setItem('es_token', newToken);
    localStorage.setItem('es_role', newRole);
    localStorage.setItem('es_profile', JSON.stringify(newProfile));
    setToken(newToken);
    setRole(newRole);
    setProfile(newProfile);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('es_token');
    localStorage.removeItem('es_role');
    localStorage.removeItem('es_profile');
    setToken(null);
    setRole(null);
    setProfile(null);
  }, []);

  const value = { token, role, profile, isAuthenticated: !!token, login, logout, api };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
