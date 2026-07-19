const transporter = require('../config/email');
require('dotenv').config();

const FROM = process.env.EMAIL_FROM || '"EventSphere" <noreply@eventsphere.com>';

function wrap(title, bodyHtml) {
  return `
  <div style="font-family: Poppins, Arial, sans-serif; max-width: 560px; margin: 0 auto; background:#F8FAFC; padding:32px;">
    <div style="background:#FFFFFF; border-radius:18px; padding:32px; box-shadow:0 12px 30px rgba(0,0,0,.08);">
      <h2 style="color:#1E293B; margin-top:0;">${title}</h2>
      <div style="color:#475569; font-size:15px; line-height:1.6;">${bodyHtml}</div>
      <p style="margin-top:32px; color:#94A3B8; font-size:12px;">EventSphere · Discover • Book • Organize</p>
    </div>
  </div>`;
}

async function send(to, subject, html) {
  try {
    await transporter.sendMail({ from: FROM, to, subject, html });
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err.message);
  }
}

const emailService = {
  // ---------- USER ----------
  userWelcome: (to, firstName) =>
    send(to, 'Welcome to EventSphere', wrap('Welcome aboard 👋', `<p>Hi ${firstName}, your EventSphere account is ready. Start browsing events or request a custom one anytime.</p>`)),

  userBookingReceived: (to, eventName) =>
    send(to, 'Booking received', wrap('Booking received', `<p>We've received your booking for <strong>${eventName}</strong>. Your payment is currently <strong>Pending</strong> verification.</p>`)),

  userPaymentPending: (to, eventName) =>
    send(to, 'Payment pending', wrap('Payment pending', `<p>Your payment for <strong>${eventName}</strong> is awaiting verification by our team.</p>`)),

  userPaymentConfirmed: (to, eventName) =>
    send(to, 'Payment confirmed', wrap('Payment confirmed ✅', `<p>Your payment for <strong>${eventName}</strong> has been confirmed. Your booking is now confirmed!</p>`)),

  userBookingCancelled: (to, eventName) =>
    send(to, 'Booking cancelled', wrap('Booking cancelled', `<p>Your booking for <strong>${eventName}</strong> has been cancelled.</p>`)),

  userOrganizerAssigned: (to, eventType) =>
    send(to, 'Organizer assigned to your event', wrap('Organizer assigned', `<p>Great news — an organizer has been assigned to your custom <strong>${eventType}</strong> request. They'll be in touch soon.</p>`)),

  // ---------- ORGANIZER ----------
  organizerRegistrationPending: (to, firstName) =>
    send(to, 'Registration received', wrap('Application received', `<p>Hi ${firstName}, thanks for applying to organize on EventSphere. Your account is pending admin approval.</p>`)),

  organizerApproved: (to, firstName) =>
    send(to, "You're approved!", wrap('Approved ✅', `<p>Hi ${firstName}, your organizer account has been approved. You can now log in and start creating events.</p>`)),

  organizerEventPending: (to, eventName) =>
    send(to, 'Event submitted for review', wrap('Event submitted', `<p>Your event <strong>${eventName}</strong> has been submitted and is pending admin approval.</p>`)),

  organizerEventApproved: (to, eventName) =>
    send(to, 'Event approved', wrap('Event approved ✅', `<p>Your event <strong>${eventName}</strong> is now live and visible to users.</p>`)),

  organizerNewBooking: (to, eventName) =>
    send(to, 'New booking received', wrap('New booking', `<p>You have a new booking for <strong>${eventName}</strong>.</p>`)),

  organizerCustomEventAssigned: (to, eventType) =>
    send(to, 'New custom event assigned', wrap('Custom event assigned', `<p>You've been assigned a custom <strong>${eventType}</strong> event. Please review the details in your dashboard.</p>`)),

  // ---------- ADMIN ----------
  adminNewOrganizer: (to, name) =>
    send(to, 'New organizer registration', wrap('New organizer', `<p><strong>${name}</strong> has applied to become an organizer and is awaiting approval.</p>`)),

  adminNewEvent: (to, eventName) =>
    send(to, 'New event submission', wrap('New event submitted', `<p><strong>${eventName}</strong> was submitted and needs review.</p>`)),

  adminPendingPayment: (to, eventName) =>
    send(to, 'Pending payment verification', wrap('Payment needs verification', `<p>A payment for <strong>${eventName}</strong> is awaiting verification.</p>`)),

  adminCustomEventRequest: (to, eventType) =>
    send(to, 'New custom event request', wrap('New custom event request', `<p>A user submitted a custom <strong>${eventType}</strong> event request.</p>`)),

  adminDailySummary: (to, stats) =>
    send(to, 'Daily summary report', wrap('Daily summary', `<ul>
      <li>New bookings: ${stats.newBookings || 0}</li>
      <li>New users: ${stats.newUsers || 0}</li>
      <li>Pending payments: ${stats.pendingPayments || 0}</li>
      <li>Pending approvals: ${stats.pendingApprovals || 0}</li>
    </ul>`))
};

module.exports = emailService;
