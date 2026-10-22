import { useEffect, useState } from "react";
import {
  CalendarDays,
  Users,
  CheckCircle2,
  Clock3,
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  RefreshCw,
} from "lucide-react";

import {
  createEvent,
  deleteEvent,
  getDashboard,
  getEvents,
  getRegistrations,
  updateEvent,
} from "../api";

const blankForm = {
  title: "",
  description: "",
  category: "Technology",
  date: "",
  time: "10:00 AM",
  venue: "",
  capacity: 30,
  status: "Upcoming",
};

export default function AdminPage() {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalRegistrations: 0,
    completedEvents: 0,
  });

  const [form, setForm] = useState(blankForm);
  const [editing, setEditing] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [showRegistrations, setShowRegistrations] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load dashboard data
  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const eventResult = await getEvents();
      const dashboardResult = await getDashboard();
      const registrationResult = await getRegistrations();

      setEvents(eventResult.data || []);
      setStats(dashboardResult.data);
      setRegistrations(registrationResult.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Open create form
  function openCreate() {
    setEditing(null);
    setForm(blankForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // Open edit form
  function openEdit(event) {
    setEditing(event._id);

    setForm({
      title: event.title,
      description: event.description,
      category: event.category,
      date: new Date(event.date).toISOString().slice(0, 10),
      time: event.time,
      venue: event.venue,
      capacity: event.capacity,
      status: event.status,
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  // Handle form inputs
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // Create or update event
  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const eventData = {
        ...form,
        capacity: Number(form.capacity),
        date: new Date(form.date).toISOString(),
      };

      if (editing) {
        await updateEvent(editing, eventData);
        setSuccess("Event updated successfully");
      } else {
        await createEvent(eventData);
        setSuccess("Event created successfully");
      }

      setShowForm(false);
      await loadData();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  // Delete event
  async function handleDelete(event) {
    const confirmDelete = window.confirm(
      `Delete "${event.title}" and its registrations?`,
    );

    if (!confirmDelete) return;

    try {
      await deleteEvent(event._id);
      setSuccess("Event deleted successfully");
      await loadData();
    } catch (error) {
      setError(error.message);
    }
  }

  // Update event status
  async function handleStatusChange(event, status) {
    try {
      await updateEvent(event._id, { status });
      setSuccess("Event status updated");
      await loadData();
    } catch (error) {
      setError(error.message);
    }
  }

  const dashboardCards = [
    {
      label: "Total events",
      value: stats.totalEvents,
      icon: CalendarDays,
      tone: "blue",
    },
    {
      label: "Upcoming events",
      value: stats.upcomingEvents,
      icon: Clock3,
      tone: "purple",
    },
    {
      label: "Total registrations",
      value: stats.totalRegistrations,
      icon: Users,
      tone: "green",
    },
    {
      label: "Completed events",
      value: stats.completedEvents,
      icon: CheckCircle2,
      tone: "orange",
    },
  ];

  return (
    <section className="admin-page">
      <div className="admin-heading">
        <div>
          <div className="eyebrow">YOUR CONTROL CENTRE</div>
          <h1>Admin dashboard</h1>
          <p>Manage your events and registrations.</p>
        </div>

        <button className="btn primary" onClick={openCreate}>
          <Plus size={18} />
          Create event
        </button>
      </div>

      {error && (
        <div className="notice error">
          {error}
          <button className="notice-close" onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="notice success">
          {success}
          <button className="notice-close" onClick={() => setSuccess("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Dashboard cards */}
      <div className="stats-grid">
        {dashboardCards.map((card) => (
          <div className="stat-card" key={card.label}>
            <div className={`stat-icon ${card.tone}`}>
              <card.icon size={21} />
            </div>

            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>Live portal data</small>
          </div>
        ))}
      </div>

      {/* Event management */}
      <div className="admin-panel">
        <div className="panel-heading">
          <div>
            <h2>Event management</h2>
            <p>Manage event details, status and seats.</p>
          </div>

          <div className="panel-actions">
            <button
              className="btn secondary"
              onClick={() => setShowRegistrations(!showRegistrations)}
            >
              <Eye size={16} />
              {showRegistrations ? "Hide" : "View"} registrations
            </button>

            <button className="icon-btn" title="Refresh" onClick={loadData}>
              <RefreshCw size={17} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <div className="loader" />
            <p>Loading dashboard...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <CalendarDays size={32} />
            <h3>No events yet</h3>
            <p>Create your first event to get started.</p>

            <button className="btn primary" onClick={openCreate}>
              <Plus size={16} />
              Create event
            </button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date & time</th>
                  <th>Registrations</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr key={event._id}>
                    <td>
                      <div className="table-event">
                        <div>
                          <strong>{event.title}</strong>
                          <small>
                            {event.category} · {event.venue}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong>
                        {new Date(event.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </strong>

                      <small className="table-subline">{event.time}</small>
                    </td>

                    <td>
                      <strong>
                        {event.registrationCount} / {event.capacity}
                      </strong>

                      <small className="table-subline">
                        {event.availableSeats} seats left
                      </small>
                    </td>

                    <td>
                      <select
                        className={`status-select ${event.status.toLowerCase()}`}
                        value={event.status}
                        onChange={(e) =>
                          handleStatusChange(event, e.target.value)
                        }
                      >
                        <option>Upcoming</option>
                        <option>Ongoing</option>
                        <option>Completed</option>
                      </select>
                    </td>

                    <td>
                      <div className="row-actions">
                        <button
                          className="icon-btn edit"
                          title="Edit event"
                          onClick={() => openEdit(event)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="icon-btn delete"
                          title="Delete event"
                          onClick={() => handleDelete(event)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Registration table */}
      {showRegistrations && (
        <div className="admin-panel registrations-panel">
          <div className="panel-heading">
            <div>
              <h2>All registrations</h2>
              <p>{registrations.length} registration(s) across all events.</p>
            </div>
          </div>

          {registrations.length === 0 ? (
            <p className="muted">No registrations yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Attendee</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Event</th>
                    <th>Registered</th>
                  </tr>
                </thead>

                <tbody>
                  {registrations.map((registration) => (
                    <tr key={registration._id}>
                      <td>
                        <strong>{registration.fullName}</strong>
                      </td>
                      <td>{registration.email}</td>
                      <td>{registration.contactNumber}</td>
                      <td>{registration.event?.title || "Event deleted"}</td>
                      <td>
                        {new Date(registration.createdAt).toLocaleDateString(
                          "en-IN",
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Create and edit form */}
      {showForm && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <div className="modal">
            <div className="modal-heading">
              <div>
                <div className="eyebrow">EVENT DETAILS</div>
                <h2>{editing ? "Edit event" : "Create a new event"}</h2>
              </div>

              <button className="icon-btn" onClick={() => setShowForm(false)}>
                <X />
              </button>
            </div>

            {error && <div className="notice error">{error}</div>}

            <form className="event-form" onSubmit={handleSubmit}>
              <label className="span-two">
                Event title
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  minLength="3"
                  maxLength="100"
                  placeholder="Enter event title"
                />
              </label>

              <label>
                Category
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option>Technology</option>
                  <option>Business</option>
                  <option>Design</option>
                  <option>Workshop</option>
                </select>
              </label>

              <label>
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option>Upcoming</option>
                  <option>Ongoing</option>
                  <option>Completed</option>
                </select>
              </label>

              <label>
                Date
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Time
                <input
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  placeholder="10:00 AM"
                />
              </label>

              <label className="span-two">
                Venue
                <input
                  name="venue"
                  value={form.venue}
                  onChange={handleChange}
                  required
                  placeholder="Enter venue"
                />
              </label>

              <label>
                Seat capacity
                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </label>

              <label className="span-two">
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  required
                  minLength="10"
                  placeholder="Describe the event"
                />
              </label>

              <div className="form-actions span-two">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button className="btn primary" disabled={saving}>
                  {saving
                    ? "Saving..."
                    : editing
                      ? "Save changes"
                      : "Create event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
