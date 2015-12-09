$(function() {

	console.log("editprofile.js working");
	var user_id = $('#username-header').attr("user-id");
	var activityLabelsArray = [];
	var hiddenValues = {};
	getActivityLabels(formatReceivedData);

	// Get all activitiyLabels
	function getActivityLabels(callback){
		$.get('/api/user/' + user_id + '/activitylabels', function(data){
			callback(data, loadActivityLabelsOnPage);
		});
	}

	function formatReceivedData(data, callback){
		data.forEach(function(d){
			activityLabelsArray.push(d._id);
		});
		callback();
	}

	function loadActivityLabelsOnPage(){
		for(var x = 0; x<activityLabelsArray.length; x++){
 			$('#activity-list-hidden-form').append('<input type="checkbox" name="vehicle-'+activityLabelsArray[x]+'" value="'+activityLabelsArray[x]+'">'+" "+activityLabelsArray[x]+'<br>');
 		}
	}

	$('#edit-profile-hidden-activities-form').on('submit', function(e){
		//e.preventDefault();
		data = $("#edit-profile-hidden-activities-form").closest('form').find('input:checkbox:checked');
		formatDataToSend(data, function(){
			sendHiddenValuesToServer();
		});
	});

	function formatDataToSend(data, callback){
		for(var i = 0; i<data.length; i++){
			hiddenValues[data[i].defaultValue] = true;
		}
		callback();
	}

	function sendHiddenValuesToServer(){
		$.ajax({
			type: "POST",
			url: '/api/user/hiddenvalues',
			data: hiddenValues,
			success: function (data) {
		        console.log("Sent hidden values to server.");
		    },
		    error: function (error) {
		      console.log("Client-side error: ");
		      console.error(error);
		    }
		});
	}

});