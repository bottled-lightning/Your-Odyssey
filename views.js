// This file governs all javascript code that will ever execute in the domain
// This will eventually be broken up, but there isn't a pressing need to yet

airplaneSource="airportlist.json"; //the file that we will use as a source for airport data
var flightCards = []; // Information for flights

// The javascript code responsible for index.html and everything it displays
var flightSearchView = Backbone.View.extend({
	initialize: function(){
        var view=this;
        view.$el.append(flightSearchTemplate());
        view.render();
	},
	render: function(){
        var view=this;
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
    // This is code that makes the actual AJAX request
    makeRequest: function(OUTBOUND_LOCATION, INBOUND_LOCATION, OUTBOUND_DATE, FlightRequest, program){
        var view=this;
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
                            points: view.getPoints(program, parseInt(trips["tripOption"][i].saleTotal.substr(3))),
                            adults: trips["tripOption"][i]["pricing"]["0"]["passengers"].adultCount,
                            children: trips["tripOption"][i]["pricing"]["0"]["passengers"].childCount
                        }
                    );
                }
                for ( i = 0; i < flightCards.length; i++ )
                    $('.flight-bin').append( flightCardTemplate( flightCards[i] ) );
            },
            error: function(data) {
                console.log(data);
                window.alert('Flight query failed. Try again later.');
            }
        });
    },
    sortHelper: function(sortFunc){
        var view=this;
        var $flights=$('.flight-bin').children();
        [].sort.call($flights, sortFunc);
        $flights.each(function(){
            $('.flight-bin').append(this);
        });
    },
    sortCost: function(a, b){
        var aCost=parseInt($(a).find('.flight-cost').text().trim().replace('USD',''));
        var bCost=parseInt($(b).find('.flight-cost').text().trim().replace('USD',''));
        return aCost-bCost;
    },
    sortDeparture: function(a, b){
        var aTime=$(a).find('.flight-departure').text().trim();
        var bTime=$(b).find('.flight-departure').text().trim();
        return aTime.localeCompare(bTime);
    },
    sortAirline: function(a, b){
        var aLine=$(a).find('.flight-airline').text().trim();
        var bLine=$(b).find('.flight-airline').text().trim();
        return aLine.localeCompare(bLine);
    },
    costFilterHelper: function(criteriaFunc){
        $('.flight-bin').children().addClass('filter-cost');
        $('.flight-bin').children().filter(function(i){
            var c=parseInt($(this).find('.flight-cost').text().trim().replace('USD',''));
            return criteriaFunc(c);
        }).removeClass('filter-cost');
    },
    timeFilterHelper: function(criteriaFunc){
        $('.flight-bin').children().addClass('filter-time');
        $('.flight-bin').children().filter(function(i){
            var c=$(this).find('.flight-departure').text().trim();
            var departT='';
            for ( var j = 11; j < 15; j++ )
                departT = departT.concat( c[j] );
            return criteriaFunc(departT);
        }).removeClass('filter-time');
    },
    getPoints: function(program, usd){
        if(program == "Chase Sapphire Preferred" || program == "Chase Business Preferred"){
            return usd/1.25 * 100;
        }
        else if(program == "Chase Sapphire Reserve"){
            return usd/1.5 * 100;
        }
    },
    initialize: function(){
        var view=this;
        this.render();
    },
    render: function(){
        var view=this;
        // append main template to dom
        this.$el.append(flightSelectorTemplate());
        // enable dropdowns
        $('.ui.dropdown')
            .dropdown();
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
            view.sortHelper(view.sortAirline);
        });
        $('#departure').click(function(){
            view.sortHelper(view.sortDeparture);
        });
        $('#cost').click(function(){
            view.sortHelper(view.sortCost);
        });
        $('#noneT').click(function(){
            view.timeFilterHelper(function(t){
                return true;
            });
        });
        $('#morning').click(function(){
            view.timeFilterHelper(function(t){
                return ( t < "05:00" || t > "11:59" );
            });
        });
        $('#afternoon').click(function(){
            view.timeFilterHelper(function(t){
                return ( t < "12:00" || t > "17:59" );
            });
        });
        $('#evening').click(function(){
            view.timeFilterHelper(function(t){
                return ( t < "18:00" || t > "23:59" );
            });
        });
        $('#noneC').click(function(){
            view.costFilterHelper(function(a){
                return true;
            });
        });
        $('#low').click(function(){
            view.costFilterHelper(function(a){
                return a<500;
            });
        });
        $('#med').click(function(){
            view.costFilterHelper(function(a){
                return a<1000;
            });
        });

        //handle flight request unpacking
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
            $('#adults').text(descriptor.adults);
            $('#children').text(descriptor.children);
            $('#program').text(descriptor.program);
        }

        // Request is made
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
        /*
        flightCards.push(
           {
               departingLoc: 'John F Kennedy International Airport',
               arrivalLoc: 'Los Angeles International Airport',
               departingTime: '3/22/2017 3:40pm',
               returnTime: '3/23/2017 6:10pm',
               airline: 'Fuck',
               cost: '$100',
                 points: "Chase Sapphire Preferred",
               adults: '1',
               children: '0'
           }
       );
         flightCards.push(
           {
               departingLoc: 'John F Kennedy International Airport',
               arrivalLoc: 'Los Angeles International Airport',
               departingTime: '3/22/2017 3:40pm',
               returnTime: '3/23/2017 6:10pm',
               airline: 'Zalking',
               cost: '$600',
                 points: "Chase Sapphire Preferred",
               adults: '1',
               children: '0'
           }
       );
         flightCards.push(
           {
               departingLoc: 'John F Kennedy International Airport',
               arrivalLoc: 'Los Angeles International Airport',
               departingTime: '3/22/2017 3:40pm',
               returnTime: '3/23/2017 6:10pm',
               airline: 'Zalking',
               cost: '$10',
                 points: "Chase Sapphire Preferred",
               adults: '1',
               children: '0'
           }
       );
         flightCards.push(
           {
               departingLoc: 'John F Kennedy International Airport',
               arrivalLoc: 'Los Angeles International Airport',
               departingTime: '3/22/2017 2:40pm',
               returnTime: '3/23/2017 5:10pm',
               airline: 'Zalking',
               cost: '$999',
                 points: "Chase Sapphire Preferred",
               adults: '1',
               children: '0'
           }
       );
         tmpFlightCards = flightCards.slice(0);
         for ( i = 0; i < tmpFlightCards.length; i++ )
             $('.flight-bin').append( flightCardTemplate( tmpFlightCards[i] ) );*/
        view.makeRequest(descriptor.from, descriptor.to, descriptor.departing.split('T')[0], FlightRequest, descriptor.program);
    }
});