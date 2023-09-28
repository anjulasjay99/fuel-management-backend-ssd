const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fuelOrderSchema = new Schema({
  stationId: { type: String, required: true },
  refNo: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  orderDate: { type: String, required: true },
  timeOfDelivery: { type: String, required: true },
  payment: { type: Number, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  zipCode: { type: Number, required: true },
  contactNo: { type: Number, required: true },
  status: { type: String, required: true },
});

const FuelOrder = mongoose.model("fuelOrder", fuelOrderSchema);

module.exports = FuelOrder;
