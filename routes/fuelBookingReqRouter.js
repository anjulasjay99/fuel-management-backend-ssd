const router = require("express").Router();
const fuelBooking = require("../models/FuelBookings");

//fetch all fuel booking requests
router.route("/:id").get(async (req, res) => {
    const stationName = req.params.id;

    await fuelBooking.find({ stationName })
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

//update a booking
router.route("/update/:id").put(async (req, res) => {
    const id = req.params.id;
    let data = new fuelBooking(req.body);

    await fuelBooking.findByIdAndUpdate(id, {
        status: data.status,
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