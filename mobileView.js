// The javascript code responsible for index.html and everything it displays
var mobileFlightSearchView = Backbone.View.extend({
	initialize: function(){
		this.render();
	},
	render: function(){
		//add the search template to the dom
		this.$el.append(mobileFlightSearchTemplate());
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