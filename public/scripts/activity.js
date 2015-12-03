$(function() {

	console.log("activity.js working");
	var source = $('#activity-template').html();
 	var template = Handlebars.compile(source);
 	var activityName = $('#activity-name').html();
 	var user_id = $('#user-info').attr("data-id");
 	var groupedActivities = {};

 	getActivities(function(){
 		loadActivities();
 	});

 	

	function getActivities(callback){
		$.get('/api/user/'+user_id+'/activity/'+activityName, function(data){
			groupedActivities = data;
			callback();
		});
	}

	 function loadActivities(){
	 	var activityHtml = template({activities: groupedActivities});
	 	$('#activity-info').append(activityHtml);
 	}

});