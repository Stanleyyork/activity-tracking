var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Activity = require('./activity'),
    passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
	username: String,
	email: String,
	password: String,
	coachMeProfileUrl: String,
	activities: [{type: Schema.Types.ObjectId, ref: 'Activity'}]
});

UserSchema.plugin(passportLocalMongoose, {
	populateFields: 'activities'
});

var User = mongoose.model('User', UserSchema);
module.exports = User;