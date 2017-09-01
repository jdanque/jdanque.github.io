var T = TrelloPowerUp.iframe();
var Promise = TrelloPowerUp.Promise;

var TreeView = TreeView || {};

TreeView.Views = TreeView.Views || {};

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

TreeView.Views.Card = Backbone.View.extend({
	tagName : 'li',
	events : {
		'click > a.nodelink': 'openCard'
	},

	initialize: function() {
		this.template = _.template($('#node-template').html());
        this.listenTo(this.model, "update", this.render);

        this.setElement(this.template(this.model.attributes));
    },
    render: function() {
		return this;
	},
	openCard : function(e){
		e.preventDefault();
		 if(this.model.get('closed')){
			 T.navigate({ url : this.model.get('url') })
			 .then(function(){
				 T.closeOverlay();
			 });
		 }else{
			 T.showCard(this.model.get('id'))
			 .then(function(){
				 T.closeOverlay();
			 });
		 }
	}

});


TreeView.Views.List = Backbone.View.extend({
	tagName : 'li',

	events : {
		'click > .expando' : 'toggleExpand',
		'click > a.nodelink': 'toggleExpand'
	},

	initialize : function(){
		this.template = _.template($('#node-template').html());
		this.$expando = this.$('.expando');

		this.listenTo(this.model.get('cards'), 'add', this.addCard);

		this.setElement(this.template(this.model.attributes));

		this.enableSortable();
	},
	enableSortable : function(){
	//todo
//		this.$el.sortable({
//		placeholder: "list-card placeholder nodecontainer",
//		connectWith: ".subnodelist.node-type-list",
//		cursor: "move",
//		tolerance: "intersect",
//		start: function( event, ui ) {
//			Utils.removeHoverMenu();
//			ui.placeholder.height(ui.item.height());
//			var p  = ui.item.parents('.nodecontainer.node-type-list').eq(0);
//			ui.item.toggleClass('grabbing',true)
//				.data("prevPos",p.find('.nodecontainer.node-type-card').index(ui.item))
//				.data("prevListID",Utils.getListDataTrelloId(p));
//		},
//		stop: function( event, ui ) {
//			ui.item.toggleClass('grabbing',false);
//			updateCardPosition(ui.item);
//		}
	},
	render : function(){
		if(!this.model.get('expanded')){
			this.$el.children('.subnodelist').hide();
		}
		return this;
	},
	addCard : function(cardModel){
		var view = new TreeView.Views.Card({ model: cardModel });
		this.$el.children('.subnodelist').append(view.render().el);
	},

	toggleExpand : function(e){
		e.preventDefault();
		var subnodelist = this.$el.children('.subnodelist');

		var isExpanded = this.model.get('expanded');
		this.$el.children('.expando')
			.toggleClass('expanded',!isExpanded)
			.toggleClass('collapsed',isExpanded);
		this.model.set('expanded',!isExpanded);

		subnodelist.slideToggle(100, function(){});

	},

});


TreeView.Views.Board = Backbone.View.extend({
	tagName : 'li',

	events : {
		'click > .expando' : 'toggleExpand',
		'click > a.nodelink': 'toggleExpand'
	},

	initialize : function(){
		this.template = _.template($('#node-template').html());

		this.listenTo(this.model.get('lists'), 'add', this.addList);

		this.setElement(this.template(this.model.attributes));
	},

	render : function(){
		if(!this.model.get('expanded')){
			this.$el.children('.subnodelist').hide();
		}

		return this;
	},

	addList : function(listModel){
		var view = new TreeView.Views.List({ model: listModel });
		this.$el.children('.subnodelist').append(view.render().el);
	},

	toggleExpand : function(e){
		e.preventDefault();
		var subnodelist = this.$el.children('.subnodelist');

		var isExpanded = this.model.get('expanded');
		this.$el.children('.expando')
			.toggleClass('expanded',!isExpanded)
			.toggleClass('collapsed',isExpanded);
		this.model.set('expanded',!isExpanded);

		subnodelist.slideToggle(100, function(){});

	}


});


TreeView.Views.Main = Backbone.View.extend({
	el : '#maincontent',

	events : {
		'click  #closetreeview' : 'exitTreeView',
		'keyup': 'keyUpAction'
	},


	initialize: function() {
		this.$treeViewMain = this.$('#treeviewmain');

		this.listenTo(this.model, 'change:theme', this.changeTheme);
		this.listenTo(this.model.get('boards'), 'add', this.addBoard);

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
	exitTreeView : function(){
		T.closeOverlay().done();
	},
	keyUpAction : function(ev){
		switch(ev.keyCode) {
		   case Key.ESC :
				if($('.grabbing').length == 0){
					T.closeOverlay().done();
				}else{
					$('.subnodelist.node-type-list').sortable("cancel");
				}
				break;
			default:break;
		}
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