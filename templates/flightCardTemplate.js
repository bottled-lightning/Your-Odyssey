//A template that determines the display of each individual flight card
//Is called when a new card needs to be made.
var flightCardTemplate=_.template(`
	<div class="flightCard">
		<div class="card-top">
			<div class="ele flight-airline">
				<%= airline %>
			</div>
            <div class="ele flight-number">
				<%= flightNumber %>
			</div>
		</div>
		<div class="card-row">
			<div class="ele">
				Adults: <%= adults %>
			</div>
			<div class="ele">
				Children: <%= children %>
			</div>
		</div>
		<div class="card-row">
            <div class="ele">
                <div class="ele">
                    Departing:
                </div>
                <div class="ele flight-departure">
                    <%= departingTime %>
                </div>
            </div>
			
            <div class="ele flight-cost">
				<%= cost %>
			</div>
            
		</div>
        <div class="card-row">
            <div class="ele">
                <div class="ele">
                    Arrival:
                </div>
                <div class="ele flight-departure">
                    <%= returnTime %>
                </div>
            </div>
            <div class="ele">
                Points: <%= points %>
			</div>
        </div>
		<div class="card-bottom">
			<div class="ele">
				From <%= departingLoc %> to <%= arrivalLoc %>
			</div>
            <div class="ele">
				Airports: <%= airports %>
			</div>
			<button class="ui mini dense compact button icon" onclick="bookExternal(this.parentNode.parentNode.children[0].children[0].innerHTML,this.parentNode.parentNode.children[0].children[1].innerHTML)">
				<i class="icon external square"></i>
			</button>
		</div>
	</div>
`)