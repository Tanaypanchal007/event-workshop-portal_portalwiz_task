const express = require("express");
const controller = require("../controller/event.controller");

const router = express.Router();

router.get("/dashboard", controller.getDashboard);

router.post("/", controller.createEvent);
router.get("/", controller.getAllEvents);

router.get("/:id", controller.getEventById);
router.put("/:id", controller.updateEvent);
router.delete("/:id", controller.deleteEvent);

module.exports = router;