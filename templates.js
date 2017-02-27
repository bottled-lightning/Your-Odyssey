var flightSelectorTemplate = _.template(`
	<img src="images/background.jpg" class="splash">
	<div class="selector-card">
		<div class="title">Your Odyssey</div>
		<div class="ui inverted form">
			<div class="row">
				<div class="wrapper">
					<label>Flying from</label>
					<div class="ui fluid search selection dropdown">
						<input type="hidden" name="from">
						<i class="dropdown icon"></i>
						<label>Flying from: </label>
						<div class="default text">Choose one</div>
						<div class="menu airport-list">
							<div class="item" data-value="af"><i class="af flag"></i>Afghanistan</div>
							<div class="item" data-value="ax"><i class="ax flag"></i>Aland Islands</div>
						</div>
					</div>
				</div>
				<div class="wrapper">
					<label>Flying to</label>
					<div class="ui fluid search selection dropdown">
						<input type="hidden" name="to">
						<i class="dropdown icon"></i>
						<label>Flying to: </label>
						<div class="default text">Choose one</div>
						<div class="menu airport-list">
							<div class="item" data-value="af"><i class="af flag"></i>Afghanistan</div>
							<div class="item" data-value="ax"><i class="ax flag"></i>Aland Islands</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="wrapper">
					<label>Adults (18+)</label>
					<div class="ui selection fluid dropdown">
						<input type="hidden" name="adults">
						<label>Adults: </label>
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
					<label>Children (0-17)</label>
					<div class="ui fluid selection dropdown">
						<input type="hidden" name="children">
						<label>Children: </label>
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
					<label>Reward program</label>
					<div class="ui fluid selection dropdown">
						<input type="hidden" name="program">
						<i class="dropdown icon"></i>
						<div class="default text wspw">Choose one</div>
						<div class="menu">
							<div class="item" data-value="-">-</div>
							<div class="item" data-value="amex">American Express</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="wrapper-static">
					<label>Departing</label>
					<div class="ui fluid calendar">
					    <div class="ui input left icon">
					    <i class="calendar icon"></i>
					    <input type="text" placeholder="Date">
					    </div>
					</div>
				</div>
				<div class="wrapper-static">
					<label>Returning</label>
					<div class="ui fluid calendar">
					    <div class="ui input left icon">
					    <i class="calendar icon"></i>
					    <input type="text" placeholder="Date">
					    </div>
					</div>
				</div>
				<div class="wrapper">
					<label></label>
					<br>
					<button class="ui fluid primary button">
						Find flight
					</button>
				</div>
			</div>
		</div>
	</div>
`);
