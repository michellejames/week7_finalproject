var GoogleModule = (function() {
	var shared = {};
	var map;

	function initMap() {
		
		var ccLatlng = {
			lat: 33.750365,
			lng: -84.388684,
		}

	  	map = new google.maps.Map(document.getElementById("map"), {
	    	center: ccLatlng,
	    	zoom: 11
	  	});
    }

   	shared = {
   		initMap: initMap,
	}
	return shared;

}());



var MeetUpApi = (function(options) {
	var shared = {};

	function eventResults (data) {

		$apiResults = data;
		console.log($apiResults);
		console.log($apiResults.data[0].group.name); //meetup group name
		console.log($apiResults.data[0].name); //meetup name
		console.log($apiResults.data[0].link); //link to meetup
		console.log($apiResults.data[0].waitlist_count); //is there a wait list, 0=no, 1=yes
		console.log($apiResults.data[0].yes_rsvp_count); //how many people are going so far
		console.log($apiResults.data[0].venue.lat); //coordinates
		console.log($apiResults.data[0].venue.lon); //coordinates

		for (var i = 0; i < $apiResults.length; i++) {
			var test = document.querySelector(".test");
			// var eventTime = document.querySelector(".event__time");
			// var eventName = document.querySelector(".event__name");
			// var eventLocation = document.querySelector(".event__location");

			var meetUpName = document.createElement("li");
			$(meetUpName).html($apiResults.data[i].name);

			var meetUpGroup = document.createElement("li");
			$(meetUpGroup).html($apiResults.data[i].group.name);

			test.appendChild(meetUpName);
			test.appendChild(meetUpGroup);
		}

	}

	function groupResults (data) {

		$apiResults = data;
		console.log($apiResults);
		console.log($apiResults.data[0].category.shortname); //organize meetup by categories
	}

	var init = function() {
		
		$.ajax({
			url: 'https://api.meetup.com/find/events?key=4171704510613e4d1da4c3127602965&sign=true',
			dataType: 'jsonp',
			success: function(data) {
		    	eventResults(data);
			},
		});


		$.ajax({
			url: 'https://api.meetup.com/find/groups?key=4171704510613e4d1da4c3127602965&sign=true',
			dataType: 'jsonp',
			success: function(data) {
		    	groupResults(data);
			},
		});

	};

	shared.init = init;
	return shared;
}());

MeetUpApi.init();



    