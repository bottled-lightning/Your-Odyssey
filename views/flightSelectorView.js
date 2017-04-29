var flightCards = []; // Information for flights, is appended to by makeRequest
var AirlineCodes = {  //A lookup JSON to convert airline codes to their human-readable names
    "AS" : {
        "Name" : "Alaskan Airlines"
    },
    "B6" : {
        "Name" : "JetBlue"
    },
    "VX" : {
        "Name" : "Virgin America"
    },
    "SY" : {
        "Name" : "Sun Country"
    },
    "WN" : {
        "Name" : "Southwest Airlines"
    },
    "AA" : {
        "Name" : "American Airlines"
    },
    "DL" : {
        "Name" : "Delta Airlines"
    },
    "UN" : {
        "Name" : "United Airlines"
    }
};

var flightSelectorView = Backbone.View.extend({
  /*
  * Note: Currently experimental, will likely change
  * Description: Googles the corresponding flight so that the user may book it externally at the moment
  * Parameters:
  * airline: The human readable name of the airline offering the flight
  * flightNumber: The number of the flight that the user wishes to book
  * Return: None
  */
  bookExternal: function(airline, flightNumber){
    flightNumber = flightNumber.trim();
    airline = airline.replace(/\s/g, '');
    flightNumber = flightNumber.replace("#", "%23");
    flightNumber = flightNumber.replace(/\s/g, '');
    query = "https://www.google.com/#q=".concat(airline, "+", flightNumber);
    window.open(query);
  },
  /*
  * Description: Makes a request for flights matching our criteria to qpxExpress and appends matching cards to the dom
  * Parameters:
  * OUTBOUND_LOCATION: The airport the flight should leave from
  * INBOUND_LOCATION: The airport the flight should land at
  * OUTBOUND_DATE: The day the flight should depart
  * FlightRequest: The json data of the request to be made
  * program: The reward program that is being used
  * Return: None
  */
  makeRequest: function(OUTBOUND_LOCATION, INBOUND_LOCATION, OUTBOUND_DATE, FlightRequest, program){
      var view=this;
      var data = {};
      $.ajax({    
          //PLEASE DO NOT PUSH API KEYS
          //In reality this query should have a backend passthrough that appends the api key
          url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(FlightRequest),
          success: function(data){
              var trips = data["trips"];
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
                  
                  arrivalTimeDate = arrivalTimeStr.split('T')[0];
                  arrivalTimeStr = arrivalTimeStr.split('T')[1];
                  arrivalTimeStr = arrivalTimeStr.split('-')[0];
                  arrivalTimeDate = arrivalTimeDate.concat(" ", arrivalTimeStr);
                  departureTimeDate = departureTimeStr.split('T')[0];
                  departureTimeStr = departureTimeStr.split('T')[1];
                  departureTimeStr = departureTimeStr.split('-')[0];
                  departureTimeDate = departureTimeDate.concat(" ", departureTimeStr);
                  flightCards.push(
                      {
                          departingLoc: OUTBOUND_LOCATION,
                          arrivalLoc: INBOUND_LOCATION,
                          departingTime: departureTimeDate,
                          returnTime: arrivalTimeDate,
                          // NOTE: WE NEED TO THEN TRANSLATE A CARRIER ID -> CARRIER NAME
                          airline: AirlineCodes[trips["tripOption"][i]["slice"]["0"]["segment"]["0"]["flight"].carrier].Name,
                          flightNumber: "Flight #".concat(trips["tripOption"][i]["slice"]["0"]["segment"]["0"]["flight"].number),
                          cost: trips["tripOption"][i].saleTotal,
                          points: Math.round(view.getPoints(program, parseInt(trips["tripOption"][i].saleTotal.substr(3)))),
                          airports: airlineStr,
                          adults: trips["tripOption"][i]["pricing"]["0"]["passengers"].adultCount,
                          children: trips["tripOption"][i]["pricing"]["0"]["passengers"].childCount
                      }
                  );
              }
              //append the matching flight cards to the dom
              for ( i = 0; i < flightCards.length; i++ )
                  $('.flight-bin').append( flightCardTemplate( flightCards[i] ) );
              //enable booking buttons
              $('.booking').click(function(){
                view.bookExternal(this.parentNode.parentNode.children[0].children[0].innerHTML,this.parentNode.parentNode.children[0].children[1].innerHTML)
              });
          },
          error: function(data) {
              console.log(data);
              window.alert('Flight query failed. Try again later.');
          }
      });
  },
  /*
  * Description: A helper function that sorts the flights by some function sortFunc
  * Parameters:
  * sortFunc: The function to sort by
  * Return: None
  */
  sortHelper: function(sortFunc){
      var view=this;
      var $flights=$('.flight-bin').children();
      [].sort.call($flights, sortFunc);
      $flights.each(function(){
          $('.flight-bin').append(this);
      });
  },
  /*
  * Description: A function that will sort cards by cost when used by sortHelper
  * Parameters:
  * a: The first flight card
  * b: The second flight card
  * Return: A number that determines how a should be sorted relative to b
  */
  sortCost: function(a, b){
      var aCost=parseInt($(a).find('.flight-cost').text().trim().replace('USD',''));
      var bCost=parseInt($(b).find('.flight-cost').text().trim().replace('USD',''));
      return aCost-bCost;
  },
  /*
  * Description: A function that will sort cards by departure time when used by sortHelper
  * Parameters:
  * a: The first flight card
  * b: The second flight card
  * Return: A number that determines how a should be sorted relative to b
  */
  sortDeparture: function(a, b){
      var aTime=$(a).find('.flight-departure').text().trim();
      var bTime=$(b).find('.flight-departure').text().trim();
      return aTime.localeCompare(bTime);
  },
  /*
  * Description: A function that will sort cards by airline name when used by sortHelper
  * Parameters:
  * a: The first flight card
  * b: The second flight card
  * Return: A number that determines how a should be sorted relative to b
  */
  sortAirline: function(a, b){
      var aLine=$(a).find('.flight-airline').text().trim();
      var bLine=$(b).find('.flight-airline').text().trim();
      return aLine.localeCompare(bLine);
  },
  /*
  * Description: A helper function that handles hiding/showing cards by cost
  * Parameters:
  * criteriaFunc: A function that returns true if the card should be displayed
  * Return: None
  */
  costFilterHelper: function(criteriaFunc){
      $('.flight-bin').children().addClass('filter-cost');
      $('.flight-bin').children().filter(function(i){
          var c=parseInt($(this).find('.flight-cost').text().trim().replace('USD',''));
          return criteriaFunc(c);
      }).removeClass('filter-cost');
  },
  /*
  * Description: A helper function that handles hiding/showing cards by time
  * Parameters:
  * criteriaFunc: A function that returns true if the card should be displayed
  * Return: None
  */
  timeFilterHelper: function(criteriaFunc){
      $('.flight-bin').children().addClass('filter-time');
      $('.flight-bin').children().filter(function(i){
          var c=$(this).find('.flight-departure').text().trim();
          var departT='';
          for ( var j = 11; j <= 15; j++ )
              departT = departT.concat( c[j] );
          timeStr = departT.split(":")[0];
          timeStr = timeStr.concat(departT.split(":")[1]);
          timeInt = parseInt(timeStr);
          return criteriaFunc(timeInt);
      }).removeClass('filter-time');
  },
  /*
  * Description: A function that returns the relative number of points the flight is worth
  * Parameters:
  * program: The name of the reward program being used
  * usd: The monetary cost of the flight
  * Return: The point value of the flight
  */
  getPoints: function(program, usd){
      if(program == "Chase Sapphire Preferred" || program == "Chase Business Preferred"){
          return usd/1.25 * 100;
      }
      else if(program == "Chase Sapphire Reserve"){
          return usd/1.5 * 100;
      }
  },
  /*
  * Description: A function called when the view is initialized
  * Parameters: None
  * Return: None
  */
  initialize: function(){
      var view=this;
      this.render();
  },
  /*
  * Description: A function that attaches and manages dom elements for this view
  * Parameters: None
  * Return: None
  */
  render: function(){
    var view=this;
    // append main template to dom
    view.$el.append(flightSelectorTemplate());
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
    //call airline sort routine when airline sort button is clicked
    $('#airline').click(function(){
        view.sortHelper(view.sortAirline);
    });
    //call departure sort routine when departure sort button is clicked
    $('#departure').click(function(){
        view.sortHelper(view.sortDeparture);
    });
    //call cost sort routine when cost sort button is clicked
    $('#cost').click(function(){
        view.sortHelper(view.sortCost);
    });
    //Remove all elements that are hidden due to time, user has no preference
    $('#noneT').click(function(){
        view.timeFilterHelper(function(t){
            return true;
        });
    });
    //User desires morning flight, show only flights from 00:00 to 11:59
    $('#morning').click(function(){
        view.timeFilterHelper(function(t){
            return ( t > 0000 && t < 1159 );
        });
    });
   //User desires afternoon flight, show only flights from 12:00 to 17:59
    $('#afternoon').click(function(){
        view.timeFilterHelper(function(t){
            return ( t > 1200 && t < 1759 );
        });
    });
    //User desires evening flight, show only flights from 18:00 to 23:59
    $('#evening').click(function(){
        view.timeFilterHelper(function(t){
            return ( t > 1800 && t < 2359 );
        });
    });
    //Remove all elements that are hidden due to cost, user has no preference
    $('#noneC').click(function(){
        view.costFilterHelper(function(a){
            return true;
        });
    });
    //User desires flight that costs less than $500, show only these
    $('#low').click(function(){
        view.costFilterHelper(function(a){
            return a<500;
        });
    });
    //User desires flight that costs less than %1000, show only these
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

    // The JSON data of the request for flights we wish to make
    var FlightRequest = 
    {
      "request": {
        "slice": [
          {
            "origin": descriptor.from,
            "destination": descriptor.to,
            "date": descriptor.departing.split('T')[0],
            "maxStops" : 0
          }
        ],
        "passengers": {
          "adultCount": parseInt(descriptor.adults),
          "infantInLapCount": 0,
          "infantInSeatCount": 0,
          "childCount": parseInt(descriptor.children),
          "seniorCount": 0
        },
        "solutions": 20,
        "refundable": false
      }
    }
    //make the request
    view.makeRequest(descriptor.from, descriptor.to, descriptor.departing.split('T')[0], FlightRequest, descriptor.program);
  }
});

