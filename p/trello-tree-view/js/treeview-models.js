var T = TrelloPowerUp.iframe();
var Promise = TrelloPowerUp.Promise;

var TreeView = TreeView || {};

TreeView.Models = TreeView.Models || {};

TreeView.Models.Node = Backbone.Model.extend({

    defaults: {
       'id'   : '',
       'name' : '',
	}

});

TreeView.Models.TreeMain = Backbone.Collection.extend({
	model : TreeView.Models.BoardNode
});

TreeView.Models.BoardNode = Backbone.Collection.extend({
	model 	: TreeView.Models.ListNode,
	defaults: {
		'id'     : '',
	    'name'   : '',
		'closed' : false
	}

});

TreeView.Models.ListNode = TreeView.Models.BoardNode.extend({
	model	: TreeView.Models.CardNode
});

TreeView.Models.CardNode = TreeView.Models.Node.extend({
	defaults : _.extend({},TreeView.Models.Node.prototype.defaults,{
		'url'    : '',
		'desc'   : '',
		'labels' : [],
		'badges' : [],

		initialize : function(){
			this.set({labels : new TreeView.Models.CardLabels()});
			this.set({badges : new TreeView.Models.CardBadges()});
		}
	})

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
       'title' 	: '',
       'value'  : ''
    }
});

TreeView.Models.CardBadgeDue = TreeView.Models.CardBadge.extend({
	defaults :  _.extend({},TreeView.Models.CardBadge.prototype.defaults,{
		'title' : 'Due Date',
		'format' : 'MMM DD',
	})
});

TreeView.Models.CardBadgeAttachment = TreeView.Models.CardBadge.extend({
	defaults :  _.extend({},TreeView.Models.CardBadge.prototype.defaults,{
		'title' : 'Attachments',
		'value' : 0,
	})
});

TreeView.Models.CardBadgeChecklist = TreeView.Models.CardBadge.extend({
	defaults :  _.extend({},TreeView.Models.CardBadge.prototype.defaults,{
		'title'				: 'Checklist',
		'value' 			: 0,
		'checkItemsChecked' : 0,
		'checkItems' 		: 0
	})
});

TreeView.Models.CardBadgeVote = TreeView.Models.CardBadge.extend({
	defaults :  _.extend({},TreeView.Models.CardBadge.prototype.defaults,{
		'title'	: 'Votes',
		'value' : 0
	})
});

TreeView.Models.CardBadgeMembers = Backbone.Collection.extend({
	model : TreeView.Models.CardBadgeMember
});

TreeView.Models.CardBadgeMember = TreeView.Models.CardBadge.extend({
	defaults :  _.extend({},TreeView.Models.CardBadge.prototype.defaults,{
		'fullName' : '',
		'username' : ''
	})
});
