var T = TrelloPowerUp.iframe();
var Promise = TrelloPowerUp.Promise;

var TreeView = TreeView || {};

TreeView.Models = TreeView.Models || {};


TreeView.Models.TreeMain = Backbone.Collection.extend({
	model : TreeView.Models.BoardNode
});

TreeView.Models.BoardNode = Backbone.Collection.extend({
	model 	: TreeView.Models.ListNode,
	defaults: {
		'type' 	     : 'board',
		'id'     	 : '',
	    'name'   	 : '',
		'url'		 : '',
		'desc'   	 : '',
		'closed' 	 : false,
		'hasExpando' : true,
		'labels' 	 : [],
		'badges' 	 : []
	}

});

TreeView.Models.ListNode = Backbone.Collection.extend({
	model	  :  TreeView.Models.CardNode,
	defaults  : {
		'type' 	     : 'list',
		'id'     	 : '',
		'name'   	 : '',
		'url'		 : '',
		'desc'   	 : '',
		'closed' 	 : false,
		'hasExpando' : true,
		'labels' 	 : [],
		'badges' 	 : []
	}
});

TreeView.Models.CardNode = Backbone.Model.extend({
	defaults : {
		'type'   	 : 'card',
		'id'   		 : '',
		'name' 	     : '',
		'url'   	 : '',
		'desc'   	 : '',
		'closed' 	 : false,
		'hasExpando' : false,
		'labels' 	 : [],
		'badges' 	 : []
	},

	initialize : function(){
		this.set({labels : new TreeView.Models.CardLabels()});
		this.set({badges : new TreeView.Models.CardBadges()});
	}

});

TreeView.Models.CardLabels = Backbone.Collection.extend({
    model : TreeView.Models.CardLabel
});

TreeView.Models.CardLabel = Backbone.Model.extend({
    defaults: {
       'name'  : '',
       'color' : ''
    }
});

TreeView.Models.CardBadges = Backbone.Collection.extend({
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
