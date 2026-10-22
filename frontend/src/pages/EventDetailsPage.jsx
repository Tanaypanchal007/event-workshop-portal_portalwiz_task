import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Users,
  CheckCircle2,
} from "lucide-react";

import { getEvent, registerForEvent } from "../api";

export default function EventDetailsPage() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
  });

  // Get event details
  async function loadEvent() {
    try {
      const result = await getEvent(id);
      setEvent(result.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvent();
  }, [id]);

  // Handle form inputs
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Register for event
  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");
    setSaving(true);

    try {
      const result = await registerForEvent({
        ...form,
        eventId: id,
      });

      setMessage(result.message);

      setForm({
        fullName: "",
        email: "",
        contactNumber: "",
      });

      await loadEvent();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="empty-state">
        <div className="loader" />
        <h3>Loading event...</h3>
      </div>
    );
  }

  // Event not found
  if (!event) {
    return (
      <div className="empty-state">
        <h2>{error || "Event not found"}</h2>
        <Link className="btn primary" to="/">
          Back to events
        </Link>
      </div>
    );
  }

  const date = new Date(event.date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const full = event.availableSeats <= 0;
  const completed = event.status === "Completed";

  const seatPercentage = Math.min(
    100,
    Math.max(0, (event.availableSeats / event.capacity) * 100),
  );

  return (
    <section className="detail-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={17} />
        Back to all events
      </Link>

      <div className="detail-layout">
        <div className="detail-main">
          <div className="detail-title-row">
            <div>
              <div className="eyebrow">EVENT DETAILS</div>
              <h1>{event.title}</h1>
            </div>

            <span className={`status-pill ${event.status.toLowerCase()}`}>
              {event.status}
            </span>
          </div>

          <span className="category-badge">{event.category}</span>

          <p className="detail-description">{event.description}</p>

          <div className="detail-facts">
            <div>
              <CalendarDays />
              <span>
                <small>DATE</small>
                <strong>{date}</strong>
              </span>
            </div>

            <div>
              <Clock3 />
              <span>
                <small>TIME</small>
                <strong>{event.time}</strong>
              </span>
            </div>

            <div>
              <MapPin />
              <span>
                <small>VENUE</small>
                <strong>{event.venue}</strong>
              </span>
            </div>

            <div>
              <Users />
              <span>
                <small>SEATS LEFT</small>
                <strong>
                  {event.availableSeats} of {event.capacity}
                </strong>
              </span>
            </div>
          </div>

          <div className="detail-about">
            <h2>About this event</h2>
            <p>{event.description}</p>
          </div>
        </div>

        {/* Registration form */}
        <aside className="registration-card">
          <div className="registration-top">
            <span className="registration-icon">
              <CalendarDays />
            </span>

            <div>
              <span className="eyebrow">SAVE YOUR SPOT</span>
              <h2>Join this event</h2>
            </div>
          </div>

          <p className="registration-hint">
            It only takes a minute to register.
          </p>

          <div className="seat-meter">
            <div>
              <span>Availability</span>
              <strong>{event.availableSeats} spots left</strong>
            </div>

            <div className="meter-track">
              <span style={{ width: `${seatPercentage}%` }} />
            </div>
          </div>

          {message && (
            <div className="notice success">
              <CheckCircle2 size={18} />
              {message}
            </div>
          )}

          {error && <div className="notice error">{error}</div>}

          {full || completed ? (
            <div className="full-message">
              {completed
                ? "Registration is closed for this event."
                : "This event is fully booked."}
            </div>
          ) : (
            <form className="registration-form" onSubmit={handleSubmit}>
              <label>
                Full name
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  minLength="2"
                  maxLength="80"
                />
              </label>

              <label>
                Email address
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                Contact number
                <input
                  type="tel"
                  name="contactNumber"
                  value={form.contactNumber}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  required
                  pattern="[+]?[0-9 ()-]{7,15}"
                  title="Enter a valid phone number"
                />
              </label>

              <button className="btn primary full-width" disabled={saving}>
                {saving ? "Registering..." : "Confirm registration"}
                <span>→</span>
              </button>

              <small className="privacy-note">
                Your details are used for this event registration.
              </small>
            </form>
          )}
        </aside>
      </div>
    </section>
  );
}
