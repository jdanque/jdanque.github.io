var T = TrelloPowerUp.iframe();
var Promise = TrelloPowerUp.Promise;

var TreeView = TreeView || {};

TreeView.Models = TreeView.Models || {};


TreeView.Models.Main = Backbone.Model.extend({
	defaults : {
		'theme' : 'theme-trello-light-gray',
		'boards' : new Backbone.Collection.extend({
				model : TreeView.Models.Board
	    })
	}

});

TreeView.Models.Main.Boards = Backbone.Collection.extend({
	model : TreeView.Models.Board
});

TreeView.Models.Node = Backbone.Model.extend({
	defaults: {
		'type' 	     : '',
		'id'     	 : '',
		'name'   	 : '',
		'url'		 : '',
		'desc'   	 : '',
		'closed' 	 : false,
		'hasExpando' : true
	}
});

TreeView.Models.Board = TreeView.Models.Node.extend({
	defaults :  _.extend({},TreeView.Models.Node.prototype.defaults,{
		'type' : 'board'
	})
});

TreeView.Models.Board.Lists = Backbone.Collection.extend({
	model	  :  TreeView.Models.List
});

TreeView.Models.List = TreeView.Models.Node.extend({
	defaults :  _.extend({},TreeView.Models.Node.prototype.defaults,{
		'type'  : 'list'
	})
});

TreeView.Models.List.Cards = Backbone.Collection.extend({
	model : TreeView.Models.Card
});

TreeView.Models.Card = TreeView.Models.Node.extend({
	defaults :  _.extend({},TreeView.Models.Node.prototype.defaults,{
		'type' : 'card',
		'hasExpando' : false
	})

});

TreeView.Models.Card.Labels = Backbone.Collection.extend({
    model : TreeView.Models.CardLabel
});

TreeView.Models.CardLabel = Backbone.Model.extend({
    defaults: {
       'name'  : '',
       'color' : ''
    }
});

TreeView.Models.Card.Badges = Backbone.Collection.extend({
    model : TreeView.Models.CardBadge
});

TreeView.Models.CardBadge = Backbone.Model.extend({
    defaults: {
       'title' 	   : '',
       'value'     : '',
       'iconClass' : ''
    }
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

TreeView.Models.CardBadgeMembers = Backbone.Collection.extend({
	model : TreeView.Models.CardBadgeMember
});

TreeView.Models.CardBadgeMember = TreeView.Models.CardBadge.extend({
	defaults :  _.extend({},TreeView.Models.CardBadge.prototype.defaults,{
		'fullName' : '',
		'username' : '',
		'iconClass' : 'member'
	})
});