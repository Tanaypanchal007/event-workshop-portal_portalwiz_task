const Event = require("../model/event.model");
const Registration = require("../model/registration.model");

// Create Event
async function createEvent(req, res) {
  try {
    const event = await Event.create(req.body);

    res.status(201).json({
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      message: error.code === 11000
        ? "An event with this title already exists"
        : error.message,
    });
  }
}

// Get All Events
async function getAllEvents(req, res) {
  try {
    const events = await Event.find().sort({ date: 1 });
    const data = [];

    for (const event of events) {
      const count = await Registration.countDocuments({
        event: event._id,
      });

      data.push({
        ...event.toObject(),
        registrationCount: count,
        availableSeats: Math.max(0, event.capacity - count),
      });
    }

    res.status(200).json({
      message: "Events fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// Get Single Event
async function getEventById(req, res) {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const count = await Registration.countDocuments({
      event: event._id,
    });

    res.json({
      data: {
        ...event.toObject(),
        registrationCount: count,
        availableSeats: Math.max(0, event.capacity - count),
      },
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid event ID",
    });
  }
}

// Update Event
async function updateEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const count = await Registration.countDocuments({
      event: event._id,
    });

    if (
      req.body.capacity !== undefined &&
      Number(req.body.capacity) < count
    ) {
      return res.status(400).json({
        message: "Capacity cannot be less than existing registrations",
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    res.status(400).json({
      message: error.code === 11000
        ? "An event with this title already exists"
        : error.message,
    });
  }
}

// Delete Event
async function deleteEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    await Registration.deleteMany({ event: event._id });
    await event.deleteOne();

    res.json({
      message: "Event and its registrations deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid event ID",
    });
  }
}

// Dashboard
async function getDashboard(req, res) {
  try {
    const events = await Event.find();
    const totalRegistrations = await Registration.countDocuments();
    const now = new Date();

    let upcomingEvents = 0;
    let completedEvents = 0;

    for (const event of events) {
      if (
        event.status === "Upcoming" &&
        new Date(event.date) >= now
      ) {
        upcomingEvents++;
      }

      if (event.status === "Completed") {
        completedEvents++;
      }
    }

    res.json({
      data: {
        totalEvents: events.length,
        upcomingEvents,
        completedEvents,
        totalRegistrations,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getDashboard,
};