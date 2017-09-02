var T = TrelloPowerUp.iframe();
var Promise = TrelloPowerUp.Promise;

var TreeView = TreeView || {};

TreeView.Models = TreeView.Models || {};

/**
* Moves a model to the given index, if different from its current index. Handy
* for shuffling models about after they've been pulled into a new position via
* drag and drop.
*/
Backbone.Collection.prototype.move = function(model, toIndex) {
  var fromIndex = this.indexOf(model)
  if (fromIndex == -1) {
    throw new Error("Can't move a model that's not in the collection");
  }
  if (fromIndex !== toIndex) {
    this.models.splice(toIndex, 0, this.models.splice(fromIndex, 1)[0]);
    this.trigger("move",toIndex);
  }
};

TreeView.Models.Node = Backbone.Model.extend({
	defaults: {
		'type' 	     : '',
		'id'     	 : '',
		'name'   	 : '',
		'url'		 : '',
		'desc'   	 : '',
		'expanded' 	 : false,
		'hasExpando' : true,
		'_loading'	 : false,
	}
});

TreeView.Models.Board = TreeView.Models.Node.extend({
	defaults :  _.extend({},TreeView.Models.Node.prototype.defaults,{
		'type' : 'board',
		'subnodes': []
	}),
	initialize : function(){
		this.set('subnodes', new TreeView.Models.Lists());
	}
});
TreeView.Models.Boards = Backbone.Collection.extend({
	model : TreeView.Models.Board,
	comparator : false
});

TreeView.Models.List = TreeView.Models.Node.extend({
	defaults :  _.extend({},TreeView.Models.Node.prototype.defaults,{
		'type'  : 'list',
		'subnodes': []
	}),
	initialize : function(){
		this.set('subnodes', new TreeView.Models.Cards());
	}
});
TreeView.Models.Lists = Backbone.Collection.extend({
	model	  :  TreeView.Models.List,
	comparator : false
});


TreeView.Models.Card = TreeView.Models.Node.extend({
	defaults :  _.extend({},TreeView.Models.Node.prototype.defaults,{
		'type' : 'card',
		'hasExpando' : false,
		'closed' : false,
		'labels' : [],
		'badges' : [],
		'showLabels' : false,
		'showBadges' : false
	}),

	initialize : function(){
		this.set('labels', new TreeView.Models.CardLabels());
		this.set('badges', new TreeView.Models.CardBadges());
	}


});
TreeView.Models.Cards = Backbone.Collection.extend({
	model : TreeView.Models.Card,
	comparator : false
});

TreeView.Models.CardLabel = Backbone.Model.extend({
    defaults: {
       'name'  : '',
       'color' : ''
    }
});
TreeView.Models.CardLabels = Backbone.Collection.extend({
    model : TreeView.Models.CardLabel,
    comparator : false
});

TreeView.Models.CardBadge = Backbone.Model.extend({
    defaults: {
       'title' 	   : '',
       'value'     : '',
       'iconClass' : '',
       'type' 	   : ''
    }
});
TreeView.Models.CardBadges = Backbone.Collection.extend({
    model : TreeView.Models.CardBadge,
    comparator : false
});

TreeView.Models.CardBadgeDue = TreeView.Models.CardBadge.extend({
	defaults :  _.extend({},TreeView.Models.CardBadge.prototype.defaults,{
		'title' 	: 'Due Date',
		'format' 	: 'MMM DD',
		'iconClass' : 'due',
		'type'		: 'due'
	})
});

TreeView.Models.CardBadgeAttachment = TreeView.Models.CardBadge.extend({
	defaults :  _.extend({},TreeView.Models.CardBadge.prototype.defaults,{
		'title' 	: 'Attachments',
		'value' 	: 0,
		'iconClass' : 'attachments',
		'type' 	    : 'attachments'
	})
});

TreeView.Models.CardBadgeChecklist = TreeView.Models.CardBadge.extend({
	defaults :  _.extend({},TreeView.Models.CardBadge.prototype.defaults,{
		'title'				: 'Checklist',
		'value' 			: 0,
		'checkItemsChecked' : 0,
		'checkItems' 		: 0,
		'iconClass' 		: 'checklist',
		'type' 	    		: 'checklist'
	})
});

TreeView.Models.CardBadgeVote = TreeView.Models.CardBadge.extend({
	defaults :  _.extend({},TreeView.Models.CardBadge.prototype.defaults,{
		'title'		: 'Votes',
		'value' 	: 0,
		'iconClass' : 'votes',
		'type'		: 'votes'
	})
});

TreeView.Models.CardBadgeMembers = TreeView.Models.CardBadge.extend({
	defaults :  _.extend({},TreeView.Models.CardBadge.prototype.defaults,{
		'title' : 'Members',
		'value' : 0,
		'iconClass' : 'member',
		'type' : 'member'
	})
});


TreeView.Models.Main = Backbone.Model.extend({
	defaults : {
		'theme' : 'theme-gray',
		'subnodes' : []
	},
	initialize : function(){
		var _this = this;
		_this.set('subnodes', new TreeView.Models.Boards());
	}

});