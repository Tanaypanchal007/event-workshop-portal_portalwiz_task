const express = require("express");
const cors = require("cors");

const eventRouter = require("./router/event.routes");
const registrationRouter = require("./router/registration.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRouter);
app.use("/api/registrations", registrationRouter);

module.exports = app;