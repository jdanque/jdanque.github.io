var T = TrelloPowerUp.iframe();
var Promise = TrelloPowerUp.Promise;
var TreeView = TreeView || {};

T.render(function(){
	if(!TreeView.status.init){
		TreeView.init();
	}
});

//document.addEventListener('click', function(e) {
//  if(e.target.tagName == 'BODY') {
//    T.closeOverlay().done();
//  }
//});

(function($, me){
	me.API_KEY = 'e3e4df7f95e0b1942c0b82a9a2c301f6';
	me.authToken = '';
	me.status = {
		init : false
	};

	me._models = {};
	me._views = {};

	var initMainWiring = function(){
		//link main
		return Promise.resolve().then(function(){
			me._models.main = new TreeView.Models.Main();
			me._views.main =  new TreeView.Views.Main({ model : me._models.main });
		});
	};

	var renderBoards = function(){
		return T.board('all')
		.then(function(board){
			me._models.main.get('boards').add(new TreeView.Models.Board({
				'id'    : board.id,
        		'name'  : board.name,
        		'url' 	: board.url
			}));
		});
	};

	/**
	Since T.lists('all') just returns list from the current board we'll
	just add these lists to the current 'one' board
	*/
	var renderListsAndCards = function(){
		return T.lists('all')
		.then(function(lists){
			var board = me._models.main.get('boards').at(0);
			for(var list of lists){
				board.get('lists').add(new TreeView.Models.List({
					'id'   : list.id,
					'name' : list.name
				}));

				for(var card of list.cards){
					board.get('lists').get({id : list.id})
						.get('cards')
						.add(new TreeView.Models.Card({
							'id'  	 : card.id,
							'name'	 : card.name,
							'url' 	 : card.url,
							'desc'	 : card.desc,
							'closed' : card.closed
						}));
				}
			}
		});
	};

	me.init = function(){
		//set focus to main window
		window.focus();
        if (document.activeElement) {
            document.activeElement.blur();
        }

        T.get('member', 'private', 'token').then(function(token){
			me.authToken = token;

			initMainWiring()
			.then(renderBoards)
			.then(renderListsAndCards)
			;

		});

        me.status.init = true;
	};

	return me;
})(jQuery, TreeView);