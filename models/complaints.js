const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const complaintsSchema = new Schema({
  email: { type: String, required: true },
  dateofComplaint: { type: String, required: true },
  reason: { type: String, required: true },
  complaintDetails: { type: String, required: true },

});

const Complaint = mongoose.model("complaint", complaintsSchema);

module.exports = Complaint;
