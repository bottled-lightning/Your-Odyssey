/*
* Description: The template that giverns how an individual airport is displayed
* Parameters: a hash that represents the data that the airport contains
* Return: The html to be appended to the page
*/
var airportTemplate = _.template(`
	<div class="item" data-value="<%= iata%>"><%= iata%>-<%= name%></div>
`);