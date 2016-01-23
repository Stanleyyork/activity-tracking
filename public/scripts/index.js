$(function() {

	console.log("index.js working");
	var user_id = $('#username-header').attr("user-id");
	clareLegereData();
	getStepCountData();
	getSleepCountData();

 	// Tooltip (to show daily habits)
 	$('[data-toggle="tooltip"]').tooltip();



	// COGNITIVE INTELLIGENCE - READING
	function clareLegereData(){
		$.get('http://www.clarelegere.com/api/summary', function(data){
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
				$('.reading_streak').append("Stanley has read " + this_month_article_count + " stories this month and is on a <a href='http://clarelegere.com/profiles/1/dailychallenge' target='_blank'>" + streak + "-day</a> reading streak.");
			}
		});
	}

	function graphDaysReadPieChart(this_month_days_count) {
		var data = [
		    {
		        value: Number(this_month_days_count),
		        color:"#3299ff",
		        highlight: "#FF5A5E",
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
		    labels: ['Nov 2014 (Step Count)', 'Dec 2014 (Step Count) - "Marathon Training"', 'Jan 2015 (Step Count)', 'Feb 2015 (Step Count)', 'Mar 2015 (Step Count)', 'Apr 2015 (Step Count)',
		     'May 2015 (Step Count)', 'Jun 2015 (Step Count)', 'Jul 2015 (Step Count)', 'Aug 2015 (Step Count)', 'Sept 2015 (Step Count)', 'Oct 2015 (Step Count)', 'Nov 2015 (Step Count)', 'Dec 2015 (Step Count)', 'Jan 2016 (Step Count)'],//stepCountArray_y,
		    datasets: [
		        {
		            label: "Step Count",
		            fillColor: "#e6f4e6",
		            strokeColor: "#089308",
		            pointColor: "#089308",
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

		var ctx = $("#myLineChart").get(0).getContext("2d");
		var myLineChart = new Chart(ctx).Line(data, options);
		$('#StepCountChart').append(myLineChart);
	}

	// PHYSICAL HEALTH - SLEEP
	function getSleepCountData() {
		$.get('/api/user/'+user_id+'/Sleep%20at%20least%207%20hours/bymonth', function(data){
			console.log(data);
			formatSleepCountData(data, function(sleepDays){
				graphDaysSlept7HoursPieChart(sleepDays);
			});
		});
	}

	function formatSleepCountData(data, callback) {
		for(var i = 0; i < data.length; i++){
			if(data[i]['month'] === '12' && data[i]['year'] === '2015'){
				console.log(data[i]);
				var sleepDays = data[i]['count'];
			}
		}
		callback(sleepDays);
	}

	function graphDaysSlept7HoursPieChart(sleepDays) {
		console.log(sleepDays);
		var data = [
		    {
		        value: Number(sleepDays),
		        color:"#089308",
		        highlight: "#7ac57a",
		        label: "Days slept > 7 hours last month"
		    },
		    {
		        value: (31-Number(sleepDays)),
		        color: "rgba(220,220,220,1)",
		        highlight: "#5AD3D1",
		        label: "Days slept < 7 hours last month"
		    }
		];

		var ctx = $("#mySleepPieChart").get(0).getContext("2d");
		var mySleepPieChart = new Chart(ctx).Doughnut(data);
		$('#this_month_sleep_days_count_chart').append(mySleepPieChart);
	}

});