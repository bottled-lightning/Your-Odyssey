/*
	* Description: This page handles the javascript logic for index.html
*/

//serving as a semi-static config section
airplaneSource="airportlist.json"; //the file that we will use as a source for airport data

var flightSearchView = Backbone.View.extend({
	/*
	* Description: Called when the view is first added to the dom
	* Parameters: None
	* Return: None
	*/
	initialize: function(){
        var view=this;
        view.render();
	},
	/*
	* Description: Called by init for functions that attach to the dom elements
	* Parameters: None
	* Return: None
	*/
	render: function(){
        var view=this;
        view.$el.append(flightSearchTemplate());
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
            if($('#from').dropdown('get value') == $('#to').dropdown('get value')){
				window.alert("You have selected the same outbound and inbound airports.\nPlease select a valid pair of airports.");
			}
			// Invalid adult count
			else if($('#adults').dropdown('get value') < 0){
				window.alert("You have selected an invalid value for number of adults.\nPlease try selecting the number of adult passengers again.");
			}
			//Invalid child count
			else if($('#children').dropdown('get value') < 0){
				window.alert("You have selected an invalid value for number of children.\nPlease try selecting the number of children passengers again.");
			}
			//sessionStorage is disabled on the browser
			else if (!window.sessionStorage){
				window.alert("Session storage is missing.\nPlease try again.");
			}else{
				//Create a hash to represent the data of the query, stringify it, and add to sessionStorage
				descriptor={}
				descriptor.from=$('#from').dropdown('get value');
				descriptor.to=$('#to').dropdown('get value');
				descriptor.departing=$('#departing').calendar('get date');
				descriptor.adults=$('#adults').dropdown('get value');
				descriptor.children=$('#children').dropdown('get value');
				descriptor.program=$('#program').dropdown('get value');
				window.sessionStorage.setItem('descriptor',JSON.stringify(descriptor));
				document.location.href = 'Flight-Selector.html';
			}
		});
	}
});