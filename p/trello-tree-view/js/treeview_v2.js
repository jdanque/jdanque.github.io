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
			me._models.main.get('subnodes').add(new TreeView.Models.Board({
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
			var board = me._models.main.get('subnodes').at(0);
			for(var list of lists){
				board.get('subnodes').add(new TreeView.Models.List({
					'id'   : list.id,
					'name' : list.name
				}));

				for(var card of list.cards){
					board.get('subnodes').get({id : list.id})
						.get('subnodes')
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

	var renderTheme = function(){
		return T.get('board', 'private', 'theme')
			.then(function(theme){
				if(!_.isUndefined(theme) &&
					!_.isNull(theme) &&
					!_.isEmpty(theme)
				){
					me._models.main.set('theme',theme)
				}
			});
	};

	var enableSortableLists = function(){
		if(_.isUndefined(me.authToken) ||
			_.isNull(me.authToken) ||
			_.isEmpty(me.authToken)
		){
			return Promise.resolve();
		}

		return new Promise(function(resolve){

			$('.subnodelist.node-type-board').sortable({
				placeholder: "list-card placeholder nodecontainer",
				connectWith: ".subnodelist.node-type-board",
				cursor: "move",
				tolerance: "intersect",
				start: function( event, ui ) {
					Utils.removeHoverMenu();
					ui.placeholder.height(ui.item.height());
					var p  = ui.item.parents('.nodecontainer.node-type-board').eq(0);
					ui.item.toggleClass('grabbing',true)
						.data("prevPos",p.find('.nodecontainer.node-type-list').index(ui.item))
						;
				},
				stop: function( event, ui ) {
					ui.item.toggleClass('grabbing',false);
//					updateListPosition(ui.item);
				}
			});

			resolve();
		};
	};

	var enableSortableCards = function(){
		if(_.isUndefined(me.authToken) ||
			_.isNull(me.authToken) ||
			_.isEmpty(me.authToken)
		){
			return Promise.resolve();
		}

		return new Promise(function(resolve){
			$('.subnodelist.node-type-list').sortable({
				placeholder: "list-card placeholder nodecontainer",
				connectWith: ".subnodelist.node-type-list",
				cursor: "move",
				tolerance: "intersect",
				start: function( event, ui ) {
					ui.placeholder.height(ui.item.height());
					var p  = ui.item.parents('.nodecontainer.node-type-list').eq(0);
					ui.item.toggleClass('grabbing',true)
						.data("prevPos",p.find('.nodecontainer.node-type-card').index(ui.item))
						;
//						.data("prevListID",Utils.getListDataTrelloId(p));
				},
				stop: function( event, ui ) {
					ui.item.toggleClass('grabbing',false);
//					updateCardPosition(ui.item);
				}
			});
			resolve();
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
			.then(renderTheme)
			.then(enableSortableLists)
			.then(enableSortableCards)
			.then(function(){
				T.sizeTo('#maincontent');
			})
			;

		});

        me.status.init = true;
	};

	return me;
})(jQuery, TreeView);