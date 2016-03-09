$(function() {

	console.log("activity.js working");
	var today = new Date();
	var today_number = today.getDay();
	var streak = '';
	var streakdata = {};
	var habits = {'Anaerobic':{'checkin_count': 0, 'streak': 0},'Aerobic':{'checkin_count': 0, 'streak': 0},'Eat Fruit':{'checkin_count': 0, 'streak': 0}};

	$.get('/coachmeapi', function(data){
		parseCoachData(JSON.parse(JSON.parse(data)));
	});

	function parseStreakData(data){
		$('#longest-streak').append('<span class="glyphicon glyphicon-fire"></span>' + " ");
		for(var i = 0; i<data['plans'].length; i++){
			streakdata[data['plans'][i]['name']] = data['plans'][i]['stats']['streak'];
		}
		$('#longest-streak').append("Longest current streak is " + sortObject(streakdata).pop().shift() + " at " + sortObject(streakdata).pop().pop() + " days");
	}
	

	function parseCoachData(data){
		parseStreakData(data);
		for(var i = 0; i<data['plans'].length; i++){
			if(data['plans'][i]['name'] === 'Anaerobic'){
				var anaerobic_count = data['plans'][i]['stats']['weekly_progress'][4]['checkin_count'];
				for(var x = 0; x<anaerobic_count; x++){
					$('#anaerobic-count').append('<span class="glyphicon glyphicon-ok-circle" id="daily-dash-glyph"></span>');
				}
				// if(today_number-anaerobic_count === 0){
				// 	$('#anaerobic-count-no').append('<span class="glyphicon glyphicon-remove-circle" id="daily-dash-glyph-hidden"></span>');
				// }
				for(var x = 0; x<(today_number-anaerobic_count); x++){
					$('#anaerobic-count').append('<span class="glyphicon glyphicon-remove-circle" id="daily-dash-glyph"></span>');
				}
				for(var x = 0; x<(7-today_number); x++){
					$('#anaerobic-count').append('<span class="glyphicon glyphicon-question-sign" id="daily-dash-glyph"></span>');
				}
				if(data['plans'][i]['stats']['streak'] > 0){
					$('#anaerobic-today').append('<span class="glyphicon glyphicon-ok"></span>');
				} else {
					$('#anaerobic-today').append('<span class="glyphicon glyphicon-remove"></span>');
				}
			} else if(data['plans'][i]['name'] === 'Aerobic') {
				var aerobic_count = data['plans'][i]['stats']['weekly_progress'][4]['checkin_count'];
				for(var x = 0; x<aerobic_count; x++){
					$('#aerobic-count').append('<span class="glyphicon glyphicon-ok-circle" id="daily-dash-glyph"></span>');
				}
				// if(today_number-aerobic_count === 0){
				// 	$('#aerobic-count-no').append('<span class="glyphicon glyphicon-remove-circle" id="daily-dash-glyph-hidden"></span>');
				// }
				for(var x = 0; x<(today_number-aerobic_count); x++){
					$('#aerobic-count').append('<span class="glyphicon glyphicon-remove-circle" id="daily-dash-glyph"></span>');
				}
				for(var x = 0; x<(7-today_number); x++){
					$('#aerobic-count').append('<span class="glyphicon glyphicon-question-sign" id="daily-dash-glyph"></span>');
				}
				if(data['plans'][i]['stats']['streak'] > 0){
					$('#aerobic-today').append('<span class="glyphicon glyphicon-ok"></span>');
				} else {
					$('#aerobic-today').append('<span class="glyphicon glyphicon-remove"></span>');
				}
			} else if(data['plans'][i]['name'] === 'Eat Fruit') {
				var eat_fruit_count = data['plans'][i]['stats']['weekly_progress'][4]['checkin_count'];
				for(var x = 0; x<eat_fruit_count; x++){
					$('#eat-fruit-count').append('<span class="glyphicon glyphicon-ok-circle" id="daily-dash-glyph"></span>');
				}
				// if(today_number-eat_fruit_count === 0){
				// 	$('#eat-fruit-count-no').append('<span class="glyphicon glyphicon-remove-circle" id="daily-dash-glyph-hidden"></span>');
				// }
				for(var x = 0; x<(today_number-eat_fruit_count); x++){
					$('#eat-fruit-count').append('<span class="glyphicon glyphicon-remove-circle" id="daily-dash-glyph"></span>');
				}
				for(var x = 0; x<(7-today_number); x++){
					$('#eat-fruit-count').append('<span class="glyphicon glyphicon-question-sign" id="daily-dash-glyph"></span>');
				}
				if(data['plans'][i]['stats']['streak'] > 0){
					$('#eat-fruit-today').append('<span class="glyphicon glyphicon-ok"></span>');
				} else {
					$('#eat-fruit-today').append('<span class="glyphicon glyphicon-remove"></span>');
				}
			} else {

			}
		}
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

});