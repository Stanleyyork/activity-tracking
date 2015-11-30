var csv = require("fast-csv");
var allActivity = [];
var filePath = "./coachData.csv";
var activityAttr = ['Id', 'Habit', 'Date', 'Note', 'Check In Count', 'Days in Streak', 'Prop Count', 'Comment Count', 'URL'];

function readCsv(filePath, callback){
	csv
	 .fromPath(filePath)
	 .on("data", function(data){
	     allActivity.push(data);
	 })
	 .on("end", function(){
	     console.log("1: Done");
	     callback();
	 });
}

function ensureCorrectHeaders() {
	var correct = false;
	for(var i = 0; i < allActivity[0].length; i++){
		if(allActivity[0][i] === activityAttr[i]){
			correct = true;
		} else {
			correct = false;
		}
	}
	console.log("2: Done");
	return correct;
}

function organizeEachEntry(data, callback){
	var entry = data;
		if(entry[0] !== activityAttr[0]){
		var singleActivity = {
		    activityLabel: entry[1],
			originalId: parseInt(entry[0]),
			originalDate: entry[2],
			occured: true,
			measurementA: "Days",
			quantityA: 1,
			measurementB: "Days In Streak",
			quantityB: parseInt(entry[5]),
			measurementC: "Note",
			quantityC: entry[3],
			link: entry[8],
			user_id: 1
		};
		console.log("3: Done");
		callback(singleActivity);
	} else {
		console.log("header not saved");
	}
}

function saveEachEntryToDb(singleActivity){
	$.ajax({
		type: "POST",
		url: '/api/activity',
		data: singleActivity,
		success: function (data) {
	        console.log("Added new activity");
	    },
	    error: function (error) {
	      console.error(error);
	    }
	});
}

readCsv(filePath, function(){
	if (ensureCorrectHeaders()===true){
		allActivity.forEach(function(data){
			organizeEachEntry(data, function(singleActivity){
				saveEachEntryToDb(singleActivity);
			});
		});
	}
});