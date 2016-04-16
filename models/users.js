var mongoose = require("mongoose");
var schema = mongoose.Schema;
var sha1 = require('sha1');
var userSchema = new schema({
	name: {type: String, required: true, index: {unique: true}},
	password: {type: String, required: true},
	created_on: {type: Date, default: Date.now}
});

module.exports = mongoose.model("User",userSchema);