var T = TrelloPowerUp.iframe();
var Promise = TrelloPowerUp.Promise;

var TreeView = TreeView || {};

TreeView.Views = TreeView.Views || {};


TreeView.Views.Card = Backbone.View.extend({

	tagName:  'li',
	template: _.template($('#card-template').html()),

	events : {

	}


});

TreeView.Views.CardBadge = Backbone.View.extend({
	tagName : 'div',
	template: _.template($('#cardbadge-template').html()),

	initialize: function() {
        this.listenTo(this.model, "update", this.render);
    },
    render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	}

});