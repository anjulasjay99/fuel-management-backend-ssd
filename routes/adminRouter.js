const router = require("express").Router();
const Admin = require("../models/Admin");

router.route("/login").post(async (req, res) => {
  const { email, password } = req.body;

  await Admin.findOne({ email })
    .then((data) => {
      if (data.password === password) {
        res.status(200).json({ status: true, msg: "Success", userData: data });
      } else {
        res.status(400).json({ status: false, msg: "Incorrect Credentials" });
      }
    })
    .catch(() => {
      res.status(400).json({ status: false, msg: "Incorrect Credentials" });
    });
});

module.exports = router;
