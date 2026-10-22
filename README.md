# Portalwiz Event & Workshop Management Portal

A full-stack project built using React, Node.js, Express, and MongoDB with a responsive white-and-blue UI.

## Features
- View, search, and filter events.
- Register for events with form validation.
- Prevent duplicate registrations and full-event bookings.
- Track available seats.
- Admin dashboard with event and registration details.
- Create, edit, and delete events.
- Update event status.

## Requirements
- Node.js 18+
- MongoDB
- npm

## 1. Run the Backend

Open a terminal in the `backend` folder:

```bash
npm install
```

Create a `.env` file using `.env.example`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

## 2. Run the Frontend

Open a second terminal in the `frontend` folder:

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## API Routes

| Method - Route - Purpose 

| GET | `/api/events` | Get all events |
| POST | `/api/events` | Create an event |
| GET | `/api/events/:id` | Get event details |
| PUT | `/api/events/:id` | Update an event |
| DELETE | `/api/events/:id` | Delete an event |
| GET | `/api/events/dashboard` | Get dashboard data |
| POST | `/api/registrations` | Register for an event |
| GET | `/api/registrations` | Get all registrations |

