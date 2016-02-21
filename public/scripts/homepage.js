$(function() {

	console.log("homepage.js working");

	var images = ['bg_brasil.JPG', 'bg_eyes.JPG', 'bg_mich.JPG', 'bg_tahoe.JPG'];
 	$('#background-image').css({'background-image': 'url(/images/' + images[Math.floor(Math.random() * images.length)] + ')'});

});