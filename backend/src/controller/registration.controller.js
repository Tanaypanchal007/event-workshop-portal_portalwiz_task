const Event = require("../model/event.model");
const Registration = require("../model/registration.model");

// Create Registration
async function createRegistration(req, res) {
  try {
    const { fullName, email, contactNumber, eventId } = req.body;

    if (!fullName || !email || !contactNumber || !eventId) {
      return res.status(400).json({
        message: "Please fill in all fields",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (!/^\+?[0-9\s()-]{7,15}$/.test(contactNumber)) {
      return res.status(400).json({
        message: "Please enter a valid contact number",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Selected event was not found",
      });
    }

    if (event.status === "Completed") {
      return res.status(400).json({
        message: "Registration is closed for this completed event",
      });
    }

    const existing = await Registration.findOne({
      email: email.toLowerCase().trim(),
      event: eventId,
    });

    if (existing) {
      return res.status(409).json({
        message: "This email is already registered for this event",
      });
    }

    const count = await Registration.countDocuments({
      event: eventId,
    });

    if (count >= event.capacity) {
      return res.status(400).json({
        message: "Sorry, this event is full",
      });
    }

    const registration = await Registration.create({
      fullName,
      email,
      contactNumber,
      event: eventId,
    });

    res.status(201).json({
      message: "Registration successful!",
      data: registration,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This email is already registered for this event",
      });
    }

    res.status(400).json({
      message: error.message,
    });
  }
}

// Get All Registrations
async function getAllRegistrations(req, res) {
  try {
    const registrations = await Registration.find()
      .populate("event", "title date category")
      .sort({ createdAt: -1 });

    res.json({
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// Get Registrations for One Event
async function getRegistrationsForEvent(req, res) {
  try {
    const registrations = await Registration.find({
      event: req.params.eventId,
    }).sort({ createdAt: -1 });

    res.json({
      data: registrations,
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid event ID",
    });
  }
}

module.exports = {
  createRegistration,
  getAllRegistrations,
  getRegistrationsForEvent,
};