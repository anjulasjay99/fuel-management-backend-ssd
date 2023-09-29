const router = require("express").Router();
const complaint = require("../models/complaints");
const csrf = require("csurf");
//var cookieParser = require('cookie-parser')
var csrfProtection = csrf({ cookie: true })

var csrftoken = '';
//var parseForm = bodyParser.urlencoded({ extended: false })

var csrfProtection = csrf({ cookie: true })

//fetch all feedbacks
router.route('/').get((req,res)=>{
  complaint.find((err,data)=>{
      if(err){
          console.log(err)
      }else{
          res.json(data)
      }
  })
})

console.log(csrfProtection)
router.get('/getCSRFToken', csrfProtection,(req, res) => {
  console.log(csrfProtection)
  csrftoken = req.csrfToken()
  res.json({ CSRFToken: req.csrfToken() });
});



//add new complaint
router.route("/").post(async(req,res) =>{
  //console.log("hi")
  //console.log(csrftoken)
  //console.log(req)
  //console.log(req.body)
  //res.set('Access-Control-Allow-Origin', 'csrfprotection-client.com');
  

  const { email, dateofComplaint, reason, complaintDetails,csrfTokenState} = req.body;
  console.log(csrfTokenState)
  console.log(csrftoken)
  if(csrftoken == csrfTokenState){
    
    const newComplaint = new complaint({
      email,
      dateofComplaint,
      reason,
      complaintDetails,
    });
    console.log(newComplaint)
    newComplaint
      .save()
      .then((data) => {
        res.status(200).json();
        console.log(res)
      })
      .then((err) => {
        res.status(400).json();
      });
  }else{
    console.log("hi")
    res.status(303).json();
  }
  
});

// //add new complaint
// router.route("/").post(async (req, res) => {
 
//   console.log(csrftoken)
//   //console.log(req)
//   console.log(req.body)
//   //res.set('Access-Control-Allow-Origin', 'csrfprotection-client.com');
//   const { email, dateofComplaint, reason, complaintDetails,csrfTokenState} = req.body;
//   console.log(csrfTokenState)
//   const newComplaint = new complaint({
//     email,
//     dateofComplaint,
//     reason,
//     complaintDetails,
//   });

//   newComplaint
//     .save()
//     .then((data) => {
//       res.status(200).json();
//     })
//     .then((err) => {
//       res.status(400).json();
//     });
// });





//get specific complaint
router.route("/get/:id").get(async(req,res) =>{
  const id = req.params.id;
  console.log(id);
  await complaint.findById(id).then((complaint)=>{
    res.json(complaint);
    console.log(complaint)
  }).catch((err) =>{
    console.log(err);
  })
})



//delete a complaint
router.route("/delete/:id").delete((req, res) => {
    const id = req.params.id;
  
    complaint
      .findByIdAndDelete(id)
      .then(() => {
        res.status(200).json("Deleted Successfully!");
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json("Error!");
      });
  });
//get complaint by email
router.route("/get/user/:email").get(async(req,res) =>{
  const email = req.params.email;
  console.log(email);
  await complaint.find({email}).then((complaint)=>{
    res.json(complaint);
    console.log(complaint)
  }).catch((err) =>{
    console.log(err);
  })
})



//update a complaint
router.route("/update/:id").post(function (req, res) {
  complaint.findById(req.params.id, function (err, complaint) {
    if (!complaint) res.status(404).send("reservation is not found");
    else 
    complaint.email = req.body.email;
    complaint.dateofComplaint = req.body.dateofComplaint;
    complaint.reason = req.body.reason;
    complaint.complaintDetails = req.body.complaintDetails;
    complaint
      .save()
      .then((complaint) => {
        res.json("Complaint updated!");
      })
      .catch((err) => {
        res.status(400).send("Update not possible");
      });
  });
});

module.exports = router;