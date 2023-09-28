const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fuelAllocationSchema = new Schema({
  customerId: { type: String, required: true },
  customerName: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  allocatedAmount: { type: Number, required: true },
  availableAmount: { type: Number, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
});

const FuelAllocation = mongoose.model("fuelAllocation", fuelAllocationSchema);

module.exports = FuelAllocation;
