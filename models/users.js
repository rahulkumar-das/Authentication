const mongoose = require('mongoose');
const crypto = require('crypto');
const passport = require('passport');
var passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:String,
    salt: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
})

//userSchema.plugin(passportLocalMongoose)

userSchema.methods.setPassword= function(password){
    this.salt=crypto.randomBytes(64).toString('hex');
   console.log("this is salt "+this.salt);
    this.password=crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
    console.log("inside setPassowrd "+this.password);
}

userSchema.methods.validatePassword=function(password){
    console.log("Inside valid method")
    console.log(password)
    //console.log(this.salt);
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
    console.log("valid method end")
    return hash === this.password;
}

mongoose.model("User", userSchema) 

