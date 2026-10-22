import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  CalendarDays,
  MapPin,
  Users,
  ArrowUpRight,
  SlidersHorizontal,
} from "lucide-react";
import { getEvents } from "../api";

const categories = [
  "All categories",
  "Technology",
  "Business",
  "Design",
  "Workshop",
];

const fallbackImages = {
  Technology:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
  Business:
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=900&q=80",
  Design:
    "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=900&q=80",
  Workshop:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [sort, setSort] = useState("soonest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch events from the backend
  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getEvents();
      setEvents(response.data || []);
    } catch (error) {
      setError(error.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Search, filter, and sort events
  const filteredEvents = events
    .filter((event) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        event.title.toLowerCase().includes(searchText) ||
        (event.description || "").toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All categories" || event.category === category;

      return matchesSearch && matchesCategory && event.status !== "Completed";
    })
    .sort((a, b) => {
      const firstDate = new Date(a.date);
      const secondDate = new Date(b.date);

      return sort === "soonest"
        ? firstDate - secondDate
        : secondDate - firstDate;
    });

  return (
    <>
      {/* Hero section */}
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            YOUR NEXT GREAT EXPERIENCE STARTS HERE
          </div>

          <h1>
            Ideas grow better
            <br />
            when we <span>meet.</span>
          </h1>

          <p>
            Explore thoughtful events, practical workshops, and people who are
            excited to share what they know.
          </p>

          <a href="#events" className="btn primary">
            Explore events <ArrowUpRight size={17} />
          </a>

          <div className="hero-proof">
            <div className="avatar-stack">
              <span>J</span>
              <span>A</span>
              <span>M</span>
              <span>+</span>
            </div>
            <span>Learn. Connect. Grow.</span>
          </div>
        </div>

        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1100&q=85"
            alt="People collaborating at an event"
          />

          <div className="floating-note">
            <span className="note-icon">
              <CalendarDays size={18} />
            </span>
            <span>
              <strong>Make time for ideas</strong>
              <small>Find your next event</small>
            </span>
          </div>

          <div className="visual-pill">Curiosity looks good on you ✦</div>
        </div>
      </section>

      {/* Events section */}
      <section className="events-section" id="events">
        <div className="section-heading">
          <div>
            <div className="eyebrow">THE COMMUNITY CALENDAR</div>
            <h2>Upcoming events</h2>
            <p>Good people, fresh ideas, and something new to learn.</p>
          </div>

          <span className="event-count">
            {filteredEvents.length}{" "}
            {filteredEvents.length === 1 ? "event" : "events"} found
          </span>
        </div>

        {/* Search and filters */}
        <div className="filters">
          <label className="search-box">
            <Search size={19} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events by name..."
            />
          </label>

          <label className="select-box">
            <SlidersHorizontal size={17} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="select-box">
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="soonest">Date: soonest first</option>
              <option value="latest">Date: latest first</option>
            </select>
          </label>
        </div>

        {/* Loading, error, empty, and event states */}
        {loading ? (
          <div className="empty-state">
            <div className="loader" />
            <h3>Finding events for you...</h3>
          </div>
        ) : error ? (
          <div className="notice error">
            {error}

            <button className="btn small" onClick={loadEvents}>
              Try again
            </button>

            <p>
              Check that the backend server is running and MongoDB is connected.
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <CalendarDays size={26} />
            </div>

            <h3>No events found</h3>
            <p>Try a different search or category, or check back soon.</p>

            <button
              className="btn secondary"
              onClick={() => {
                setSearch("");
                setCategory("All categories");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="event-grid">
            {filteredEvents.map((event) => (
              <article className="event-card" key={event._id}>
                {/* Event image */}
                <div className="event-image">
                  <img
                    src={
                      event.image ||
                      fallbackImages[event.category] ||
                      fallbackImages.Workshop
                    }
                    alt={event.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImages.Workshop;
                    }}
                  />

                  <span className="category-badge">{event.category}</span>

                  <span className="seats-badge">
                    {event.availableSeats} seats left
                  </span>
                </div>

                {/* Event information */}
                <div className="event-content">
                  <div className="event-date">
                    <CalendarDays size={15} />
                    {formatDate(event.date)} <span>·</span> {event.time}
                  </div>

                  <h3>{event.title}</h3>

                  <p className="event-description">{event.description}</p>

                  <div className="event-meta">
                    <span>
                      <MapPin size={15} />
                      {event.venue}
                    </span>

                    <span>
                      <Users size={15} />
                      {event.registrationCount} registered
                    </span>
                  </div>

                  <Link to={`/events/${event._id}`} className="card-link">
                    View details <ArrowUpRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Bottom call to action */}
      <section className="bottom-cta">
        <div className="cta-symbol">
          <span className="sparkles">✳</span>
        </div>

        <div>
          <h2>Make your next connection count.</h2>
          <p>One event can spark a whole new idea.</p>
        </div>

        <a className="btn white-btn" href="#events">
          Find an event <ArrowUpRight size={17} />
        </a>
      </section>
    </>
  );
}
