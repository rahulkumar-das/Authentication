var express = require('express');
var router = express.Router();
const mongoose= require('mongoose');
const passport = require('passport');
const User = mongoose.model("User");


router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',function({body}, res){
   
  if(!Object.values(body).every((val)=> val)){
    return res.send({message:'All fields are required'});

  }
  if(body.password!==body.password_confirm){
    return res.send({message:'Password and confirm password field must match'})
  }
  const user = new User();
  user.firstName = body.first_name.trim();
  user.lastName = body.last_name.trim();
  user.email= body.email;
  console.log("this is inside users.js in route "+body.password);
  user.setPassword(body.password);
  console.log("this is below")

  user.save((err, newUser) => {

    if (err) {
      res.status(400).json(err);

    } else{
      res.status(201).json({ message: "created User", user: newUser});

    }


  });

});

router.post('/login', (req,res)=>{
  if(!req.body.email || !req.body.password){
    return res.status(400).json({ msg: "All fields are required"})
  }
  passport.authenticate("local", (err, user, info)=>{
    if(err){
      return res.status(400).json(err)
    }
    if(user){
      res.status(201).json({msg:"Logged In"})
    }
    else{
      res.status(401).json({msg:"this is else"})
    }
  })(req,res);
})

router.get("/forgot", function(req,res){
  res.status(200).json({msg:"ok"})
})


module.exports = router;


