const router = require("express").Router();
const FuelAllocation = require("../models/FuelAllocation");
const validator = require("validator"); // Added this line to import validator

//new fuel allocation
router.route("/").post(async (req, res) => {
  const {
    customerId,
    customerName,
    vehicleNumber,
    allocatedAmount,
    availableAmount,
    startDate,
    endDate,
  } = req.body;

  await FuelAllocation.replaceOne(
    { customerId, vehicleNumber, startDate },
    {
      customerId,
      customerName,
      vehicleNumber,
      allocatedAmount,
      availableAmount,
      startDate,
      endDate,
    },
    { upsert: true }
  )
    .then(() => {
      res.status(200).json({ msg: "Success" });
    })
    .catch((error) => {
      res.status(400).json({ msg: "Error", error });
    });
});

//get fuel allocations
router.route("/").get((req, res) => {
  FuelAllocation.find()
    .then((data) => {
      res.status(200).json({ msg: "Success", data });
    })
    .catch((error) => {
      res.status(400).json({ msg: "Error", error });
    });
});

//get fuel allocations by customer id
router.route("/:id").get((req, res) => {
  const customerId = req.params.id;
  FuelAllocation.find({ customerId })
    .then((data) => {
      res.status(200).json({ msg: "Success", data });
    })
    .catch((error) => {
      res.status(400).json({ msg: "Error", error });
    });
});

// Get Fuel Allocation by Customer
router.route("/byCus/:id").post((req, res) => {
  const id = req.params.id;
  let { toDate, fromDate } = req.body; // Changed to let to allow modification below

  // Sanitize user input before logging
  toDate = validator.escape(toDate); // Added to sanitize the input
  fromDate = validator.escape(fromDate); // Added to sanitize the input

  console.log(toDate, fromDate);

  FuelAllocation.find({
    customerId: id,
    startDate: { $gt: fromDate, $lte: toDate },
  })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ msg: "error" });
    });
});

module.exports = router;
