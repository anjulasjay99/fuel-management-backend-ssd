const router = require("express").Router();
const FuelOrder = require("../models/FuelOrder");
const { calculatePayment } = require("../utils/payments");

//fetch all fuel orders
router.route("/:id").get(async (req, res) => {
  const stationId = req.params.id;
  const filterArr = req.query.filter;
  const val = req.query.val;

  if (filterArr === undefined) {
    await FuelOrder.find({ stationId })
      .then((data) => {
        res
          .status(200)
          .json({ status: true, msg: "Fetched Successfully", data });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ status: false, msg: "Error!" });
      });
  } else {
    if (Array.isArray(filterArr)) {
      await FuelOrder.aggregate([
        {
          $match: {
            $or: [
              {
                stationId: { $regex: stationId, $options: "i" },
              },
            ],
          },
        },
        {
          $match: {
            $or: filterArr.map((filter) => {
              let obj = {};
              obj[filter] = { $regex: val, $options: "i" };
              return obj;
            }),
          },
        },
      ])
        .then((data) => {
          res
            .status(200)
            .json({ status: true, msg: "Fetched Successfully", data });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({ status: false, msg: "Error!" });
        });
    } else {
      let obj = {};
      obj[filterArr] = { $regex: val, $options: "i" };
      await FuelOrder.aggregate([
        {
          $match: {
            $or: [
              {
                stationId: { $regex: stationId, $options: "i" },
              },
            ],
          },
        },
        {
          $match: {
            $or: [obj],
          },
        },
      ])
        .then((data) => {
          res
            .status(200)
            .json({ status: true, msg: "Fetched Successfully", data });
        })
        .catch((e) => {
          res.status(400).json({ status: false, msg: "Error!" });
        });
    }
  }
});

//place new fuel order
router.route("/").post(async (req, res) => {
  const {
    stationId,
    email,
    type,
    amount,
    timeOfDelivery,
    payment,
    address,
    city,
    contactNo,
    province,
    zipCode,
  } = req.body;

  const refNo = "FO" + Date.now().toString();
  const status = "In Progress";

  const newOrder = new FuelOrder({
    stationId,
    refNo,
    email,
    type,
    amount,
    orderDate: new Date().toISOString().split("T")[0],
    timeOfDelivery,
    payment,
    status,
    address,
    city,
    province,
    contactNo,
    zipCode,
  });

  newOrder
    .save()
    .then(() => {
      res.status(200).json({ status: true, msg: "Success" });
    })
    .catch((err) => {
      res.status(400).json({ status: false, error: err });
    });
});

//endpoint used for calculating order payemnt
router.route("/calculatePayment").post(async (req, res) => {
  const { type, amount } = req.body;

  if (type === undefined || amount === undefined) {
    res.status(400).json({ msg: "Missing values" });
  } else {
    const payment = calculatePayment(type, amount);
    if (payment === -1) {
      res.status(400).json({ msg: "Invalid fuel type" });
    } else {
      res.status(200).json({ msg: "Success", payment });
    }
  }
});

module.exports = router;
