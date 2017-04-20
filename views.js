// This file governs all javascript code that will ever execute in the domain
// This will eventually be broken up, but there isn't a pressing need to yet

airplaneSource="airportlist.json"; //the file that we will use as a source for airport data
var flightCards = []; // Information for flights
var tmpFlightCards = [];
var sortFilter = [ 0, 0, 0, 0 ];
var departureFilter = [ 0, 0, 0 ];
var costFilter = [ 0, 0, 0 ];

// The javascript code responsible for index.html and everything it displays
var flightSearchView = Backbone.View.extend({
	initialize: function(){
        //add the search template to the dom
        if ($(window).width() > 800){
            this.$el.append(flightSearchTemplate());
        }
        else {
            this.$el.append(mobileFlightSearchTemplate());
        }
        this.render();
        var _this = this;
        /*$(window).on('resize orientationChange', function(event) {
            
            console.log('resized');

            if ($(window).width() > 800){
                $(".flightsearch").append(flightSearchTemplate());
                _this.render();
            }
            else{
                $(".flightsearch").append(mobileFlightSearchTemplate());
                _this.render();
            }
       })*/

	},
	render: function(){
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
			if ($('#departing').calendar('get date') > $('#returning').calendar('get date')){
                console.log('dates error'),
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
function makeRequest(OUTBOUND_LOCATION, INBOUND_LOCATION, OUTBOUND_DATE, INBOUND_DATE, FlightRequest, program){
	var data = {};
	$.ajax({	
        //PLEASE DO NOT PUSH API KEYS
        //In reality this query should have a backend passthrough that appends the api key
		url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyBZf3vCUJ_eeaaidE9pQ10n4BM-HoNBoCM',
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
				var departureTimeStr = "";
				trips["tripOption"][i]["slice"]["0"]["segment"].forEach(function(e){
						departureTimeStr += e["leg"]["0"].departureTime + " ";
				});
                var arrivalTimeStr = "";
				trips["tripOption"][i]["slice"]["0"]["segment"].forEach(function(e){
						arrivalTimeStr += e["leg"]["0"].arrivalTime + " ";
				});
   			flightCards.push(
				{
					departingLoc: OUTBOUND_LOCATION,
					arrivalLoc: INBOUND_LOCATION,
					departingTime: departureTimeStr,
					returnTime: arrivalTimeStr,
					// NOTE: WE NEED TO THEN TRANSLATE A CARRIER ID -> CARRIER NAME
					airline: airlineStr,
					cost: trips["tripOption"][i].saleTotal,
                    points: GetPoints(program, parseInt(trips["tripOption"][i].saleTotal.substr(3))),
					adults: trips["tripOption"][i]["pricing"]["0"]["passengers"].adultCount,
					children: trips["tripOption"][i]["pricing"]["0"]["passengers"].childCount
				}
			);
            tmpFlightCards = flightCards.slice(0);
            for ( i = 0; i < tmpFlightCards.length; i++ )
                $('.flight-bin').append( flightCardTemplate( tmpFlightCards[i] ) );
		}
			
		},
		error: function(data) {
			console.log(data);
            window.alert('Flight query failed. Try again later.');
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
		// enable highlighting of selected menu items
		$('.menu a.item').click(function(){
	        $(this)
	        .addClass('active')    //add highlighting to the selected element  
	        .closest('.ui.menu')   //find containing menu
	        .find('.item')         //other items elements aren't necessarily siblings in the dom, so find all child elements
	        .not($(this))          //assert that we aren't selecting the currently selected element
	        .removeClass('active');//remove previous select highlight
		});

        $('#airline').click(function(){
            if ( sortFilter[0] != 1 ){
                for ( i = 0; i < sortFilter.length; i++ )
                    sortFilter[i] = 0;
                sortFilter[0] = 1;
                filter();
                for ( i = 0; i < flightCards.length; i++ )
                    $('.flight-bin').append( flightCardTemplate( tmpFlightCards[i] ) );
            }
        });
        $('#arrival').click(function(){
            if ( sortFilter[1] != 1 ){
                for ( i = 0; i < sortFilter.length; i++ )
                    sortFilter[i] = 0;
                sortFilter[1] = 1;
                filter();
                for ( i = 0; i < flightCards.length; i++ )
                    $('.flight-bin').append( flightCardTemplate( tmpFlightCards[i] ) );
            }
        });
        $('#departure').click(function(){
            if ( sortFilter[2] != 1 ){
                for ( i = 0; i < sortFilter.length; i++ )
                    sortFilter[i] = 0;
                sortFilter[2] = 1;
                filter();
                for ( i = 0; i < flightCards.length; i++ )
                    $('.flight-bin').append( flightCardTemplate( tmpFlightCards[i] ) );
            }
        });
        $('#cost').click(function(){
            if ( sortFilter[3] != 1 ){
                for ( i = 0; i < sortFilter.length; i++ )
                    sortFilter[i] = 0;
                sortFilter[3] = 1;
                filter();
                for ( i = 0; i < flightCards.length; i++ )
                    $('.flight-bin').append( flightCardTemplate( tmpFlightCards[i] ) );
            }
        });
        $('#noneT').click(function(){
            for ( i = 0; i < departureFilter.length; i++ )
                departureFilter[i] = 0;
            filter();
                for ( i = 0; i < flightCards.length; i++ )
                    $('.flight-bin').append( flightCardTemplate( tmpFlightCards[i] ) );
        });
        $('#morning').click(function(){
            if ( departureFilter[0] != 1 ){
                for ( i = 0; i < departureFilter.length; i++ )
                    departureFilter[i] = 0;
                departureFilter[0] = 1;
                filter();
                for ( i = 0; i < flightCards.length; i++ )
                    $('.flight-bin').append( flightCardTemplate( tmpFlightCards[i] ) );
            }
        });
        $('#afternoon').click(function(){
            if ( departureFilter[1] != 1 ){
                for ( i = 0; i < departureFilter.length; i++ )
                    departureFilter[i] = 0;
                departureFilter[1] = 1;
                filter();
                for ( i = 0; i < flightCards.length; i++ )
                    $('.flight-bin').append( flightCardTemplate( tmpFlightCards[i] ) );
            }
        });
        $('#evening').click(function(){
            if ( departureFilter[2] != 1 ){
                for ( i = 0; i < departureFilter.length; i++ )
                    departureFilter[i] = 0;
                departureFilter[2] = 1;
                filter();
                for ( i = 0; i < flightCards.length; i++ )
                    $('.flight-bin').append( flightCardTemplate( tmpFlightCards[i] ) );
            }
        });
        $('#noneC').click(function(){
            for ( i = 0; i < costFilter.length; i++ )
                costFilter[i] = 0;
            filter();
                for ( i = 0; i < flightCards.length; i++ )
                    $('.flight-bin').append( flightCardTemplate( tmpFlightCards[i] ) );
        });
        $('#low').click(function(){
            console.log(costFilter);
            console.log(sortFilter);
            console.log(departureFilter);
            if ( costFilter[0] != 1 ){
                for ( i = 0; i < costFilter.length; i++ )
                    costFilter[i] = 0;
                costFilter[0] = 1;
                filter();
                for ( i = 0; i < flightCards.length; i++ )
                    $('.flight-bin').append( flightCardTemplate( tmpFlightCards[i] ) );
            }
        });
        $('#med').click(function(){
            if ( costFilter[1] != 1 ){
                for ( i = 0; i < costFilter.length; i++ )
                    costFilter[i] = 0;
                costFilter[1] = 1;
                filter();
                for ( i = 0; i < flightCards.length; i++ )
                    $('.flight-bin').append( flightCardTemplate( tmpFlightCards[i] ) );
            }
        });
        $('#high').click(function(){
            if ( costFilter[2] != 1 ){
                for ( i = 0; i < costFilter.length; i++ )
                    costFilter[i] = 0;
                costFilter[2] = 1;
                filter();
                for ( i = 0; i < flightCards.length; i++ )
                    $('.flight-bin').append( flightCardTemplate( tmpFlightCards[i] ) );
            }
        });
		var descriptor=null; //the parameters passed to the page if any
		// check if sessionstorage exists
		if (window.sessionStorage){
			descriptor=window.sessionStorage.getItem('descriptor');
		}
		// check if we have meaningful results from session storage
		if(descriptor==null){
            //we haven't received a descriptor. Alert user.
			window.alert("The search parameters were not properly passed on.\nPlease try searching again.");
		}
		else{
			// unpack the parameters for the search and display them in fields for the user to confirm intended search
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
			  "adultCount": descriptor.adults,
			  "infantInLapCount": 0,
			  "infantInSeatCount": 0,
			  "childCount": descriptor.children,
			  "seniorCount": 0
			},
			"solutions": 20,
			"refundable": false
		  }
		}
		makeRequest(descriptor.from, descriptor.to, descriptor.departing.split('T')[0], descriptor.returning.split('T')[0], FlightRequest, descriptor.program);
	}
});

function GetPoints(program, usd){
    if(program == "Chase Sapphire Preferred" || program == "Chase Business Preferred"){
        return usd/1.25 * 100;
    }
    else if(program == "Chase Sapphire Reserve"){
        return usd/1.5 * 100;
    }
};

// Sort functions
function airlineSort(a,b){
    if ( a.airline < b.airline )
        return -1;
    if ( a.airline > b.airline )
        return 1;
    return 0;
}
function departureSort(a,b){
    if ( a.returnTime < b.returnTime )
        return -1;
    if ( a.returnTime > b.returnTime )
        return 1;
    return 0;
}
function arrivalSort(a,b){
    if ( a.departingTime < b.departingTime )
        return -1;
    if ( a.departingTime > b.departingTime )
        return 1;
    return 0;
}
function costSort(a,b){
    var aCost = parseInt( (a.cost).replace('$', '') );
    var bCost = parseInt( (b.cost).replace('$', '') );
    if ( aCost < bCost )
        return -1;
    if ( aCost > bCost )
        return 1;
    return 0;
}
// Filter Functions
function filter(){
    $('.flight-bin').empty();
    tmpFlightCards = flightCards.slice(0);
    var sortI = 0;
    var departI = 0;
    var costI = 0;
    for ( i = 0; i < 4; i++ )
        if ( sortFilter[i] == 1 )
            sortI = i+1;
    for ( i = 0; i < 3; i++ ){
        if ( departureFilter[i] == 1 )
            departI = i+1;
        if ( costFilter[i] == 1 )
            costI = i+1;
    }
    sortFilterHelper( sortI );
    departFilterHelper( departI );
    costFilterHelper( costI );
}
function sortFilterHelper( x ){
    if ( x != 0 ){
        if ( x == 1 )
            tmpFlightCards.sort( airlineSort );
        if ( x == 2 )
            tmpFlightCards.sort( departureSort );
        if ( x == 3 )
            tmpFlightCards.sort( arrivalSort );
        if ( x == 4 )
            tmpFlightCards.sort( costSort );
    }
}
function departFilterHelper( x ){
    var a, b;
    if ( x != 0 ){
        if ( x == 1 ){
            a = '05:00';
            b = '11:59';
        }
        if ( x == 2 ){
            a = '12:00';
            b = '17:59';
        }
        if ( x == 3 ){
            a = '18:00';
            b = '23:59';
        }
        for ( i = 0; i < tmpFlightCards.length; i++ ){
            var departT = '';
            for ( var j = 11; j < 15; j++ )
                departT = departT.concat( (tmpFlightCards[i].departingTime)[j] );
            if ( departT < a || departT > b )
                tmpFlightCards.splice(i,1);
        }
    }
}
function costFilterHelper( x ){
    var a, b;
    if ( x != 0 ){
        if ( x == 1 ){
            a = 0;
            b = 500;
        }
        if ( x == 2 ){
            a = 500;
            b = 1000;
        }
        if ( x == 3 ){
            a = 1000;
            b = 100000;
        }
        for ( i = 0; i < tmpFlightCards.length; i++ ){
            var x = parseInt( (tmpFlightCards[i].cost).replace('$', '') );
            if ( x < a || x > b )
                tmpFlightCards.splice(i,1);
        }
    }
}