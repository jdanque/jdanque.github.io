var T = TrelloPowerUp.iframe();
var Promise = TrelloPowerUp.Promise;

var TreeView = TreeView || {};

TreeView.Models = TreeView.Models || {};

TreeView.Models.Node = Backbone.Model.extend({
	defaults: {
		'type' 	     : '',
		'id'     	 : '',
		'name'   	 : '',
		'url'		 : '',
		'desc'   	 : '',
		'expanded' 	 : false,
		'hasExpando' : true
	}
});

TreeView.Models.Board = TreeView.Models.Node.extend({
	defaults :  _.extend({},TreeView.Models.Node.prototype.defaults,{
		'type' : 'board',
		'lists': []
	}),
	initialize : function(){
		this.set('lists', new TreeView.Models.Lists());
	}
});
TreeView.Models.Boards = Backbone.Collection.extend({
	model : TreeView.Models.Board
});

TreeView.Models.List = TreeView.Models.Node.extend({
	defaults :  _.extend({},TreeView.Models.Node.prototype.defaults,{
		'type'  : 'list'
		'cards': []
	}),
	initialize : function(){
		this.set('cards', new TreeView.Models.Cards());
	}
});
TreeView.Models.Lists = Backbone.Collection.extend({
	model	  :  TreeView.Models.List
});


TreeView.Models.Card = TreeView.Models.Node.extend({
	defaults :  _.extend({},TreeView.Models.Node.prototype.defaults,{
		'type' : 'card',
		'hasExpando' : false
	})

});
TreeView.Models.Cards = Backbone.Collection.extend({
	model : TreeView.Models.Card
});

TreeView.Models.CardLabel = Backbone.Model.extend({
    defaults: {
       'name'  : '',
       'color' : ''
    }
});
TreeView.Models.CardLabels = Backbone.Collection.extend({
    model : TreeView.Models.CardLabel
});

TreeView.Models.CardBadge = Backbone.Model.extend({
    defaults: {
       'title' 	   : '',
       'value'     : '',
       'iconClass' : ''
    }
});
TreeView.Models.CardBadges = Backbone.Collection.extend({
    model : TreeView.Models.CardBadge
});

TreeView.Models.CardBadgeDue = TreeView.Models.CardBadge.extend({
	defaults :  _.extend({},TreeView.Models.CardBadge.prototype.defaults,{
		'title' 	: 'Due Date',
		'format' 	: 'MMM DD',
		'iconClass' : 'due'
	})
});

TreeView.Models.CardBadgeAttachment = TreeView.Models.CardBadge.extend({
	defaults :  _.extend({},TreeView.Models.CardBadge.prototype.defaults,{
		'title' 	: 'Attachments',
		'value' 	: 0,
		'iconClass' : 'attachments'
	})
});

TreeView.Models.CardBadgeChecklist = TreeView.Models.CardBadge.extend({
	defaults :  _.extend({},TreeView.Models.CardBadge.prototype.defaults,{
		'title'				: 'Checklist',
		'value' 			: 0,
		'checkItemsChecked' : 0,
		'checkItems' 		: 0,
		'iconClass' 		: 'checklist'
	})
});

TreeView.Models.CardBadgeVote = TreeView.Models.CardBadge.extend({
	defaults :  _.extend({},TreeView.Models.CardBadge.prototype.defaults,{
		'title'	: 'Votes',
		'value' : 0,
		'iconClass' : 'votes'
	})
});

TreeView.Models.CardBadgeMember = TreeView.Models.CardBadge.extend({
	defaults :  _.extend({},TreeView.Models.CardBadge.prototype.defaults,{
		'fullName' : '',
		'username' : '',
		'iconClass' : 'member'
	})
});
TreeView.Models.CardBadgeMembers = Backbone.Collection.extend({
	model : TreeView.Models.CardBadgeMember
});


TreeView.Models.Main = Backbone.Model.extend({
	defaults : {
		'theme' : 'theme-trello-light-gray',
		'boards' : []
	},
	initialize : function(){
		this.set('boards', new TreeView.Models.Boards());
	}

});