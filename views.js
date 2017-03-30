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
			if (!window.sessionStorage){
				// Something broke. This shouldn't happen
				window.alert("Things went very wrong. Very, very wrong.");
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
			window.alert("Things went very wrong. Very, very wrong.");
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
		// Append a bunch of dummy data that is exactly the same
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
		// fin
	}
});