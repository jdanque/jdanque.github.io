var TreeView = {};
var T = TrelloPowerUp.iframe();

(function($, me){
	me.status = {
		init: false
	}

	var getBoardLists = function(boardID){
		return T.lists('all')
			.then(function(lists){
				console.log(JSON.stringify(lists,null,2));
			});
	};


	var createTreeView = function(){




//		return T.getBoardLists()
//			.then(getBoardLists);
	};

	me.init = function(){
		createTreeView();

		me.status.init = true;
	};

	return me;

})(jQuery, TreeView);