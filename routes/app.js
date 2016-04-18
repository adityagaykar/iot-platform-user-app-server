var express = require('express');
var router = express.Router(),
mongoose = require("mongoose"),
User = mongoose.model("User"),
sha1 = require('sha1'),
hat = require('hat'),
Apps = mongoose.model('Apps'),
requestify = require('requestify'),
Rule = mongoose.model('rule'),
servers = require('../utils/servers');
var iot_server = servers.iot_platform;
var notification_server = servers.notification_server;

/*GET raw notifications*/
router.get("/notifications/:access_token",function(req,res,next){
	var access_token = req.params.access_token;
	var msgs = [];
	// for(var i = 0; i < 10; i++){
	// 	msgs.push({message: "Message"+i, time_stamp: Date.now()});
	// }
	// res.json(msgs);
	requestify.get("http://"+notification_server.hostname+":"+notification_server.port+"/api/v1.0/pullnotifications/"+access_token)
	.then(function(response){		
		var messages = response.body;
		console.log(messages);
		if(messages) {
			messages = JSON.parse(messages);
			if(messages.length > 0){
				for(var i = 0; i < messages.length; i++){
					msgs.push({message: messages[i].message, time_stamp: messages[i].time_stamp});
				}	
			} else {
				msgs.push({message : "No notifications", time_stamp: ""});
			}	
		} else {
			msgs.push({message : "No notifications", time_stamp: ""});
		}	
		res.json(msgs);
	});
});

/*GET Register app form*/
//localhost:3000/apps/register
router.get("/register",function(req,res,next){
	console.log("here....");
	res.render("register");
});

/* GET registered apps. */
router.get('/:id', function(req, res, next) {
	var user = req.session.user;
	var app_id = req.params.id;
	Apps.findOne({_id: app_id},function(err, app){
		if(app){
			
			Rule.find({app_id: app_id}, function(err, rules){
				res.render("app/home",{name: app.name, rules : rules, user_app_id : app_id, access_token : app.access_token});	
			})
			
			//render the templates			
		}
		else
			res.redirect("/home");
	});
});

/*POST Register to iot platform*/
router.post("/register",function(req,res,next){
	var user = req.session.user;
	var registration_key = req.body.registration_key;
	var app_name = req.body.name;
	var uri = "http://"+iot_server.hostname+":"+iot_server.port+"/api/v1.0/register";
	console.log(registration_key);
	console.log(user);
	//res.send(registration_key+" "+app_name);
	requestify.post(uri, {
	    name : user.name,
	    registration_key: registration_key
	})
	.then(function(response) {
	    // Get the response body (JSON parsed or jQuery object for XMLs)
	    console.log(response);
	    var body = response.getBody();	    
	    if(body.error){
	    	console.log("Error : "+body.error);
	    	res.redirect("/home");
	    }else{
	    	var access_token = body.access_token;
	    	Apps.create({
	    	uid : user._id,
	    	registration_key: registration_key,
	    	access_token : access_token,
	    	name: app_name
		    },function(err,app){
		    	res.redirect("/home");
		    });	
	    }
	    console.log(">"+JSON.stringify(response.getBody()));
	});

});

/*Edit app name page*/
router.get("/update/:id",function(req,res,next){
	var app_id =  req.params.id;
	Apps.findOne({_id: app_id}, function(err,data){
		if(data)
			res.render("edit_app", {app_id : app_id, name: data.name});	
		else
			res.redirect("/home");
	});
	
});

/*Delete app*/

router.get("/delete/:id",function(req,res,next){
	var id = req.params.id;
	Apps.remove({_id: id}).exec();
	res.redirect("/home");
})

module.exports = router;
