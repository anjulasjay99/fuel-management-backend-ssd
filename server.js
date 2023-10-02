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
var cookieParser = require("cookie-parser");
const fs = require("fs");
const cookieSession = require("cookie-session");
const passportSetup = require("./passport");
const passport = require("passport");
const authRoute = require("./routes/auth");
dotenv.config();

const app = express();
app.use(
  cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.json());

// MongoDB Connection
const URL = process.env.MONGODB_URL;
mongoose.connect(URL, {
  useUnifiedTopology: true,
});

// Routers
app.use("/auth", authRoute);
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

app.listen(PORT, () => {
  console.log(`Server is up and running on port number ${PORT}`);
});

module.exports = app;
