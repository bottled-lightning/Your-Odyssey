var flightCards = []; // Information for flights
var flightSelectorView = Backbone.View.extend({
  // This is code that makes the actual AJAX request
  makeRequest: function(OUTBOUND_LOCATION, INBOUND_LOCATION, OUTBOUND_DATE, FlightRequest, program){
      var view=this;
      var data = {};
      $.ajax({    
          //PLEASE DO NOT PUSH API KEYS
          //In reality this query should have a backend passthrough that appends the api key
          url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyDk1wWH9nVv_QzJJmc-aHr7eaUpslumw1U',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(FlightRequest),
          success: function(data){
              console.log(data);
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
          for ( var j = 11; j <= 15; j++ )
              departT = departT.concat( c[j] );
          timeStr = departT.split(":")[0];
          timeStr = timeStr.concat(departT.split(":")[1]);
          timeInt = parseInt(timeStr);
          return criteriaFunc(timeInt);
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
      //filters time from 12:00 am to 1159 am
      $('#morning').click(function(){
          view.timeFilterHelper(function(t){
              return ( t > 0000 && t < 1159 );
          });
      });
      //filters time from 12:00 pm to 5:59pm
      $('#afternoon').click(function(){
          view.timeFilterHelper(function(t){
              return ( t > 1200 && t < 1759 );
          });
      });
      $('#evening').click(function(){
          view.timeFilterHelper(function(t){
              return ( t > 1800 && t < 2359 );
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
      
      view.makeRequest(descriptor.from, descriptor.to, descriptor.departing.split('T')[0], FlightRequest, descriptor.program);
  }
});
bookExternal = function(airline, flightNumber){
    flightNumber = flightNumber.trim();
    airline = airline.replace(/\s/g, '');
    flightNumber = flightNumber.replace("#", "%23");
    flightNumber = flightNumber.replace(/\s/g, '');
    query = "https://www.google.com/#q=".concat(airline, "+", flightNumber);
    console.log(query);
    window.open(query);
 };
 var AirlineCodes = { 
    "AS" : {
        "Name" : "Alaskan Airlines"
    },
    "B6" : {
        "Name" : "Jetblue"
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