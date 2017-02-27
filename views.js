airplaneSource="airportlist.json"

var flightSelectorView = Backbone.View.extend({
	initialize: function(){
		this.render();
	},
	render: function(){
		//adds a thing to the element's html
		//in this case is adding a template
		//this template can be found in templates.js
		//if we were attaching js functions, they'd go here
		this.$el.append(flightSelectorTemplate());
		$.getJSON(airplaneSource, function(json) {
		    _.each(json, function(airport){
				$('.airport-list').append(airportTemplate(airport));
			});
		});
		$('.ui.dropdown')
			.dropdown()
		;
		$('.ui.calendar').calendar({
			type: 'date'
		});
	}
});