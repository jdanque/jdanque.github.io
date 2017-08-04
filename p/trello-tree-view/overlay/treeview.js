var TreeView = {};
var T = TrelloPowerUp.iframe();

(function($, me){
	me.status = {
		init: false
	};


	var Node = function(name){
		this.id = '';
		this.name = name || '';
		this.nodes = [];

		this.add = function(node){
			this.nodes.push(node);
		};

		this.toHtml = function(){
		};
	};

	var getBoard = function(){
	};

	var getBoardLists = function(boardID){
		return T.lists('all')
			.then(function(lists){
				console.log(JSON.stringify(lists,null,2));
			});
	};


	var createTreeView = function(){
		var context = T.getContext(),
		var root = new Node();

		T.board('all')
			.then(function(v){
				console.log('a');
			});

//		return T.getBoardLists()
//			.then(getBoardLists);
	};

	me.init = function(){
		createTreeView();

		me.status.init = true;
	};

	return me;

})(jQuery, TreeView);