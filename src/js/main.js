var GoogleModule = (function() {
	var shared = {};
	var map;

	function initMap() {
		
		var ccLatlng = {
			lat: 33.750365,
			lng: -84.388684,
		};

	  	map = new google.maps.Map(document.getElementById("map"), {
	    	center: ccLatlng,
	    	zoom: 11
	  	});
    }


    function createMarker (meetup, lat, lng) {

    	var infowindow = new google.maps.InfoWindow ({
          content: meetup,
        });

    	var marker = new google.maps.Marker ({
          position: {lat:lat, lng:lng},
          map: map
        });

        marker.addListener ( "click", function () {
          infowindow.open ( map, marker );
        });
    }

   	shared = {
   		initMap: initMap,
   		createMarker:createMarker,
	};
	return shared;

}());


var MeetUpApi = (function(options) {
	var shared = {};


	function formatDate (newDate) {
		var setDate = "";
		var hh = newDate.getHours();
		if (hh == 0) {
			setDate = "12";
		} else if (hh < 13) {
			setDate = hh;
		} else {
			setDate = hh-12;
		}

		setDate +=   ":" + ("0" + newDate.getMinutes()).slice(-2);

		if (hh>11) {
			setDate += "PM";
		} else {
			setDate += "AM";
		}

		return setDate;
	}

	function formatEventDay (date) {
		var monthNames = [
		  "January", "February", "March",
		  "April", "May", "June", "July",
		  "August", "September", "October",
		  "November", "December"
		];

		var monthIndex = date.getMonth();
		var day = date.getDate();
		var year = date.getFullYear();

		return "MeetUps on " + monthNames[monthIndex] + ' ' + day + ', ' + year + " <span class='glyphicon glyphicon-arrow-down'></span";
	}


	function eventResults (data) {

		$apiResults = data;
		console.log($apiResults.data[0].id);
		console.log("test");
		var lastDate = "";


		for (var i = 0; i < $apiResults.data.length; i++) {
			var meetup = $apiResults.data[i];
			var events = document.querySelector(".events");

			var eventDay = new Date(meetup.time);
			var curDay = eventDay.getDate();

			if (curDay != lastDate) {

				var $meetupDay = document.createElement("div");
				$($meetupDay).html(formatEventDay(eventDay)).addClass("event__day");
				events.appendChild($meetupDay);
			    lastDate = curDay;
			}

			var singleEvent = document.createElement("div");
			$(singleEvent).addClass("event");
			events.appendChild(singleEvent);

			var eventTime = document.createElement("div");
			var newDate = new Date($apiResults.data[i].time);
			var newDateString = formatDate(newDate);
			$(eventTime).html(newDateString).addClass("event__time");
			singleEvent.appendChild(eventTime);

			var eventDetails = document.createElement("div");
			$(eventDetails).addClass("event_details");
			singleEvent.appendChild(eventDetails);

			var eventGroup = document.createElement("div");
			$(eventGroup).html($apiResults.data[i].group.name).addClass("event__group");
			eventDetails.appendChild(eventGroup);

			var eventName = document.createElement("div");
			$(eventName).html("<a href='meetup.html?id=" + $apiResults.data[i].id + "'>" + $apiResults.data[i].name + "</a>").addClass("event__name");
			eventDetails.appendChild(eventName);

			if (meetup.venue && meetup.venue.name) {
				var eventLocation = document.createElement("div");
				$(eventLocation).html($apiResults.data[i].venue.name).addClass("event__location");
				eventDetails.appendChild(eventLocation);

			} else {
				console.log("No location provided.");
			}

			var eventRSVP = document.createElement("div");
			$(eventRSVP).html($apiResults.data[i].yes_rsvp_count + "<span> people going</span>").addClass("event__rsvp");
			eventDetails.appendChild(eventRSVP);

			if(meetup.venue) {

				GoogleModule.createMarker("<a href='meetup.html?id=" + $apiResults.data[i].id + "'>" + $apiResults.data[i].name + "</a>", $apiResults.data[i].venue.lat, $apiResults.data[i].venue.lon);
			} else {
				console.log("No geo coordinates.");
			}
		}
	}

	function singleMeetUp (data) {
		$apiResults = data;
		var lastDate = "";

		for (var i = 0; i < $apiResults.results.length; i++) {
			var meetup = $apiResults.results[i];
			var events = document.querySelector(".events")

			var singleEvent = document.createElement("div");
			$(singleEvent).addClass("event singleEvent");
			events.appendChild(singleEvent);

			var eventDetails = document.createElement("div");
			$(eventDetails).addClass("event_details");
			singleEvent.appendChild(eventDetails);

			var eventName = document.createElement("div");
			$(eventName).html("<a href='meetup.html?id=" + $apiResults.results[i].id + "'>" + $apiResults.results[i].name + "</a>").addClass("event__name singleEvent__name");
			eventDetails.appendChild(eventName);

			var eventGroup = document.createElement("div");
			$(eventGroup).html("By: "+ $apiResults.results[i].group.name).addClass("event__group singleEvent__group");
			eventDetails.appendChild(eventGroup);

			var eventTimeParent = document.createElement("div");
			$(eventTimeParent).addClass("event__time__parent");
			eventDetails.appendChild(eventTimeParent);

			var eventTime = document.createElement("div");
			var eventTimeGlyphicon = document.createElement("span");

			var newDate = new Date($apiResults.results[i].time);
			var newDateString = formatDate(newDate);

			$(eventTime).html(newDateString).addClass("event__time singleEvent__time");
			$(eventTimeGlyphicon).html("").addClass("glyphicon glyphicon-time");
			eventTimeParent.appendChild(eventTimeGlyphicon);
			eventTimeParent.appendChild(eventTime);

			if (meetup.venue && meetup.venue.name) {

				var eventLocationParent = document.createElement("div");
				$(eventLocationParent).addClass("event__location__parent");
				eventDetails.appendChild(eventLocationParent);

				var eventLocationGlyphicon = document.createElement("span");
				$(eventLocationGlyphicon).html("").addClass("glyphicon glyphicon-map-marker");
				eventLocationParent.appendChild(eventLocationGlyphicon);

				var eventLocation = document.createElement("div");
				$(eventLocation).html($apiResults.results[i].venue.name).addClass("event__location singleEvent__location");
				eventLocationParent.appendChild(eventLocation);

			} else {
				console.log("No location provided.");
			}

			var eventRSVP = document.createElement("div");
			$(eventRSVP).html($apiResults.results[i].yes_rsvp_count + "<span> people going</span>").addClass("event__rsvp singleEvent__rsvp");
			eventDetails.appendChild(eventRSVP);


			var eventDescription = document.createElement("div");
			$(eventDescription).html($apiResults.results[i].description).addClass("event__description");
			eventDetails.appendChild(eventDescription);

			if(meetup.venue) {

				GoogleModule.createMarker("<a href='meetup.html?id=" + $apiResults.results[i].id + "'>" + $apiResults.results[i].venue.name + "</a>", $apiResults.results[i].venue.lat, $apiResults.results[i].venue.lon);
			} else {
				console.log("No geo coordinates.");
			}

			var attendEvent = document.createElement("button");
			$(attendEvent).html("Join MeetUp").addClass("btn-large attend__event");
			eventDetails.appendChild(attendEvent);
		}
	}


	$(".categories-button").on("click", function () {
		window.open("categories.html");
		groupResults();
	});


	var getAllEvents = function () {

		$.ajax({
			url: 'https://api.meetup.com/find/events?key=4171704510613e4d1da4c3127602965&sign=true',
			dataType: 'jsonp',
			success: function(data) {
		    	eventResults(data);
			},
		});
	};

	var getSingleEvent = function (meetupID) {

		$.ajax({
			url: 'https://api.meetup.com/2/events?key=4171704510613e4d1da4c3127602965&sign=true&event_id=' + meetupID,
			dataType: 'jsonp',
			success: function(data) {
		    	singleMeetUp(data);
			},
			error: function () {
				console.log("Failed to load data.");
			},

		});
	};

   	shared = {
   		getAllEvents:getAllEvents,
   		getSingleEvent:getSingleEvent,
	};
	return shared;
}());


function getParameterByName (name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(function() {
	$('.thumbnail').matchHeight();
});