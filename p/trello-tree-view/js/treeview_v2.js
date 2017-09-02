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

/**
* Underscore mixin to move array items
*/
_.mixin({

    move: function (array, fromIndex, toIndex) {
	    array.splice(toIndex, 0, array.splice(fromIndex, 1)[0] );
	    return array;
    }

});
/**
* Moves a model to the given index, if different from its current index. Handy
* for shuffling models about after they've been pulled into a new position via
* drag and drop.
*/
Backbone.Collection.prototype.move = function(model, toIndex) {
  var fromIndex = this.indexOf(model)
  if (fromIndex == -1) {
    throw new Error("Can't move a model that's not in the collection")
  }
  if (fromIndex !== toIndex) {
    this.models.splice(toIndex, 0, this.models.splice(fromIndex, 1)[0])
  }
};


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
		return Promise.all([
			T.board('all'),
			T.get('board', 'private', 'expandupto')
		]).spread(function(board, expandupto){
			me._models.main.get('subnodes').add(new TreeView.Models.Board({
				'id'    : board.id,
				'name'  : board.name,
				'url' 	: board.url,
				'expanded' : (Utils.isEmpty(expandupto) || expandupto !== '0')
			}));
		});
	};

	/**
	Since T.lists('all') just returns list from the current board we'll
	just add these lists to the current 'one' board
	*/
	var renderListsAndCards = function(){
		return Promise.all([
			T.lists('all'),
			T.get('board', 'private', 'expandupto'),
			T.get('board', 'private', 'showlabels'),
			T.get('board', 'private', 'showbadges')
		]).spread(function(lists, expandupto, showLabels, showBadges){
			var board = me._models.main.get('subnodes').at(0),
				showLabels = Utils.isEmpty(showLabels) ? true : showLabels,
				showBadges = Utils.isEmpty(showBadges) ? true : showBadges
				;

			for(var list of lists){
				board.get('subnodes').add(treeFactory.newList(list, expandupto));

				for(var card of list.cards){
					board.get('subnodes').get({id : list.id}).get('subnodes')
					.add(treeFactory.newCard(card, showLabels, showBadges));

					var newCard = board.get('subnodes')
						.get({id : list.id})
						.get('subnodes')
						.get({id : card.id});

					if(showLabels){
						//labels
						treeFactory.addCardLabels(newCard, card.labels);
					}

					if(showBadges){
						//badges
						treeFactory.addCardBadges(newCard, card);
					}
				}
			}
		});
	};

	var treeFactory = {
		/**
		* Creates a new list object model from a list object that trello returns
		*/
		newList : function(list, expandupto){
			return new TreeView.Models.List({
				'id'   : list.id,
				'name' : list.name,
				'expanded' : ( !Utils.isEmpty(expandupto) && expandupto === '2')
			});
		},

		newCard : function(card, showLabels, showBadges){
			return new TreeView.Models.Card({
				'id'  	 : card.id,
				'name'	 : card.name,
				'url' 	 : card.url,
				'desc'	 : card.desc,
				'closed' : card.closed,
				'showLabels' : showLabels,
				'showBadges' : showBadges
			});
		},

		addCardLabels : function(card, labels){
			for(var label of labels){
				if(!Utils.isEmpty(label.color)){
					card.get('labels')
					.add(new TreeView.Models.CardLabel({
						'name' : label.name,
						'color' : label.color
					}));
				}
			}

			return card;
		},

		addCardBadges : function(cardObj, card){
			var cardBadges = cardObj.get('badges');
			if(!Utils.isEmpty(card.badges.due)){
				cardBadges.add(treeFactory.newCardBadge.due(card.badges.due));
			}

			if(card.badges.attachments > 0){
				cardBadges.add(treeFactory.newCardBadge.attachments(card.badges.attachments));
			}

			if(card.badges.checkItems > 0){
				cardBadges.add(treeFactory.newCardBadge.checklist({checkItems : card.badges.checkItems, checkItemsChecked : card.badges.checkItemsChecked}));
			}

			if(card.badges.votes > 0){
				cardBadges.add(treeFactory.newCardBadge.votes(card.badges.votes));
			}

			if(!Utils.isEmpty(card.members) && card.members.length > 0){
				cardBadges.add(treeFactory.newCardBadge.members(card.members));
			}
		},

		newCardBadge : {
			due : function(badge){
				var opts = {};
				var dueDate = moment(badge);
				var now = moment().local();
				var diff = now.diff(dueDate,"hours", true);

				opts.value = dueDate.format('MMM DD');
				opts.iconClass = diff < 0 && diff > -25 ? 'due-soon' : diff <= 36 && diff >= 0 ? 'due-now' : diff > 36 ? 'past-due' : '';
				opts.title = opts.iconClass.length > 0 ? opts.iconClass.replace("-"," ") : 'Due on: '+opts.value;

				return new TreeView.Models.CardBadgeDue(opts);
			},
			attachments : function(badge){
				var opts = {};
				opts.value = badge;
				return new TreeView.Models.CardBadgeAttachment(opts);
			},
			checklist : function(badge){
				var opts = {};
				opts.value = ''+badge.checkItemsChecked+'/'+badge.checkItems+'';
				opts.iconClass = badge.checkItems - badge.checkItemsChecked == 0 ? 'checklist-complete' : '';
				return new TreeView.Models.CardBadgeChecklist(opts);
			},
			votes : function(badge){
				var opts = {};
				opts.value = badge;
				return new TreeView.Models.CardBadgeVote(opts);
			},
			members : function(item){
				var opts = {};
				opts.title = 'Members assigned: ';
				for(var member of item){
				   opts.title += member.fullName + ', ';
				}
				opts.title = opts.title.substring(0,opts.title.length-2);
				opts.value = item.length;

				return new TreeView.Models.CardBadgeMembers(opts);
			}
		}
	};

	var renderTheme = function(){
		return T.get('board', 'private', 'theme')
			.then(function(theme){
				if(!Utils.isEmpty(theme)){
					me._models.main.set('theme',theme)
				}
			});
	};

	var enableSortableLists = function(){
		if(Utils.isEmpty(me.authToken)){
			return Promise.resolve();
		}

		return new Promise(function(resolve){

			$('.subnodelist.node-type-board').sortable({
				placeholder: "list-card placeholder nodecontainer",
				connectWith: ".subnodelist.node-type-board",
				cursor: "move",
				tolerance: "intersect",
				start: function( event, ui ) {
					ui.placeholder.height(ui.item.height());
					var p  = ui.item.parents('.nodecontainer.node-type-board').eq(0);
					ui.item.toggleClass('grabbing',true)
						.data("prevPos",p.find('.nodecontainer.node-type-list').index(ui.item))
						;
				},
				stop: function( event, ui ) {
					ui.item.toggleClass('grabbing',false);
					var listModel = me._models.main.get('subnodes').at(0)
						.get('subnodes')
						.at(ui.item.data("prevPos"));
					updateListPosition(listModel,ui.item);
				}
			});

			resolve();
		});
	};

	var updateListPosition = function(listModel, list){

		var
            container = list.parents('.nodecontainer.node-type-board').eq(0),
            listInBoard = container.find('.nodecontainer.node-type-list'),
            newPos = listInBoard.index(list)
            ;


        if(list.data("prevPos") == newPos){
            return;
        }

        listModel.set('_loading',true);

        var
            leftListID = newPos > 0 ? Utils.getListDataTrelloId(listInBoard.eq(newPos-1)) : -1,
            rightListID = listInBoard.length === (newPos+1) ? -1 : Utils.getListDataTrelloId(listInBoard.eq(newPos+1)),
            listID = listModel.get('id'),
            leftListPos = -1,
            rightListPos = -1
            ;

		Utils.getListPos(leftListID)
		.then(function(pos){

			leftListPos = pos != -1 ? pos._value : -1;

			return Utils.getListPos(rightListID);
		}).then(function(pos){
			rightListPos = pos != -1 ? pos._value : -1;
			listID = listModel.get('id');
			newPos = calcPos(newPos,leftListPos, rightListPos);

			return new Promise((resolve, reject) => {
				resolve({
					'listID' : listID,
					'newPos' : newPos
				});
			});
		}).then(function(d){

			window.Trello.put("lists/" + d.listID+ "/?pos="+d.newPos+"&token=" + me.authToken,
			  //success
			  function(data){
			      listModel.set('_loading',false);
			      me._models.main.get('subnodes').at(0)
				  	.get('subnodes').move(listModel,listInBoard.index(list));
			      return data;
			  },
			  //error
			  function(reason){
			      listModel.set('_loading',false);
			      return reason;
			  }
			);
		});
	};

	var enableSortableCards = function(){
		if(Utils.isEmpty(me.authToken)){
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
						.data("prevListID",Utils.getListDataTrelloId(p))
						;
				},
				stop: function( event, ui ) {
					ui.item.toggleClass('grabbing',false);

					var cardModel = me._models.main.get('subnodes').at(0)
						.get('subnodes')
						.findWhere({'id': ui.item.data("prevListID")})
						.get('subnodes')
						.at(ui.item.data("prevPos"))
						;

					updateCardPosition(cardModel,ui.item);
				}
			});
			resolve();
		});
	};

	var updateCardPosition = function(cardModel, card){

		var
			container = card.parents('.nodecontainer.node-type-list').eq(0),
			cardsInList = container.find('.nodecontainer.node-type-card'),
			newPos = cardsInList.index(card),
			newList = Utils.getListDataTrelloId(container)
			;

		if(card.data("prevPos") == newPos && card.data("prevListID") == newList)
			return;

		cardModel.set('_loading',true);

		var
			leftCardID = newPos > 0 ? Utils.getCardDataTrelloId(cardsInList.eq(newPos-1)) : -1,
			rightCardID = cardsInList.length === (newPos+1) ? -1 : Utils.getCardDataTrelloId(cardsInList.eq(newPos+1)),
			cardID = cardModel.get('id'),
			leftCardPos = -1,
			rightCardPos = -1
			;


		Utils.getCardPos(leftCardID)
		.then(function(pos){

			leftCardPos = pos != -1 ? pos._value : -1;

			return Utils.getCardPos(rightCardID);
		}).then(function(pos){
			rightCardPos = pos != -1 ? pos._value : -1;
			cardID = cardModel.get('id');
			newPos = calcPos(newPos,leftCardPos, rightCardPos);

			return new Promise((resolve, reject) => {
				resolve({
					'cardID' : cardID,
					'newList' : newList,
					'newPos' : newPos
				});
			});
		}).then(function(d){

			window.Trello.put("cards/" + d.cardID+ "/?idList="+d.newList+"&pos="+d.newPos+"&token=" + me.authToken,
			  //success
			  function(data){
				  cardModel.set('_loading',false);

				  if(card.data("prevListID") == newList){
				  	me._models.main.get('subnodes').at(0)
						.get('subnodes').findWhere({'id': card.data("prevListID")})
						.get('subnodes')
						.move(cardModel,cardsInList.index(card));
				  }else{
				  	me._models.main.get('subnodes').at(0)
						.get('subnodes').findWhere({'id': card.data("prevListID")})
						.get('subnodes').remove(cardModel);

					me._models.main.get('subnodes').at(0)
						.get('subnodes').findWhere({'id': d.newList})
						.get('subnodes')
						.add(cardModel,{at: cardsInList.index(card), noAppend : true});

				  }


				  return data;
			  },
			  //error
			  function(reason){
				  cardModel.set('_loading',false);
				  return reason;
			  }
			);
		});
	};

	var Utils = {
		isEmpty : function(x){
			return (x === undefined || x === null || x.length == 0);
		},
		elemIsLoading : function(elem, isTrue){
			elem.toggleClass('loading',isTrue);
		},
		getListDataTrelloId : function(el){
			return el.find('.nodelink.node-type-list').eq(0).attr('data-trello-id');
		},
		getCardDataTrelloId : function(el){
			return el.find('.nodelink.node-type-card').eq(0).attr('data-trello-id');
		},
		getListPos : function(id){
			return new Promise((resolve, reject) => {
				if(id != -1){
					window.Trello.get("lists/" + id+ "/pos"+ "?"+ "&token=" + me.authToken,
						//success
						function(data){
							resolve(data);
						},
						//error
						function(reason){
							reject(reason);
						}
					);
				}else{
					resolve(id);
				}
			});
		},
		getCardPos : function(id){
			return new Promise((resolve, reject) => {
				if(id != -1){
					window.Trello.get("cards/" + id+ "/pos"+ "?"+ "&token=" + me.authToken,
						//success
						function(data){
							resolve(data);
						},
						//error
						function(reason){
							reject(reason);
						}
					);
				}else{
					resolve(id);
				}
			});
		},
	};

	var calcPos = function(newPos,leftPos,rightPos){
		var
			r = rightPos != -1 ? rightPos : 0,
			l = leftPos != -1 ? leftPos : 0 ,
			a = 65536
			;

		return (newPos==0) ? r/2 : (newPos == -1 || r == 0) ? l+a : (l+r)/2 ;
	};

	var updateTree = {
		intervalHolder : {},

		update : function(){

			updateTree.updateBoard()
			.then(updateTree.updateLists)
			.then(function(){
			});

		},

		updateBoard : function(){
			return T.board('all').then(function(board){
				if(Utils.isEmpty(board)){
					me._models.main.get('subnodes').at(0).trigger('destroy');
				}
			});
		},

		updateLists : function(){
			return Promise.all([
					T.lists('all'),
					T.get('board', 'private', 'expandupto'),
					T.get('board', 'private', 'showlabels'),
					T.get('board', 'private', 'showbadges')
				]).spread(function(lists, expandupto, showLabels, showBadges){

				var board = me._models.main.get('subnodes').at(0),
					boardLists = board.get('subnodes'),
					showLabels = Utils.isEmpty(showLabels) ? true : showLabels,
					showBadges = Utils.isEmpty(showBadges) ? true : showBadges
					;

				//deleted / moved list
				boardLists.forEach(function(listInBoard,listInBoardIndex){
					var pId = listInBoard.get('id');
					var listNewIndex = _.findIndex(lists,{ 'id': pId});

					//deleted list
					if(listNewIndex == -1){
						boardLists.remove(listInBoard);
						listInBoard.trigger('deleted');
					}

					//check for new lists
					for(var i = 0; i < lists.length; i++){
						var list = lists[i];

						if(Utils.isEmpty(boardLists.findWhere({'id':  list.id}))){

							//add new list to the board
							boardLists.add(
								treeFactory.newList(list, expandupto),
								{ at : i }
							);

							var boardListCards = boardLists.get({id : list.id}).get('subnodes');

							for(var card of list.cards){
								boardListCards.add(treeFactory.newCard(card, showlabels, showBadges));

								var newCard = boardListCards.get({id : card.id});

								if(showLabels){
									//labels
									treeFactory.addCardLabels(newCard, card.labels);
								}

								if(showBadges){
									//badges
									treeFactory.addCardBadges(newCard, card);
								}
							}
						}
					}

					//moved list
				 	if(listNewIndex > -1 && listNewIndex != listInBoardIndex){
						boardLists.add(listInBoard.clone(), { at : listNewIndex } );
						listInBoard.trigger('deleted');
					}
				});

			});
		},

		stop : function(){
			clearInterval(updateTree.intervalHolder);
		},

		start : function(){
			updateTree.intervalHolder = setInterval(_.throttle(updateTree.update, 1e4),3e3);
		}

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
			.then(updateTree.start)
			.then(function(){
				T.sizeTo('#maincontent');
			})
			;

		});

        me.status.init = true;
	};

	return me;
})(jQuery, TreeView);