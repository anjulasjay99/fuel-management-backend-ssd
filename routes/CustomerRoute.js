const router = require("express").Router();
const Customer = require("../models/Customer");
const FuelAllocation = require("../models/FuelAllocation");
const QRCode = require("qrcode");

//Fetch all customers
router.route("/").get(async (req, res) => {
  await Customer.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

// Fetch customer details

router.route("/:email").get(async (req, res) => {
  const email = req.params.email;

  await Customer.findOne({ email })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json({ error: err });
    });
});

// Route to check whether email already exists

router.route("/checkEmail").post(async (req, res) => {
  const { email } = req.body;

  await Customer.exists({ email })
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
// Register Customer

router.route("/register").post(async (req, res) => {
  // Array to store vehicles.
  var vehiclesArr = [];

  var qr_code;
  var vid = 1;

  req.body.vehicles.forEach(function (vehicle) {
    var vehicle = {
      vehicleId: vid,
      vehicleType: vehicle.vehicleType,
      vehicleChassis: vehicle.vehicleChassis,
      vehicleNumber: vehicle.vehicleNumber,
    };

    vehiclesArr.push(vehicle);
    console.log(vehiclesArr);
  });

  // Generate QR code
  await QRCode.toDataURL(req.body.email)
    .then((url) => {
      qr_code = url;
      console.log(req.body);
      const customer = new Customer({
        code: qr_code,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        telNo: req.body.telNo,
        password: req.body.password,
        vehicles: vehiclesArr,
      });
      customer
        .save()
        .then((data) => {
          res.status(200).json({ msg: "Success" });
        })
        .catch((err) => {
          res.status(400).json({ error: err });
        });
    })
    .catch((err) => {
      console.log(err);
    });

  // Inserting data to db
});

// Edit Customer - Email can not be updated
router.route("/edit").put(async (req, res) => {
  const { name, surname, telNo, email } = req.body;

  await Customer.findOneAndUpdate(
    { email },
    {
      name,
      surname,
      telNo,
    }
  )
    .then((data) => {
      res.status(200).json({ msg: "Success" });
    })
    .catch((err) => {
      res.status(400).json({ err: "Error" });
    });
});
// Unregister Customer

router.route("/unregister/:email").delete(async (req, res) => {
  const email = req.params.email;
  console.log(email);
  await Customer.findOneAndDelete({ email })
    .then(() => {
      res.status(200).json({ msg: "Success" });
    })
    .catch((err) => {
      res.status(400).json({ msg: "Error" });
    });
});

// Add Vehicles

router.route("/addVehicle/:email").post(async (req, res) => {
  const email = req.params.email;
  const vehicle = req.body;
  var vid;
  var max;
 //   Generate ID for Vehicle
  // while(!success){
  //   await Customer.exists({ email : email , vehicleId : vid }).then((status) =>{
  //     if(status){
  //       success = false;
  //       vid++;
  //     }
  //     else{
  //       success = true;
  //     }
  //   })
  // }

  Customer.findOne({email : email} , {vehicles : 1}).then((data) =>{

    // var idArr = [];
    // data.forEach((vehicle) =>{
    //   idArr.push(vehicle.vehicleId);
    // })

    // // Finding Maximum ID 
    // max = Math.max(...vid);
    // console.log(max);
    console.log(data);
    // data = JSON.parse(data);
    // console.log(data);
    max = Math.max(...data.map(o => o.vehicleId))
    console.log(max);
  })
  const newVh = {
    vehicleId: "1",
    vehicleType: vehicle.vehicleType,
    vehicleChassis: vehicle.vehicleChassis,
    vehicleNumber: vehicle.vehicleNumber,
  };
  Customer.updateOne({ email: email }, { $push: { vehicles: newVh } })
    .then((data) => {
      res.status(200).json({ msg: "Vehicle Added" });
    })
    .catch((err) => {
      res.status(400).json({ msg: err });
    });
});

// List Vehicles

router.route("/getVehicles/:email").get((req, res) => {
  const email = req.params.email;

    Customer.findOne({email : email} , {vehicles : 1}).then((data) =>{
        console.log(data);
        res.status(200).json(data);
    }).catch((err) =>{
        console.log(err);
        res.status(400).json({msg:err});
    })
})

// Remove Vehicle

router.route("/removeVehicle/:email").post((req,res) =>{
    const email = req.params.email;
    const { vehicleNumber }  = req.body
    Customer.updateOne( {email : email} , { $pull : { vehicles : { vehicleNumber : vehicleNumber}}}).then((data) =>{
        console.log(data);
        res.status(200).json({msg:"Deletion Succesfull"});
    }).catch((err) =>{
        console.log(err);
        res.status(400).json({msg : err});
    })
})

// Report

// Customer Login

router.route("/login").post(async (req, res) => {
  const { email, password } = req.body;
  await Customer.findOne({ email })
    .then((data) => {
      if (password == data.password) {
        res
          .status(200)
          .json({ msg: "Valid Credentials", status: true, userData: data });
      } else {
        res.status(200).json({ msg: "Invalid Password", status: false });
      }
    })
    .catch((err) => {
      res.status(200).json({ msg: "Invalid Email", status: false });
    });
});

// Password Confirmation Route

router.route("/pass/:email").post(async(req,res) =>{
  const email = req.params.email;
  const { password } = req.body;
  console.log(password);
  await Customer.findOne( {email}).then((data) =>{

    if(data.password === password){
      res.json({status : true});
    }
    else{
      res.json({status : false});
    }
  }).catch((err) =>{
    res.json({msg:"Fetch pass error"});
  })
})

// Get Available Fuel Amount

router.route('/getFuel/:id').get(async(req,res) =>{
  const id = req.params.id;
 await FuelAllocation.aggregate(
  [
    {
      $match : 
        { "customerId" : id  }
    },
    {
      $group:
      {
        _id : { customerId : id   } , availableAmount : { $sum : "$availableAmount" }
      }
    }
  ]
 ).then((data)=>{
  res.status(200).json(data);
 })

})

// Get Available fuel per vehicle

router.route("getFuel/:vehicleNo").get((req,res)=>{
  const vehicleNo = req.params.vehicleNo;
  FuelAllocation.findOne({ vehicleNumber : vehicleNo }).then((data)=>{
    res.status(200).json(data);
  }).catch((err)=>{
    res.status(400).json(err);
  })
})

module.exports = router;
