// This file governs all javascript code that will ever execute in the domain
// This will eventually be broken up, but there isn't a pressing need to yet

airplaneSource="airportlist.json"; //the file that we will use as a source for airport data

// The javascript code responsible for index.html and everything it displays
var flightSearchView = Backbone.View.extend({
	initialize: function(){
		this.render();
	},
	render: function(){
		//add the search template to the dom
		this.$el.append(flightSearchTemplate());
		// for each valid us airport in the json list of airports, add it to the dropdown
		$.getJSON(airplaneSource, function(json) {
		    _.each(json, function(airport){
				$('.airport-list').append(airportTemplate(airport));
			});
		});
		// enable dropdown menus
		$('.ui.dropdown')
			.dropdown()
		;
		// enable calendars
		$('.ui.calendar').calendar({
			type: 'date'
		});
		// When we click the find flight button save our parameters to sessionstorage so we can echo them on the next page
		$('#search').click(function(){
			if ($('#from').dropdown('get value') < $('#to').dropdown('get value')){
				window.alert("You cannot DEPART after your RETURN date.\nPlease select a valid pair of dates.");
			}
			else if($('#from').dropdown('get value') == $('#to').dropdown('get value')){
				window.alert("You have selected the same outbound and inbound airports.\nPlease select a valid pair of airports.");
			}
			// Not sure how either of these two cases will happen... but just in case I guess
			else if($('#adults').dropdown('get value') < 0){
				window.alert("You have selected an invalid value for number of adults.\nPlease try selecting the number of adult passengers again.");
			}
			else if($('#children').dropdown('get value') < 0){
				window.alert("You have selected an invalid value for number of children.\nPlease try selecting the number of children passengers again.");
			}
			else if (!window.sessionStorage){
				// Something broke. This shouldn't happen
				window.alert("Session storage is missing.\nPlease try again.");
			}else{
				descriptor={}
				descriptor.from=$('#from').dropdown('get value');
				descriptor.to=$('#to').dropdown('get value');
				descriptor.departing=$('#departing').calendar('get date');
				descriptor.returning=$('#returning').calendar('get date');
				descriptor.adults=$('#adults').dropdown('get value');
				descriptor.children=$('#children').dropdown('get value');
				descriptor.program=$('#program').dropdown('get value');
				window.sessionStorage.setItem('descriptor',JSON.stringify(descriptor));
				document.location.href = 'Flight-Selector.html';
			}
		});
	}
});

// This is code that makes the actual AJAX request
function makeRequest(OUTBOUND_LOCATION, INBOUND_LOCATION, OUTBOUND_DATE, INBOUND_DATE, FlightRequest){
	var data = {};
	$.ajax({	
		//PLEASE DO NOT PUSH API KEYS
		url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyDk1wWH9nVv_QzJJmc-aHr7eaUpslumw1U',
		type: 'POST',
		contentType: 'application/json',
		data: JSON.stringify(FlightRequest),
		success: function(data){
			var trips = data["trips"];
			//console.log(trips);
			for (i = 0; i < trips["tripOption"].length; i++) {
				var airlineStr = OUTBOUND_LOCATION + " ";
				trips["tripOption"][i]["slice"]["0"]["segment"].forEach(function(e){
						airlineStr += e["leg"]["0"].destination + " ";
				});
				var timeStr = "";
				trips["tripOption"][i]["slice"]["0"]["segment"].forEach(function(e){
						timeStr += e["leg"]["0"].departureTime + " ";
				});
   			$('.flight-bin').append(flightCardTemplate(
				{
					departingLoc: OUTBOUND_LOCATION,
					arrivalLoc: INBOUND_LOCATION,
					departingTime: timeStr,
					returnTime: 'need to add',
					// NOTE: WE NEED TO THEN TRANSLATE A CARRIER ID -> CARRIER NAME
					airline: airlineStr,
					cost: trips["tripOption"][i].saleTotal,
					adults: '1',
					children: '1'
				}
			));
		}
			
		},
		error: function(data) {
			console.log(data);
		}
	});
};

// The javascript code for Flight-Selector.hmtl and everything it displays
var flightSelectorView = Backbone.View.extend({
	initialize: function(){
		this.render();
	},
	render: function(){
		// append main template to dom
		this.$el.append(flightSelectorTemplate());
		// enable dropdowns
		$('.ui.dropdown')
			.dropdown()
		;
		// enable selection of menu items even if they don't do things yet
		$('.menu a.item').click(function(){
	        $(this)
	        .addClass('active')
	        .closest('.ui.menu')
	        .find('.item')
	        .not($(this))
	        .removeClass('active');
		});
		var descriptor=null; //the parameters passed to the page if any
		// check if sessionstorage exists
		if (window.sessionStorage){
			descriptor=window.sessionStorage.getItem('descriptor');
		}
		// check if we have meaningful results from session storage
		if(descriptor==null){
			window.alert("The search parameters were not properly passed on.\nPlease try searching again.");
		}
		else{
			// unpack the parameters for the search and echo them
			descriptor=JSON.parse(descriptor);
			$('#from').text(descriptor.from);
			$('#to').text(descriptor.to);
			$('#departing').text(descriptor.departing.split('T')[0]);
			$('#returning').text(descriptor.returning.split('T')[0]);
			$('#adults').text(descriptor.adults);
			$('#children').text(descriptor.children);
			$('#program').text(descriptor.program);
		}

		// Request is made
		var flights;
		//response_data, OUTBOUND_LOCATION, INBOUND_LOCATION, OUTBOUND_DATE, INBOUND_DATE
		// console.log(descriptor.departing.split('T')[0]);
		// console.log(descriptor.returning.split('T')[0]);
		console.log(descriptor.from);
		console.log(descriptor.to);
		console.log(descriptor.departing.split('T')[0]);
		var FlightRequest = 
		{
		  "request": {
			"slice": [
			  {
				"origin": descriptor.from,
				"destination": descriptor.to,
				"date": descriptor.departing.split('T')[0]
			  }
			],
			"passengers": {
			  "adultCount": 1,
			  "infantInLapCount": 0,
			  "infantInSeatCount": 0,
			  "childCount": 0,
			  "seniorCount": 0
			},
			"solutions": 20,
			"refundable": false
		  }
		}
		makeRequest(descriptor.from, descriptor.to, descriptor.departing.split('T')[0], descriptor.returning.split('T')[0], FlightRequest);
		// This should be the code where we iteratively create
		// flight cards using the JSON stored as "flights"
		

		// Append a bunch of dummy data that is exactly the same
		/*	
		$('.flight-bin').append(flightCardTemplate(
			{
				departingLoc: 'foo',
				arrivalLoc: 'bar',
				departingTime: '3/30/2017 3:40pm',
				returnTime: '3/30/2017 6:00pm',
				airline: 'Walking',
				cost: '$0',
				adults: '1',
				children: '0'
			}
		));
		*/

		// fin
	}
});


