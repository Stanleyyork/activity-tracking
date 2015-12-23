$(function() {

	console.log("datastructure.js working");
	var source = $('#datastructure-template').html();
	var template = Handlebars.compile(source);
	var user_id = $('#username-header').attr("user-id");
	var dataStructureObject = [];
	var datastructureLabelObject = [];

	getDataStructureActivity(formatReceivedDSData);


	function getDataStructureActivity(callback){
		$.get('/api/user/' + user_id + '/datastructure', function(data){
			console.log(data);
			callback(data, sendDataStructureToView);
		});
	}

	function formatReceivedDSData(data, callback){
		for(var i = 0; i<data.length; i++){
			dataStructureObject.push([data[i].activityPillar, data[i].activityCategory, data[i]._id.activityLabel]);
			datastructureLabelObject.push(data[i]._id.activityLabel);
		}
		callback();
	}

	function sendDataStructureToView(){
		var datastructureHtml = template({ datastructure: dataStructureObject });
		$('#data-structure-list').append(datastructureHtml);
		formSubmitListener();
	}

	function formSubmitListener(){
		$('form').on('submit', function(e){
			e.preventDefault();
			var value_object = $(this)[0].elements;
			var saveObject = {};
			saveObject.activityPillar = value_object[0].value;
			saveObject.activityCategory = value_object[1].value;
			saveObject.activityLabel = value_object[2].value;
			saveObject.originalActivityLabel = value_object[2].defaultValue;
			sendNewFormDataToServer(saveObject);
		});
	}

	function sendNewFormDataToServer(saveObject){
		$.ajax({
			type: "POST",
			url: '/api/user/'+user_id+'/datastructure/',
			data: saveObject,
			success: function (data) {
				console.log("Saved");
		    },
		    error: function (error) {
		      console.log("Not saved. Client-side error: ");
		      console.error(error);
		    }
		});
	}


});