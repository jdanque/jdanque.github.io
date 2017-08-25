var T = TrelloPowerUp.iframe();
var Promise = TrelloPowerUp.Promise;

var TreeView = TreeView || {};

TreeView.Views = TreeView.Views || {};

TreeView.Views.Main = Backbone.View.extend({
	el : '#maincontent',

	initialize: function() {
		this.$closeTreeView = this.$('#closetreeview');
		this.$treeViewMain = this.$('#treeviewmain');

		this.availableThemes = [
			'theme-trello-light-gray',
			'theme-trello-blue',
			'theme-trello-green',
			'theme-trello-orange',
			'theme-trello-red',
			'theme-trello-yellow',
			'theme-trello-purple',
			'theme-trello-pink',
			'theme-trello-sky',
			'theme-trello-lime'
		];

		this.$el.toggleClass(this.availableThemes.join(' '),false)
			.toggleClass(this.model.get('theme'),true);

    },
    render: function() {
		return this;
	},
	clear : function(){
		this.$treeViewMain.html('');
	},
	addBoard : function(boardModel){
		var view = new TreeView.Views.Board({ model: boardModel });
		this.$treeViewMain.append(view.render().el);
	}

});


TreeView.Views.Board = Backbone.View.extend({

	events : {

	},

	initialize : function(){
		this.template = _.template($('#node-template').html());
		this.$el.html(this.template(this.model.attributes));
		this.$expando = this.$('.expando');
		return this;
	},

	render : function(){
	}


});

TreeView.Views.CardBadge = Backbone.View.extend({
	tagName : 'div',

	initialize: function() {
		this.template = _.template($('#cardbadge-template').html());
        this.listenTo(this.model, "update", this.render);
    },
    render: function() {
		this.$el.html(this.template(this.model.attributes));
		return this;
	}

});