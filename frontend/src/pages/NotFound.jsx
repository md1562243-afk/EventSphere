import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-app py-32 text-center">
      <p className="text-6xl font-extrabold text-primary mb-4">404</p>
      <h1 className="text-2xl mb-4">Page not found</h1>
      <Link to="/" className="btn-primary inline-block">Back to Home</Link>
    </div>
  );
}
