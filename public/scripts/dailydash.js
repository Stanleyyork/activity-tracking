$(function() {

	console.log("dailydash.js working");

	var today = new Date();
	var today_number = today.getDay();
	var start = new Date().setDate(today.getDate() - today_number + 1);
	var start_of_week = new Date(new Date(start).setHours(0,0,0,0));
	var streak = '';
	var streakdata = {};
	var gratitudes = [];
	var colors = [];
	var forecastColors = '';
	var actualForecast = 0;
	var an = {1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false};
	var ae = {1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false};
	var fr = {1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false};
	var x_data = [];
	var y_data = [];
	var y_dataForecast = [0,0,0]
	for(var x = today_number+1; x<8; x++){
		an[x] = "nil";
		ae[x] = "nil";
		fr[x] = "nil";
	}

	var monthNames = [
	  "January", "February", "March",
	  "April", "May", "June", "July",
	  "August", "September", "October",
	  "November", "December"
	];

	$('#today-time').append(formatAMPM(today));
	$('#today-date').append(monthNames[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear());

	$.get('/coachmeapitwo', function(data){
		parseDailyCoachData(JSON.parse(JSON.parse(data)));
	});

	// $.get('/expenses/weekly', function(data){
	// 	parseWeeklyExpensesData(data, function(){
	// 		WeeklyExpensesGraph(x_data, y_data);
	// 	});
	// });

	$.get('/expenses/monthly', function(data){
		parseMonthlyExpensesData(data, function(){
			$.get('/expenses/monthlyforecasts', function(data){
				parseMonthlyForecastExpensesData(data, function(){
					MonthlyExpensesGraph(x_data, y_data);
				});
			});
		});
	});

	// $.get('/expenses/monthly', function(data){
	// 	console.log(JSON.parse(data));
	// });

	function parseDailyCoachData(data){
		for(var i = 0; i<data.activity_items.length; i++){
			var habit = getHabitBetweenLinkTags(data.activity_items[i].activity_rich_title);
			// if(habit === 'Sleep at least 7 hours'){
			// 	var datean = data.activity_items[i].effective_date;
			// 	var habitan_date = new Date(datean.slice(0,4),datean.slice(5,7)-1,datean.slice(8,10));
			// 	if(start_of_week <= habitan_date){
			// 		an[habitan_date.getDay()] = true;
			// 	}
			// } else if (habit === 'Aerobic') {
			// 	var dateae = data.activity_items[i].effective_date;
			// 	var habitae_date = new Date(dateae.slice(0,4),dateae.slice(5,7)-1,dateae.slice(8,10));
			// 	if(start_of_week <= habitae_date){
			// 		ae[habitae_date.getDay()] = true;
			// 	}
			// } else if (habit === 'Eat Fruit') {
			// 	var datefr = data.activity_items[i].effective_date;
			// 	var habitfr_date = new Date(datefr.slice(0,4),datefr.slice(5,7)-1,datefr.slice(8,10));
			// 	if(start_of_week <= habitfr_date){
			// 		fr[habitfr_date.getDay()] = true;
			// 	}
			// } else 
			if (habit === "Express gratitude") {
				gratitudes.push(data.activity_items[i].note);
				var dateae = data.activity_items[i].effective_date;
				var habitae_date = new Date(dateae.slice(0,4),dateae.slice(5,7)-1,dateae.slice(8,10));
				if(start_of_week <= habitae_date){
					ae[habitae_date.getDay()] = true;
				}
			}
		}
		addIcons();
	}

	function addIcons(){
		if(gratitudes[0] != null){
			var grat = gratitudes[0]
		} else {
			var grat = gratitudes[1]
		}
		$('#gratitude').append(grat);
		// for(var i = 1; i<8; i++){
		// 	if(an[i] === true){
		// 		$('#anaerobic-count').append('<span class="glyphicon glyphicon-ok-circle" id="daily-dash-glyph"></span>');
		// 		if(today_number === i){
		// 			$('#anaerobic-today').append('<span class="glyphicon glyphicon-ok"></span>');
		// 		}
		// 	} else if(an[i] === false) {
		// 		$('#anaerobic-count').append('<span class="glyphicon glyphicon-remove-circle" id="daily-dash-glyph"></span>');
		// 		if(today_number === i){
		// 			$('#anaerobic-today').append('<span class="glyphicon glyphicon-remove"></span>');
		// 		}
		// 	} else {
		// 		$('#anaerobic-count').append('<span class="glyphicon glyphicon-question-sign" id="daily-dash-glyph"></span>');
		// 	}
		// 	if(ae[i] === true){
		// 		$('#aerobic-count').append('<span class="glyphicon glyphicon-ok-circle" id="daily-dash-glyph"></span>');
		// 		if(today_number === i){
		// 			$('#aerobic-today').append('<span class="glyphicon glyphicon-ok"></span>');
		// 		}
		// 	} else if(ae[i] === false) {
		// 		$('#aerobic-count').append('<span class="glyphicon glyphicon-remove-circle" id="daily-dash-glyph"></span>');
		// 		if(today_number === i){
		// 			$('#aerobic-today').append('<span class="glyphicon glyphicon-remove"></span>');
		// 		}
		// 	} else {
		// 		$('#aerobic-count').append('<span class="glyphicon glyphicon-question-sign" id="daily-dash-glyph"></span>');
		// 	}
		// 	if(fr[i] === true){
		// 		$('#eat-fruit-count').append('<span class="glyphicon glyphicon-ok-circle" id="daily-dash-glyph"></span>');
		// 		if(today_number === i){
		// 			$('#eat-fruit-today').append('<span class="glyphicon glyphicon-ok"></span>');
		// 		}
		// 	} else if(fr[i] === false) {
		// 		$('#eat-fruit-count').append('<span class="glyphicon glyphicon-remove-circle" id="daily-dash-glyph"></span>');
		// 		if(today_number === i){
		// 			$('#eat-fruit-today').append('<span class="glyphicon glyphicon-remove"></span>');
		// 		}
		// 	} else {
		// 		$('#eat-fruit-count').append('<span class="glyphicon glyphicon-question-sign" id="daily-dash-glyph"></span>');
		// 	}
		// }
	}

	function formatAMPM(date) {
	  var hours = date.getHours();
	  var minutes = date.getMinutes();
	  var ampm = hours >= 12 ? 'pm' : 'am';
	  hours = hours % 12;
	  hours = hours ? hours : 12; // the hour '0' should be '12'
	  minutes = minutes < 10 ? '0'+minutes : minutes;
	  var strTime = hours + ':' + minutes + ' ' + ampm;
	  return strTime;
	}

	function getHabitBetweenLinkTags(linkText) {
	    return linkText.match(/<a [^>]+>([^<]+)<\/a>/)[1];
	}

	function sortObject(obj){
	    var sortable=[];
	    for(var key in obj)
	        if(obj.hasOwnProperty(key))
	            sortable.push([key, obj[key]]);
	    sortable.sort(function(a, b)
	    {
	      return a[1]-b[1];
	    });
	    return sortable;
	}

	function parseWeeklyExpensesData(data, callback){
		var arr = JSON.parse(data).split('||');
		for(var i = (arr.length - 8); i<arr.length; i++){
			var arr2 = arr[i].split(',');
			x_data.push(String(arr2[0].substring(2,arr2[0].length)));
			y_data.push(arr2[1]);
		}
		callback();
	}

	function WeeklyExpensesGraph(x_data, y_data){
		var WeeklyExpenses_ChartData = [{
		  x: x_data,
		  y: y_data,
		  type: 'bar'
		}];

		var layout = {bargroupgap: 0.00, width: 775, height: 400, 
					  xaxis: {showgrid: false, showline: false},
					  paper_bgcolor: 'rgb(250,250,250)',
					  plot_bgcolor: 'rgb(250,250,250)'};

		Plotly.newPlot('WeeklyExpenses', WeeklyExpenses_ChartData, layout);
	}

	function parseMonthlyExpensesData(data, callback){
		var red = 'rgba(222,45,38,0.8)'
		var green = 'rgb(34,139,34)'
		var arr = JSON.parse(data).split('||').filter(Boolean);
		console.log(arr);
		for(var i = (arr.length - 4); i<arr.length; i++){
			var arr2 = arr[i].split(',');
			x_data.push(String(arr2[0].substring(2,arr2[0].length)));
			y_data.push(arr2[1]);
			if(arr2[1] > 5000){
				colors.push(red)
			} else {
				colors.push(green)
			}
		}
		callback();
	}

	function parseMonthlyForecastExpensesData(data, callback){
		var red = 'rgba(222,45,38,0.8)'
		var green = 'rgb(34,139,34)'
		var arr = JSON.parse(data).split('||').filter(Boolean);
		actualForecast = (Number(arr[0].split(',')[2]) + Number(y_data[3]) )
		if(actualForecast > 5000){
			forecastColors = 'rgb(228,86,81)'
		} else {
			forecastColors = 'rgb(89,175,89)'
		}
		y_dataForecast.push(Number(arr[0].split(',')[2]))
		callback();
	}

	function MonthlyExpensesGraph(x_data, y_data){
		
		var actualExpenses = {
		  x: x_data,
		  y: y_data,
		  type: 'bar',
		  name: 'actual',
		  marker:{
			color: colors
		  }
		};
		var forecastedExpenses = {
		  x: x_data,
		  y: y_dataForecast,
		  type: 'bar',
		  name: 'forecast',
		  marker:{
			color: ['grey', 'grey', 'grey', forecastColors]
		  }
		};
		var MonthlyExpenses_ChartData = [actualExpenses, forecastedExpenses]

		var annotationContent = [];

		for( var i = 0 ; i < x_data.length ; i++ ){
		  var result = {
		    x: x_data[i],
		    y: y_data[i],
		    text: y_data[i],
		    xanchor: 'center',
		    yanchor: 'bottom',
		    showarrow: false
		  };
		  annotationContent.push(result);
		}

		annotationContent.push({x:x_data[3], y: actualForecast, text: actualForecast,
								xanchor: 'center', yanchor: 'bottom', showarrow: false})

		var layout = {bargroupgap: 0.10, width: 775, height: 400,
					  barmode: 'stack', showlegend: false,
					  xaxis: {showgrid: false, showline: false},
					  paper_bgcolor: 'rgb(250,250,250)',
					  plot_bgcolor: 'rgb(250,250,250)',
					  shapes: [
						    {
						      type: 'line',
						      x0: -1,
						      y0: 5000,
						      x1: 5,
						      y1: 5000,
						      line: {
						        color: 'rgb(105,105,105)',
						        width: 4,
						        dash: 'dashdot'
						      }
						    }
  					  ], annotations: annotationContent}

		Plotly.newPlot('MonthlyExpenses', MonthlyExpenses_ChartData, layout);
	}

});