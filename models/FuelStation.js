const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fuelStationSchema = new Schema({
  stationId: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  stationName: { type: String, required: true },
  type: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  zipCode: { type: Number, required: true },
  contactNo: { type: Number, required: true },
  ownerName: { type: String, required: true },
  ownerNic: { type: String, required: true },
  ownerContactNo: { type: Number, required: true },
  ownerEmail: { type: String, required: true },
});

const FuelStation = mongoose.model("fuelStation", fuelStationSchema);

module.exports = FuelStation;
