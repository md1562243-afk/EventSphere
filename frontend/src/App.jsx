import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import BrowseEvents from './pages/BrowseEvents';
import EventDetails from './pages/EventDetails';
import RequestCustomEvent from './pages/RequestCustomEvent';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import LoginPortal from './pages/auth/LoginPortal';
import LoginUser from './pages/auth/LoginUser';
import LoginOrganizer from './pages/auth/LoginOrganizer';
import LoginAdmin from './pages/auth/LoginAdmin';
import RegisterPortal from './pages/auth/RegisterPortal';
import RegisterUser from './pages/auth/RegisterUser';
import RegisterOrganizer from './pages/auth/RegisterOrganizer';

import UserDashboard from './pages/user/UserDashboard';
import UserBookings from './pages/user/UserBookings';
import UserPayments from './pages/user/UserPayments';
import UserProfile from './pages/user/UserProfile';

import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import OrganizerEvents from './pages/organizer/OrganizerEvents';
import OrganizerEventForm from './pages/organizer/OrganizerEventForm';
import OrganizerBookings from './pages/organizer/OrganizerBookings';
import OrganizerProfile from './pages/organizer/OrganizerProfile';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrganizers from './pages/admin/AdminOrganizers';
import AdminUsers from './pages/admin/AdminUsers';
import AdminEvents from './pages/admin/AdminEvents';
import AdminBookings from './pages/admin/AdminBookings';
import AdminPayments from './pages/admin/AdminPayments';

export default function App() {
  return (
    <Routes>
      {/* Dashboards render their own full-page layout, no public navbar/footer */}
      <Route path="/user/dashboard" element={<ProtectedRoute role="User"><UserDashboard /></ProtectedRoute>} />
      <Route path="/user/bookings" element={<ProtectedRoute role="User"><UserBookings /></ProtectedRoute>} />
      <Route path="/user/payments" element={<ProtectedRoute role="User"><UserPayments /></ProtectedRoute>} />
      <Route path="/user/profile" element={<ProtectedRoute role="User"><UserProfile /></ProtectedRoute>} />

      <Route path="/organizer/dashboard" element={<ProtectedRoute role="Organizer"><OrganizerDashboard /></ProtectedRoute>} />
      <Route path="/organizer/events" element={<ProtectedRoute role="Organizer"><OrganizerEvents /></ProtectedRoute>} />
      <Route path="/organizer/events/new" element={<ProtectedRoute role="Organizer"><OrganizerEventForm /></ProtectedRoute>} />
      <Route path="/organizer/events/:id/edit" element={<ProtectedRoute role="Organizer"><OrganizerEventForm /></ProtectedRoute>} />
      <Route path="/organizer/bookings" element={<ProtectedRoute role="Organizer"><OrganizerBookings /></ProtectedRoute>} />
      <Route path="/organizer/profile" element={<ProtectedRoute role="Organizer"><OrganizerProfile /></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/organizers" element={<ProtectedRoute role="Admin"><AdminOrganizers /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="Admin"><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/events" element={<ProtectedRoute role="Admin"><AdminEvents /></ProtectedRoute>} />
      <Route path="/admin/bookings" element={<ProtectedRoute role="Admin"><AdminBookings /></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute role="Admin"><AdminPayments /></ProtectedRoute>} />

      {/* Public site with navbar/footer */}
      <Route
        path="*"
        element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<BrowseEvents />} />
                <Route path="/events/:id" element={<EventDetails />} />
                <Route path="/request-event" element={<RequestCustomEvent />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />

                <Route path="/login" element={<LoginPortal />} />
                <Route path="/login/user" element={<LoginUser />} />
                <Route path="/login/organizer" element={<LoginOrganizer />} />
                <Route path="/login/admin" element={<LoginAdmin />} />

                <Route path="/register" element={<RegisterPortal />} />
                <Route path="/register/user" element={<RegisterUser />} />
                <Route path="/register/organizer" element={<RegisterOrganizer />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        }
      />
    </Routes>
  );
}
