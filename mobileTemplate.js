// The major source of formatting for index.html (mobile version)

var mobileFlightSearchTemplate = _.template(`
	<img src="images/background.jpg" class="splash">
	<div class="mobile-selector-card">
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
            </div>
            <div class="row">
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
					<label class="white">Departing</label>
					<div class="ui fluid calendar" id="departing">
					    <div class="ui input left icon">
					    <i class="calendar icon"></i>
					    <input type="text" placeholder="Date">
					    </div>
					</div>
				</div>
				<div class="wrapper">
					<label class="white">Returning</label>
					<div class="ui fluid calendar" id="returning">
					    <div class="ui input left icon">
					    <i class="calendar icon"></i>
					    <input type="text" placeholder="Date">
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
            </div>
            <div class="row">
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
            </div>

            <div class="row">
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