$(function() {

	console.log("index.js working");
	
// GLOBAL VARIABLES
	var source = $('#activities-template').html();
 	var template = Handlebars.compile(source);
 	var user_id = $('.headline').attr("user-id");
 	var importObject = {};
 	var activityArray = {'2015': [], '2014': [], '2013': [], '2012': [], 'All': []};
	var activityCountArray = {'2015': [], '2014': [], '2013': [], '2012': []};
	var activityAverageArray = {'2015': [], '2014': [], '2013': [], '2012': []};
	var newActivityArray = [];
	var filterArr = [];
	var streakArray = [];
	var streakCountArray = [];
	var streakLabelArray = [];
	var doWActivityData = [];
	var search_activity = '';
	var activityGSDArray = [];
	var	activityGSDCountArray = [];

// LOADS INITIAL DATA
	getActivitiesCountByGroup(user_id);
	getActivitiesGroupedAndSortedByDay(user_id);
	getStreaks(user_id);

// EVENT LISTENERS
	// Determine which content to have based on whether data exists
 	if($('.headline').attr("user-activity-count") > 0){
 		$('#filename-span').hide();
 		$("#filter-tags").hide();
 		$("#instructions").hide();
 	} else {
 		$('#charts').hide();
 		$('#filename-span').show();
 		$("#activities-list").hide();
 		$("#filter-tags").hide();
 	}

 	// Show upload button if clicked (in navbar)
 	$('#nav-upload').on('click', function(){
 		$('#filename-span').show();
 	});

	// Nav Scrolling conditional
 	$(window).scroll(function(){
		if($(window).scrollTop()>70){
			$('.navbar').css("height", "80");
			$("#filter-tags").show();
			$('#coach-logo-words').hide();
		}
		if($(window).scrollTop()<55){
			$('.navbar').css("height", "60");
			$("#filter-tags").hide();
			$('#coach-logo-words').show();
		}
	});

 	// Acquire search entry and pass to ajax call
	$('#search-form').on('submit', function(e){
		e.preventDefault();
		var activity = ($('#search-query').val())[0].toUpperCase() + ($('#search-query').val()).slice(1);
		getActivitiesCountPerDayOfWeek(activity);
	});
		

 	// Listen for file upload, then pass to upload/parse file
	$("#filename-body").change(function(e) {
		var ext = $("input#filename-body").val().split(".").pop().toLowerCase();
		uploadFile(e, ext, function(){
			console.log("finished, now sending to server...");
			sendActivityToServer();
		});
	});

// FILE UPLOAD AND IMPORT
	// Upload and parse file, then send to sendActivityToServer
	function uploadFile(e, ext, callback){
		var ext = ext;
		if (e.target.files !== undefined) {
			var reader = new FileReader();
			reader.onload = function(e) {
				var row_values = e.target.result.split("\n");
				var header_values = row_values[0].split(",");
				for(var i=1;i<row_values.length;i++) {
					var cell = row_values[i].split(",");
					var data = {};
					var date = cell[2];
					data.user_id = user_id;
					data.activityLabel = cell[1];
					data.originalId = cell[0];
					if(date !== undefined){
						var datetype = new Date(date);
						data.originalDate = datetype;
						data.originalYear = date.slice(0,4);
						data.originalMonth = date.slice(5,7);
						data.originalDay = date.slice(8,10);
						data.originalDayOfWeek = datetype.getDay();
					}
					data.occured = true;
					data.measurementA = "Days";
					data.quantityA = 1;
					data.measurementB = header_values[5];
					data.quantityB = Number(cell[cell.length-4]);
					if(cell[3] !== ''){
						data.measurementC = header_values[3];
						data.quantityC = cell[3];
					}
					data.link = cell[cell.length-1];
					importObject[i] = data;
				}
				callback();
			};
			reader.readAsText(e.target.files.item(0));
		}
		return false;
	}

// AJAX/GET/POST CALLS
	// Send activity to server to save
	function sendActivityToServer(){
		$.ajax({
			type: "POST",
			url: '/api/fileupload',
			data: JSON.stringify(importObject),
			contentType: "application/json",
			success: function (data) {
		        console.log("Sent to server");
		    },
		    error: function (error) {
		      console.error(error);
		    }
		});
	}

	// Get streak data from server, then pass to
	function getStreaks(user_id){
		$.get('/api/user/' + user_id + '/streaks', function(data){
			loadStreakDataIntoArray(data);
		});
	}

	// Get year & activity grouped data from server, then pass to loadDataIntoYear Grouping
	function getActivitiesCountByGroup(user_id){
		$.get('/api/user/' + user_id + '/activitycountbygroup', function(data){
			loadDataIntoYear(data, function(){
				loadTotalGraph(['2015', '2014', '2013', '2012']);
				loadAveragePerWeekGraph(['2015', '2014', '2013', '2012']);
				loadListOfActivities('#activities-list');
			});
		});
	}

	// Get day of week data and pass on to parse
	function getActivitiesCountPerDayOfWeek(activity){
		search_activity = activity;
		$.get('/api/user/'+user_id+'/activityperweek/'+activity, function(data){
			loadDoWDataIntoYear(data, activity, function(){
				loadDayOfWeekGraph(['2015', '2014', '2013', '2012'], activity);
			});
		});
	}

	// Get all activities sorted by day
	function getActivitiesGroupedAndSortedByDay(user_id){
		$.get('/api/user/'+user_id+'/allactivitiesbyday/', function(data){
			loadGroupedSortedDay(data, function(){
				loadGSDGraph();
			});
		});
	}

// PARSING FUNCTIONS (TO GET READY FOR CHARTS)
	// Parse data into array
	function loadStreakDataIntoArray(data){
		for(var i = 0; i < data.length; i++){
			if(data[i]._id !== undefined && data[i]._id !== null){
				streakArray.push(data[i]._id);
				streakCountArray.push(data[i].streakInDays);
				streakLabelArray.push(data[i].date);
			}
		}
		loadStreaksGraph();
	}

	// Parse total activity count data into year arrays
	function loadDataIntoYear(data, callback){
		for(var i = 0; i < data.length; i++){
			if(data[i]._id.originalYear === '2015'){
				activityArray['2015'].push(data[i]._id.activityLabel);
				activityCountArray['2015'].push(data[i].count);
				activityAverageArray['2015'].push(data[i].count/52);
			} else if(data[i]._id.originalYear === '2014') {
				activityArray['2014'].push(data[i]._id.activityLabel);
				activityCountArray['2014'].push(data[i].count);
				activityAverageArray['2014'].push(data[i].count/52);
			} else if(data[i]._id.originalYear === '2013') {
				activityArray['2013'].push(data[i]._id.activityLabel);
				activityCountArray['2013'].push(data[i].count);
				activityAverageArray['2013'].push(data[i].count/52);
			} else if(data[i]._id.originalYear === '2012') {
				activityArray['2012'].push(data[i]._id.activityLabel);
				activityCountArray['2012'].push(data[i].count);
				activityAverageArray['2012'].push(data[i].count/52);
			}
			activityArray['All'].push(data[i]._id.activityLabel);
		}
		paginationLoad();
		callback();
	}

	// Parse day of week count data into year arrays
	function loadDoWDataIntoYear(data, activity, callback){
		var activityDoWArray = {'2015': [], '2014': [], '2013': [], '2012': []};
		var activityDoWAverageArray = {'2015': [], '2014': [], '2013': [], '2012': []};
		for(var i = 0; i < data.length; i++){
			if(data[i]._id.originalYear === '2015'){
				activityDoWArray['2015'].push(data[i]._id.dayOfWeek);
				activityDoWAverageArray['2015'].push((data[i].count/52)*100);
			} else if(data[i]._id.originalYear === '2014') {
				activityDoWArray['2014'].push(data[i]._id.dayOfWeek);
				activityDoWAverageArray['2014'].push((data[i].count/52)*100);
			} else if(data[i]._id.originalYear === '2013') {
				activityDoWArray['2013'].push(data[i]._id.dayOfWeek);
				activityDoWAverageArray['2013'].push((data[i].count/52)*100);
			} else if(data[i]._id.originalYear === '2012') {
				activityDoWArray['2012'].push(data[i]._id.dayOfWeek);
				activityDoWAverageArray['2012'].push((data[i].count/52)*100);
			}
		}
		doWActivityData = [activityDoWArray, activityDoWAverageArray];
		callback();
	}

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

// ADD ACTIVITIES AND FILTERS TO PAGE
	// Load list of years and activities to body (just below headline)
	function loadListOfActivities(location){
		var years = Object.keys(activityArray);
		//activityArray['All'].splice.apply(activityArray['All'], [2, 0].concat(years));
		newActivityArray = activityArray['All'].filter( Boolean ).sort();
		var activitiesHtml = template({ activities: $.unique(newActivityArray) });
		$(location).append(activitiesHtml);
		loadListOfActivitiesNav();
		filterListeners('#habit-filter > span');
	}

	// Load list of years and activities to navbar
 	function loadListOfActivitiesNav(){
 		//var arr = $.unique(newActivityArray);
 		var arr = ['2012', '2013', '2014', '2015'];
	 	if($('#filter-tags > span')[0] === undefined){
			for(var x = 0; x<arr.length; x++){
				$("#filter-tags").append('<span class="label label-default" id="habit-'+arr[x]+'">'+arr[x]+'</span>'+'  ');
			}
			filterListeners('#filter-tags > span');
		}
	}

	// Pagination
 	function paginationLoad(){
 		var arr = $.unique(activityArray['All'].filter( Boolean ).sort());
 		for(var x = 0; x<arr.length; x++){
 			$('#pagination-list').append('<li><a href="/user/'+user_id+'/activity/'+arr[x]+'">'+arr[x]+'</li>');
 		}
 	}

// LISTENER TO CHANGE CHART DATA WHEN FILTERED
	// Listen for and change color of year or habit
	function filterListeners(location){
		$(location).on('click', function(){
 			var filter = $(this)[0].innerText;
 			var habitId = $(this)[0].id;
 			if(Object.keys(activityArray).indexOf(filter) !== -1){
	 			if(filterArr.indexOf(filter) === -1){
	 				filterArr.push(filter);
	 				$('#'+habitId).removeClass('label label-default');
	 				$('#habit-filter > span'+'#'+habitId).removeClass('label label-default');
	    			$('#'+habitId).addClass('label label-primary');
	    			$('#habit-filter > span'+'#'+habitId).addClass('label label-primary');
	 			} else {
	 				filterArr.splice(filterArr.indexOf(filter), 1);
	 				$('#habit-filter > span'+'#'+habitId).removeClass('label label-primary');
	 				$('#'+habitId).removeClass('label label-primary');
	    			$('#habit-filter > span'+'#'+habitId).addClass('label label-default');
	    			$('#'+habitId).addClass('label label-default');
	 			}
	 			loadAveragePerWeekGraph(filterArr);
	 			loadTotalGraph(filterArr);
	 			loadDayOfWeekGraph(filterArr, search_activity);
 			} else {
 				console.log("not a year");
 			}
 		});
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
					  title: "Total Habits Achieved Over Time", titlefont: {size: 18}
					 };

		Plotly.newPlot('GSDChart', data, layout);
	}

	// Day Of Week Graph (includes search)
	function loadDayOfWeekGraph(arr, activity){
		
		var activityDoWArray = doWActivityData[0];
		var activityDoWAverageArray = doWActivityData[1];

		var trace1 = {
		  x: activityDoWArray['2015'],
		  y: activityDoWAverageArray['2015'],
		  name: '2015',
		  type: 'bar'
		};
		var trace2 = {
		  x: activityDoWArray['2014'],
		  y: activityDoWAverageArray['2014'],
		  name: '2014',
		  type: 'bar'
		};
		var trace3 = {
		  x: activityDoWArray['2013'],
		  y: activityDoWAverageArray['2013'],
		  name: '2013',
		  type: 'bar'
		};
		var trace4 = {
		  x: activityDoWArray['2012'],
		  y: activityDoWAverageArray['2012'],
		  name: '2012',
		  type: 'bar'
		};

		var DayOfWeekChart_data = [];
		if(arr.indexOf('2012') !== -1){
			DayOfWeekChart_data.push(trace4);
		}
		if(arr.indexOf('2013') !== -1){
			DayOfWeekChart_data.push(trace3);
		}
		if(arr.indexOf('2014') !== -1){
			DayOfWeekChart_data.push(trace2);
		}
		if(arr.indexOf('2015') !== -1){
			DayOfWeekChart_data.push(trace1);
		}

		if(activityArray['All'].indexOf(activity) !== -1){
			var title = "Probability of Achieving '"+activity+"' Habit on a Specific Day of the Week"
		} else {
			var title = "That habit does not exist";
		}

		var layout = {barmode: 'group', bargroupgap: 0.05, width: 1000, height: 500,
					  yaxis: {title: '%'}, xaxis: {title: 'Day of Week (0 = Sunday)'},
					  title: title, titlefont: {size: 18}
					 };
		Plotly.newPlot('DayOfWeekChart', DayOfWeekChart_data, layout);
	}

	// Streak Graph
	function loadStreaksGraph(){
		var streaks_data = [{
		  type: 'bar',
		  x: streakCountArray,
		  y: streakArray,
		  text: streakLabelArray,
		  orientation: 'h',
		  marker: {color: 'rgb(255,140,0)'}
		}];

		var layout = {title: "Longest Streaks For Each Habit",
			xaxis: {title: "Days"},
			margin: {l: 150},
		};

		Plotly.newPlot('streaksBarChart', streaks_data, layout);
	}

	function loadAveragePerWeekGraph(arr){
		var trace1 = {
		  x: activityArray['2015'],
		  y: activityAverageArray['2015'],
		  name: '2015',
		  type: 'bar'
		};
		var trace2 = {
		  x: activityArray['2014'],
		  y: activityAverageArray['2014'],
		  name: '2014',
		  type: 'bar'
		};
		var trace3 = {
		  x: activityArray['2013'],
		  y: activityAverageArray['2013'],
		  name: '2013',
		  type: 'bar'
		};
		var trace4 = {
		  x: activityArray['2012'],
		  y: activityAverageArray['2012'],
		  name: '2012',
		  type: 'bar'
		};

		var AverageWeekBarChart_data = [];
		if(arr.indexOf('2012') !== -1){
			AverageWeekBarChart_data.push(trace4);
		}
		if(arr.indexOf('2013') !== -1){
			AverageWeekBarChart_data.push(trace3);
		}
		if(arr.indexOf('2014') !== -1){
			AverageWeekBarChart_data.push(trace2);
		}
		if(arr.indexOf('2015') !== -1){
			AverageWeekBarChart_data.push(trace1);
		}

		var layout = {barmode: 'group', bargroupgap: 0.05, width: 1000, height: 500,
					  yaxis: {range: [0, 7], title: 'Days'},
					  title: 'Average Habits Achieved per Week', titlefont: {size: 18}
					 };
		Plotly.newPlot('AverageWeekBarChart', AverageWeekBarChart_data, layout);
	}

	// All Activities Graphs
	function loadTotalGraph(arr){
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

		var totalCountBarChart_data = [];

		if(arr.indexOf('2012') !== -1){
			totalCountBarChart_data.push(trace4);
		}
		if(arr.indexOf('2013') !== -1){
			totalCountBarChart_data.push(trace3);
		}
		if(arr.indexOf('2014') !== -1){
			totalCountBarChart_data.push(trace2);
		}
		if(arr.indexOf('2015') !== -1){
			totalCountBarChart_data.push(trace1);
		}

		var layout = {barmode: 'group', bargroupgap: 0.05, width: 1000, height: 500,
					  yaxis: {range: [0, 365], title: 'Days'},
					  title: 'Total Habits Achieved per Year', titlefont: {size: 18}
					 };
		Plotly.newPlot('totalCountBarChart', totalCountBarChart_data, layout);
	}

});