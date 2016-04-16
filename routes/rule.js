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
/*GET add rule form*/

router.get("/:id/list",function(req, res, next){
	var user_app_id = req.params.id;
	//fetch all rule templates from platform
	Apps.findOne({_id : user_app_id}, function(err, app){
		var uri = "http://localhost:3000/api/v1.0/rules/"+app.access_token;
		requestify.get(uri)
		.then(function(response) {
			var rules = response.body;
			rules = JSON.parse(rules);
			for(rule of rules){
				var str= JSON.stringify(rule);
				rule["description"] = str;
			}					
			res.render("rule/list",{user_app_id : user_app_id, rules: rules});
		});	
	});	
});

/*POST user rule*/

router.post("/add", function(req,res, next){
	var user_app_id = req.body.user_app_id;
	var rule = JSON.parse(req.body.rule);
	var gateways = rule.gateways.gateways;
	var sensor_type = rule.sensor_type_id;
	res.render("rule/add",{user_app_id: user_app_id, gateways: gateways,rule_name: rule.name,rule_id: rule._id, sensor_type: sensor_type});
});

/*POST register rule on platform as well as user-app db*/
router.post("/register",function(req, res, next){
	var user_app_id = req.body.user_app_id;		
	var rule_id = req.body.rule_id;
	var rule_name = req.body.rule_name;
	var uid = req.session.user._id;	
	var name = req.body.name;
	var threshold = req.body.threshold;
	var condition = req.body.condition;
	var status = req.body.status;	
	var frequency = req.body.frequency;	
	var gateway = req.body.gateway.split("@@");
	var gateway_id = gateway[0];
	var gateway_name = gateway[1];
	var sensor_id = req.body.sensor_type;
	console.log("Servers : "+JSON.stringify(servers));
	console.log("hostname : "+iot_server.hostname);
	Apps.findOne({_id: user_app_id},function(err,app){
		var uri = "http://"+iot_server.hostname+":"+iot_server.port+"/api/v1.0/rules/"+app.access_token+"/add";
		requestify.post(uri,{
			uid: uid,
			app_id: user_app_id,
			name: name,
			threshold: threshold,
			condition: condition,
			rule_id: rule_id,
			rule_name: rule_name,
			status: status,
			frequency: frequency,
			gateway_id: gateway_id,
			gateway_name: gateway_name,
			sensor_id: sensor_id
		})
		.then(function(response) {
			var rule = response.body;
			rule = JSON.parse(rule);
			
				Rule.create({
					platform_user_rule_id: rule._id,
					uid: uid,
					app_id: user_app_id,
					name: name,
					threshold: threshold,
					condition: condition,
					rule_id: rule_id,
					rule_name: rule_name,
					status: status,
					frequency: frequency,
					gateway_id: gateway_id,
					gateway_name: gateway_name,
					sensor_id: sensor_id		
				}, function(err, curr_rule){
					res.redirect("/apps/"+app.access_token);
				});
		});										
	});	
});

/*GET update rule*/
router.get("/:id/update",function(req,res,next){
	var user_rule_id = req.params.id;
	Rule.findOne({_id : user_rule_id},function(err, rule){
		res.render("rule/edit",{rule: rule});
	});
});

/*POST register rule on platform as well as user-app db*/
router.post("/update",function(req, res, next){
	var user_app_id = req.body.user_app_id;		
	var uid = req.session.user._id;	
	var name = req.body.name;
	var threshold = req.body.threshold;
	var condition = req.body.condition;
	var status = req.body.status;	
	var frequency = req.body.frequency;	
	var id = req.body.id;
	Apps.findOne({_id: user_app_id},function(err,app){
		var uri = "http://"+iot_server.hostname+":"+iot_server.port+"/api/v1.0/rules/"+app.access_token+"/update";
		requestify.post(uri,{
			id : id,
			name: name,
			threshold: threshold,
			condition: condition,
			status: status,
			frequency: frequency,			
		})
		.then(function(response) {			
			Rule.update({_id: id},{
				id: id,
				name: name,
				threshold: threshold,
				condition: condition,
				status: status,
				frequency: frequency
			},function(err,rule){
				res.redirect("/apps/"+app.access_token);				
			});			
		});										
	});	
});

/*DELETE user rule*/
router.get("/:id/delete",function(req,res,next){
	var id = req.params.id;
	Rule.findOne({_id: id}, function(err,rule){
		Apps.findOne({_id: rule.app_id}, function(err,app){
			var uri = "http://"+iot_server.hostname+":"+iot_server.port+"/api/v1.0/rules/"+app.access_token+"/delete";
			requestify.post(uri,{
				id : rule.platform_user_rule_id				
			})
			.then(function(response) {
				Rule.remove({_id: id}).exec();
				res.redirect("/apps/"+app.access_token)
			});			
		});
		
	});
});
module.exports = router;