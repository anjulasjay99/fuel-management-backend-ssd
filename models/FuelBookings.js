const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fuelBookingSchema = new Schema({
    bookingId: { type: String, required: true },
    stationName: { type: String, required: true },
    stationCity: { type: String, required: true },
    litres: { type: Number, required: true },
    bkgDate: { type: String, required: true },
    fuelType: { type: String, required: true },
    orderDate: { type: String, required: true },
    vehicleNo: { type: String, required: true },
    vehicleType: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, required: true },
});

const FuelBooking = mongoose.model("fuelBooking", fuelBookingSchema);

module.exports = FuelBooking;
