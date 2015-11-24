$(function() {

	console.log("validate.js working");
	
	$("#register-form").validate({
		rules: {
		    email: {
		      required: true,
		      email: true
		    }
		}
	});


});