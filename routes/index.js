var express = require('express');
var router = express.Router(),
mongoose = require("mongoose"),
Apps = mongoose.model("Apps"),
User = mongoose.model("User"),
requestify = require('requestify'),
sha1 = require('sha1');

/* GET home page. */
router.get('/', function(req, res, next) {
  var user = req.session.user;
  if(user){
  	res.redirect("/home");
  } else {
  	res.redirect("/login");
  }
});

/*Login page*/
router.get("/login",function(req,res,next){
	res.render("login");
});

/*Home page*/
router.get('/home',function(req,res,next){
	var user = req.session.user;	
	if(user){
		User.findOne({name:user.name, password:user.password},function(err,user){
			if (err)
				throw err;
			if (user){
				Apps.find({uid: user._id},function(err, apps){
					res.render("home",{apps: apps, user: user});				
				});
			} else {
				req.session.error = "Invalid Username";
				res.redirect("/");
			}
		});
	} else {
		req.session.error = "Please login";
		res.redirect("/");
	}
});

/*POST login*/
router.post("/login",function(req,res,next){
	var name = req.body.username;
	var password = sha1(req.body.password);
	console.log(name);
	console.log(password);
	User.findOne({name:name, password:password},function(err,user){
		if (err)
			throw err;
		if (user){
			req.session.user = user;			
			res.redirect("/home");
		} else {
			req.session.error = "Invalid Username";
			res.redirect("/");
		}
	});
});

/*Register page*/
router.get("/signup",function(req,res,next){
	res.render("signup");
});

/*GET: logout */

router.get("/logout",function(req,res,next){
	var user = req.session.user;
	if(user)
		delete req.session.user;
	if(req.session.error)
		delete req.session.error;
	res.redirect("/");
});
module.exports = router;
