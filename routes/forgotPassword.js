var express = require('express');
var router = express.Router();
const mongoose= require('mongoose');
const passport = require('passport');
const User = mongoose.model("User");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
const mailgun = require("mailgun-js");

const DOMAIN = 'YOUR DOMAIN ID';
const api_key = 'YOUR API KEY';
//for more details refer mail-gun website
const mg = mailgun({apiKey: api_key, domain: DOMAIN});

/* router.get("/resetPassword", function(req,res){
    res.sendFile("C:/Users/Rahul/Desktop/LockDown Learning/2020/password/views/forgot.html")
    
  }) */

  router.get('/forgot', function(req, res) {
    res.render("forgot", {error : false, success:false});
  });

  router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
           req.flash('error', 'No account with that email address exists.');
           // return res.redirect('/forgot');
            return res.render("forgot", {error: req.flash('error'), success:false});
          }
  
          user.resetPasswordToken = token;
          console.log(token);
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
         var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: '<YOUR EMAIL>',
            pass: "<YOUR PASSWORD>"
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'Career Site',
          subject: 'Node.js Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
         req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        }); 

        


/* const data = {
	from: 'Rahulkumar Das <me@samples.mailgun.org>',
	to: user.email,
	subject: 'Career Site Password Reset Request',
	text: 'Hi '+ user.firstName+ ' You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
  'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
  'http://' + req.headers.host + '/reset/' + token + '\n\n' +
  'If you did not request this, please ignore this email and your password will remain unchanged.\n'
};
mg.messages().send(data, function (err, body) {
  console.log(body);
  //req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
  done(err, 'done')
}); */
      }
    ], function(err) {
      if (err) return next(err);
      res.render('forgot', {error: false, success:req.flash('success')});
    });
  });


  router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        //req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            //req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password)
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save((err, newUser) => {

                if (err) {
                  res.status(400).json(err);
            
                } else{
                  
                  done(err, newUser);
                }
            
            
              });

              
              /* user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              }); */
            
          } else {
             // req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        /* var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'YOUR EMAIL',
            pass: "YOUR PASSWORD"
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'dasrahulkumar89@mail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          //req.flash('success', 'Success! Your password has been changed.');
          done(err);
        }); */

        const data = {
          from: 'Rahulkumar Das <me@samples.mailgun.org>',
          to: user.email,
          subject: 'Career Site Password Reset Successful',
          text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        mg.messages().send(data, function (err, body) {
          console.log(body);
          done(err, 'done')
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });
  
  
  
  module.exports = router;