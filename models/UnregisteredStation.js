const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UnregisteredStationSchema = new Schema({
  stationId: { type: String, required: true },
  stationName: { type: String, required: true },
  reason: { type: String, required: true },
});

const UnregisteredStation = mongoose.model(
  "UnregisteredStation",
  UnregisteredStationSchema
);

module.exports = UnregisteredStation;
