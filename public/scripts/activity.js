$(function() {

	// Global variables for this file
	console.log("activity.js working");
	var source = $('#activity-template').html();
 	var template = Handlebars.compile(source);
 	var activityName = $('#activity-name').html();
 	var user_id = $('#user-info').attr("data-id");
 	var groupedActivities = {};
 	var activityGSDArray = [];
 	var activityGSDCountArray = [];

 	getSingleActivityGroupedAndSortedByDay();

 	// Get all activities sorted by day
	function getSingleActivityGroupedAndSortedByDay(){
		$.get('/api/user/'+user_id+'/'+activityName+'/byday/', function(data){
			loadGroupedSortedDay(data, function(){
				loadGSDGraph();
			});
		});
	}

	// Load data in correct format for graph
 	function loadGroupedSortedDay(data, callback){
		for(var i = 0; i < data.length; i++){
			if(i===0){
				activityGSDArray.push(data[i]._id);
			} else {
				activityGSDArray.push(data[i]._id.slice(0,10));
			}
			activityGSDCountArray.push((activityGSDCountArray[i-1] || 0) + data[i].count);
		}
		callback();
	}

// GRAPHS
	// Activities Grouped and Sorted by Day
	function loadGSDGraph(){

		var trace1 = {
		  x: activityGSDArray,
		  y: activityGSDCountArray,
		  fill: 'tozeroy',
		  type: 'scatter'
		};

		var data = [trace1];
		var layout = {width: 1000, height: 400,
					  title: "Total '"+activityName+"' Habits Achieved Over Time", titlefont: {size: 18}
					 };

		Plotly.newPlot('GSDChart', data, layout);
	}

});