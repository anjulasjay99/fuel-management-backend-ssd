const router = require("express").Router();
let UnregisteredStation = require("../models/UnregisteredStation");

router.route("/").post(async (req, res) => {
  const { stationId, stationName, reason } = req.body;

  const newRecord = new UnregisteredStation({
    stationId,
    stationName,
    reason,
  });

  await newRecord
    .save()
    .then(() => {
      res.status(200).json({ status: true, msg: "Success" });
    })
    .catch((e) => {
      res.status(400).json({ status: true, msg: "Error!" });
    });
});

module.exports = router;
