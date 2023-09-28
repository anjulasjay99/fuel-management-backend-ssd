const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({

    code : { type : String , required : true},
    name : { type : String , required : true },
    surname : { type : String , required : true },
    email : { type : String , required : true },
    telNo : { type : String , required : true },
    password : { type : String , required : true},
    vehicles : [{
        vehicleId : { type : String , required : true},
        vehicleType : { type : String , required : true },
        vehicleChassis : { type : String , required : true },
        vehicleNumber : { type : String , required : true}
    }]

});

const Customer = mongoose.model("customer" , customerSchema);
module.exports = Customer;