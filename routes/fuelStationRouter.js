const router = require("express").Router();
let FuelStation = require("../models/FuelStation");
const jwt = require("jsonwebtoken");

//check if user is authorized
const auth = (token) => {
  try {
    jwt.verify(token, "fsToken");
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

//check if email already exists
router.route("/checkEmail").post(async (req, res) => {
  const { email } = req.body;

  await FuelStation.exists({ email })
    .then((data) => {
      if (data) {
        res.status(200).json({ status: true });
      } else {
        res.status(200).json({ status: false });
      }
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

//register fuel station
router.route("/register").post(async (req, res) => {
  const {
    email,
    password,
    stationName,
    type,
    address,
    city,
    province,
    zipCode,
    contactNo,
    ownerName,
    ownerNic,
    ownerContactNo,
    ownerEmail,
  } = req.body;

  let stationId = "";
  let success = false;
  //generating an unique station id
  while (!success) {
    //generate an id
    stationId =
      "FS" +
      Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0");

    //check if generated id already exists
    await FuelStation.exists({ stationId })
      .then((status) => {
        if (status) {
          success = false;
        } else {
          success = true;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const newFuelStation = new FuelStation({
    stationId,
    email,
    password,
    stationName,
    type,
    address,
    city,
    province,
    zipCode,
    contactNo,
    ownerName,
    ownerNic,
    ownerContactNo,
    ownerEmail,
  });

  await newFuelStation
    .save()
    .then(() => {
      res.json({ status: true, msg: "Success" });
    })
    .catch((err) => {
      res.json({ status: false, error: err });
    });
});

//update fuel station
router.route("/updateInfo").put(async (req, res) => {
  const token = req.header("x-access-token");

  if (auth(token)) {
    const {
      stationId,
      stationName,
      type,
      address,
      city,
      province,
      zipCode,
      contactNo,
      ownerName,
      ownerNic,
      ownerContactNo,
      ownerEmail,
    } = req.body;

    await FuelStation.findOneAndUpdate(
      { stationId },
      {
        stationName,
        type,
        address,
        city,
        province,
        zipCode,
        contactNo,
        ownerName,
        ownerNic,
        ownerContactNo,
        ownerEmail,
      }
    )
      .then(() => {
        res.status(200).json({ status: true, msg: "Success" });
      })
      .catch((err) => {
        res.status(400).json({ status: false, error: err });
      });
  } else {
    res.status(400).json("Authentication Failed!");
  }
});

//update fuel station
router.route("/updateEmail").put(async (req, res) => {
  const { stationId, email } = req.body;
  const token = req.header("x-access-token");

  if (auth(token)) {
    await FuelStation.findOneAndUpdate(
      { stationId },
      {
        email,
      }
    )
      .then(() => {
        res.status(200).json({ status: true, msg: "Success" });
      })
      .catch((err) => {
        res.status(400).json({ status: false, error: err });
      });
  } else {
    res.status(400).json("Authentication Failed!");
  }
});

//update fuel station
router.route("/updatePassword").put(async (req, res) => {
  const { stationId, password } = req.body;
  const token = req.header("x-access-token");

  if (auth(token)) {
    await FuelStation.findOneAndUpdate(
      { stationId },
      {
        password,
      }
    )
      .then(() => {
        res.status(200).json({ status: true, msg: "Success" });
      })
      .catch((err) => {
        res.status(400).json({ status: false, error: err });
      });
  } else {
    res.status(400).json("Authentication Failed!");
  }
});

//delete fuel station
router.route("/").delete(async (req, res) => {
  const { stationId } = req.body;
  const token = req.header("x-access-token");

  if (auth(token)) {
    await FuelStation.findOneAndRemove({ stationId })
      .then((data) => {
        res.status(200).json({ status: true, msg: "Success" });
      })
      .catch((err) => {
        res.status(400).json({ status: false, error: err });
      });
  } else {
    res.status(400).json("Authentication Failed!");
  }
});

router.route("/login").post(async (req, res) => {
  const { email, password } = req.body;
  await FuelStation.findOne({ email })
    .then((data) => {
      if (data.password === password) {
        const token = jwt.sign({ ...data }, "fsToken");
        res
          .status(200)
          .json({ status: true, msg: "Success", userData: data, token });
      } else {
        res.status(400).json({ status: false, msg: "Incorrect Credentials" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ status: false, msg: "Incorrect Credentials" });
    });
});

router.route("/").get(async (req, res) => {
  const filterArr = req.query.filter;
  const val = req.query.val;

  if (filterArr === undefined) {
    await FuelStation.find()
      .then((data) => {
        res
          .status(200)
          .json({ status: true, msg: "Fetched Successfully", data });
      })
      .catch((e) => {
        res.status(400).json({ status: false, msg: "Error!" });
      });
  } else {
    if (Array.isArray(filterArr)) {
      await FuelStation.aggregate([
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
      await FuelStation.aggregate([
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
        .catch((err) => {
          console.log(err);
          res.status(400).json({ status: false, msg: "Error!" });
        });
    }
  }
});

module.exports = router;
