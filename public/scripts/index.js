$(function() {

	console.log("index.js working");
	
	var source = $('#activities-template').html(); // loads the html from .hbs
 	var template = Handlebars.compile(source);
 	var user_id = $('.headline').attr("user-id");
 	var activityArray = {'2015': [], '2014': [], '2013': [], '2012': [], 'All': []};
	var activityCountArray = {'2015': [], '2014': [], '2013': [], '2012': []};
	var activityAverageArray = {'2015': [], '2014': [], '2013': [], '2012': []};
	var filterArr = [];

	getActivitiesCountByGroup(user_id);

	// Determine which content to have based on whether data exists
 	if($('.headline').attr("user-activity-count") > 0){
 		$('#filename-span').hide();
 		$("#filter-tags").hide();
 	} else {
 		$('#charts').hide();
 	}

 	// Show upload button if clicked (in navbar)
 	$('#nav-upload').on('click', function(){
 		$('#filename-span').show();
 	});

	// Nav Scrolling
 	$(window).scroll(function(){

		if($(window).scrollTop()>70){
			$('.navbar').css("height", "100");
			$("#filter-tags").show();
		}

		if($(window).scrollTop()<55){
			$('.navbar').css("height", "55");
			$("#filter-tags").hide();
		}

	});

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
				loadListOfActivities('#activities-list');
			});
		});
	}

	function loadDataIntoYear(data, callback){
		for(var i = 0; i < data.length; i++){
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
		callback();
	}

	// Load list of years and activities to body (just below headline)
	function loadListOfActivities(location){
		var years = Object.keys(activityArray);
		activityArray['All'].splice.apply(activityArray['All'], [2, 0].concat(years));
		var activitiesHtml = template({ activities: $.unique(activityArray['All'].sort()) });
		$(location).append(activitiesHtml);
		loadListOfActivitiesNav();
		yearFilterListeners('#habit-filter > span');
	}

	// Load list of years and activities to navbar
 	function loadListOfActivitiesNav(){
 		var arr = $.unique(activityArray['All'].sort());
	 	if($('#filter-tags > span')[0] === undefined){
			for(var x = 0; x<arr.length; x++){
				$("#filter-tags").append('<span class="label label-default" id="habit-'+arr[x]+'">'+arr[x]+'</span>'+'  ');
			}
			yearFilterListeners('#filter-tags > span');
		}
	}

	function yearFilterListeners(location){
		$(location).on('click', function(){
 			var filter = $(this)[0].innerText;
 			var habitId = $(this)[0].id;
 			console.log($(this));
 			console.log($('#'+habitId));
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
 			loadAveragePerWeekActivities(filterArr);
 			loadTotalActivities(filterArr);
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
					  title: 'Total per Year', titlefont: {size: 18}
					 };
		Plotly.newPlot('totalCountBarChart', totalCountBarChart_data, layout);
	}

});