$(function() {

	console.log("index.js working");
	var user_id = $('#username-header').attr("user-id");
	clareLegereData();
	getStepCountData();
	getSleepCountData();
	getDailyHabitsData();
	getDailyHabitsStreakData();

 	// Tooltip (to show daily habits)
 	$('[data-toggle="tooltip"]').tooltip();



	// COGNITIVE INTELLIGENCE - READING
	function clareLegereData(){
		$.get('https://stormy-ridge-5308.herokuapp.com/api/summary', function(data){
			console.log("CL");
			console.log(data);
			var total_bookmarks = data.total_bookmarks;
			var streak = data.consecutive_days_read;
			var this_month_article_count = data.this_month_article_count;
			var this_month_days_count = data.this_month_days_count;
			var starred_bookmarks = data.recent_starred_articles;
			var total_books = data.total_books;
			$('.total_bookmarks').append(total_bookmarks.toLocaleString());
			$('.total_bookmarks_copy').append(total_books + " books");
			graphDaysReadPieChart(this_month_days_count);
			$('#starred_articles-1').append("<a href='"+starred_bookmarks[0]['url']+"' target='_blank'>"+starred_bookmarks[0]['title']+"</a>");
			$('#starred_articles-2').append("<a href='"+starred_bookmarks[1]['url']+"' target='_blank'>"+starred_bookmarks[1]['title']+"</a>");
			$('#starred_articles-3').append("<a href='"+starred_bookmarks[2]['url']+"' target='_blank'>"+starred_bookmarks[2]['title']+"</a>");
			if(streak > 0){
				$('.reading_streak').append("Stanley has read " + this_month_article_count + " stories this month and is on a <a href='http://clarelegere.com/profiles/1/dailychallenge' id='streak_url' target='_blank'>" + streak + "-day</a> reading streak.");
			}
		});
	}

	function graphDaysReadPieChart(this_month_days_count) {
		var data = [
		    {
		        value: Number(this_month_days_count),
		        color:"#3299ff",
		        highlight: "#ef3f6e",
		        label: "Days read this month"
		    },
		    {
		        value: ((new Date().getDate())-Number(this_month_days_count)),
		        color: "rgba(220,220,220,1)",
		        highlight: "#5AD3D1",
		        label: "Days not read"
		    }
		];

		var ctx = $("#myPieChart").get(0).getContext("2d");
		var myPieChart = new Chart(ctx).Doughnut(data);
		$('.this_month_days_count_chart').append(myPieChart);
	}

	// PHYSICAL HEALTH - STEP COUNT
	function getStepCountData() {
		$.get('/api/user/'+user_id+'/StepCount/bymonthtotal', function(data){
			formatStepCountData(data, function(stepCountArray_x, stepCountArray_y){
				graphStepCountData(stepCountArray_x, stepCountArray_y);
			});
		});
	}

	function formatStepCountData(data, callback) {
		var stepCountArray_x = [];
		var stepCountArray_y = [];
		for(var i = 0; i < data.length; i++){
			stepCountArray_y.push(data[i]['year'] + "/" + data[i]['month']);
			stepCountArray_x.push(data[i]['stepCount']);
		}
		callback(stepCountArray_x, stepCountArray_y);
	}

	function graphStepCountData(stepCountArray_x, stepCountArray_y) {
		
		var data = {
		    labels: ['Jan 2015 (Step Count)', 'Feb 2015 (Step Count)', 'Mar 2015 (Step Count)', 'Apr 2015 (Step Count)',
		     'May 2015 (Step Count)', 'Jun 2015 (Step Count)', 'Jul 2015 (Step Count)', 'Aug 2015 (Step Count)', 'Sept 2015 (Step Count)', 'Oct 2015 (Step Count)', 'Nov 2015 (Step Count)', 'Dec 2015 (Step Count)', 'Jan 2016 (Step Count)'],//stepCountArray_y,
		    datasets: [
		        {
		            label: "Step Count",
		            fillColor: "#3299ff",
		            strokeColor: "#3299ff",
		            pointColor: "#ef3f6e",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(220,220,220,1)",
		            data: stepCountArray_x
		        }
		    ]
		};

		var options = {
			scaleShowGridLines : false,
			scaleShowHorizontalLines: false,
			scaleShowVerticalLines: false,
			showScale: false
		};

		var ctx = $("#myStepLineChart").get(0).getContext("2d");
		var myStepLineChart = new Chart(ctx).Bar(data, options);
		$('#StepCountChart').append(myStepLineChart);
	}

	// PHYSICAL HEALTH - SLEEP
	function getSleepCountData() {
		$.get('/api/user/'+user_id+'/Sleep%20at%20least%207%20hours/bymonth', function(data){
			formatSleepCountData(data, function(sleepDays){
				graphDaysSlept7HoursPieChart(sleepDays);
			});
		});
	}

	function formatSleepCountData(data, callback) {
		for(var i = 0; i < data.length; i++){
			if(data[i]['month'] === '12' && data[i]['year'] === '2015'){
				var sleepDays = data[i]['count'];
			}
		}
		callback(sleepDays);
	}

	function graphDaysSlept7HoursPieChart(sleepDays) {
		var data = [
		    {
		        value: Number(sleepDays),
		        color:"#fbc83e",
		        highlight: "#ef3f6e",
		        label: "> 7 hours"
		    },
		    {
		        value: (31-Number(sleepDays)),
		        color: "rgba(220,220,220,1)",
		        highlight: "#5AD3D1",
		        label: "< 7 hours"
		    }
		];

		var ctx = $("#mySleepPieChart").get(0).getContext("2d");
		var mySleepPieChart = new Chart(ctx).Doughnut(data);
		$('#this_month_sleep_days_count_chart').append(mySleepPieChart);
	}

	// DAILY HABITS - STREAKS
	function getDailyHabitsStreakData() {
		$.get('/api/user/'+user_id+'/streaks', function(data){
			formatStreakData(data, function(streakActivityData, streakCountData){
				graphStreakData(streakActivityData, streakCountData)
			});
		});
	}

	function formatStreakData(data, callback) {
		streakActivityData = [];
		streakCountData = [];
		for(var i = 0; i < data.length; i++){
			streakCountData.push(data[i].streakInDays);
			streakActivityData.push(data[i]._id);
		}
		callback(streakActivityData, streakCountData);
	}

	function graphStreakData(streakActivityData, streakCountData) {
		
		var data = {
		    labels: streakActivityData,
		    datasets: [
		        {
		            label: "Step Count",
		            fillColor: "#fbc83e",
		            strokeColor: "#fbc83e",
		            pointColor: "#ef3f6e",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(220,220,220,1)",
		            data: streakCountData
		        }
		    ]
		};

		var options = {
			scaleShowGridLines : false,
			scaleShowHorizontalLines: false,
			scaleShowVerticalLines: false,
			showScale: true
		};

		var ctx = $("#myStreakLineChart").get(0).getContext("2d");
		var myStreakLineChart = new Chart(ctx).Bar(data, options);
		$('#streakChart').append(myStreakLineChart);
	}

	// DAILY HABITS - LAST MONTH
	function getDailyHabitsData() {
		$.get('/api/user/'+user_id+'/alldailyhabits', function(data){
			formatDailyHabitsData(data, function(habitArray, habitDaysArray){
				graphDailyHabitsChart(habitArray, habitDaysArray);
			});
		});
	}

	function formatDailyHabitsData(data, callback) {
		habitArray = [];
		habitDaysArray = [];
		for(var i = 0; i < data.length; i++){
			habitArray.push(data[i]._id.activityLabel);
			habitDaysArray.push(data[i].count);
		}
		callback(habitArray, habitDaysArray);
	}

	function graphDailyHabitsChart(habitArray, habitDaysArray) {
		
		var data = {
		    labels: habitArray,
		    datasets: [
		        {
		            label: "Step Count",
		            fillColor: "#add6ff",
		            strokeColor: "#3299ff",
		            pointColor: "#e5e5e5",
		            pointStrokeColor: "#fff",
		            pointHighlightFill: "#fff",
		            pointHighlightStroke: "rgba(220,220,220,1)",
		            data: habitDaysArray
		        }
		    ]
		};

		var options = {
			scaleShowGridLines : false,
			scaleShowHorizontalLines: false,
			scaleShowVerticalLines: false,
			scaleShowLabels: true,
			showScale: true
		};

		var ctx = $("#myDailyHabitsLineChart").get(0).getContext("2d");
		var myDailyHabitsLineChart = new Chart(ctx).Radar(data, options);
		$('#DailyHabitsChart').append(myDailyHabitsLineChart);
	}

});