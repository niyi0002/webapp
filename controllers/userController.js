var User = require('../models/user');
var async = require('async');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
require('dotenv').config();
const Joi = require("@hapi/joi");
// validation
const { auth } = require("../validation");
const user = require('../models/user');
const passport = require("passport");


// Display user create form on GET.
exports.user_create_get = function(req, res, next) {
  res.render('user_form', { title: 'Sign Up'});
};


// Handle user create on POST.
exports.user_create_post = async (req, res) => {

  // validate the user
  const { error } = auth.registerValidation(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message   });
  }

 const isEmailExist = await User.findOne({ email: req.body.email });

  if (isEmailExist)
    return res.status(400).json({ error: "Email already exists" });

// hash the password
const salt = bcrypt.genSalt(10);
const password = bcrypt.hash(req.body.password, salt);

const user = new User({
  name: req.body.name,
  email: req.body.email,
  password,
});

try {
  const savedUser = await user.save();
  req.flash('success_msg','You have now registered!')
  res.redirect('../user/login');
} catch (error) {
  res.status(400).json({ error });
}
}
// Display login create form on GET.
exports.user_login_get = function(req, res, next) {
  res.render('login_form', { title: 'Login', user: req.user});
};

//Handle login on POST  
exports.user_login =   (req, res, next) => {
  passport.authenticate('local',{
    successRedirect : '../user/login/profile',
    failureRedirect : '../user/login',
    failureFlash : true,
    cookie: {secure:false}, 
    })(req,res,next);
}

exports.user_profile = async (req, res) => {
 res.render('userprofile' , {title: 'User Profile'});
}

exports.logout = (req,res) => {
  req.session.destroy();
  req.logout;
  res.redirect('/');
}
  
