$(function() {

	// Global variables for this file
	console.log("activity.js working");
	var source = $('#activity-template').html();
 	var template = Handlebars.compile(source);
 	var activityName = $('#activity-name').html();
 	var user_id = $('#user-info').attr("data-id");
 	var groupedActivities = {};
 	var activityGSMArray = [];
 	var activityGSMCountArray = [];

 	getSingleActivityGroupedAndSortedByMonth();

 	// Get all activities sorted by day
	function getSingleActivityGroupedAndSortedByMonth(){
		$.get('/api/user/'+user_id+'/'+activityName+'/bymonth/', function(data){
			loadGroupedSortedMonth(data, function(){
				loadGSMGraph();
			});
		});
	}

	// Load data in correct format for graph
 	function loadGroupedSortedMonth(data, callback){
		for(var i = 0; i < data.length; i++){
			activityGSMArray.push(data[i].year + '-' + data[i].month);
			activityGSMCountArray.push(data[i].count);
		}
		callback();
	}

// GRAPHS
	// Activities Grouped and Sorted by Day
	function loadGSMGraph(){

		var trace1 = {
		  x: activityGSMArray,
		  y: activityGSMCountArray,
		  fill: 'tozeroy',
		  type: 'bar'
		};

		var data = [trace1];
		var layout = {width: 1000, height: 400,
					  title: "Total '"+activityName+"' Habits Achieved Over Time", titlefont: {size: 18},
					  yaxis: {title: "Days per Month"}
					 };

		Plotly.newPlot('GSDChart', data, layout);
	}

});