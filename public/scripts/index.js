$(function() {

	console.log("index.js working");
	var source = $('#activities-template').html(); // loads the html from .hbs
 	var template = Handlebars.compile(source);
 	var user_id = $('.headline').attr("user-id");
 	if($('.headline').attr("user-activity-count") > 0){
 		$('#upload-body').hide();
 	}
 	
 	getActivitiesCountByGroup(user_id);


	$("#filename").change(function(e) {
		console.log("inside filename change");
		var ext = $("input#filename").val().split(".").pop().toLowerCase();
		if (e.target.files !== undefined) {
			var reader = new FileReader();
			reader.onload = function(e) {
				var row_values = e.target.result.split("\n");
				var header_values = row_values[0].split(",");
				for(var i=1;i<row_values.length;i++) {
					var cell = row_values[i].split(",");
					var data = {};
					data.activityLabel = cell[1];
					data.originalId = cell[0];
					data.originalDate = cell[2];
					data.occured = true;
					data.measurementA = "Days";
					data.quantityA = 1;
					data.measurementB = header_values[5];
					data.quantityB = cell[5];
					if(cell[3] !== ''){
						data.measurementC = header_values[3];
						data.quantityC = cell[3];
					}
					data.link = cell[8];
					sendPostToServer(data);
				}
			};
			reader.readAsText(e.target.files.item(0));
		}
		return false;
	});

	function sendPostToServer(content){
		$.ajax({
			type: "POST",
			url: '/api/activity',
			data: content,
			success: function (data) {
		        console.log("Sent to server");
		    },
		    error: function (error) {
		      console.error(error);
		    }
		});
	}

	function getActivitiesCountByGroup(user_id){
		$.get('/api/user/' + user_id + '/activitycountbygroup', function(data){
			loadActivitiesCountByGroupOnPage(data);
		});
	}

	function loadActivitiesCountByGroupOnPage(data){
		// var activitiesHtml = template({ activitycountbygroup: data });
		// $('#activities-list').prepend(activitiesHtml);
		activityArray = [];
		activityCountArray = [];
		for(var i = 0; i < data.length; i++){
			activityArray.push(data[i]._id);
			activityCountArray.push(data[i].count);
		}
		var totalCountBarChart_data = [
		  {
		    x: activityArray,
	    	y: activityCountArray,
		    type: 'bar'
		  }
		];

		Plotly.newPlot('totalCountBarChart', totalCountBarChart_data);
		}

});