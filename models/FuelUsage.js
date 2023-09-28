const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fuelUsageSchema = new Schema({
  stationId: { type: String, required: true },
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  pumpedAmount: { type: Number, required: true },
  date: { type: String, required: true },
});

const FuelUsage = mongoose.model("fuelUsage", fuelUsageSchema);

module.exports = FuelUsage;
