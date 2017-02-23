var applesauceView = Backbone.View.extend({
	initialize: function(){
		this.render();
	},
	render: function(){
		this.$el.append(appleSauceTemplate());
	}
});