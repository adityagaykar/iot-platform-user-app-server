var mongoose = require("mongoose");
var schema = mongoose.Schema;
var sha1 = require('sha1');
var ruleSchema = new schema({
	platform_user_rule_id: {type: String, required: true},
	uid: {type: String, required: true},
	app_id: {type: String, required: true},
	name: {type: String, required: true},
	threshold : {type: String, required: true},
	condition : {type: String, required: true},
	rule_id : {type: String, required: true},
	rule_name : {type: String, required: true},
	status : {type: String, required: true},
	frequency : {type: String, required: true},
	gateway_name:{type: String, required: true},
	gateway_id:{type: String, required: true},
	sensor_id:{type: String, required: true},
	created_on: {type: Date, default: Date.now}
});

module.exports = mongoose.model("rule",ruleSchema);