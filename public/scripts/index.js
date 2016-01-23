$(function() {

	console.log("index.js working");
	clareLegereData();

 	// Tooltip (to show daily habits)
 	$('[data-toggle="tooltip"]').tooltip();

 	function clareLegereData(){
		$.get('http://www.clarelegere.com/api/summary', function(data){
			var total_bookmarks = data.total_bookmarks;
			var streak = data.consecutive_days_read;
			var this_month_article_count = data.this_month_article_count;
			var this_month_days_count = data.this_month_days_count;
			var starred_bookmarks = data.recent_starred_articles;
			$('.total_bookmarks').append(total_bookmarks);
			days_read_pie_chart(this_month_days_count);
		});
	}


	function days_read_pie_chart(this_month_days_count) {
		var data = [
		    {
		        value: Number(this_month_days_count),
		        color:"#F7464A",
		        highlight: "#FF5A5E",
		        label: "Days Read"
		    },
		    {
		        value: ((new Date().getDate())-Number(this_month_days_count)),
		        color: "#46BFBD",
		        highlight: "#5AD3D1",
		        label: "Days Not Read"
		    }
		];

		var ctx = $("#myChart").get(0).getContext("2d");
		var myPieChart = new Chart(ctx).Doughnut(data);
		$('.this_month_days_count_chart').append(myPieChart);
	}

});