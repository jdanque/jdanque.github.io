var T = TrelloPowerUp.iframe();
var Promise = TrelloPowerUp.Promise;

var TreeView = TreeView || {};

TreeView.Views = TreeView.Views || {};

TreeView.Views.Main = Backbone.View.extend({
	el : '#maincontent',

	initialize: function() {
		this.$closeTreeView = this.$('#closetreeview');
		this.$treeViewMain = this.$('#treeviewmain');

		//listeners
		this.listenTo(this.model, 'change:theme', this.changeTheme);

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

		//set default theme
		this.changeTheme(this.model.get('theme'));

    },
    render: function() {
		return this;
	},
	clear : function(){
		this.$treeViewMain.html('');
		return this;
	},
	changeTheme : function(){
		var theme = this.model.get('theme');
		this.$el.toggleClass(this.availableThemes.join(' '),false)
			.toggleClass(theme,true);
	},
	addBoard : function(boardModel){
		var view = new TreeView.Views.Board({ model: boardModel });
		this.$treeViewMain.append(view.render().el);
		return this;
	}

});


TreeView.Views.Board = Backbone.View.extend({
	tagName : 'li',

	events : {

	},

	initialize : function(){
		this.template = _.template($('#node-template').html());
		this.$expando = this.$('.expando');

		this.setElement(this.template(this.model.attributes));
	},

	render : function(){
		return this;
	}


});

TreeView.Views.CardLabel = Backbone.View.extend({
	tagName : 'li',

	events : {

	},

	initialize : function(){
		this.template = _.template($('#node-template').html());
		this.$expando = this.$('.expando');

		this.setElement(this.template(this.model.attributes));
	},

	render : function(){
		return this;
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