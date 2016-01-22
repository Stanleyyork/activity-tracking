$(function() {

	console.log("dashboard.js working");
	
// GLOBAL VARIABLES
 //     var source = $('#index-template').html();
 // 	var template = Handlebars.compile(source);
 	var user_id = $('.headline').attr("user-id");
 	var clickedHeader = '';
 	var importObject = {};

// LOADS INITIAL DATA
	

// EVENT LISTENERS
	// Determine which content to have based on whether data exists
	$("div.hidden").removeClass("hidden");
 	if($('.headline').attr("user-activity-count") > 0){
 		$('#upload-thumbnail').hide();
 		$("#instructions").hide();
 		$('#category-details-drawer').hide();
 	} else {
 		$('#upload-thumbnail').show();
 		$('#category-details-drawer').hide();
 		$('.categories').hide();
 	}

 	// Tooltip (to show daily habits)
 	$('[data-toggle="tooltip"]').tooltip();

 	// Expand Category for details
 	$('.catheader').on('click', function(e){
 		e.preventDefault();
 		$('#category-details-drawer').empty();
 		if ($('#category-details-drawer').is( ":hidden" ) || clickedHeader !== $(this).text().trim()) {
	 		$('#category-details-drawer').hide();
	 		clickedHeader = $(this).text().trim();
	 		$('#category-details-drawer').slideDown(function() {
			    $('#category-details-drawer').append(clickedHeader + " details...");
			});	
	  	} else {
	    	$('#category-details-drawer').slideUp();
	    }
 	});
});