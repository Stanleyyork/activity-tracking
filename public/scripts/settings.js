$(function() {

	console.log("editprofile.js working");
	var user_id = $('#username-header').attr("user-id");
	var activityLabelsArray = [];
	var hiddenValues = {};
	var importObject = {};
	var uploadbox = '';
	getActivityLabels(formatReceivedData);

	// Get all activitiyLabels
	function getActivityLabels(callback){
		$.get('/api/user/' + user_id + '/activitylabels', function(data){
			callback(data, loadActivityLabelsOnPage);
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
	 			$('#activity-list-hidden-form').append('<input type="checkbox" name="vehicle-'+activityLabelsArray[x]+'" value="'+activityLabelsArray[x]+'">'+" "+activityLabelsArray[x]+'<br>');
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
				sendActivityToServer();
			});
		} else {
			$('#danger-message-top').removeClass("hidden");
			$('#danger-message-top').empty();
			$('#danger-message-top').append("Incorrect file: not an XML file.");
		}
	});

	//$("#filename-body").change(uploadXMLFile);

	function uploadXMLFile(e, callback) {
        var files = e.target.files;
        uploadbox = 'xml';
        for (var i = 0, f; f = files[i]; i++) {
          var reader = new FileReader();
          reader.onload = (function(theFile) {
            return function(e) {
            	var row_values = e.target.result.split("\n");
				for(var i=4;i<row_values.length-2;i++) {
				 	var cell = row_values[i].match(/(?:[^\s"]+|"[^"]*")+/g);
					var data = {};
					var date = cell[4].split('"')[1];
					data.user_id = user_id;
					data.activityPillar = "Physical Health";
					data.activityCategory = 'Fitness';
					data.activityLabel = cell[1].split('"')[1].replace("HKQuantityTypeIdentifier", "");
					data.originalActivityLabel = cell[1].split('"')[1].replace("HKQuantityTypeIdentifier", "");
					data.activitySource = "Apple";
					data.originalId = null;
					var datetype = new Date("'"+date.slice(0,4)+"'"+date.slice(4,6)+"'"+date.slice(6,8)+"'");
					data.originalDate = datetype;
					data.originalYear = date.slice(0,4);
					data.originalMonth = date.slice(4,6);
					data.originalDay = date.slice(6,8);
					data.originalDayOfWeek = datetype.getDay();
					data.occured = true;
					data.measurementA = "Days";
					data.quantityA = null;
					data.measurementB = cell[3].split('"')[1];
					data.quantityB = cell[6].split('"')[1];
					data.link = "http://www.apple.com/ios/health"
					importObject[i] = data;
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
				var header_values = row_values[0].split(",");
				for(var i=1;i<row_values.length;i++) {
					var cell = row_values[i].split(",");
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
		        $(boxcheck).removeClass("hidden");
		        $(box).css('background-color', '#b2dba1');
		    },
		    error: function (error) {
		      console.error(error);
		    }
		});
	}

});