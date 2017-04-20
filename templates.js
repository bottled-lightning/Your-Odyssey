// This file governs all layout of all pages everywhere
// This will eventually be broken up, but there isn't a pressing need to yet
// #plannedrefactor
// Also, these things are a pain to comment properly due to language jumps, but it is just html, so you should be fine (go inspect the page, it'll be easier)

// How a single menu option for an airport will be displayed
var airportTemplate = _.template(`
	<div class="item" data-value="<%= iata%>"><%= iata%>-<%= name%></div>
`);

// The major source of formatting for index.html
var flightSearchTemplate = _.template(`
	<img src="images/background.jpg" class="splash">
	<div class="selector-card">
		<div class="title">Your Odyssey</div>
		<div class="ui form">
			<div class="row">
				<div class="wrapper-wide">
					<label class="white">Flying from</label>
					<div class="ui fluid flow search selection dropdown" id="from">
						<i class="dropdown icon"></i>
						<div class="default text">Choose one</div>
						<div class="menu airport-list">
						</div>
					</div>
				</div>
				<div class="wrapper-wide">
					<label class="white">Flying to</label>
					<div class="ui fluid flow search selection dropdown" id="to">
						<i class="dropdown icon"></i>
						<div class="default text">Choose one</div>
						<div class="menu airport-list">
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="wrapper">
					<label class="white">Adults (18+)</label>
					<div class="ui selection fluid dropdown" id="adults">
						<i class="dropdown icon"></i>
						<div class="default text">1</div>
						<div class="menu">
							<div class="item" data-value="1">1</div>
							<div class="item" data-value="2">2</div>
							<div class="item" data-value="3">3</div>
							<div class="item" data-value="4">4</div>
							<div class="item" data-value="5">5</div>
							<div class="item" data-value="6">6</div>
						</div>
					</div>
				</div>
				<div class="wrapper">
					<label class="white">Children (0-17)</label>
					<div class="ui fluid selection dropdown" id="children">
						<i class="dropdown icon"></i>
						<div class="default text">0</div>
						<div class="menu">
							<div class="item" data-value="0">0</div>
							<div class="item" data-value="1">1</div>
							<div class="item" data-value="2">2</div>
							<div class="item" data-value="3">3</div>
							<div class="item" data-value="4">4</div>
							<div class="item" data-value="5">5</div>
							<div class="item" data-value="6">6</div>
						</div>
					</div>
				</div>
				<div class="wrapper">
					<label class="white">Reward program</label>
					<div class="ui fluid selection dropdown" id="program">
						<i class="dropdown icon"></i>
						<div class="default text wspw">Choose one</div>
						<div class="menu">
							<div class="item" data-value="-">-</div>
							<div class="item" data-value="Chase Sapphire Preferred">Chase Sapphire Preferred</div>
                            <div class="item" data-value="Chase Sapphire Reserve">Chase Sapphire Reserve</div>
                            <div class="item" data-value="Chase Business Preferred">Chase Business Preferred</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="wrapper-static">
					<label class="white">Departing</label>
					<div class="ui fluid calendar" id="departing">
					    <div class="ui input left icon">
					    <i class="calendar icon"></i>
					    <input type="text" placeholder="Date">
					    </div>
					</div>
				</div>
				<div class="wrapper">
					<label></label>
					<br>
					<button class="ui fluid primary button" id="search">
						Find flight
					</button>
				</div>
			</div>
		</div>
	</div>
`);

// The major source of formatting for Flight-Selector.html
var flightSelectorTemplate=_.template(`
	<img src="images/background.jpg" class="splash">
	<div class="column-display">
		<div class="header-bar">
			<div class="title">Your Odyssey</div>
		</div>
		<div class="info-bar">
			<div class="info-wrapper">
				<div class="info-element">
					<div class="info-header">
						Flying From
					</div>
					<div class="info-content" id="from">
					</div>
				</div>
				<div class="info-element">
					<div class="info-header">
						Flying To
					</div>
					<div class="info-content" id="to">
					</div>
				</div>
				<div class="info-element">
					<div class="info-header">
						Departing
					</div>
					<div class="info-content" id="departing">
					</div>
				</div>
				<div class="info-element">
					<div class="info-header">
						Returning
					</div>
					<div class="info-content" id="returning">
					</div>
				</div>
				<div class="info-element">
					<div class="info-header">
						Adults
					</div>
					<div class="info-content" id="adults">
					</div>
				</div>
				<div class="info-element">
					<div class="info-header">
						Children
					</div>
					<div class="info-content" id="children">
					</div>
				</div>
				<div class="info-element">
					<div class="info-header">
						Reward Program
					</div>
					<div class="info-content" id="program">
					</div>
				</div>
			</div>
		</div>
		<div class="centered">
			<div class="page">
				<div class="filter-bar">
					<div class="ui text menu dense">
						<div class="header item">Sort By</div>
				        <a class="item" id='airline'>
                            Airline
                        </a>
                        <a class="item" id='departure'>
                            Departure time
                        </a>
                        <a class="item" id='cost'>
                            Cost
                        </a>
                        <div class="header item">Filter By</div>
                        <div class="ui selection dropdown">
                            <i class="dropdown icon"></i>
                            <div class="default text">Departure Time</div>
                            <div class="menu">
                                <div class="item" id="noneT">Departure Time</div>
                                <div class="item" id="morning">Morning (5:00a - 11:59a)</div>
                                <div class="item" id="afternoon">Afternoon (12:00p - 5:59p)</div>
                                <div class="item" id="evening">Evening (6:00p - 11:59p)</div>
                            </div>
                        </div>
                        <div class="ui selection dropdown">
                            <i class="dropdown icon"></i>
                            <div class="default text">Cost</div>
                            <div class="menu">
                                <div class="item" id="noneC">All costs</div>
                                <div class="item" id="low">$0 - $500</div>
                                <div class="item" id="med">$0 - $1000</div>
                            </div>
                        </div>
					</div>
				</div>
				<div class="flight-bin">
				</div>
			</div>
		</div>
	</div>
`);

// How any singular flight will be displayed
var flightCardTemplate=_.template(`
	<div class="flightCard">
		<div class="card-top">
			<div class="ele flight-airline">
				<%= airline %>
			</div>
			<div class="ele flight-cost">
				<%= cost %>
			</div>
            <div class="ele">
                <%= points %>
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
			<div class="ele">
				Returning: <%= returnTime %>
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