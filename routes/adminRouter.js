const router = require("express").Router();
const Admin = require("../models/Admin");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require('express-mongo-sanitize');

// Enable mongo-sanitize middleware
router.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.log("NoSql injection is encountered")
    },
  })
);



const apiLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	limit: 20, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: 'draft-7', // Set `RateLimit` and `RateLimit-Policy` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next) => {
    // Log a message when the rate limit is exceeded
    console.log("Dos attack is encountered")
    console.log("Rate limiter exceeded for IP:", req.ip);
    res.status(429).json({
      status: false,
      msg: "Too many login attempts. Please try again after one minute.",
    });
    //next(); // Continue with the route handler
  },
	// store: ... , // Use an external store for more precise rate limiting
})



router.route("/login").post( apiLimiter,async (req, res) => {
  const { email, password } = req.body;
  console.log(password)
  
  const user = await Admin.findOne({ email, password }).exec().then((data)=>{
    console.log(data)
    if(data!=null){
      res.status(200).json({ status: true, msg: "Success", userData: data })
    }else{
      res.status(200).json({ status: false, msg: "Incorrect Credentials", userData: data })
    }
  }

  ).catch(() => {
           res.status(400).json({ status: false, msg: "Incorrect Credentials" });
  });


//   await Admin.findOne({ email })
//     .then((data) => {
//       if (data.password === password) {
//         res.status(200).json({ status: true, msg: "Success", userData: data });
//       } else {
//         res.status(400).json({ status: false, msg: "Incorrect Credentials" });
//       }
//     })
//     .catch(() => {
//       res.status(400).json({ status: false, msg: "Incorrect Credentials" });
//     });
  });

// // Handle the rate limiter error message
// router.use((req, res, next) => {
//   if (req.rateLimit && req.rateLimit.message) {
//     console.log(req.rateLimit.message)
//     res.status(429).json({ status: false, msg: req.rateLimit.message });
//   } else {
//     next();
//   }
// });


module.exports = router;
