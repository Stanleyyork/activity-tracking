$(function() {

	console.log("activity.js working");
	var source = $('#activity-template').html();
 	var template = Handlebars.compile(source);
 	var activityName = $('#activity-info').attr("data-id");
 	var user_id = $('#user-info').attr("data-id");
 	var groupedActivities = {};
 	console.log("js: " + activityName);

 	getActivities(function(){
 		loadActivities();
 	});

 	

	function getActivities(callback){
		$.get('/api/user/'+user_id+'/activity/'+activityName, function(data){
			groupedActivities = data;
			console.log(data);
			callback();
		});
	}

	 function loadActivities(){
	 	var activityHtml = template({activities: groupedActivities});
	 	$('#activity-info').append(activityHtml);
 	}

});