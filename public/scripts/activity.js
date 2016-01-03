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
 	var activityTotalGSMArray = [];
 	var activityTotalGSMCountArray = [];

 	getSingleActivityGroupedAndSortedByMonth();
 	getSingleActivityGroupedAndSortedByMonthTotal();

 	// Get all activity: days per month count
	function getSingleActivityGroupedAndSortedByMonth(){
		$.get('/api/user/'+user_id+'/'+activityName+'/bymonth/', function(data){
			loadGroupedSortedMonth(data, function(){
				loadGSMGraph();
			});
		});
	}

	// Get all activity: total count (not days) per month
	function getSingleActivityGroupedAndSortedByMonthTotal(){
		$.get('/api/user/'+user_id+'/'+activityName+'/bymonthtotal/', function(data){
			loadGroupedSortedMonthTotal(data, function(){
				loadGSMGraphTotal();
			});
		});
	}

	// Load data in correct format for graph (days per month)
 	function loadGroupedSortedMonth(data, callback){
		for(var i = 0; i < data.length; i++){
			activityGSMArray.push(data[i].year + '-' + data[i].month);
			activityGSMCountArray.push(data[i].count);
		}
		callback();
	}

	// Load data in correct format for graph (total count per month)
 	function loadGroupedSortedMonthTotal(data, callback){
		for(var i = 0; i < data.length; i++){
			activityTotalGSMArray.push(data[i].year + '-' + data[i].month);
			activityTotalGSMCountArray.push(data[i].count);
		}
		callback();
	}

// GRAPHS
	// Activities Grouped and Counted DAYS per month
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

	// Activities Grouped and Counted TOTAL per Month
	function loadGSMGraphTotal(){

		var trace1 = {
		  x: activityTotalGSMArray,
		  y: activityTotalGSMCountArray,
		  fill: 'tozeroy',
		  type: 'bar'
		};

		var data = [trace1];
		var layout = {width: 1000, height: 400,
					  title: "Total '"+activityName+"' Achieved Over Time", titlefont: {size: 18},
					  yaxis: {title: "Total per Month"}
					 };

		Plotly.newPlot('GSDTotalChart', data, layout);
	}

});