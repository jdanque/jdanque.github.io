var T = TrelloPowerUp.iframe();
var Promise = TrelloPowerUp.Promise;

var TreeView = TreeView || {};

TreeView.Views = TreeView.Views || {};


TreeView.Views.Card = Backbone.View.extend({

	tagName:  'li',

	events : {

	},

	initialize : function(){
		this.template = _.template($('#card-template').html());
	}


});

TreeView.Views.CardBadge = Backbone.View.extend({
	tagName : 'div',

	initialize: function() {
		this.$treeviewmain = this.
		this.template = _.template($('#cardbadge-template').html());
        this.listenTo(this.model, "update", this.render);
    },
    render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	}

});