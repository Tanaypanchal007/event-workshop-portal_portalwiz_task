import React from "react";
import { NavLink, Route, Routes, Link } from "react-router-dom";
import { CalendarDays, LayoutDashboard, Sparkles } from "lucide-react";
import EventsPage from "./pages/EventsPage";
import EventDetailsPage from "./pages/EventDetailsPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-icon">
            <CalendarDays size={22} />
          </span>
          <span>
            eventora<small>EVENTS & WORKSHOPS</small>
          </span>
        </Link>
        <nav>
          <NavLink to="/" end>
            Explore Events
          </NavLink>
          <NavLink to="/admin">
            <LayoutDashboard size={16} /> Admin Dashboard
          </NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="*"
            element={
              <div className="empty-state">
                <h2>Page not found</h2>
                <Link className="btn primary" to="/">
                  Back to events
                </Link>
              </div>
            }
          />
        </Routes>
      </main>
      <footer>
        <div className="footer-brand">
          <Sparkles size={17} /> Made for curious minds
        </div>
        <span>Discover something new. Learn together.</span>
      </footer>
    </div>
  );
}
