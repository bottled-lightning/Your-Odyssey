var applesauceView = Backbone.View.extend({
	initialize: function(){
		this.render();
	},
	render: function(){
		//adds a thing to the element's html
		//in this case is adding a template
		//this template can be found in templates.js
		//if we were attaching js functions, they'd go here
		this.$el.append(appleSauceTemplate());
	}
});