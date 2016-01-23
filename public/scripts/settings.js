$(function() {

	console.log("editprofile.js working");
	var user_id = $('#username-header').attr("user-id");
	var activityLabelsArray = [];
	var hiddenActivityLablesArray = [];
	var xml_undefined_counter = 0;
	var xml_total_count = 0;
	var csv_undefined_counter = 0;
	var csv_total_count = 0;
	var json_defined_counter = 0;
	var json_undefined_counter = 0;
	var json_total_count = 0;
	var hiddenValues = {};
	var importObject = {};
	var uploadbox = '';
	getHiddenActivityLabels(function(){
		getActivityLabels(formatReceivedData);
	});

	// Get all activitiyLabels
	function getActivityLabels(callback){
		$.get('/api/user/' + user_id + '/activitylabels', function(data){
			callback(data, loadActivityLabelsOnPage);
		});
	}

	// Get all HIDDEN activitiyLabels
	function getHiddenActivityLabels(callback){
		$.get('/api/user/' + user_id + '/hiddenactivitylabels', function(data){
			console.log(data);
			hiddenActivityLablesArray = data;
			callback();
		});
	}

	function formatReceivedData(data, callback){
		data.forEach(function(d){
			activityLabelsArray.push(d._id);
		});
		callback();
	}

	function loadActivityLabelsOnPage(){
		if(activityLabelsArray.length > 0){
			$('#activity-list-hidden-thumbnail').removeClass("hidden");
			for(var x = 0; x<activityLabelsArray.length; x++){
				if(hiddenActivityLablesArray.indexOf(activityLabelsArray[x]) === -1){
	 				$('#activity-list-hidden-form').append('<input type="checkbox" name="vehicle-'+activityLabelsArray[x]+'" value="'+activityLabelsArray[x]+'">'+" "+activityLabelsArray[x]+'<br>');
	 			} else {
	 				$('#activity-list-hidden-form').append('<input type="checkbox" name="vehicle-'+activityLabelsArray[x]+'" value="'+activityLabelsArray[x]+'" checked="checked">'+" "+activityLabelsArray[x]+'<br>');
	 			}
	 		}
 		}
	}

	$('#edit-profile-hidden-activities-form').on('submit', function(e){
		data = $("#edit-profile-hidden-activities-form").closest('form').find('input:checkbox:checked');
		formatHiddenValueDataToSend(data, function(){
			sendHiddenValuesToServer();
		});
	});

	$('#delete-all-bookmarks').on('click', function(){
		deleteAllBookmarks(function(data){
			console.log("success - deleted!");
		});
	});

	function deleteAllBookmarks(callback){
		$.ajax({
			type: "DELETE",
			url: '/api/user/'+user_id+'/activity/',
			success: function (data) {
				$('#delete-complete-checkmark').removeClass("hidden");
				$('#delete-thumbnail').css('background-color', '#f2dede');
		        callback();
		    },
		    error: function (error) {
		      console.log("Client-side error: ");
		      console.error(error);
		    }
		});
	}

	function formatHiddenValueDataToSend(data, callback){
		for(var i = 0; i<data.length; i++){
			hiddenValues[data[i].defaultValue] = true;
		}
		callback();
	}

	function sendHiddenValuesToServer(){
		$.ajax({
			type: "POST",
			url: '/api/user/hiddenvalues',
			data: hiddenValues,
			success: function (data) {
		        console.log("Sent hidden values to server.");
		    },
		    error: function (error) {
		      console.log("Client-side error: ");
		      console.error(error);
		    }
		});
	}

// LISTEN FOR FILE, THEN UPLOAD, PARSE AND SEND TO SERVER
	// Listen for CSV file upload, then pass to upload/parse file
	$("#filename-body-csv").change(function(e) {
		$('#spinning-cog-csv').removeClass("hidden");
		console.log(e.target.value);
		var csv_q = String(e.target.value);
		if(csv_q.substr(csv_q.length - 3) === "csv"){
			var ext = $("input#filename-body-csv").val().split(".").pop().toLowerCase();
			uploadCSVFile(e, ext, function(){
				console.log("finished, now sending to server...");
				var csv_defined_count = csv_total_count - csv_undefined_counter;
				var csv_percent_complete = ((csv_defined_count / csv_total_count)*100).toFixed(0);
				$('#csv-undefined-counter').append(csv_defined_count + "/" + csv_total_count + " (" + csv_percent_complete + "%) " + "Uploaded");
				sendActivityToServer();
			});
		} else {
			$('#danger-message-top').removeClass("hidden");
			$('#danger-message-top').empty();
			$('#danger-message-top').append("Incorrect file: not a CSV file.");
		}
	});

	// Listen for XML file upload, then pass to upload/parse file
	$("#filename-body-xml").change(function(e) {
		$('#spinning-cog-xml').removeClass("hidden");
		var xml_q = String(e.target.value);
		if(xml_q.substr(xml_q.length - 3) === "xml"){
			uploadXMLFile(e, function(){
				console.log("finished, now sending to server...");
				var xml_defined_count = xml_total_count - xml_undefined_counter;
				var xml_percent_complete = ((xml_defined_count / xml_total_count)*100).toFixed(0);
				$('#xml-undefined-counter').append(xml_defined_count + "/" + xml_total_count + " (" + xml_percent_complete + "%) " + "Uploaded");
				sendActivityToServer();
			});
		} else {
			$('#danger-message-top').removeClass("hidden");
			$('#danger-message-top').empty();
			$('#danger-message-top').append("Incorrect file: not an XML file.");
		}
	});

	// Listen for JSON file upload, then pass to upload/parse file
	$("#filename-body-json").change(function(e) {
		$('#spinning-cog-json').removeClass("hidden");
		var json_q = String(e.target.value);
		if(json_q.substr(json_q.length - 4) === "json"){
			uploadJSONFile(e, function(){
				console.log("finished, now sending to server...");
				var json_undefined_count = json_total_count - json_defined_counter;
				var json_percent_complete = ((json_defined_counter / json_total_count)*100).toFixed(0);
				$('#json-undefined-counter').append(json_defined_counter + "/" + json_total_count + " (" + json_percent_complete + "%) " + "Uploaded");
				sendActivityToServer();
			});
		} else {
			$('#danger-message-top').removeClass("hidden");
			$('#danger-message-top').empty();
			$('#danger-message-top').append("Incorrect file: not a JSON file.");
		}
	});

	function uploadJSONFile(e, callback) {
		var file = e.target.files[0];
		uploadbox = 'json';
		var reader = new FileReader();
		reader.onload = function(event) {
			var results = JSON.parse(event.target.result);
			json_total_count = results['event'].length;
			for(var i = 0; i < results['event'].length; i++){
				console.log(i);
				var data = {};
				data.user_id = user_id;
				data.activityPillar = "Cognitive Intelligence";
				data.activityCategory = 'Curiosity';
				data.activityLabel = "GoogleSearches";
				data.originalActivityLabel = "GoogleSearches";
				data.activitySource = "Google";
				data.originalId = results['event'][i]['query']['id'][0]['timestamp_usec'];
				var datetype = new Date(results['event'][i]['query']['id'][0]['timestamp_usec'] / 1000);
				data.originalDate = datetype;
				data.originalYear = String(datetype).split(" ")[3];
				data.originalMonth = datetype.getMonth() + 1;
				data.originalDay = String(datetype).split(" ")[1];
				data.originalDayOfYear = Math.floor(((datetype) - (new Date(datetype.getFullYear(), 0, 0)))/(1000 * 60 * 60 * 24));
				data.originalDayOfWeek = datetype.getDay();
				data.occured = true;
				data.measurementA = "Days";
				data.quantityA = null;
				data.measurementB = "Query";
				data.quantityB = results['event'][i]['query']['query_text'];
				data.link = "https://history.google.com/history/";
				importObject[i] = data;
				json_defined_counter += 1;
			}
			callback();
		};
		reader.readAsText(file);
	}

	function uploadXMLFile(e, callback) {
        var files = e.target.files;
        uploadbox = 'xml';
        for (var i = 0, f; f = files[i]; i++) {
          var reader = new FileReader();
          reader.onload = (function(theFile) {
            return function(e) {
            	var firstIndex = e.target.result.indexOf("<Record");
            	var string = e.target.result.substring(firstIndex);
            	var lastIndexofRecord = string.lastIndexOf("<Record");
            	var lastIndexofEndofRecord = string.indexOf(">",lastIndexofRecord+1);
            	var text = string.slice(0,lastIndexofEndofRecord+1);
            	var row_values = text.split("\n");
            	xml_total_count = row_values.length;
				for(var i=0;i<row_values.length;i++) {
				 	var cell = row_values[i].split(/type=|unit=|startDate=|value=/g)//.match(/(?:[^\s"]+|"[^"]*")+/g);
				 	if(typeof cell[1] === "undefined" || typeof cell[2] === "undefined" || typeof cell[3] === "undefined" || typeof cell[4] === "undefined"){
				 		xml_undefined_counter += 1;
				 	} else {
					 	var cellActivity = cell[1].split(" ")[0].replace(/['"]+/g, '').replace("HKQuantityTypeIdentifier", "");
					 	var cellUnit = cell[2].split(" ")[0].replace(/['"]+/g, '');
					 	var cellDate = cell[3].split(" ")[0].replace(/['"]+/g, '').replace(/-/g,"").substring(0,8);
					 	var cellValue = cell[4].split(" ")[0].replace(/['"]+/g, '').replace(/\/>/g, '');
						var data = {};
						var date = cell[4].split('"')[1];
						data.user_id = user_id;
						data.activityPillar = "Physical Health";
						data.activityCategory = 'Fitness';
						data.activityLabel = cellActivity;
						data.originalActivityLabel = cellActivity;
						data.activitySource = "Apple";
						data.originalId = null;
						var datetype = new Date("'"+cellDate.slice(0,4)+"'"+cellDate.slice(4,6)+"'"+cellDate.slice(6,8)+"'");
						data.originalDate = datetype;
						data.originalYear = cellDate.slice(0,4);
						data.originalMonth = cellDate.slice(4,6);
						data.originalDay = cellDate.slice(6,8);
						data.originalDayOfYear = Math.floor(((datetype) - (new Date(datetype.getFullYear(), 0, 0)))/(1000 * 60 * 60 * 24));
						data.originalDayOfWeek = datetype.getDay();
						data.occured = true;
						data.measurementA = "Days";
						data.quantityA = null;
						data.measurementB = cellUnit;
						data.quantityB = parseInt(cellValue);
						data.link = "http://www.apple.com/ios/health";
						importObject[i] = data;
					}
				}
				callback();
            };
          })(f);
          reader.readAsText(f);
        }
      }

	// Upload and parse file, then send to sendActivityToServer
	function uploadCSVFile(e, ext, callback){
		var ext = ext;
		uploadbox = 'csv';
		if (e.target.files !== undefined) {
			var reader = new FileReader();
			reader.onload = function(e) {
				var row_values = e.target.result.split("\n");
				csv_total_count = row_values.length;
				var header_values = row_values[0].split(",");
				for(var i=1;i<row_values.length;i++) {
					var cell = row_values[i].split(",");
					if(typeof cell[1] === "undefined" || typeof cell[2] === "undefined" || typeof cell[3] === "undefined" || typeof cell[5] === "undefined"){
				 		csv_undefined_counter += 1;
				 	} else {
						var data = {};
						var date = cell[2];
						data.user_id = user_id;
						data.activityLabel = cell[1];
						data.originalActivityLabel = cell[1];
						data.activityHabit = true;
						data.activitySource = "Coach.me";
						data.originalId = cell[0];
						if(date !== undefined){
							var datetype = new Date(date);
							data.originalDate = datetype;
							data.originalYear = date.slice(0,4);
							data.originalMonth = date.slice(5,7);
							data.originalDay = date.slice(8,10);
							data.originalDayOfYear = Math.floor(((datetype) - (new Date(datetype.getFullYear(), 0, 0)))/(1000 * 60 * 60 * 24));
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
				}
				callback();
			};
			reader.readAsText(e.target.files.item(0));
		}
		return false;
	}

	// Send activity to server to save
	function sendActivityToServer(){
		$.ajax({
			type: "POST",
			url: '/api/fileupload',
			data: JSON.stringify(importObject),
			contentType: "application/json",
			success: function (response) {
		        var box = '#upload-box-' + uploadbox;
		        var boxcheck = '#complete-checkmark-'+uploadbox;
		        $('#spinning-cog-csv').addClass("hidden");
		        $('#spinning-cog-xml').addClass("hidden");
		        $('#spinning-cog-json').addClass("hidden");
		        $(boxcheck).removeClass("hidden");
		        $(box).css('background-color', '#b2dba1');
		    },
		    error: function (error) {
		      console.error(error);
		    }
		});
	}

});