var express = require('express');
var router = express.Router(),
mongoose = require("mongoose"),
User = mongoose.model("User"),
sha1 = require('sha1');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//POST user
router.post("/",function(req,res,next){
	var name = req.body.name;
	var password = req.body.password;
	console.log(name);
	console.log(password);
	User.create({
		name: name,
		password: sha1(password)
	},function(err,user){
		if(err)
			res.redirect("/signup");
		else
			res.redirect("/home");
	});
});

module.exports = router;
