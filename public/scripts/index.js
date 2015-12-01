$(function() {

	console.log("index.js working");
	var source = $('#activities-template').html(); // loads the html from .hbs
 	var template = Handlebars.compile(source);
 	var user_id = $('.headline').attr("user-id");

 	if($('.headline').attr("user-activity-count") > 0){
 		$('#upload-body').hide();
 	} else {
 		$('#charts').hide();
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
					var date = cell[2];
					data.activityLabel = cell[1];
					data.originalId = cell[0];
					if(date !== undefined){
						data.originalDate = date;
						data.originalYear = date.slice(0,4);
						console.log(date.slice(0,4));
						data.originalMonth = date.slice(5,7);
						data.originalDay = date.slice(8,10);
					}
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
		activityArray = {'2015': [], '2014': [], '2013': [], '2012': []};
		activityCountArray = {'2015': [], '2014': [], '2013': [], '2012': []};
		yearArray = [];
		for(var i = 0; i < data.length; i++){
			if(data[i]._id.originalYear === 2015){
				activityArray['2015'].push(data[i]._id.activityLabel);
				activityCountArray['2015'].push(data[i].count);
			} else if(data[i]._id.originalYear === 2014) {
				activityArray['2014'].push(data[i]._id.activityLabel);
				activityCountArray['2014'].push(data[i].count);
			} else if(data[i]._id.originalYear === 2013) {
				activityArray['2013'].push(data[i]._id.activityLabel);
				activityCountArray['2013'].push(data[i].count);
			} else if(data[i]._id.originalYear === 2012) {
				activityArray['2012'].push(data[i]._id.activityLabel);
				activityCountArray['2012'].push(data[i].count);
			}
		}

		var trace1 = {
		  x: activityArray['2015'],
		  y: activityCountArray['2015'],
		  name: '2015',
		  type: 'bar'
		};

		var trace2 = {
		  x: activityArray['2014'],
		  y: activityCountArray['2014'],
		  name: '2014',
		  type: 'bar'
		};

		var trace3 = {
		  x: activityArray['2013'],
		  y: activityCountArray['2013'],
		  name: '2013',
		  type: 'bar'
		};

		var trace4 = {
		  x: activityArray['2012'],
		  y: activityCountArray['2012'],
		  name: '2012',
		  type: 'bar'
		};

		var totalCountBarChart_data = [trace1, trace2, trace3, trace4];

		var layout = {barmode: 'group'};

		Plotly.newPlot('totalCountBarChart', totalCountBarChart_data, layout);
	}

});