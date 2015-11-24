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

var validatePassword = function (password, callback){
	if (password.length < 8) {
		return callback({code: 422, message: "Password must be at least 8 characteres."});
	}
	return callback(null);
};

UserSchema.plugin(passportLocalMongoose, {
	populateFields: 'activities',
	passwordValidator: validatePassword
});

var User = mongoose.model('User', UserSchema);
module.exports = User;