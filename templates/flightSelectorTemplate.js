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
                        <div class="float-center">
	                        <div class="ui simple dropdown">
	                            <i class="dropdown icon"></i>
	                            <div class="default text">Departure Time</div>
	                            <div class="menu">
	                                <div class="item" id="noneT">Departure Time</div>
	                                <div class="item" id="morning">Morning (5:00a - 11:59a)</div>
	                                <div class="item" id="afternoon">Afternoon (12:00p - 5:59p)</div>
	                                <div class="item" id="evening">Evening (6:00p - 11:59p)</div>
	                            </div>
	                        </div>
	                    </div>
                        <div class="float-center">
	                        <div class="ui simple dropdown">
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
				</div>
				<div class="flight-bin">
				</div>
			</div>
		</div>
	</div>
`);