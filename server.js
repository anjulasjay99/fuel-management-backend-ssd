const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const csurf = require("csurf");
const fuelStationRouter = require("./routes/fuelStationRouter");
const fuelOrderRouter = require("./routes/fuelOrderRouter");
const customerRouter = require("./routes/CustomerRoute");
const complaintRouter = require("./routes/complaintsRouter");
const unregisteredStationRouter = require("./routes/unregisteredStationRouter");
const fuelAllocationRouter = require("./routes/fuelAllocationRouter");
const fuelStationReport = require("./routes/fuelStationReport");
const fuelUsageRouter = require("./routes/fuelUsageRouter");
const adminRouter = require("./routes/adminRouter");
const fuelBookingRouter = require("./routes/fuelBookingsRouter");
const fuelBookingReqRouter = require("./routes/fuelBookingReqRouter");
var cookieParser = require('cookie-parser')
const fs = require("fs");
const app = express();
dotenv.config();

const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser())
// Enable csurf protection
const csrfProtection = csurf({ cookie: true }); //Configure csrf protection
app.use(csrfProtection); // Enable csrf protection

// Modified MongoDB Connection to use Docker Swarm Secrets if available
let URL;
if (process.env.MONGODB_URL_FILE) {
  // If the MONGODB_URL_FILE environment variable is set, read the MongoDB URL from the specified file
  // This is where Docker Swarm injects the secret at runtime
  URL = fs.readFileSync(process.env.MONGODB_URL_FILE, "utf8").trim();
} else {
  // If MONGODB_URL_FILE is not set, fall back to using the MONGODB_URL environment variable
  // This could be the case in a development environment or other environments without Docker Swarm Secrets
  URL = process.env.MONGODB_URL;
}

mongoose.connect(URL, {
  useUnifiedTopology: true,
});

//routers
app.use("/fuelStations", fuelStationRouter);
app.use("/fuelOrders", fuelOrderRouter);

app.use("/customers", customerRouter);

app.use("/complaints", complaintRouter);
app.use("/unregisterStation", unregisteredStationRouter);
app.use("/fuelAllocations", fuelAllocationRouter);
app.use("/fuelStationReport", fuelStationReport);
app.use("/fuelUsage", fuelUsageRouter);
app.use("/admin", adminRouter);
app.use("/fuelBookings", fuelBookingRouter);
app.use("/fuelBookingRequests", fuelBookingReqRouter);

// Added a route to get the CSRF token for the client-side if needed
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongo DB connection success!");
});

// CSRF Error Handling
app.use((err, req, res, next) => {
  if (err.code !== "EBADCSRFTOKEN") return next(err);

  // Handle CSRF token errors here
  res.status(403);
  res.send("Session has expired or form tampered with.");
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port number ${PORT}`);
});

module.exports = app;
