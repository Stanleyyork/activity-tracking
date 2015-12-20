$(function() {

	console.log("datastructure.js working");
	var source = $('#datastructure-template').html();
	var template = Handlebars.compile(source);
	var user_id = $('#username-header').attr("user-id");
	var dataStructureObject = [];

	getDataStructureActivity(formatReceivedDSData);

	function getDataStructureActivity(callback){
		$.get('/api/user/' + user_id + '/datastructure', function(data){
			callback(data, sendDataStructureToView);
		});
	}

	function formatReceivedDSData(data, callback){
		for(var i = 0; i<data.length; i++){
			dataStructureObject.push([data[i].activityPillar, data[i].activityCategory, data[i]._id.activityLabel]);
		}
		callback();
	}

	function sendDataStructureToView(){
		var datastructureHtml = template({ datastructure: dataStructureObject });
		$('#data-structure-list').append(datastructureHtml);
	}


});