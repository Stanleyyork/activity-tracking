$(function() {

	console.log("index.js working");
	var source = $('#activities-template').html(); // loads the html from .hbs
 	var template = Handlebars.compile(source);
 	var user_id = $('.headline').attr("user-id");
 	var activityArray = {'2015': [], '2014': [], '2013': [], '2012': [], 'All': []};
	var activityCountArray = {'2015': [], '2014': [], '2013': [], '2012': []};
	var activityAverageArray = {'2015': [], '2014': [], '2013': [], '2012': []};
	var yearArr = [];

 	if($('.headline').attr("user-activity-count") > 0){
 		$('#filename-body').hide();
 	} else {
 		$('#charts').hide();
 	}
 	
 	getActivitiesCountByGroup(user_id);

 	

	$("#filename-nav").change(function(e) {
		var ext = $("input#filename-nav").val().split(".").pop().toLowerCase();
		uploadFile(e, ext);
	});

	$("#filename-body").change(function(e) {
		var ext = $("input#filename-body").val().split(".").pop().toLowerCase();
		uploadFile(e, ext);
	});

	function uploadFile(e, ext){
		console.log("inside filename change");
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
					data.activityLabel = cell[1];
					data.originalId = cell[0];
					if(date !== undefined){
						data.originalDate = date;
						data.originalYear = date.slice(0,4);
						data.originalMonth = date.slice(5,7);
						data.originalDay = date.slice(8,10);
					}
					data.occured = true;
					data.measurementA = "Days";
					data.quantityA = 1;
					data.measurementB = header_values[5];
					data.quantityB = cell[cell.length-4];
					if(cell[3] !== ''){
						data.measurementC = header_values[3];
						data.quantityC = cell[3];
					}
					data.link = cell[cell.length-1];
					sendPostToServer(data);
				}
			};
			reader.readAsText(e.target.files.item(0));
		}
		return false;
	}

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
			loadDataIntoYear(data, function(){
				loadTotalActivities(['2015', '2014', '2013', '2012']);
				loadAveragePerWeekActivities(['2015', '2014', '2013', '2012']);
				loadListOfActivities();
			});
		});
	}

	function loadDataIntoYear(data, callback){
		for(var i = 0; i < data.length; i++){
			if(data[i]._id.activityLabel === 'Read' || 
				data[i]._id.activityLabel === 'Creativity' || 
				data[i]._id.activityLabel === 'Workout'  || 
				data[i]._id.activityLabel === 'Express gratitude'  || 
				data[i]._id.activityLabel === 'Snuggle' || 
				data[i]._id.activityLabel === 'Eat Fruit'  || 
				data[i]._id.activityLabel === 'Floss'  || 
				data[i]._id.activityLabel === 'No coffee after lunch' || 
				data[i]._id.activityLabel === 'Sleep at least 7 hours'){
				if(data[i]._id.originalYear === 2015){
					activityArray['2015'].push(data[i]._id.activityLabel);
					activityCountArray['2015'].push(data[i].count);
					activityAverageArray['2015'].push(data[i].count/52);
				} else if(data[i]._id.originalYear === 2014) {
					activityArray['2014'].push(data[i]._id.activityLabel);
					activityCountArray['2014'].push(data[i].count);
					activityAverageArray['2014'].push(data[i].count/52);
				} else if(data[i]._id.originalYear === 2013) {
					activityArray['2013'].push(data[i]._id.activityLabel);
					activityCountArray['2013'].push(data[i].count);
					activityAverageArray['2013'].push(data[i].count/52);
				} else if(data[i]._id.originalYear === 2012) {
					activityArray['2012'].push(data[i]._id.activityLabel);
					activityCountArray['2012'].push(data[i].count);
					activityAverageArray['2012'].push(data[i].count/52);
				}
				activityArray['All'].push(data[i]._id.activityLabel);
			}
		}
		callback();
	}

	function loadListOfActivities(){
		var activitiesHtml = template({ activities: $.unique(activityArray['All']) });
		$('#activities-list').append(activitiesHtml);
		yearFilterListeners();
	}

	function yearFilterListeners(){
		$('#habit-filter > span').on('click', function(){
 			var filter = $(this)[0].innerText;
 			if(yearArr.indexOf(filter) === -1){
 				yearArr.push(filter);
 			} else {
 				yearArr.splice(yearArr.indexOf(filter), 1);
 			}
 			loadAveragePerWeekActivities(yearArr);
 			loadTotalActivities(yearArr);
 		});
	}

// Graphs Below
	function loadAveragePerWeekActivities(arr){
		
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
		if(arr.indexOf('2015') !== -1){
			AverageWeekBarChart_data.push(trace1);
		}
		if(arr.indexOf('2014') !== -1){
			AverageWeekBarChart_data.push(trace2);
		}
		if(arr.indexOf('2013') !== -1){
			AverageWeekBarChart_data.push(trace3);
		}
		if(arr.indexOf('2012') !== -1){
			AverageWeekBarChart_data.push(trace4);
		}

		var layout = {barmode: 'group', bargroupgap: 0.05, width: 1000, height: 500,
					  yaxis: {range: [0, 7], title: 'Days'},
					  title: 'Average per Week', titlefont: {size: 18}
					 };
		Plotly.newPlot('AverageWeekBarChart', AverageWeekBarChart_data, layout);
	}

	function loadTotalActivities(arr){
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

		if(arr.indexOf('2015') !== -1){
			totalCountBarChart_data.push(trace1);
		}
		if(arr.indexOf('2014') !== -1){
			totalCountBarChart_data.push(trace2);
		}
		if(arr.indexOf('2013') !== -1){
			totalCountBarChart_data.push(trace3);
		}
		if(arr.indexOf('2012') !== -1){
			totalCountBarChart_data.push(trace4);
		}

		var layout = {barmode: 'group', bargroupgap: 0.05, width: 1000, height: 500,
					  yaxis: {range: [0, 365], title: 'Days'},
					  title: 'Total per Year', titlefont: {size: 18}
					 };
		Plotly.newPlot('totalCountBarChart', totalCountBarChart_data, layout);
	}

});