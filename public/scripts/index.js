$(function() {

	console.log("index.js working");
	
// GLOBAL VARIABLES
 //     var source = $('#index-template').html();
 // 	var template = Handlebars.compile(source);
 	var user_id = $('.headline').attr("user-id");

// LOADS INITIAL DATA
	

// EVENT LISTENERS
	// Determine which content to have based on whether data exists
 	if($('.headline').attr("user-activity-count") > 0){
 		$('#filename-span').hide();
 		$("#instructions").hide();
 	} else {
 		$('#filename-span').show();
 	}

 	// Show upload button if clicked (in navbar)
 	$('#nav-upload').on('click', function(){
 		$('#filename-span').show();
 	});

	// Nav Scrolling conditional
 	$(window).scroll(function(){
		if($(window).scrollTop()>70){
			$('.navbar').css("height", "80");
			$('#coach-logo-words').hide();
		}
		if($(window).scrollTop()<55){
			$('.navbar').css("height", "60");
			$('#coach-logo-words').show();
		}
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

});