var flightCardTemplate=_.template(`
	<div class="flightCard">
		<div class="card-top">
			<div class="ele flight-airline">
				<%= airline %>
			</div>
            <div class="ele flight-airline">
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
			<div class="ele flight-departure">
				Departing: <%= departingTime %>
			</div>
			
            <div class="ele flight-cost">
				<%= cost %>
			</div>
            
		</div>
        <div class="card-row">
            <div class="ele">
				Returning: <%= returnTime %>
			</div>
            <div class="ele">
                <%= points %>
			</div>
        </div>
		<div class="card-bottom">
			<div class="ele">
				From <%= departingLoc %> to <%= arrivalLoc %>
			</div>
			<button class="ui mini dense compact button icon">
				<i class="icon external square"></i>
			</button>
		</div>
	</div>
`)