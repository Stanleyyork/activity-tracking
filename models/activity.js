var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ActivitySchema = new Schema({
	user_id: String,
	activityLabel: String,
	originalActivityLabel: String,
	activityPillar: String,
	activityCategory: String,
	activityHabit: Boolean,
	activitySource: String,
	originalId: String,
	originalDate: Date,
	originalYear: Number,
	originalMonth: Number,
	originalDay: Number,
	orignalDayOfWeek: Number,
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