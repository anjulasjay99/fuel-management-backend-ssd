const router = require("express").Router();
const fuelBooking = require("../models/FuelBookings");

//fetch all fuel bookings
router.route("/:id").get(async (req, res) => {
  const email = req.params.id;

  await fuelBooking.find({ email })
    .then((data) => {
      res
        .status(200)
        .json({ status: true, msg: "Fetched Successfully", data });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ status: false, msg: "Error!" });
    });
});

//create new fuel booking
router.route("/").post(async (req, res) => {
  const {
    vehicleType,
    vehicleNo,
    bkgDate,
    email,
    litres,
    fuelType,
    stationName,
    stationCity,
  } = req.body;

  const bookingId = "RES - " + Date.now().toString();
  const status = "Pending";

  const newFuelBkg = new fuelBooking({
    bookingId,
    orderDate: new Date().toISOString().split("T")[0],
    vehicleType,
    vehicleNo,
    bkgDate,
    email,
    litres,
    fuelType,
    stationName,
    stationCity,
    status
  });

  newFuelBkg
    .save()
    .then(() => {
      res.status(200).json({ status: true, msg: "Success" });
    })
    .catch((err) => {
      res.status(400).json({ status: false, error: err });
    });
});

//get specific fuel booking by Id
router.route("/get/:id").get(async (req, res) => {
  const id = req.params.id;
  console.log(id);
  await fuelBooking.findById(id).then((fuelBooking) => {
    res.json(fuelBooking);
    console.log(fuelBooking);
  }).catch((err) => {
    console.log(err);
  })
});

//delete a booking
router.route("/delete/:id").delete((req, res) => {
  const id = req.params.id;

  fuelBooking
    .findByIdAndDelete(id)
    .then(() => {
      res.status(200).json("Deleted Successfully!");
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json("Error!");
    });
});

//update a booking
router.route("/update/:id").put(async (req, res) => {
  const id = req.params.id;
  let data = new fuelBooking(req.body);

  await fuelBooking.findByIdAndUpdate(id, {
    stationName: data.stationName,
    stationCity: data.stationCity,
    litres: data.litres,
    bkgDate: data.bkgDate,
    fuelType: data.fuelType,
    vehicleNo: data.vehicleNo,
    vehicleType: data.vehicleType,
  })
    .then(() => {
      res.status(200).json("Updated Successfully!");
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json("Error!");
    });
});

module.exports = router;