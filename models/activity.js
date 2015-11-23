var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ActivitySchema = new Schema({
	activityLabel: String,
	activityCategory: String,
	originalId: Number,
	originalDate: Date,
	occured: Boolean,
	measurementA: String,
	quantityA: Number,
	measurementB: String,
	quantityB: Number,
	// Note that third measurement is optional in many cases and a STRING, not a number
	measurementC: String,
	quantityC: String,
	link: String
});

var Activity = mongoose.model('Activity', ActivitySchema);
module.exports = Activity;