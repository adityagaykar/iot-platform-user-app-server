var mongoose = require("mongoose");
var schema = mongoose.Schema;
var sha1 = require('sha1');
var appsSchema = new schema({
	uid: {type: String, required: true},
	name: {type: String, required: true},
	registration_key: {type: String, required: true},
	access_token: {type: String, required: true},
	created_on: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Apps",appsSchema);