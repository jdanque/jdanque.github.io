var T = TrelloPowerUp.iframe();
var Promise = TrelloPowerUp.Promise;

var TreeView = TreeView || {};

TreeView.Views = TreeView.Views || {};

TreeView.Views.CardLabel = Backbone.View.extend({
	tagName : 'div',

	events : {

	},

	initialize : function(){
		this.template = _.template($('#cardlabel-template').html());

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
        this.listenTo(this.model, 'change:_loading', this.updateLoading);
        this.listenTo(this.model.get('labels'), 'add', this.addLabel);
        this.listenTo(this.model.get('badges'), 'add', this.addBadge);

        this.setElement(this.template(this.model.attributes));
    },
    render: function() {
    	var _this = this;
    	_this.$el.children('.nodelink').children('.labels-wrapper').toggleClass('hidden',!_this.model.get('showLabels'));
    	_this.$el.children('.nodelink').children('.badges-wrapper').toggleClass('hidden',!_this.model.get('showBadges'));
    	
		return _this;
	},

	addLabel : function(label, collection, options){
		var _this = this;
		var wrapper = _this.$el.children('.nodelink').children('.labels-wrapper');

		var view = new TreeView.Views.CardLabel({ model: label });

		wrapper.append(view.render().el);
	},

	addBadge : function(badge, collection, options){
		var _this = this;
		var wrapper = _this.$el.children('.nodelink').children('.badges-wrapper');

		var view = new TreeView.Views.CardLabel({ model: badge });

		wrapper.append(view.render().el);

	},

	updateLoading : function(){
		var _this = this;
		_this.$el.children('.nodelink')
			.toggleClass('loading',_this.model.get('_loading'));
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

		this.listenTo(this.model.get('subnodes'), 'add', this.addCard);
		this.listenTo(this.model, 'change:_loading', this.updateLoading);

		this.setElement(this.template(this.model.attributes));

	},

	render : function(){
		var
			subnodelist = this.$el.children('.subnodelist'),
			isExpanded = this.model.get('expanded')
			;

		if(!isExpanded){
			subnodelist.hide();
			this.toggleSubnodeCount(!isExpanded);
		}


		return this;
	},

	updateLoading : function(){
		var _this = this;
		_this.$el.children('.nodelink')
			.toggleClass('loading',_this.model.get('_loading'));
	},

	addCard : function(cardModel,collection, options){
		if(_.isUndefined(options.noAppend) ||
			!options.noAppend){
			var view = new TreeView.Views.Card({ model: cardModel });
			this.$el.children('.subnodelist').append(view.render().el);
		}
		this.$el.children('.nodelink').children('.subnodes-count').html(this.model.get('subnodes').length);
	},

	toggleSubnodeCount : function(isShow){
		this.$el.children('.nodelink').children('.subnodes-count').toggleClass('hidden',!isShow);
	},

	toggleExpand : function(e){
		e.preventDefault();
		var _this = this;
		var _el = _this.$el;
		var subnodelist = _el.children('.subnodelist');

		var isExpanded = _this.model.get('expanded');
		_el.children('.expando')
			.toggleClass('expanded',!isExpanded)
			.toggleClass('collapsed',isExpanded);
		_this.model.set('expanded',!isExpanded);
		_this.toggleSubnodeCount(isExpanded);

		subnodelist.slideToggle(100, function(){
			T.sizeTo('#maincontent');
		});

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

		this.listenTo(this.model.get('subnodes'), 'add', this.addList);

		this.setElement(this.template(this.model.attributes));
	},

	render : function(){
		var _this = this,
			subnodelist = _this.$el.children('.subnodelist'),
			isExpanded = _this.model.get('expanded')
			;

		if(!isExpanded){
			subnodelist.hide();
			_this.toggleSubnodeCount(!isExpanded);
		}

		return this;
	},

	addList : function(listModel){
		var view = new TreeView.Views.List({ model: listModel });
		this.$el.children('.subnodelist').append(view.render().el);
		this.$el.children('.nodelink').children('.subnodes-count').html(this.model.get('subnodes').length);
	},


	toggleSubnodeCount : function(isShow){
		this.$el.children('.nodelink').children('.subnodes-count').toggleClass('hidden',!isShow);
	},

	toggleExpand : function(e){
		e.preventDefault();
		var _this = this,
			_el = _this.$el,
			subnodelist = _el.children('.subnodelist');

		var isExpanded = _this.model.get('expanded');
		_el.children('.expando')
			.toggleClass('expanded',!isExpanded)
			.toggleClass('collapsed',isExpanded);
		_this.model.set('expanded',!isExpanded);
		_this.toggleSubnodeCount(isExpanded);

		subnodelist.slideToggle(100, function(){
			T.sizeTo('#maincontent');
		});

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
		this.listenTo(this.model.get('subnodes'), 'add', this.addBoard);

		this.availableThemes = [
			'theme-gray',
			'theme-blue',
			'theme-green',
			'theme-orange',
			'theme-red',
			'theme-yellow',
			'theme-purple',
			'theme-pink',
			'theme-sky',
			'theme-lime'
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