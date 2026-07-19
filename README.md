# EventSphere

A full-stack Event Management System — browse and book public events, request fully custom events, and manage everything through three role-based portals (User, Organizer, Admin).

## Features

- **Three role-separated portals** — `/login/user`, `/login/organizer`, `/login/admin`, each with its own JWT-based auth
- **Public event browsing** with search, filters (type, date, venue, price), and sorting
- **Two booking flows** — book an approved public event, or request a fully custom event
- **Organizer approval workflow** — organizers register, then wait for admin approval before they can log in
- **Event approval workflow** — every new/edited event returns to `Pending` until an admin approves it
- **Payment verification** — all payments start `Pending`; only admins can confirm them
- **Custom event assignment** — admin assigns an approved organizer to a confirmed custom-event request
- **Role-specific dashboards** with KPIs (bookings, revenue, pending approvals, etc.)
- **Email notifications** for every major workflow step (falls back to console logging if SMTP isn't configured)
- **Fully responsive UI** (mobile → large monitor) in the confirmed Royal Purple / Electric Cyan / Gold design system, with a glassmorphism hero

## Tech Stack

**Frontend:** React (Vite), React Router, Axios, Tailwind CSS, Framer Motion, React Hook Form
**Backend:** Node.js, Express.js, MySQL (mysql2), JWT, bcrypt, Multer, Nodemailer

## Project Structure

```
eventsphere/
├── backend/
│   ├── config/          # database + email config
│   ├── controllers/     # request handlers
│   ├── middleware/      # auth, role checks, error handling, uploads
│   ├── models/          # raw-SQL data access layer
│   ├── routes/          # Express routers
│   ├── services/        # email, booking, payment business logic
│   ├── utils/           # token + validation helpers
│   ├── database/        # schema.sql + seed script
│   ├── uploads/          # uploaded event images
│   ├── app.js
│   └── server.js
└── frontend/
    └── src/
        ├── api/          # axios instance
        ├── context/      # AuthContext
        ├── components/   # Navbar, Footer, EventCard, DashboardLayout, ...
        └── pages/         # public pages + auth/ + user/ + organizer/ + admin/
```

## 1. Database Setup

1. Make sure MySQL 8+ is running locally.
2. Create the schema:
   ```bash
   mysql -u root -p < backend/database/schema.sql
   ```
   This creates the `eventsphere` database and all tables (`User`, `Organizer`, `Admin`, `Event`, `Booking`, `Payment`, `Browse`, and the `*_Phone` tables) exactly per the approved ER diagram.

## 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your MySQL credentials and (optionally) SMTP creds
npm run seed     # creates the first Admin account
npm run dev      # starts the API on http://localhost:5000
```

The seed script creates an admin using `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env` (defaults to `admin@eventsphere.com` / `Admin@12345`). Log in at `/login/admin` with these credentials, then use the platform to approve organizers, events, and payments.

If you don't configure `EMAIL_USER` / `EMAIL_PASS`, the app automatically falls back to logging emails to the console instead of failing — everything else keeps working.

## 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev      # starts the app on http://localhost:5173
```

## Typical Workflow to Try

1. **Register a user** at `/register/user` — you're logged in immediately.
2. **Register an organizer** at `/register/organizer` — account is `Pending`.
3. **Log in as admin** (`/login/admin`) and approve the organizer under *Organizers*.
4. **Log in as the organizer** and create an event — it starts `Pending`.
5. **Approve the event** as admin under *Events* — it's now publicly visible.
6. **Book the event** as the user, choosing a payment method.
7. **Confirm the payment** as admin under *Payments* — the booking becomes `Confirmed`.
8. Try a **custom event request** as a user, then **assign an approved organizer** to it from the admin *Bookings* tab.

## API Overview

All endpoints are prefixed with `/api`.

| Area | Base path | Notes |
|---|---|---|
| Users | `/users` | register, login, profile, phones, password, dashboard, bookings, payments |
| Organizers | `/organizers` | register, login, profile, phones, dashboard, events (CRUD), bookings |
| Admin | `/admin` | login, dashboard, organizer/event/payment approvals, user/organizer/event management, booking monitoring, custom-event assignment |
| Events | `/events` | public browse + details (search/filter/sort query params) |
| Bookings | `/bookings/:id` | generic owner/admin lookup |
| Payments | `/payments/booking/:bookingId` | lookup by booking |

Every response follows `{ success, message?, ...data }`. Errors return `{ success: false, message }`.

## Notes

- The database schema and relationships (composite keys, foreign keys, cardinalities) match the approved ER diagram exactly and are not altered by the application layer.
- Editing an approved event automatically returns it to `Pending` until an admin re-approves it, per the business rules.
- Payments only have two states — `Pending` and `Confirmed` — with no rejected state, matching the spec.
